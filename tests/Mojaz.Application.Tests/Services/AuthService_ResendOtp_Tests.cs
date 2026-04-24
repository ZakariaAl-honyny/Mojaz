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
using Mojaz.Shared;
using Moq;
using Xunit;

namespace Mojaz.Application.Tests.Services;

public class AuthService_ResendOtp_Tests
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
    public async Task ResendOtpAsync_UserNotFound_ReturnsNotFound()
    {
        // Arrange
        var service = CreateService();
        _userRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
                 .ReturnsAsync((IReadOnlyList<User>)new List<User>());

        // Act
        var result = await service.ResendOtpAsync(new ResendOtpRequest { Destination = "invalid@test.com", Purpose = OtpPurpose.Registration });

        // Assert
        result.StatusCode.Should().Be(404);
        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task ResendOtpAsync_WithinCooldown_ReturnsTooManyRequests()
    {
        // Arrange
        var service = CreateService();
        var user = new User { Id = Guid.NewGuid(), Email = "test@resend.com" };
        _userRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
                 .ReturnsAsync((IReadOnlyList<User>)new List<User> { user });

        // Mock FindAsync to return a recently created OTP (within 60 seconds)
        var recentOtp = new OtpCode { CreatedAt = DateTime.UtcNow.AddSeconds(-30) };
        _otpRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<OtpCode, bool>>>(), It.IsAny<CancellationToken>()))
                 .ReturnsAsync((IReadOnlyList<OtpCode>)new List<OtpCode> { recentOtp });

        // Act
        var result = await service.ResendOtpAsync(new ResendOtpRequest { Destination = "test@resend.com", Purpose = OtpPurpose.Registration });

        // Assert
        result.StatusCode.Should().Be(429);
        result.Message.Should().Contain("wait");
    }

    [Fact]
    public async Task ResendOtpAsync_ValidRequest_SendsNewOtp()
    {
        // Arrange
        var service = CreateService();
        var user = new User { Id = Guid.NewGuid(), Email = "test@resend.com" };
        _userRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
                 .ReturnsAsync((IReadOnlyList<User>)new List<User> { user });

        // Mock FindAsync to return empty list (no recent OTP)
        _otpRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<OtpCode, bool>>>(), It.IsAny<CancellationToken>()))
                 .ReturnsAsync((IReadOnlyList<OtpCode>)new List<OtpCode>());

        // Act
        var result = await service.ResendOtpAsync(new ResendOtpRequest { Destination = "test@resend.com", Purpose = OtpPurpose.Registration });

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.DestinationMasked.Should().NotBeEmpty();
        _otpRepo.Verify(r => r.AddAsync(It.Is<OtpCode>(o => o.UserId == user.Id), It.IsAny<CancellationToken>()), Times.Once);
        _notificationService.Verify(n => n.SendAsync(It.IsAny<NotificationRequest>()), Times.Once);
    }
}