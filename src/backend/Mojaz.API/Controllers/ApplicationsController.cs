using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Application;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Enums;
using Mojaz.Shared.Models;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

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

    public ApplicationsController(IApplicationService applicationService)
    {
        _applicationService = applicationService;
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
    [ProducesResponseType(typeof(ApiResponse<List<ApplicationTimelineDto>>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 403)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetTimelineAsync(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _applicationService.GetTimelineAsync(id, userId, role);
        return StatusCode(result.StatusCode, result);
    }
}
