using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Training;
using Mojaz.Application.Interfaces;
using Mojaz.Shared;
using System;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize]
    public class TrainingController : ControllerBase
    {
        private readonly ITrainingService _trainingService;

        public TrainingController(ITrainingService trainingService)
        {
            _trainingService = trainingService;
        }

        [HttpPost]
        [Authorize(Roles = "Examiner,Receptionist,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateTrainingRecordRequest request)
        {
            var result = await _trainingService.CreateAsync(request);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("application/{applicationId}")]
        public async Task<IActionResult> GetByApplicationId(Guid applicationId)
        {
            var result = await _trainingService.GetByApplicationIdAsync(applicationId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPatch("{id}/hours")]
        [Authorize(Roles = "Examiner,Admin")]
        public async Task<IActionResult> UpdateHours(Guid id, [FromBody] UpdateTrainingHoursRequest request)
        {
            var result = await _trainingService.UpdateHoursAsync(id, request);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("exemption")]
        [Authorize(Roles = "Applicant,Receptionist,Admin")]
        public async Task<IActionResult> RequestExemption([FromBody] CreateExemptionRequest request)
        {
            var result = await _trainingService.CreateExemptionAsync(request);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPatch("{id}/exemption/approve")]
        [Authorize(Roles = "Manager,Admin")]
        public async Task<IActionResult> ApproveExemption(Guid id, [FromBody] ExemptionActionRequest request)
        {
             // Note: In a real scenario, ActionBy should come from the current user claims
            var result = await _trainingService.ApproveExemptionAsync(id, request);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPatch("{id}/exemption/reject")]
        [Authorize(Roles = "Manager,Admin")]
        public async Task<IActionResult> RejectExemption(Guid id, [FromBody] ExemptionActionRequest request)
        {
            var result = await _trainingService.RejectExemptionAsync(id, request);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("application/{applicationId}/status")]
        public async Task<IActionResult> GetStatus(Guid applicationId)
        {
            var result = await _trainingService.IsTrainingCompleteAsync(applicationId);
            return StatusCode(result.StatusCode, result);
        }
    }
}
