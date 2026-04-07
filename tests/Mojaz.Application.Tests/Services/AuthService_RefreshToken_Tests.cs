using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
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

public class AuthService_RefreshToken_Tests
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
    public async Task RefreshTokenAsync_InvalidOrExpiredToken_ReturnsUnauthorized()
    {
        // Arrange
        var service = CreateService();
        _refreshTokenRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<RefreshToken, bool>>>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(new List<RefreshToken>()); // Token not found or revoked (FindAsync filters in service)

        // Act
        var result = await service.RefreshTokenAsync(new RefreshTokenRequest { RefreshToken = "invalid_token" });

        // Assert
        result.StatusCode.Should().Be(401);
        result.Success.Should().BeFalse();
        _auditService.Verify(a => a.LogAsync("REFRESH_TOKEN_FAILED", "RefreshToken", "invalid_token", null, null), Times.Once);
    }

    [Fact]
    public async Task RefreshTokenAsync_ValidToken_RotatesTokens()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var oldRefreshToken = new RefreshToken 
        { 
            UserId = userId, 
            Token = "existing_refresh_token", 
            ExpiresAt = DateTime.UtcNow.AddMinutes(10)
        };
        _refreshTokenRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<RefreshToken, bool>>>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(new List<RefreshToken> { oldRefreshToken });

        var user = new User { Id = userId, FullNameEn = "User One", Role = UserRole.Applicant, IsActive = true };
        _userRepo.Setup(r => r.GetByIdAsync(userId, It.IsAny<CancellationToken>())).ReturnsAsync(user);

        _jwtService.Setup(j => j.GenerateAccessToken(user.Id, user.FullNameEn, user.Role.ToString())).Returns("new_access_token");
        _jwtService.Setup(j => j.GenerateRefreshToken()).Returns("new_refresh_token");

        var service = CreateService();

        // Act
        var result = await service.RefreshTokenAsync(new RefreshTokenRequest { RefreshToken = "existing_refresh_token" });

        // Assert
        result.Success.Should().BeTrue();
        result.Data!.AccessToken.Should().Be("new_access_token");
        result.Data.RefreshToken.Should().Be("new_refresh_token");
        
        // Rotation check
        oldRefreshToken.IsRevoked.Should().BeTrue();
        oldRefreshToken.ReplacedByToken.Should().Be("new_refresh_token");
        _refreshTokenRepo.Verify(r => r.Update(oldRefreshToken), Times.Once);
        _refreshTokenRepo.Verify(r => r.AddAsync(It.Is<RefreshToken>(t => t.Token == "new_refresh_token"), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        _auditService.Verify(a => a.LogAsync("REFRESH_TOKEN_SUCCESS", "User", userId.ToString(), null, null), Times.Once);
    }
}
