using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Practical;
using Mojaz.Application.Interfaces;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

[ApiController]
[Route("api/v1/practical-tests")]
[Produces("application/json")]
public class PracticalTestsController : ControllerBase
{
    private readonly IPracticalService _practicalService;
    private readonly IApplicationService _applicationService;

    public PracticalTestsController(IPracticalService practicalService, IApplicationService applicationService)
    {
        _practicalService = practicalService;
        _applicationService = applicationService;
    }

    /// <summary>
    /// Submits a practical test result for an application
    /// Route: api/v1/practical-tests/application/{appIdOrNumber}/submit
    /// </summary>
    [HttpPost("application/{appIdOrNumber}/submit")]
    [Authorize(Roles = "Examiner")]
    [ProducesResponseType(typeof(ApiResponse<PracticalTestDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SubmitResult(string appIdOrNumber, [FromBody] SubmitPracticalResultRequest request)
    {
        var applicationId = await ResolveAppIdAsync(appIdOrNumber);
        if (applicationId == 0)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));
        var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(nameIdentifier) || !int.TryParse(nameIdentifier, out var examinerId))
        {
            return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
        }

        var result = await _practicalService.SubmitResultAsync(applicationId, request, examinerId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Gets the practical test history for an application
    /// Route: api/v1/practical-tests/application/{appIdOrNumber}/history
    /// </summary>
    [HttpGet("application/{appIdOrNumber}/history")]
    [Authorize(Roles = "Applicant,Receptionist,Doctor,Examiner,Manager,Security,Admin")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<PracticalTestDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetHistory(
        string appIdOrNumber,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var applicationId = await ResolveAppIdAsync(appIdOrNumber);
        if (applicationId == 0)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));
        var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(nameIdentifier) || !int.TryParse(nameIdentifier, out var userId))
        {
            return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
        }

        var role = User.FindFirstValue(ClaimTypes.Role) ?? "";
        var result = await _practicalService.GetHistoryAsync(applicationId, userId, role, page, pageSize);
        return StatusCode(result.StatusCode, result);
    }

    private async Task<int> ResolveAppIdAsync(string appIdOrNumber)
    {
        if (string.IsNullOrWhiteSpace(appIdOrNumber)) return 0;
        if (int.TryParse(appIdOrNumber, out var id)) return id;

        var result = await _applicationService.GetByApplicationNumberAsync(appIdOrNumber.Trim());
        return result.Data?.FirstOrDefault()?.Id ?? 0;
    }

}

