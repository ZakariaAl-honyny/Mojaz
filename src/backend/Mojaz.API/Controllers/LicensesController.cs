using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.License;
using Mojaz.Application.Interfaces.Infrastructure;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class LicensesController : ControllerBase
{
    private readonly ILicenseService _licenseService;
    private readonly IFileStorageService _fileStorageService;

    public LicensesController(ILicenseService licenseService, IFileStorageService fileStorageService)
    {
        _licenseService = licenseService;
        _fileStorageService = fileStorageService;
    }

    /// <summary>
    /// Issue a new driving license for an approved application.
    /// This endpoint performs metadata generation, PDF creation, and secure storage.
    /// </summary>
    [HttpPost("issue/{applicationId}")]
    [Authorize(Roles = "Manager,Security,Admin")]
    [ProducesResponseType(typeof(ApiResponse<LicenseDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 409)]
    public async Task<IActionResult> IssueAsync(Guid applicationId)
    {
        var issuerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _licenseService.IssueLicenseAsync(applicationId, issuerId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Securely download the license PDF.
    /// Only the license holder or authorized employees can download.
    /// </summary>
    [HttpGet("{id}/download")]
    [Authorize]
    [ProducesResponseType(typeof(FileStreamResult), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    [ProducesResponseType(typeof(ApiResponse<object>), 403)]
    public async Task<IActionResult> DownloadAsync(Guid id)
    {
        var licenseResult = await _licenseService.GetByIdAsync(id);
        if (!licenseResult.Success || licenseResult.Data == null)
        {
            return StatusCode(licenseResult.StatusCode, licenseResult);
        }

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;

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
    /// Preview the license PDF layout with sample data (Internal only).
    /// </summary>
    [HttpGet("preview")]
    [Authorize(Roles = "Manager,Admin")]
    [ProducesResponseType(typeof(FileStreamResult), 200)]
    public async Task<IActionResult> PreviewAsync()
    {
        var license = new License
        {
            LicenseNumber = "MOJ-2025-00000000",
            IssuedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddYears(10)
        };
        var holder = new User
        {
            FullNameEn = "John Doe Sample",
            NationalId = "1234567890"
        };
        var category = new LicenseCategory
        {
            Code = LicenseCategoryCode.B,
            NameEn = "Private License",
            NameAr = "رخصة خاصة"
        };

        var generator = HttpContext.RequestServices.GetService(typeof(ILicensePdfGenerator)) as ILicensePdfGenerator;
        if (generator == null) return StatusCode(500, "Generator not found");

        var pdfBytes = await generator.GenerateLicensePdfAsync(license, holder, category);
        return File(pdfBytes, "application/pdf", "preview.pdf");
    }
}
