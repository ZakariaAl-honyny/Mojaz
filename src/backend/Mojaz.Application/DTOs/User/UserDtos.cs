using Mojaz.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Mojaz.Application.DTOs.User;

public class CreateUserRequest
{
    [Required]
    [StringLength(200)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Phone]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    public AppRole AppRole { get; set; }
}

public class CreateUserResponse
{
    public int UserId { get; set; }
    public string TemporaryPassword { get; set; } = string.Empty;
}

public class UpdateUserStatusRequest
{
    public bool IsActive { get; set; }
}

public class UpdateUserRoleRequest
{
    public AppRole AppRole { get; set; }
}

/// <summary>
/// Security block/unblock request
/// </summary>
public class SecurityBlockRequest
{
    public bool IsBlocked { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class UserDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string NationalId { get; set; } = string.Empty;
    public AppRole AppRole { get; set; }
    public bool IsActive { get; set; }
    public bool RequiresPasswordReset { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Official Profile Fields
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Region { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public GenderEnum? Gender { get; set; }
    public string? Nationality { get; set; }
    public BloodTypeEnum? BloodType { get; set; }
    
    // Security and Status
    public bool IsEmailVerified { get; set; }
    public bool IsPhoneVerified { get; set; }
    public bool IsLocked { get; set; }
    public bool IsSecurityBlocked { get; set; }
}

public class UpdateMeRequest
{
    [StringLength(200)]
    public string? FullName { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    [Phone]
    public string? PhoneNumber { get; set; }

    [StringLength(10)]
    public string? NationalId { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? Region { get; set; }
}