using Hangfire;
using Mojaz.Application.DTOs.Email;
using Mojaz.Application.DTOs.Email.Templates;
using Mojaz.Application.DTOs.Auth;
using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Constants;
using Mojaz.Shared;
using Mojaz.Shared.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using IEmailService = Mojaz.Application.Interfaces.Services.IEmailService;
using ISmsService = Mojaz.Application.Interfaces.Services.ISmsService;
using Microsoft.AspNetCore.Http;

namespace Mojaz.Application.Services;

public class AuthService : IAuthService
{
    private readonly IRepository<User> _userRepository;
    private readonly IOtpRepository _otpRepository;
    private readonly IRepository<RefreshToken> _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;
    private readonly INotificationService _notificationService;
    private readonly IAuditService _auditService;
    private readonly ISystemSettingsService _settingsService;
    private readonly IOtpService _otpService;
    private readonly IEmailService _emailService;
    private readonly ISmsService _smsService;
    private readonly IBackgroundJobClient _backgroundJobClient;

    public AuthService(
        IRepository<User> userRepository,
        IOtpRepository otpRepository,
        IRepository<RefreshToken> refreshTokenRepository,
        IUnitOfWork unitOfWork,
        IJwtService jwtService,
        INotificationService notificationService,
        IAuditService auditService,
        ISystemSettingsService settingsService,
        IOtpService otpService,
        IEmailService emailService,
        ISmsService smsService,
        IBackgroundJobClient backgroundJobClient)
    {
        _userRepository = userRepository;
        _otpRepository = otpRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
        _notificationService = notificationService;
        _auditService = auditService;
        _settingsService = settingsService;
        _otpService = otpService;
        _emailService = emailService;
        _smsService = smsService;
        _backgroundJobClient = backgroundJobClient;
    }

    public async Task<ApiResponse<RegisterResponse>> RegisterAsync(RegisterRequest request)
    {
        if (request.Method == RegistrationMethod.Email && await _userRepository.ExistsAsync(u => u.Email == request.Email))
            return ApiResponse<RegisterResponse>.Fail(400, "User with this email already exists.");

        if (request.Method == RegistrationMethod.Phone && await _userRepository.ExistsAsync(u => u.PhoneNumber == request.Phone))
            return ApiResponse<RegisterResponse>.Fail(400, "User with this phone number already exists.");

        var user = new User
        {
            FullNameAr = request.FullName, 
            FullNameEn = request.FullName,
            Email = request.Email ?? string.Empty,
            PhoneNumber = request.Phone ?? string.Empty,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, 12),
            Role = UserRole.Applicant,
            RegistrationMethod = request.Method,
            IsActive = false,
            PreferredLanguage = request.PreferredLanguage,
            IsEmailVerified = false,
            IsPhoneVerified = false
        };

        await _userRepository.AddAsync(user);

        var otpValidityMinutes = request.Method == RegistrationMethod.Email 
            ? await _settingsService.GetIntAsync("OTP_VALIDITY_MINUTES_EMAIL") ?? 15
            : await _settingsService.GetIntAsync("OTP_VALIDITY_MINUTES_SMS") ?? 5;

        var otpValue = new Random().Next(100000, 999999).ToString();
        var otp = new OtpCode
        {
            UserId = user.Id,
            CodeHash = BCrypt.Net.BCrypt.HashPassword(otpValue),
            ExpiresAt = DateTime.UtcNow.AddMinutes(otpValidityMinutes),
            Purpose = OtpPurpose.Registration,
            Destination = request.Method == RegistrationMethod.Email ? request.Email! : request.Phone!,
            DestinationType = request.Method == RegistrationMethod.Email ? DestinationType.Email : DestinationType.Phone,
            MaxAttempts = await _settingsService.GetIntAsync("OTP_MAX_ATTEMPTS") ?? 3
        };

