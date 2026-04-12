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

public class AuthService_Login_Tests
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
    public async Task LoginAsync_UserNotFound_ReturnsUnauthorized()
    {
        // Arrange
        var service = CreateService();
        _userRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
                 .ReturnsAsync(new List<User>());

        // Act
        var result = await service.LoginAsync(new LoginRequest { Identifier = "nonexistent@test.com", Password = "123", Method = RegistrationMethod.Email });

        // Assert
        result.StatusCode.Should().Be(401);
        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task LoginAsync_AccountLocked_ReturnsForbidden()
    {
        // Arrange
        var user = new User { Id = Guid.NewGuid(), Email = "locked@test.com", LockoutEnd = DateTime.UtcNow.AddMinutes(10) };
        _userRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
                 .ReturnsAsync(new List<User> { user });

        var service = CreateService();

        // Act
        var result = await service.LoginAsync(new LoginRequest { Identifier = "locked@test.com", Password = "any", Method = RegistrationMethod.Email });

        // Assert
        result.StatusCode.Should().Be(403);
        result.Message.Should().Contain("locked");
    }

    [Fact]
    public async Task LoginAsync_InvalidPassword_IncrementsFailedAttemptsAndEventuallyLocks()
    {
        // Arrange
        var user = new User { Id = Guid.NewGuid(), Email = "fail@test.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("RealPassword"), FailedLoginAttempts = 4 };
        _userRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
                 .ReturnsAsync(new List<User> { user });

        var service = CreateService();

        // Act
        var result = await service.LoginAsync(new LoginRequest { Identifier = "fail@test.com", Password = "WrongPassword", Method = RegistrationMethod.Email });

        // Assert
        result.StatusCode.Should().Be(401);
        user.FailedLoginAttempts.Should().Be(5);
        user.LockoutEnd.Should().NotBeNull();
        _userRepo.Verify(r => r.Update(user), Times.Once);
        _unitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsTokens()
    {
        // Arrange
        var user = new User 
        { 
            Id = Guid.NewGuid(), 
            Email = "success@test.com", 
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword"), 
            IsActive = true, 
            IsEmailVerified = true,
            FullNameEn = "Success User",
            Role = UserRole.Applicant
        };
        _userRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
                 .ReturnsAsync(new List<User> { user });
        
        _jwtService.Setup(j => j.GenerateAccessToken(user.Id, user.FullNameEn, user.AppRole)).Returns("fake_access_token");
        _jwtService.Setup(j => j.GenerateRefreshToken()).Returns("fake_refresh_token");

        var service = CreateService();

        // Act
        var result = await service.LoginAsync(new LoginRequest { Identifier = "success@test.com", Password = "CorrectPassword", Method = RegistrationMethod.Email });

        // Assert
        result.Success.Should().BeTrue();
        result.Data!.AccessToken.Should().Be("fake_access_token");
        result.Data.RefreshToken.Should().Be("fake_refresh_token");
        user.FailedLoginAttempts.Should().Be(0);
        _refreshTokenRepo.Verify(r => r.AddAsync(It.IsAny<RefreshToken>(), It.IsAny<CancellationToken>()), Times.Once);
        _auditService.Verify(a => a.LogAsync("USER_LOGIN", "User", user.Id.ToString(), null, null), Times.Once);
    }
}
