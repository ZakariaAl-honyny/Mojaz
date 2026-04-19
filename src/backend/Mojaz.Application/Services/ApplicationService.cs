using AutoMapper;
using Microsoft.EntityFrameworkCore;
using DrivingLicenseIssuanceSystem.Application.DTOs.Application;
using DrivingLicenseIssuanceSystem.Application.Interfaces.Services;
using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using DrivingLicenseIssuanceSystem.Domain.Interfaces;
using DrivingLicenseIssuanceSystem.Shared;
using DrivingLicenseIssuanceSystem.Shared.Constants;
using DrivingLicenseIssuanceSystem.Application.DTOs.LicenseReplacement;
using DrivingLicenseIssuanceSystem.Application.Applications.Dtos;
using DrivingLicenseIssuanceSystem.Application.DTOs.Application.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

using ApplicationEntity = DrivingLicenseIssuanceSystem.Domain.Entities.Application;

namespace DrivingLicenseIssuanceSystem.Application.Services;

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

    public ApplicationService(
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<User> userRepository,
        IRepository<LicenseCategory> categoryRepository,
        IRepository<SystemSetting> settingsRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IAuditService auditService,
        INotificationService notificationService)
    {
        _applicationRepository = applicationRepository;
        _userRepository = userRepository;
        _categoryRepository = categoryRepository;
        _settingsRepository = settingsRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _auditService = auditService;
        _notificationService = notificationService;
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
        user.Gender = request.Gender;
        user.Nationality = request.Nationality;
        user.Address = request.Address;
        user.City = request.City;
        user.Region = request.Region;
        user.ApplicantType = request.ApplicantType;
        
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
        Expression<Func<ApplicationEntity, bool>> predicate = a => true;
         
        if (role == Roles.Applicant)
        {
            predicate = a => a.ApplicantId == userId;
        }
        
        // Apply filters
        if (filters.Status.HasValue)
            predicate = predicate.And(a => a.Status == filters.Status.Value);
            
        if (!string.IsNullOrEmpty(filters.CurrentStage))
            predicate = predicate.And(a => a.CurrentStage == filters.CurrentStage);
            
        if (filters.ServiceType.HasValue)
            predicate = predicate.And(a => a.ServiceType == filters.ServiceType.Value);
            
        if (filters.LicenseCategoryId.HasValue)
            predicate = predicate.And(a => a.LicenseCategoryId == filters.LicenseCategoryId.Value);
            
        if (filters.BranchId.HasValue)
            predicate = predicate.And(a => a.BranchId == filters.BranchId.Value);
            
        if (!string.IsNullOrEmpty(filters.Search))
        {
            var search = filters.Search.ToLower();
            predicate = predicate.And(a => 
                (a.Applicant != null && a.Applicant.FullNameAr.ToLower().Contains(search)) ||
                (a.Applicant != null && a.Applicant.FullNameEn.ToLower().Contains(search)) ||
                a.ApplicationNumber.Contains(search));
        }
        
        if (filters.From.HasValue)
            predicate = predicate.And(a => a.CreatedAt >= filters.From.Value);
            
        if (filters.To.HasValue)
            predicate = predicate.And(a => a.CreatedAt <= filters.To.Value);

        var apps = await _applicationRepository.FindAsync(predicate);
        var total = apps.Count;
        
        // Apply sorting
        var sortedApps = filters.SortBy?.ToLower() switch
        {
            "createdat" => filters.SortDir?.ToLower() == "asc" 
                ? apps.OrderBy(a => a.CreatedAt) 
                : apps.OrderByDescending(a => a.CreatedAt),
            "applicationnumber" => filters.SortDir?.ToLower() == "asc" 
                ? apps.OrderBy(a => a.ApplicationNumber) 
                : apps.OrderByDescending(a => a.ApplicationNumber),
            "status" => filters.SortDir?.ToLower() == "asc" 
                ? apps.OrderBy(a => a.Status) 
                : apps.OrderByDescending(a => a.Status),
            _ => filters.SortDir?.ToLower() == "asc" 
                ? apps.OrderBy(a => a.CreatedAt) 
                : apps.OrderByDescending(a => a.CreatedAt)
        };
        
        var pagedApps = sortedApps
                           .Skip((filters.Page - 1) * filters.PageSize)
                           .Take(filters.PageSize)
                           .ToList();

        var result = new PagedResult<ApplicationDto>
        {
            Items = _mapper.Map<List<ApplicationDto>>(pagedApps),
            TotalCount = total,
            Page = filters.Page,
            PageSize = filters.PageSize
        };
        
        return ApiResponse<PagedResult<ApplicationDto>>.Ok(result);
    }

    public async Task<ApiResponse<PagedResult<ApplicationSummaryDto>>> GetEmployeeQueueAsync(Guid userId, string role, ApplicationFilterRequest filters)
    {
        // Only employees/managers can access the queue
        if (role != Roles.Doctor && role != Roles.Examiner && role != Roles.Manager && role != Roles.Admin && role != Roles.Receptionist && role != Roles.Security)
            return ApiResponse<PagedResult<ApplicationSummaryDto>>.Fail(403, "Unauthorized access.");

        Expression<Func<ApplicationEntity, bool>> predicate = a => 
            a.Status == ApplicationStatus.Submitted || 
            a.Status == ApplicationStatus.InReview ||
            a.Status == ApplicationStatus.Approved;
         
        // Apply filters
        if (filters.Status.HasValue)
            predicate = predicate.And(a => a.Status == filters.Status.Value);
            
        if (!string.IsNullOrEmpty(filters.CurrentStage))
            predicate = predicate.And(a => a.CurrentStage == filters.CurrentStage);
            
        if (filters.ServiceType.HasValue)
            predicate = predicate.And(a => a.ServiceType == filters.ServiceType.Value);
            
        if (filters.LicenseCategoryId.HasValue)
            predicate = predicate.And(a => a.LicenseCategoryId == filters.LicenseCategoryId.Value);
            
        if (filters.BranchId.HasValue)
            predicate = predicate.And(a => a.BranchId == filters.BranchId.Value);
            
        if (!string.IsNullOrEmpty(filters.Search))
        {
            var search = filters.Search.ToLower();
            predicate = predicate.And(a => 
                (a.Applicant != null && a.Applicant.FullNameAr.ToLower().Contains(search)) ||
                (a.Applicant != null && a.Applicant.FullNameEn.ToLower().Contains(search)) ||
                a.ApplicationNumber.Contains(search));
        }
        
        if (filters.From.HasValue)
            predicate = predicate.And(a => a.CreatedAt >= filters.From.Value);
            
        if (filters.To.HasValue)
            predicate = predicate.And(a => a.CreatedAt <= filters.To.Value);

        var apps = await _applicationRepository.FindAsync(predicate);
        var total = apps.Count;
        
        // Apply sorting
        var sortedApps = filters.SortBy?.ToLower() switch
        {
            "createdat" => filters.SortDir?.ToLower() == "asc" 
                ? apps.OrderBy(a => a.CreatedAt) 
                : apps.OrderByDescending(a => a.CreatedAt),
            "applicationnumber" => filters.SortDir?.ToLower() == "asc" 
                ? apps.OrderBy(a => a.ApplicationNumber) 
                : apps.OrderByDescending(a => a.ApplicationNumber),
            "status" => filters.SortDir?.ToLower() == "asc" 
                ? apps.OrderBy(a => a.Status) 
                : apps.OrderByDescending(a => a.Status),
            _ => filters.SortDir?.ToLower() == "asc" 
                ? apps.OrderBy(a => a.CreatedAt) 
                : apps.OrderByDescending(a => a.CreatedAt)
        };
        
        var pagedApps = sortedApps
                           .Skip((filters.Page - 1) * filters.PageSize)
                           .Take(filters.PageSize)
                           .ToList();

        var result = new PagedResult<ApplicationSummaryDto>
        {
            Items = _mapper.Map<List<ApplicationSummaryDto>>(pagedApps),
            TotalCount = total,
            Page = filters.Page,
            PageSize = filters.PageSize
        };
        
        return ApiResponse<PagedResult<ApplicationSummaryDto>>.Ok(result);
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

        if (application.Status != ApplicationStatus.Draft)
            return ApiResponse<ApplicationDto>.Fail(400, "Only draft applications can be updated.");

        application.ServiceType = request.ServiceType ?? application.ServiceType;
        application.LicenseCategoryId = request.LicenseCategoryId ?? application.LicenseCategoryId;
        application.BranchId = request.BranchId ?? application.BranchId;
        application.PreferredLanguage = request.PreferredLanguage ?? application.PreferredLanguage;
        application.SpecialNeeds = request.SpecialNeeds ?? application.SpecialNeeds;

        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(application), "Application draft updated.");
    }

    public async Task<ApiResponse<ApplicationDto>> SubmitAsync(Guid id, SubmitApplicationRequest request, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<ApplicationDto>.Fail(404, "Application not found.");

        if (application.ApplicantId != userId)
            return ApiResponse<ApplicationDto>.Fail(403, "Unauthorized.");

        if (application.Status != ApplicationStatus.Draft)
            return ApiResponse<ApplicationDto>.Fail(400, "Only draft applications can be submitted.");

        // Update application with final details
        application.DataAccuracyConfirmed = request.DataAccuracyConfirmed;
        application.Status = ApplicationStatus.Submitted;
        application.SubmittedAt = DateTime.UtcNow;

        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        // Send notification
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

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(application), "Application submitted successfully.");
    }

    public async Task<ApiResponse<bool>> CancelAsync(Guid id, string reason, Guid userId, string role)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<bool>.Fail(404, "Application not found.");

        // Security check: applicants can only cancel their own applications
        if (role == Roles.Applicant && application.ApplicantId != userId)
            return ApiResponse<bool>.Fail(403, "Unauthorized.");

        if (application.Status == ApplicationStatus.Active || application.Status == ApplicationStatus.Cancelled)
              return ApiResponse<bool>.Fail(400, "Application cannot be cancelled in current state.");

        application.Status = ApplicationStatus.Cancelled;
        application.CancelledAt = DateTime.UtcNow;
        application.CancellationReason = reason;

        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        // Send notification
        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = userId,
            ApplicationId = application.Id,
            EventType = NotificationEventType.ApplicationCancelled,
            TitleAr = "تم إلغاء الطلب",
            TitleEn = "Application Cancelled",
            MessageAr = $"تم إلغاء طلبك. السبب: {reason}",
            MessageEn = $"Your application has been cancelled. Reason: {reason}"
        });

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

    private string GenerateApplicationNumber()
    {
        var year = DateTime.UtcNow.Year;
        var random = Random.Shared.Next(10000000, 99999999);
        return $"MOJ-{year}-{random:D8}";
    }

    public async Task<ApiResponse<List<DrivingLicenseIssuanceSystem.Application.DTOs.Application.ApplicationTimelineDto>>> GetTimelineAsync(Guid id, Guid userId, string role)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<List<DrivingLicenseIssuanceSystem.Application.DTOs.Application.ApplicationTimelineDto>>.Fail(404, "Application not found.");

        // Security check
        if (role == Roles.Applicant && application.ApplicantId != userId)
            return ApiResponse<List<DrivingLicenseIssuanceSystem.Application.DTOs.Application.ApplicationTimelineDto>>.Fail(403, "Unauthorized access.");

        // Get timeline from workflow table or application status history
        // For now, we'll return a simple timeline based on application status
        var timeline = new List<DrivingLicenseIssuanceSystem.Application.DTOs.Application.ApplicationTimelineDto>
        {
            new DrivingLicenseIssuanceSystem.Application.DTOs.Application.ApplicationTimelineDto
            {
                Id = Guid.NewGuid(),
                FromStatus = ApplicationStatus.Draft,
                ToStatus = application.Status,
                Notes = $"Application status changed to {application.Status}",
                ChangedByUserId = userId.ToString(),
                ChangedByName = "System",
                ChangedAt = application.UpdatedAt ?? application.CreatedAt
            }
        };

        return ApiResponse<List<DrivingLicenseIssuanceSystem.Application.DTOs.Application.ApplicationTimelineDto>>.Ok(timeline);
    }

    public async Task<ApiResponse<ApplicationWorkflowTimelineDto>> GetWorkflowTimelineAsync(Guid id, Guid userId, string role)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null) return ApiResponse<ApplicationWorkflowTimelineDto>.Fail(404, "Application not found.");

        // Security check
        if (role == Roles.Applicant && application.ApplicantId != userId)
            return ApiResponse<ApplicationWorkflowTimelineDto>.Fail(403, "Unauthorized access.");

        // Build workflow timeline from application stages
        var workflowTimeline = new ApplicationWorkflowTimelineDto
        {
            ApplicationId = application.Id,
            CurrentStageNumber = GetStageNumberFromDescription(application.CurrentStage ?? "01: Application Submission"),
            Stages = BuildApplicationStages(application)
        };

        return ApiResponse<ApplicationWorkflowTimelineDto>.Ok(workflowTimeline);
    }

    public async Task<ApiResponse<EligibilityCheckResult>> CheckEligibilityAsync(Guid userId, EligibilityCheckRequest request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return ApiResponse<EligibilityCheckResult>.Fail(404, "User not found.");

        var category = await _categoryRepository.GetByIdAsync(request.LicenseCategoryId);
        if (category == null) return ApiResponse<EligibilityCheckResult>.Fail(400, "Invalid license category.");

        var ageLimitSetting = (await _settingsRepository.FindAsync(s => s.SettingKey == $"MIN_AGE_CATEGORY_{category.Code}")).FirstOrDefault();
        if (ageLimitSetting == null) return ApiResponse<EligibilityCheckResult>.Fail(400, "System setting error: Age limit not found.");

        if (!int.TryParse(ageLimitSetting.SettingValue, out int minAge))
            minAge = 18; // Default fallback

        var today = DateTime.UtcNow;
        var dob = user.DateOfBirth ?? DateTime.UtcNow.AddYears(-18); // Default to 18 if null
        var age = today.Year - dob.Year;
        if (dob.Date > today.AddYears(-age)) age--;

        var isEligible = age >= minAge;
        var reasons = new List<string>();

        if (!isEligible)
        {
            reasons.Add($"Minimum age for category {category.Code} is {minAge}. Your age is {age}.");
        }

        // Check for existing active application
        var activeApps = await _applicationRepository.FindAsync(a => a.ApplicantId == userId && 
            (a.Status != ApplicationStatus.Active && a.Status != ApplicationStatus.Cancelled && a.Status != ApplicationStatus.Rejected));

        if (activeApps.Any())
        {
            isEligible = false;
            reasons.Add("You already have an active application in progress.");
        }

        return ApiResponse<EligibilityCheckResult>.Ok(new EligibilityCheckResult
        {
            IsEligible = isEligible,
            Reasons = reasons
        });
    }

    public async Task<ApiResponse<ApplicationDto>> UpgradeAsync(UpgradeApplicationRequest request, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(request.CurrentLicenseId);
        if (application == null) return ApiResponse<ApplicationDto>.Fail(404, "Current license not found.");

        if (application.ApplicantId != userId)
            return ApiResponse<ApplicationDto>.Fail(403, "Unauthorized.");

        // Check if license is active and valid for upgrade
        if (application.Status != ApplicationStatus.Approved)
            return ApiResponse<ApplicationDto>.Fail(400, "Only approved licenses can be upgraded.");

        var targetCategory = await _categoryRepository.GetByIdAsync(request.TargetCategoryId);
        if (targetCategory == null) return ApiResponse<ApplicationDto>.Fail(404, "Target license category not found.");

        // Check age requirements for target category
        var ageLimitSetting = (await _settingsRepository.FindAsync(s => s.SettingKey == $"MIN_AGE_CATEGORY_{targetCategory.Code}")).FirstOrDefault();
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
            return ApiResponse<ApplicationDto>.Fail(400, $"Minimum age for category {targetCategory.Code} is {minAge}. Your age is {age}.");

        // Create new application for upgrade
        var upgradeApplication = new ApplicationEntity
        {
            ApplicationNumber = GenerateApplicationNumber(),
            ApplicantId = userId,
            ServiceType = application.ServiceType, // Keep same service type
            LicenseCategoryId = request.TargetCategoryId,
            BranchId = request.BranchId,
            Status = ApplicationStatus.Submitted,
            CurrentStage = "01: Application Submission",
            PreferredLanguage = request.PreferredLanguage,
            SpecialNeeds = application.SpecialNeeds,
            DataAccuracyConfirmed = request.DataAccuracyConfirmed,
            ExpiresAt = DateTime.UtcNow.AddMonths(6) // Default validity
        };

        await _applicationRepository.AddAsync(upgradeApplication);
        await _unitOfWork.SaveChangesAsync();

        // Send notification
        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = userId,
            ApplicationId = upgradeApplication.Id,
            EventType = NotificationEventType.ApplicationSubmitted,
            TitleAr = "تم تقديم طلب ترقية",
            TitleEn = "Upgrade Application Submitted",
            MessageAr = $"تم تقديم طلب ترقيتك بنجاح. رقم الطلب: {upgradeApplication.ApplicationNumber}",
            MessageEn = $"Your upgrade application has been submitted successfully. Number: {upgradeApplication.ApplicationNumber}"
        });

        return ApiResponse<ApplicationDto>.Ok(_mapper.Map<ApplicationDto>(upgradeApplication), "Upgrade application submitted successfully.");
    }

    // Helper methods
    private int GetStageNumberFromDescription(string stageDescription)
    {
        if (string.IsNullOrEmpty(stageDescription)) return 1;
        
        // Extract number from format like "01: Application Submission"
        var match = System.Text.RegularExpressions.Regex.Match(stageDescription, @"^(\d+)");
        if (match.Success && int.TryParse(match.Value, out int number))
            return number;
        
        return 1; // Default to stage 1
    }

    private List<DrivingLicenseIssuanceSystem.Application.DTOs.Application.TimelineStageDto> BuildApplicationStages(ApplicationEntity application)
    {
        var stages = new List<DrivingLicenseIssuanceSystem.Application.DTOs.Application.TimelineStageDto>();
        
        // Define the standard application stages
        var stageDefinitions = new[]
        {
            new { Number = 1, NameAr = "اختيار الخدمة", NameEn = "Service Selection" },
            new { Number = 2, NameAr = "فئة الرخصة", NameEn = "License Category" },
            new { Number = 3, NameAr = "البيانات الشخصية", NameEn = "Personal Information" },
            new { Number = 4, NameAr = "تفاصيل الطلب", NameEn = "Application Details" },
            new { Number = 5, NameAr = "المراجعة والتقديم", NameEn = "Review and Submit" },
            new { Number = 6, NameAr = "الفحص الطبي", NameEn = "Medical Examination" },
            new { Number = 7, NameAr = "اختبار النظرية", NameEn = "Theory Test" },
            new { Number = 8, NameAr = "اختبار العملي", NameEn = "Practical Test" },
            new { Number = 9, NameAr = "الإصدار", NameEn = "Issuance" }
        };

        // Determine current stage based on application status and current stage description
        int currentStageNum = GetStageNumberFromDescription(application.CurrentStage ?? "01: Application Submission");
        
        foreach (var stageDef in stageDefinitions)
        {
            string state;
            if (stageDef.Number < currentStageNum)
            {
                state = "completed";
            }
            else if (stageDef.Number == currentStageNum)
            {
                // Determine if current, failed, or pending based on application status
                if (application.Status == ApplicationStatus.Rejected)
                {
                    // Check if failure happened at this stage
                    state = "failed";
                }
                else if (application.Status == ApplicationStatus.Approved && stageDef.Number == 9)
                {
                    state = "completed"; // Final stage completed
                }
                else
                {
                    state = "current";
                }
            }
            else
            {
                state = "future";
            }

            stages.Add(new DrivingLicenseIssuanceSystem.Application.DTOs.Application.TimelineStageDto
            {
                StageNumber = stageDef.Number,
                NameAr = stageDef.NameAr,
                NameEn = stageDef.NameEn,
                State = state,
                CompletedAt = state == "completed" ? application.UpdatedAt : (DateTime?)null,
                ActorName = state == "completed" || state == "current" ? 
                    (application.Applicant != null ? $"{application.Applicant.FullNameAr} {application.Applicant.FullNameEn}" : "System") : null,
                ActorRole = state == "completed" || state == "current" ? 
                    (application.Applicant != null ? application.Applicant.Role.ToString() : "System") : null,
                OutcomeNote = state == "failed" ? 
                    "Application failed at this stage" : 
                    state == "completed" ? 
                    "Stage completed successfully" : 
                    null
            });
        }

        return stages;
    }
}
