using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Models;
using System;
using System.Threading.Tasks;

using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Application.Services;

public class ApplicationWorkflowService : IApplicationWorkflowService
{
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;

    public ApplicationWorkflowService(
        IRepository<ApplicationEntity> applicationRepository,
        IUnitOfWork unitOfWork,
        INotificationService notificationService)
    {
        _applicationRepository = applicationRepository;
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
    }

    public async Task<ApiResponse<bool>> AdvanceStageAsync(Guid applicationId, ApplicationStatus nextStatus, string notes, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null) return ApiResponse<bool>.Fail(404, "Application not found.");

        var oldStatus = application.Status;
        application.Status = nextStatus;
        application.CurrentStage = GetStageNameFromStatus(nextStatus);
        
        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        // Notify User
        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = application.ApplicantId,
            ApplicationId = application.Id,
            EventType = NotificationEventType.StatusChanged,
            TitleAr = "تحديث حالة الطلب",
            TitleEn = "Application Status Updated",
            MessageAr = $"تم تحديث حالة طلبك إلى: {nextStatus}",
            MessageEn = $"Your application status has been updated to: {nextStatus}"
        });

        return ApiResponse<bool>.Ok(true, "Application stage advanced.");
    }

    public async Task<ApiResponse<bool>> RejectAsync(Guid applicationId, string reason, Guid userId)
    {
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null) return ApiResponse<bool>.Fail(404, "Application not found.");

        application.Status = ApplicationStatus.Rejected;
        application.RejectionReason = reason;

        _applicationRepository.Update(application);
        await _unitOfWork.SaveChangesAsync();

        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = application.ApplicantId,
            ApplicationId = application.Id,
            EventType = NotificationEventType.ApplicationRejected,
            TitleAr = "تم رفض الطلب",
            TitleEn = "Application Rejected",
            MessageAr = $"نعتذر، تم رفض طلبك للسبب التالي: {reason}",
            MessageEn = $"We regret to inform you that your application has been rejected for: {reason}"
        });

        return ApiResponse<bool>.Ok(true, "Application rejected.");
    }

    private string GetStageNameFromStatus(ApplicationStatus status) => status switch
    {
        ApplicationStatus.Submitted => "01: Submission",
        ApplicationStatus.InReview => "02: Document Review",
        ApplicationStatus.Approved => "10: Completed",
        ApplicationStatus.Rejected => "Rejected",
        _ => "Processing"
    };
}
