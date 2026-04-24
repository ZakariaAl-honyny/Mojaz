using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Training;
using Mojaz.Application.Interfaces;
using Mojaz.Shared;
using Mojaz.Shared.Constants;
using Microsoft.AspNetCore.RateLimiting;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

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

    public TrainingController(ITrainingService trainingService)
    {
        _trainingService = trainingService;
    }

    /// <summary>
    /// Get training record by application ID.
    /// </summary>
    /// <param name="applicationId">The application unique identifier</param>
    [HttpGet("application/{applicationId}")]
    [Authorize(Roles = "Applicant,Doctor,Manager,Admin")]
    [ProducesResponseType(typeof(ApiResponse<TrainingRecordDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetByApplicationId(Guid applicationId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _trainingService.GetByApplicationIdAsync(applicationId, userId, role);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Create a new training record.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Examiner,Receptionist,Admin")]
    [ProducesResponseType(typeof(ApiResponse<TrainingRecordDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
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
    [ProducesResponseType(typeof(ApiResponse<TrainingRecordDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> UpdateHours(Guid id, [FromBody] UpdateTrainingHoursRequest request)
    {
        var result = await _trainingService.UpdateHoursAsync(id, request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Request a training exemption.
    /// </summary>
    [HttpPost("exemption")]
    [Authorize(Roles = "Applicant,Receptionist,Admin")]
    [ProducesResponseType(typeof(ApiResponse<TrainingRecordDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> RequestExemption([FromBody] CreateExemptionRequest request)
    {
        var result = await _trainingService.CreateExemptionAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get all pending exemption requests.
    /// </summary>
    [HttpGet("exemptions/pending")]
    [Authorize(Roles = "Manager,Admin")]
    [ProducesResponseType(typeof(ApiResponse<List<TrainingRecordDto>>), 200)]
    public async Task<IActionResult> GetPendingExemptions()
    {
        var result = await _trainingService.GetPendingExemptionsAsync();
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Approve a training exemption request.
    /// </summary>
    /// <param name="id">The training record unique identifier</param>
    [HttpPatch("{id}/exemption/approve")]
    [Authorize(Roles = "Manager,Admin")]
    [ProducesResponseType(typeof(ApiResponse<TrainingRecordDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> ApproveExemption(Guid id, [FromBody] ExemptionActionRequest request)
    {
        var result = await _trainingService.ApproveExemptionAsync(id, request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Reject a training exemption request.
    /// </summary>
    /// <param name="id">The training record unique identifier</param>
    [HttpPatch("{id}/exemption/reject")]
    [Authorize(Roles = "Manager,Admin")]
    [ProducesResponseType(typeof(ApiResponse<TrainingRecordDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> RejectExemption(Guid id, [FromBody] ExemptionActionRequest request)
    {
        var result = await _trainingService.RejectExemptionAsync(id, request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get training completion status for an application.
    /// </summary>
    /// <param name="applicationId">The application unique identifier</param>
    [HttpGet("application/{applicationId}/status")]
    [Authorize(Roles = "Applicant,Doctor,Manager,Admin")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> GetStatus(Guid applicationId)
    {
        var result = await _trainingService.IsTrainingCompleteAsync(applicationId);
        return StatusCode(result.StatusCode, result);
    }
}
