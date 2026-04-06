using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Mojaz.Application.DTOs.Auth;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Models;
using Moq;
using Xunit;

namespace Mojaz.Application.Tests.Services;

public class AuthService_DuplicateChecks_Tests
{
    private readonly Mock<IRepository<User>> _userRepo = new();
    private readonly Mock<IRepository<OtpCode>> _otpRepo = new();
    private readonly Mock<IRepository<RefreshToken>> _refreshTokenRepo = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();
    private readonly Mock<IJwtService> _jwtService = new();
    private readonly Mock<INotificationService> _notificationService = new();
    private readonly Mock<IAuditService> _auditService = new();
    private readonly Mock<ISystemSettingsService> _settingsService = new();

    private AuthService CreateService() => new(
        _userRepo.Object,
        _otpRepo.Object,
        _refreshTokenRepo.Object,
        _unitOfWork.Object,
        _jwtService.Object,
        _notificationService.Object,
        _auditService.Object,
        _settingsService.Object
    );

    [Fact]
    public async Task RegisterAsync_ExistingEmail_ReturnsBadRequest()
    {
        // Arrange
        var service = CreateService();
        var email = "duplicate@mojaz.gov.sa";
        var request = new RegisterRequest
        {
            FullName = "New User",
            Email = email,
            Password = "Password123!",
            Method = RegistrationMethod.Email
        };

        // Mock ExistsAsync to return true for email
        _userRepo.Setup(r => r.ExistsAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await service.RegisterAsync(request);

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(400);
        result.Message.Should().Contain("already exists");
    }

    [Fact]
    public async Task RegisterAsync_ExistingPhone_ReturnsBadRequest()
    {
        // Arrange
        var service = CreateService();
        var phone = "+966500000000";
        var request = new RegisterRequest
        {
            FullName = "New User",
            Phone = phone,
            Password = "Password123!",
            Method = RegistrationMethod.Phone
        };

        // Mock ExistsAsync to return true for phone
        _userRepo.Setup(r => r.ExistsAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await service.RegisterAsync(request);

        // Assert
        result.Success.Should().BeFalse();
        result.StatusCode.Should().Be(400);
        result.Message.Should().Contain("already exists");
    }
}
