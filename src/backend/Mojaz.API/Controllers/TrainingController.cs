using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Training;
using Mojaz.Application.Interfaces;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared;
using Mojaz.Shared.Constants;
using Microsoft.AspNetCore.RateLimiting;

namespace Mojaz.API.Controllers;

/// <summary>
/// Manage training records and exemption requests for license applications.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
[EnableRateLimiting(SecurityConstants.Policies.GlobalRateLimit)]
[Authorize]
public class TrainingController : ControllerBase
{
    private readonly ITrainingService _trainingService;
    private readonly IApplicationService _applicationService;

    public TrainingController(ITrainingService trainingService, IApplicationService applicationService)
    {
        _trainingService = trainingService;
        _applicationService = applicationService;
    }

    /// <summary>
    /// Get training record by application ID or Number.
    /// </summary>
    [HttpGet("application/{appIdOrNumber}")]
    [Authorize(Roles = "Applicant,Doctor,Manager,Admin")]
    [ProducesResponseType(typeof(ApiResponse<TrainingRecordDto>), 200)]
    public async Task<IActionResult> GetByApplicationId(string appIdOrNumber)
    {
        var applicationId = await ResolveIdAsync(appIdOrNumber);
        if (applicationId == 0)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _trainingService.GetByApplicationIdAsync(applicationId, userId, role);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get training completion status for an application ID or Number.
    /// </summary>
    [HttpGet("application/{appIdOrNumber}/status")]
    [Authorize(Roles = "Applicant,Doctor,Manager,Admin")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> GetStatus(string appIdOrNumber)
    {
        var applicationId = await ResolveIdAsync(appIdOrNumber);
        if (applicationId == 0)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var result = await _trainingService.IsTrainingCompleteAsync(applicationId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get all training records (paginated).
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Manager,Admin,Receptionist,Doctor")]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string? status = null)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _trainingService.GetAllAsync(userId, role, page, pageSize, search, status);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Create a new training record.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Examiner,Receptionist,Admin")]
    public async Task<IActionResult> Create([FromBody] CreateTrainingRecordRequest request)
    {
        var result = await _trainingService.CreateAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Update training hours for an existing record.
    /// </summary>
    [HttpPatch("{id}/hours")]
    [Authorize(Roles = "Examiner,Admin")]
    public async Task<IActionResult> UpdateHours(int id, [FromBody] UpdateTrainingHoursRequest request)
    {
        var result = await _trainingService.UpdateHoursAsync(id, request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Request a training exemption.
    /// </summary>
    [HttpPost("exemption")]
    [Authorize(Roles = "Applicant,Receptionist,Admin")]
    public async Task<IActionResult> RequestExemption([FromBody] CreateExemptionRequest request)
    {
        var result = await _trainingService.CreateExemptionAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Approve a training exemption request.
    /// </summary>
    [HttpPatch("{id}/exemption/approve")]
    [Authorize(Roles = "Manager,Admin")]
    public async Task<IActionResult> ApproveExemption(int id, [FromBody] ExemptionActionRequest request)
    {
        var result = await _trainingService.ApproveExemptionAsync(id, request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Reject a training exemption request.
    /// </summary>
    [HttpPatch("{id}/exemption/reject")]
    [Authorize(Roles = "Manager,Admin")]
    public async Task<IActionResult> RejectExemption(int id, [FromBody] ExemptionActionRequest request)
    {
        var result = await _trainingService.RejectExemptionAsync(id, request);
        return StatusCode(result.StatusCode, result);
    }

    private async Task<int> ResolveIdAsync(string idOrNumber)
    {
        if (int.TryParse(idOrNumber, out var id))
            return id;

        var result = await _applicationService.GetByApplicationNumberAsync(idOrNumber);
        return result.Data?.FirstOrDefault()?.Id ?? 0;
    }
}
