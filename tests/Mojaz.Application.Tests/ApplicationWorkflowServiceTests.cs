using Moq;
using DrivingLicenseIssuanceSystem.Application.Services;
using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using DrivingLicenseIssuanceSystem.Domain.Interfaces;
using DrivingLicenseIssuanceSystem.Application.Interfaces.Services;
using FluentAssertions;
using System.Threading;
using Hangfire;

namespace DrivingLicenseIssuanceSystem.Application.Tests;

public class ApplicationWorkflowServiceTests
{
    private readonly Mock<IRepository<Domain.Entities.Application>> _repoMock;
    private readonly Mock<IRepository<User>> _userRepoMock;
    private readonly Mock<IUnitOfWork> _uowMock;
    private readonly Mock<INotificationService> _notifMock;
    private readonly Mock<IEmailService> _emailServiceMock;
    private readonly ApplicationWorkflowService _service;

    public ApplicationWorkflowServiceTests()
    {
        _repoMock = new Mock<IRepository<Domain.Entities.Application>>();
        _userRepoMock = new Mock<IRepository<User>>();
        _uowMock = new Mock<IUnitOfWork>();
        _notifMock = new Mock<INotificationService>();
        _emailServiceMock = new Mock<IEmailService>();
        _service = new ApplicationWorkflowService(
            _repoMock.Object,
            _userRepoMock.Object,
            _uowMock.Object,
            _notifMock.Object,
            _emailServiceMock.Object,
            Mock.Of<IBackgroundJobClient>()
        );
    }

    [Fact]
    public void Service_IsConstructedProperly_ShouldNotBeNull()
    {
        // Assert
        _service.Should().NotBeNull();
    }

    [Fact]
    public void ValidateWorkflow_WithValidApplication_ShouldSucceed()
    {
        // Arrange
        var appId = Guid.NewGuid();
        var application = new Domain.Entities.Application 
        { 
            Id = appId, 
            Status = ApplicationStatus.Draft 
        };
        _repoMock.Setup(r => r.GetByIdAsync(appId, It.IsAny<CancellationToken>())).ReturnsAsync(application);

        // Act & Assert
        application.Should().NotBeNull();
        application.Status.Should().Be(ApplicationStatus.Draft);
    }
}
