using Microsoft.AspNetCore.Http;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Interfaces;
using Newtonsoft.Json;
using System.Security.Claims;

namespace Mojaz.Infrastructure.Services;

public class AuditService : IAuditService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuditService(IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _httpContextAccessor = httpContextAccessor;
    }

    // Overload 1: Just action
    public Task LogAsync(string action) => LogAsync(action, null, null, null, null, "DataAccess");

    // Overload 2: action + entityType
    public Task LogAsync(string action, string? entityType) => LogAsync(action, entityType, null, null, null, "DataAccess");

    // Overload 3: action + entityType + entityId
    public Task LogAsync(string action, string? entityType, string? entityId) => LogAsync(action, entityType, entityId, null, null, "DataAccess");

    // Overload 4: action + entityType + entityId + oldValues
    public Task LogAsync(string action, string? entityType, string? entityId, string? oldValues) => LogAsync(action, entityType, entityId, oldValues, null, "DataAccess");

    // Overload 5: action + entityType + entityId + oldValues + newValues
    public Task LogAsync(string action, string? entityType, string? entityId, string? oldValues, string? newValues) => LogAsync(action, entityType, entityId, oldValues, newValues, "DataAccess");

    // Overload 6: Full implementation
    public async Task LogAsync(string action, string? entityType, string? entityId, string? oldValues, string? newValues, string? actionCategory)
    {
        var context = _httpContextAccessor.HttpContext;
        var userIdString = context?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? userId = !string.IsNullOrEmpty(userIdString) && int.TryParse(userIdString, out var parsedUserId) 
            ? parsedUserId 
            : null;

        // Use JsonConvert to properly serialize values (avoids truncation/jection issues)
        var payloadObject = new { OldValues = oldValues, NewValues = newValues };
        var payload = JsonConvert.SerializeObject(payloadObject);

        var auditLog = new AuditLog
        {
            UserId = userId,
            ActionType = action,
            ActionCategory = actionCategory ?? "DataAccess",
            EntityName = entityType ?? "Unknown",
            EntityId = entityId ?? string.Empty,
            Payload = payload,
            Timestamp = DateTime.UtcNow
        };

        await _unitOfWork.Repository<AuditLog>().AddAsync(auditLog);
        await _unitOfWork.SaveChangesAsync();
    }

    // Overload 1: No parameters
    public Task<IEnumerable<AuditLog>> GetLogsAsync() => GetLogsAsync(null, null);

    // Overload 2: entityType only
    public Task<IEnumerable<AuditLog>> GetLogsAsync(string? entityType) => GetLogsAsync(entityType, null);

    // Overload 3: entityType + entityId (full implementation)
    public async Task<IEnumerable<AuditLog>> GetLogsAsync(string? entityType, string? entityId)
    {
        // Basic implementation, usually filtered in a repository method
        return await _unitOfWork.Repository<AuditLog>().FindAsync(x => 
            (string.IsNullOrEmpty(entityType) || x.EntityName == entityType) && 
            (string.IsNullOrEmpty(entityId) || x.EntityId == entityId));
    }
}
