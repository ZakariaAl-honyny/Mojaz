using System;
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

public class AuthService_RegisterEmail_Tests
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
    public async Task RegisterAsync_ValidEmailRequest_ReturnsSuccessResponse()
    {
        // Arrange
        var service = CreateService();
        var request = new RegisterRequest
        {
            FullName = "Zakaria Test",
            Email = "test@DrivingLicenseIssuanceSystem.gov.sa",
            Password = "SecurePassword123!",
            ConfirmPassword = "SecurePassword123!",
            Method = RegistrationMethod.Email,
            TermsAccepted = true,
            PreferredLanguage = "ar"
        };

        _userRepo.Setup(r => r.ExistsAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _userRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<User>());

        // Act
        var result = await service.RegisterAsync(request);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.RequiresVerification.Should().BeTrue();
        
        _userRepo.Verify(r => r.AddAsync(It.Is<User>(u => 
            u.Email == request.Email && 
            u.FullNameAr == request.FullName &&
            u.RegistrationMethod == RegistrationMethod.Email
        ), It.IsAny<CancellationToken>()), Times.Once);

        _otpRepo.Verify(r => r.AddAsync(It.Is<OtpCode>(o => 
            o.Destination == request.Email && 
            o.DestinationType == DestinationType.Email &&
            o.Purpose == OtpPurpose.Registration
        ), It.IsAny<CancellationToken>()), Times.Once);

        _unitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_ValidEmail_SendsNotificationWithOtp()
    {
        // Arrange
        var service = CreateService();
        var request = new RegisterRequest
        {
            FullName = "Ahmed Test",
            Email = "ahmed@DrivingLicenseIssuanceSystem.gov.sa",
            Password = "Password123!",
            Method = RegistrationMethod.Email
        };

        _userRepo.Setup(r => r.ExistsAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>())).ReturnsAsync(false);
        _userRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>())).ReturnsAsync(new List<User>());

        // Act
        await service.RegisterAsync(request);

        // Assert
        _notificationService.Verify(n => n.SendAsync(It.Is<NotificationRequest>(nr => 
            nr.Email == true &&
            nr.Sms == false &&
            (nr.MessageAr!.Contains("رمز التفعيل") || nr.MessageEn!.Contains("activation code"))
        )), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_ValidEmail_HashesPassword()
    {
        // Arrange
        var service = CreateService();
        var request = new RegisterRequest
        {
            FullName = "Hassan Test",
            Email = "hassan@DrivingLicenseIssuanceSystem.gov.sa",
            Password = "PlainPassword123!",
            Method = RegistrationMethod.Email
        };

        _userRepo.Setup(r => r.ExistsAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>())).ReturnsAsync(false);
        _userRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>())).ReturnsAsync(new List<User>());

        // Act
        await service.RegisterAsync(request);

        // Assert
        _userRepo.Verify(r => r.AddAsync(It.Is<User>(u => 
            !string.IsNullOrEmpty(u.PasswordHash) && 
            u.PasswordHash != request.Password
        ), It.IsAny<CancellationToken>()), Times.Once);
    }
}
