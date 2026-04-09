using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.DTOs.Email;
using Mojaz.Application.DTOs.Email.Templates;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using Hangfire;
using System;
using System.Linq;
using System.Threading.Tasks;

using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Application.Services;

public class LicenseService : ILicenseService
{
    private readonly IRepository<License> _licenseRepository;
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;
    private readonly IEmailService _emailService;
    private readonly IBackgroundJobClient _backgroundJobClient;

    public LicenseService(
        IRepository<License> licenseRepository,
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<User> userRepository,
        IUnitOfWork unitOfWork,
        INotificationService notificationService,
        IEmailService emailService,
        IBackgroundJobClient backgroundJobClient)
    {
        _licenseRepository = licenseRepository;
        _applicationRepository = applicationRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _emailService = emailService;
        _backgroundJobClient = backgroundJobClient;
    }

    public async Task<ApiResponse<bool>> IssueLicenseAsync(Guid applicationId, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null) return ApiResponse<bool>.Fail(404, "Application not found.");

        var license = new License
        {
            HolderId = application.ApplicantId,
            ApplicationId = application.Id,
            LicenseCategoryId = application.LicenseCategoryId,
            LicenseNumber = application.ApplicationNumber.Replace("MOJ-", "LIC-"),
            IssuedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddYears(10), 
            Status = LicenseStatus.Active,
            BranchId = application.BranchId
        };

        await _licenseRepository.AddAsync(license);
        
        application.Status = ApplicationStatus.Issued;
        _applicationRepository.Update(application);
        
        await _unitOfWork.SaveChangesAsync();

        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = application.ApplicantId,
            ApplicationId = application.Id,
            EventType = NotificationEventType.LicenseIssued,
            TitleAr = "تم إصدار الرخصة",
            TitleEn = "License Issued",
            MessageAr = "تم إصدار رخصة القيادة الخاصة بك بنجاح.",
            MessageEn = "Your driving license has been issued successfully."
        });

        // 7. Send License Issued Email (Hangfire)
        var user = await _userRepository.GetByIdAsync(application.ApplicantId);
        if (user != null && !string.IsNullOrEmpty(user.Email))
        {
            var emailData = new LicenseIssuedEmailData
            {
                LicenseNumber = license.LicenseNumber,
                ExpiryDateAr = license.ExpiresAt.ToString("yyyy-MM-dd"),
                ExpiryDateEn = license.ExpiresAt.ToString("yyyy-MM-dd"),
                DownloadUrl = $"/members/license/{license.Id}/download", // Replace with real URL
                CategoryAr = application.LicenseCategoryId.ToString(), // Replace with mapping if available
                CategoryEn = application.LicenseCategoryId.ToString()
            };

            _backgroundJobClient.Enqueue(() => _emailService.SendTemplatedAsync(new TemplatedEmailRequest
            {
                RecipientEmail = user.Email,
                TemplateName = "license-issued",
                TemplateData = emailData,
                ReferenceId = license.Id.ToString()
            }));
        }

        return ApiResponse<bool>.Ok(true, "License issued.");
    }
}
