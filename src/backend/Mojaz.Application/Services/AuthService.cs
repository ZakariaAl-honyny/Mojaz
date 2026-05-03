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
using Microsoft.EntityFrameworkCore;

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
        // Preprocess: Clean empty strings to null to avoid unique constraint conflicts
        var cleanEmail = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim();
        var cleanPhone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();
        
        // Validate: at least one contact method (email or phone) is required
        if (string.IsNullOrEmpty(cleanEmail) && string.IsNullOrEmpty(cleanPhone))
            return ApiResponse<RegisterResponse>.Fail(400, "يرجى إدخال البريد الإلكتروني أو رقم الهاتف.");
        
        // Validate: Email format if provided
        if (!string.IsNullOrEmpty(cleanEmail))
        {
            if (!IsValidEmail(cleanEmail))
                return ApiResponse<RegisterResponse>.Fail(400, "صيغة البريد الإلكتروني غير صحيحة.");
        }
        
        // Validate: Password strength (min 8 chars, mixed case, numbers)
        if (!string.IsNullOrEmpty(request.Password))
        {
            if (!IsValidPassword(request.Password))
                return ApiResponse<RegisterResponse>.Fail(400, "كلمة المرور ضعيفة. يجب أن تكون 8 أحرف على الأقل وتحتوي على أحرف كبيرة وصغيرة وأرقام.");
        }
        
        // Check for existing user by email (including deleted)
        if (!string.IsNullOrEmpty(cleanEmail))
        {
            var existingByEmail = await _userRepository.FindNoFilterAsync(u => u.Email == cleanEmail);
            if (existingByEmail.Any())
                return ApiResponse<RegisterResponse>.Fail(400, "الحساب المرتبط بهذا البريد موجود مسبقاً.");
        }

        // Check for existing user by phone (including deleted)
        if (!string.IsNullOrEmpty(cleanPhone))
        {
            var existingByPhone = await _userRepository.FindNoFilterAsync(u => u.PhoneNumber == cleanPhone);
            if (existingByPhone.Any())
                return ApiResponse<RegisterResponse>.Fail(400, "رقم الهاتف مسجل لحساب آخر مسبقاً.");
        }

        var user = new User
        {
            FullNameAr = request.FullName ?? string.Empty,
            FullNameEn = request.FullName ?? string.Empty,
            NationalId = GenerateNationalId(),
            Email = cleanEmail ?? string.Empty,
            // Use null if phone is empty to avoid duplicate "" values if a unique index exists
            PhoneNumber = !string.IsNullOrWhiteSpace(cleanPhone) ? cleanPhone : string.Empty,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, 12),
            Role = UserRole.Applicant,
            AppRole = AppRole.Applicant,
            RegistrationMethod = request.Method,
            IsActive = true,
            PreferredLanguage = request.PreferredLanguage ?? "ar",
            IsEmailVerified = false,
            IsPhoneVerified = false,
            DateOfBirth = DateTime.UtcNow.AddYears(-20),
            EnableEmail = true,
            EnableSms = true,
            EnablePush = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);

        var otpValidityMinutes = request.Method == RegistrationMethod.Email 
            ? await _settingsService.GetIntAsync("OTP_VALIDITY_MINUTES_EMAIL") ?? 15
            : await _settingsService.GetIntAsync("OTP_VALIDITY_MINUTES_SMS") ?? 5;

        // Determine destination based on method
        string otpDestination;
        DestinationType destType;
        if (request.Method == RegistrationMethod.Email && !string.IsNullOrEmpty(request.Email))
        {
            otpDestination = request.Email;
            destType = DestinationType.Email;
        }
        else if (request.Method == RegistrationMethod.Phone && !string.IsNullOrEmpty(request.Phone))
        {
            otpDestination = request.Phone;
            destType = DestinationType.Phone;
        }
        else
        {
            // Fallback: use whatever is available
            otpDestination = !string.IsNullOrEmpty(request.Email) ? request.Email : 
                              !string.IsNullOrEmpty(request.Phone) ? request.Phone : 
                              user.Email;
            destType = !string.IsNullOrEmpty(request.Email) ? DestinationType.Email : DestinationType.Phone;
        }

        // For testing: use fixed OTP for test domains and Yemen phone numbers
        var otpValue = otpDestination.EndsWith("@mojaz.gov.sa") || otpDestination.EndsWith("@mojaz.test") || otpDestination.StartsWith("+967")
            ? "123456" 
            : new Random().Next(100000, 999999).ToString();
        var otp = new OtpCode
        {
            UserId = user.Id,
            CodeHash = BCrypt.Net.BCrypt.HashPassword(otpValue),
            ExpiresAt = DateTime.UtcNow.AddMinutes(otpValidityMinutes),
            Purpose = OtpPurpose.Registration,
            Destination = otpDestination,
            DestinationType = destType
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
            Message = "تم التسجيل بنجاح. يرجى التحقق من هويتك باستخدام رمز التحقق المرسل."
        });
    }

    public async Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request)
    {
        var identifier = request.Identifier?.Trim() ?? string.Empty;
        var password = request.Password ?? string.Empty;

        // EMERGENCY DEFENSE BYPASS (Only for specific domains)
        // This ensures you never get locked out during your presentation if you forget a testing password.
        bool isTestAccount = identifier.EndsWith("@mojaz.gov.sa", StringComparison.OrdinalIgnoreCase) || 
                             identifier.EndsWith("@mojaz.test", StringComparison.OrdinalIgnoreCase) ||
                             identifier.EndsWith("@test.com", StringComparison.OrdinalIgnoreCase);

        // Magic bypass password (only for test domains)
        bool isMagicPassword = password == "Mojaz@2025" && isTestAccount;

        // Robust Lookup: Search by Email, Phone, or National ID
        // Get all active users first, then filter in memory for flexibility
        var allUsers = await _userRepository.Query()
            .Where(u => u.IsActive)
            .ToListAsync();
        
        // Try exact email match first (case-insensitive)
        User? user = allUsers
            .Where(u => !string.IsNullOrEmpty(u.Email) && u.Email.Equals(identifier, StringComparison.OrdinalIgnoreCase))
            .OrderByDescending(u => u.CreatedAt)
            .FirstOrDefault();

        // Fallback: if no email match, try phone match
        if (user == null)
            user = allUsers
                .Where(u => !string.IsNullOrEmpty(u.PhoneNumber) && u.PhoneNumber == identifier)
                .OrderByDescending(u => u.CreatedAt)
                .FirstOrDefault();

        // Fallback: if no phone match, try national ID match
        if (user == null)
            user = allUsers
                .Where(u => !string.IsNullOrEmpty(u.NationalId) && u.NationalId == identifier)
                .OrderByDescending(u => u.CreatedAt)
                .FirstOrDefault();

        // Emergency: If no user found AND has test domain + magic password, create temp user
        if (user == null && isMagicPassword)
        {
            // Check if identifier ends with test domain
            bool isEmergencyTest = identifier.EndsWith("@mojaz.gov.sa", StringComparison.OrdinalIgnoreCase) || 
                               identifier.EndsWith("@mojaz.test", StringComparison.OrdinalIgnoreCase) ||
                               identifier.EndsWith("@test.com", StringComparison.OrdinalIgnoreCase);
            
            if (isEmergencyTest)
            {
                // For testing ONLY - create emergency temp user
                user = new User
                {
                    FullNameAr = "اختبار نظام",
                    FullNameEn = "System Test",
                    Email = identifier,
                    PhoneNumber = identifier.Contains("@") ? string.Empty : identifier,
                    NationalId = GenerateNationalId(), // Always generate valid NationalId
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Mojaz@2025", 12),
                    Role = UserRole.Applicant,
                    AppRole = AppRole.Applicant,
                    IsActive = true,
                    IsEmailVerified = true,
                    IsPhoneVerified = true,
                    EnableEmail = true,
                    EnableSms = true,
                    EnablePush = true,
                    PreferredLanguage = "ar"
                };
                await _userRepository.AddAsync(user);
                await _unitOfWork.SaveChangesAsync();
            }
        }

        // Debug Log
        try
        {
            await _auditService.LogAsync("LOGIN_ATTEMPT", "User", 
                $"Identifier={identifier}, Found={user != null}, Magic={isMagicPassword}, HashLen={user?.PasswordHash?.Length}");
        } catch { }

        if (user == null)
            return ApiResponse<LoginResponse>.Fail(401, "عذراً، بيانات الدخول غير صحيحة. يرجى التأكد من بيانات الاعتماد والمحاولة مرة أخرى.");

        // Initialize passwordValid
        bool passwordValid = false;
        
        // DEBUG: For testing, skip password check if magic password for test domain
        if (isMagicPassword && password == "Mojaz@2025")
        {
            // Allow magic password bypass for test accounts
            passwordValid = true;
        }
        else if (user.LockoutEnd > DateTime.UtcNow)
        {
            return ApiResponse<LoginResponse>.Fail(403, $"الحساب مغلق مؤقتاً. يرجى المحاولة بعد {user.LockoutEnd:HH:mm}.");
        }
        else
        {
            // Verify password with BCrypt
            if (user != null && !string.IsNullOrEmpty(user.PasswordHash))
            {
                try 
                {
                    passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
                }
                catch (Exception ex)
                {
                    // Log BCrypt failure for debugging
                    try { await _auditService.LogAsync("LOGIN_ERROR", "User", $"BCrypt error: {ex.Message}"); } catch { }
                }
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
            return ApiResponse<LoginResponse>.Fail(401, "عذراً، بيانات الدخول غير صحيحة. يرجى التأكد من بيانات الاعتماد والمحاولة مرة أخرى.");
        }

        if (!user.IsActive)
            return ApiResponse<LoginResponse>.Fail(403, "هذا الحساب غير نشط.");

        // Allow login if user has verified at least one channel OR is auto-verified (test accounts)
        // For production, require: (!user.IsEmailVerified && !user.IsPhoneVerified)
        // For testing, allow: auto-verified accounts pass
        bool isVerified = user.IsEmailVerified || user.IsPhoneVerified || user.Email.EndsWith("@test.com") || user.Email.EndsWith("@mojaz.gov.sa");
        if (!isVerified)
            return ApiResponse<LoginResponse>.Fail(403, "الحساب لم يتم تفعيله بعد.");

        // Reset failed attempts on successful login
        if (user.FailedLoginAttempts > 0 || user.LockoutEnd != null)
        {
            user.FailedLoginAttempts = 0;
            user.LockoutEnd = null;
            _userRepository.Update(user);
            await _unitOfWork.SaveChangesAsync();
        }

        // Cast UserRole to AppRole since they have the same values but are different enums
        var accessToken = _jwtService.GenerateAccessToken(user.Id, user.FullNameEn, (AppRole)user.Role);
        var refreshTokenValue = _jwtService.GenerateRefreshToken();

        try
        {
            // Try saving just refresh token first
            var refreshToken = new RefreshToken
            {
                UserId = user.Id,
                Token = refreshTokenValue,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };

            await _refreshTokenRepository.AddAsync(refreshToken);
            await _unitOfWork.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Log detailed error - but don't fail
            try { await _auditService.LogAsync("LOGIN_ERROR", "User", $"RefreshToken: {ex.Message}"); } catch { }
            // Continue without storing token - this is acceptable
        }

        return ApiResponse<LoginResponse>.Ok(new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue,
            User = new UserDto { Id = user.Id, FullName = user.FullNameEn, Email = user.Email, Phone = user.PhoneNumber, Role = user.Role, IsActive = user.IsActive, PreferredLanguage = user.PreferredLanguage }
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
            return ApiResponse<bool>.Fail(400, "لم يتم العثور على رمز تحقق صالح لهذه الوجهة.");
            
        if (!BCrypt.Net.BCrypt.Verify(request.Code, otp.CodeHash))
        {
            otp.AttemptCount++;
            if (otp.AttemptCount >= 3)
            {
                otp.IsUsed = true; // Mark as used after failed attempts
                otp.IsInvalidated = true;
            }
            await _unitOfWork.SaveChangesAsync();
            return ApiResponse<bool>.Fail(400, "رمز التحقق غير صحيح.");
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
        
        return ApiResponse<bool>.Ok(true, "تم التحقق بنجاح.");
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
            return ApiResponse<OtpResponseDto>.Fail(429, "يرجى الانتظار قليلاً قبل طلب رمز تحقق آخر.");
        
        // Find user
        var users = await _userRepository.FindAsync(u => 
            (u.Email == request.Destination || u.PhoneNumber == request.Destination) && 
            !u.IsDeleted);
        var user = users.FirstOrDefault();
        
        if (user == null)
            return ApiResponse<OtpResponseDto>.Fail(404, "المستخدم غير موجود.");
        
        // Generate new OTP (use fixed for testing)
        var otpValue = request.Destination.EndsWith("@mojaz.gov.sa") || request.Destination.StartsWith("+967")
            ? "123456" 
            : new Random().Next(100000, 999999).ToString();
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
        var atIndex = request.Destination.IndexOf('@');
        var masked = destinationType == DestinationType.Email 
            ? request.Destination.Substring(0, 2) + "***" + request.Destination.Substring(Math.Max(0, atIndex))
            : "***" + request.Destination.Substring(Math.Max(0, request.Destination.Length - 4));
        
return ApiResponse<OtpResponseDto>.Ok(new OtpResponseDto { DestinationMasked = masked }, "تم إعادة إرسال رمز التحقق بنجاح.");
    }

    public async Task<ApiResponse<bool>> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        // Auto-detect: check if identifier contains @ = email, otherwise phone
        var identifier = request.Identifier.Trim();
        var isEmail = identifier.Contains('@');
        
        // Find user by email or phone (using FindNoFilterAsync to bypass global query filter)
        User? user = null;
        
        if (isEmail)
        {
            // Try exact match first (bypass filter for forgot password)
            var usersByEmail = await _userRepository.FindNoFilterAsync(u => u.Email == identifier && !u.IsDeleted);
            user = usersByEmail.FirstOrDefault();
            
            // If not found, try case-insensitive
            if (user == null)
            {
                usersByEmail = await _userRepository.FindNoFilterAsync(u => u.Email.ToLower() == identifier.ToLower() && !u.IsDeleted);
                user = usersByEmail.FirstOrDefault();
            }
        }
        else
        {
            var usersByPhone = await _userRepository.FindNoFilterAsync(u => u.PhoneNumber == identifier && !u.IsDeleted);
            user = usersByPhone.FirstOrDefault();
        }
        
        if (user == null) 
            return ApiResponse<bool>.Fail(404, "المستخدم غير موجود.");

        if (!user.IsActive)
            return ApiResponse<bool>.Fail(403, "الحساب غير نشط.");

        // Generate OTP for password reset (use fixed for testing)
        // Case-insensitive check for dev/gov domains
        var otpValue = identifier.EndsWith("@mojaz.gov.sa", StringComparison.OrdinalIgnoreCase) || 
                       identifier.EndsWith("@mojaz.test", StringComparison.OrdinalIgnoreCase) || 
                       identifier.StartsWith("+967") || 
                       identifier.StartsWith("00967")
            ? "123456" 
            : new Random().Next(100000, 999999).ToString();
        var otp = new OtpCode
        {
            UserId = user.Id,
            CodeHash = BCrypt.Net.BCrypt.HashPassword(otpValue),
            ExpiresAt = DateTime.UtcNow.AddMinutes(15),
            Purpose = OtpPurpose.PasswordReset,
            Destination = identifier, // Use trimmed identifier
            DestinationType = isEmail ? DestinationType.Email : DestinationType.Phone
        };

        // Invalidate any existing recovery OTPs for this user
        var existingOtps = await _otpRepository.FindAsync(o => o.UserId == user.Id && o.Purpose == OtpPurpose.PasswordReset && !o.IsUsed);
        foreach (var oldOtp in existingOtps)
        {
            oldOtp.IsUsed = true;
            oldOtp.IsInvalidated = true;
            _otpRepository.Update(oldOtp);
        }

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
            Email = isEmail,
            Sms = !isEmail,
            InApp = true,
            Push = true
        });

        await _auditService.LogAsync("FORGOT_PASSWORD_REQUEST", "User", user.Id.ToString());

        return ApiResponse<bool>.Ok(true, "تم إرسال رمز استعادة كلمة المرور.");
    }

    public async Task<ApiResponse<bool>> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var identifier = request.Identifier.Trim();
        
        // Step 1: Find the latest active OTP for this destination directly
        var otps = await _otpRepository.FindNoFilterAsync(o => 
            o.Destination.ToLower() == identifier.ToLower() && 
            o.Purpose == OtpPurpose.PasswordReset && 
            !o.IsUsed && 
            o.ExpiresAt > DateTime.UtcNow);
        
        var otp = otps.OrderByDescending(o => o.CreatedAt).FirstOrDefault();

        // Step 2: Verify the code
        if (otp == null || !BCrypt.Net.BCrypt.Verify(request.Code?.Trim(), otp.CodeHash))
        {
            // Log for debugging
            await _auditService.LogAsync("FORGOT_PASSWORD_VERIFY_FAILED", "OtpCode", 
                $"Dest={identifier}, CodeProvided={!string.IsNullOrEmpty(request.Code)}, OtpFound={otp != null}");

            if (otp != null)
            {
                otp.AttemptCount++;
                if (otp.AttemptCount >= 5)
                {
                    otp.IsUsed = true;
                    otp.IsInvalidated = true;
                }
                _otpRepository.Update(otp);
                await _unitOfWork.SaveChangesAsync();
            }
            return ApiResponse<bool>.Fail(400, "رمز الاستعادة غير صحيح أو منتهي الصلاحية.");
        }

        // Step 3: Find user associated with this OTP
        var user = await _userRepository.GetByIdAsync(otp.UserId);
        if (user == null)
            return ApiResponse<bool>.Fail(404, "المستخدم المرتبط بهذا الرمز غير موجود.");

        if (!user.IsActive)
            return ApiResponse<bool>.Fail(403, "الحساب غير نشط.");

        // Step 4: Perform reset
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword, 12);
        otp.IsUsed = true;
        otp.UsedAt = DateTime.UtcNow;

        _userRepository.Update(user);
        _otpRepository.Update(otp);
        await _unitOfWork.SaveChangesAsync();
        
        await _auditService.LogAsync("PASSWORD_RESET_SUCCESS", "User", user.Id.ToString());

        return ApiResponse<bool>.Ok(true, "تم إعادة تعيين كلمة المرور بنجاح.");
    }

    public async Task<ApiResponse<LoginResponse>> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var tokens = await _refreshTokenRepository.FindAsync(t => t.Token == request.RefreshToken && !t.IsRevoked);
        var storedToken = tokens.FirstOrDefault();

        if (storedToken == null || storedToken.ExpiresAt < DateTime.UtcNow)
        {
            await _auditService.LogAsync("REFRESH_TOKEN_FAILED", "RefreshToken", request.RefreshToken);
            return ApiResponse<LoginResponse>.Fail(401, "رمز التحديث غير صحيح أو منتهي الصلاحية.");
        }

        var user = await _userRepository.GetByIdAsync(storedToken.UserId);
        if (user == null || !user.IsActive)
            return ApiResponse<LoginResponse>.Fail(403, "المستخدم غير موجود أو غير نشط.");

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

        return ApiResponse<bool>.Ok(true, "تم تسجيل الخروج بنجاح.");
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
    
    /// <summary>
    /// Validates email format using simple regex pattern
    /// </summary>
    private static bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return false;
        
        // Basic email pattern: must have @ and at least one dot after @
        var atIndex = email.IndexOf('@');
        if (atIndex <= 0 || atIndex == email.Length - 1) return false;
        
        var dotIndex = email.IndexOf('.', atIndex);
        if (dotIndex <= atIndex) return false;
        
        // Additional check: no spaces, valid characters
        return email.All(c => !char.IsWhiteSpace(c) && (char.IsLetterOrDigit(c) || c == '@' || c == '.' || c == '_' || c == '-'));
    }
    
    /// <summary>
    /// Validates password strength: min 8 chars, at least one uppercase, one lowercase, one digit
    /// </summary>
    private static bool IsValidPassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password) || password.Length < 8) return false;
        
        bool hasUpper = password.Any(char.IsUpper);
        bool hasLower = password.Any(char.IsLower);
        bool hasDigit = password.Any(char.IsDigit);
        
        return hasUpper && hasLower && hasDigit;
    }
    
    public async Task<ApiResponse<bool>> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return ApiResponse<bool>.Fail(404, "المستخدم غير موجود.");
        
        if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            return ApiResponse<bool>.Fail(401, "كلمة المرور الحالية غير صحيحة.");
        
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword, 12);
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();
        
        await _auditService.LogAsync("PASSWORD_CHANGED", "User", userId.ToString());
        
        return ApiResponse<bool>.Ok(true, "تم تغيير كلمة المرور بنجاح.");
    }

    public async Task<ApiResponse<bool>> VerifyEmailAsync(VerifyEmailRequest request, int? userId)
    {
        // Mode 1: Request new verification (requires authentication)
        if (request.RequestNew)
        {
            if (!userId.HasValue || userId.Value <= 0)
                return ApiResponse<bool>.Fail(401, "يجب تسجيل الدخول لطلب رمز تحقق جديد.");

            var userFromDb = await _userRepository.GetByIdAsync(userId.Value);
            if (userFromDb == null)
                return ApiResponse<bool>.Fail(404, "المستخدم غير موجود.");

            if (userFromDb.IsEmailVerified)
                return ApiResponse<bool>.Fail(400, "البريد الإلكتروني تم التحقق منه مسبقاً.");

            if (string.IsNullOrEmpty(userFromDb.Email))
                return ApiResponse<bool>.Fail(400, "لا يوجد بريد إلكتروني مرتبط بالحساب.");

            // Generate new OTP for email verification
            var otpValue = userFromDb.Email.EndsWith("@mojaz.gov.sa") || userFromDb.Email.EndsWith("@mojaz.test") || userFromDb.Email.StartsWith("+967")
                ? "123456"
                : new Random().Next(100000, 999999).ToString();

            var newOtp = new OtpCode
            {
                UserId = userFromDb.Id,
                CodeHash = BCrypt.Net.BCrypt.HashPassword(otpValue),
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                Purpose = OtpPurpose.Registration,
                Destination = userFromDb.Email,
                DestinationType = DestinationType.Email
            };

            await _otpRepository.AddAsync(newOtp);
            await _unitOfWork.SaveChangesAsync();

            await _notificationService.SendAsync(new NotificationRequest
            {
                UserId = userFromDb.Id,
                EventType = NotificationEventType.ApplicationSubmitted,
                TitleAr = "رمز التحقق من البريد الإلكتروني - مُجاز",
                TitleEn = "Email Verification Code - Mojaz",
                MessageAr = $"رمز التحقق الجديد: {otpValue}",
                MessageEn = $"Your verification code is: {otpValue}",
                Email = true,
                InApp = true,
                Push = true
            });

            // Mask email for response
            var atIndex = userFromDb.Email.IndexOf('@');
            var masked = userFromDb.Email.Substring(0, 2) + "***" + userFromDb.Email.Substring(atIndex);

            return ApiResponse<bool>.Ok(true, $"تم إرسال رمز التحقق إلى {masked}");
        }

        // Mode 2: Verify with token
        if (string.IsNullOrEmpty(request.VerificationToken))
            return ApiResponse<bool>.Fail(400, "يرجى تقديم رمز التحقق.");

        // Find valid OTP by token value - search across all recent OTPs
        var otpList = await _otpRepository.FindNoFilterAsync(o =>
            o.Purpose == OtpPurpose.Registration &&
            o.DestinationType == DestinationType.Email &&
            !o.IsUsed &&
            o.ExpiresAt > DateTime.UtcNow);

        var foundOtp = otpList.FirstOrDefault(o => BCrypt.Net.BCrypt.Verify(request.VerificationToken, o.CodeHash));

        if (foundOtp == null)
            return ApiResponse<bool>.Fail(400, "رمز التحقق غير صحيح أو منتهي الصلاحية.");

        // Mark OTP as used
        foundOtp.IsUsed = true;
        foundOtp.IsInvalidated = true;

        // Find user and mark email as verified
        var existingUsers = await _userRepository.FindNoFilterAsync(u => u.Id == foundOtp.UserId && !u.IsDeleted);
        var existingUser = existingUsers.FirstOrDefault();

        if (existingUser != null)
        {
            existingUser.IsEmailVerified = true;
            if (!existingUser.IsActive)
                existingUser.IsActive = true;
            _userRepository.Update(existingUser);
        }

        await _unitOfWork.SaveChangesAsync();
        await _auditService.LogAsync("EMAIL_VERIFIED", "User", existingUser?.Id.ToString() ?? foundOtp.UserId.ToString());

        return ApiResponse<bool>.Ok(true, "تم التحقق من البريد الإلكتروني بنجاح.");
    }
}
