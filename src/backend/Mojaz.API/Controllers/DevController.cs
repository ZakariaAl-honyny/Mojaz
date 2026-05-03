using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Email.Templates;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

[ApiController]
[Route("api/v1/dev/[controller]")]
[Authorize]
public class DevController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly IWebHostEnvironment _env;
    private readonly IUnitOfWork _unitOfWork;

    public DevController(IEmailService emailService, IWebHostEnvironment env, IUnitOfWork unitOfWork)
    {
        _emailService = emailService;
        _env = env;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Test endpoint with custom auth via query param (bypass JWT)
    /// </summary>
    [HttpGet("test-auth")]
    [AllowAnonymous]
    public IActionResult TestAuth([FromQuery] string token)
    {
        if (string.IsNullOrEmpty(token))
            return Ok(new { message = "No token provided", working = true });
            
        return Ok(new { 
            message = "Server is responding!", 
            receivedTokenLength = token.Length,
            working = true 
        });
    }

    /// <summary>
    /// Debug endpoint to check auth status - NO AUTHORIZATION
    /// </summary>
    [HttpGet("auth-status-no-auth")]
    [AllowAnonymous]
    public IActionResult GetAuthStatusNoAuth()
    {
        if (!_env.IsDevelopment())
            return NotFound();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role) ?? User.FindFirstValue("role");
        var name = User.FindFirstValue(ClaimTypes.Name);
        var isAuthenticated = User.Identity?.IsAuthenticated ?? false;

        return Ok(new
        {
            message = "This endpoint has [AllowAnonymous]",
            isAuthenticated,
            userId,
            role,
            name,
            allClaims = User.Claims.Select(c => new { type = c.Type, value = c.Value }).ToList()
        });
    }

    /// <summary>
    /// Debug endpoint to check auth status
    /// </summary>
    [HttpGet("auth-status")]
    public IActionResult GetAuthStatus()
    {
        if (!_env.IsDevelopment())
            return NotFound();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role) ?? User.FindFirstValue("role");
        var name = User.FindFirstValue(ClaimTypes.Name);
        var isAuthenticated = User.Identity?.IsAuthenticated ?? false;

        return Ok(new
        {
            isAuthenticated,
            userId,
            role,
            name,
            allClaims = User.Claims.Select(c => new { type = c.Type, value = c.Value }).ToList()
        });
    }

    /// <summary>
    /// Get recent OTP codes for debugging (DEV ONLY)
    /// </summary>
    [HttpGet("otps")]
    public async Task<IActionResult> GetRecentOtps([FromQuery] string? destination = null, [FromQuery] int limit = 10)
    {
        if (!_env.IsDevelopment())
            return NotFound();

        var otpRepo = _unitOfWork.Repository<Mojaz.Domain.Entities.OtpCode>();
        var query = otpRepo.Query();

        if (!string.IsNullOrEmpty(destination))
            query = query.Where(o => o.Destination.Contains(destination));

        var otps = query
            .OrderByDescending(o => o.CreatedAt)
            .Take(limit)
            .Select(o => new 
            {
                o.Id,
                o.Destination,
                Purpose = o.Purpose.ToString(),
                IsUsed = o.IsUsed,
                IsInvalidated = o.IsInvalidated,
                o.ExpiresAt,
                o.CreatedAt,
                // For test domains, show the expected OTP value
                TestOtp = o.Destination.EndsWith("@mojaz.gov.sa") || o.Destination.EndsWith("@mojaz.test") || o.Destination.StartsWith("+967") 
                    ? "123456" 
                    : "(hashed - check database directly for non-test OTPs)"
            })
            .ToList();

        return Ok(new { count = otps.Count, otps });
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
                TimeSlot = "10:00 AM - 11:00 AM", BranchNameAr = "مدرسة تعليم القيادة بصنعاء", BranchNameEn = "Sana'a Driving School", 
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
                Amount = "15000", Currency = "YER", TransactionReference = "TXN_778899", 
                FeeTypeAr = "رسوم رخصة قيادة", FeeTypeEn = "Driving License Fee", 
                PaymentDateAr = "2025-05-01", PaymentDateEn = "2025-05-01" },
            "documents-missing" => new DocumentsMissingEmailData { 
                ApplicationId = Random.Shared.Next(10000000, 99999999).ToString(), ApplicationNumber = "MOJ-2025-99", 
                MissingDocumentsAr = new List<string> { "البطاقة الشخصية مصورة", "فصيلة الدم من مركز معتمد" }, 
                MissingDocumentsEn = new List<string> { "Personal ID Copy", "Blood Type Certificate" }, 
                DeadlineDateAr = "2025-06-01", DeadlineDateEn = "2025-06-01" },
            _ => null
        };

        if (model == null)
            return BadRequest($"Unknown template: {templateName}");

        var html = await _emailService.RenderTemplateAsync(templateName, model);
        return Content(html, "text/html");
    }

    /// <summary>
    /// Send a test email (DEV ONLY)
    /// </summary>
    [HttpPost("send-test-email")]
    public async Task<IActionResult> SendTestEmail([FromBody] SendTestEmailRequest request)
    {
        if (!_env.IsDevelopment())
            return NotFound();

        try
        {
            await _emailService.SendEmailAsync(
                request.To, 
                request.Subject ?? "Test Email - Mojaz", 
                request.Body ?? "This is a test email from Mojaz platform."
            );
            return Ok(new { success = true, message = $"Email sent to {request.To}" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, error = ex.Message });
        }
    }

    public class SendTestEmailRequest
    {
        public string To { get; set; } = string.Empty;
        public string? Subject { get; set; }
        public string? Body { get; set; }
    }
}