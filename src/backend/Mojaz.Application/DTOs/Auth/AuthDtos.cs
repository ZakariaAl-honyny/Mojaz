using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Application.DTOs.Auth;

public class LoginRequest
{
    public string Identifier { get; set; } = string.Empty; // Email or Phone
    public string Password { get; set; } = string.Empty;
    public RegistrationMethod Method { get; set; }
}

public class LoginResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public UserDto User { get; set; } = new UserDto();
}

public class RefreshTokenRequest
{
    public string RefreshToken { get; set; } = string.Empty;
}

public class LogoutRequest 
{ 
    public string RefreshToken { get; set; } = string.Empty; 
}

public class ForgotPasswordRequest
{
    public string Identifier { get; set; } = string.Empty;
    public RegistrationMethod Method { get; set; }
}

public class ResetPasswordRequest
{
    public Guid UserId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
