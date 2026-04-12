using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Mojaz.Application.DTOs.Application;
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

        // Error Null values 
        //var ageLimitSetting = (await _settingsRepository.FindAsync(s => s.SettingKey == $"MIN_AGE_CATEGORY_{category.Code}")).FirstOrDefault();
        //if (ageLimitSetting == null) return ApiResponse<ApplicationDto>.Fail(400, "System setting error: Age limit not found.");

        // أضفنا علامة الاستقهام بعد القوسين لضمان عدم الانهيار إذا لم تجد القاعدة شيئاً
        var settingsResult = await _settingsRepository.FindAsync(s => s.SettingKey == $"MIN_AGE_CATEGORY_{category.Code}");
        var ageLimitSetting = settingsResult?.FirstOrDefault();
        if (ageLimitSetting == null)
            return ApiResponse<ApplicationDto>.Fail(400, "System setting error: Age limit not found.");

        if (!int.TryParse(ageLimitSetting.SettingValue, out int minAge))
            minAge = 18; // Default fallback

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return ApiResponse<ApplicationDto>.Fail(404, "User not found.");

        var today = DateTime.UtcNow;
        var age = today.Year - user.DateOfBirth.Year;
        if (user.DateOfBirth.Date > today.AddYears(-age)) age--;

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

    public async Task<ApiResponse<PagedResult<ApplicationDto>>> GetListAsync(Guid userId, string role, int page = 1, int pageSize = 20)
    {
        Expression<Func<ApplicationEntity, bool>> predicate = a => true;
        
        if (role == Roles.Applicant)
        {
            predicate = a => a.ApplicantId == userId;
        }

        var apps = await _applicationRepository.FindAsync(predicate);
        var total = apps.Count;
        var pagedApps = apps.OrderByDescending(a => a.CreatedAt)
                           .Skip((page - 1) * pageSize)
                           .Take(pageSize)
                           .ToList();

        var result = new PagedResult<ApplicationDto>
        {
            Items = _mapper.Map<List<ApplicationDto>>(pagedApps),
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
        
        return ApiResponse<PagedResult<ApplicationDto>>.Ok(result);
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

        application.ServiceType = request.ServiceType;
        application.LicenseCategoryId = request.LicenseCategoryId;
        application.BranchId = request.BranchId;
        application.PreferredLanguage = request.PreferredLanguage;
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

        return ApiResponse<bool>.Ok(true, "Status updated.");
    }

    private string GenerateApplicationNumber()
    {
        var year = DateTime.UtcNow.Year;
        var random = Random.Shared.Next(10000000, 99999999);
        return $"MOJ-{year}-{random:D8}";
    }
}
