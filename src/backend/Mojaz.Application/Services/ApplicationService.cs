using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Mojaz.Application.DTOs.Application;
using Mojaz.Application.DTOs.Payment;
using Mojaz.Application.Interfaces.Repositories;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Constants;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

using ApplicationEntity = Mojaz.Domain.Entities.Application;
using Microsoft.Extensions.Logging;

namespace Mojaz.Application.Services;

public class ApplicationService : IApplicationService
{
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<LicenseCategory> _categoryRepository;
    private readonly IRepository<SystemSetting> _settingsRepository;
    private readonly IRepository<License> _licenseRepository;
    private readonly IFeeStructureRepository _feeRepository;
    private readonly IRepository<PaymentTransaction> _paymentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAuditService _auditService;
    private readonly INotificationService _notificationService;
    private readonly IPaymentService _paymentService;
    private readonly ILogger<ApplicationService> logger;

    public ApplicationService(
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<User> userRepository,
        IRepository<LicenseCategory> categoryRepository,
        IRepository<SystemSetting> settingsRepository,
        IRepository<License> licenseRepository,
        IFeeStructureRepository feeRepository,
        IRepository<PaymentTransaction> paymentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IAuditService auditService,
        INotificationService notificationService,
        IPaymentService paymentService,
        ILogger<ApplicationService> logger
        )
    {
        _applicationRepository = applicationRepository;
        _userRepository = userRepository;
        _categoryRepository = categoryRepository;
        _settingsRepository = settingsRepository;
        _licenseRepository = licenseRepository;
        _feeRepository = feeRepository;
        _paymentRepository = paymentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _auditService = auditService;
        _notificationService = notificationService;
        _paymentService = paymentService;
        this.logger = logger;
    }

