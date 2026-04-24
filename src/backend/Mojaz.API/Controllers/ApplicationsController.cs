using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using Mojaz.Application.DTOs.Application;
using Mojaz.Application.DTOs.Payment;
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

    public ApplicationsController(
        IApplicationService applicationService, 
        IReplaceLicenseService replaceLicenseService,
        IPaymentService paymentService)
    {
        _applicationService = applicationService;
        _replaceLicenseService = replaceLicenseService;
        _paymentService = paymentService;
    }

    /// <summary>
    /// Create a new driving license application.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Applicant")]
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
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<ApplicationDto>), 201)]
    public async Task<IActionResult> CreateDraftAsync([FromBody] CreateApplicationDraftRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.CreateDraftAsync(request.ServiceType, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get a single application by ID.
    /// </summary>
    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<ApplicationDto>), 200)]
    public async Task<IActionResult> GetByIdAsync(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _applicationService.GetByIdAsync(id, userId, role);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get complete wizard data for an application (application + applicant user fields).
    /// Used to restore wizard state on page refresh.
    /// </summary>
    [HttpGet("{id}/wizard-data")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<ApplicationWizardDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetWizardDataAsync(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.GetWizardDataAsync(id, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Update wizard data (both application and applicant user fields).
    /// Used during wizard progression and auto-save.
    /// </summary>
    [HttpPut("{id}/wizard-data")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<ApplicationWizardDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> UpdateWizardDataAsync(Guid id, [FromBody] UpdateWizardDataRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.UpdateWizardDataAsync(id, request, userId);
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
    [HttpPut("{id}")]
    [Authorize(Roles = "Applicant")]
    public async Task<IActionResult> UpdateAsync(Guid id, [FromBody] UpdateApplicationRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.UpdateAsync(id, request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Update application status.
    /// </summary>
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin,Manager,Receptionist,Doctor,Examiner")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> UpdateStatusAsync(Guid id, [FromQuery] ApplicationStatus status, [FromQuery] string? reason = null)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.UpdateStatusAsync(id, status, reason ?? "", userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Cancel an application.
    /// </summary>
    [HttpPatch("{id}/cancel")]
    [Authorize(Roles = "Applicant,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> CancelAsync(Guid id, [FromBody] CancelApplicationRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.CancelAsync(id, request.Reason, userId);
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
        var applications = await _applicationService.GetByApplicationNumberAsync(applicationNumber);
        var application = applications.Data?.FirstOrDefault();
        
        if (application == null)
        {
            return NotFound(ApiResponse<bool>.Fail(404, "Application not found."));
        }

        // Get the latest successful payment for this application
        var paymentsResult = await _paymentService.GetByApplicationNumberAsync(applicationNumber);
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
    [Authorize(Roles = "Receptionist,Doctor,Examiner,Manager")]
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
    /// Get timeline for an application.
    /// </summary>
    [HttpGet("{id}/timeline")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<ApplicationTimelineDto>), 200)]
    public async Task<IActionResult> GetTimelineAsync(Guid id)
    {
        var result = await _applicationService.GetTimelineAsync(id);
        return StatusCode(result.StatusCode, result);
    }
}