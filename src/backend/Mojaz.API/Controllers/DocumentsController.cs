using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Document;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers
{
    [ApiController]
    [Route("api/v1/documents")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public class DocumentsController : ControllerBase
    {
        private readonly IDocumentService _documentService;
        private readonly IApplicationService _applicationService;

        public DocumentsController(IDocumentService documentService, IApplicationService applicationService)
        {
            _documentService = documentService;
            _applicationService = applicationService;
        }

        /// <summary>
        /// Upload a required document for an application.
        /// Route: api/v1/documents/application/{appIdOrNumber}/upload
        /// </summary>
        [HttpPost("application/{appIdOrNumber}/upload")]
        [Authorize(Roles = "Applicant,Receptionist")]
        [ProducesResponseType(typeof(ApiResponse<DocumentDto>), StatusCodes.Status201Created)]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadAsync(string appIdOrNumber, [FromForm] UploadDocumentRequest request)
        {
            var applicationId = await ResolveAppIdAsync(appIdOrNumber);
            if (applicationId == 0)
                return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _documentService.UploadAsync(applicationId, request, userId);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// List all documents for a specific application.
        /// Route: api/v1/documents/application/{appIdOrNumber}
        /// </summary>
        [HttpGet("application/{appIdOrNumber}")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<DocumentDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByApplicationIdAsync(string appIdOrNumber)
        {
            var applicationId = await ResolveAppIdAsync(appIdOrNumber);
            if (applicationId == 0)
                return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role)!;
            var result = await _documentService.GetByApplicationIdAsync(applicationId, userId, role);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Get document requirements for an application.
        /// Route: api/v1/documents/application/{appIdOrNumber}/requirements
        /// </summary>
        [HttpGet("application/{appIdOrNumber}/requirements")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<DocumentRequirementDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetRequirementsAsync(string appIdOrNumber)
        {
            var applicationId = await ResolveAppIdAsync(appIdOrNumber);
            if (applicationId == 0)
                return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role)!;
            var result = await _documentService.GetRequirementsAsync(applicationId, userId, role);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Bulk approve all pending documents for an application.
        /// Route: api/v1/documents/application/{appIdOrNumber}/bulk-approve
        /// </summary>
        [HttpPatch("application/{appIdOrNumber}/bulk-approve")]
        [Authorize(Roles = "Receptionist,Manager")]
        [ProducesResponseType(typeof(ApiResponse<BulkApproveResponse>), StatusCodes.Status200OK)]
        public async Task<IActionResult> BulkApproveAsync(string appIdOrNumber)
        {
            var applicationId = await ResolveAppIdAsync(appIdOrNumber);
            if (applicationId == 0)
                return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

            var reviewerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _documentService.BulkApproveAsync(applicationId, reviewerId);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Review (Approve or Reject) an uploaded document.
        /// Route: api/v1/documents/application/{appIdOrNumber}/review/{documentId}
        /// </summary>
        [HttpPatch("application/{appIdOrNumber}/review/{documentId}")]
        [Authorize(Roles = "Receptionist,Manager")]
        [ProducesResponseType(typeof(ApiResponse<DocumentDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ReviewAsync(string appIdOrNumber, int documentId, [FromBody] DocumentReviewRequest request)
        {
            var reviewerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _documentService.ReviewAsync(documentId, request, reviewerId);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Delete an un-approved document.
        /// </summary>
        [HttpDelete("{documentId}")]
        [Authorize(Roles = "Applicant,Receptionist")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteAsync(int documentId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _documentService.DeleteAsync(documentId, userId);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Request missing documents from applicant - notifies them about required documents.
        /// Route: api/v1/documents/application/{appIdOrNumber}/request-missing
        /// </summary>
        [HttpPost("application/{appIdOrNumber}/request-missing")]
        [Authorize(Roles = "Admin,Receptionist,Manager")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RequestMissingDocumentsAsync(string appIdOrNumber, [FromBody] RequestMissingDocumentsRequest request)
        {
            var applicationId = await ResolveAppIdAsync(appIdOrNumber);
            if (applicationId == 0)
                return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

            var deadline = request.Deadline ?? DateTime.UtcNow.AddDays(7);
            var result = await _documentService.NotifyMissingDocumentsAsync(
                applicationId, 
                request.MissingDocumentsAr, 
                request.MissingDocumentsEn, 
                deadline);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Download a document's physical file securely.
        /// </summary>
        [HttpGet("{documentId}/download")]
        [Authorize]
        [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DownloadAsync(int documentId)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var role = User.FindFirstValue(ClaimTypes.Role)!;
                var (content, contentType, fileName) = await _documentService.DownloadAsync(documentId, userId, role);
                
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

        private async Task<int> ResolveAppIdAsync(string appIdOrNumber)
        {
            if (string.IsNullOrWhiteSpace(appIdOrNumber)) return 0;
            if (int.TryParse(appIdOrNumber.Trim(), out var id)) return id;

            var result = await _applicationService.GetByApplicationNumberAsync(appIdOrNumber.Trim());
            return result.Data?.FirstOrDefault()?.Id ?? 0;
        }
    }
}