using Mojaz.Domain.Entities;

namespace Mojaz.Application.Interfaces.Services;

public interface IAuditService
{
    // Overloads to avoid optional parameters in expression trees
    Task LogAsync(string action);
    Task LogAsync(string action, string? entityType);
    Task LogAsync(string action, string? entityType, string? entityId);
    Task LogAsync(string action, string? entityType, string? entityId, string? oldValues);
    Task LogAsync(string action, string? entityType, string? entityId, string? oldValues, string? newValues);
    Task LogAsync(string action, string? entityType, string? entityId, string? oldValues, string? newValues, string? actionCategory);
    
    Task<IEnumerable<AuditLog>> GetLogsAsync(string? entityType = null, string? entityId = null);
}