using DrivingLicenseIssuanceSystem.Domain.Entities;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Services;

public interface IAuditService
{
    Task LogAsync(string action, string? entityType = null, string? entityId = null, string? oldValues = null, string? newValues = null);
    Task<IEnumerable<AuditLog>> GetLogsAsync(string? entityType = null, string? entityId = null);
}
