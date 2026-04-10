using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Theory;
using Mojaz.Application.Interfaces;
using Mojaz.Shared;
using System;
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

        public TheoryTestsController(ITheoryService theoryService)
        {
            _theoryService = theoryService;
        }

        /// <summary>
        /// Submit a theory test result for an application
        /// </summary>
        [HttpPost("{appId}/result")]
        [Authorize(Roles = "Examiner")]
        [ProducesResponseType(typeof(ApiResponse<TheoryTestDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> SubmitResult(Guid appId, [FromBody] SubmitTheoryResultRequest request)
        {
            var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(nameIdentifier) || !Guid.TryParse(nameIdentifier, out var examinerId))
            {
                return Unauthorized(ApiResponse<object>.Fail(401, "Invalid user identification."));
            }

            var result = await _theoryService.SubmitResultAsync(appId, request, examinerId);
            return StatusCode(result.StatusCode, result);
        }

        /// <summary>
        /// Get all theory test attempts for an application
        /// </summary>
        [HttpGet("{appId}/history")]
        [ProducesResponseType(typeof(ApiResponse<PagedResult<TheoryTestDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetHistory(Guid appId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized(ApiResponse<object>.Fail(401, "User ID not found in token."));

            var role = User.FindFirstValue(ClaimTypes.Role) ?? "";
            var result = await _theoryService.GetHistoryAsync(appId, userId, role, page, pageSize);
            return StatusCode(result.StatusCode, result);
        }
    }
}