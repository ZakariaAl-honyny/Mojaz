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
    public Guid UserId { get; set; }
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

public class UserDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public AppRole AppRole { get; set; }
    public bool IsActive { get; set; }
    public bool RequiresPasswordReset { get; set; }
    public DateTime CreatedAt { get; set; }
}