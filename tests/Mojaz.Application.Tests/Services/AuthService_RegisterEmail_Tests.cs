using System;
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

public class AuthService_RegisterEmail_Tests
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
        Mock.Of<IBackgroundJobClient>()
    );

    [Fact]
    public async Task RegisterAsync_ValidEmailRequest_ReturnsSuccessResponse()
    {
        // Arrange
        var service = CreateService();
        var request = new RegisterRequest
        {
            FullName = "Zakaria Test",
            Email = "test@mojaz.gov.sa",
            Password = "SecurePassword123!",
            ConfirmPassword = "SecurePassword123!",
            Method = RegistrationMethod.Email,
            TermsAccepted = true,
            PreferredLanguage = "ar"
        };

        _userRepo.Setup(r => r.ExistsAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await service.RegisterAsync(request);

        // Assert
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.RequiresVerification.Should().BeTrue();
        result.Message.Should().Contain("successful");
        
        _userRepo.Verify(r => r.AddAsync(It.Is<User>(u => 
            u.Email == request.Email && 
            u.FullNameAr == request.FullName &&
            u.IsActive == false &&
            u.RegistrationMethod == RegistrationMethod.Email
        ), It.IsAny<CancellationToken>()), Times.Once);

        _otpRepo.Verify(r => r.AddAsync(It.Is<OtpCode>(o => 
            o.Destination == request.Email && 
            o.DestinationType == DestinationType.Email &&
            o.Purpose == OtpPurpose.Registration
        )), Times.Once);

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
            Email = "ahmed@mojaz.gov.sa",
            Password = "Password123!",
            Method = RegistrationMethod.Email
        };

        _userRepo.Setup(r => r.ExistsAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>())).ReturnsAsync(false);

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
            Email = "hassan@mojaz.gov.sa",
            Password = "PlainPassword123!",
            Method = RegistrationMethod.Email
        };

        _userRepo.Setup(r => r.ExistsAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>())).ReturnsAsync(false);

        // Act
        await service.RegisterAsync(request);

        // Assert
        _userRepo.Verify(r => r.AddAsync(It.Is<User>(u => 
            !string.IsNullOrEmpty(u.PasswordHash) && 
            u.PasswordHash != request.Password
        ), It.IsAny<CancellationToken>()), Times.Once);
    }
}
