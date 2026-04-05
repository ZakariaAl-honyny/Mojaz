using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Document;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared.Models;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

/// <summary>
/// Manage application documents for Stage 02: Document Review.
/// </summary>
[ApiController]
[Route("api/v1/applications/{applicationId}/[controller]")]
[Produces("application/json")]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documentService;

    public DocumentsController(IDocumentService documentService)
    {
        _documentService = documentService;
    }

    /// <summary>
    /// Upload a required document.
    /// </summary>
    [HttpPost("upload")]
    [Authorize(Roles = "Applicant,Receptionist")]
    [ProducesResponseType(typeof(ApiResponse<DocumentDto>), 201)]
    public async Task<IActionResult> UploadAsync(Guid applicationId, [FromForm] UploadDocumentRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _documentService.UploadAsync(applicationId, request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// List all documents for a specific application.
    /// </summary>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<DocumentDto>>), 200)]
    public async Task<IActionResult> GetByApplicationIdAsync(Guid applicationId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _documentService.GetByApplicationIdAsync(applicationId, userId, role);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Review (Approve/Reject) an uploaded document.
    /// </summary>
    [HttpPatch("{documentId}/review")]
    [Authorize(Roles = "Admin,Receptionist")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> ReviewAsync(Guid applicationId, Guid documentId, [FromBody] DocumentReviewRequest request)
    {
        var reviewerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _documentService.ReviewAsync(documentId, request, reviewerId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Delete an un-approved document.
    /// </summary>
    [HttpDelete("{documentId}")]
    [Authorize(Roles = "Applicant,Receptionist")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    public async Task<IActionResult> DeleteAsync(Guid applicationId, Guid documentId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _documentService.DeleteAsync(documentId, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Download a document's physical file securely.
    /// </summary>
    [HttpGet("{documentId}/download")]
    [Authorize]
    public async Task<IActionResult> DownloadAsync(Guid applicationId, Guid documentId)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role)!;
            var file = await _documentService.DownloadAsync(documentId, userId, role);
            return File(file.content, file.contentType, file.fileName);
        }
        catch (Exception ex)
        {
            return NotFound(ApiResponse<object>.Fail(404, ex.Message));
        }
    }
}
