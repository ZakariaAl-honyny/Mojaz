using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Medical;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared;
using System;
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

        public MedicalExamsController(IMedicalService medicalService)
        {
            _medicalService = medicalService;
        }

        /// <summary>
        /// Create a medical examination result for an application
        /// </summary>
        /// <param name="request">Medical exam result details</param>
        /// <returns>Created medical exam result</returns>
        [HttpPost]
        [Authorize(Roles = "Doctor")]
        [ProducesResponseType(typeof(ApiResponse<MedicalResultDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CreateMedicalExam([FromBody] CreateMedicalResultRequest request)
        {
            var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(nameIdentifier) || !Guid.TryParse(nameIdentifier, out var doctorId))
            {
                return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
            }

            var result = await _medicalService.CreateMedicalResultAsync(request, doctorId);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Get medical examination result by application ID
        /// </summary>
        /// <param name="applicationId">Application identifier</param>
        /// <returns>Medical exam result for the application</returns>
        [HttpGet("{applicationId}")]
        [ProducesResponseType(typeof(ApiResponse<MedicalResultDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetByApplicationId(Guid applicationId)
        {
            var result = await _medicalService.GetByApplicationIdAsync(applicationId);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Update medical examination result
        /// </summary>
        /// <param name="id">Medical exam identifier</param>
        /// <param name="request">Updated result details</param>
        /// <returns>Updated medical exam result</returns>
        [HttpPatch("{id}/result")]
        [Authorize(Roles = "Doctor")]
        [ProducesResponseType(typeof(ApiResponse<MedicalResultDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateResult(Guid id, [FromBody] UpdateMedicalResultRequest request)
        {
            var result = await _medicalService.UpdateResultAsync(id, request.Result, request.Notes);
            return StatusCode(result.StatusCode, result);
        }
    }

    /// <summary>
    /// Request model for updating medical exam result
    /// </summary>
    public class UpdateMedicalResultRequest
    {
        public Mojaz.Domain.Enums.MedicalFitnessResult Result { get; set; }
        public string? Notes { get; set; }
    }
}