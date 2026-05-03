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

public class AuthService_VerifyOtp_Tests
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

    [Fact(Skip = "EF Core mock IQueryable doesn't support async operations")]
    public async Task VerifyOtpAsync_NoValidOtp_ReturnsBadRequest()
    {
        // Arrange
        var service = CreateService();
        // Mock FindAsync to return empty list (no valid OTP found)
        _otpRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<OtpCode, bool>>>(), It.IsAny<CancellationToken>()))
                 .ReturnsAsync((IReadOnlyList<OtpCode>)new List<OtpCode>());

        // Act
        var result = await service.VerifyOtpAsync(new VerifyOtpRequest { Destination = "test@resend.com", Code = "123456", Purpose = OtpPurpose.Registration });

        // Assert
        result.StatusCode.Should().Be(400);
        result.Message.Should().Be("No valid OTP found for this destination.");
    }

    [Fact(Skip = "EF Core mock IQueryable doesn't support async operations")]
    public async Task VerifyOtpAsync_CorrectCode_ReturnsSuccessAndActivatesUser()
    {
        // Arrange
        var service = CreateService();
        var user = new User { Id = 1, Email = "test@resend.com", RegistrationMethod = RegistrationMethod.Email, IsActive = false };
        var otp = new OtpCode 
        { 
            CodeHash = BCrypt.Net.BCrypt.HashPassword("123456"), 
            UserId = user.Id, 
            ExpiresAt = DateTime.UtcNow.AddMinutes(10), 
            Purpose = OtpPurpose.Registration,
            Destination = "test@resend.com",
            DestinationType = DestinationType.Email,
            IsUsed = false
        };

        _userRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
                 .ReturnsAsync((IReadOnlyList<User>)new List<User> { user });

        // Mock FindAsync to return the valid OTP
        _otpRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<OtpCode, bool>>>(), It.IsAny<CancellationToken>()))
                 .ReturnsAsync((IReadOnlyList<OtpCode>)new List<OtpCode> { otp });

        // Act
        var result = await service.VerifyOtpAsync(new VerifyOtpRequest { Destination = "test@resend.com", Code = "123456", Purpose = OtpPurpose.Registration });

        // Assert
        result.Success.Should().BeTrue();
        user.IsActive.Should().BeTrue();
        user.IsEmailVerified.Should().BeTrue();
        otp.IsUsed.Should().BeTrue();
    }
}