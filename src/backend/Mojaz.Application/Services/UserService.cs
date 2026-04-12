using Microsoft.Extensions.Logging;
using Mojaz.Application.DTOs.User;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Utilities;
using System.Linq.Expressions;

namespace Mojaz.Application.Services;

public interface IUserService
{
    Task<CreateUserResponse> CreateUserAsync(CreateUserRequest request);
    Task UpdateUserStatusAsync(Guid userId, bool isActive);
    Task UpdateUserRoleAsync(Guid userId, AppRole appRole);
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<UserDto?> GetUserByIdAsync(Guid userId);
}

public class UserService : IUserService
{
    private readonly IRepository<User> _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UserService> _logger;

    public UserService(IRepository<User> userRepository, IUnitOfWork unitOfWork, ILogger<UserService> logger)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<CreateUserResponse> CreateUserAsync(CreateUserRequest request)
    {
        // Check if email already exists
        var existingUsers = await _userRepository.FindAsync(u => u.Email == request.Email);
        var existingUser = existingUsers.FirstOrDefault();
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        // Generate temporary password
        var temporaryPassword = PasswordGenerator.GenerateSecurePassword();

        // Create user entity
        var user = new User
        {
            Email = request.Email,
            FullNameAr = request.FullName,
            FullNameEn = request.FullName,
            PhoneNumber = request.PhoneNumber,
            AppRole = request.AppRole,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(temporaryPassword),
            RequiresPasswordReset = true,
            IsActive = true,
            RegistrationMethod = RegistrationMethod.AdminCreated
        };

        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Created new user with ID: {UserId}, Role: {Role}", user.Id, request.AppRole);

        return new CreateUserResponse
        {
            UserId = user.Id,
            TemporaryPassword = temporaryPassword
        };
    }

    public async Task UpdateUserStatusAsync(Guid userId, bool isActive)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        user.IsActive = isActive;
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Updated user {UserId} status to IsActive: {IsActive}", userId, isActive);
    }

    public async Task UpdateUserRoleAsync(Guid userId, AppRole appRole)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        user.AppRole = appRole;
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Updated user {UserId} role to: {Role}", userId, appRole);
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(u => new UserDto
        {
            Id = u.Id,
            FullName = u.FullNameAr,
            Email = u.Email,
            PhoneNumber = u.PhoneNumber,
            AppRole = u.AppRole,
            IsActive = u.IsActive,
            RequiresPasswordReset = u.RequiresPasswordReset,
            CreatedAt = u.CreatedAt
        });
    }

    public async Task<UserDto?> GetUserByIdAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            FullName = user.FullNameAr,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            AppRole = user.AppRole,
            IsActive = user.IsActive,
            RequiresPasswordReset = user.RequiresPasswordReset,
            CreatedAt = user.CreatedAt
        };
    }
}