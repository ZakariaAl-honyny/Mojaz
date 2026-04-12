using Mojaz.Application.Interfaces.Security;
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
using Hangfire;
using Microsoft.AspNetCore.Http;

namespace Mojaz.Application.Tests.Services;

public class AuthService_VerifyOtp_Tests
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
    private readonly Mock<ISmsService> _smsService = new();
    private readonly Mock<ISecurityAlertService> _securityAlertService = new();
    private readonly Mock<IHttpContextAccessor> _httpContextAccessor = new();

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
        _smsService.Object,
        Mock.Of<IBackgroundJobClient>(),
        _securityAlertService.Object,
        _httpContextAccessor.Object
    );

    [Fact]
    public async Task VerifyOtpAsync_NoValidOtp_ReturnsBadRequest()
    {
        // Arrange
        var service = CreateService();
        _otpRepo.Setup(r => r.GetLatestByDestinationAndPurposeAsync(It.IsAny<string>(), It.IsAny<OtpPurpose>()))
                 .ReturnsAsync((OtpCode?)null);

        // Act
        var result = await service.VerifyOtpAsync(new VerifyOtpRequest { Destination = "test@resend.com", Code = "123456", Purpose = OtpPurpose.Registration });

        // Assert
        result.StatusCode.Should().Be(400);
        result.Message.Should().Be("invalid_otp_or_expired");
    }

    [Fact]
    public async Task VerifyOtpAsync_CorrectCode_ReturnsSuccessAndActivatesUser()
    {
        // Arrange
        var service = CreateService();
        var user = new User { Id = Guid.NewGuid(), Email = "test@resend.com", RegistrationMethod = RegistrationMethod.Email, IsActive = false };
        var otp = new OtpCode 
        { 
            CodeHash = "hashed_123456", 
            UserId = user.Id, 
            ExpiresAt = DateTime.UtcNow.AddMinutes(10), 
            MaxAttempts = 3,
            Purpose = OtpPurpose.Registration
        };

        _userRepo.Setup(r => r.GetByIdAsync(user.Id, It.IsAny<CancellationToken>()))
                 .ReturnsAsync(user);

        _otpRepo.Setup(r => r.GetLatestByDestinationAndPurposeAsync(It.IsAny<string>(), It.IsAny<OtpPurpose>()))
                 .ReturnsAsync(otp);

        _otpService.Setup(s => s.VerifyOtpHash("123456", "hashed_123456")).Returns(true);

        // Act
        var result = await service.VerifyOtpAsync(new VerifyOtpRequest { Destination = "test@resend.com", Code = "123456", Purpose = OtpPurpose.Registration });

        // Assert
        result.Success.Should().BeTrue();
        user.IsActive.Should().BeTrue();
        user.IsEmailVerified.Should().BeTrue();
        otp.IsUsed.Should().BeTrue();
    }
}
