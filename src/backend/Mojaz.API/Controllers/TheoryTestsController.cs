using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Theory;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Interfaces;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers
{
    [ApiController]
    [Route("api/v1/theory-tests")]
    [Authorize]
    [Produces("application/json")]
    public class TheoryTestsController : ControllerBase
    {
        private readonly ITheoryService _theoryService;
        private readonly IApplicationService _applicationService;

        public TheoryTestsController(ITheoryService theoryService, IApplicationService applicationService)
        {
            _theoryService = theoryService;
            _applicationService = applicationService;
        }

        /// <summary> submit a theory test result for an application
        /// Route: api/v1/theory-tests/application/{appIdOrNumber}/result
        /// </summary>
        [HttpPost("application/{appIdOrNumber}/result")]
        [Authorize(Roles = "Examiner")]
        [ProducesResponseType(typeof(ApiResponse<TheoryTestDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> SubmitResult(string appIdOrNumber, [FromBody] SubmitTheoryResultRequest request)
        {
            var appId = await ResolveAppIdAsync(appIdOrNumber);
            if (appId == 0)
                return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

            var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(nameIdentifier) || !int.TryParse(nameIdentifier, out var examinerId))
            {
                return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
            }

            var result = await _theoryService.SubmitResultAsync(appId, request, examinerId);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Get all theory test attempts for an application
        /// Route: api/v1/theory-tests/application/{appIdOrNumber}/history
        /// </summary>
        [HttpGet("application/{appIdOrNumber}/history")]
        [Authorize(Roles = "Applicant,Receptionist,Doctor,Examiner,Manager,Security,Admin,SuperAdmin,Support")]
        [ProducesResponseType(typeof(ApiResponse<PagedResult<TheoryTestDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetHistory(string appIdOrNumber, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var appId = await ResolveAppIdAsync(appIdOrNumber);
            if (appId == 0)
                return NotFound(ApiResponse<object>.Fail(404, "Application not found."));

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var userId))
                return Unauthorized(ApiResponse<object>.Fail(401, "User ID not found in token."));

            var role = User.FindFirstValue(ClaimTypes.Role) ?? "";
            var result = await _theoryService.GetHistoryAsync(appId, userId, role, page, pageSize);
            return StatusCode(result.StatusCode, result);
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