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
    Task UpdateUserStatusAsync(int userId, bool isActive);
    Task UpdateUserRoleAsync(int userId, AppRole appRole);
    Task UnlockUserAsync(int userId);
    Task<ApiResponse<bool>> SetSecurityBlockAsync(int userId, bool isBlocked, string reason);
    Task<ApiResponse<PagedResult<UserDto>>> GetUsersAsync(int page, int pageSize, string? search, AppRole? role);
    Task<ApiResponse<UserDto>> GetUserByIdAsync(int userId);
    Task<ApiResponse<UserDto>> GetCurrentUserAsync(int userId);
    Task<ApiResponse<UserDto>> UpdateCurrentUserAsync(int userId, UpdateMeRequest request);
    Task<ApiResponse<bool>> DeleteUserAsync(int userId);
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
            throw new InvalidOperationException("المستخدم بهذا البريد الإلكتروني موجود بالفعل.");
        }

        var temporaryPassword = PasswordGenerator.GenerateSecurePassword();

        var user = new User
        {
            Email = request.Email,
            FullNameAr = request.FullName,
            FullNameEn = request.FullName,
            PhoneNumber = request.PhoneNumber ?? string.Empty,
            NationalId = GenerateNationalId(), // Always generate valid NationalId
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

    public async Task UpdateUserStatusAsync(int userId, bool isActive)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException("المستخدم غير موجود.");
        }

        user.IsActive = isActive;
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Updated user {UserId} status to IsActive: {IsActive}", userId, isActive);
    }

    public async Task UpdateUserRoleAsync(int userId, AppRole appRole)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException("المستخدم غير موجود.");
        }

        user.AppRole = appRole;
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Updated user {UserId} role to: {Role}", userId, appRole);
    }

    public async Task UnlockUserAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException("المستخدم غير موجود.");
        }

        user.IsLocked = false;
        user.LockoutEnd = null;
        user.FailedLoginAttempts = 0;
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Unlocked user {UserId}. Reset failed attempts to 0.", userId);
    }

    public async Task<ApiResponse<bool>> SetSecurityBlockAsync(int userId, bool isBlocked, string reason)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return ApiResponse<bool>.NotFound("المستخدم غير موجود");
        }

        user.IsSecurityBlocked = isBlocked;
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Security block set for user {UserId}: IsBlocked={IsBlocked}, Reason={Reason}", userId, isBlocked, reason);

        return ApiResponse<bool>.Ok(true, isBlocked ? "تم منع المستخدم من الخدمات الأمنية بنجاح" : "تم إلغاء المنع الأمني للمستخدم بنجاح");
    }

    public async Task<ApiResponse<PagedResult<UserDto>>> GetUsersAsync(int page, int pageSize, string? search, AppRole? role)
    {
        // Defensive checks for pagination
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100;

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
                (u.Email != null && u.Email.ToLower().Contains(searchLower)) ||
                (u.PhoneNumber != null && u.PhoneNumber.Contains(search)));
        }

        var total = await query.CountAsync();
        
        // Base query for ordering and selection
        var baseQuery = query.OrderByDescending(u => u.CreatedAt);

        // Calculate skip - only use Skip if > 0 to avoid unnecessary OFFSET 0 which can fail on old SQL Server
        var skip = (page - 1) * pageSize;
        IQueryable<User> finalQuery = baseQuery;
        
        if (skip > 0)
        {
            finalQuery = finalQuery.Skip(skip);
        }

        // Fetch items with explicit mapping to avoid translation issues for enums
        var pagedUsers = await finalQuery
            .Take(pageSize)
            .Select(u => new UserDto
            {
                Id = u.Id,
                FullName = u.FullNameAr ?? u.FullNameEn ?? string.Empty,
                Email = u.Email ?? string.Empty,
                PhoneNumber = u.PhoneNumber ?? string.Empty,
                NationalId = u.NationalId ?? string.Empty,
                // Explicit cast through byte to ensure EF Core handles it as a numeric value
                AppRole = (AppRole)(byte)u.Role, 
                IsActive = u.IsActive,
                RequiresPasswordReset = u.RequiresPasswordReset,
                CreatedAt = u.CreatedAt,
                Address = u.Address,
                City = u.City,
                Region = u.Region,
                DateOfBirth = u.DateOfBirth,
                Gender = u.Gender,
                Nationality = u.Nationality,
                BloodType = u.BloodType,
                IsEmailVerified = u.IsEmailVerified,
                IsPhoneVerified = u.IsPhoneVerified,
                IsLocked = u.IsLocked,
                IsSecurityBlocked = u.IsSecurityBlocked
            })
            .ToListAsync();

        var result = new PagedResult<UserDto>
        {
            Items = pagedUsers,
            TotalCount = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };

        return ApiResponse<PagedResult<UserDto>>.Ok(result, "تم استرجاع المستخدمين بنجاح");
    }

    public async Task<ApiResponse<UserDto>> GetUserByIdAsync(int userId)
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
            NationalId = user.NationalId,
            AppRole = user.AppRole ?? AppRole.Applicant,
            IsActive = user.IsActive,
            RequiresPasswordReset = user.RequiresPasswordReset,
            CreatedAt = user.CreatedAt,
            Address = user.Address,
            City = user.City,
            Region = user.Region,
            DateOfBirth = user.DateOfBirth,
            Gender = user.Gender,
            Nationality = user.Nationality,
            BloodType = user.BloodType,
            IsEmailVerified = user.IsEmailVerified,
            IsPhoneVerified = user.IsPhoneVerified,
            IsLocked = user.IsLocked,
            IsSecurityBlocked = user.IsSecurityBlocked
        };

        return ApiResponse<UserDto>.Ok(userDto, "تم استرجاع المستخدم بنجاح");
    }

    public async Task<ApiResponse<UserDto>> GetCurrentUserAsync(int userId)
    {
        var result = await GetUserByIdAsync(userId);
        if (result.Success && result.Data != null)
        {
            result.Message = "تم استرجاع بيانات المستخدم الحالي بنجاح";
        }
        return result;
    }

    public async Task<ApiResponse<UserDto>> UpdateCurrentUserAsync(int userId, UpdateMeRequest request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return ApiResponse<UserDto>.Fail(404, "المستخدم غير موجود");
        }

        // Update only provided fields
        if (!string.IsNullOrWhiteSpace(request.FullName))
        {
            user.FullNameAr = request.FullName;
            user.FullNameEn = request.FullName;
        }

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            user.Email = request.Email;
        }

        if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            user.PhoneNumber = request.PhoneNumber;
        }

        if (!string.IsNullOrWhiteSpace(request.NationalId))
        {
            user.NationalId = request.NationalId;
        }

        if (!string.IsNullOrWhiteSpace(request.Address))
        {
            user.Address = request.Address;
        }

        if (!string.IsNullOrWhiteSpace(request.City))
        {
            user.City = request.City;
        }

        if (!string.IsNullOrWhiteSpace(request.Region))
        {
            user.Region = request.Region;
        }

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();

        var userDto = new UserDto
        {
            Id = user.Id,
            FullName = user.FullNameAr,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            NationalId = user.NationalId,
            AppRole = user.AppRole ?? AppRole.Applicant,
            IsActive = user.IsActive,
            RequiresPasswordReset = user.RequiresPasswordReset,
            CreatedAt = user.CreatedAt,
            Address = user.Address,
            City = user.City,
            Region = user.Region,
            DateOfBirth = user.DateOfBirth,
            Gender = user.Gender,
            Nationality = user.Nationality,
            BloodType = user.BloodType
        };

        return ApiResponse<UserDto>.Ok(userDto, "تم تحديث البيانات بنجاح");
    }

    public async Task<ApiResponse<bool>> DeleteUserAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return ApiResponse<bool>.NotFound("المستخدم غير موجود");
        }

        if (user.IsDeleted)
        {
            return ApiResponse<bool>.Fail(400, "المستخدم محذوف مسبقاً");
        }

        user.IsDeleted = true;
        user.DeletedAt = DateTime.UtcNow;
        user.IsActive = false; // Also deactivate the user
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Soft deleted user {UserId}. User is now inactive.", userId);

        return ApiResponse<bool>.Ok(true, "تم حذف المستخدم بنجاح");
    }

    private static readonly Random _random = new Random();
    private static string GenerateNationalId()
    {
        // Generate a unique 10-digit number
        var timestamp = DateTime.UtcNow.Ticks % 10000000000;
        var randomPart = _random.Next(10000000, 99999999);
        var combined = (timestamp + randomPart) % 10000000000;
        return combined.ToString("D10");
    }
}