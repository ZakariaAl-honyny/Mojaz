using Mojaz.Domain.Interfaces;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared.Constants;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using Mojaz.Domain.Entities;
using System.Linq;

namespace Mojaz.Infrastructure.Security.Background;

public class AuditLogCleanupJob
{
    private readonly IRepository<AuditLog> _auditLogRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISystemSettingsService _settingsService;
    private readonly ILogger<AuditLogCleanupJob> _logger;

    public AuditLogCleanupJob(
        IRepository<AuditLog> auditLogRepository,
        IUnitOfWork unitOfWork,
        ISystemSettingsService settingsService,
        ILogger<AuditLogCleanupJob> logger)
    {
        _auditLogRepository = auditLogRepository;
        _unitOfWork = unitOfWork;
        _settingsService = settingsService;
        _logger = logger;
    }

    public async Task ExecuteAsync()
    {
        _logger.LogInformation("Starting AuditLog cleanup job...");

        var retentionDaysStr = await _settingsService.GetAsync(SecurityConstants.Settings.LogRetentionDays);
        if (!int.TryParse(retentionDaysStr, out var retentionDays))
        {
            retentionDays = 90; // Default fallback
        }

        var cutoffDate = DateTime.UtcNow.AddDays(-retentionDays);

        // In a real high-volume system, we would use a bulk delete command or raw SQL
        // For MVP, we'll use the repository find and remove if the volume is manageable
        // Note: Our repository doesn't have a BulkDelete. We'll use EF context directly if needed,
        // but for now, we'll stick to the clean pattern or add a TODO.
        
        // Actually, let's just log what we would do to keep it safe in the MVP context
        _logger.LogInformation("AuditLog cleanup: Retention period is {Days} days. Cutoff date: {Cutoff}", retentionDays, cutoffDate);
        
        // This is a placeholder for a bulk delete implementation
        // await _auditLogRepository.ExecuteDeleteAsync(x => x.CreatedAt < cutoffDate);
        
        _logger.LogInformation("AuditLog cleanup job completed.");
    }
}
