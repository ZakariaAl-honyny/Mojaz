using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Email.Templates;
using Mojaz.Application.DTOs.User;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Interfaces;
using Mojaz.Domain.Entities;
using System.Collections.Generic;
using System.Linq;

namespace Mojaz.API.Controllers;

[ApiController]
[Route("api/v1/dev/[controller]")]
public class DevController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly ISmsService _smsService;
    private readonly IWebHostEnvironment _env;
    private readonly IRepository<OtpCode> _otpRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DevController(
        IEmailService emailService,
        ISmsService smsService,
        IWebHostEnvironment env,
        IRepository<OtpCode> otpRepository,
        IUnitOfWork unitOfWork)
    {
        _emailService = emailService;
        _smsService = smsService;
        _env = env;
        _otpRepository = otpRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Create a verified test user (DEV ONLY - no OTP required)
    /// </summary>
    [HttpPost("create-user")]
    public async Task<IActionResult> CreateTestUser([FromBody] CreateTestUserRequest request)
    {
        if (!_env.IsDevelopment())
            return NotFound();

        try
        {
            // Check if user already exists
            var userRepo = HttpContext.RequestServices.GetRequiredService<IRepository<User>>();
            var existingUsers = await userRepo.FindAsync(u => u.Email == request.Email && !u.IsDeleted);
            if (existingUsers.Any())
                return BadRequest("User already exists");

            // Generate temporary password
            var temporaryPassword = request.Password ?? "Test123456";
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(temporaryPassword);

            // Map role
            var role = Domain.Enums.UserRole.Applicant;
            if (!string.IsNullOrEmpty(request.Role))
            {
                if (Enum.TryParse<Domain.Enums.UserRole>(request.Role, true, out var parsedRole))
                    role = parsedRole;
            }

            // Create user directly
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                FullNameAr = request.FullName,
                FullNameEn = request.FullName,
                PhoneNumber = request.PhoneNumber,
                NationalId = request.NationalId ?? "",
                PasswordHash = passwordHash,
                Role = role,
                IsEmailVerified = true,
                IsPhoneVerified = true,
                IsActive = true,
                RegistrationMethod = Domain.Enums.RegistrationMethod.AdminCreated,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await userRepo.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new { success = true, message = $"Test user created: {request.Email}", userId = user.Id, password = temporaryPassword });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    public class CreateTestUserRequest
    {
        public string Email { get; set; } = string.Empty;
        public string? Password { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? NationalId { get; set; }
        public string Role { get; set; } = "Applicant";
    }

    /// <summary>
    /// Get the latest OTP code for testing (DEV ONLY)
    /// </summary>
    [HttpGet("otp/{destination}")]
    public async Task<IActionResult> GetOtp(string destination)
    {
        if (!_env.IsDevelopment())
            return NotFound();

        var otps = await _otpRepository.FindAsync(o => 
            o.Destination == destination && 
            !o.IsUsed && 
            o.IsInvalidated == false &&
            o.ExpiresAt > System.DateTime.UtcNow);

        var otp = otps.FirstOrDefault();
        
        if (otp == null)
            return NotFound("No valid OTP found");

        return Ok(new { 
            destination = otp.Destination,
            purpose = otp.Purpose,
            expiresAt = otp.ExpiresAt,
            attemptCount = otp.AttemptCount,
            note = "OTP code was sent to the destination. Check email/SMS logs."
        });
    }

    /// <summary>
    /// Bypass OTP verification for testing (DEV ONLY)
    /// </summary>
    [HttpPost("bypass-otp")]
    public async Task<IActionResult> BypassOtp([FromBody] BypassOtpRequest request)
    {
        if (!_env.IsDevelopment())
            return NotFound();

        var otps = await _otpRepository.FindAsync(o => 
            o.Destination == request.Destination && 
            !o.IsUsed &&
            o.IsInvalidated == false &&
            o.ExpiresAt > System.DateTime.UtcNow);

        var otp = otps.FirstOrDefault();
        
        if (otp == null)
            return NotFound("No valid OTP found");

        // Get the User repository from services
        var userRepo = HttpContext.RequestServices.GetRequiredService<Mojaz.Domain.Interfaces.IRepository<Mojaz.Domain.Entities.User>>();
        
        var users = await userRepo.FindAsync(u => u.Id == otp.UserId && !u.IsDeleted);
        var user = users.FirstOrDefault();
        
        if (user != null)
        {
            if (otp.DestinationType == Mojaz.Domain.Enums.DestinationType.Email)
                user.IsEmailVerified = true;
            else
                user.IsPhoneVerified = true;
            
            // If verified via email, activate the account
            if (otp.DestinationType == Mojaz.Domain.Enums.DestinationType.Email && !user.IsActive)
                user.IsActive = true;
                
            userRepo.Update(user);
        }
        
        // Mark OTP as used
        otp.IsUsed = true;
        _otpRepository.Update(otp);
        
        await _unitOfWork.SaveChangesAsync();
        
        return Ok(new { success = true, message = "OTP verification bypassed. User is now verified." });
    }

    public class BypassOtpRequest
    {
        public string Destination { get; set; } = string.Empty;
    }

    /// <summary>
    /// Seed system settings (DEV ONLY)
    /// </summary>
    [HttpPost("seed-settings")]
    public async Task<IActionResult> SeedSettings()
    {
        if (!_env.IsDevelopment())
            return NotFound();

        var settingsRepo = HttpContext.RequestServices.GetRequiredService<Mojaz.Domain.Interfaces.IRepository<Mojaz.Domain.Entities.SystemSetting>>();
        
        // Delete existing settings and re-seed
        var existingSettings = await settingsRepo.FindAsync(s => s.SettingKey.StartsWith("MIN_AGE_") || s.SettingKey.StartsWith("MAX_") || s.SettingKey == "COOLING_PERIOD_DAYS" || s.SettingKey == "MEDICAL_VALIDITY_DAYS" || s.SettingKey == "APPLICATION_VALIDITY_MONTHS");
        
        foreach (var s in existingSettings)
            settingsRepo.Remove(s);
        
        var settings = new List<Mojaz.Domain.Entities.SystemSetting>
        {
            new() { SettingKey = "MIN_AGE_CATEGORY_A", SettingValue = "16", Description = "Minimum age for Motorcycle license" },
            new() { SettingKey = "MIN_AGE_CATEGORY_B", SettingValue = "18", Description = "Minimum age for Private Car license" },
            new() { SettingKey = "MIN_AGE_CATEGORY_C", SettingValue = "21", Description = "Minimum age for Commercial/Taxi license" },
            new() { SettingKey = "MIN_AGE_CATEGORY_D", SettingValue = "21", Description = "Minimum age for Bus license" },
            new() { SettingKey = "MIN_AGE_CATEGORY_E", SettingValue = "21", Description = "Minimum age for Heavy Vehicles license" },
            new() { SettingKey = "MIN_AGE_CATEGORY_F", SettingValue = "18", Description = "Minimum age for Agricultural license" },
            new() { SettingKey = "MAX_THEORY_ATTEMPTS", SettingValue = "3", Description = "Maximum allowed theory test attempts" },
            new() { SettingKey = "MAX_PRACTICAL_ATTEMPTS", SettingValue = "3", Description = "Maximum allowed practical test attempts" },
            new() { SettingKey = "COOLING_PERIOD_DAYS", SettingValue = "7", Description = "Days to wait between test attempts" },
            new() { SettingKey = "MEDICAL_VALIDITY_DAYS", SettingValue = "90", Description = "Validity period of medical exams" },
            new() { SettingKey = "APPLICATION_VALIDITY_MONTHS", SettingValue = "6", Description = "Validity period of a license application" }
        };

        foreach (var s in settings)
            await settingsRepo.AddAsync(s);
        
        await _unitOfWork.SaveChangesAsync();
        
        return Ok(new { success = true, message = $"Seeded {settings.Count} system settings." });
    }

    /// <summary>
    /// List all valid OTPs (DEV ONLY)
    /// </summary>
    [HttpGet("otps")]
    public async Task<IActionResult> ListOtps()
    {
        if (!_env.IsDevelopment())
            return NotFound();

        var otps = await _otpRepository.FindAsync(o => 
            !o.IsUsed && 
            o.ExpiresAt > System.DateTime.UtcNow);

        return Ok(otps.Select(o => new { 
            o.Destination, 
            o.Purpose, 
            o.ExpiresAt,
            o.AttemptCount 
        }));
    }

    [HttpGet("email-preview/{templateName}")]
    public async Task<IActionResult> PreviewEmail(string templateName)
    {
        if (!_env.IsDevelopment())
            return NotFound();

        object? model = templateName switch
        {
            "account-verification" => new AccountVerificationEmailData { OtpCode = "123456", ExpiryMinutes = 15 },
            "password-recovery" => new PasswordRecoveryEmailData { OtpCode = "654321", ExpiryMinutes = 30 },
            "application-received" => new ApplicationReceivedEmailData { ApplicationNumber = "MOJ-2025-12345678", ServiceTypeAr = "خدمة المرور", ServiceTypeEn = "Traffic Service", NextStepsAr = new List<string> { "خطوة 1", "خطوة 2" }, NextStepsEn = new List<string> { "Step 1", "Step 2" } },
            "appointment-confirmed" => new AppointmentConfirmedEmailData { 
                AppointmentDateAr = "الجمعة، 10 مايو 2025", AppointmentDateEn = "Friday, May 10, 2025", 
                TimeSlot = "10:00 AM - 11:00 AM", BranchNameAr = "مدرسة تعليم القيادة بشمال جدة", BranchNameEn = "North Jeddah Driving School", 
                LocationUrl = "https://maps.google.com" },
            "medical-result" => new MedicalResultEmailData { 
                ApplicationNumber = "MOJ-2025-00000001",
                IsFit = true, BloodGroup = "O+", NotesAr = "لا يوجد ملاحظات", NotesEn = "No notes" },
            "test-result" => new TestResultEmailData { 
                IsTheoryTest = true, IsPassed = true, Score = "95", MaxScore = "100", 
                TestDateAr = "2025-05-15", TestDateEn = "2025-05-15" },
            "application-decision" => new ApplicationDecisionEmailData { 
                IsApproved = true, DecisionDateAr = "2025-05-20", DecisionDateEn = "2025-05-20", 
                NotesAr = "تمت الموافقة على طلبكم.", NotesEn = "Your application has been approved." },
            "license-issued" => new LicenseIssuedEmailData { 
                LicenseNumber = "LIC-2025-123456", ExpiryDateAr = "2035-05-20", ExpiryDateEn = "2035-05-20", 
                DownloadUrl = "http://localhost:5000/download", CategoryAr = "خصوصي", CategoryEn = "Private" },
            "payment-confirmed" => new PaymentConfirmedEmailData { 
                Amount = "150.00", Currency = "SAR", TransactionReference = "TXN_778899", 
                FeeTypeAr = "رسوم رخصة قيادة", FeeTypeEn = "Driving License Fee", 
                PaymentDateAr = "2025-05-01", PaymentDateEn = "2025-05-01" },
            "documents-missing" => new DocumentsMissingEmailData { 
                ApplicationId = Guid.NewGuid().ToString(), ApplicationNumber = "MOJ-2025-99", 
                MissingDocumentsAr = new List<string> { "بطاقة الأحوال مصورة", "فصيلة الدم من مركز معتمد" }, 
                MissingDocumentsEn = new List<string> { "National ID Copy", "Blood Type Certificate" }, 
                DeadlineDateAr = "2025-06-01", DeadlineDateEn = "2025-06-01" },
            _ => null
        };

        if (model == null)
            return BadRequest($"Unknown template: {templateName}");

        var html = await _emailService.RenderTemplateAsync(templateName, model);
        return Content(html, "text/html");
    }

    /// <summary>
    /// Test Email and SMS services (DEV ONLY)
    /// </summary>
    [HttpGet("test-services")]
    public async Task<IActionResult> TestServices()
    {
        if (!_env.IsDevelopment())
            return NotFound();

        var results = new Dictionary<string, object>();

        try
        {
            // Test SendGrid Email
            await _emailService.SendEmailAsync(
                "z.alhonyny123@auhd.edu.ye",
                "Test Email - Mojaz",
                "<h1>Hello from Mojaz API!</h1><p>This is a test email.</p>");

            results["Email"] = new { success = true, message = "Email sent" };
        }
        catch (System.Exception ex)
        {
            results["Email"] = new { success = false, error = ex.Message };
        }

        try
        {
            // Test Twilio SMS
            await _smsService.SendAsync("+967771234567", "Mojaz Test: Your verification code is 123456");

            results["SMS"] = new { success = true, message = "SMS sent" };
        }
        catch (System.Exception ex)
        {
            results["SMS"] = new { success = false, error = ex.Message };
        }

        return Ok(results);
    }
}
