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
        IPaymentService paymentService)
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
    }

    public async Task<ApiResponse<ApplicationDto>> CreateAsync(CreateApplicationRequest request, Guid userId)
    {
        // 1. Eligibility Check (Gate 1)
        var category = await _categoryRepository.GetByIdAsync(request.LicenseCategoryId);
        if (category == null) return ApiResponse<ApplicationDto>.Fail(400, "Invalid license category.");

        var ageLimitSetting = (await _settingsRepository.FindAsync(s => s.SettingKey == $"MIN_AGE_CATEGORY_{category.Code}")).FirstOrDefault();
        if (ageLimitSetting == null) return ApiResponse<ApplicationDto>.Fail(400, "System setting error: Age limit not found.");

        if (!int.TryParse(ageLimitSetting.SettingValue, out int minAge))
            minAge = 18; // Default fallback

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return ApiResponse<ApplicationDto>.Fail(404, "User not found.");

        var today = DateTime.UtcNow;
        var dob = user.DateOfBirth ?? DateTime.UtcNow.AddYears(-18); // Default to 18 if null
        var age = today.Year - dob.Year;
        if (dob.Date > today.AddYears(-age)) age--;

        if (age < minAge)
            return ApiResponse<ApplicationDto>.Fail(400, $"Minimum age for category {category.Code} is {minAge}. Your age is {age}.");

        // 2. Active Application Check
        var activeApps = await _applicationRepository.FindAsync(a => a.ApplicantId == userId && 
            (a.Status != ApplicationStatus.Active && a.Status != ApplicationStatus.Cancelled && a.Status != ApplicationStatus.Rejected));
        
        if (activeApps.Any())
            return ApiResponse<ApplicationDto>.Fail(400, "You already have an active application in progress.");

        // 3. Update User Profile (Applicant Data)
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
        var appValidityMonthsSetting = (await _settingsRepository.FindAsync(s => s.SettingKey == "APPLICATION_VALIDITY_MONTH_COUNT")).FirstOrDefault();
        int validityMonths = appValidityMonthsSetting != null ? int.Parse(appValidityMonthsSetting.SettingValue) : 6;

        var application = new ApplicationEntity
        {
            ApplicationNumber = GenerateApplicationNumber(),
            ApplicantId = userId,
            ServiceType = request.ServiceType,
            LicenseCategoryId = request.LicenseCategoryId,
            BranchId = request.BranchId,
            Status = ApplicationStatus.Submitted,
            CurrentStage = "01: Application Submission",
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

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(application), "Application created successfully.");
    }

    public async Task<ApiResponse<ApplicationDto>> CreateDraftAsync(ServiceType serviceType, Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return ApiResponse<ApplicationDto>.Fail(404, "User not found.");

        // Check for existing active applications
        var activeApps = await _applicationRepository.FindAsync(a => a.ApplicantId == userId && 
            a.Status != ApplicationStatus.Cancelled && a.Status != ApplicationStatus.Rejected);
        
        if (activeApps.Any())
            return ApiResponse<ApplicationDto>.Fail(400, "You already have an active application.");

        // Get default license category (B - خصوصي)
        var allCategories = await _categoryRepository.GetAllAsync();
        var defaultCategory = allCategories.FirstOrDefault(c => c.Code == LicenseCategoryCode.B);
        if (defaultCategory == null)
            return ApiResponse<ApplicationDto>.Fail(500, "No license categories configured.");

        var application = new ApplicationEntity
        {
            ApplicationNumber = GenerateApplicationNumber(),
            ApplicantId = userId,
            ServiceType = serviceType,
            LicenseCategoryId = defaultCategory.Id, // Required - set default
            Status = ApplicationStatus.Draft,
            CurrentStage = "ServiceSelection",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _applicationRepository.AddAsync(application);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(application), "Draft created successfully.");
    }

    public async Task<ApiResponse<ApplicationDto>> GetByIdAsync(Guid id, Guid userId, string role)
    {
        var application = await _applicationRepository.Query()
            .Include(a => a.LicenseCategory)
            .FirstOrDefaultAsync(a => a.Id == id);
        if (application == null) return ApiResponse<ApplicationDto>.Fail(404, "Application not found.");

        // Security check
        if (role == Roles.Applicant && application.ApplicantId != userId)
            return ApiResponse<ApplicationDto>.Fail(403, "Unauthorized access.");

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(application));
    }

    public async Task<ApiResponse<ApplicationWizardDto>> GetWizardDataAsync(Guid id, Guid userId)
    {
        var application = await _applicationRepository.Query()
            .Include(a => a.LicenseCategory)
            .FirstOrDefaultAsync(a => a.Id == id);
        if (application == null) return ApiResponse<ApplicationWizardDto>.Fail(404, "Application not found.");

        if (application.ApplicantId != userId)
            return ApiResponse<ApplicationWizardDto>.Fail(403, "Unauthorized access.");

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return ApiResponse<ApplicationWizardDto>.Fail(404, "User not found.");

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

    public async Task<ApiResponse<ApplicationWizardDto>> UpdateWizardDataAsync(Guid id, UpdateWizardDataRequest request, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<ApplicationWizardDto>.Fail(404, "Application not found.");

        if (application.ApplicantId != userId)
            return ApiResponse<ApplicationWizardDto>.Fail(403, "Unauthorized access.");

        if (application.Status != ApplicationStatus.Draft && application.Status != ApplicationStatus.Submitted)
            return ApiResponse<ApplicationWizardDto>.Fail(400, "Only draft or submitted applications can be modified.");

        var user = await _userRepository.GetByIdAsync(userId);

        // Update Application fields
        if (request.LicenseCategoryId.HasValue)
            application.LicenseCategoryId = request.LicenseCategoryId.Value;
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

        return ApiResponse<ApplicationWizardDto>.Ok(dto, "Wizard data updated.");
    }

    public async Task<ApiResponse<PagedResult<ApplicationDto>>> GetListAsync(Guid userId, string role, int page = 1, int pageSize = 20, string? search = null, string? status = null)
    {
        var query = _applicationRepository.Query();
        
        if (role == Roles.Applicant)
        {
            query = query.Where(a => a.ApplicantId == userId);
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
                query = query.Where(a => statusList.Contains(a.Status));
            }
        }

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(a => a.ApplicationNumber.Contains(search) || 
                                    (a.CurrentStage != null && a.CurrentStage.Contains(search)));
        }

        var total = await query.CountAsync();
        var pagedApps = await query.OrderByDescending(a => a.CreatedAt)
                           .Skip((page - 1) * pageSize)
                           .Take(pageSize)
                           .ToListAsync();

        var result = new PagedResult<ApplicationDto>
        {
            Items = _mapper.Map<List<ApplicationDto>>(pagedApps),
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
        
        return ApiResponse<PagedResult<ApplicationDto>>.Ok(result);
    }

    public async Task<ApiResponse<IEnumerable<ApplicationDto>>> GetByApplicationNumberAsync(string applicationNumber)
    {
        var applications = await _applicationRepository.FindAsync(a => a.ApplicationNumber == applicationNumber);
        var result = applications.ToList();
        
        if (!result.Any())
        {
            return ApiResponse<IEnumerable<ApplicationDto>>.NotFound("Application not found.");
        }

        return ApiResponse<IEnumerable<ApplicationDto>>.Ok(_mapper.Map<List<ApplicationDto>>(result));
    }

    public async Task<bool> IsOwnerAsync(Guid applicationId, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        return application != null && application.ApplicantId == userId;
    }

    public async Task<ApiResponse<bool>> UpdateAsync(Guid id, UpdateApplicationRequest request, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<bool>.Fail(404, "Application not found.");

        if (application.ApplicantId != userId)
            return ApiResponse<bool>.Fail(403, "Unauthorized.");

        if (application.Status != ApplicationStatus.Draft && application.Status != ApplicationStatus.Submitted)
            return ApiResponse<bool>.Fail(400, "Only draft or submitted applications can be modified.");

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

        return ApiResponse<bool>.Ok(true, "Application updated.");
    }

    public async Task<ApiResponse<bool>> CancelAsync(Guid id, string reason, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<bool>.Fail(404, "Application not found.");

        if (application.ApplicantId != userId)
            return ApiResponse<bool>.Fail(403, "Unauthorized.");

        if (application.Status == ApplicationStatus.Active || application.Status == ApplicationStatus.Cancelled)
             return ApiResponse<bool>.Fail(400, "Application cannot be cancelled in current state.");

        application.Status = ApplicationStatus.Cancelled;
        application.CancelledAt = DateTime.UtcNow;
        application.CancellationReason = reason;

        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Application cancelled.");
    }

    public async Task<ApiResponse<bool>> UpdateStatusAsync(Guid id, ApplicationStatus status, string reason, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<bool>.Fail(404, "Application not found.");

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

        return ApiResponse<bool>.Ok(true, "Status updated.");
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
                MessageAr = $"تم اعتماد طلبك رقم {application.ApplicationNumber}. يرجى سداد رسوم الرخصة amounting to {amount} SAR.",
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

    public async Task<ApiResponse<ApplicationDto>> CreateUpgradeApplicationAsync(UpgradeApplicationRequest request, Guid userId)
    {
        // 1. Validate current license exists and belongs to user
        var currentLicense = await _licenseRepository.GetByIdAsync(request.CurrentLicenseId);
        if (currentLicense == null || currentLicense.HolderId != userId)
            return ApiResponse<ApplicationDto>.Fail(404, "Invalid license.");

        // 2. Check if license is valid (not expired)
        if (currentLicense.ExpiresAt <= DateTime.UtcNow)
            return ApiResponse<ApplicationDto>.Fail(400, "License is expired.");

        // 3. Validate target category
        var targetCategory = await _categoryRepository.GetByIdAsync(request.TargetCategoryId);
        if (targetCategory == null)
            return ApiResponse<ApplicationDto>.Fail(400, "Invalid target category.");

        // 4. Check age requirement for target category
        var ageLimitSetting = (await _settingsRepository.FindAsync(s => s.SettingKey == $"MIN_AGE_CATEGORY_{targetCategory.Code}")).FirstOrDefault();
        if (ageLimitSetting == null) return ApiResponse<ApplicationDto>.Fail(400, "System setting error: Age limit not found.");

        if (!int.TryParse(ageLimitSetting.SettingValue, out int minAge))
            minAge = 18;

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return ApiResponse<ApplicationDto>.Fail(404, "User not found.");

        var today = DateTime.UtcNow;
        var dob = user.DateOfBirth ?? DateTime.UtcNow.AddYears(-18);
        var age = today.Year - dob.Year;
        if (dob.Date > today.AddYears(-age)) age--;

        if (age < minAge)
            return ApiResponse<ApplicationDto>.Fail(400, $"Minimum age for category {targetCategory.Code} is {minAge}. Your age is {age}.");

        // 5. Check no active application exists
        var activeApps = await _applicationRepository.FindAsync(a => a.ApplicantId == userId && 
            (a.Status != ApplicationStatus.Active && a.Status != ApplicationStatus.Cancelled && a.Status != ApplicationStatus.Rejected));
        
        if (activeApps.Any())
            return ApiResponse<ApplicationDto>.Fail(400, "You already have an active application in progress.");

        // 6. Create application
        var appValidityMonthsSetting = (await _settingsRepository.FindAsync(s => s.SettingKey == "APPLICATION_VALIDITY_MONTH_COUNT")).FirstOrDefault();
        int validityMonths = appValidityMonthsSetting != null ? int.Parse(appValidityMonthsSetting.SettingValue) : 6;

        var application = new ApplicationEntity
        {
            ApplicationNumber = GenerateApplicationNumber(),
            ApplicantId = userId,
            ServiceType = ServiceType.CategoryUpgrade,
            LicenseCategoryId = request.TargetCategoryId,
            BranchId = request.BranchId,
            Status = ApplicationStatus.Submitted,
            CurrentStage = "01: Application Submission",
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

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(application), "Upgrade application created successfully.");
    }

    public async Task<ApiResponse<ReplacementEligibilityResponse>> GetReplacementEligibilityAsync(Guid userId)
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
                LicenseId = Guid.Empty,
                LicenseNumber = string.Empty,
                ExpiryDate = DateTime.MinValue,
                Message = "No license eligible for replacement."
            });
        }

        return ApiResponse<ReplacementEligibilityResponse>.Ok(new ReplacementEligibilityResponse
        {
            IsEligible = true,
            LicenseId = eligibleLicense.Id,
            LicenseNumber = eligibleLicense.LicenseNumber,
            ExpiryDate = eligibleLicense.ExpiresAt,
            Message = "You are eligible for license replacement."
        });
    }

    public async Task<ApiResponse<ApplicationDto>> CreateReplacementApplicationAsync(ReplacementApplicationRequest request, Guid userId)
    {
        // 1. Validate license exists and belongs to user
        var existingLicense = await _licenseRepository.GetByIdAsync(request.LicenseId);
        if (existingLicense == null || existingLicense.HolderId != userId)
            return ApiResponse<ApplicationDto>.Fail(404, "Invalid license.");

        // 2. Check status
        if (existingLicense.Status != LicenseStatus.Active)
            return ApiResponse<ApplicationDto>.Fail(400, "License is not active.");

        // 3. Check no active application exists
        var activeApps = await _applicationRepository.FindAsync(a => a.ApplicantId == userId && 
            (a.Status != ApplicationStatus.Active && a.Status != ApplicationStatus.Cancelled && a.Status != ApplicationStatus.Rejected));
        
        if (activeApps.Any())
            return ApiResponse<ApplicationDto>.Fail(400, "You already have an active application in progress.");

        // 4. Get same category
        var category = await _categoryRepository.GetByIdAsync(existingLicense.LicenseCategoryId);
        if (category == null)
            return ApiResponse<ApplicationDto>.Fail(400, "License category not found.");

        // 5. Create application
        var appValidityMonthsSetting = (await _settingsRepository.FindAsync(s => s.SettingKey == "APPLICATION_VALIDITY_MONTH_COUNT")).FirstOrDefault();
        int validityMonths = appValidityMonthsSetting != null ? int.Parse(appValidityMonthsSetting.SettingValue) : 6;

        var application = new ApplicationEntity
        {
            ApplicationNumber = GenerateApplicationNumber(),
            ApplicantId = userId,
            ServiceType = ServiceType.Replacement,
            LicenseCategoryId = existingLicense.LicenseCategoryId,
            Status = ApplicationStatus.Submitted,
            CurrentStage = "01: Application Submission",
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

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(application), "Replacement application created successfully.");
    }

    public async Task<ApiResponse<PagedResult<ApplicationDto>>> GetQueueAsync(int page = 1, int pageSize = 20, string? search = null, string? stage = null)
    {
        var query = _applicationRepository.Query()
            .Include(a => a.LicenseCategory)
            .Where(a => 
                a.Status >= ApplicationStatus.Submitted && 
                a.Status < ApplicationStatus.Issued &&
                !a.IsDeleted);

        if (!string.IsNullOrEmpty(stage))
        {
            query = query.Where(a => a.CurrentStage == stage);
        }

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(a => a.ApplicationNumber.Contains(search));
        }

        var total = await query.CountAsync();
        var pagedApps = await query.OrderBy(a => a.Status)
                           .ThenBy(a => a.CreatedAt)
                           .Skip((page - 1) * pageSize)
                           .Take(pageSize)
                           .ToListAsync();

        var result = new PagedResult<ApplicationDto>
        {
            Items = _mapper.Map<List<ApplicationDto>>(pagedApps),
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
        
        return ApiResponse<PagedResult<ApplicationDto>>.Ok(result);
    }

    public async Task<ApiResponse<ApplicationWorkflowTimelineDto>> GetTimelineAsync(Guid id)
    {
        var application = await _applicationRepository.Query()
            .Include(a => a.LicenseCategory)
            .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted);

        if (application == null)
        {
            return ApiResponse<ApplicationWorkflowTimelineDto>.Fail(404, "Application not found.");
        }

        // Map application status to stage number based on actual enum
        var status = application.Status;
        int currentStageNumber = status switch
        {
            ApplicationStatus.Draft => 0,
            ApplicationStatus.Submitted => 1,
            ApplicationStatus.DocumentReview => 2,
            ApplicationStatus.InReview => 2,
            ApplicationStatus.MedicalExam => 3,
            ApplicationStatus.Training => 4,
            ApplicationStatus.TheoryTest => 5,
            ApplicationStatus.PracticalTest => 6,
            ApplicationStatus.Approved => 7,
            ApplicationStatus.Payment => 8,
            ApplicationStatus.Issued => 9,
            ApplicationStatus.Active => 10,
            ApplicationStatus.Rejected => 0,
            ApplicationStatus.Cancelled => 0,
            ApplicationStatus.Expired => 0,
            _ => 0
        };

        // Get workflow stages based on license category code (F = 6 for Agricultural)
        var isAgricultural = application.LicenseCategory.Code == LicenseCategoryCode.F;
        var stages = GetWorkflowStages(isAgricultural, status, currentStageNumber);

        var timeline = new ApplicationWorkflowTimelineDto
        {
            ApplicationId = application.Id,
            CurrentStageNumber = currentStageNumber,
            Stages = stages
        };

        return ApiResponse<ApplicationWorkflowTimelineDto>.Ok(timeline);
    }

    private List<TimelineStageDto> GetWorkflowStages(bool isAgricultural, ApplicationStatus status, int currentStageNumber)
    {
        var stageNames = isAgricultural 
            ? new[] { "إنشاء الطلب", "مراجعة الوثائق", "سداد الرسوم الأولية", "الفحص الطبي", "التدريب الميداني", "الاختبار الميداني", "الاعتماد النهائي", "سداد رسوم الإصدار", "إصدار الرخصة والتسليم" }
            : new[] { "إنشاء الطلب", "مراجعة الوثائق", "سداد الرسوم الأولية", "الفحص الطبي", "التدريب في المدرسة", "الاختبار النظري", "الاختبار العملي", "الاعتماد النهائي", "سداد رسوم الإصدار", "إصدار الرخصة والتسليم" };

        var stages = new List<TimelineStageDto>();
        
        for (int i = 0; i < stageNames.Length; i++)
        {
            var stageNum = i + 1;
            string state;
            
            if (stageNum < currentStageNumber)
            {
                state = "completed";
            }
            else if (stageNum == currentStageNumber)
            {
                state = status == ApplicationStatus.Rejected || status == ApplicationStatus.Cancelled ? "failed" : "current";
            }
            else
            {
                state = "future";
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

    private string GenerateApplicationNumber()
    {
        var year = DateTime.UtcNow.Year;
        var random = Random.Shared.Next(10000000, 99999999);
        return $"MOJ-{year}-{random:D8}";
    }
}