        await _otpRepository.AddAsync(otp);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync("USER_REGISTERED", "User", user.Id.ToString());

        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = user.Id,
            EventType = NotificationEventType.StatusChanged, // Using an appropriate existing type or just general
            TitleAr = "تفعيل الحساب - مُجاز",
            TitleEn = "Account Activation - Mojaz",
            MessageAr = $"رمز التفعيل الخاص بك هو: {otpValue}",
            MessageEn = $"Your activation code is: {otpValue}",
            Email = request.Method == RegistrationMethod.Email,
            Sms = request.Method == RegistrationMethod.Phone,
            InApp = true,
            Push = true
        });

        var response = new RegisterResponse
        {
            UserId = user.Id,
            RequiresVerification = true,
            Message = "Registration successful. Please verify your identity with the OTP sent."
        };

        return ApiResponse<RegisterResponse>.Ok(response, response.Message);
    }

    public async Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request)
    {
        Expression<Func<User, bool>> predicate = request.Method == RegistrationMethod.Email 
            ? (u => u.Email == request.Identifier) 
            : (u => u.PhoneNumber == request.Identifier);

        var users = await _userRepository.FindAsync(predicate);
        var user = users.FirstOrDefault();

        if (user != null && user.LockoutEnd > DateTime.UtcNow)
            return ApiResponse<LoginResponse>.Fail(403, $"Account locked until {user.LockoutEnd:HH:mm}.");

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            if (user != null)
            {
                user.FailedLoginAttempts++;
                if (user.FailedLoginAttempts >= 5)
                    user.LockoutEnd = DateTime.UtcNow.AddMinutes(15);
                
                _userRepository.Update(user);
                await _unitOfWork.SaveChangesAsync();
                await _auditService.LogAsync("FAILED_LOGIN", "User", user.Id.ToString());
            }
            return ApiResponse<LoginResponse>.Fail(401, "Invalid credentials.");
        }

        if (!user.IsActive)
            return ApiResponse<LoginResponse>.Fail(403, "Account is inactive.");

        if (!user.IsEmailVerified && !user.IsPhoneVerified)
            return ApiResponse<LoginResponse>.Fail(403, "Account is not verified.");

        var accessToken = _jwtService.GenerateAccessToken(user.Id, user.FullNameEn, user.AppRole);
        var refreshTokenValue = _jwtService.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        await _refreshTokenRepository.AddAsync(refreshToken);

        user.LastLoginAt = DateTime.UtcNow;
        user.FailedLoginAttempts = 0;
        user.LockoutEnd = null;
        
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();
        await _auditService.LogAsync("USER_LOGIN", "User", user.Id.ToString());

        return ApiResponse<LoginResponse>.Ok(new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue,
            User = new UserDto { Id = user.Id, FullName = user.FullNameEn, Role = user.Role }
        });
    }

    public async Task<ApiResponse<bool>> VerifyOtpAsync(VerifyOtpRequest request)
    {
        // Use IOtpRepository to get the latest OTP for the destination and purpose
        var otp = await _otpRepository.GetLatestByDestinationAndPurposeAsync(request.Destination, request.Purpose);
        if (otp == null || otp.IsUsed || otp.IsInvalidated || otp.ExpiresAt <= DateTime.UtcNow)
            return ApiResponse<bool>.Fail(400, "invalid_otp_or_expired");

        if (otp.AttemptCount >= (otp.MaxAttempts > 0 ? otp.MaxAttempts : 3))
        {
            otp.IsInvalidated = true;
            await _otpRepository.UpdateAsync(otp);
            await _unitOfWork.SaveChangesAsync();
            await _auditService.LogAsync("OTP_MAX_ATTEMPTS_REACHED", "OtpCode", otp.Id.ToString());
            return ApiResponse<bool>.Fail(400, "max_attempts_reached");
        }

        if (!_otpService.VerifyOtpHash(request.Code, otp.CodeHash))
        {
            otp.AttemptCount++;
            await _otpRepository.UpdateAsync(otp);
            await _unitOfWork.SaveChangesAsync();
            var remaining = (otp.MaxAttempts > 0 ? otp.MaxAttempts : 3) - otp.AttemptCount;
            await _auditService.LogAsync("OTP_VERIFICATION_FAILED", "OtpCode", otp.Id.ToString());
            return ApiResponse<bool>.Fail(400, "invalid_otp", new List<string> { $"{remaining}_attempts_remaining" });
        }

        otp.IsUsed = true;
        otp.UsedAt = DateTime.UtcNow;
        await _otpRepository.UpdateAsync(otp);

        var user = await _userRepository.GetByIdAsync(otp.UserId);
        if (user != null)
        {
            if (otp.Purpose == OtpPurpose.Registration)
            {
                if (user.RegistrationMethod == RegistrationMethod.Email)
                {
                    user.IsEmailVerified = true;
                    user.EmailVerifiedAt = DateTime.UtcNow;
                }
                else if (user.RegistrationMethod == RegistrationMethod.Phone)
                {
                    user.IsPhoneVerified = true;
                    user.PhoneVerifiedAt = DateTime.UtcNow;
                }
                user.IsActive = true;
                _userRepository.Update(user);
            }
        }

        await _unitOfWork.SaveChangesAsync();
        await _auditService.LogAsync("OTP_VERIFICATION_SUCCESS", "User", user?.Id.ToString() ?? "unknown");
        return ApiResponse<bool>.Ok(true, "verification_successful");
    }

    public async Task<ApiResponse<OtpResponseDto>> ResendOtpAsync(ResendOtpRequest request)
    {
        var user = (await _userRepository.FindAsync(u =>
            u.Email == request.Destination || u.PhoneNumber == request.Destination)).FirstOrDefault();
        if (user == null)
            return ApiResponse<OtpResponseDto>.Fail(404, "user_not_found");

        var cooldownSec = await _settingsService.GetIntAsync("OTP_RESEND_COOLDOWN_SECONDS") ?? 60;
        var lastOtp = await _otpRepository.GetLatestByDestinationAndPurposeAsync(request.Destination, request.Purpose);
        if (lastOtp != null && (DateTime.UtcNow - lastOtp.CreatedAt).TotalSeconds < cooldownSec)
            return ApiResponse<OtpResponseDto>.Fail(429, "please_wait_before_resending");

        var maxPerHour = await _settingsService.GetIntAsync("OTP_MAX_RESEND_PER_HOUR") ?? 3;
        var resendCount = await _otpRepository.CountResendsLastHourAsync(request.Destination, request.Purpose);
        if (resendCount >= maxPerHour)
            return ApiResponse<OtpResponseDto>.Fail(429, "too_many_resend_requests");

        await _otpRepository.InvalidateUnusedAsync(request.Destination, request.Purpose);

        var otpValue = await _otpService.GenerateOtpAsync(request.Destination, request.Purpose.ToString());
        var isEmail = request.Destination.Contains('@');
        var validityMin = isEmail
            ? await _settingsService.GetIntAsync("OTP_VALIDITY_MINUTES_EMAIL") ?? 15
            : await _settingsService.GetIntAsync("OTP_VALIDITY_MINUTES_SMS") ?? 5;

        var otp = new OtpCode
        {
            UserId = user.Id,
            CodeHash = _otpService.HashOtp(otpValue),
            ExpiresAt = DateTime.UtcNow.AddMinutes(validityMin),
            Purpose = request.Purpose,
            Destination = request.Destination,
            DestinationType = isEmail ? DestinationType.Email : DestinationType.Phone,
            MaxAttempts = await _settingsService.GetIntAsync("OTP_MAX_ATTEMPTS") ?? 3
        };
        await _otpRepository.AddAsync(otp);
        await _unitOfWork.SaveChangesAsync();

        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = user.Id,
            EventType = NotificationEventType.StatusChanged,
            TitleAr = "رمز تفعيل جديد - مُجاز",
            TitleEn = "New Activation Code - Mojaz",
            MessageAr = $"رمز التفعيل الخاص بك الجديد هو: {otpValue}",
            MessageEn = $"Your new activation code is: {otpValue}",
            Email = otp.DestinationType == DestinationType.Email,
            Sms = otp.DestinationType == DestinationType.Phone,
            InApp = true,
            Push = true
        });

        await _auditService.LogAsync("OTP_RESEND_SUCCESS", "User", user.Id.ToString());
        return ApiResponse<OtpResponseDto>.Ok(new OtpResponseDto
        {
            DestinationMasked = request.Destination.Mask()
        }, "new_otp_sent");
    }

    public async Task<ApiResponse<bool>> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        Expression<Func<User, bool>> predicate = request.Method == RegistrationMethod.Email 
            ? (u => u.Email == request.Identifier) 
            : (u => u.PhoneNumber == request.Identifier);

        var users = await _userRepository.FindAsync(predicate);
        var user = users.FirstOrDefault();
        
        if (user == null) 
            return ApiResponse<bool>.Fail(404, "User not found.");

        if (!user.IsActive)
            return ApiResponse<bool>.Fail(403, "Account is inactive.");

        var otpValue = await _otpService.GenerateOtpAsync(request.Identifier, "PasswordReset");
        var otp = new OtpCode
        {
            UserId = user.Id,
            CodeHash = _otpService.HashOtp(otpValue),
            ExpiresAt = DateTime.UtcNow.AddMinutes(15),
            Purpose = OtpPurpose.PasswordReset,
            Destination = request.Identifier,
            DestinationType = request.Method == RegistrationMethod.Email ? DestinationType.Email : DestinationType.Phone
        };

        await _otpRepository.AddAsync(otp);
        await _unitOfWork.SaveChangesAsync();

        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = user.Id,
            EventType = NotificationEventType.StatusChanged,
            TitleAr = "استعادة كلمة المرور - مُجاز",
            TitleEn = "Password Recovery - Mojaz",
            MessageAr = $"رمز استعادة كلمة المرور هو: {otpValue}",
            MessageEn = $"Your password recovery code is: {otpValue}",
            Email = request.Method == RegistrationMethod.Email,
            Sms = request.Method == RegistrationMethod.Phone,
            InApp = true,
            Push = true
        });

        await _auditService.LogAsync("FORGOT_PASSWORD_REQUEST", "User", user.Id.ToString());

        return ApiResponse<bool>.Ok(true, "Recovery OTP sent.");
    }

    public async Task<ApiResponse<bool>> ResetPasswordAsync(ResetPasswordRequest request)
    {
        // Use GetLatestByDestinationAndPurposeAsync to get the latest OTP for password reset
        var otp = await _otpRepository.GetLatestByDestinationAndPurposeAsync(
            request.UserId.ToString(), // Assuming destination is stored as string UserId for password reset
            OtpPurpose.PasswordReset
        );

        if (otp == null || otp.IsUsed || otp.ExpiresAt <= DateTime.UtcNow || !_otpService.VerifyOtpHash(request.Code, otp.CodeHash))
            return ApiResponse<bool>.Fail(400, "Invalid or expired recovery code.");

        var user = await _userRepository.GetByIdAsync(request.UserId);
        if (user == null) return ApiResponse<bool>.Fail(404, "User not found.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword, 12);
        otp.IsUsed = true;
        otp.UsedAt = DateTime.UtcNow;

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();
        await _auditService.LogAsync("PASSWORD_RESET_SUCCESS", "User", user.Id.ToString());

        return ApiResponse<bool>.Ok(true, "Password reset successfully.");
    }

    public async Task<ApiResponse<LoginResponse>> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var tokens = await _refreshTokenRepository.FindAsync(t => t.Token == request.RefreshToken && !t.IsRevoked);
        var storedToken = tokens.FirstOrDefault();

        if (storedToken == null || storedToken.ExpiresAt < DateTime.UtcNow)
        {
            await _auditService.LogAsync("REFRESH_TOKEN_FAILED", "RefreshToken", request.RefreshToken);
            return ApiResponse<LoginResponse>.Fail(401, "Invalid or expired refresh token.");
        }

        var user = await _userRepository.GetByIdAsync(storedToken.UserId);
        if (user == null || !user.IsActive)
            return ApiResponse<LoginResponse>.Fail(403, "User not found or inactive.");

        var newAccessToken = _jwtService.GenerateAccessToken(user.Id, user.FullNameEn, user.AppRole);
        var newRefreshTokenValue = _jwtService.GenerateRefreshToken();

        storedToken.IsRevoked = true;
        storedToken.RevokedAt = DateTime.UtcNow;
        storedToken.ReplacedByToken = newRefreshTokenValue;

        var newRefreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = newRefreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        await _refreshTokenRepository.AddAsync(newRefreshToken);
        _refreshTokenRepository.Update(storedToken);
        await _unitOfWork.SaveChangesAsync();
        await _auditService.LogAsync("REFRESH_TOKEN_SUCCESS", "User", user.Id.ToString());

        return ApiResponse<LoginResponse>.Ok(new LoginResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshTokenValue,
            User = new UserDto { Id = user.Id, FullName = user.FullNameEn, Role = user.Role }
        });
    }

    public async Task<ApiResponse<bool>> LogoutAsync(LogoutRequest request)
    {
        var tokens = await _refreshTokenRepository.FindAsync(t => t.Token == request.RefreshToken && !t.IsRevoked);
        var storedToken = tokens.FirstOrDefault();
        
        if (storedToken != null)
        {
            storedToken.IsRevoked = true;
            storedToken.RevokedAt = DateTime.UtcNow;
            _refreshTokenRepository.Update(storedToken);
            await _unitOfWork.SaveChangesAsync();
            await _auditService.LogAsync("USER_LOGOUT", "User", storedToken.UserId.ToString());
        }

        return ApiResponse<bool>.Ok(true, "Logged out successfully.");
    }

    public async Task<ApiResponse<bool>> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return ApiResponse<bool>.Fail(404, "User not found");
        }

        // Verify current password
        if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
        {
            return ApiResponse<bool>.Fail(400, "Current password is incorrect");
        }

        // Hash and set new password
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        user.RequiresPasswordReset = false;
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync("PASSWORD_CHANGED", "User", userId.ToString());

        return ApiResponse<bool>.Ok(true, "Password changed successfully.");
    }
}
