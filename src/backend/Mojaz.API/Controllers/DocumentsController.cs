using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Document;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

/// <summary>
/// Manage application documents for Stage 02: Document Review.
/// </summary>
/// <remarks>
/// This controller handles document upload, review, and management for driving license applications.
/// Applicants can upload required documents (ID copy, photo, medical report, training certificate).
/// Employees can review, approve, or reject documents.
/// </remarks>
[ApiController]
[Route("api/v1/applications/{applicationId}/[controller]")]
[Produces("application/json")]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documentService;

    public DocumentsController(IDocumentService documentService)
    {
        _documentService = documentService;
    }

    // =====================
    // GUID-based endpoints
    // =====================

    /// <summary>
    /// Upload a required document for an application.
    /// </summary>
    /// <param name="applicationId">The application ID</param>
    /// <param name="request">Upload request containing document type and file</param>
    /// <returns>Created document with status</returns>
    /// <remarks>
    /// Allowed file types: PDF, JPG, JPEG, PNG
    /// Maximum file size: 5MB
    /// </remarks>
    /// <response code="201">Document uploaded successfully</response>
    /// <response code="400">Invalid file type, size exceeds limit, or validation error</response>
    /// <response code="403">Unauthorized - user does not own the application</response>
    /// <response code="404">Application not found</response>
    [HttpPost("upload")]
    [Authorize(Roles = "Applicant,Receptionist")]
    [ProducesResponseType(typeof(ApiResponse<DocumentDto>), StatusCodes.Status201Created)]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadAsync(Guid applicationId, [FromForm] UploadDocumentRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _documentService.UploadAsync(applicationId, request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// List all documents for a specific application.
    /// </summary>
    /// <param name="applicationId">The application ID</param>
    /// <returns>List of documents with their status</returns>
    /// <response code="200">Returns list of documents</response>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<DocumentDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByApplicationIdAsync(Guid applicationId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _documentService.GetByApplicationIdAsync(applicationId, userId, role);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get document requirements for an application.
    /// </summary>
    /// <param name="applicationId">The application ID</param>
    /// <returns>List of document requirements</returns>
    /// <response code="200">Returns list of document requirements</response>
    [HttpGet("requirements")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<DocumentRequirementDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRequirementsAsync(Guid applicationId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _documentService.GetRequirementsAsync(applicationId, userId);
        return StatusCode(result.StatusCode, result);
    }

    // ============================
    // Application Number endpoints
    // ============================

    /// <summary>
    /// Upload a required document using application number.
    /// </summary>
    /// <param name="applicationNumber">The application number (e.g., MOJ-2026-22469742)</param>
    /// <param name="request">Upload request containing document type and file</param>
    /// <returns>Created document with status</returns>
    /// <remarks>
    /// Use this endpoint when you have the application number instead of the GUID.
    /// Allowed file types: PDF, JPG, JPEG, PNG
    /// Maximum file size: 5MB
    /// </remarks>
    /// <response code="201">Document uploaded successfully</response>
    /// <response code="400">Invalid file type, size exceeds limit, or validation error</response>
    /// <response code="403">Unauthorized - user does not own the application</response>
    /// <response code="404">Application not found</response>
    [HttpPost("upload-by-number")]
    [Authorize(Roles = "Applicant,Receptionist")]
    [ProducesResponseType(typeof(ApiResponse<DocumentDto>), StatusCodes.Status201Created)]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadByApplicationNumberAsync(
        [FromRoute] string applicationNumber,
        [FromForm] UploadDocumentRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _documentService.UploadByApplicationNumberAsync(applicationNumber, request, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// List all documents for an application using application number.
    /// </summary>
    /// <param name="applicationNumber">The application number (e.g., MOJ-2026-22469742)</param>
    /// <returns>List of documents with their status</returns>
    /// <response code="200">Returns list of documents</response>
    [HttpGet("by-number/{applicationNumber}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<DocumentDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByApplicationNumberAsync([FromRoute] string applicationNumber)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await _documentService.GetByApplicationNumberAsync(applicationNumber, userId, role);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get document requirements using application number.
    /// </summary>
    /// <param name="applicationNumber">The application number (e.g., MOJ-2026-22469742)</param>
    /// <returns>List of document requirements</returns>
    /// <response code="200">Returns list of document requirements</response>
    [HttpGet("requirements-by-number/{applicationNumber}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<DocumentRequirementDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRequirementsByApplicationNumberAsync([FromRoute] string applicationNumber)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _documentService.GetRequirementsByApplicationNumberAsync(applicationNumber, userId);
        return StatusCode(result.StatusCode, result);
    }

    // ==========================
    // Application Number based endpoints (top-level routes)
    // ==========================

    /// <summary>
    /// Get document requirements for an application using application number (top-level route).
    /// </summary>
    /// <param name="applicationNumber">The application number (e.g., MOJ-2026-22469742)</param>
    /// <returns>List of document requirements</returns>
    /// <response code="200">Returns list of document requirements</response>
[HttpGet("~/api/v1/applications/requirements-by-number/{applicationNumber}/documents/requirements")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<DocumentRequirementDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRequirementsByNumberTopLevelAsync([FromRoute] string applicationNumber)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _documentService.GetRequirementsByApplicationNumberAsync(applicationNumber, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Bulk approve all pending documents for an application using application number.
    /// </summary>
    /// <param name="applicationNumber">The application number (e.g., MOJ-2026-22469742)</param>
    /// <returns>Count of approved documents</returns>
    /// <remarks>
    /// Approves all documents with status 'Pending' in a single transaction.
    /// Only available for Receptionist, Manager, and Admin roles.
    /// </remarks>
    /// <response code="200">Returns approval count</response>
    /// <response code="403">User does not have permission</response>
    [HttpPatch("~/api/v1/applications/by-number/{applicationNumber}/documents/bulk-approve")]
    [Authorize(Roles = "Admin,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<BulkApproveResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> BulkApproveByApplicationNumberAsync([FromRoute] string applicationNumber)
    {
        var reviewerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _documentService.BulkApproveByApplicationNumberAsync(applicationNumber, reviewerId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Download a document's physical file using application number.
    /// </summary>
    /// <param name="applicationNumber">The application number (e.g., MOJ-2026-22469742)</param>
    /// <param name="documentId">The document ID to download</param>
    /// <returns>The document file</returns>
    /// <remarks>
    /// Only the document owner or employees can download.
    /// Returns the original file with proper content type.
    /// </remarks>
    /// <response code="200">Returns the document file</response>
    /// <response code="403">User not authorized to access this document</response>
    /// <response code="404">Document not found</response>
    [HttpGet("~/api/v1/applications/by-number/{applicationNumber}/documents/{documentId}/download")]
    [Authorize]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DownloadByApplicationNumberAsync([FromRoute] string applicationNumber, [FromRoute] Guid documentId)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role)!;
            var (content, contentType, fileName) = await _documentService.DownloadByApplicationNumberAsync(applicationNumber, documentId, userId, role);
            
            // Convert Stream to byte array for File result
            using var memoryStream = new MemoryStream();
            await content.CopyToAsync(memoryStream);
            return File(memoryStream.ToArray(), contentType, fileName);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, ApiResponse<object>.Fail(403, ex.Message));
        }
        catch (Exception ex)
        {
            return NotFound(ApiResponse<object>.Fail(404, ex.Message));
        }
    }

    /// <summary>
    /// Delete an un-approved document using application number.
    /// </summary>
    /// <param name="applicationNumber">The application number (e.g., MOJ-2026-22469742)</param>
    /// <param name="documentId">The document ID to delete</param>
    /// <returns>Success status</returns>
    /// <remarks>
    /// Only allows deletion when application status is 'Draft'.
    /// After submission, documents cannot be deleted.
    /// Uses soft delete - document is marked as deleted but not physically removed.
    /// </remarks>
    /// <response code="200">Document deleted successfully</response>
    /// <response code="403">Cannot delete after application submission</response>
    /// <response code="404">Document not found</response>
    [HttpDelete("~/api/v1/applications/by-number/{applicationNumber}/documents/{documentId}")]
    [Authorize(Roles = "Applicant,Receptionist")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteByApplicationNumberAsync([FromRoute] string applicationNumber, [FromRoute] Guid documentId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _documentService.DeleteByApplicationNumberAsync(applicationNumber, documentId, userId);
        return StatusCode(result.StatusCode, result);
    }

    // ==========================
    // Remaining endpoints
    // ==========================

    /// <summary>
    /// Bulk approve all pending documents for an application.
    /// </summary>
    /// <param name="applicationId">The application ID</param>
    /// <returns>Count of approved documents</returns>
    /// <remarks>
    /// Approves all documents with status 'Pending' in a single transaction.
    /// Only available for Receptionist, Manager, and Admin roles.
    /// </remarks>
    /// <response code="200">Returns approval count</response>
    /// <response code="403">User does not have permission</response>
    [HttpPatch("bulk-approve")]
    [Authorize(Roles = "Admin,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<BulkApproveResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> BulkApproveAsync(Guid applicationId)
    {
        var reviewerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _documentService.BulkApproveAsync(applicationId, reviewerId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Review (Approve or Reject) an uploaded document.
    /// </summary>
    /// <param name="applicationId">The application ID</param>
    /// <param name="documentId">The document ID to review</param>
    /// <param name="request">Review request with approval status and optional rejection reason</param>
    /// <returns>Updated document with review status</returns>
    /// <remarks>
    /// When rejecting, a rejection reason is required (max 1000 characters).
    /// Approved documents are immediately available to the applicant.
    /// </remarks>
    /// <response code="200">Document reviewed successfully</response>
    /// <response code="400">Rejection reason required when rejecting</response>
    /// <response code="403">User does not have permission</response>
    /// <response code="404">Document not found</response>
    [HttpPatch("{documentId}/review")]
    [Authorize(Roles = "Admin,Receptionist,Manager")]
    [ProducesResponseType(typeof(ApiResponse<DocumentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ReviewAsync(Guid applicationId, Guid documentId, [FromBody] DocumentReviewRequest request)
    {
        var reviewerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _documentService.ReviewAsync(documentId, request, reviewerId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Delete an un-approved document.
    /// </summary>
    /// <param name="applicationId">The application ID</param>
    /// <param name="documentId">The document ID to delete</param>
    /// <returns>Success status</returns>
    /// <remarks>
    /// Only allows deletion when application status is 'Draft'.
    /// After submission, documents cannot be deleted.
    /// Uses soft delete - document is marked as deleted but not physically removed.
    /// </remarks>
    /// <response code="200">Document deleted successfully</response>
    /// <response code="403">Cannot delete after application submission</response>
    /// <response code="404">Document not found</response>
    [HttpDelete("{documentId}")]
    [Authorize(Roles = "Applicant,Receptionist")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteAsync(Guid applicationId, Guid documentId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _documentService.DeleteAsync(documentId, userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Download a document's physical file securely.
    /// </summary>
    /// <param name="applicationId">The application ID</param>
    /// <param name="documentId">The document ID to download</param>
    /// <returns>The document file</returns>
    /// <remarks>
    /// Only the document owner or employees can download.
    /// Returns the original file with proper content type.
    /// </remarks>
    /// <response code="200">Returns the document file</response>
    /// <response code="403">User not authorized to access this document</response>
    /// <response code="404">Document not found</response>
    [HttpGet("{documentId}/download")]
    [Authorize]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DownloadAsync(Guid applicationId, Guid documentId)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role)!;
            var (content, contentType, fileName) = await _documentService.DownloadAsync(documentId, userId, role);
            
            // Convert Stream to byte array for File result
            using var memoryStream = new MemoryStream();
            await content.CopyToAsync(memoryStream);
            return File(memoryStream.ToArray(), contentType, fileName);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, ApiResponse<object>.Fail(403, ex.Message));
        }
        catch (Exception ex)
        {
            return NotFound(ApiResponse<object>.Fail(404, ex.Message));
        }
    }
}