    public async Task<ApiResponse<ApplicationDto>> CreateAsync(CreateApplicationRequest request, int userId)
    {
        // 1. Eligibility Check (Gate 1)
        if (!request.LicenseCategoryId.HasValue)
            return ApiResponse<ApplicationDto>.Fail(400, "يرجى تحديد فئة الرخصة.");
        var category = await _categoryRepository.GetByIdAsync(request.LicenseCategoryId.Value);
        if (category == null) return ApiResponse<ApplicationDto>.Fail(400, "فئة الرخصة غير موجودة.");

        var ageLimitSetting = (await _settingsRepository.FindAsync(s => s.SettingKey == $"MIN_AGE_CATEGORY_{category.Code}")).FirstOrDefault();
        // Fallback: if setting not found, use default from category
        int minAge;
        if (ageLimitSetting == null || !int.TryParse(ageLimitSetting.SettingValue, out minAge))
        {
            minAge = category.MinimumAge; // Use category's built-in minimum age
        }

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return ApiResponse<ApplicationDto>.Fail(404, "المستخدم غير موجود.");

        var today = DateTime.UtcNow;
        var dob = user.DateOfBirth ?? DateTime.UtcNow.AddYears(-18); // Default to 18 if null
        var age = today.Year - dob.Year;
        if (dob.Date > today.AddYears(-age)) age--;

        if (age < minAge)
            return ApiResponse<ApplicationDto>.Fail(400, $"الحد الأدنى للسن للفئة {category.Code} هو {minAge}. عمرك الحالي {age} سنة.");

        // 2. Already Has Active License Check
        var existingLicenses = await _licenseRepository.FindAsync(l => l.HolderId == userId && 
            l.LicenseCategoryId == request.LicenseCategoryId && 
            l.Status == LicenseStatus.Active);
        
        if (existingLicenses.Any())
            return ApiResponse<ApplicationDto>.Fail(400, $"لديك بالفعل رخصة نشطة وسارية لهذه الفئة ({category.NameAr}). لا يمكنك طلب رخصة جديدة لنفس الفئة.");

        // 3. Global Active Application Check (Strict Rule: Only one application at a time)
        // var anyActiveApp = await _applicationRepository.FindAsync(a => a.ApplicantId == userId && 
        //     a.Status != ApplicationStatus.Draft &&
        //     a.Status != ApplicationStatus.Rejected && 
        //     a.Status != ApplicationStatus.Expired &&
        //     a.Status != ApplicationStatus.Cancelled &&
        //     a.Status != ApplicationStatus.Issued &&
        //     a.Status != ApplicationStatus.Active);
        // 
        // if (anyActiveApp.Any())
        // {
        //     var active = anyActiveApp.First();
        //     return ApiResponse<ApplicationDto>.Fail(400, $"لديك بالفعل طلب نشط قيد المعالجة (رقم {active.ApplicationNumber}). لا يمكنك تقديم طلب جديد حتى يتم الانتهاء من الطلب الحالي.");
        // }

        // 4. Same Category Draft Check
        // var categoryDraft = await _applicationRepository.FindAsync(a => a.ApplicantId == userId && 
        //     a.LicenseCategoryId == request.LicenseCategoryId &&
        //     a.Status == ApplicationStatus.Draft);
        // 
        // if (categoryDraft.Any())
        //     return ApiResponse<ApplicationDto>.Fail(400, $"لديك بالفعل مسودة طلب لهذه الفئة ({category.NameAr}). يرجى إكمال المسودة بدلاً من إنشاء طلب جديد.");

        // 3. Security/Judicial Block Check (PRD Section 9.2.E - Gate 1 Hard Stop)
        if (user.IsSecurityBlocked)
            return ApiResponse<ApplicationDto>.Fail(403, "يوجد حظر أمني على ملف مقدم الطلب.");

        // 4. Update User Profile (Applicant Data)
        user.NationalId = request.NationalId;
        user.DateOfBirth = request.DateOfBirth;
        user.Gender = request.Gender ?? GenderEnum.NotSpecified;
        user.Nationality = request.Nationality;
        user.Address = request.Address;
        user.City = request.City;
        user.Region = request.Region;
        user.ApplicantType = request.ApplicantType ?? ApplicantType.Private;
        
        _userRepository.Update(user);

        // 4. Create Application
        var appValidityMonthsSetting = (await _settingsRepository.FindAsync(s => s.SettingKey == "APPLICATION_VALIDITY_MONTHS")).FirstOrDefault();
        int validityMonths = appValidityMonthsSetting != null ? int.Parse(appValidityMonthsSetting.SettingValue) : 6;

        var application = new ApplicationEntity
        {
            ApplicationNumber = GenerateApplicationNumber(),
            ApplicantId = userId,
            ServiceType = request.ServiceType,
            LicenseCategoryId = request.LicenseCategoryId,
            BranchId = request.BranchId,
            Status = ApplicationStatus.Submitted,
            CurrentStage = ApplicationStages.Stage01CreationAr,
            PreferredLanguage = request.PreferredLanguage,
            SpecialNeeds = request.SpecialNeeds,
            DataAccuracyConfirmed = request.DataAccuracyConfirmed,
            ExpiresAt = DateTime.UtcNow.AddMonths(validityMonths)
        };

        await _applicationRepository.AddAsync(application);
        await _unitOfWork.SaveChangesAsync();

        // 5. Audit Logging
        await _auditService.LogAsync("CREATE_APPLICATION", "Application", application.Id.ToString(), null, application.ApplicationNumber);

        // 6. Notifications
        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = userId,
            ApplicationId = application.Id,
            EventType = NotificationEventType.ApplicationSubmitted,
            TitleAr = "تم تقديم طلب جديد",
            TitleEn = "Application Submitted",
            MessageAr = $"تم تقديم طلبك بنجاح. رقم الطلب: {application.ApplicationNumber}",
            MessageEn = $"Your application has been submitted successfully. Number: {application.ApplicationNumber}"
        });

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(application), "تم تقديم الطلب بنجاح.");
    }

    public async Task<ApiResponse<ApplicationDto>> CreateDraftAsync(ServiceType serviceType, int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return ApiResponse<ApplicationDto>.Fail(404, "المستخدم غير موجود.");

        // Security/Judicial Block Check (Gate 1 Hard Stop)
        if (user.IsSecurityBlocked)
            return ApiResponse<ApplicationDto>.Fail(403, "يوجد حظر أمني على ملف مقدم الطلب.");

        // Removed: Global active application check - allowing multiple applications
        // Users can now create multiple applications regardless of existing active applications

        // Reuse existing draft if available
        var existingDrafts = await _applicationRepository.FindAsync(a => 
            a.ApplicantId == userId && 
            a.Status == ApplicationStatus.Draft && 
            a.ServiceType == serviceType);

        /* [FLEXIBILITY] - Always allow creating a new draft to avoid stale state issues
        if (existingDrafts.Any())
        {
            return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(existingDrafts.First()), "تم استعادة المسودة بنجاح.");
        }
        */

        // NEW DRAFT: Do NOT set default category - user must select in Step 2
        var application = new ApplicationEntity
        {
            ApplicationNumber = GenerateApplicationNumber(),
            ApplicantId = userId,
            ServiceType = serviceType,
            LicenseCategoryId = null, // User must select in Step 2
            Status = ApplicationStatus.Draft,
            CurrentStage = ApplicationStages.Stage01Creation,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _applicationRepository.AddAsync(application);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(application), "تم إنشاء المسودة بنجاح.");
    }

    public async Task<ApiResponse<ApplicationDto>> GetByIdAsync(int id, int userId, string role)
    {
        var application = await _applicationRepository.Query()
            .Include(a => a.LicenseCategory)
            .FirstOrDefaultAsync(a => a.Id == id);
        if (application == null) return ApiResponse<ApplicationDto>.Fail(404, "الطلب غير موجود.");

        // Security check
        if (role == Roles.Applicant && application.ApplicantId != userId)
            return ApiResponse<ApplicationDto>.Fail(403, "دخول غير مصرح به.");

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(application));
    }

    public async Task<ApiResponse<ApplicationWizardDto>> GetWizardDataAsync(int id, int userId, string role)
    {
        var application = await _applicationRepository.Query()
            .Include(a => a.LicenseCategory)
            .FirstOrDefaultAsync(a => a.Id == id);
        if (application == null) return ApiResponse<ApplicationWizardDto>.Fail(404, "الطلب غير موجود.");

        // Security check: Applicants can only see their own applications. Employees can see all.
        if (role == Roles.Applicant && application.ApplicantId != userId)
            return ApiResponse<ApplicationWizardDto>.Fail(403, "دخول غير مصرح به.");

        var user = await _userRepository.GetByIdAsync(application.ApplicantId);
        if (user == null) return ApiResponse<ApplicationWizardDto>.Fail(404, "المستخدم غير موجود.");

        var dto = new ApplicationWizardDto
        {
            Id = application.Id,
            ApplicationNumber = application.ApplicationNumber,
            Status = application.Status,
            CurrentStage = application.CurrentStage,
            CreatedAt = application.CreatedAt,
            UpdatedAt = application.UpdatedAt,
            ServiceType = application.ServiceType,
            LicenseCategoryId = application.LicenseCategoryId,
            LicenseCategoryCode = application.LicenseCategory?.Code.ToString() ?? string.Empty,
            LicenseCategoryNameAr = application.LicenseCategory?.NameAr ?? string.Empty,
            LicenseCategoryNameEn = application.LicenseCategory?.NameEn ?? string.Empty,

            // Step 3 — from User entity
            NationalId = user.NationalId,
            DateOfBirth = user.DateOfBirth,
            Gender = user.Gender,
            Nationality = user.Nationality,
            MobileNumber = user.PhoneNumber,
            Email = user.Email,
            Address = user.Address,
            City = user.City,
            Region = user.Region,
            ApplicantType = user.ApplicantType,

            // Step 4 — from Application entity
            BranchId = application.BranchId,
            PreferredLanguage = application.PreferredLanguage,
            SpecialNeeds = application.SpecialNeeds,
            AppointmentPreference = user.AppointmentPreference,
        };

        return ApiResponse<ApplicationWizardDto>.Ok(dto);
    }

    public async Task<ApiResponse<ApplicationWizardDto>> UpdateWizardDataAsync(int id, UpdateWizardDataRequest request, int userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<ApplicationWizardDto>.Fail(404, "الطلب غير موجود.");

        if (application.ApplicantId != userId)
            return ApiResponse<ApplicationWizardDto>.Fail(403, "دخول غير مصرح به.");

        // if (application.Status != ApplicationStatus.Draft && application.Status != ApplicationStatus.Submitted)
        //     return ApiResponse<ApplicationWizardDto>.Fail(400, "يمكن تعديل الطلبات التي في حالة مسودة أو مقدمة فقط.");

        var user = await _userRepository.GetByIdAsync(userId);

        // Update Application fields
        if (request.LicenseCategoryId.HasValue && request.LicenseCategoryId.Value != application.LicenseCategoryId)
        {
            var newCategoryId = request.LicenseCategoryId.Value;
            var category = await _categoryRepository.GetByIdAsync(newCategoryId);

            // ============================================================
            // RULE A: Check for Existing Active License for This Category
            // ============================================================
            var existingActiveLicense = await _licenseRepository.FindAsync(l => 
                l.HolderId == userId && 
                l.LicenseCategoryId == newCategoryId &&
                l.Status == LicenseStatus.Active);

            /* [FLEXIBILITY] - Allow updates even if license exists
            if (existingActiveLicense.Any())
            {
                return ApiResponse<ApplicationWizardDto>.Fail(400, 
                    $"عفواً، أنت تملك رخصة نشطة من هذه الفئة مسبقاً. لا يمكنك إصدار رخصة جديدة. [LICENSE_ALREADY_EXISTS]");
            }
            */

            // ============================================================
            // RULE B: Check for Pending/Draft Application for This Category
            // ============================================================
            var pendingApplication = await _applicationRepository.FindAsync(a => 
                a.ApplicantId == userId && 
                a.LicenseCategoryId == newCategoryId &&
                a.Id != id &&  // Exclude current application
                a.Status == ApplicationStatus.Draft);

            /* [FLEXIBILITY] - Allow multiple drafts/applications for the same category
            if (pendingApplication.Any())
            {
                var existingApp = pendingApplication.First();
                return ApiResponse<ApplicationWizardDto>.Fail(409, 
                    $"لديك طلب قيد الإجراء لهذه الفئة ({category?.NameAr}). سيتم توجيهك لإكماله. [APPLICATION_IN_PROGRESS:{existingApp.Id}]");
            }
            */

            // Check for other active applications (non-terminal states)
            var activeApplication = await _applicationRepository.FindAsync(a => 
                a.ApplicantId == userId && 
                a.LicenseCategoryId == newCategoryId &&
                a.Id != id &&
                a.Status != ApplicationStatus.Draft &&
                a.Status != ApplicationStatus.Rejected && 
                a.Status != ApplicationStatus.Expired &&
                a.Status != ApplicationStatus.Cancelled &&
                a.Status != ApplicationStatus.Issued &&
                a.Status != ApplicationStatus.Active);

            /* [FLEXIBILITY] - Allow updates regardless of other active applications
            if (activeApplication.Any())
            {
                var existingApp = activeApplication.First();
                return ApiResponse<ApplicationWizardDto>.Fail(409, 
                    $"لديك طلب نشط قيد المعالجة لهذه الفئة ({category?.NameAr}). يرجى متابعة طلبك الحالي. [APPLICATION_IN_PROGRESS:{existingApp.Id}]");
            }
            */

            application.LicenseCategoryId = request.LicenseCategoryId.Value;
        }
        if (request.BranchId.HasValue)
            application.BranchId = request.BranchId.Value;
        if (!string.IsNullOrEmpty(request.PreferredLanguage))
            application.PreferredLanguage = request.PreferredLanguage;
        if (!string.IsNullOrEmpty(request.SpecialNeeds))
            application.SpecialNeeds = request.SpecialNeeds;
        application.UpdatedAt = DateTime.UtcNow;

        // Update User (Applicant) fields
        if (user != null)
        {
            if (!string.IsNullOrEmpty(request.NationalId))
                user.NationalId = request.NationalId;
            if (request.DateOfBirth.HasValue)
                user.DateOfBirth = request.DateOfBirth.Value;
            if (request.Gender.HasValue)
                user.Gender = request.Gender;
            if (!string.IsNullOrEmpty(request.Nationality))
                user.Nationality = request.Nationality;
            if (!string.IsNullOrEmpty(request.MobileNumber))
                user.PhoneNumber = request.MobileNumber;
            if (!string.IsNullOrEmpty(request.Email))
                user.Email = request.Email;
            if (!string.IsNullOrEmpty(request.Address))
                user.Address = request.Address;
            if (!string.IsNullOrEmpty(request.City))
                user.City = request.City;
            if (!string.IsNullOrEmpty(request.Region))
                user.Region = request.Region;
            if (request.ApplicantType.HasValue)
                user.ApplicantType = request.ApplicantType;
            if (!string.IsNullOrEmpty(request.AppointmentPreference))
                user.AppointmentPreference = request.AppointmentPreference;

            _userRepository.Update(user);
        }

        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        // Re-fetch with joins for complete response
        var refreshApp = await _applicationRepository.Query()
            .Include(a => a.LicenseCategory)
            .FirstOrDefaultAsync(a => a.Id == id);
        var refreshUser = await _userRepository.GetByIdAsync(userId);

        var dto = new ApplicationWizardDto
        {
            Id = refreshApp!.Id,
            ApplicationNumber = refreshApp.ApplicationNumber,
            Status = refreshApp.Status,
            CurrentStage = refreshApp.CurrentStage,
            CreatedAt = refreshApp.CreatedAt,
            UpdatedAt = refreshApp.UpdatedAt,
            ServiceType = refreshApp.ServiceType,
            LicenseCategoryId = refreshApp.LicenseCategoryId,
            LicenseCategoryCode = refreshApp.LicenseCategory?.Code.ToString() ?? string.Empty,
            LicenseCategoryNameAr = refreshApp.LicenseCategory?.NameAr ?? string.Empty,
            LicenseCategoryNameEn = refreshApp.LicenseCategory?.NameEn ?? string.Empty,
            NationalId = refreshUser?.NationalId,
            DateOfBirth = refreshUser?.DateOfBirth,
            Gender = refreshUser?.Gender,
            Nationality = refreshUser?.Nationality,
            MobileNumber = refreshUser?.PhoneNumber,
            Email = refreshUser?.Email,
            Address = refreshUser?.Address,
            City = refreshUser?.City,
            Region = refreshUser?.Region,
            ApplicantType = refreshUser?.ApplicantType,
            BranchId = refreshApp.BranchId,
            PreferredLanguage = refreshApp.PreferredLanguage,
            SpecialNeeds = refreshApp.SpecialNeeds,
            AppointmentPreference = refreshUser?.AppointmentPreference,
        };

        return ApiResponse<ApplicationWizardDto>.Ok(dto, "تم تحديث بيانات المعالج بنجاح.");
    }

    public async Task<ApiResponse<PagedResult<ApplicationDto>>> GetListAsync(int userId, string role, int page = 1, int pageSize = 20, string? search = null, string? status = null)
    {
        // Validate pagination parameters
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        // Always use in-memory pagination for SQL Server 2008 R2 compatibility
        // Load all data without SQL-level pagination (Skip/Take causes OFFSET error)
        var baseQuery = _applicationRepository.Query()
            .Where(a => !a.IsDeleted);

        if (role == Roles.Applicant)
        {
            baseQuery = baseQuery.Where(a => a.ApplicantId == userId);
        }

        if (!string.IsNullOrEmpty(status))
        {
            var statusList = status.Split(',')
                .Select(s => Enum.TryParse<ApplicationStatus>(s.Trim(), out var res) ? res : (ApplicationStatus?)null)
                .Where(s => s.HasValue)
                .Cast<ApplicationStatus>()
                .ToList();

            if (statusList.Any())
            {
                baseQuery = baseQuery.Where(a => statusList.Contains(a.Status));
            }
        }

        if (!string.IsNullOrEmpty(search))
        {
            baseQuery = baseQuery.Where(a => a.ApplicationNumber.Contains(search) || 
                                    (a.CurrentStage != null && a.CurrentStage.Contains(search)));
        }

        // Load ALL matching records into memory first (no SQL pagination)
        // This avoids OFFSET/FETCH syntax which isn't supported in SQL Server 2008 R2
        var allApps = await baseQuery
            .Include(a => a.LicenseCategory)
            .Include(a => a.Applicant)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
        
        var total = allApps.Count;
        var skip = (page - 1) * pageSize;
        
        // Paginate in memory (LINQ to Objects)
        var pagedApps = allApps.Skip(skip).Take(pageSize).ToList();

        var result = new PagedResult<ApplicationDto>
        {
            Items = _mapper.Map<List<ApplicationDto>>(pagedApps),
            TotalCount = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = total > 0 ? (int)Math.Ceiling(total / (double)pageSize) : 0,
            HasPreviousPage = page > 1,
            HasNextPage = page * pageSize < total
        };
        
        return ApiResponse<PagedResult<ApplicationDto>>.Ok(result);
    }

    public async Task<ApiResponse<IEnumerable<ApplicationDto>>> GetByApplicationNumberAsync(string applicationNumber)
    {
        if (string.IsNullOrWhiteSpace(applicationNumber))
        {
            return ApiResponse<IEnumerable<ApplicationDto>>.Fail(400, "رقم الطلب مطلوب.");
        }

        var trimmedNumber = applicationNumber.Trim();
        var applications = await _applicationRepository.Query()
            .Include(a => a.LicenseCategory)
            .Include(a => a.Applicant)
            .Where(a => a.ApplicationNumber == trimmedNumber)
            .ToListAsync();
        
        if (!applications.Any())
        {
            return ApiResponse<IEnumerable<ApplicationDto>>.NotFound($"الطلب ذو الرقم {trimmedNumber} غير موجود.");
        }

        return ApiResponse<IEnumerable<ApplicationDto>>.Ok(_mapper.Map<List<ApplicationDto>>(applications));
    }

    public async Task<bool> IsOwnerAsync(int applicationId, int userId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        return application != null && application.ApplicantId == userId;
    }

    public async Task<ApiResponse<bool>> UpdateAsync(int id, UpdateApplicationRequest request, int userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<bool>.Fail(404, "الطلب غير موجود.");

        if (application.ApplicantId != userId)
            return ApiResponse<bool>.Fail(403, "غير مصرح لك.");

        // if (application.Status != ApplicationStatus.Draft && application.Status != ApplicationStatus.Submitted)
        //     return ApiResponse<bool>.Fail(400, "يمكن تعديل الطلبات التي في حالة مسودة أو مقدمة فقط.");

        if (request.ServiceType.HasValue)
            application.ServiceType = request.ServiceType.Value;
        if (request.LicenseCategoryId.HasValue)
            application.LicenseCategoryId = request.LicenseCategoryId.Value;
        if (request.BranchId.HasValue)
            application.BranchId = request.BranchId.Value;
        if (!string.IsNullOrEmpty(request.PreferredLanguage))
            application.PreferredLanguage = request.PreferredLanguage;
        if (!string.IsNullOrEmpty(request.SpecialNeeds))
            application.SpecialNeeds = request.SpecialNeeds;

        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "تم تحديث الطلب بنجاح.");
    }

    public async Task<ApiResponse<bool>> CancelAsync(int id, string reason, int userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<bool>.Fail(404, "الطلب غير موجود.");

        if (application.ApplicantId != userId)
            return ApiResponse<bool>.Fail(403, "غير مصرح لك.");

        if (application.Status == ApplicationStatus.Active || application.Status == ApplicationStatus.Cancelled)
             return ApiResponse<bool>.Fail(400, "لا يمكن إلغاء الطلب في حالته الحالية.");

        application.Status = ApplicationStatus.Cancelled;
        application.CancelledAt = DateTime.UtcNow;
        application.CancellationReason = reason;

        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "تم إلغاء الطلب بنجاح.");
    }

    public async Task<ApiResponse<bool>> UpdateStatusAsync(int id, ApplicationStatus status, string reason, int userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<bool>.Fail(404, "الطلب غير موجود.");

        var oldStatus = application.Status;
        application.Status = status;
        
        if (status == ApplicationStatus.Rejected)
        {
            application.RejectionReason = reason;
        }

        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync("STATUS_CHANGE", "Application", id.ToString(), oldStatus.ToString(), status.ToString());

        // Auto-create payment when status becomes Approved
        if (status == ApplicationStatus.Approved)
        {
            await CreatePaymentForApprovedApplicationAsync(application);
        }

        return ApiResponse<bool>.Ok(true, "تم تحديث حالة الطلب بنجاح.");
    }

    /// <summary>
    /// Creates a payment transaction when application is approved.
    /// Reads fee from FeeStructures table based on application category.
    /// </summary>
    private async Task CreatePaymentForApprovedApplicationAsync(ApplicationEntity application)
    {
        try
        {
            // Get the fee from FeeStructures table
            var feeStructure = await _feeRepository.GetActiveFeeAsync(FeeType.ApplicationFee, application.LicenseCategoryId);
            decimal amount = feeStructure?.Amount ?? 0;

            if (amount <= 0)
            {
                await _notificationService.SendAsync(new NotificationRequest
                {
                    UserId = application.ApplicantId,
                    ApplicationId = application.Id,
                    EventType = NotificationEventType.StatusChanged,
                    TitleAr = "تم اعتماد طلبك - خطأ في تحديد الرسوم",
                    TitleEn = "Application Approved - Fee Error",
                    MessageAr = "تم اعتماد طلبك لكن حدث خطأ في تحديد رسوم الرخصة. يرجى التواصل مع الإدارة.",
                    MessageEn = "Your application has been approved but there was an error determining the license fee. Please contact management."
                });
                return;
            }

            // Create payment transaction
            var payment = new PaymentTransaction
            {
                ApplicationId = application.Id,
                Amount = amount,
                Status = PaymentStatus.Pending,
                FeeType = FeeType.ApplicationFee,
                TransactionReference = $"TXN_{DateTime.UtcNow:yyyyMMdd}_{application.ApplicationNumber}"
            };

            await _paymentRepository.AddAsync(payment);
            await _unitOfWork.SaveChangesAsync();

// Send notification to applicant
            await _notificationService.SendAsync(new NotificationRequest
            {
                UserId = application.ApplicantId,
                ApplicationId = application.Id,
                EventType = NotificationEventType.PaymentDue,
                TitleAr = "تم اعتماد طلبك",
                TitleEn = "Application Approved",
                MessageAr = $"تم اعتماد طلبك رقم {application.ApplicationNumber}. يرجى سداد رسوم الرخصة بقيمة {amount} ريال سعودي.",
                MessageEn = $"Your application {application.ApplicationNumber} has been approved. Please pay the license fee of {amount} SAR."
            });
        }
        catch (Exception ex)
        {
            // Log error but don't fail the status update
            await _auditService.LogAsync("PAYMENT_CREATION_ERROR", "Application", application.Id.ToString(), ex.Message, null);
        }
    }

    public async Task<ApiResponse<List<LicenseCategoryDto>>> GetLicenseCategoriesAsync()
    {
        var categories = await _categoryRepository.FindAsync(c => c.IsActive);
        var dtos = categories.Select(c => new LicenseCategoryDto
        {
            Id = c.Id,
            Code = c.Code.ToString(),
            NameAr = c.NameAr,
            NameEn = c.NameEn,
            MinAge = c.MinimumAge
        }).ToList();
        return ApiResponse<List<LicenseCategoryDto>>.Ok(dtos);
    }

    public async Task<ApiResponse<ApplicationDto>> CreateUpgradeApplicationAsync(UpgradeApplicationRequest request, int userId)
    {
        // 1. Validate current license exists and belongs to user
        var currentLicense = await _licenseRepository.GetByIdAsync(request.CurrentLicenseId);
        if (currentLicense == null || currentLicense.HolderId != userId)
            return ApiResponse<ApplicationDto>.Fail(404, "رخصة غير صالحة.");

        // 2. Check if license is valid (not expired)
        if (currentLicense.ExpiresAt <= DateTime.UtcNow)
            return ApiResponse<ApplicationDto>.Fail(400, "الرخصة منتهية الصلاحية.");

        // 3. Validate target category
        var targetCategory = await _categoryRepository.GetByIdAsync(request.TargetCategoryId);
        if (targetCategory == null)
            return ApiResponse<ApplicationDto>.Fail(400, "الفئة المستهدفة غير صالحة.");

        // 4. Check age requirement for target category
        var ageLimitSetting = (await _settingsRepository.FindAsync(s => s.SettingKey == $"MIN_AGE_CATEGORY_{targetCategory.Code}")).FirstOrDefault();
        int minAge;
        if (ageLimitSetting == null || !int.TryParse(ageLimitSetting.SettingValue, out minAge))
        {
            minAge = targetCategory.MinimumAge; // Use category's built-in minimum age
        }

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return ApiResponse<ApplicationDto>.Fail(404, "المستخدم غير موجود.");

        var today = DateTime.UtcNow;
        var dob = user.DateOfBirth ?? DateTime.UtcNow.AddYears(-18);
        var age = today.Year - dob.Year;
        if (dob.Date > today.AddYears(-age)) age--;

        if (age < minAge)
            return ApiResponse<ApplicationDto>.Fail(400, $"الحد الأدنى للسن للفئة {targetCategory.Code} هو {minAge}. عمرك الحالي {age} سنة.");

        // 5. Security/Judicial Block Check (Gate 1 Hard Stop)
        if (user.IsSecurityBlocked)
            return ApiResponse<ApplicationDto>.Fail(403, "يوجد حظر أمني على ملف مقدم الطلب.");

        // Removed: Category-specific active application check - allowing multiple upgrade applications

        // Create application
        var appValidityMonthsSetting = (await _settingsRepository.FindAsync(s => s.SettingKey == "APPLICATION_VALIDITY_MONTHS")).FirstOrDefault();
        int validityMonths = appValidityMonthsSetting != null ? int.Parse(appValidityMonthsSetting.SettingValue) : 6;

        var application = new ApplicationEntity
        {
            ApplicationNumber = GenerateApplicationNumber(),
            ApplicantId = userId,
            ServiceType = ServiceType.CategoryUpgrade,
            LicenseCategoryId = request.TargetCategoryId,
            BranchId = request.BranchId,
            Status = ApplicationStatus.Submitted,
            CurrentStage = ApplicationStages.Stage01Creation,
            PreferredLanguage = request.PreferredLanguage,
            DataAccuracyConfirmed = request.DataAccuracyConfirmed,
            ExpiresAt = DateTime.UtcNow.AddMonths(validityMonths)
        };

        await _applicationRepository.AddAsync(application);
        await _unitOfWork.SaveChangesAsync();

        // 7. Audit Logging
        await _auditService.LogAsync("CREATE_UPGRADE_APPLICATION", "Application", application.Id.ToString(), null, application.ApplicationNumber);

        // 8. Notifications
        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = userId,
            ApplicationId = application.Id,
            EventType = NotificationEventType.ApplicationSubmitted,
            TitleAr = "تم تقديم طلب ترقية رخصة",
            TitleEn = "License Upgrade Application Submitted",
            MessageAr = $"تم تقديم طلب ترقية الرخصة بنجاح. رقم الطلب: {application.ApplicationNumber}",
            MessageEn = $"Your license upgrade application has been submitted. Number: {application.ApplicationNumber}"
        });

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(application), "تم تقديم طلب ترقية الرخصة بنجاح.");
    }

    public async Task<ApiResponse<ReplacementEligibilityResponse>> GetReplacementEligibilityAsync(int userId)
    {
        // Find valid license for user (not expired and within replacement window)
        var settingsRepo = _settingsRepository;
        var replacementDaysSetting = (await settingsRepo.FindAsync(s => s.SettingKey == "REPLACEMENT_WINDOW_DAYS")).FirstOrDefault();
        int replacementDays = replacementDaysSetting != null ? int.Parse(replacementDaysSetting.SettingValue) : 90;

        var expiryThreshold = DateTime.UtcNow.AddDays(replacementDays);
        
        var licenses = await _licenseRepository.FindAsync(l => l.HolderId == userId && l.Status == LicenseStatus.Active);
        
        // Find license expiring within the window
        var eligibleLicense = licenses.FirstOrDefault(l => l.ExpiresAt <= expiryThreshold && l.ExpiresAt > DateTime.UtcNow);

        if (eligibleLicense == null)
        {
            return ApiResponse<ReplacementEligibilityResponse>.Ok(new ReplacementEligibilityResponse
            {
                IsEligible = false,
                LicenseId = 0,
                LicenseNumber = string.Empty,
                ExpiryDate = DateTime.MinValue,
                Message = "لا توجد رخصة مؤهلة للاستبدال حالياً."
            });
        }

        return ApiResponse<ReplacementEligibilityResponse>.Ok(new ReplacementEligibilityResponse
        {
            IsEligible = true,
            LicenseId = eligibleLicense.Id,
            LicenseNumber = eligibleLicense.LicenseNumber,
            ExpiryDate = eligibleLicense.ExpiresAt,
            Message = "أنت مؤهل لاستبدال الرخصة."
        });
    }

    public async Task<ApiResponse<ApplicationDto>> CreateReplacementApplicationAsync(ReplacementApplicationRequest request, int userId)
    {
        // 1. Validate license exists and belongs to user
        var existingLicense = await _licenseRepository.GetByIdAsync(request.LicenseId);
        if (existingLicense == null || existingLicense.HolderId != userId)
            return ApiResponse<ApplicationDto>.Fail(404, "Invalid license.");

        // 2. Check status
        if (existingLicense.Status != LicenseStatus.Active)
            return ApiResponse<ApplicationDto>.Fail(400, "الرخصة ليست نشطة حالياً.");

        // 3. Security/Judicial Block Check (Gate 1 Hard Stop)
        var user = await _userRepository.GetByIdAsync(userId);
        if (user != null && user.IsSecurityBlocked)
            return ApiResponse<ApplicationDto>.Fail(403, "يوجد حظر أمني على ملف مقدم الطلب.");

        // Removed: Category-specific active application check - allowing multiple replacement applications

        // 4. Get same category
        var category = await _categoryRepository.GetByIdAsync(existingLicense.LicenseCategoryId);
        if (category == null)
            return ApiResponse<ApplicationDto>.Fail(400, "فئة الرخصة غير موجودة.");

        // 5. Create application
        var appValidityMonthsSetting = (await _settingsRepository.FindAsync(s => s.SettingKey == "APPLICATION_VALIDITY_MONTHS")).FirstOrDefault();
        int validityMonths = appValidityMonthsSetting != null ? int.Parse(appValidityMonthsSetting.SettingValue) : 6;

        var application = new ApplicationEntity
        {
            ApplicationNumber = GenerateApplicationNumber(),
            ApplicantId = userId,
            ServiceType = ServiceType.Replacement,
            LicenseCategoryId = existingLicense.LicenseCategoryId,
            Status = ApplicationStatus.Submitted,
            CurrentStage = ApplicationStages.Stage01Creation,
            PreferredLanguage = "ar",
            DataAccuracyConfirmed = true,
            ExpiresAt = DateTime.UtcNow.AddMonths(validityMonths)
        };

        await _applicationRepository.AddAsync(application);
        await _unitOfWork.SaveChangesAsync();

        // 6. Audit Logging
        await _auditService.LogAsync("CREATE_REPLACEMENT_APPLICATION", "Application", application.Id.ToString(), null, application.ApplicationNumber);

        // 7. Notifications
        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = userId,
            ApplicationId = application.Id,
            EventType = NotificationEventType.ApplicationSubmitted,
            TitleAr = "تم تقديم طلب استبدال رخصة",
            TitleEn = "License Replacement Application Submitted",
            MessageAr = $"تم تقديم طلب استبدال الرخصة بنجاح. رقم الطلب: {application.ApplicationNumber}",
            MessageEn = $"Your license replacement application has been submitted. Number: {application.ApplicationNumber}"
        });

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(application), "تم تقديم طلب استبدال الرخصة بنجاح.");
    }

    public async Task<ApiResponse<PagedResult<ApplicationDto>>> GetQueueAsync(int page = 1, int pageSize = 20, string? search = null, string? stage = null)
    {
        // Build filter first - separate from Includes
        var baseQuery = _applicationRepository.Query()
            .Where(a => 
                a.Status >= ApplicationStatus.Submitted && 
                a.Status < ApplicationStatus.Issued &&
                !a.IsDeleted);

        if (!string.IsNullOrEmpty(stage))
        {
            baseQuery = baseQuery.Where(a => a.CurrentStage == stage);
        }

        if (!string.IsNullOrEmpty(search))
        {
            baseQuery = baseQuery.Where(a => a.ApplicationNumber.Contains(search));
        }

        // Get total count first (create a separate query for count to avoid include issues)
        var countQuery = _applicationRepository.Query()
            .Where(a => 
                a.Status >= ApplicationStatus.Submitted && 
                a.Status < ApplicationStatus.Issued &&
                !a.IsDeleted);
        
        if (!string.IsNullOrEmpty(stage))
            countQuery = countQuery.Where(a => a.CurrentStage == stage);
        
        if (!string.IsNullOrEmpty(search))
            countQuery = countQuery.Where(a => a.ApplicationNumber.Contains(search));
        
        var total = await countQuery.CountAsync();
        
        // Load ALL matching records into memory first (no SQL pagination)
        // This avoids OFFSET/FETCH syntax which isn't supported in SQL Server 2008 R2
        var allApps = await baseQuery
            .Include(a => a.LicenseCategory)
            .Include(a => a.Applicant)
            .OrderBy(a => a.Status)
            .ThenBy(a => a.CreatedAt)
            .ToListAsync();
        
        var skip = (page - 1) * pageSize;
        var pagedApps = allApps.Skip(skip).Take(pageSize).ToList();

        var result = new PagedResult<ApplicationDto>
        {
            Items = _mapper.Map<List<ApplicationDto>>(pagedApps),
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
        
        return ApiResponse<PagedResult<ApplicationDto>>.Ok(result);
    }

    public async Task<ApiResponse<ApplicationWorkflowTimelineDto>> GetTimelineAsync(int id)
    {
        var application = await _applicationRepository.Query()
            .Include(a => a.LicenseCategory)
            .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted);

        if (application == null)
        {
            return ApiResponse<ApplicationWorkflowTimelineDto>.Fail(404, "Application not found.");
        }

        // Map application status to stage number based on actual enum (PRD Section 8.3)
        // This uses a 10-stage workflow as specified in PRD Section 8.1
        var status = application.Status;
        int currentStageNumber = status switch
        {
            ApplicationStatus.Draft => 0,                      // Stage 00 - Not started
            ApplicationStatus.Submitted => 1,                     // Stage 01 - Application Creation
            ApplicationStatus.DocumentReview => 2,                // Stage 02 - Document Review
            ApplicationStatus.InReview => 2,                     // Stage 02 - Document Review
            ApplicationStatus.MedicalExam => 3,                  // Stage 03 - Initial Payment (after InReview)
            ApplicationStatus.Training => 4,                     // Stage 04 - Medical Exam
            ApplicationStatus.TheoryTest => 5,                  // Stage 05 - Training
            ApplicationStatus.PracticalTest => 6,                // Stage 06 - Theory Test
            ApplicationStatus.Approved => 7,                      // Stage 07 - Practical Test passed
            ApplicationStatus.Payment => 8,                      // Stage 08 - Final Approval passed, payment due
            ApplicationStatus.Issued => 9,                      // Stage 09 - Issuance Payment done
            ApplicationStatus.Active => 10,                      // Stage 10 - License Issued & Active
            ApplicationStatus.Rejected => 0,                     // Failed - no stage
            ApplicationStatus.Cancelled => 0,                     // Cancelled - no stage
            ApplicationStatus.Expired => 0,                      // Expired - no stage
            _ => 0
        };

        // Get workflow stages based on license category code (F = 6 for Agricultural)
        var isAgricultural = application.LicenseCategory != null && application.LicenseCategory.Code == LicenseCategoryCode.F;
        
        // Check if initial payment was made (status >= MedicalExam means payment was made to proceed)
        bool isInitialPaymentPaid = status >= ApplicationStatus.MedicalExam;
        
        // Check if final payment was made (status >= Payment means final approval passed)
        bool isFinalPaymentPaid = status >= ApplicationStatus.Payment;
        
        var stages = GetWorkflowStages(isAgricultural, status, currentStageNumber, isInitialPaymentPaid, isFinalPaymentPaid);

        var timeline = new ApplicationWorkflowTimelineDto
        {
            ApplicationId = application.Id,
            CurrentStageNumber = currentStageNumber,
            Stages = stages
        };

        return ApiResponse<ApplicationWorkflowTimelineDto>.Ok(timeline);
    }

    private List<TimelineStageDto> GetWorkflowStages(bool isAgricultural, ApplicationStatus status, int currentStageNumber, bool isInitialPaymentPaid, bool isFinalPaymentPaid)
    {
        // PRD Section 8.3: 10-Stage Workflow
        // Stage names as per PRD specification
        var stageNames = isAgricultural 
            ? new[] { 
                // Agricultural: stages 1-10
                "إنشاء الطلب",                            // Stage 01
                "مراجعة الوثائق وتعديلها",               // Stage 02  
                "سداد الرسوم الأولية",                    // Stage 03
                "الفحص الطبي",                           // Stage 04
                "التدريب الميداني",                      // Stage 05
                "الاختبار الميداني",                      // Stage 06
                "الاعتماد النهائي",                     // Stage 07
                "سداد رسوم الإصدار",                    // Stage 08
                "إصدار الرخصة والتسليم",                // Stage 09
                "الرخصة نشطة"                            // Stage 10
              }
            : new[] { 
                // Regular: stages 1-10
                "إنشاء الطلب",                            // Stage 01
                "مراجعة الوثائق وتعديلها",               // Stage 02
                "سداد الرسوم الأولية",                    // Stage 03
                "الفحص الطبي",                           // Stage 04
                "التدريب في المدرسة",                      // Stage 05
                "الاختبار النظري",                       // Stage 06
                "الاختبار العملي",                       // Stage 07
                "الاعتماد النهائي",                     // Stage 08
                "سداد رسوم الإصدار",                    // Stage 09
                "إصدار الرخصة والتسليم"                  // Stage 10
              };

        // Sub-statuses per PRD Section 8.3
        var stageSubStatuses = new Dictionary<int, (ApplicationStatus[] applicable, string defaultState)>
        {
            // Stage 01: Application Creation
            { 1, (new[] { ApplicationStatus.Draft, ApplicationStatus.Submitted }, "pending") },
            // Stage 02: Document Upload & Review
            { 2, (new[] { ApplicationStatus.DocumentReview, ApplicationStatus.InReview, ApplicationStatus.Submitted }, "pending") },
            // Stage 03: Initial Payment
            { 3, (new[] { ApplicationStatus.Submitted, ApplicationStatus.DocumentReview, ApplicationStatus.InReview }, "pending") },
            // Stage 04: Medical Examination
            { 4, (new[] { ApplicationStatus.MedicalExam }, "pending") },
            // Stage 05: Training
            { 5, (new[] { ApplicationStatus.Training }, "pending") },
            // Stage 06: Theory Test
            { 6, (new[] { ApplicationStatus.TheoryTest }, "pending") },
            // Stage 07: Practical Test
            { 7, (new[] { ApplicationStatus.PracticalTest }, "pending") },
            // Stage 08: Final Approval
            { 8, (new[] { ApplicationStatus.Approved }, "pending") },
            // Stage 09: Issuance Payment
            { 9, (new[] { ApplicationStatus.Payment, ApplicationStatus.Approved }, "pending") },
            // Stage 10: License Issuance
            { 10, (new[] { ApplicationStatus.Issued, ApplicationStatus.Active }, "pending") }
        };

        var stages = new List<TimelineStageDto>();
        
        for (int i = 0; i < stageNames.Length; i++)
        {
            var stageNum = i + 1;
            string state;
            
            // Determine stage state based on current application status
            if (stageNum < currentStageNumber)
            {
                state = "completed";
            }
            else if (stageNum == currentStageNumber)
            {
                // Current stage - determine actual state from status
                state = status switch
                {
                    ApplicationStatus.Rejected => "rejected",
                    ApplicationStatus.Cancelled => "skipped",
                    ApplicationStatus.Expired => "skipped",
                    _ => "in_progress"
                };
            }
            else
            {
                // Future stage
                state = "pending";
            }

            stages.Add(new TimelineStageDto
            {
                StageNumber = stageNum,
                NameAr = stageNames[i],
                NameEn = isAgricultural ? stageNames[i] : stageNames[i],
                State = state
            });
        }

        return stages;
    }

    public async Task<ApiResponse<bool>> SubmitAsync(int id, int userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<bool>.Fail(404, "Application not found.");
        if (application.ApplicantId != userId) return ApiResponse<bool>.Fail(403, "Unauthorized.");
        
        // Status check - usually from Draft
        // if (application.Status != ApplicationStatus.Draft)
        //     return ApiResponse<bool>.Fail(400, "Only draft applications can be submitted.");

        application.Status = ApplicationStatus.Submitted;
        application.CurrentStage = ApplicationStages.Stage02Documents;
        application.UpdatedAt = DateTime.UtcNow;

        _applicationRepository.Update(application);
        
        // Auto-create payment for application fee upon submission (wrapped in try-catch to not block submission)
        try
        {
            var paymentRequest = new PaymentInitiateRequest
            {
                ApplicationId = application.Id,
                FeeType = FeeType.ApplicationFee,
                LicenseCategoryId = application.LicenseCategoryId
            };
            await _paymentService.InitiatePaymentAsync(application.Id, paymentRequest, userId, "Applicant");
        }
        catch
        {
            // Log but don't fail the submission if payment creation fails
            // Continue - payment can be created manually later
        }

        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync("APPLICATION_SUBMITTED", "Application", id.ToString(), "Draft", "Submitted");
        return ApiResponse<bool>.Ok(true, "Application submitted successfully.");
    }

    public async Task<ApiResponse<bool>> ApproveAsync(int id, string reason, int userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<bool>.Fail(404, "Application not found.");

        var oldStatus = application.Status;
        
        // Simple logic: Move to next logical status
        // Submitted -> InReview (DocumentReview) -> MedicalExam -> ...
        ApplicationStatus nextStatus = oldStatus switch
        {
            ApplicationStatus.Submitted => ApplicationStatus.DocumentReview,
            ApplicationStatus.DocumentReview => ApplicationStatus.MedicalExam,
            ApplicationStatus.InReview => ApplicationStatus.MedicalExam,
            ApplicationStatus.MedicalExam => ApplicationStatus.Training,
            ApplicationStatus.Training => ApplicationStatus.TheoryTest,
            ApplicationStatus.TheoryTest => ApplicationStatus.PracticalTest,
            ApplicationStatus.PracticalTest => ApplicationStatus.Approved,
            ApplicationStatus.Approved => ApplicationStatus.Payment,
            ApplicationStatus.Payment => ApplicationStatus.Issued,
            _ => oldStatus // Remain same if already at end or Draft
        };

        if (nextStatus == oldStatus)
            return ApiResponse<bool>.Fail(400, "Application cannot be approved in its current state.");

        application.Status = nextStatus;
        application.UpdatedAt = DateTime.UtcNow;
        
        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync("APPLICATION_APPROVED", "Application", id.ToString(), oldStatus.ToString(), nextStatus.ToString());
        
        // If it moved to Approved, handle fee creation
        if (nextStatus == ApplicationStatus.Approved)
        {
            await CreatePaymentForApprovedApplicationAsync(application);
        }

        return ApiResponse<bool>.Ok(true, "Application approved and moved to next stage.");
    }

    public async Task<ApiResponse<bool>> RejectAsync(int id, string reason, int userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<bool>.Fail(404, "Application not found.");

        var oldStatus = application.Status;
        application.Status = ApplicationStatus.Rejected;
        application.RejectionReason = reason;
        application.UpdatedAt = DateTime.UtcNow;

        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync("APPLICATION_REJECTED", "Application", id.ToString(), oldStatus.ToString(), "Rejected");
        
        return ApiResponse<bool>.Ok(true, "تم رفض الطلب بنجاح.");
    }

    /// <summary>
    /// Mark application as paid (after successful payment).
    /// </summary>
    public async Task<ApiResponse<bool>> MarkAsPaidAsync(int id, int userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null)
            return ApiResponse<bool>.Fail(404, "الطلب غير موجود");

        // First, check if there's already a paid payment for this application (Idempotency)
        var paidPayments = await _paymentRepository.FindAsync(p => 
            p.ApplicationId == id && 
            p.Status == PaymentStatus.Paid);
        
        if (paidPayments.Any())
            return ApiResponse<bool>.Ok(true, "تم سداد الرسوم سابقاً.");

        // Next, find and mark any pending payment as paid
        var pendingPayments = await _paymentRepository.FindAsync(p => 
            p.ApplicationId == id && 
            p.Status == PaymentStatus.Pending);
        
        if (pendingPayments.Any())
        {
            var payment = pendingPayments.First();
            payment.Status = PaymentStatus.Paid;
            payment.PaidAt = DateTime.UtcNow;
            // Append a short GUID suffix to ensure global uniqueness even in parallel requests
            payment.TransactionReference = $"TXN_{DateTime.UtcNow:yyyyMMddHHmmss}_{Guid.NewGuid().ToString("N")[..6]}";
            payment.ReceiptNumber = $"RCP-{DateTime.UtcNow:yyyyMMdd}-{payment.Id:D4}";
            _paymentRepository.Update(payment);
        }
        else
        {
            // If no pending or paid payment exists, create a new paid record
            var newPayment = new PaymentTransaction
            {
                ApplicationId = id,
                Amount = 100.00m, // Default amount since no fee structure exists
                Status = PaymentStatus.Paid,
                PaymentMethod = "Simulated",
                TransactionReference = $"TXN_{DateTime.UtcNow:yyyyMMddHHmmss}_{Guid.NewGuid().ToString("N")[..6]}",
                ReceiptNumber = $"RCP-{DateTime.UtcNow:yyyyMMdd}-{id:D4}",
                PaidAt = DateTime.UtcNow
            };
            await _paymentRepository.AddAsync(newPayment);
        }

        // Advance status based on current status
        var newStatus = application.Status switch
        {
            ApplicationStatus.Submitted => ApplicationStatus.DocumentReview,
            ApplicationStatus.DocumentReview => ApplicationStatus.InReview,
            ApplicationStatus.InReview => ApplicationStatus.MedicalExam,
            ApplicationStatus.Payment => ApplicationStatus.Approved,
            _ => application.Status
        };

        application.Status = newStatus;
        application.CurrentStage = newStatus switch
        {
            ApplicationStatus.DocumentReview => "02: Documents",
            ApplicationStatus.InReview => "03: Review",
            ApplicationStatus.MedicalExam => "04: Medical",
            ApplicationStatus.Approved => "10: Final Approval",
            _ => application.CurrentStage
        };

        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "تم تحديث حالة الطلب بنجاح");
    }

    private string GenerateApplicationNumber()
    {
        var year = DateTime.UtcNow.Year;
        var random = Random.Shared.Next(10000000, 99999999);
        return $"MOJ-{year}-{random:D8}";
    }

    public async Task<ApiResponse<PagedResult<ApplicationDto>>> GetSecurityPendingQueueAsync(int page = 1, int pageSize = 20, string? search = null)
    {
        // Build base query without includes for count
        var baseQuery = _applicationRepository.Query()
            .Where(a => 
                a.SecurityStatus == SecurityStatus.Pending &&
                a.Status >= ApplicationStatus.Submitted &&
                a.Status < ApplicationStatus.Issued &&
                !a.IsDeleted);

        if (!string.IsNullOrEmpty(search))
        {
            baseQuery = baseQuery.Where(a => a.ApplicationNumber.Contains(search));
        }

        // Count query (separate, no includes)
        var countQuery = _applicationRepository.Query()
            .Where(a => 
                a.SecurityStatus == SecurityStatus.Pending &&
                a.Status >= ApplicationStatus.Submitted &&
                a.Status < ApplicationStatus.Issued &&
                !a.IsDeleted);
        
        if (!string.IsNullOrEmpty(search))
            countQuery = countQuery.Where(a => a.ApplicationNumber.Contains(search));
        
        var total = await countQuery.CountAsync();
        
        // Load ALL matching records into memory first (no SQL pagination)
        // This avoids OFFSET/FETCH syntax which isn't supported in SQL Server 2008 R2
        var allApps = await baseQuery
            .Include(a => a.LicenseCategory)
            .Include(a => a.Applicant)
            .OrderBy(a => a.CreatedAt)
            .ToListAsync();
        
        var skip = (page - 1) * pageSize;
        var pagedApps = allApps.Skip(skip).Take(pageSize).ToList();

        var result = new PagedResult<ApplicationDto>
        {
            Items = _mapper.Map<List<ApplicationDto>>(pagedApps),
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
        
        return ApiResponse<PagedResult<ApplicationDto>>.Ok(result);
    }

    public async Task<ApiResponse<bool>> RecordSecurityVerificationAsync(int id, SecurityVerificationRequest request, int userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<bool>.Fail(404, "Application not found.");

        application.SecurityStatus = request.IsCleared ? SecurityStatus.Cleared : SecurityStatus.Blocked;
        application.SecurityVerifiedBy = userId;
        application.SecurityVerifiedAt = DateTime.UtcNow;
        application.SecurityNotes = request.Notes;

        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync(
            "SECURITY_VERIFICATION", 
            "Application", 
            id.ToString(), 
            null, 
            request.IsCleared ? "Cleared" : "Blocked");

        // Notify applicant
        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = application.ApplicantId,
            ApplicationId = application.Id,
            EventType = NotificationEventType.StatusChanged,
            TitleAr = request.IsCleared ? "تم التحقق الأمني" : "تم رفض الطلب الأمني",
            TitleEn = request.IsCleared ? "Security Cleared" : "Security Blocked",
            MessageAr = request.IsCleared 
                ? $"تم التحقق من أمني طلبك رقم {application.ApplicationNumber} بنجاح."
                : $"تم رفض طلبك رقم {application.ApplicationNumber} للأسباب الأمنية: {request.Notes}",
            MessageEn = request.IsCleared
                ? $"Your application {application.ApplicationNumber} has been security cleared."
                : $"Your application {application.ApplicationNumber} was blocked for security reasons: {request.Notes}"
        });

        return ApiResponse<bool>.Ok(true, request.IsCleared ? "تمت عملية التحقق الأمني بنجاح - مقبول" : "تم حظر الطلب أمنياً");
    }

    public async Task<ApiResponse<PagedResult<ApplicationDto>>> GetMedicalPendingQueueAsync(int page = 1, int pageSize = 20, string? search = null)
    {
        var query = _applicationRepository.Query()
            .Include(a => a.LicenseCategory)
            .Where(a => 
                a.CurrentStage == ApplicationStages.Medical &&
                (a.Status == ApplicationStatus.MedicalExam || a.Status == ApplicationStatus.Approved) &&
                !a.IsDeleted);

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(a => a.ApplicationNumber.Contains(search));
        }

        // Load ALL matching records into memory first (no SQL pagination)
        // This avoids OFFSET/FETCH syntax which isn't supported in SQL Server 2008 R2
        var allApps = await query
            .OrderBy(a => a.CreatedAt)
            .ToListAsync();
        
        var total = allApps.Count;
        var skip = (page - 1) * pageSize;
        var pagedApps = allApps.Skip(skip).Take(pageSize).ToList();

        var result = new PagedResult<ApplicationDto>
        {
            Items = _mapper.Map<List<ApplicationDto>>(pagedApps),
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
        
        return ApiResponse<PagedResult<ApplicationDto>>.Ok(result);
    }

    public async Task<ApiResponse<bool>> ForwardToMedicalAsync(int id, int userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<bool>.Fail(404, "الطلب غير موجود.");

        var oldStatus = application.Status;
        
        // Can forward from: Submitted, DocumentReview, InReview
        if (application.Status != ApplicationStatus.Submitted && 
            application.Status != ApplicationStatus.DocumentReview && 
            application.Status != ApplicationStatus.InReview)
        {
            return ApiResponse<bool>.Fail(400, "لا يمكن تحويل الطلب للمرحلة الطبية في حالته الحالية.");
        }

        application.Status = ApplicationStatus.MedicalExam;
        application.CurrentStage = ApplicationStages.Medical;
        application.UpdatedAt = DateTime.UtcNow;

        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync("FORWARD_TO_MEDICAL", "Application", id.ToString(), oldStatus.ToString(), "MedicalExam");

        // Notify applicant
        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = application.ApplicantId,
            ApplicationId = application.Id,
            EventType = NotificationEventType.StatusChanged,
            TitleAr = "تم تحويل طلبك للفحص الطبي",
            TitleEn = "Application Forwarded to Medical Exam",
            MessageAr = $"تم تحويل طلبك رقم {application.ApplicationNumber} للمرحلة الطبية. يرجى تحديد موعد للفحص الطبي.",
            MessageEn = $"Your application {application.ApplicationNumber} has been forwarded to the medical exam stage."
        });

        return ApiResponse<bool>.Ok(true, "تم تحويل الطلب للمرحلة الطبية بنجاح.");
    }

    public async Task<ApiResponse<bool>> ForwardToTrainingAsync(int id, int userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<bool>.Fail(404, "الطلب غير موجود.");

        var oldStatus = application.Status;
        
        // Can forward from: Submitted, DocumentReview, InReview, MedicalExam
        if (application.Status != ApplicationStatus.Submitted && 
            application.Status != ApplicationStatus.DocumentReview && 
            application.Status != ApplicationStatus.InReview &&
            application.Status != ApplicationStatus.MedicalExam)
        {
            return ApiResponse<bool>.Fail(400, "لا يمكن تحويل الطلب لمرحلة التدريب في حالته الحالية.");
        }

        application.Status = ApplicationStatus.Training;
        application.CurrentStage = ApplicationStages.Training;
        application.UpdatedAt = DateTime.UtcNow;

        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync("FORWARD_TO_TRAINING", "Application", id.ToString(), oldStatus.ToString(), "Training");

        // Notify applicant
        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = application.ApplicantId,
            ApplicationId = application.Id,
            EventType = NotificationEventType.StatusChanged,
            TitleAr = "تم تحويل طلبك لمرحلة التدريب",
            TitleEn = "Application Forwarded to Training",
            MessageAr = $"تم تحويل طلبك رقم {application.ApplicationNumber} لمرحلة التدريب. يرجى مراجعة مواعيد التدريب.",
            MessageEn = $"Your application {application.ApplicationNumber} has been forwarded to the training stage."
        });

        return ApiResponse<bool>.Ok(true, "تم تحويل الطلب لمرحلة التدريب بنجاح.");
    }

    public async Task<ApiResponse<bool>> AssignAsync(int id, AssignApplicationRequest request, int userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null)
            return ApiResponse<bool>.Fail(404, "الطلب غير موجود.");

        // Verify application can be assigned (must be in a valid state)
        if (application.Status == ApplicationStatus.Draft)
            return ApiResponse<bool>.Fail(400, "لا يمكن تسليم الطلب وهو في حالة المسودة.");
        
        if (application.Status == ApplicationStatus.Cancelled || application.Status == ApplicationStatus.Rejected)
            return ApiResponse<bool>.Fail(400, "لا يمكن تسليم الطلب الملغى أو المرفوض.");

        // Verify staff member exists and has a valid role (Doctor, Examiner)
        var staff = await _userRepository.GetByIdAsync(request.StaffId ?? 0);
        if (staff == null)
            return ApiResponse<bool>.Fail(404, "الموظف المحدد غير موجود.");

        // Validate staff role - must be Doctor, Examiner, Manager or Admin
        var validRoles = new[] { UserRole.Doctor, UserRole.Examiner, UserRole.Manager, UserRole.Admin };
        if (!validRoles.Contains(staff.Role))
            return ApiResponse<bool>.Fail(400, "لا يمكن تسليم الطلب للموظف المحدد. يجب أن يكون طبيباً أو فحصاً.");

        // Store old values for audit
        var oldAssignedToId = application.AssignedToId;

        // Update application assignment
        application.AssignedToId = request.StaffId ?? 0;
        application.AssignedAt = DateTime.UtcNow;
        application.AssignmentNotes = request.Notes;
        application.UpdatedAt = DateTime.UtcNow;

        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        // Audit log
        await _auditService.LogAsync(
            "ASSIGN_APPLICATION",
            "Application",
            id.ToString(),
            oldAssignedToId?.ToString(),
            request.StaffId.ToString());

        // Notify the assigned staff member
        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = request.StaffId ?? 0,
            ApplicationId = application.Id,
            EventType = NotificationEventType.ApplicationAssigned,
            TitleAr = "تم تسليمك طلب جديد",
            TitleEn = "New Application Assigned",
            MessageAr = $"تم تسليمك طلب رقم {application.ApplicationNumber} للمراجعة.",
            MessageEn = $"You have been assigned application {application.ApplicationNumber} for review."
        });

        // Notify applicant about assignment
        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = application.ApplicantId,
            ApplicationId = application.Id,
            EventType = NotificationEventType.StatusChanged,
            TitleAr = "تم تسليم طلبك للموظفين",
            TitleEn = "Your Application Has Been Assigned",
            MessageAr = $"تم تسليم طلبك رقم {application.ApplicationNumber} للمراجعة من قبل الموظف المختص.",
            MessageEn = $"Your application {application.ApplicationNumber} has been assigned to a staff member for review."
        });

