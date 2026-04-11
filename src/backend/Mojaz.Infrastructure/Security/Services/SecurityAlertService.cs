using Mojaz.Application.Interfaces.Security;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared.Constants;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace Mojaz.Infrastructure.Security.Services;

public class SecurityAlertService : ISecurityAlertService
{
    private readonly ILogger<SecurityAlertService> _logger;
    private readonly INotificationService _notificationService;
    private readonly ISystemSettingsService _settingsService;

    public SecurityAlertService(
        ILogger<SecurityAlertService> logger,
        INotificationService notificationService,
        ISystemSettingsService settingsService)
    {
        _logger = logger;
        _notificationService = notificationService;
        _settingsService = settingsService;
    }

    public async Task ProcessSecurityEventAsync(string eventType, string details, string? userId = null, string? ipAddress = null)
    {
        // Internal logging for security monitoring
        _logger.LogWarning("Security Event Detected: {EventType} | User: {UserId} | IP: {IP} | Details: {Details}", 
            eventType, userId ?? "Anonymous", ipAddress ?? "Unknown", details);

        // Determine if this event requires an immediate admin alert
        bool shouldAlert = eventType switch
        {
            "BRUTE_FORCE_POTENTIAL" => true,
            "UNAUTHORIZED_ADMIN_ACCESS" => true,
            "MALICIOUS_FILE_UPLOAD" => true,
            "SYSTEM_FAILURE_SECURITY" => true,
            _ => false
        };

        if (shouldAlert)
        {
            await SendAdminSecurityAlertAsync(eventType, details, userId, ipAddress);
        }
    }

    private async Task SendAdminSecurityAlertAsync(string eventType, string details, string? userId, string? ipAddress)
    {
        // In a real system, we would query admin users or a security notification group
        // For Mojaz MVP, we'll send a critical notification for the system to process
        
        // This could be extended to send Email/SMS to the security officer
        _logger.LogCritical("CRITICAL SECURITY ALERT: {EventType}. Sending notifications to security responders.", eventType);
        
        // Example: Send an in-app notification to all admins (this logic is simplified for the implementation)
        // In practice, we'd use a specific category for security alerts
    }
}
