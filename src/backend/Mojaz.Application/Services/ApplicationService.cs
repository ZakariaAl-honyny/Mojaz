using AutoMapper;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Mojaz.Application.DTOs.Application;
using Mojaz.Application.Applications.Dtos;
using Mojaz.Application.DTOs.Email;
using Mojaz.Application.DTOs.Email.Templates;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Constants;
using Mojaz.Shared.Models;
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
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAuditService _auditService;
    private readonly INotificationService _notificationService;
    private readonly IEmailService _emailService;
    private readonly IRepository<ApplicationStatusHistory> _historyRepository;
    private readonly IBackgroundJobClient _backgroundJobClient;

    public ApplicationService(
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<User> userRepository,
        IRepository<LicenseCategory> categoryRepository,
        IRepository<SystemSetting> settingsRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IAuditService auditService,
        INotificationService notificationService,
        IEmailService emailService,
        IBackgroundJobClient backgroundJobClient,
        IRepository<ApplicationStatusHistory> historyRepository)
    {
        _applicationRepository = applicationRepository;
        _userRepository = userRepository;
        _categoryRepository = categoryRepository;
        _settingsRepository = settingsRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _auditService = auditService;
        _notificationService = notificationService;
        _emailService = emailService;
        _backgroundJobClient = backgroundJobClient;
        _historyRepository = historyRepository;
    }

    public async Task<ApiResponse<EligibilityCheckResult>> CheckEligibilityAsync(Guid userId, EligibilityCheckRequest request)
    {
        var category = await _categoryRepository.GetByIdAsync(request.LicenseCategoryId);
        if (category == null) return ApiResponse<EligibilityCheckResult>.Fail(400, "Invalid license category.");

        var ageLimitSetting = (await _settingsRepository.FindAsync(s => s.SettingKey == $"MIN_AGE_CATEGORY_{category.Code}")).FirstOrDefault();
        if (ageLimitSetting == null) return ApiResponse<EligibilityCheckResult>.Fail(400, "System setting error: Age limit not found.");

        if (!int.TryParse(ageLimitSetting.SettingValue, out int minAge))
            minAge = 18; // Default fallback

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return ApiResponse<EligibilityCheckResult>.Fail(404, "User not found.");

        var reasons = new List<string>();

        var today = DateTime.UtcNow;
        var age = today.Year - user.DateOfBirth.Year;
        if (user.DateOfBirth.Date > today.AddYears(-age)) age--;

        if (age < minAge)
        {
            reasons.Add($"Minimum age for category {category.Code} is {minAge}. Your age is {age}.");
        }

        // Active Application Check
        var activeApps = await _applicationRepository.FindAsync(a => a.ApplicantId == userId && 
            (a.Status != ApplicationStatus.Active && a.Status != ApplicationStatus.Cancelled && a.Status != ApplicationStatus.Rejected && a.Status != ApplicationStatus.Expired && a.Status != ApplicationStatus.Issued));
        
        if (activeApps.Any())
        {
            reasons.Add("You already have an active application in progress.");
        }

        return ApiResponse<EligibilityCheckResult>.Ok(new EligibilityCheckResult 
        { 
            IsEligible = !reasons.Any(), 
            Reasons = reasons 
        });
    }

    public async Task<ApiResponse<ApplicationDto>> CreateAsync(CreateApplicationRequest request, Guid userId)
    {
        var eligibilityResult = await CheckEligibilityAsync(userId, new EligibilityCheckRequest { LicenseCategoryId = request.LicenseCategoryId });
        if (!eligibilityResult.Success)
            return ApiResponse<ApplicationDto>.Fail(eligibilityResult.StatusCode, eligibilityResult.Message);
        if (!eligibilityResult.Data!.IsEligible)
            return ApiResponse<ApplicationDto>.Fail(400, string.Join(" ", eligibilityResult.Data.Reasons));

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return ApiResponse<ApplicationDto>.Fail(404, "User not found.");

        // 3. Update User Profile (Applicant Data)
        user.NationalId = request.NationalId;
        user.DateOfBirth = request.DateOfBirth;
        user.Gender = request.Gender;
        user.Nationality = request.Nationality;
        user.Address = request.Address;
        user.City = request.City;
        user.Region = request.Region;
        user.ApplicantType = request.ApplicantType;
        
        _userRepository.Update(user);

        // 4. Create Application (as Draft)
        var appValidityMonthsSetting = (await _settingsRepository.FindAsync(s => s.SettingKey == "APPLICATION_VALIDITY_MONTHS")).FirstOrDefault();
        int validityMonths = appValidityMonthsSetting != null ? int.Parse(appValidityMonthsSetting.SettingValue) : 6;

        var application = new ApplicationEntity
        {
            ApplicationNumber = GenerateApplicationNumber(),
            ApplicantId = userId,
            ServiceType = request.ServiceType,
            LicenseCategoryId = request.LicenseCategoryId,
            BranchId = request.BranchId,
            Status = ApplicationStatus.Draft,
            PreferredLanguage = request.PreferredLanguage,
            SpecialNeeds = request.SpecialNeeds,
            DataAccuracyConfirmed = false,
            ExpiresAt = DateTime.UtcNow.AddMonths(validityMonths),
            CurrentStage = ApplicationStages.Creation
        };

        await _applicationRepository.AddAsync(application);

        // 5. Add Initial Status History
        var history = new ApplicationStatusHistory
        {
            ApplicationId = application.Id,
            FromStatus = ApplicationStatus.Draft, // Starting status
            ToStatus = ApplicationStatus.Draft,
            ChangedBy = userId,
            ChangedAt = DateTime.UtcNow,
            Notes = "Initial draft creation"
        };
        await _historyRepository.AddAsync(history);
        
        await _unitOfWork.SaveChangesAsync();

        // 5. Audit Logging
        await _auditService.LogAsync("CREATE_DRAFT_APPLICATION", "Application", application.Id.ToString(), null, application.ApplicationNumber);

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(application), "Application draft created successfully.");
    }

    public async Task<ApiResponse<ApplicationDto>> GetByIdAsync(Guid id, Guid userId, string role)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<ApplicationDto>.Fail(404, "Application not found.");

        // Security check
        if (role == Roles.Applicant && application.ApplicantId != userId)
            return ApiResponse<ApplicationDto>.Fail(403, "Unauthorized access.");

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(application));
    }

    public async Task<ApiResponse<PagedResult<ApplicationDto>>> GetListAsync(Guid userId, string role, ApplicationFilterRequest filters)
    {
        // Build base query with includes
        var baseQuery = _applicationRepository.Query()
            .Include(a => a.Applicant)
            .Include(a => a.LicenseCategory)
            .Where(a => !a.IsDeleted);

        // Apply role-scoped filter as per FR-007 and T024
        IQueryable<ApplicationEntity> query = role switch
        {
            Roles.Applicant => baseQuery.Where(a => a.ApplicantId == userId),
            Roles.Receptionist => baseQuery.Where(a => a.CurrentStage == ApplicationStages.Documents),
            Roles.Doctor => baseQuery.Where(a => a.CurrentStage == ApplicationStages.Medical),
            Roles.Examiner => baseQuery.Where(a => a.CurrentStage == ApplicationStages.Theory || a.CurrentStage == ApplicationStages.Practical),
            Roles.Manager or Roles.Admin or Roles.Security => baseQuery, // Full access for Manager/Admin/Security oversight
            _ => baseQuery.Where(a => false) // Invalid role - return nothing
        };

        // Apply Status filter (FR-009)
        if (filters.Status.HasValue)
        {
            query = query.Where(a => a.Status == filters.Status.Value);
        }

        // Apply CurrentStage filter (FR-009)
        if (!string.IsNullOrEmpty(filters.CurrentStage))
        {
            query = query.Where(a => a.CurrentStage == filters.CurrentStage);
        }

        // Apply ServiceType filter (FR-009)
        if (filters.ServiceType.HasValue)
        {
            query = query.Where(a => a.ServiceType == filters.ServiceType.Value);
        }

        // Apply LicenseCategoryId filter (FR-009)
        if (filters.LicenseCategoryId.HasValue)
        {
            query = query.Where(a => a.LicenseCategoryId == filters.LicenseCategoryId.Value);
        }

        // Apply BranchId filter (FR-009)
        if (filters.BranchId.HasValue)
        {
            query = query.Where(a => a.BranchId == filters.BranchId.Value);
        }

        // Apply Date range filter (CreatedAt) (FR-009)
        if (filters.From.HasValue)
        {
            query = query.Where(a => a.CreatedAt >= filters.From.Value);
        }

        if (filters.To.HasValue)
        {
            query = query.Where(a => a.CreatedAt <= filters.To.Value);
        }

        // Apply search filter (FR-009: ApplicationNumber or Applicant Name)
        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var searchLower = filters.Search.ToLower();
            query = query.Where(a => a.ApplicationNumber.ToLower().Contains(searchLower) || 
                                     (a.Applicant.FullNameAr != null && a.Applicant.FullNameAr.ToLower().Contains(searchLower)) ||
                                     (a.Applicant.FullNameEn != null && a.Applicant.FullNameEn.ToLower().Contains(searchLower)));
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Apply dynamic sorting (FR-009)
        var sortBy = (filters.SortBy ?? "createdat").ToLower();
        var sortDir = (filters.SortDir ?? "desc").ToLower();
        var isDescending = sortDir == "desc";

        query = sortBy switch
        {
            "applicationnumber" => isDescending ? query.OrderByDescending(a => a.ApplicationNumber) : query.OrderBy(a => a.ApplicationNumber),
            "status" => isDescending ? query.OrderByDescending(a => a.Status) : query.OrderBy(a => a.Status),
            "stage" => isDescending ? query.OrderByDescending(a => a.CurrentStage) : query.OrderBy(a => a.CurrentStage),
            "servicetype" => isDescending ? query.OrderByDescending(a => a.ServiceType) : query.OrderBy(a => a.ServiceType),
            _ => isDescending ? query.OrderByDescending(a => a.CreatedAt) : query.OrderBy(a => a.CreatedAt)
        };

        // Apply pagination (FR-009: default 20, max 100)
        var page = Math.Max(1, filters.Page);
        var pageSize = Math.Min(Math.Max(1, filters.PageSize), 100);
        
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Map to DTOs
        var dtos = _mapper.Map<List<ApplicationDto>>(items);

        var pagedResult = new PagedResult<ApplicationDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };

        return ApiResponse<PagedResult<ApplicationDto>>.Ok(pagedResult);
    }

    public async Task<ApiResponse<PagedResult<ApplicationSummaryDto>>> GetEmployeeQueueAsync(Guid userId, string role, ApplicationFilterRequest filters)
    {
        // Reuse GetListAsync logic but map to Summary DTO
        var listResult = await GetListAsync(userId, role, filters);
        
        if (!listResult.Success) return ApiResponse<PagedResult<ApplicationSummaryDto>>.Fail(listResult.StatusCode, listResult.Message);

        var summaryItems = listResult.Data!.Items.Select(a => new ApplicationSummaryDto
        {
            Id = a.Id.GetHashCode(),
            ApplicationNumber = a.ApplicationNumber,
            ApplicantName = a.ApplicantName,
            LicenseCategoryCode = a.LicenseCategoryCode,
            ServiceType = a.ServiceType.ToString(),
            CurrentStage = a.CurrentStage ?? "",
            Status = a.Status,
            SubmittedDate = a.SubmittedAt ?? a.CreatedAt,
            UpdatedAt = a.UpdatedAt ?? a.CreatedAt
        }).ToList();

        return ApiResponse<PagedResult<ApplicationSummaryDto>>.Ok(new PagedResult<ApplicationSummaryDto>
        {
            Items = summaryItems,
            TotalCount = listResult.Data.TotalCount,
            Page = listResult.Data.Page,
            PageSize = listResult.Data.PageSize
        });
    }

    public async Task<ApiResponse<List<Mojaz.Application.DTOs.Application.ApplicationTimelineDto>>> GetTimelineAsync(Guid id, Guid userId, string role)
    {
        // 1. Verify application exists
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<List<Mojaz.Application.DTOs.Application.ApplicationTimelineDto>>.Fail(404, "Application not found.");

        // 2. Enforce ownership/role-scoped access as per FR-007
        var isAuthorized = role switch
        {
            Roles.Applicant => application.ApplicantId == userId,
            Roles.Receptionist => application.CurrentStage == ApplicationStages.Documents,
            Roles.Doctor => application.CurrentStage == ApplicationStages.Medical,
            Roles.Examiner => application.CurrentStage == ApplicationStages.Theory || application.CurrentStage == ApplicationStages.Practical,
            Roles.Manager or Roles.Admin or Roles.Security => true,
            _ => false
        };

        if (!isAuthorized)
            return ApiResponse<List<Mojaz.Application.DTOs.Application.ApplicationTimelineDto>>.Fail(403, "Unauthorized access.");

        // 3. Query ApplicationStatusHistory ordered by ChangedAt ASC
        var historyRecords = await _historyRepository.FindAsync(h => h.ApplicationId == id);
        var orderedHistory = historyRecords.OrderBy(h => h.ChangedAt).ToList();

        // 4. Resolve ChangedBy to FullName
        var timelineDtos = new List<Mojaz.Application.DTOs.Application.ApplicationTimelineDto>();
        foreach (var record in orderedHistory)
        {
            var dto = new Mojaz.Application.DTOs.Application.ApplicationTimelineDto
            {
                Id = record.Id,
                FromStatus = record.FromStatus,
                ToStatus = record.ToStatus,
                Notes = record.Notes,
                ChangedByUserId = record.ChangedBy.ToString(),
                ChangedAt = record.ChangedAt
            };

            // Resolve ChangedBy to FullName
            if (record.ChangedBy != Guid.Empty)
            {
                var user = await _userRepository.GetByIdAsync(record.ChangedBy);
                dto.ChangedByName = user?.FullNameAr ?? user?.FullNameEn ?? "System";
            }
            else
            {
                dto.ChangedByName = "System";
            }

            timelineDtos.Add(dto);
        }

        return ApiResponse<List<Mojaz.Application.DTOs.Application.ApplicationTimelineDto>>.Ok(timelineDtos);
    }

    public async Task<ApiResponse<ApplicationWorkflowTimelineDto>> GetWorkflowTimelineAsync(Guid id, Guid userId, string role)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<ApplicationWorkflowTimelineDto>.Fail(404, "Application not found.");

        // Auth check - same as GetTimelineAsync
        if (role == Roles.Applicant && application.ApplicantId != userId)
            return ApiResponse<ApplicationWorkflowTimelineDto>.Fail(403, "Unauthorized.");

        var histories = (await _historyRepository.FindAsync(h => h.ApplicationId == id)).OrderBy(h => h.ChangedAt).ToList();

        var timeline = new ApplicationWorkflowTimelineDto
        {
            ApplicationId = id,
            CurrentStageNumber = GetStageNumber(application.CurrentStage)
        };

        var stageMeta = new[]
        {
            new { NameAr = "التقديم", NameEn = "Creation", Stage = ApplicationStages.Creation },
            new { NameAr = "المستندات", NameEn = "Documents", Stage = ApplicationStages.Documents },
            new { NameAr = "الدفعة الأولى", NameEn = "Initial Payment", Stage = ApplicationStages.InitialPayment },
            new { NameAr = "الفحص الطبي", NameEn = "Medical", Stage = ApplicationStages.Medical },
            new { NameAr = "التدريب", NameEn = "Training", Stage = ApplicationStages.Training },
            new { NameAr = "النظري", NameEn = "Theory", Stage = ApplicationStages.Theory },
            new { NameAr = "العملي", NameEn = "Practical", Stage = ApplicationStages.Practical },
            new { NameAr = "الموافقة", NameEn = "Final Approval", Stage = ApplicationStages.FinalApproval },
            new { NameAr = "الرسوم", NameEn = "Issuance Payment", Stage = ApplicationStages.IssuancePayment },
            new { NameAr = "الإصدار", NameEn = "Issuance", Stage = ApplicationStages.Issuance }
        };

        for (int i = 0; i < stageMeta.Length; i++)
        {
            var meta = stageMeta[i];
            var stageNum = i + 1;
            
            var dto = new Mojaz.Application.DTOs.Application.TimelineStageDto
            {
                StageNumber = stageNum,
                NameAr = meta.NameAr,
                NameEn = meta.NameEn,
                State = "future"
            };

            if (stageNum < timeline.CurrentStageNumber)
            {
                dto.State = "completed";
                // Try to find the completion date from history records where they transitioned AWAY from this stage
                // Simplified for MVP: Use the earliest record after creation for following stages
                var completionRecord = histories.FirstOrDefault(h => GetStageNumber(h.Notes ?? "") == stageNum); // Placeholder logic
                dto.CompletedAt = completionRecord?.ChangedAt;
            }
            else if (stageNum == timeline.CurrentStageNumber)
            {
                dto.State = application.Status == ApplicationStatus.Rejected ? "failed" : "current";
            }

            timeline.Stages.Add(dto);
        }

        return ApiResponse<ApplicationWorkflowTimelineDto>.Ok(timeline);
    }

    private int GetStageNumber(string stage)
    {
        if (string.IsNullOrEmpty(stage)) return 1;
        if (stage.StartsWith("01")) return 1;
        if (stage.StartsWith("02")) return 2;
        if (stage.StartsWith("03")) return 3;
        if (stage.StartsWith("04")) return 4;
        if (stage.StartsWith("05")) return 5;
        if (stage.StartsWith("06")) return 6;
        if (stage.StartsWith("07")) return 7;
        if (stage.StartsWith("08")) return 8;
        if (stage.StartsWith("09")) return 9;
        if (stage.StartsWith("10")) return 10;
        return 1;
    }

    public async Task<ApiResponse<ApplicationDto>> SubmitAsync(Guid id, SubmitApplicationRequest request, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<ApplicationDto>.Fail(404, "Application not found.");

        if (application.ApplicantId != userId)
            return ApiResponse<ApplicationDto>.Fail(403, "Unauthorized.");

        if (application.Status != ApplicationStatus.Draft)
            return ApiResponse<ApplicationDto>.Fail(400, "Only draft applications can be submitted.");

        // 1. Data Accuracy Check
        if (!request.DataAccuracyConfirmed)
            return ApiResponse<ApplicationDto>.Fail(400, "Data accuracy must be confirmed.");

        // 2. Completeness Check
        var completenessResult = await CheckCompletenessAsync(application, userId);
        if (!completenessResult.IsEligible)
            return ApiResponse<ApplicationDto>.Fail(400, string.Join(" ", completenessResult.Reasons));

        // 3. Re-Verify Gate 1 Eligibility
        var eligibilityResult = await CheckEligibilityAsync(userId, new EligibilityCheckRequest { LicenseCategoryId = application.LicenseCategoryId });
        if (!eligibilityResult.Data!.IsEligible)
            return ApiResponse<ApplicationDto>.Fail(400, "Eligibility check failed at submission: " + string.Join(" ", eligibilityResult.Data.Reasons));

        var oldStatus = application.Status;

        // 4. Update Application
        application.Status = ApplicationStatus.Submitted;
        application.SubmittedAt = DateTime.UtcNow;
        application.DataAccuracyConfirmed = true;
        application.CurrentStage = ApplicationStages.Documents;

        _applicationRepository.Update(application);

        // 5. Add Status History
        var history = new ApplicationStatusHistory
        {
            ApplicationId = application.Id,
            FromStatus = oldStatus,
            ToStatus = application.Status,
            ChangedBy = userId,
            ChangedAt = DateTime.UtcNow,
            Notes = "Application submitted by applicant"
        };
        await _historyRepository.AddAsync(history);

        await _unitOfWork.SaveChangesAsync();

        // 6. Audit Log
        await _auditService.LogAsync("SUBMIT_APPLICATION", "Application", application.Id.ToString(), oldStatus.ToString(), application.Status.ToString());

        // 7. Notifications
        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = userId,
            ApplicationId = application.Id,
            EventType = NotificationEventType.ApplicationSubmitted,
            TitleAr = "تم تقديم الطلب بنجاح",
            TitleEn = "Application Submitted Successfully",
            MessageAr = $"تم تقديم طلبك بنجاح برقم: {application.ApplicationNumber}",
            MessageEn = $"Your application has been submitted successfully with number: {application.ApplicationNumber}",
            InApp = true
        });

        // Enqueue Email Notification
        var user = await _userRepository.GetByIdAsync(userId);
        var email = user?.Email ?? string.Empty;
        var name = user?.FullNameAr ?? string.Empty;
        _backgroundJobClient.Enqueue<IEmailService>(x => x.SendTemplatedAsync(new TemplatedEmailRequest
        {
            RecipientEmail = email,
            TemplateName = "ApplicationSubmitted",
            TemplateData = new { application.ApplicationNumber, Name = name },
            ReferenceId = application.Id.ToString()
        }));

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(application), "Application submitted successfully.");
    }

    private async Task<EligibilityCheckResult> CheckCompletenessAsync(ApplicationEntity app, Guid userId)
    {
        var reasons = new List<string>();
        var user = await _userRepository.GetByIdAsync(userId);

        if (user == null) { reasons.Add("User profile not found."); return new EligibilityCheckResult { IsEligible = false, Reasons = reasons }; }

        // User Profile Check
        if (string.IsNullOrEmpty(user.NationalId)) reasons.Add("National ID is missing in profile.");
        if (user.DateOfBirth == default) reasons.Add("Date of birth is missing in profile.");
        if (string.IsNullOrEmpty(user.Gender)) reasons.Add("Gender is missing in profile.");
        if (string.IsNullOrEmpty(user.Nationality)) reasons.Add("Nationality is missing in profile.");

        // Application Data Check
        if (app.LicenseCategoryId == Guid.Empty) reasons.Add("License category is not selected.");
        if (app.BranchId == null || app.BranchId == Guid.Empty) reasons.Add("Preferred branch is not selected.");
        
        return new EligibilityCheckResult { IsEligible = !reasons.Any(), Reasons = reasons };
    }

    public async Task<bool> IsOwnerAsync(Guid applicationId, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        return application != null && application.ApplicantId == userId;
    }

    public async Task<ApiResponse<ApplicationDto>> UpdateDraftAsync(Guid id, UpdateDraftRequest request, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<ApplicationDto>.Fail(404, "Application not found.");

        if (application.ApplicantId != userId)
            return ApiResponse<ApplicationDto>.Fail(403, "Unauthorized.");

        if (application.Status != ApplicationStatus.Draft && application.Status != ApplicationStatus.Submitted)
            return ApiResponse<ApplicationDto>.Fail(400, "Only draft or submitted applications can be modified.");

        if (request.ServiceType.HasValue) application.ServiceType = request.ServiceType.Value;
        if (request.LicenseCategoryId.HasValue) application.LicenseCategoryId = request.LicenseCategoryId.Value;
        if (request.BranchId.HasValue) application.BranchId = request.BranchId;
        if (request.PreferredLanguage != null) application.PreferredLanguage = request.PreferredLanguage;
        if (request.SpecialNeeds.HasValue) application.SpecialNeeds = request.SpecialNeeds.Value;

        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync("UPDATE_DRAFT_APPLICATION", "Application", application.Id.ToString(), null, application.ApplicationNumber);

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(application), "Application draft updated.");
    }

    public async Task<ApiResponse<bool>> CancelAsync(Guid id, string reason, Guid userId, string role)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<bool>.Fail(404, "Application not found.");

        // Terminal state guard - block if status is already terminal
        var terminalStatuses = new[]
        {
            ApplicationStatus.Cancelled,
            ApplicationStatus.Expired,
            ApplicationStatus.Issued,
            ApplicationStatus.Active,
            ApplicationStatus.Rejected
        };

        if (terminalStatuses.Contains(application.Status))
            return ApiResponse<bool>.Fail(400, "Application cannot be cancelled in current state.");

        // Ownership check - allow Manager/Admin/Receptionist to cancel any application as per FR-008
        var isAuthorizedRole = role == Roles.Manager || role == Roles.Admin || role == Roles.Receptionist;
        if (!isAuthorizedRole && application.ApplicantId != userId)
            return ApiResponse<bool>.Fail(403, "Unauthorized.");

        var oldStatus = application.Status;

        // Update application
        application.Status = ApplicationStatus.Cancelled;
        application.CancelledAt = DateTime.UtcNow;
        application.CancellationReason = reason;

        _applicationRepository.Update(application);

        // Add ApplicationStatusHistory record with reason in Notes
        var history = new ApplicationStatusHistory
        {
            ApplicationId = application.Id,
            FromStatus = oldStatus,
            ToStatus = ApplicationStatus.Cancelled,
            ChangedBy = userId,
            ChangedAt = DateTime.UtcNow,
            Notes = $"Cancellation reason: {reason}"
        };
        await _historyRepository.AddAsync(history);

        await _unitOfWork.SaveChangesAsync();

        // Write AuditLog entry
        await _auditService.LogAsync("CANCEL_APPLICATION", "Application", application.Id.ToString(), oldStatus.ToString(), ApplicationStatus.Cancelled.ToString());

        // Create in-app notification synchronously
        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = userId,
            ApplicationId = application.Id,
            EventType = NotificationEventType.ApplicationCancelled,
            TitleAr = "تم إلغاء الطلب",
            TitleEn = "Application Cancelled",
            MessageAr = $"تم إلغاء طلبك برقم: {application.ApplicationNumber}",
            MessageEn = $"Your application has been cancelled with number: {application.ApplicationNumber}",
            InApp = true
        });

        // Enqueue Hangfire Push notification job
        _backgroundJobClient.Enqueue<INotificationService>(x => x.SendAsync(new NotificationRequest
        {
            UserId = userId,
            ApplicationId = application.Id,
            EventType = NotificationEventType.ApplicationCancelled,
            TitleAr = "تم إلغاء الطلب",
            TitleEn = "Application Cancelled",
            MessageAr = $"تم إلغاء طلبك برقم: {application.ApplicationNumber}",
            MessageEn = $"Your application has been cancelled with number: {application.ApplicationNumber}",
            Push = true
        }));

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

        return ApiResponse<bool>.Ok(true, "Status updated.");
    }

    public async Task<ApiResponse<bool>> ConfirmAppointmentAsync(Guid appointmentId, Guid userId)
    {
        // Fetch appointment and user
        var appointment = await _applicationRepository.GetByIdAsync(appointmentId);
        var user = await _userRepository.GetByIdAsync(userId);
        if (appointment == null || user == null)
            return ApiResponse<bool>.Fail(404, "Appointment or user not found.");

        // Send appointment-confirmed email
        if (!string.IsNullOrEmpty(user.Email))
        {
            var emailData = new AppointmentConfirmedEmailData
            {
                AppointmentTypeAr = appointment.ServiceType.ToString(), // Adjust as needed
                AppointmentTypeEn = appointment.ServiceType.ToString(), // Adjust as needed
                DateTimeAr = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm"), // Replace with actual date/time
                DateTimeEn = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm"),
                LocationAr = appointment.BranchId.ToString() ?? "N/A", // Replace with actual location name if available
                LocationEn = appointment.BranchId.ToString() ?? "N/A"
            };
            var emailRequest = new TemplatedEmailRequest
            {
                RecipientEmail = user.Email,
                TemplateName = "appointment-confirmed",
                TemplateData = emailData,
                ReferenceId = appointment.Id.ToString()
            };
            _backgroundJobClient.Enqueue(() => _emailService.SendTemplatedAsync(emailRequest));
        }

        return ApiResponse<bool>.Ok(true, "Appointment confirmed and email sent.");
    }

    private string GenerateApplicationNumber()
    {
        var year = DateTime.UtcNow.Year;
        var random = Random.Shared.Next(10000000, 99999999);
        return $"MOJ-{year}-{random:D8}";
    }
}
