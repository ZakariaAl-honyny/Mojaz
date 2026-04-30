using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs;
using Mojaz.Application.DTOs.License;
using Mojaz.Application.DTOs.LicenseReplacement;
using Mojaz.Application.Interfaces;
using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
[Authorize]
public class LicensesController : ControllerBase
{
    private readonly ILicenseService _licenseService;
    private readonly IFileStorageService _fileStorageService;
    private readonly IReplaceLicenseService _replaceLicenseService;
    private readonly IApplicationService _applicationService;

    public LicensesController(
        ILicenseService licenseService, 
        IFileStorageService fileStorageService, 
        IReplaceLicenseService replaceLicenseService,
        IApplicationService applicationService)
    {
        _licenseService = licenseService;
        _fileStorageService = fileStorageService;
        _replaceLicenseService = replaceLicenseService;
        _applicationService = applicationService;
    }

    /// <summary>
    /// Issue a new driving license for an approved application.
    /// Route: api/v1/licenses/application/{appIdOrNumber}/issue
    /// </summary>
    [HttpPost("application/{appIdOrNumber}/issue")]
    [Authorize(Roles = "Manager,Admin")]
    [ProducesResponseType(typeof(ApiResponse<LicenseDto>), 200)]
    public async Task<IActionResult> IssueAsync(string appIdOrNumber)
    {
        var applicationId = await ResolveIdAsync(appIdOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var issuerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _licenseService.IssueLicenseAsync(applicationId, issuerId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Issue a replacement driving license for a validated replacement application.
    /// Route: api/v1/licenses/application/{appIdOrNumber}/issue-replacement
    /// </summary>
    [HttpPost("application/{appIdOrNumber}/issue-replacement")]
    [Authorize(Roles = "Manager,Admin")]
    [ProducesResponseType(typeof(ApiResponse<Guid>), 200)]
    public async Task<IActionResult> IssueReplacementAsync(string appIdOrNumber)
    {
        var applicationId = await ResolveIdAsync(appIdOrNumber);
        if (applicationId == Guid.Empty)
            return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

        var issuerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _replaceLicenseService.IssueReplacementAsync(applicationId, issuerId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Securely download the license PDF.
    /// </summary>
    [HttpGet("{id}/download")]
    [Authorize]
    public async Task<IActionResult> DownloadAsync(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;

        var licenseResult = await _licenseService.GetByIdAsync(id, userId, role);
        if (!licenseResult.Success || licenseResult.Data == null)
        {
            return StatusCode(licenseResult.StatusCode, licenseResult);
        }

        // Security check: Only holder or Employee roles can download
        var isAdminOrEmployee = role == "Admin" || role == "Manager" || role == "Security" || role == "Receptionist";
        if (licenseResult.Data.HolderId != userId && !isAdminOrEmployee)
        {
            return StatusCode(403, ApiResponse<object>.Fail("Access denied to this license."));
        }

        if (string.IsNullOrEmpty(licenseResult.Data.BlobUrl))
        {
            return NotFound(ApiResponse<object>.Fail("License PDF file not found."));
        }

        try
        {
            var (stream, contentType) = await _fileStorageService.ReadAsync(licenseResult.Data.BlobUrl);
            var fileDownloadName = $"{licenseResult.Data.LicenseNumber}.pdf";
            return File(stream, contentType, fileDownloadName);
        }
        catch (FileNotFoundException)
        {
            return NotFound(ApiResponse<object>.Fail("File not found on storage."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail($"Error retrieving file: {ex.Message}"));
        }
    }

    /// <summary>
    /// Get current user's licenses
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Applicant")]
    public async Task<IActionResult> GetMyLicensesAsync()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _licenseService.GetUserLicensesAsync(userId, role);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get available upgrade targets for a specific license
    /// </summary>
    [HttpGet("{id}/upgrade-targets")]
    [Authorize(Roles = "Applicant")]
    public async Task<IActionResult> GetUpgradeTargetsAsync(Guid id)
    {
        var result = await _licenseService.GetUpgradeTargetsAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    private async Task<Guid> ResolveIdAsync(string idOrNumber)
    {
        if (Guid.TryParse(idOrNumber, out var id))
            return id;

        var result = await _applicationService.GetByApplicationNumberAsync(idOrNumber);
        return result.Data?.FirstOrDefault()?.Id ?? Guid.Empty;
    }
}
