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
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _dashboardService.GetApplicantDashboardAsync(userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get high-level KPI dashboard for Manager role
    /// </summary>
    [HttpGet("manager")]
    [Authorize(Roles = "Manager,Admin,Receptionist,Doctor,Examiner")]
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
    [Authorize(Roles = "Admin,Receptionist,Doctor,Examiner,Manager,Security")]
    [ProducesResponseType(typeof(ApiResponse<EmployeeDashboardDto>), 200)]
    public async Task<IActionResult> GetEmployeeDashboardAsync()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _dashboardService.GetEmployeeDashboardAsync(userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get dashboard for Receptionist role
    /// </summary>
    [HttpGet("receptionist")]
    [Authorize(Roles = "Admin,Receptionist,Manager,Security")]
    [ProducesResponseType(typeof(ApiResponse<ReceptionistDashboardDto>), 200)]
    public async Task<IActionResult> GetReceptionistDashboardAsync()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _dashboardService.GetReceptionistDashboardAsync(userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get dashboard for the current user (default route - returns role-appropriate dashboard).
    /// </summary>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    public async Task<IActionResult> GetDefaultAsync()
    {
        var userRole = User.FindFirstValue(ClaimTypes.Role);
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        // Route to appropriate dashboard based on role
        if (userRole == "Applicant")
        {
            var result = await _dashboardService.GetApplicantDashboardAsync(userId);
            return StatusCode(result.StatusCode, result);
        }
        else if (userRole == "Admin")
        {
            var result = await _dashboardService.GetAdminDashboardAsync();
            return StatusCode(result.StatusCode, result);
        }
        else if (userRole == "Manager")
        {
            var result = await _dashboardService.GetManagerDashboardAsync();
            return StatusCode(result.StatusCode, result);
        }
        else
        {
            var result = await _dashboardService.GetEmployeeDashboardAsync(userId);
            return StatusCode(result.StatusCode, result);
        }
    }

    /// <summary>
    /// Get general statistics (accessible by all authenticated users)
    /// </summary>
    [HttpGet("stats")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<ManagerKpiDto>), 200)]
    public async Task<IActionResult> GetStatsAsync()
    {
        var userRole = User.FindFirstValue(ClaimTypes.Role);
        
        // Route to appropriate dashboard based on role
        if (userRole == "Applicant")
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _dashboardService.GetApplicantDashboardAsync(userId);
            return StatusCode(result.StatusCode, result);
        }
        else if (userRole == "Admin")
        {
            var result = await _dashboardService.GetAdminDashboardAsync();
            return StatusCode(result.StatusCode, result);
        }
        else if (userRole == "Manager")
        {
            var result = await _dashboardService.GetManagerDashboardAsync();
            return StatusCode(result.StatusCode, result);
        }
        else
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _dashboardService.GetEmployeeDashboardAsync(userId);
            return StatusCode(result.StatusCode, result);
        }
    }
}
