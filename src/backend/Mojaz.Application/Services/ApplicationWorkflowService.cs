using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.DTOs.Email;
using Mojaz.Application.DTOs.Email.Templates;
using Hangfire;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using System;
using System.Threading.Tasks;

using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Application.Services;

public class ApplicationWorkflowService : IApplicationWorkflowService
{
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;
    private readonly IEmailService _emailService;
    private readonly IBackgroundJobClient _backgroundJobClient;

    public ApplicationWorkflowService(
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<User> userRepository,
        IUnitOfWork unitOfWork,
        INotificationService notificationService,
        IEmailService emailService,
        IBackgroundJobClient backgroundJobClient)
    {
        _applicationRepository = applicationRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _emailService = emailService;
        _backgroundJobClient = backgroundJobClient;
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

        // Send Decision Email if status is final (Approved/Rejected)
        if (nextStatus == ApplicationStatus.Approved || nextStatus == ApplicationStatus.Rejected)
        {
            var user = await _userRepository.GetByIdAsync(application.ApplicantId);
            if (user != null && !string.IsNullOrEmpty(user.Email))
            {
                var emailData = new ApplicationDecisionEmailData
                {
                    ApplicationNumber = application.ApplicationNumber,
                    IsApproved = nextStatus == ApplicationStatus.Approved,
                    ReasonAr = notes,
                    ReasonEn = notes
                };
                _backgroundJobClient.Enqueue(() => _emailService.SendTemplatedAsync(new TemplatedEmailRequest
                {
                    RecipientEmail = user.Email,
                    TemplateName = "application-decision",
                    TemplateData = emailData,
                    ReferenceId = application.Id.ToString()
                }));
            }
        }

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

        var userForRejection = await _userRepository.GetByIdAsync(application.ApplicantId);
        if (userForRejection != null && !string.IsNullOrEmpty(userForRejection.Email))
        {
            _backgroundJobClient.Enqueue(() => _emailService.SendTemplatedAsync(new TemplatedEmailRequest
            {
                RecipientEmail = userForRejection.Email,
                TemplateName = "application-decision",
                TemplateData = new ApplicationDecisionEmailData
                {
                    ApplicationNumber = application.ApplicationNumber,
                    IsApproved = false,
                    ReasonAr = reason,
                    ReasonEn = reason
                },
                ReferenceId = application.Id.ToString()
            }));
        }

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
