using Hangfire;
using Microsoft.Extensions.Logging;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Enums;
using System;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Jobs;

/// <summary>
/// Hangfire background job that sends training-related notifications.
/// Dispatches In-App (sync) + Push + Email + SMS (async) via INotificationService.
/// </summary>
public class TrainingNotificationJob
{
    private readonly INotificationService _notificationService;
    private readonly ILogger<TrainingNotificationJob> _logger;

    public TrainingNotificationJob(
        INotificationService notificationService,
        ILogger<TrainingNotificationJob> logger)
    {
        _notificationService = notificationService;
        _logger = logger;
    }

    /// <summary>
    /// Send notification when training is completed.
    /// </summary>
    [AutomaticRetry(Attempts = 3, OnAttemptsExceeded = AttemptsExceededAction.Delete)]
    public async Task NotifyTrainingCompletedAsync(Guid userId, Guid applicationId)
    {
        _logger.LogInformation("Sending training completed notification to user {UserId}", userId);

        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = userId,
            ApplicationId = applicationId,
            EventType = NotificationEventType.TestResultReady,
            TitleAr = "اكتمل التدريب",
            TitleEn = "Training Completed",
            MessageAr = "لقد أكملت ساعات التدريب المطلوبة بنجاح. يمكنك الآن الانتقال للاختبار النظري.",
            MessageEn = "You have successfully completed the required training hours. You can now proceed to the theory test.",
            InApp = true,
            Push = true,
            Email = true,
            Sms = true
        });

        _logger.LogInformation("Training completed notification sent to user {UserId}", userId);
    }

    /// <summary>
    /// Send notification when training exemption is approved.
    /// </summary>
    [AutomaticRetry(Attempts = 3, OnAttemptsExceeded = AttemptsExceededAction.Delete)]
    public async Task NotifyExemptionApprovedAsync(Guid userId, Guid applicationId)
    {
        _logger.LogInformation("Sending exemption approved notification to user {UserId}", userId);

        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = userId,
            ApplicationId = applicationId,
            EventType = NotificationEventType.StatusChanged,
            TitleAr = "تمت الموافقة على الإعفاء",
            TitleEn = "Exemption Approved",
            MessageAr = "تمت الموافقة على طلب الإعفاء من التدريب. يمكنك الآن الانتقال للاختبار النظري.",
            MessageEn = "Your training exemption request has been approved. You can now proceed to the theory test.",
            InApp = true,
            Push = true,
            Email = true,
            Sms = true
        });

        _logger.LogInformation("Exemption approved notification sent to user {UserId}", userId);
    }

    /// <summary>
    /// Send notification when training exemption is rejected.
    /// </summary>
    [AutomaticRetry(Attempts = 3, OnAttemptsExceeded = AttemptsExceededAction.Delete)]
    public async Task NotifyExemptionRejectedAsync(Guid userId, Guid applicationId, string reason)
    {
        _logger.LogInformation("Sending exemption rejected notification to user {UserId}", userId);

        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = userId,
            ApplicationId = applicationId,
            EventType = NotificationEventType.StatusChanged,
            TitleAr = "تم رفض طلب الإعفاء",
            TitleEn = "Exemption Rejected",
            MessageAr = $"تم رفض طلب الإعفاء من التدريب. السبب: {reason}",
            MessageEn = $"Your training exemption request has been rejected. Reason: {reason}",
            InApp = true,
            Push = true,
            Email = true,
            Sms = true
        });

        _logger.LogInformation("Exemption rejected notification sent to user {UserId}", userId);
    }
}
