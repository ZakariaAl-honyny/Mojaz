using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.Dashboards.Dtos;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared;
using System.Security.Claims;

namespace Mojaz.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class DashboardsController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardsController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    /// <summary>
    /// Get summary dashboard for Applicant role
    /// </summary>
    [HttpGet("applicant")]
    [Authorize(Roles = "Applicant")]
    [ProducesResponseType(typeof(ApiResponse<DashboardSummaryDto>), 200)]
    public async Task<IActionResult> GetApplicantDashboardAsync()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _dashboardService.GetApplicantDashboardAsync(userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get high-level KPI dashboard for Manager role
    /// </summary>
    [HttpGet("manager")]
    [Authorize(Roles = "Manager,Admin")]
    [ProducesResponseType(typeof(ApiResponse<ManagerKpiDto>), 200)]
    public async Task<IActionResult> GetManagerDashboardAsync()
    {
        var result = await _dashboardService.GetManagerDashboardAsync();
        return StatusCode(result.StatusCode, result);
    }
}
