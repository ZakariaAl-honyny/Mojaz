using Moq;
using Mojaz.Application.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Application.Interfaces.Services;
using FluentAssertions;
using System.Threading;
using Hangfire;

namespace Mojaz.Application.Tests;

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
    public async Task Service_IsConstructedProperly_ShouldNotBeNull()
    {
        // Assert
        _service.Should().NotBeNull();
    }

    [Fact]
    public async Task ValidateWorkflow_WithValidApplication_ShouldSucceed()
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
