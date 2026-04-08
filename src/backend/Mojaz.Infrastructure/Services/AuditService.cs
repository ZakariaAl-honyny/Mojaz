using Microsoft.AspNetCore.Http;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Interfaces;
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

    public async Task LogAsync(string action, string? entityType = null, string? entityId = null, string? oldValues = null, string? newValues = null)
    {
        var context = _httpContextAccessor.HttpContext;
        var userIdString = context?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Guid? userId = !string.IsNullOrEmpty(userIdString) && Guid.TryParse(userIdString, out var parsedUserId) 
            ? parsedUserId 
            : null;

        // Parse entityId if provided
        Guid entityIdGuid = Guid.Empty;
        if (!string.IsNullOrEmpty(entityId) && Guid.TryParse(entityId, out var parsedId))
        {
            entityIdGuid = parsedId;
        }

        var auditLog = new AuditLog
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ActionType = action,
            EntityName = entityType,
            EntityId = entityIdGuid.ToString(),
            Payload = $"{{ \"OldValues\": {oldValues ?? "{}"}, \"NewValues\": {newValues ?? "{}"} }}",
            Timestamp = DateTime.UtcNow
        };

        await _unitOfWork.Repository<AuditLog>().AddAsync(auditLog);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetLogsAsync(string? entityType = null, string? entityId = null)
    {
        // Parse entityId to Guid for filtering
        Guid? entityIdGuid = null;
        if (!string.IsNullOrEmpty(entityId) && Guid.TryParse(entityId, out var parsedId))
        {
            entityIdGuid = parsedId;
        }

        // Basic implementation, usually filtered in a repository method
        return await _unitOfWork.Repository<AuditLog>().FindAsync(x => 
            (string.IsNullOrEmpty(entityType) || x.EntityName == entityType) && 
            (!entityIdGuid.HasValue || x.EntityId == entityIdGuid.ToString()));
    }
}
