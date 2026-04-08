using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Infrastructure.Jobs;
using Xunit;

using DomainApplication = Mojaz.Domain.Entities.Application;

namespace Mojaz.Infrastructure.Tests.Jobs;

public class ProcessExpiredApplicationsJobTests
{
    private readonly Mock<IRepository<DomainApplication>> _applicationRepo = new();
    private readonly Mock<IRepository<ApplicationStatusHistory>> _statusHistoryRepo = new();
    private readonly Mock<IAuditService> _auditService = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();
    private readonly Mock<ILogger<ProcessExpiredApplicationsJob>> _logger = new();

    private ProcessExpiredApplicationsJob CreateJob() => new(
        _applicationRepo.Object,
        _statusHistoryRepo.Object,
        _auditService.Object,
        _unitOfWork.Object,
        _logger.Object
    );

    // T042: Tests for ProcessExpiredApplicationsJob.ExecuteAsync
    [Fact]
    public async Task ExecuteAsync_NoExpiredApplications_DoesNothing()
    {
        // Arrange
        var job = CreateJob();
        
        _applicationRepo.Setup(r => r.FindAsync(
            It.IsAny<Expression<Func<DomainApplication, bool>>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<DomainApplication>());

        // Act
        await job.ExecuteAsync();

        // Assert - no updates or saves
        _applicationRepo.Verify(r => r.Update(It.IsAny<DomainApplication>()), Times.Never);
        _unitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_ThreeExpiredApplications_UpdatesAll()
    {
        // Arrange
        var job = CreateJob();
        var now = DateTime.UtcNow;
        var expiredApps = new List<DomainApplication>
        {
            new DomainApplication { Id = Guid.NewGuid(), Status = ApplicationStatus.Draft, ExpiresAt = now.AddDays(-1) },
            new DomainApplication { Id = Guid.NewGuid(), Status = ApplicationStatus.Submitted, ExpiresAt = now.AddDays(-2) },
            new DomainApplication { Id = Guid.NewGuid(), Status = ApplicationStatus.InReview, ExpiresAt = now.AddDays(-3) }
        };

        _applicationRepo.Setup(r => r.FindAsync(
            It.IsAny<Expression<Func<DomainApplication, bool>>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(expiredApps);

        _statusHistoryRepo.Setup(r => r.AddAsync(
            It.IsAny<ApplicationStatusHistory>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync((ApplicationStatusHistory h, CancellationToken _) => h);

        _unitOfWork.Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);
        _auditService.Setup(a => a.LogAsync(
            It.IsAny<string>(),
            It.IsAny<string>(),
            It.IsAny<string>(),
            It.IsAny<string>(),
            It.IsAny<string>())).Returns(Task.CompletedTask);

        // Act
        await job.ExecuteAsync();

        // Assert - 3 applications should be updated
        _applicationRepo.Verify(r => r.Update(It.IsAny<DomainApplication>()), Times.Exactly(3));
        _unitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Exactly(3));
    }

    [Fact]
    public async Task ExecuteAsync_AlreadyExpired_SkipsIdempotently()
    {
        // Arrange
        var job = CreateJob();
        var now = DateTime.UtcNow;
        var expiredApps = new List<DomainApplication>
        {
            new DomainApplication { Id = Guid.NewGuid(), Status = ApplicationStatus.Expired, ExpiresAt = now.AddDays(-1) } // Already expired
        };

        _applicationRepo.Setup(r => r.FindAsync(
            It.IsAny<Expression<Func<DomainApplication, bool>>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(expiredApps);

        // Act
        await job.ExecuteAsync();

        // Assert - should NOT update already expired applications
        _applicationRepo.Verify(r => r.Update(It.IsAny<DomainApplication>()), Times.Never);
        _unitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_CancelledApplication_SkipsTerminalState()
    {
        // Arrange
        var job = CreateJob();
        var now = DateTime.UtcNow;
        var expiredApps = new List<DomainApplication>
        {
            new DomainApplication { Id = Guid.NewGuid(), Status = ApplicationStatus.Cancelled, ExpiresAt = now.AddDays(-1) } // Terminal state
        };

        _applicationRepo.Setup(r => r.FindAsync(
            It.IsAny<Expression<Func<DomainApplication, bool>>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(expiredApps);

        // Act
        await job.ExecuteAsync();

        // Assert - should NOT update cancelled applications
        _applicationRepo.Verify(r => r.Update(It.IsAny<DomainApplication>()), Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_CreatesStatusHistoryRecords()
    {
        // Arrange
        var job = CreateJob();
        var now = DateTime.UtcNow;
        var appId = Guid.NewGuid();
        var expiredApps = new List<DomainApplication>
        {
            new DomainApplication { Id = appId, Status = ApplicationStatus.Draft, ExpiresAt = now.AddDays(-1), ApplicationNumber = "MOJ-2026-12345678" }
        };

        _applicationRepo.Setup(r => r.FindAsync(
            It.IsAny<Expression<Func<DomainApplication, bool>>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(expiredApps);

        _statusHistoryRepo.Setup(r => r.AddAsync(
            It.IsAny<ApplicationStatusHistory>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync((ApplicationStatusHistory h, CancellationToken _) => h);

        _unitOfWork.Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);
        _auditService.Setup(a => a.LogAsync(
            It.IsAny<string>(),
            It.IsAny<string>(),
            It.IsAny<string>(),
            It.IsAny<string>(),
            It.IsAny<string>())).Returns(Task.CompletedTask);

        // Act
        await job.ExecuteAsync();

        // Assert - should create status history record
        _statusHistoryRepo.Verify(r => r.AddAsync(
            It.Is<ApplicationStatusHistory>(h => 
                h.ApplicationId == appId && 
                h.ToStatus == ApplicationStatus.Expired),
            It.IsAny<CancellationToken>()), Times.Once);
    }
}