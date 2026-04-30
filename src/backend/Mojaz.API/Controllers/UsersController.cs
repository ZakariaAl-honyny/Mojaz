using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Mojaz.Application.DTOs.User;
using Mojaz.Application.Services;
using Mojaz.Domain.Enums;
using Mojaz.Shared.Constants;
using Mojaz.Shared;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

/// <summary>
/// Manage users in the Mojaz platform.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
[Authorize]
[EnableRateLimiting(SecurityConstants.Policies.GlobalRateLimit)]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Get the current authenticated user's profile.
    /// </summary>
    [HttpGet("me")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMeAsync()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(ApiResponse<UserDto>.Fail(401, "غير مصرح بالدخول"));
        }

        var result = await _userService.GetCurrentUserAsync(userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Update the current authenticated user's profile.
    /// </summary>
    [HttpPatch("me")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateMeAsync([FromBody] UpdateMeRequest request)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(ApiResponse<UserDto>.Fail(401, "غير مصرح بالدخول"));
        }

        var result = await _userService.UpdateCurrentUserAsync(userId, request);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// List all users (paginated).
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Admin,Manager")]
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
    [HttpGet("{userId:int}")]
    [Authorize(Policy = RolePolicies.AdminOnly)]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByIdAsync(int userId)
    {
        var result = await _userService.GetUserByIdAsync(userId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Create a new user (admin only).
    /// </summary>
    [HttpPost]
    [Authorize(Policy = RolePolicies.AdminOnly)]
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
    [HttpPatch("{userId:int}/status")]
    [Authorize(Policy = RolePolicies.AdminOnly)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatusAsync(int userId, [FromBody] UpdateUserStatusRequest request)
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
    [HttpPatch("{userId:int}/role")]
    [Authorize(Policy = RolePolicies.AdminOnly)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateRoleAsync(int userId, [FromBody] UpdateUserRoleRequest request)
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

    /// <summary>
    /// Unlock a locked user account. Resets failed attempts and removes lockout.
    /// </summary>
    [HttpPost("{userId:int}/unlock")]
    [Authorize(Policy = RolePolicies.AdminOnly)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UnlockUserAsync(int userId)
    {
        try
        {
            await _userService.UnlockUserAsync(userId);
            return Ok(ApiResponse<bool>.Ok(true, "تم إلغاء قفل الحساب بنجاح"));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ApiResponse<object>.NotFound(ex.Message));
        }
    }

    /// <summary>
    /// Set or remove security block on a user account.
    /// </summary>
    [HttpPatch("{userId:int}/security-block")]
    [Authorize(Roles = "Admin,Security")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SetSecurityBlockAsync(int userId, [FromBody] SecurityBlockRequest request)
    {
        var result = await _userService.SetSecurityBlockAsync(userId, request.IsBlocked, request.Reason);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Soft delete a user. Sets IsDeleted=true and IsActive=false.
    /// </summary>
    [HttpDelete("{userId:int}")]
    [Authorize(Policy = RolePolicies.AdminOnly)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteAsync(int userId)
    {
        var result = await _userService.DeleteUserAsync(userId);
        return StatusCode(result.StatusCode, result);
    }
}