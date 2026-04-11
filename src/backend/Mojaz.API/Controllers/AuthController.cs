using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using Mojaz.Application.DTOs.Auth;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using Mojaz.Shared.Constants;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[EnableRateLimiting(SecurityConstants.Policies.AuthRateLimit)]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Register a new user using the standard registration process.
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<RegisterResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Authenticate a user and return access/refresh tokens.
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Verify an OTP code for a specific user and purpose.
    /// </summary>
    [HttpPost("verify-otp")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
    {
        var result = await _authService.VerifyOtpAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Resend an OTP code to the user's destination.
    /// </summary>
    [HttpPost("resend-otp")]
    [ProducesResponseType(typeof(ApiResponse<OtpResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> ResendOtp([FromBody] ResendOtpRequest request)
    {
        var result = await _authService.ResendOtpAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        var result = await _authService.RefreshTokenAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
    {
        var result = await _authService.LogoutAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var result = await _authService.ForgotPasswordAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var result = await _authService.ResetPasswordAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Change password for authenticated user.
    /// </summary>
    [HttpPost("change-password")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new ApiResponse<bool>
            {
                Success = false,
                Message = "Invalid token",
                StatusCode = StatusCodes.Status401Unauthorized
            });
        }

        var result = await _authService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Quick registration specifically for email users.
    /// </summary>
    [HttpPost("register/email")]
    [ProducesResponseType(typeof(ApiResponse<RegisterResponse>), StatusCodes.Status201Created)]
    public async Task<IActionResult> RegisterWithEmail([FromBody] RegisterRequest request)
    {
        request.Method = RegistrationMethod.Email;
        var result = await _authService.RegisterAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Quick registration specifically for phone users.
    /// </summary>
    [HttpPost("register/phone")]
    [ProducesResponseType(typeof(ApiResponse<RegisterResponse>), StatusCodes.Status201Created)]
    public async Task<IActionResult> RegisterWithPhone([FromBody] RegisterRequest request)
    {
        request.Method = RegistrationMethod.Phone;
        var result = await _authService.RegisterAsync(request);
        return StatusCode(result.StatusCode, result);
    }
}
