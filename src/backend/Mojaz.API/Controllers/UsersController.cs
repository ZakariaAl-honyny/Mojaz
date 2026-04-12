using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Mojaz.Application.DTOs.User;
using Mojaz.Application.Services;
using Mojaz.Shared.Constants;
using Mojaz.Shared;

namespace Mojaz.API.Controllers;

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
    /// Create a new user (employee)
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<CreateUserResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateUserRequest request)
    {
        var result = await _userService.CreateUserAsync(request);
        return StatusCode(StatusCodes.Status201Created, new ApiResponse<CreateUserResponse>
        {
            Success = true,
            Message = "User created successfully",
            Data = result,
            StatusCode = StatusCodes.Status201Created
        });
    }

    /// <summary>
    /// Get all users
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<UserDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllAsync()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(new ApiResponse<IEnumerable<UserDto>>
        {
            Success = true,
            Data = users,
            StatusCode = StatusCodes.Status200OK
        });
    }

    /// <summary>
    /// Get user by ID
    /// </summary>
    [HttpGet("{userId}")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByIdAsync(Guid userId)
    {
        var user = await _userService.GetUserByIdAsync(userId);
        if (user == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "User not found",
                StatusCode = StatusCodes.Status404NotFound
            });
        }

        return Ok(new ApiResponse<UserDto>
        {
            Success = true,
            Data = user,
            StatusCode = StatusCodes.Status200OK
        });
    }

    /// <summary>
    /// Update user status (activate/deactivate)
    /// </summary>
    [HttpPatch("{userId}/status")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateStatusAsync(Guid userId, [FromBody] UpdateUserStatusRequest request)
    {
        await _userService.UpdateUserStatusAsync(userId, request.IsActive);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "User status updated",
            StatusCode = StatusCodes.Status200OK
        });
    }

    /// <summary>
    /// Update user role
    /// </summary>
    [HttpPatch("{userId}/role")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateRoleAsync(Guid userId, [FromBody] UpdateUserRoleRequest request)
    {
        await _userService.UpdateUserRoleAsync(userId, request.AppRole);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "User role updated",
            StatusCode = StatusCodes.Status200OK
        });
    }
}