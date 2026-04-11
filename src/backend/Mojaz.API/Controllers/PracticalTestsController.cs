using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Practical;
using Mojaz.Application.Interfaces;
using Mojaz.Shared;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class PracticalTestsController : ControllerBase
{
    private readonly IPracticalService _practicalService;

    public PracticalTestsController(IPracticalService practicalService)
    {
        _practicalService = practicalService;
    }

    /// <summary>
    /// Submits a practical test result for an application
    /// </summary>
    [HttpPost("applications/{applicationId}/submit")]
    [Authorize(Roles = "Examiner,Manager")]
    [ProducesResponseType(typeof(ApiResponse<PracticalTestDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SubmitResult(Guid applicationId, [FromBody] SubmitPracticalResultRequest request)
    {
        var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(nameIdentifier) || !Guid.TryParse(nameIdentifier, out var examinerId))
        {
            return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
        }

        var result = await _practicalService.SubmitResultAsync(applicationId, request, examinerId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Gets the practical test history for an application
    /// </summary>
    [HttpGet("applications/{applicationId}/history")]
    [Authorize(Roles = "Applicant,Examiner,Manager")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<PracticalTestDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetHistory(
        Guid applicationId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(nameIdentifier) || !Guid.TryParse(nameIdentifier, out var userId))
        {
            return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
        }

        var role = User.FindFirstValue(ClaimTypes.Role) ?? "";
        var result = await _practicalService.GetHistoryAsync(applicationId, userId, role, page, pageSize);
        return StatusCode(result.StatusCode, result);
    }
}
