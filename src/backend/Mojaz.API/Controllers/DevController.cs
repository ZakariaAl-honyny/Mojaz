using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Email.Templates;
using Mojaz.Application.Interfaces.Services;
using System.Collections.Generic;

namespace Mojaz.API.Controllers;

[ApiController]
[Route("api/v1/dev/[controller]")]
public class DevController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly IWebHostEnvironment _env;

    public DevController(IEmailService emailService, IWebHostEnvironment env)
    {
        _emailService = emailService;
        _env = env;
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
}
