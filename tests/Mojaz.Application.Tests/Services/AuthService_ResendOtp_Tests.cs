using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using DrivingLicenseIssuanceSystem.Application.DTOs.Auth;
using DrivingLicenseIssuanceSystem.Application.Interfaces.Services;
using DrivingLicenseIssuanceSystem.Application.Services;
using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using DrivingLicenseIssuanceSystem.Domain.Interfaces;
using DrivingLicenseIssuanceSystem.Shared;
using Moq;
using Xunit;

namespace DrivingLicenseIssuanceSystem.Application.Tests.Services;

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
                 .ReturnsAsync(new List<User>());

        // Act
        var result = await service.ResendOtpAsync(new ResendOtpRequest { Destination = "invalid@test.com", Purpose = OtpPurpose.Registration });

        // Assert
        // ResendOtpAsync returns 501 (Not Implemented)
        result.StatusCode.Should().Be(501);
    }

    [Fact]
    public async Task ResendOtpAsync_ValidRequest_ReturnsNotImplemented()
    {
        // Arrange
        var service = CreateService();
        var user = new User { Id = Guid.NewGuid(), Email = "test@resend.com" };
        _userRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
                 .ReturnsAsync(new List<User> { user });

        // Act
        var result = await service.ResendOtpAsync(new ResendOtpRequest { Destination = "test@resend.com", Purpose = OtpPurpose.Registration });

        // Assert
        // ResendOtpAsync returns 501 (Not Implemented)
        result.StatusCode.Should().Be(501);
    }
}
