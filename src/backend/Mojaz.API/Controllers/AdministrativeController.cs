using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Interfaces;
using Mojaz.Shared;
using Mojaz.Shared.Constants;
using System;
using System.Linq;
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
    private readonly IApplicationService _applicationService;

    public AdministrativeController(IReplaceLicenseService replaceLicenseService, IApplicationService applicationService)
    {
        _replaceLicenseService = replaceLicenseService;
        _applicationService = applicationService;
    }

    /// <summary>
    /// Verify a stolen police report for a replacement application by ID or Number.
    /// </summary>
    [HttpPatch("applications/{idOrNumber}/verify-stolen-report")]
    [Authorize(Roles = "Admin,Manager,Receptionist")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> VerifyStolenReportAsync(
        string idOrNumber,
        [FromBody] VerifyStolenReportRequest request)
    {
        var applicationId = await ResolveIdAsync(idOrNumber);
        if (applicationId == 0)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var reviewerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _replaceLicenseService.UpdateReportVerificationAsync(
            applicationId, 
            request.IsVerified, 
            request.Comments, 
            reviewerId);
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

public class VerifyStolenReportRequest
{
    public bool IsVerified { get; set; }
    public string? Comments { get; set; }
}