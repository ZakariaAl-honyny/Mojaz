using Microsoft.Extensions.Logging;
using Mojaz.Application.DTOs.User;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
using Mojaz.Shared.Utilities;
using System.Linq.Expressions;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Mojaz.Application.Services;

public interface IUserService
{
    Task<CreateUserResponse> CreateUserAsync(CreateUserRequest request);
    Task UpdateUserStatusAsync(Guid userId, bool isActive);
    Task UpdateUserRoleAsync(Guid userId, AppRole appRole);
    Task<ApiResponse<PagedResult<UserDto>>> GetUsersAsync(int page, int pageSize, string? search, AppRole? role);
    Task<ApiResponse<UserDto>> GetUserByIdAsync(Guid userId);
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
        var existingUsers = await _userRepository.FindAsync(u => u.Email == request.Email);
        var existingUser = existingUsers.FirstOrDefault();
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        var temporaryPassword = PasswordGenerator.GenerateSecurePassword();

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

    public async Task<ApiResponse<PagedResult<UserDto>>> GetUsersAsync(int page, int pageSize, string? search, AppRole? role)
    {
        var query = _userRepository.Query();

        // Filter by role if provided
        if (role.HasValue)
        {
            query = query.Where(u => u.AppRole == role.Value);
        }

        // Filter by search if provided
        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(u => 
                (u.FullNameAr != null && u.FullNameAr.ToLower().Contains(searchLower)) ||
                (u.FullNameEn != null && u.FullNameEn.ToLower().Contains(searchLower)) ||
                u.Email.ToLower().Contains(searchLower) ||
                u.PhoneNumber.Contains(search));
        }

        var total = await query.CountAsync();
        var pagedUsers = await query.OrderByDescending(u => u.CreatedAt)
                           .Skip((page - 1) * pageSize)
                           .Take(pageSize)
                           .ToListAsync();

        var result = new PagedResult<UserDto>
        {
            Items = pagedUsers.Select(u => new UserDto
            {
                Id = u.Id,
                FullName = u.FullNameAr,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                AppRole = u.AppRole ?? AppRole.Applicant,
                IsActive = u.IsActive,
                RequiresPasswordReset = u.RequiresPasswordReset,
                CreatedAt = u.CreatedAt
            }).ToList(),
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };

        return ApiResponse<PagedResult<UserDto>>.Ok(result, "تم استرجاع المستخدمين بنجاح");
    }

    public async Task<ApiResponse<UserDto>> GetUserByIdAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return ApiResponse<UserDto>.NotFound("المستخدم غير موجود");
        }

        var userDto = new UserDto
        {
            Id = user.Id,
            FullName = user.FullNameAr,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            AppRole = user.AppRole ?? AppRole.Applicant,
            IsActive = user.IsActive,
            RequiresPasswordReset = user.RequiresPasswordReset,
            CreatedAt = user.CreatedAt
        };

        return ApiResponse<UserDto>.Ok(userDto, "تم استرجاع المستخدم بنجاح");
    }
}