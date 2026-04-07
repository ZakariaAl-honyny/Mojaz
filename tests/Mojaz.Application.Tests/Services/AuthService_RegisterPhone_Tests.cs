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

public class AuthService_RegisterPhone_Tests
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
    public async Task RegisterAsync_ValidPhoneRequest_ReturnsSuccessResponse()
    {
        // Arrange
        var service = CreateService();
        var request = new RegisterRequest
        {
            FullName = "Zakaria Phone",
            Phone = "+966500000000",
            Password = "SecurePassword123!",
            ConfirmPassword = "SecurePassword123!",
            Method = RegistrationMethod.Phone,
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
        
        _userRepo.Verify(r => r.AddAsync(It.Is<User>(u => 
            u.PhoneNumber == request.Phone && 
            u.IsActive == false &&
            u.RegistrationMethod == RegistrationMethod.Phone
        ), It.IsAny<CancellationToken>()), Times.Once);

        _otpRepo.Verify(r => r.AddAsync(It.Is<OtpCode>(o => 
            o.Destination == request.Phone && 
            o.DestinationType == DestinationType.Phone &&
            o.Purpose == OtpPurpose.Registration
        )), Times.Once);

        _unitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_ValidPhone_SendsNotificationWithSms()
    {
        // Arrange
        var service = CreateService();
        var request = new RegisterRequest
        {
            FullName = "Ahmed SMS",
            Phone = "+966511111111",
            Password = "Password123!",
            Method = RegistrationMethod.Phone
        };

        _userRepo.Setup(r => r.ExistsAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>())).ReturnsAsync(false);

        // Act
        await service.RegisterAsync(request);

        // Assert
        _notificationService.Verify(n => n.SendAsync(It.Is<NotificationRequest>(nr => 
            nr.Sms == true &&
            nr.Email == false
        )), Times.Once);
    }
}
