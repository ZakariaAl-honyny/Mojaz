using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentAssertions;
using Mojaz.Application.DTOs.Application;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Mappings;
using Mojaz.Application.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Constants;
using Moq;
using Xunit;

namespace Mojaz.Application.Tests.Services;

public class FinalApprovalServiceTests
{
    private readonly Mock<IRepository<Mojaz.Domain.Entities.Application>> _applicationRepositoryMock;
    private readonly Mock<IRepository<User>> _userRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IAuditService> _auditServiceMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly Mock<IGate4ValidationService> _gate4ValidationServiceMock;
    private readonly IMapper _mapper;
    private readonly FinalApprovalService _service;

    public FinalApprovalServiceTests()
    {
        _applicationRepositoryMock = new Mock<IRepository<Mojaz.Domain.Entities.Application>>();
        _userRepositoryMock = new Mock<IRepository<User>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _auditServiceMock = new Mock<IAuditService>();
        _notificationServiceMock = new Mock<INotificationService>();
        _gate4ValidationServiceMock = new Mock<IGate4ValidationService>();

        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<ApplicationProfile>();
        });
        _mapper = config.CreateMapper();

        _service = new FinalApprovalService(
            _applicationRepositoryMock.Object,
            _userRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _mapper,
            _auditServiceMock.Object,
            _notificationServiceMock.Object,
            _gate4ValidationServiceMock.Object);
        
        // Mock UnitOfWork repository for status history
        _unitOfWorkMock.Setup(x => x.Repository<ApplicationStatusHistory>()).Returns(new Mock<IRepository<ApplicationStatusHistory>>().Object);
    }

    [Fact]
    public async Task FinalizeAsync_WhenApprovedAndGate4Passed_ShouldSucceed()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var managerId = Guid.NewGuid();
        var application = new Mojaz.Domain.Entities.Application 
        { 
            Id = applicationId, 
            CurrentStage = "08-FinalApproval", 
            Status = ApplicationStatus.InReview,
            ApplicationNumber = "MOJ-2025-12345678"
        };
        
        var request = new FinalizeApplicationRequest
        {
            Decision = FinalDecisionType.Approved,
            ManagerNotes = "Ready for issuance"
        };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>())).ReturnsAsync(application);
        _gate4ValidationServiceMock.Setup(x => x.ValidateAsync(applicationId)).ReturnsAsync(new Gate4ValidationResult { IsFullyPassed = true, Conditions = new List<Gate4Condition>() });
        
        // Act
        var result = await _service.FinalizeAsync(applicationId, request, managerId);

        // Assert
        result.Success.Should().BeTrue();
        application.FinalDecision.Should().Be(FinalDecisionType.Approved);
        application.Status.Should().Be(ApplicationStatus.Approved);
        application.CurrentStage.Should().Be("09-IssuancePayment");
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        _notificationServiceMock.Verify(x => x.SendAsync(It.IsAny<NotificationRequest>()), Times.Once);
    }

    [Fact]
    public async Task FinalizeAsync_WhenApprovedButGate4Failed_ShouldFail()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var managerId = Guid.NewGuid();
        var application = new Mojaz.Domain.Entities.Application 
        { 
            Id = applicationId, 
            CurrentStage = "08-FinalApproval",
            ApplicationNumber = "MOJ-2025-12345678"
        };
        
        var request = new FinalizeApplicationRequest
        {
            Decision = FinalDecisionType.Approved
        };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>())).ReturnsAsync(application);
        _gate4ValidationServiceMock.Setup(x => x.ValidateAsync(applicationId)).ReturnsAsync(new Gate4ValidationResult 
        { 
            IsFullyPassed = false, 
            Conditions = new List<Gate4Condition> { new Gate4Condition { Key = "Test", IsPassed = false, LabelEn = "Test", FailureMessageEn = "Fail" } } 
        });
        
        // Act
        var result = await _service.FinalizeAsync(applicationId, request, managerId);

        // Assert
        result.Success.Should().BeFalse();
        result.Message.Should().Contain("Gate 4 validation failed");
        application.FinalDecision.Should().BeNull(); // Should not have updated
    }

    [Fact]
    public async Task FinalizeAsync_WhenRejected_ShouldSucceedAndMaintainStage()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var managerId = Guid.NewGuid();
        var application = new Mojaz.Domain.Entities.Application 
        { 
            Id = applicationId, 
            CurrentStage = "08-FinalApproval", 
            Status = ApplicationStatus.InReview 
        };
        
        var request = new FinalizeApplicationRequest
        {
            Decision = FinalDecisionType.Rejected,
            Reason = "Ineligible due to recent violations"
        };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>())).ReturnsAsync(application);
        _gate4ValidationServiceMock.Setup(x => x.ValidateAsync(applicationId)).ReturnsAsync(new Gate4ValidationResult { IsFullyPassed = false });
        
        // Act
        var result = await _service.FinalizeAsync(applicationId, request, managerId);

        // Assert
        result.Success.Should().BeTrue();
        application.FinalDecision.Should().Be(FinalDecisionType.Rejected);
        application.Status.Should().Be(ApplicationStatus.Rejected);
        application.CurrentStage.Should().Be("08-FinalApproval"); // Stays in current stage
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task FinalizeAsync_WhenReturned_ShouldSucceedAndTransitionToRequestedStage()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var managerId = Guid.NewGuid();
        var application = new Mojaz.Domain.Entities.Application 
        { 
            Id = applicationId, 
            CurrentStage = "08-FinalApproval", 
            Status = ApplicationStatus.InReview 
        };
        
        var request = new FinalizeApplicationRequest
        {
            Decision = FinalDecisionType.Returned,
            Reason = "Documents incomplete",
            ReturnToStage = "02-Documents"
        };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>())).ReturnsAsync(application);
        _gate4ValidationServiceMock.Setup(x => x.ValidateAsync(applicationId)).ReturnsAsync(new Gate4ValidationResult { IsFullyPassed = false });
        
        // Act
        var result = await _service.FinalizeAsync(applicationId, request, managerId);

        // Assert
        result.Success.Should().BeTrue();
        application.FinalDecision.Should().Be(FinalDecisionType.Returned);
        application.Status.Should().Be(ApplicationStatus.InReview);
        application.CurrentStage.Should().Be("02-Documents");
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task FinalizeAsync_WhenAlreadyFinalized_ShouldReturnConflict()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var managerId = Guid.NewGuid();
        var application = new Mojaz.Domain.Entities.Application 
        { 
            Id = applicationId, 
            CurrentStage = "08-FinalApproval",
            FinalDecision = FinalDecisionType.Approved
        };
        
        var request = new FinalizeApplicationRequest { Decision = FinalDecisionType.Approved };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>())).ReturnsAsync(application);
        
        // Act
        var result = await _service.FinalizeAsync(applicationId, request, managerId);

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(409);
    }
}
