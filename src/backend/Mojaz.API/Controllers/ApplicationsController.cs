using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Application;
using Mojaz.Application.Applications.Dtos;
using Mojaz.Application.DTOs.LicenseReplacement;
using Mojaz.Application.Interfaces;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using FluentValidation;
using Mojaz.Application.Validators;

namespace Mojaz.API.Controllers;

/// <summary>
/// Manage license applications for the Mojaz platform.
/// Standard 10-stage workflow endpoints (CRUD + Status + Timeline).
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;
    private readonly IReplaceLicenseService _replaceLicenseService;

    public ApplicationsController(IApplicationService applicationService, IReplaceLicenseService replaceLicenseService)
    {
        _applicationService = applicationService;
        _replaceLicenseService = replaceLicenseService;
    }

    /// <summary>
    /// Create a new driving license application (5-step wizard entry).
    /// Initial status will be Submitted (Gate 1).
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<ApplicationDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateApplicationRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.CreateAsync(request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get a single application by ID with full details.
    /// </summary>
    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<ApplicationDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetByIdAsync(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _applicationService.GetByIdAsync(id, userId, role);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Check if the current user is eligible to apply for a specific license category.
    /// </summary>
    [HttpGet("eligibility")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<EligibilityCheckResult>), 200)]
    public async Task<IActionResult> CheckEligibilityAsync([FromQuery] EligibilityCheckRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.CheckEligibilityAsync(userId, request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// List applications (paginated and filterable).
    /// </summary>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<ApplicationDto>>), 200)]
    public async Task<IActionResult> GetListAsync([FromQuery] ApplicationFilterRequest filters)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        
        var result = await _applicationService.GetListAsync(userId, role, filters);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get the work queue for employees based on their role
    /// </summary>
    [HttpGet("queue")]
    [Authorize(Roles = "Admin,Manager,Receptionist,Doctor,Examiner,Security")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<ApplicationSummaryDto>>), 200)]
    public async Task<IActionResult> GetEmployeeQueueAsync([FromQuery] ApplicationFilterRequest filters)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _applicationService.GetEmployeeQueueAsync(userId, role, filters);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Update a draft application.
    /// </summary>
    [HttpPut("{id}/draft")]
    [Authorize(Roles = "Applicant")]
    public async Task<IActionResult> UpdateDraftAsync(Guid id, [FromBody] UpdateDraftRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.UpdateDraftAsync(id, request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Submit a draft application.
    /// </summary>
    [HttpPatch("{id}/submit")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<ApplicationDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> SubmitAsync(Guid id, [FromBody] SubmitApplicationRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _applicationService.SubmitAsync(id, request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Update the official status of an application in the workflow.
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
    /// Cancel an active application.
    /// </summary>
    [HttpPatch("{id}/cancel")]
    [Authorize(Roles = "Applicant,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 403)]
    public async Task<IActionResult> CancelAsync(Guid id, [FromBody] CancelApplicationRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _applicationService.CancelAsync(id, request.Reason, userId, role);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get application timeline (status history).
    /// </summary>
    [HttpGet("{id}/timeline")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<List<Mojaz.Application.DTOs.Application.ApplicationTimelineDto>>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 403)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetTimelineAsync(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _applicationService.GetTimelineAsync(id, userId, role);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get the 10-stage visual workflow timeline state
    /// </summary>
    [HttpGet("{id}/workflow")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<ApplicationWorkflowTimelineDto>), 200)]
    public async Task<IActionResult> GetWorkflowTimelineAsync(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _applicationService.GetWorkflowTimelineAsync(id, userId, role);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get Gate 4 validation status for an application (Manager/Admin only).
    /// Returns the live checklist showing which conditions are met.
    /// </summary>
    [HttpGet("{id}/gate4")]
    [Authorize(Roles = "Manager,Admin")]
    [ProducesResponseType(typeof(ApiResponse<Gate4ValidationResultDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 403)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetGate4StatusAsync(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var finalApprovalService = HttpContext.RequestServices.GetService(typeof(IFinalApprovalService)) as IFinalApprovalService;
        if (finalApprovalService == null)
        {
            return StatusCode(500, ApiResponse<object>.Fail("Service not available", 500));
        }
        
        var result = await finalApprovalService.GetGate4StatusAsync(id, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Create a new license replacement application.
    /// </summary>
    [HttpPost("replacement")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<Guid>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> CreateReplacementAsync(
        [FromBody] CreateReplacementRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _replaceLicenseService.CreateReplacementAsync(request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Process payment confirmation for a license replacement application.
    /// </summary>
    [HttpPatch("{id}/process-payment")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> ProcessPaymentAsync(Guid id, [FromBody] PaymentConfirmRequest request)
    {
        var result = await _replaceLicenseService.ProcessPaymentAsync(id, request.PaymentId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Record final decision (Approve, Reject, or Return) for an application.
    /// Manager role required. Enforces Gate 4 validation server-side.
    /// </summary>
    [HttpPost("{id}/finalize")]
    [Authorize(Roles = "Manager")]
    [ProducesResponseType(typeof(ApiResponse<ApplicationDecisionDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 403)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    [ProducesResponseType(typeof(ApiResponse<object>), 409)]
    public async Task<IActionResult> FinalizeAsync(Guid id, [FromBody] FinalizeApplicationRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var finalApprovalService = HttpContext.RequestServices.GetService(typeof(IFinalApprovalService)) as IFinalApprovalService;
        if (finalApprovalService == null)
        {
            return StatusCode(500, ApiResponse<object>.Fail("Service not available", 500));
        }
         
        var result = await finalApprovalService.FinalizeAsync(id, request, userId);
        return StatusCode(result.StatusCode, result);
    }
}
