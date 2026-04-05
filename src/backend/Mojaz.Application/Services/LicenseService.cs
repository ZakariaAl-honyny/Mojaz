using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Application.Services;

public class LicenseService : ILicenseService
{
    private readonly IRepository<License> _licenseRepository;
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;

    public LicenseService(
        IRepository<License> licenseRepository,
        IRepository<ApplicationEntity> applicationRepository,
        IUnitOfWork unitOfWork,
        INotificationService notificationService)
    {
        _licenseRepository = licenseRepository;
        _applicationRepository = applicationRepository;
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
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

        return ApiResponse<bool>.Ok(true, "License issued.");
    }
}
