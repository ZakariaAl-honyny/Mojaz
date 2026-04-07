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
using Hangfire;

namespace Mojaz.Application.Tests.Services;

public class AuthService_ResendOtp_Tests
{
    private readonly Mock<IRepository<User>> _userRepo = new();
    private readonly Mock<IOtpRepository> _otpRepo = new();
    private readonly Mock<IRepository<RefreshToken>> _refreshTokenRepo = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();
    private readonly Mock<IJwtService> _jwtService = new();
    private readonly Mock<INotificationService> _notificationService = new();
    private readonly Mock<IAuditService> _auditService = new();
    private readonly Mock<ISystemSettingsService> _settingsService = new();
    private readonly Mock<IOtpService> _otpService = new();
    private readonly Mock<IEmailService> _emailService = new();

    private AuthService CreateService() => new(
        _userRepo.Object,
        _otpRepo.Object,
        _refreshTokenRepo.Object,
        _unitOfWork.Object,
        _jwtService.Object,
        _notificationService.Object,
        _auditService.Object,
        _settingsService.Object,
        _otpService.Object,
        _emailService.Object,
        Mock.Of<IBackgroundJobClient>()
    );

    [Fact]
    public async Task ResendOtpAsync_UserNotFound_ReturnsNotFound()
    {
        // Arrange
        var service = CreateService();
        _userRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
                 .ReturnsAsync(new List<User>());

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
                 .ReturnsAsync(new List<User> { user });

        var recentOtp = new OtpCode { CreatedAt = DateTime.UtcNow.AddSeconds(-30) };
        _otpRepo.Setup(r => r.GetLatestByDestinationAndPurposeAsync(It.IsAny<string>(), It.IsAny<OtpPurpose>()))
                 .ReturnsAsync(recentOtp);

        _settingsService.Setup(s => s.GetIntAsync("OTP_RESEND_COOLDOWN_SECONDS")).ReturnsAsync(60);

        // Act
        var result = await service.ResendOtpAsync(new ResendOtpRequest { Destination = "test@resend.com", Purpose = OtpPurpose.Registration });

        // Assert
        result.StatusCode.Should().Be(429);
        result.Message.Should().Be("please_wait_before_resending");
    }

    [Fact]
    public async Task ResendOtpAsync_ValidRequest_SendsNewOtp()
    {
        // Arrange
        var service = CreateService();
        var user = new User { Id = Guid.NewGuid(), Email = "test@resend.com" };
        _userRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
                 .ReturnsAsync(new List<User> { user });

        _otpRepo.Setup(r => r.GetLatestByDestinationAndPurposeAsync(It.IsAny<string>(), It.IsAny<OtpPurpose>()))
                 .ReturnsAsync((OtpCode?)null);

        _otpService.Setup(s => s.GenerateOtpAsync(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("123456");
        _otpService.Setup(s => s.HashOtp("123456")).Returns("hashed_123456");

        // Act
        var result = await service.ResendOtpAsync(new ResendOtpRequest { Destination = "test@resend.com", Purpose = OtpPurpose.Registration });

        // Assert
        result.Success.Should().BeTrue();
        result.Data.DestinationMasked.Should().NotBeEmpty();
        _otpRepo.Verify(r => r.AddAsync(It.Is<OtpCode>(o => o.UserId == user.Id)), Times.Once);
        _notificationService.Verify(n => n.SendAsync(It.IsAny<NotificationRequest>()), Times.Once);
    }
}
