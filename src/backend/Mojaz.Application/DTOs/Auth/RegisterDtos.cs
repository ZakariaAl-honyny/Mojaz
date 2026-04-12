using Mojaz.Domain.Enums;

namespace Mojaz.Application.DTOs.Auth;

public class RegisterRequest
{
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
    public RegistrationMethod Method { get; set; }
    public string PreferredLanguage { get; set; } = "ar";
    public bool TermsAccepted { get; set; }
}

public class RegisterResponse
{
    public Guid UserId { get; set; }
    public bool RequiresVerification { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class UserDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public UserRole Role { get; set; }
    public bool IsActive { get; set; }
    public string PreferredLanguage { get; set; } = "ar";
}

public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
}
