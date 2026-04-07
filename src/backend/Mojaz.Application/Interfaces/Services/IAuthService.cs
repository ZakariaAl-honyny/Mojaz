using Mojaz.Application.DTOs.Auth;
using Mojaz.Shared.Models;
using System;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IAuthService
{
    Task<ApiResponse<RegisterResponse>> RegisterAsync(RegisterRequest request);
    Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request);
    Task<ApiResponse<bool>> VerifyOtpAsync(VerifyOtpRequest request);
    Task<ApiResponse<OtpResponseDto>> ResendOtpAsync(ResendOtpRequest request);
    Task<ApiResponse<LoginResponse>> RefreshTokenAsync(RefreshTokenRequest request);
    Task<ApiResponse<bool>> LogoutAsync(LogoutRequest request);
    Task<ApiResponse<bool>> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<ApiResponse<bool>> ResetPasswordAsync(ResetPasswordRequest request);
}