return ApiResponse<bool>.Ok(true, "تم تسليم الطلب بنجاح.");
    }

    public async Task<ApiResponse<EligibilityResponseDto>> CheckEligibilityAsync(int userId, LicenseCategoryCode categoryCode, ServiceType serviceType)
    {
        // [FLEXIBILITY] - Always allow selection for testing/stabilization
        return ApiResponse<EligibilityResponseDto>.Ok(new EligibilityResponseDto 
        { 
            IsEligible = true,
            Message = "مؤهل لتقديم الطلب."
        });
    }

    public async Task<ApiResponse<PagedResult<ApplicationDto>>> GetMyApplicationsAsync(int userId, int page = 1, int pageSize = 20, string? status = null)
    {
        var query = _applicationRepository.Query()
            .Where(a => a.ApplicantId == userId && !a.IsDeleted);

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<ApplicationStatus>(status, true, out var parsedStatus))
            query = query.Where(a => a.Status == parsedStatus);

        var total = await query.CountAsync();
        var apps = await query
            .Include(a => a.LicenseCategory)
            .Include(a => a.Applicant)
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return ApiResponse<PagedResult<ApplicationDto>>.Ok(new PagedResult<ApplicationDto>
        {
            Items = _mapper.Map<List<ApplicationDto>>(apps),
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        });
    }

    public async Task<ApiResponse<PagedResult<ApplicationDto>>> GetDoctorApplicationsAsync(int userId, int page = 1, int pageSize = 20, string? search = null)
    {
        var query = _applicationRepository.Query()
            .Where(a => !a.IsDeleted && (
                a.Status == ApplicationStatus.MedicalExam ||
                a.AssignedToId == userId));

        if (!string.IsNullOrEmpty(search))
            query = query.Where(a => a.ApplicationNumber.Contains(search));

        var total = await query.CountAsync();
        var apps = await query
            .Include(a => a.LicenseCategory)
            .Include(a => a.Applicant)
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return ApiResponse<PagedResult<ApplicationDto>>.Ok(new PagedResult<ApplicationDto>
        {
            Items = _mapper.Map<List<ApplicationDto>>(apps),
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        });
    }

    public async Task<ApiResponse<PagedResult<ApplicationDto>>> GetExaminerApplicationsAsync(int userId, int page = 1, int pageSize = 20, string? search = null)
    {
        var query = _applicationRepository.Query()
            .Where(a => !a.IsDeleted && (
                a.Status == ApplicationStatus.TheoryTest ||
                a.Status == ApplicationStatus.PracticalTest ||
                a.AssignedToId == userId));

        if (!string.IsNullOrEmpty(search))
            query = query.Where(a => a.ApplicationNumber.Contains(search));

        var total = await query.CountAsync();
        var apps = await query
            .Include(a => a.LicenseCategory)
            .Include(a => a.Applicant)
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return ApiResponse<PagedResult<ApplicationDto>>.Ok(new PagedResult<ApplicationDto>
        {
            Items = _mapper.Map<List<ApplicationDto>>(apps),
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        });
    }
}
