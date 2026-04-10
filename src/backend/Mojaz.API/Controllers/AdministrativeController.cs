using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Interfaces;
using Mojaz.Shared;
using Mojaz.Shared.Constants;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

/// <summary>
/// Administrative endpoints for application review and management.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
[Authorize(Policy = RolePolicies.AdminOnly)] // Only Admin role
public class AdministrativeController : ControllerBase
{
    private readonly IReplaceLicenseService _replaceLicenseService;

    public AdministrativeController(IReplaceLicenseService replaceLicenseService)
    {
        _replaceLicenseService = replaceLicenseService;
    }

    /// <summary>
    /// Verify a stolen police report for a replacement application.
    /// Only accessible by Admin/Receptionist/Manager roles.
    /// </summary>
    [HttpPatch("applications/{id}/verify-stolen-report")]
    [Authorize(Roles = "Admin,Manager,Receptionist")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 403)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> VerifyStolenReportAsync(
        Guid id,
        [FromBody] VerifyStolenReportRequest request)
    {
        var reviewerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _replaceLicenseService.UpdateReportVerificationAsync(
            id, 
            request.IsVerified, 
            request.Comments, 
            reviewerId);
        return StatusCode(result.StatusCode, result);
    }
}

/// <summary>
/// Request to verify a stolen police report.
/// </summary>
public class VerifyStolenReportRequest
{
    /// <summary>
    /// Whether the police report is verified (approved) or rejected.
    /// </summary>
    public bool IsVerified { get; set; }

    /// <summary>
    /// Optional comments from the reviewer.
    /// </summary>
    public string? Comments { get; set; }
}