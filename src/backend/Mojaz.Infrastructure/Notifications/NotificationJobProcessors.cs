using System;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.Extensions.Logging;
using Mojaz.Application.Interfaces.Services;

namespace Mojaz.Infrastructure.Notifications
{
    /// <summary>
    /// Base class for notification job processors with common logging and error handling.
    /// </summary>
    public abstract class NotificationJobProcessor
    {
        protected readonly ILogger _logger;

        protected NotificationJobProcessor(ILogger logger)
        {
            _logger = logger;
        }

        protected void LogInfo(string message, params object[] args)
        {
            _logger.LogInformation($"[NotificationJob] {message}", args);
        }

        protected void LogError(Exception ex, string message, params object[] args)
        {
            _logger.LogError(ex, $"[NotificationJob] {message}", args);
        }
    }

    /// <summary>
    /// Hangfire job processor for sending emails with automatic retry policy.
    /// Uses [AutomaticRetry(Attempts = 3)] for transient failure handling.
    /// </summary>
    [AutomaticRetry(Attempts = 3)]
    public class EmailJobProcessor : NotificationJobProcessor
    {
        private readonly IEmailService _emailService;

        public EmailJobProcessor(
            IEmailService emailService,
            ILogger<EmailJobProcessor> logger) : base(logger)
        {
            _emailService = emailService;
        }

        /// <summary>
        /// Enqueue email job for async processing.
        /// </summary>
        public static string Enqueue(string to, string subject, string body)
        {
            return BackgroundJob.Enqueue<EmailJobProcessor>(processor => 
                processor.ExecuteAsync(to, subject, body));
        }

        public async Task ExecuteAsync(string to, string subject, string body)
        {
            LogInfo("Processing email job. To: {To}, Subject: {Subject}", NotificationJobHelper.MaskEmail(to), subject);
            
            try
            {
                await _emailService.SendEmailAsync(to, subject, body);
                LogInfo("Email sent successfully. To: {To}", NotificationJobHelper.MaskEmail(to));
            }
            catch (Exception ex)
            {
                LogError(ex, "Failed to send email. To: {To}. Error: {Error}", NotificationJobHelper.MaskEmail(to), ex.Message);
                throw; // Re-throw to trigger Hangfire retry
            }
        }
    }

    /// <summary>
    /// Hangfire job processor for sending SMS with automatic retry policy.
    /// Uses [AutomaticRetry(Attempts = 3)] for transient failure handling.
    /// </summary>
    [AutomaticRetry(Attempts = 3)]
    public class SmsJobProcessor : NotificationJobProcessor
    {
        private readonly Application.Interfaces.Infrastructure.ISmsService _smsService;

        public SmsJobProcessor(
            Application.Interfaces.Infrastructure.ISmsService smsService,
            ILogger<SmsJobProcessor> logger) : base(logger)
        {
            _smsService = smsService;
        }

        /// <summary>
        /// Enqueue SMS job for async processing.
        /// </summary>
        public static string Enqueue(string to, string message)
        {
            return BackgroundJob.Enqueue<SmsJobProcessor>(processor => 
                processor.ExecuteAsync(to, message));
        }

        public async Task ExecuteAsync(string to, string message)
        {
            LogInfo("Processing SMS job. To: {To}", NotificationJobHelper.MaskPhoneNumber(to));
            
            try
            {
                await _smsService.SendAsync(to, message);
                LogInfo("SMS sent successfully. To: {To}", NotificationJobHelper.MaskPhoneNumber(to));
            }
            catch (Exception ex)
            {
                LogError(ex, "Failed to send SMS. To: {To}. Error: {Error}", NotificationJobHelper.MaskPhoneNumber(to), ex.Message);
                throw; // Re-throw to trigger Hangfire retry
            }
        }
    }

    /// <summary>
    /// Hangfire job processor for sending push notifications with automatic retry policy.
    /// Uses [AutomaticRetry(Attempts = 3)] for transient failure handling.
    /// </summary>
    [AutomaticRetry(Attempts = 3)]
    public class PushJobProcessor : NotificationJobProcessor
    {
        private readonly IPushNotificationService _pushService;

        public PushJobProcessor(
            IPushNotificationService pushService,
            ILogger<PushJobProcessor> logger) : base(logger)
        {
            _pushService = pushService;
        }

        /// <summary>
        /// Enqueue push notification job for async processing.
        /// </summary>
        public static string Enqueue(Guid userId, string titleAr, string titleEn, string bodyAr, string bodyEn, string? data = null)
        {
            return BackgroundJob.Enqueue<PushJobProcessor>(processor => 
                processor.ExecuteAsync(userId, titleAr, titleEn, bodyAr, bodyEn, data));
        }

        public async Task ExecuteAsync(Guid userId, string titleAr, string titleEn, string bodyAr, string bodyEn, string? data = null)
        {
            LogInfo("Processing push notification job. UserId: {UserId}", userId);
            
            try
            {
                var message = new PushMessage
                {
                    TitleAr = titleAr,
                    TitleEn = titleEn,
                    BodyAr = bodyAr,
                    BodyEn = bodyEn,
                    Data = data
                };
                
                await _pushService.SendToUserAsync(userId, message);
                LogInfo("Push notification sent successfully. UserId: {UserId}", userId);
            }
            catch (Exception ex)
            {
                LogError(ex, "Failed to send push notification. UserId: {UserId}. Error: {Error}", userId, ex.Message);
                throw; // Re-throw to trigger Hangfire retry
            }
        }
    }

    /// <summary>
    /// Helper methods for masking sensitive data in logs.
    /// </summary>
    public static class NotificationJobHelper
    {
        public static string MaskEmail(string email)
        {
            if (string.IsNullOrEmpty(email) || !email.Contains('@'))
                return "****";
            
            var parts = email.Split('@');
            var localPart = parts[0];
            var domain = parts.Length > 1 ? parts[1] : "";
            
            if (localPart.Length <= 2)
                localPart = new string('*', localPart.Length);
            else
                localPart = localPart[0] + new string('*', Math.Min(localPart.Length - 2, 4)) + localPart[^1];
            
            return $"{localPart}@{domain}";
        }

        public static string MaskPhoneNumber(string phoneNumber)
        {
            if (string.IsNullOrEmpty(phoneNumber) || phoneNumber.Length < 6)
                return "****";
            
            var length = phoneNumber.Length;
            var visibleChars = Math.Min(3, length / 3);
            return phoneNumber.Substring(0, visibleChars) + new string('*', Math.Min(6, length - visibleChars * 2)) + phoneNumber.Substring(length - visibleChars);
        }
    }
}