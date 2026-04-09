using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Mojaz.Application.DTOs.Theory;
using Mojaz.Application.Interfaces;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Constants;
using AutoMapper;
using Xunit;
using System.Threading;
using Mojaz.Application.Mappings;
using Mojaz.Shared;

namespace Mojaz.Application.Tests.Services;

public class TheoryServiceTests
{
    private readonly Mock<ITheoryRepository> _theoryRepositoryMock;
    private readonly Mock<IRepository<Domain.Entities.Application>> _applicationRepositoryMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IAuditService> _auditServiceMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly Mock<ISystemSettingsService> _settingsServiceMock;
    private readonly IMapper _mapper;
    private readonly TheoryService _service;

    public TheoryServiceTests()
    {
        _theoryRepositoryMock = new Mock<ITheoryRepository>();
        _applicationRepositoryMock = new Mock<IRepository<Domain.Entities.Application>>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _auditServiceMock = new Mock<IAuditService>();
        _notificationServiceMock = new Mock<INotificationService>();
        _settingsServiceMock = new Mock<ISystemSettingsService>();

        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<TheoryMappingProfile>();
        });
        _mapper = config.CreateMapper();

        _service = new TheoryService(
            _theoryRepositoryMock.Object,
            _applicationRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _mapper,
            _auditServiceMock.Object,
            _notificationServiceMock.Object,
            _settingsServiceMock.Object);
    }

    #region SubmitResultAsync Tests

    [Fact]
    public async Task SubmitResultAsync_WhenPassed_ShouldAdvanceStageToPractical()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var examinerId = Guid.NewGuid();
        var application = new Domain.Entities.Application
        {
            Id = applicationId,
            CurrentStage = ApplicationStages.Theory,
            TheoryAttemptCount = 0,
            Status = ApplicationStatus.TheoryTest,
            ApplicantId = Guid.NewGuid()
        };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);
        _settingsServiceMock.Setup(x => x.GetAsync("MIN_PASS_SCORE_THEORY"))
            .ReturnsAsync("80");
        _settingsServiceMock.Setup(x => x.GetAsync("MAX_THEORY_ATTEMPTS"))
            .ReturnsAsync("3");

        var request = new SubmitTheoryResultRequest
        {
            Score = 85,
            IsAbsent = false,
            Notes = "Well done"
        };

        // Act
        var result = await _service.SubmitResultAsync(applicationId, request, examinerId);

        // Assert
        result.Success.Should().BeTrue();
        application.CurrentStage.Should().Be(ApplicationStages.Practical);
        application.Status.Should().Be(ApplicationStatus.PracticalTest);
        application.TheoryAttemptCount.Should().Be(1);
        _theoryRepositoryMock.Verify(x => x.AddAsync(It.IsAny<TheoryTest>(), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        _notificationServiceMock.Verify(x => x.SendAsync(It.Is<NotificationRequest>(r => r.TitleEn.Contains("Passed"))), Times.Once);
    }

    [Fact]
    public async Task SubmitResultAsync_WhenFailed_ShouldMaintainStageAndIncrementCount()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var examinerId = Guid.NewGuid();
        var application = new Domain.Entities.Application
        {
            Id = applicationId,
            CurrentStage = ApplicationStages.Theory,
            TheoryAttemptCount = 0,
            Status = ApplicationStatus.TheoryTest,
            ApplicantId = Guid.NewGuid()
        };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);
        _settingsServiceMock.Setup(x => x.GetAsync("MIN_PASS_SCORE_THEORY"))
            .ReturnsAsync("80");
        _settingsServiceMock.Setup(x => x.GetAsync("MAX_THEORY_ATTEMPTS"))
            .ReturnsAsync("3");
        _settingsServiceMock.Setup(x => x.GetAsync("COOLING_PERIOD_DAYS"))
            .ReturnsAsync("7");

        var request = new SubmitTheoryResultRequest
        {
            Score = 70,
            IsAbsent = false,
            Notes = "Needs more study"
        };

        // Act
        var result = await _service.SubmitResultAsync(applicationId, request, examinerId);

        // Assert
        result.Success.Should().BeTrue();
        application.CurrentStage.Should().Be(ApplicationStages.Theory);
        application.Status.Should().Be(ApplicationStatus.TheoryTest);
        application.TheoryAttemptCount.Should().Be(1);
        _notificationServiceMock.Verify(x => x.SendAsync(It.Is<NotificationRequest>(r => r.TitleEn.Contains("Not Passed"))), Times.Once);
    }

    [Fact]
    public async Task SubmitResultAsync_WhenMaxAttemptsReached_ShouldRejectApplication()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var examinerId = Guid.NewGuid();
        var application = new Domain.Entities.Application
        {
            Id = applicationId,
            CurrentStage = ApplicationStages.Theory,
            TheoryAttemptCount = 2,
            Status = ApplicationStatus.TheoryTest,
            ApplicantId = Guid.NewGuid()
        };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);
        _settingsServiceMock.Setup(x => x.GetAsync("MIN_PASS_SCORE_THEORY"))
            .ReturnsAsync("80");
        _settingsServiceMock.Setup(x => x.GetAsync("MAX_THEORY_ATTEMPTS"))
            .ReturnsAsync("3");

        var request = new SubmitTheoryResultRequest
        {
            Score = 60,
            IsAbsent = false,
            Notes = "Third fail"
        };

        // Act
        var result = await _service.SubmitResultAsync(applicationId, request, examinerId);

        // Assert
        result.Success.Should().BeTrue();
        application.Status.Should().Be(ApplicationStatus.Rejected);
        application.RejectionReason.Should().Be("MaxTheoryAttemptsReached");
        application.TheoryAttemptCount.Should().Be(3);
        _notificationServiceMock.Verify(x => x.SendAsync(It.Is<NotificationRequest>(r => r.TitleEn.Contains("Closed"))), Times.Once);
    }

    [Fact]
    public async Task SubmitResultAsync_WhenAbsent_ShouldCountAsFail()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var examinerId = Guid.NewGuid();
        var application = new Domain.Entities.Application
        {
            Id = applicationId,
            CurrentStage = ApplicationStages.Theory,
            TheoryAttemptCount = 0,
            Status = ApplicationStatus.TheoryTest,
            ApplicantId = Guid.NewGuid()
        };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);
        _settingsServiceMock.Setup(x => x.GetAsync("MIN_PASS_SCORE_THEORY"))
            .ReturnsAsync("80");
        _settingsServiceMock.Setup(x => x.GetAsync("MAX_THEORY_ATTEMPTS"))
            .ReturnsAsync("3");
        _settingsServiceMock.Setup(x => x.GetAsync("COOLING_PERIOD_DAYS"))
            .ReturnsAsync("7");

        var request = new SubmitTheoryResultRequest
        {
            IsAbsent = true,
            Notes = "Applicant did not show up"
        };

        // Act
        var result = await _service.SubmitResultAsync(applicationId, request, examinerId);

        // Assert
        result.Success.Should().BeTrue();
        application.TheoryAttemptCount.Should().Be(1);
        _notificationServiceMock.Verify(x => x.SendAsync(It.Is<NotificationRequest>(r => r.TitleEn.Contains("Not Passed"))), Times.Once);
    }

    #endregion

    #region IsInCoolingPeriodAsync Tests

    [Fact]
    public async Task IsInCoolingPeriodAsync_WhenWithinLimit_ShouldReturnTrue()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var latestTest = new TheoryTest
        {
            Result = TestResult.Fail,
            ConductedAt = DateTime.UtcNow.AddDays(-3)
        };

        _theoryRepositoryMock.Setup(x => x.GetLatestByApplicationIdAsync(applicationId))
            .ReturnsAsync(latestTest);
        _settingsServiceMock.Setup(x => x.GetAsync("COOLING_PERIOD_DAYS"))
            .ReturnsAsync("7");

        // Act
        var result = await _service.IsInCoolingPeriodAsync(applicationId);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task IsInCoolingPeriodAsync_WhenAtThreshold_ShouldReturnFalse()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var latestTest = new TheoryTest
        {
            Result = TestResult.Fail,
            ConductedAt = DateTime.UtcNow.AddDays(-8)
        };

        _theoryRepositoryMock.Setup(x => x.GetLatestByApplicationIdAsync(applicationId))
            .ReturnsAsync(latestTest);
        _settingsServiceMock.Setup(x => x.GetAsync("COOLING_PERIOD_DAYS"))
            .ReturnsAsync("7");

        // Act
        var result = await _service.IsInCoolingPeriodAsync(applicationId);

        // Assert
        result.Should().BeFalse();
    }

    #endregion

    #region GetHistoryAsync Tests

    [Fact]
    public async Task GetHistoryAsync_WhenApplicantIsOwner_ShouldReturnHistory()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var applicantId = Guid.NewGuid();
        var application = new Domain.Entities.Application { Id = applicationId, ApplicantId = applicantId };
        
        var tests = new List<TheoryTest>
        {
            new TheoryTest { Id = Guid.NewGuid(), AttemptNumber = 1, Result = TestResult.Fail, ConductedAt = DateTime.UtcNow.AddDays(-10) },
            new TheoryTest { Id = Guid.NewGuid(), AttemptNumber = 2, Result = TestResult.Pass, ConductedAt = DateTime.UtcNow.AddDays(-5) }
        };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>())).ReturnsAsync(application);
        _theoryRepositoryMock.Setup(x => x.GetAllByApplicationIdAsync(applicationId)).ReturnsAsync(tests);
        _settingsServiceMock.Setup(x => x.GetAsync("COOLING_PERIOD_DAYS")).ReturnsAsync("7");

        // Act
        var result = await _service.GetHistoryAsync(applicationId, applicantId, "Applicant");

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Items.Should().HaveCount(2);
        result.Data.Items.First().AttemptNumber.Should().Be(1);
    }

    [Fact]
    public async Task GetHistoryAsync_WhenApplicantIsNotOwner_ShouldReturnForbidden()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var ownerId = Guid.NewGuid();
        var otherId = Guid.NewGuid();
        var application = new Domain.Entities.Application { Id = applicationId, ApplicantId = ownerId };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>())).ReturnsAsync(application);

        // Act
        var result = await _service.GetHistoryAsync(applicationId, otherId, "Applicant");

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(403);
    }

    [Fact]
    public async Task GetHistoryAsync_WhenManager_ShouldReturnHistoryRegardlessOfOwner()
    {
        // Arrange
        var applicationId = Guid.NewGuid();
        var applicantId = Guid.NewGuid();
        var managerId = Guid.NewGuid();
        var application = new Domain.Entities.Application { Id = applicationId, ApplicantId = applicantId };
        
        var tests = new List<TheoryTest> { new TheoryTest { Id = Guid.NewGuid(), AttemptNumber = 1 } };

        _applicationRepositoryMock.Setup(x => x.GetByIdAsync(applicationId, It.IsAny<CancellationToken>())).ReturnsAsync(application);
        _theoryRepositoryMock.Setup(x => x.GetAllByApplicationIdAsync(applicationId)).ReturnsAsync(tests);

        // Act
        var result = await _service.GetHistoryAsync(applicationId, managerId, "Manager");

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Items.Should().HaveCount(1);
    }

    #endregion
}
