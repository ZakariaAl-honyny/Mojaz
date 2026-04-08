using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Mojaz.Application.DTOs.User;
using Mojaz.Application.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Utilities;
using Moq;
using Xunit;
using BCrypt.Net;
using Microsoft.Extensions.Logging;

namespace Mojaz.Application.Tests.Services;

public class UserService_CreateUser_Tests
{
    private readonly Mock<IRepository<User>> _userRepo = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();
    private readonly Mock<ILogger<UserService>> _logger = new();

    private UserService CreateService() => new(
        _userRepo.Object,
        _unitOfWork.Object,
        _logger.Object
    );

    [Fact]
    public async Task CreateUserAsync_ValidRequest_ReturnsCreatedUserWithTemporaryPassword()
    {
        // Arrange
        var service = CreateService();
        var request = new CreateUserRequest
        {
            Email = "newuser@mojaz.gov.sa",
            FullName = "John Doe",
            PhoneNumber = "+966501234567",
            AppRole = AppRole.Applicant
        };

        _userRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<User>()); // No existing user

        // Setup AddAsync to return a user with an Id
        var testUserId = Guid.NewGuid();
        _userRepo.Setup(r => r.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((User user, CancellationToken ct) => 
            {
                user.Id = testUserId;
                return user;
            });

        // Act
        var result = await service.CreateUserAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.UserId.Should().NotBeEmpty();
        result.TemporaryPassword.Should().NotBeNullOrWhiteSpace();

        // Verify user was added with correct properties
        _userRepo.Verify(r => r.AddAsync(It.Is<User>(u => 
            u.Email == request.Email &&
            u.FullNameAr == request.FullName &&
            u.FullNameEn == request.FullName &&
            u.PhoneNumber == request.PhoneNumber &&
            u.AppRole == request.AppRole &&
            u.RequiresPasswordReset == true &&
            u.IsActive == true &&
            u.RegistrationMethod == RegistrationMethod.AdminCreated &&
            !string.IsNullOrEmpty(u.PasswordHash)
        ), It.IsAny<CancellationToken>()), Times.Once);

        _unitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateUserAsync_EmailAlreadyExists_ThrowsInvalidOperationException()
    {
        // Arrange
        var service = CreateService();
        var request = new CreateUserRequest
        {
            Email = "existing@mojaz.gov.sa",
            FullName = "Jane Doe",
            PhoneNumber = "+966501234567",
            AppRole = AppRole.Doctor
        };

        var existingUser = new User { Id = Guid.NewGuid(), Email = request.Email };
        _userRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<User> { existingUser });

        // Act
        Func<Task> act = async () => await service.CreateUserAsync(request);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("User with this email already exists");

        _userRepo.Verify(r => r.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()), Times.Never);
        _unitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task CreateUserAsync_NullRequest_ThrowsArgumentNullException()
    {
        // Arrange
        var service = CreateService();

        // Act
        Func<Task> act = async () => await service.CreateUserAsync(null!);

        // Assert
        await act.Should().ThrowAsync<ArgumentNullException>();
    }
}