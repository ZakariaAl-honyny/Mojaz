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

    [Fact]
    public async Task VerifyOtpAsync_NoValidOtp_ReturnsNotImplemented()
    {
        // Arrange
        var service = CreateService();
        
        // Act
        var result = await service.VerifyOtpAsync(new VerifyOtpRequest { Destination = "test@resend.com", Code = "123456", Purpose = OtpPurpose.Registration });

        // Assert
        // VerifyOtpAsync returns 501 (Not Implemented)
        result.StatusCode.Should().Be(501);
    }

    [Fact]
    public async Task VerifyOtpAsync_ValidRequest_ReturnsNotImplemented()
    {
        // Arrange
        var service = CreateService();
        var user = new User { Id = Guid.NewGuid(), Email = "test@resend.com", RegistrationMethod = RegistrationMethod.Email, IsActive = false };

        _userRepo.Setup(r => r.GetByIdAsync(user.Id, It.IsAny<CancellationToken>()))
                 .ReturnsAsync(user);

        // Act
        var result = await service.VerifyOtpAsync(new VerifyOtpRequest { Destination = "test@resend.com", Code = "123456", Purpose = OtpPurpose.Registration });

        // Assert
        // VerifyOtpAsync returns 501 (Not Implemented)
        result.StatusCode.Should().Be(501);
    }
}
