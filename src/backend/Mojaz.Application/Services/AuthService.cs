using Mojaz.Application.DTOs.Auth;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Models;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Mojaz.Application.Services;

public class AuthService : IAuthService
{
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<OtpCode> _otpRepository;
    private readonly IRepository<RefreshToken> _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;
    private readonly INotificationService _notificationService;
    private readonly IAuditService _auditService;
    private readonly ISystemSettingsService _settingsService;

    public AuthService(
        IRepository<User> userRepository,
        IRepository<OtpCode> otpRepository,
        IRepository<RefreshToken> refreshTokenRepository,
        IUnitOfWork unitOfWork,
        IJwtService jwtService,
        INotificationService notificationService,
        IAuditService auditService,
        ISystemSettingsService settingsService)
    {
        _userRepository = userRepository;
        _otpRepository = otpRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
        _notificationService = notificationService;
        _auditService = auditService;
        _settingsService = settingsService;
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
            Email = request.Email,
            PhoneNumber = request.Phone,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, 12),
            Role = UserRole.Applicant,
            RegistrationMethod = request.Method,
            IsActive = request.Method == RegistrationMethod.Email ? false : true,
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
            DestinationType = request.Method == RegistrationMethod.Email ? DestinationType.Email : DestinationType.Phone
        };

        await _otpRepository.AddAsync(otp);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync("USER_REGISTERED", "User", user.Id.ToString());

        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = user.Id,
            EventType = NotificationEventType.ApplicationSubmitted,
            TitleAr = "تفعيل الحساب - مُجاز",
            TitleEn = "Account Activation - Mojaz",
            MessageAr = $"رمز التفعيل الخاص بك هو: {otpValue}",
            MessageEn = $"Your activation code is: {otpValue}",
            Email = request.Method == RegistrationMethod.Email,
            Sms = request.Method == RegistrationMethod.Phone,
            InApp = true,
            Push = true
        });

        return ApiResponse<RegisterResponse>.Ok(new RegisterResponse
        {
            UserId = user.Id,
            RequiresVerification = true,
            Message = "Registration successful. Please verify your identity with the OTP sent."
        });
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

        var accessToken = _jwtService.GenerateAccessToken(user.Id, user.FullNameEn, user.Role.ToString());
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
        var otps = await _otpRepository.FindAsync(o => 
            o.UserId == request.UserId && 
            o.Purpose == request.Type && 
            !o.IsUsed && 
            o.ExpiresAt > DateTime.UtcNow);
        
        var otp = otps.FirstOrDefault();

        if (otp == null || !BCrypt.Net.BCrypt.Verify(request.Code, otp.CodeHash))
            return ApiResponse<bool>.Fail(400, "Invalid or expired OTP.");

        otp.IsUsed = true;
        otp.UsedAt = DateTime.UtcNow;

        var user = await _userRepository.GetByIdAsync(request.UserId);
        if (user != null)
        {
            if (request.Type == OtpPurpose.Registration) 
            {
                if (user.RegistrationMethod == RegistrationMethod.Email)
                {
                    user.IsEmailVerified = true;
                    user.EmailVerifiedAt = DateTime.UtcNow;
                    user.IsActive = true;
                }
                else if (user.RegistrationMethod == RegistrationMethod.Phone)
                {
                    user.IsPhoneVerified = true;
                    user.PhoneVerifiedAt = DateTime.UtcNow;
                    user.IsActive = true;
                }
            }
            _userRepository.Update(user);
        }

        await _unitOfWork.SaveChangesAsync();
        return ApiResponse<bool>.Ok(true, "Verification successful.");
    }

    public async Task<ApiResponse<bool>> ResendOtpAsync(ResendOtpRequest request)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId);
        if (user == null) return ApiResponse<bool>.Fail(404, "User not found.");

        var otpValue = new Random().Next(100000, 999999).ToString();
        var otp = new OtpCode
        {
            UserId = user.Id,
            CodeHash = BCrypt.Net.BCrypt.HashPassword(otpValue),
            ExpiresAt = DateTime.UtcNow.AddMinutes(5),
            Purpose = request.Type,
            Destination = user.RegistrationMethod == RegistrationMethod.Email ? user.Email! : user.PhoneNumber!,
            DestinationType = user.RegistrationMethod == RegistrationMethod.Email ? DestinationType.Email : DestinationType.Phone
        };

        await _otpRepository.AddAsync(otp);
        await _unitOfWork.SaveChangesAsync();

        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = user.Id,
            EventType = NotificationEventType.ApplicationSubmitted,
            TitleAr = "رمز تفعيل جديد - مُجاز",
            TitleEn = "New Activation Code - Mojaz",
            MessageAr = $"رمز التفعيل الخاص بك الجديد هو: {otpValue}",
            MessageEn = $"Your new activation code is: {otpValue}",
            Email = user.RegistrationMethod == RegistrationMethod.Email,
            Sms = user.RegistrationMethod == RegistrationMethod.Phone,
            InApp = true,
            Push = true
        });

        return ApiResponse<bool>.Ok(true, "New OTP has been sent.");
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

        var otpValue = new Random().Next(100000, 999999).ToString();
        var otp = new OtpCode
        {
            UserId = user.Id,
            CodeHash = BCrypt.Net.BCrypt.HashPassword(otpValue),
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
            EventType = NotificationEventType.ApplicationSubmitted,
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
        var otps = await _otpRepository.FindAsync(o => 
            o.UserId == request.UserId && 
            o.Purpose == OtpPurpose.PasswordReset && 
            !o.IsUsed && 
            o.ExpiresAt > DateTime.UtcNow);
        
        var otp = otps.FirstOrDefault();

        if (otp == null || !BCrypt.Net.BCrypt.Verify(request.Code, otp.CodeHash))
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

        var newAccessToken = _jwtService.GenerateAccessToken(user.Id, user.FullNameEn, user.Role.ToString());
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
}
