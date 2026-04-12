using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Security;

public interface ISecurityAlertService
{
    /// <summary>
    /// Evaluates and sends an alert if a security event is considered high-risk.
    /// </summary>
    /// <param name="eventType">Type of security event (e.g., BRUTE_FORCE_ATTEMPT, UNAUTHORIZED_ACCESS).</param>
    /// <param name="details">Additional context for the alert.</param>
    /// <param name="userId">Associated user ID if applicable.</param>
    /// <param name="ipAddress">Source IP address.</param>
    Task ProcessSecurityEventAsync(string eventType, string details, string? userId = null, string? ipAddress = null);
}
