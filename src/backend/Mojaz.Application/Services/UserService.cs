using Microsoft.Extensions.Logging;
using DrivingLicenseIssuanceSystem.Application.DTOs.User;
using DrivingLicenseIssuanceSystem.Domain.Entities;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using DrivingLicenseIssuanceSystem.Domain.Interfaces;
using DrivingLicenseIssuanceSystem.Shared.Utilities;
using System.Linq.Expressions;

namespace DrivingLicenseIssuanceSystem.Application.Services;

public interface IUserService
{
    Task<CreateUserResponse> CreateUserAsync(CreateUserRequest request);
    Task UpdateUserStatusAsync(Guid userId, bool isActive);
    Task UpdateUserRoleAsync(Guid userId, UserRole userRole);
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
            Role = (UserRole)request.AppRole,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(temporaryPassword),
            // RequiresPasswordReset is not a property of User entity, handled separately if needed
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

        public async Task UpdateUserRoleAsync(Guid userId, UserRole userRole)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            user.Role = userRole;
            _userRepository.Update(user);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Updated user {UserId} role to: {Role}", userId, userRole);
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
                AppRole = (AppRole)u.Role,
                IsActive = u.IsActive,
                // RequiresPasswordReset is not stored in User entity, defaulting to false
                RequiresPasswordReset = false,
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
                AppRole = (AppRole)user.Role,
                IsActive = user.IsActive,
                // RequiresPasswordReset is not stored in User entity, defaulting to false
                RequiresPasswordReset = false,
                CreatedAt = user.CreatedAt
            };
        }
}