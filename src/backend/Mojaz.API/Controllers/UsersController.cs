using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Mojaz.Application.DTOs.User;
using Mojaz.Application.Services;
using Mojaz.Domain.Enums;
using Mojaz.Shared.Constants;
using Mojaz.Shared;
using System;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

/// <summary>
/// Manage users in the Mojaz platform.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
[Authorize(Policy = RolePolicies.AdminOnly)]
[EnableRateLimiting(SecurityConstants.Policies.GlobalRateLimit)]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// List all users (paginated).
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<UserDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetListAsync(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] AppRole? role = null)
    {
        var result = await _userService.GetUsersAsync(page, pageSize, search, role);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get a user by ID.
    /// </summary>
    [HttpGet("{userId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByIdAsync(Guid userId)
    {
        var result = await _userService.GetUserByIdAsync(userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Create a new user (admin only).
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<CreateUserResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateUserRequest request)
    {
        try
        {
            var result = await _userService.CreateUserAsync(request);
            return StatusCode(StatusCodes.Status201Created, ApiResponse<CreateUserResponse>.Created(result, "تم إنشاء المستخدم بنجاح"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(400, ex.Message));
        }
    }

    /// <summary>
    /// Activate or deactivate a user.
    /// </summary>
    [HttpPatch("{userId:guid}/status")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatusAsync(Guid userId, [FromBody] UpdateUserStatusRequest request)
    {
        try
        {
            await _userService.UpdateUserStatusAsync(userId, request.IsActive);
            return Ok(ApiResponse<bool>.Ok(true, request.IsActive ? "تم تفعيل المستخدم بنجاح" : "تم إلغاء تفعيل المستخدم بنجاح"));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ApiResponse<object>.NotFound(ex.Message));
        }
    }

    /// <summary>
    /// Update user role.
    /// </summary>
    [HttpPatch("{userId:guid}/role")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateRoleAsync(Guid userId, [FromBody] UpdateUserRoleRequest request)
    {
        try
        {
            await _userService.UpdateUserRoleAsync(userId, request.AppRole);
            return Ok(ApiResponse<bool>.Ok(true, "تم تحديث دور المستخدم بنجاح"));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ApiResponse<object>.NotFound(ex.Message));
        }
    }
}