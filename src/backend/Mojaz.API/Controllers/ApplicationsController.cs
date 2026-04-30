using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using Mojaz.Application.DTOs.Application;
using Mojaz.Application.DTOs.Payment;
using Mojaz.Application.DTOs.TestRetake;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Interfaces;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using Mojaz.Shared.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

/// <summary>
/// Manage license applications for the Mojaz platform.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
[EnableRateLimiting(SecurityConstants.Policies.GlobalRateLimit)]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;
    private readonly IReplaceLicenseService _replaceLicenseService;
    private readonly IPaymentService _paymentService;
    private readonly IFinalApprovalService _finalApprovalService;
    private readonly ITestRetakeService _testRetakeService;

    public ApplicationsController(
        IApplicationService applicationService, 
        IReplaceLicenseService replaceLicenseService,
        IPaymentService paymentService,
        IFinalApprovalService finalApprovalService,
        ITestRetakeService testRetakeService)
    {
        _applicationService = applicationService;
        _replaceLicenseService = replaceLicenseService;
        _paymentService = paymentService;
        _finalApprovalService = finalApprovalService;
        _testRetakeService = testRetakeService;
    }

    /// <summary>
    /// Create a new driving license application.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Applicant,Receptionist")]
    [ProducesResponseType(typeof(ApiResponse<ApplicationDto>), 201)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateApplicationRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.CreateAsync(request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Create a new application draft (Step 1 only).
    /// </summary>
    [HttpPost("draft")]
    [Authorize(Roles = "Applicant,Receptionist")]
    [ProducesResponseType(typeof(ApiResponse<ApplicationDto>), 201)]
    public async Task<IActionResult> CreateDraftAsync([FromBody] CreateApplicationDraftRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.CreateDraftAsync(request.ServiceType, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get a single application by ID or Number.
    /// </summary>
    [HttpGet("{idOrNumber}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<ApplicationDto>), 200)]
    public async Task<IActionResult> GetByIdAsync(string idOrNumber)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "الطلب غير موجود."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _applicationService.GetByIdAsync(applicationId, userId, role);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get complete wizard data for an application (application + applicant user fields).
    /// Used by both Applicants for wizard state and Employees for management detail view.
    /// </summary>
    [HttpGet("{idOrNumber}/wizard-data")]
    [HttpGet("{idOrNumber}/details")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<ApplicationWizardDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetWizardDataAsync(string idOrNumber)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _applicationService.GetWizardDataAsync(applicationId, userId, role);
        return StatusCode(result.StatusCode, result);
    }


    /// <summary>
    /// Update wizard data (both application and applicant user fields).
    /// Used during wizard progression and auto-save.
    /// </summary>  
    [HttpPut("{idOrNumber}/wizard-data")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<ApplicationWizardDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> UpdateWizardDataAsync(string idOrNumber, [FromBody] UpdateWizardDataRequest request)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.UpdateWizardDataAsync(applicationId, request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// List applications (paginated).
    /// </summary>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<ApplicationDto>>), 200)]
    public async Task<IActionResult> GetListAsync(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string? status = null)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _applicationService.GetListAsync(userId, role, page, pageSize, search, status);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Update an application.
    /// </summary>
    [HttpPut("{idOrNumber}")]
    [Authorize(Roles = "Applicant")]
    public async Task<IActionResult> UpdateAsync(string idOrNumber, [FromBody] UpdateApplicationRequest request)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.UpdateAsync(applicationId, request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Final submit of a draft application (sets status to Submitted).
    /// </summary>
    [HttpPost("{idOrNumber}/submit")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> SubmitAsync(string idOrNumber)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.SubmitAsync(applicationId, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Mark application as paid (after successful payment).
    /// </summary>
    [HttpPost("{idOrNumber}/pay")]
    [AllowAnonymous] // Demo: Allow without auth
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> PayAsync(string idOrNumber)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        // For demo: use a default user ID
        Guid userId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        
        var result = await _applicationService.MarkAsPaidAsync(applicationId, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Approve an application (advance to next logical stage).
    /// </summary>
    [HttpPatch("{idOrNumber}/approve")]
    [Authorize(Roles = "Manager,Security")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> ApproveAsync(string idOrNumber, [FromQuery] string? reason = null)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.ApproveAsync(applicationId, reason ?? "", userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Reject an application with reason.
    /// </summary>
    [HttpPatch("{idOrNumber}/reject")]
    [Authorize(Roles = "Manager,Security")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> RejectAsync(string idOrNumber, [FromQuery] string reason)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.RejectAsync(applicationId, reason, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Update application status (raw update).
    /// </summary>
    [HttpPatch("{idOrNumber}/status")]
    [Authorize(Roles = "Admin,Manager,Receptionist,Doctor,Examiner")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> UpdateStatusAsync(string idOrNumber, [FromQuery] ApplicationStatus status, [FromQuery] string? reason = null)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.UpdateStatusAsync(applicationId, status, reason ?? "", userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Cancel an application.
    /// </summary>
    [HttpPatch("{idOrNumber}/cancel")]
    [Authorize(Roles = "Applicant,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> CancelAsync(string idOrNumber, [FromBody] CancelApplicationRequest request)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.CancelAsync(applicationId, request.Reason, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Create a license upgrade application.
    /// </summary>
    [HttpPost("upgrade")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<ApplicationDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> CreateUpgradeAsync([FromBody] UpgradeApplicationRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.CreateUpgradeApplicationAsync(request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Check replacement eligibility.
    /// </summary>
    [HttpGet("replacement/eligibility")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<ReplacementEligibilityResponse>), 200)]
    public async Task<IActionResult> GetReplacementEligibilityAsync()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.GetReplacementEligibilityAsync(userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Create a license replacement application.
    /// </summary>
    [HttpPost("replacement")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<ApplicationDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> CreateReplacementAsync([FromBody] ReplacementApplicationRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.CreateReplacementApplicationAsync(request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Process payment for a replacement application by application number.
    /// </summary>
    [HttpPost("by-number/{applicationNumber}/process-payment")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> ProcessReplacementPaymentAsync(string applicationNumber)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        var applications = await _applicationService.GetByApplicationNumberAsync(applicationNumber);
        var application = applications.Data?.FirstOrDefault();
        
        if (application == null)
        {
            return NotFound(ApiResponse<bool>.Fail(404, "Application not found."));
        }

        // Get the latest successful payment for this application
        var paymentsResult = await _paymentService.GetByApplicationNumberAsync(applicationNumber, userId, "Applicant");
        var payments = paymentsResult.Data?.ToList() ?? new List<PaymentDto>();
        var successfulPayment = payments.FirstOrDefault(p => p.Status == PaymentStatus.Paid);

        if (successfulPayment == null)
        {
            return BadRequest(ApiResponse<bool>.Fail(400, "No successful payment found for this application."));
        }

        var result = await _replaceLicenseService.ProcessPaymentAsync(application.Id, successfulPayment.Id);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get applications queue for employee review (all submitted applications waiting for processing).
    /// </summary>
    [HttpGet("queue")]
    [Authorize(Roles = "Admin,Receptionist,Doctor,Examiner,Manager,Security")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<ApplicationDto>>), 200)]
    public async Task<IActionResult> GetQueueAsync(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string? stage = null)
    {
        var result = await _applicationService.GetQueueAsync(page, pageSize, search, stage);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get applications pending theory test (Stage 6).
    /// </summary>
    [HttpGet("theory-pending")]
    [Authorize(Roles = "Admin,Examiner,Manager")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<ApplicationDto>>), 200)]
    public async Task<IActionResult> GetTheoryPendingQueueAsync(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null)
    {
        var result = await _applicationService.GetQueueAsync(page, pageSize, search, ApplicationStatus.TheoryTest.ToString());
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get applications pending practical test (Stage 7).
    /// </summary>
    [HttpGet("practical-pending")]
    [Authorize(Roles = "Admin,Examiner,Manager")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<ApplicationDto>>), 200)]
    public async Task<IActionResult> GetPracticalPendingQueueAsync(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null)
    {
        var result = await _applicationService.GetQueueAsync(page, pageSize, search, ApplicationStatus.PracticalTest.ToString());
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get applications pending medical exam (Stage 4).
    /// </summary>
    [HttpGet("medical-pending")]
    [Authorize(Roles = "Admin,Doctor,Manager")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<ApplicationDto>>), 200)]
    public async Task<IActionResult> GetMedicalPendingQueueAsync(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null)
    {
        var result = await _applicationService.GetMedicalPendingQueueAsync(page, pageSize, search);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get timeline for an application.
    /// </summary>
    [HttpGet("{idOrNumber}/timeline")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<ApplicationTimelineDto>), 200)]
    public async Task<IActionResult> GetTimelineAsync(string idOrNumber)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var result = await _applicationService.GetTimelineAsync(applicationId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Check upgrade eligibility for the current user.
    /// </summary>
    [HttpGet("upgrade/eligibility")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<ReplacementEligibilityResponse>), 200)]
    public async Task<IActionResult> GetUpgradeEligibilityAsync()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.GetReplacementEligibilityAsync(userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Find application by application number.
    /// </summary>
    [HttpGet("by-number/{applicationNumber}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<ApplicationDto>>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetByApplicationNumberAsync(string applicationNumber)
    {
        var result = await _applicationService.GetByApplicationNumberAsync(applicationNumber);
        if (result.Data == null || !result.Data.Any())
        {
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));
        }
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get applications waiting for security verification (Gate 4).
    /// </summary>
    [HttpGet("security-pending")]
    [Authorize(Roles = "Admin,Security,Manager")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<ApplicationDto>>), 200)]
    public async Task<IActionResult> GetSecurityPendingQueueAsync(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null)
    {
        var result = await _applicationService.GetSecurityPendingQueueAsync(page, pageSize, search);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Record security verification result for an application.
    /// </summary>
    [HttpPost("{idOrNumber}/security-verification")]
    [Authorize(Roles = "Admin,Security")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> RecordSecurityVerificationAsync(string idOrNumber, [FromBody] SecurityVerificationRequest request)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.RecordSecurityVerificationAsync(applicationId, request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Forward application to medical exam stage manually.
    /// </summary>
    [HttpPost("{idOrNumber}/forward-to-medical")]
    [Authorize(Roles = "Admin,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> ForwardToMedicalAsync(string idOrNumber)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.ForwardToMedicalAsync(applicationId, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Forward application to training stage manually.
    /// </summary>
    [HttpPost("{idOrNumber}/forward-to-training")]
    [Authorize(Roles = "Admin,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> ForwardToTrainingAsync(string idOrNumber)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.ForwardToTrainingAsync(applicationId, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Forward application to a specific stage (generic forward for Screen 3).
    /// </summary>
    [HttpPut("{idOrNumber}/forward")]
    [Authorize(Roles = "Admin,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> ForwardAsync(string idOrNumber, [FromBody] ForwardApplicationRequest request)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        ApiResponse<bool> result;
        
        switch (request.ForwardToStage?.ToLower())
        {
            case "medical":
                result = await _applicationService.ForwardToMedicalAsync(applicationId, userId);
                break;
            case "training":
                result = await _applicationService.ForwardToTrainingAsync(applicationId, userId);
                break;
            default:
                return BadRequest(ApiResponse<bool>.Fail(400, "Invalid forward stage. Supported values: Medical, Training, DocumentReview"));
        }
        
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get Gate 4 validation status for an application (Screen 6).
    /// </summary>
    [HttpGet("{idOrNumber}/gate4-status")]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(ApiResponse<Gate4ValidationResultDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetGate4StatusAsync(string idOrNumber)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _finalApprovalService.GetGate4StatusAsync(applicationId, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Finalize an application (approve, reject, or return) - Screen 6.
    /// </summary>
    [HttpPost("{idOrNumber}/final-approval")]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(ApiResponse<ApplicationDecisionDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> FinalizeAsync(string idOrNumber, [FromBody] FinalizeApplicationRequest request)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _finalApprovalService.FinalizeAsync(applicationId, request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Check test retake eligibility for an application.
    /// </summary>
    [HttpGet("{idOrNumber}/retake-eligibility")]
    [Authorize(Roles = "Applicant,Admin,Receptionist,Examiner,Manager")]
    [ProducesResponseType(typeof(ApiResponse<RetakeEligibilityDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetRetakeEligibilityAsync(string idOrNumber)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var result = await _testRetakeService.CheckEligibilityAsync(applicationId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Request a test retake for a failed application.
    /// </summary>
    [HttpPost("{idOrNumber}/retake")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> RequestRetakeAsync(string idOrNumber, [FromBody] RetakeRequest request)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var result = await _testRetakeService.RequestRetakeAsync(applicationId, request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Assign an application to a staff member (Doctor, Examiner).
    /// </summary>
    [HttpPost("{idOrNumber}/assign")]
    [Authorize(Roles = "Admin,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> AssignAsync(string idOrNumber, [FromBody] AssignApplicationRequest request)
    {
        var applicationId = await ResolveAppIdAsync(idOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.AssignAsync(applicationId, request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Check if the current user is eligible for a specific license category.
    /// </summary>
    [HttpGet("check-eligibility")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> CheckEligibilityAsync([FromQuery] LicenseCategoryCode categoryCode, [FromQuery] ServiceType serviceType)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.CheckEligibilityAsync(userId, categoryCode, serviceType);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get pending payment for an application (for applicants to see their pending fee)
    /// </summary>
    [HttpGet("{idOrNumber}/pending-payment")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<PaymentDto>), 200)]
    public async Task<IActionResult> GetPendingPaymentAsync(string idOrNumber)
    {
        var appId = await ResolveAppIdAsync(idOrNumber);
        if (appId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role) ?? "Applicant";

        var result = await _paymentService.GetPendingPaymentForApplicationAsync(appId, userId, role);
        return StatusCode(result.StatusCode, result);
    }

    private async Task<Guid> ResolveAppIdAsync(string appIdOrNumber)
    {
        if (string.IsNullOrWhiteSpace(appIdOrNumber)) return Guid.Empty;
        if (Guid.TryParse(appIdOrNumber.Trim(), out var id)) return id;

        var result = await _applicationService.GetByApplicationNumberAsync(appIdOrNumber.Trim());
        return result.Data?.FirstOrDefault()?.Id ?? Guid.Empty;
    }
}