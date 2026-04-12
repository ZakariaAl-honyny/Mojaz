using Hangfire;
using Microsoft.Extensions.Logging;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

// Alias to avoid namespace collision with Mojaz.Domain.Entities.Application
using ApplicationEntity = Mojaz.Domain.Entities.Application;

namespace Mojaz.Infrastructure.Jobs;

/// <summary>
/// Hangfire recurring job that processes expired applications.
/// Runs daily at 2 AM UTC to expire applications that have passed their expiration date.
/// </summary>
public class ProcessExpiredApplicationsJob
{
    private readonly IRepository<ApplicationEntity> _applicationRepository;
    private readonly IRepository<ApplicationStatusHistory> _statusHistoryRepository;
    private readonly IAuditService _auditService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ProcessExpiredApplicationsJob> _logger;

    /// <summary>
    /// System user ID used for audit logging when action is performed by system (no user context).
    /// </summary>
    private static readonly Guid SystemUserId = Guid.Empty;

    /// <summary>
    /// Application statuses that should NOT be expired (terminal or already expired states).
    /// </summary>
    private static readonly ApplicationStatus[] NonExpirableStatuses =
    [
        ApplicationStatus.Cancelled,
        ApplicationStatus.Rejected,
        ApplicationStatus.Expired,
        ApplicationStatus.Issued,
        ApplicationStatus.Active
    ];

    public ProcessExpiredApplicationsJob(
        IRepository<ApplicationEntity> applicationRepository,
        IRepository<ApplicationStatusHistory> statusHistoryRepository,
        IAuditService auditService,
        IUnitOfWork unitOfWork,
        ILogger<ProcessExpiredApplicationsJob> logger)
    {
        _applicationRepository = applicationRepository;
        _statusHistoryRepository = statusHistoryRepository;
        _auditService = auditService;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Executes the job to process and expire applications that have passed their expiration date.
    /// Uses idempotency design - only processes applications not in terminal states.
    /// </summary>
    public async Task ExecuteAsync()
    {
        var now = DateTime.UtcNow;
        
        _logger.LogInformation("Starting expired applications processing job at {Time}", now);

        // Query applications where:
        // - ExpiresAt is set and less than now
        // - Status is NOT in terminal states (Cancelled, Rejected, Expired, Issued, Active)
        var expiredApplications = await _applicationRepository.FindAsync(app =>
            app.ExpiresAt.HasValue &&
            app.ExpiresAt.Value < now &&
            !NonExpirableStatuses.Contains(app.Status));

        var applicationsToExpire = expiredApplications.ToList();
        var processedCount = 0;

        _logger.LogInformation("Found {Count} applications to process for expiration", applicationsToExpire.Count);

        foreach (var application in applicationsToExpire)
        {
            try
            {
                // Double check status inside loop for idempotency (safety)
                if (NonExpirableStatuses.Contains(application.Status))
                {
                    continue;
                }

                var previousStatus = application.Status;
                
                // Update application status to Expired
                application.Status = ApplicationStatus.Expired;
                application.UpdatedAt = DateTime.UtcNow;

                _applicationRepository.Update(application);

                // Create status history record
                var statusHistory = new ApplicationStatusHistory
                {
                    Id = Guid.NewGuid(),
                    ApplicationId = application.Id,
                    FromStatus = previousStatus,
                    ToStatus = ApplicationStatus.Expired,
                    ChangedBy = SystemUserId,
                    Notes = $"Application expired automatically by system on {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC",
                    ChangedAt = DateTime.UtcNow
                };

                await _statusHistoryRepository.AddAsync(statusHistory);

                // Log audit entry
                await _auditService.LogAsync(
                    action: "ApplicationExpired",
                    entityType: nameof(ApplicationEntity),
                    entityId: application.Id.ToString(),
                    oldValues: $"{{\"Status\": \"{previousStatus}\", \"ExpiresAt\": \"{application.ExpiresAt}\"}}",
                    newValues: $"{{\"Status\": \"{ApplicationStatus.Expired}\"}}"
                );

                processedCount++;

                // Save changes per record to ensure consistency
                await _unitOfWork.SaveChangesAsync();

                _logger.LogDebug("Application {ApplicationNumber} ({ApplicationId}) marked as expired",
                    application.ApplicationNumber, application.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to process application {ApplicationId} for expiration. Continuing with next application.",
                    application.Id);
                // Continue processing other applications despite the error
            }
        }

        _logger.LogInformation(
            "Completed expired applications processing job. Processed {ProcessedCount} out of {TotalCount} applications",
            processedCount, applicationsToExpire.Count);
    }
}
