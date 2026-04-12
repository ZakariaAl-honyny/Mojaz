using Microsoft.Extensions.Logging;
using Mojaz.Application.DTOs.Audit;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Interfaces;
using System.Linq.Expressions;

namespace Mojaz.Application.Services;

public interface IAuditLogService
{
    Task<AuditLogResponse> GetAuditLogsAsync(AuditLogQueryRequest request);
    Task<AuditLogDto?> GetAuditLogByIdAsync(Guid id);
}

public class AuditLogService : IAuditLogService
{
    private readonly IRepository<AuditLog> _auditLogRepository;
    private readonly IRepository<User> _userRepository;
    private readonly ILogger<AuditLogService> _logger;

    public AuditLogService(
        IRepository<AuditLog> auditLogRepository,
        IRepository<User> userRepository,
        ILogger<AuditLogService> logger)
    {
        _auditLogRepository = auditLogRepository;
        _userRepository = userRepository;
        _logger = logger;
    }

    public async Task<AuditLogResponse> GetAuditLogsAsync(AuditLogQueryRequest request)
    {
        Expression<Func<AuditLog, bool>> predicate = log => true;

        if (!string.IsNullOrEmpty(request.EntityName))
        {
            predicate = log => log.EntityName == request.EntityName;
        }

        if (!string.IsNullOrEmpty(request.ActionType))
        {
            predicate = predicate.And(log => log.ActionType == request.ActionType);
        }

        if (request.FromDate.HasValue)
        {
            predicate = predicate.And(log => log.Timestamp >= request.FromDate.Value);
        }

        if (request.ToDate.HasValue)
        {
            predicate = predicate.And(log => log.Timestamp <= request.ToDate.Value);
        }

        var allLogs = await _auditLogRepository.FindAsync(predicate);
        var orderedLogs = allLogs.OrderByDescending(l => l.Timestamp).ToList();

        var totalCount = orderedLogs.Count;
        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);
        var pagedLogs = orderedLogs
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        // Get user names for each log
        var userIds = pagedLogs.Where(l => l.UserId.HasValue).Select(l => l.UserId!.Value).Distinct().ToList();
        var users = await _userRepository.FindAsync(u => userIds.Contains(u.Id));
        var userDict = users.ToDictionary(u => u.Id, u => u.FullNameAr);

        var auditLogs = pagedLogs.Select(log => new AuditLogDto
        {
            Id = log.Id,
            UserId = log.UserId,
            UserName = log.UserId.HasValue && userDict.ContainsKey(log.UserId.Value) 
                ? userDict[log.UserId.Value] 
                : null,
            ActionType = log.ActionType,
            EntityName = log.EntityName,
            EntityId = log.EntityId,
            Payload = log.Payload,
            Timestamp = log.Timestamp
        }).ToList();

        return new AuditLogResponse
        {
            AuditLogs = auditLogs,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
            TotalPages = totalPages
        };
    }

    public async Task<AuditLogDto?> GetAuditLogByIdAsync(Guid id)
    {
        var log = await _auditLogRepository.GetByIdAsync(id);
        if (log == null) return null;

        string? userName = null;
        if (log.UserId.HasValue)
        {
            var user = await _userRepository.GetByIdAsync(log.UserId.Value);
            userName = user?.FullNameAr;
        }

        return new AuditLogDto
        {
            Id = log.Id,
            UserId = log.UserId,
            UserName = userName,
            ActionType = log.ActionType,
            EntityName = log.EntityName,
            EntityId = log.EntityId,
            Payload = log.Payload,
            Timestamp = log.Timestamp
        };
    }
}

public static class ExpressionExtensions
{
    public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> left, Expression<Func<T, bool>> right)
    {
        var parameter = Expression.Parameter(typeof(T));
        var body = Expression.AndAlso(
            Expression.Invoke(left, parameter),
            Expression.Invoke(right, parameter)
        );
        return Expression.Lambda<Func<T, bool>>(body, parameter);
    }
}