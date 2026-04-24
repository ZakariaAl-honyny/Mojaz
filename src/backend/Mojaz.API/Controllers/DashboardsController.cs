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
[Authorize]
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

    /// <summary>
    /// Get admin dashboard with comprehensive statistics
    /// </summary>
    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<AdminKpiDto>), 200)]
    public async Task<IActionResult> GetAdminDashboardAsync()
    {
        var result = await _dashboardService.GetAdminDashboardAsync();
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get dashboard for Employee (Receptionist/Doctor/Examiner) roles
    /// </summary>
    [HttpGet("employee")]
    [Authorize(Roles = "Receptionist,Doctor,Examiner")]
    [ProducesResponseType(typeof(ApiResponse<EmployeeDashboardDto>), 200)]
    public async Task<IActionResult> GetEmployeeDashboardAsync()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _dashboardService.GetEmployeeDashboardAsync(userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get dashboard for Receptionist role
    /// </summary>
    [HttpGet("receptionist")]
    [Authorize(Roles = "Receptionist")]
    [ProducesResponseType(typeof(ApiResponse<ReceptionistDashboardDto>), 200)]
    public async Task<IActionResult> GetReceptionistDashboardAsync()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _dashboardService.GetReceptionistDashboardAsync(userId);
        return StatusCode(result.StatusCode, result);
    }
}
