using Mojaz.Application.DTOs.Auth;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared;
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
        // Check for existing user by email
        if (!string.IsNullOrEmpty(request.Email))
        {
            var existingByEmail = await _userRepository.FindAsync(u => u.Email == request.Email && !u.IsDeleted);
            if (existingByEmail.Any())
                return ApiResponse<RegisterResponse>.Fail(400, "User with this email already exists.");
        }

        // Check for existing user by phone
        if (!string.IsNullOrEmpty(request.Phone))
        {
            var existingByPhone = await _userRepository.FindAsync(u => u.PhoneNumber == request.Phone && !u.IsDeleted);
            if (existingByPhone.Any())
                return ApiResponse<RegisterResponse>.Fail(400, "User with this phone number already exists.");
        }

var user = new User
        {
            Id = Guid.NewGuid(),
            FullNameAr = request.FullName ?? string.Empty,
            FullNameEn = request.FullName ?? string.Empty,
            NationalId = GenerateNationalId(),
            Email = request.Email ?? string.Empty,
            PhoneNumber = request.Phone ?? string.Empty,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, 12),
            Role = UserRole.Applicant,
            RegistrationMethod = request.Method,
            IsActive = request.Method == RegistrationMethod.Email ? false : true,
            PreferredLanguage = request.PreferredLanguage ?? "ar",
            IsEmailVerified = false,
            IsPhoneVerified = false,
            DateOfBirth = DateTime.UtcNow.AddYears(-20) // Default age for new registrations
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
        // Find user by NationalId, email, or phone
        User? user = null;
        
        // Support three login methods: NationalId, Email, or Phone
        if (request.Method == RegistrationMethod.NationalId || string.IsNullOrEmpty(request.Identifier))
        {
            // Try to find by NationalId (identifier field contains NationalId)
            var usersByNationalId = await _userRepository.FindAsync(u => 
                u.NationalId == request.Identifier.Trim() && !u.IsDeleted);
            user = usersByNationalId.FirstOrDefault();
        }
        
        // If not found by NationalId, try by email
        if (user == null && (request.Method == RegistrationMethod.Email || request.Identifier.Contains("@")))
        {
            var usersByEmail = await _userRepository.FindAsync(u => 
                u.Email.ToLower() == request.Identifier.ToLower().Trim() && !u.IsDeleted);
            user = usersByEmail.FirstOrDefault();
        }
        
        // If still not found, try by phone
        if (user == null)
        {
            var usersByPhone = await _userRepository.FindAsync(u => 
                u.PhoneNumber == request.Identifier.Trim() && !u.IsDeleted);
            user = usersByPhone.FirstOrDefault();
        }

        // Debug: Log the lookup result
        _auditService.LogAsync("LOGIN_ATTEMPT", "User", 
            $"Identifier={request.Identifier}, Method={request.Method}, UserFound={user != null}").ConfigureAwait(false);

        if (user != null && user.LockoutEnd > DateTime.UtcNow)
            return ApiResponse<LoginResponse>.Fail(403, $"Account locked until {user.LockoutEnd:HH:mm}.");

        // Verify password - BCrypt verification
        bool passwordValid = false;
        if (user != null && !string.IsNullOrEmpty(user.PasswordHash))
        {
            try 
            {
                passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            }
            catch (Exception ex)
            {
                // Log BCrypt failure for debugging
                _auditService.LogAsync("LOGIN_ERROR", "User", 
                    $"BCrypt error: {ex.Message}, Hash={user.PasswordHash.Substring(0, Math.Min(20, user.PasswordHash.Length))}").ConfigureAwait(false);
            }
        }
        
        if (user == null || !passwordValid)
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

        // Cast UserRole to AppRole since they have the same values but are different enums
        var accessToken = _jwtService.GenerateAccessToken(user.Id, user.FullNameEn, (AppRole)user.Role);
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
        // Find OTP by destination and purpose
        var otps = await _otpRepository.FindAsync(o => 
            o.Destination == request.Destination && 
            o.Purpose == request.Purpose && 
            !o.IsUsed && 
            o.ExpiresAt > DateTime.UtcNow);
        
        var otp = otps.FirstOrDefault();
        
        if (otp == null)
            return ApiResponse<bool>.Fail(400, "No valid OTP found for this destination.");
            
        if (!BCrypt.Net.BCrypt.Verify(request.Code, otp.CodeHash))
        {
            otp.AttemptCount++;
            if (otp.AttemptCount >= 3)
            {
                otp.IsUsed = true; // Mark as used after failed attempts
                otp.IsInvalidated = true;
            }
            await _unitOfWork.SaveChangesAsync();
            return ApiResponse<bool>.Fail(400, "Invalid verification code.");
        }

        // OTP is valid - mark as used
        otp.IsUsed = true;
        
        // Find the user and mark as verified
        var users = await _userRepository.FindAsync(u => u.Id == otp.UserId && !u.IsDeleted);
        var user = users.FirstOrDefault();
        
        if (user != null)
        {
            if (otp.DestinationType == DestinationType.Email)
                user.IsEmailVerified = true;
            else
                user.IsPhoneVerified = true;
            
            // If verified via email, activate the account
            if (otp.DestinationType == DestinationType.Email && !user.IsActive)
                user.IsActive = true;
                
            _userRepository.Update(user);
        }
        
        await _unitOfWork.SaveChangesAsync();
        
        await _auditService.LogAsync("OTP_VERIFIED", "User", user?.Id.ToString() ?? otp.UserId.ToString());
        
        return ApiResponse<bool>.Ok(true, "Verification successful.");
    }

    public async Task<ApiResponse<OtpResponseDto>> ResendOtpAsync(ResendOtpRequest request)
    {
        // Find existing valid OTP
        var otps = await _otpRepository.FindAsync(o => 
            o.Destination == request.Destination && 
            o.Purpose == request.Purpose && 
            !o.IsUsed && 
            o.ExpiresAt > DateTime.UtcNow);
        
        var existingOtp = otps.FirstOrDefault();
        
        // Check cooldown (60 seconds)
        if (existingOtp != null && existingOtp.CreatedAt > DateTime.UtcNow.AddSeconds(-60))
            return ApiResponse<OtpResponseDto>.Fail(429, "Please wait before requesting another OTP.");
        
        // Find user
        var users = await _userRepository.FindAsync(u => 
            (u.Email == request.Destination || u.PhoneNumber == request.Destination) && 
            !u.IsDeleted);
        var user = users.FirstOrDefault();
        
        if (user == null)
            return ApiResponse<OtpResponseDto>.Fail(404, "User not found.");
        
        // Generate new OTP
        var otpValue = new Random().Next(100000, 999999).ToString();
        var destinationType = request.Destination.Contains('@') ? DestinationType.Email : DestinationType.Phone;
        
        var otp = new OtpCode
        {
            UserId = user.Id,
            CodeHash = BCrypt.Net.BCrypt.HashPassword(otpValue),
            ExpiresAt = DateTime.UtcNow.AddMinutes(destinationType == DestinationType.Email ? 15 : 5),
            Purpose = request.Purpose,
            Destination = request.Destination,
            DestinationType = destinationType
        };
        
        await _otpRepository.AddAsync(otp);
        
        // Invalidate old OTP if exists
        if (existingOtp != null)
        {
            existingOtp.IsInvalidated = true;
            existingOtp.IsUsed = true;
        }
        
        await _unitOfWork.SaveChangesAsync();
        
        // Send notification
        await _notificationService.SendAsync(new NotificationRequest
        {
            UserId = user.Id,
            EventType = NotificationEventType.OtpResent,
            TitleAr = "رمز التحقق الجديد - مُجاز",
            TitleEn = "New Verification Code - Mojaz",
            MessageAr = $"رمز التحقق الجديد: {otpValue}",
            MessageEn = $"Your new verification code is: {otpValue}",
            Email = destinationType == DestinationType.Email,
            Sms = destinationType == DestinationType.Phone,
            InApp = true,
            Push = true
        });
        
        // Mask the destination
        var masked = destinationType == DestinationType.Email 
            ? request.Destination.Substring(0, 2) + "***" + request.Destination.Substring(request.Destination.IndexOf('@'))
            : "***" + request.Destination.Substring(request.Destination.Length - 4);
        
return ApiResponse<OtpResponseDto>.Ok(new OtpResponseDto { DestinationMasked = masked }, "OTP resent successfully.");
    }

    public async Task<ApiResponse<bool>> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        // Find user by email or phone
        User? user = null;
        
        if (request.Method == RegistrationMethod.Email)
        {
            // Try exact match first
            var usersByEmail = await _userRepository.FindAsync(u => u.Email == request.Identifier.Trim() && !u.IsDeleted);
            user = usersByEmail.FirstOrDefault();
            
            // If not found, try case-insensitive
            if (user == null)
            {
                usersByEmail = await _userRepository.FindAsync(u => u.Email.ToLower() == request.Identifier.ToLower().Trim() && !u.IsDeleted);
                user = usersByEmail.FirstOrDefault();
            }
        }
        else
        {
            var usersByPhone = await _userRepository.FindAsync(u => u.PhoneNumber == request.Identifier.Trim() && !u.IsDeleted);
            user = usersByPhone.FirstOrDefault();
        }
        
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

        // Cast UserRole to AppRole since they have the same values but are different enums
        var newAccessToken = _jwtService.GenerateAccessToken(user.Id, user.FullNameEn, (AppRole)user.Role);
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

    private static readonly Random _random = new Random();
    private static string GenerateNationalId()
    {
        // Generate a unique 10-digit number
        var timestamp = DateTime.UtcNow.Ticks % 10000000000;
        var randomPart = _random.Next(10000000, 99999999);
        var combined = (timestamp + randomPart) % 10000000000;
        return combined.ToString("D10");
    }
    
    public async Task<ApiResponse<bool>> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return ApiResponse<bool>.Fail(404, "User not found.");
        
        if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            return ApiResponse<bool>.Fail(401, "Current password is incorrect.");
        
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword, 12);
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();
        
        await _auditService.LogAsync("PASSWORD_CHANGED", "User", userId.ToString());
        
        return ApiResponse<bool>.Ok(true, "Password changed successfully.");
    }
}
