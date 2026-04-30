using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Medical;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers
{
    /// <summary>
    /// Controller for medical examination operations
    /// </summary>
    [ApiController]
    [Route("api/v1/medical-exams")]
    [Authorize]
    [Produces("application/json")]
    public class MedicalExamsController : ControllerBase
    {
        private readonly IMedicalService _medicalService;
        private readonly IApplicationService _applicationService;

        public MedicalExamsController(IMedicalService medicalService, IApplicationService applicationService)
        {
            _medicalService = medicalService;
            _applicationService = applicationService;
        }

        /// <summary>
        /// Create a medical examination result for an application
        /// Route: api/v1/medical-exams/application/{appIdOrNumber}
        /// </summary>
        [HttpPost("application/{appIdOrNumber}")]
        [Authorize(Roles = "Doctor")]
        [ProducesResponseType(typeof(ApiResponse<MedicalResultDto>), StatusCodes.Status201Created)]
        public async Task<IActionResult> CreateMedicalExam(string appIdOrNumber, [FromBody] CreateMedicalResultRequest request)
        {
            var applicationId = await ResolveAppIdAsync(appIdOrNumber);
            if (applicationId == Guid.Empty)
                return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

            var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(nameIdentifier) || !Guid.TryParse(nameIdentifier, out var doctorId))
            {
                return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
            }

            // Ensure the request's ApplicationId matches the resolved one
            request.ApplicationId = applicationId;
            
            var result = await _medicalService.CreateMedicalResultAsync(request, doctorId);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Get medical examination result by application ID or Number
        /// Route: api/v1/medical-exams/application/{appIdOrNumber}
        /// </summary>
        [HttpGet("application/{appIdOrNumber}")]
        [ProducesResponseType(typeof(ApiResponse<MedicalResultDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByApplicationId(string appIdOrNumber)
        {
            var applicationId = await ResolveAppIdAsync(appIdOrNumber);
            if (applicationId == Guid.Empty)
                return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

            var result = await _medicalService.GetByApplicationIdAsync(applicationId);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Update medical examination result
        /// </summary>
        [HttpPatch("{id}/result")]
        [Authorize(Roles = "Doctor")]
        [ProducesResponseType(typeof(ApiResponse<MedicalResultDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateResult(Guid id, [FromBody] UpdateMedicalResultRequest request)
        {
            var result = await _medicalService.UpdateResultAsync(id, request.Result, request.Notes);
            return StatusCode(result.StatusCode, result);
        }

        private async Task<Guid> ResolveAppIdAsync(string appIdOrNumber)
        {
            if (string.IsNullOrWhiteSpace(appIdOrNumber)) return Guid.Empty;
            if (Guid.TryParse(appIdOrNumber.Trim(), out var id)) return id;

            var result = await _applicationService.GetByApplicationNumberAsync(appIdOrNumber.Trim());
            return result.Data?.FirstOrDefault()?.Id ?? Guid.Empty;
        }
    }

    public class UpdateMedicalResultRequest
    {
        public Mojaz.Domain.Enums.MedicalFitnessResult Result { get; set; }
        public string? Notes { get; set; }
    }
}