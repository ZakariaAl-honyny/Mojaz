using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.SystemSettings;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Constants;
using Mojaz.Shared;

namespace Mojaz.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
[Authorize(Policy = RolePolicies.AdminOnly)]
public class SettingsController : ControllerBase
{
    private readonly ISystemSettingsService _settingsService;
    private readonly IUnitOfWork _unitOfWork;

    public SettingsController(ISystemSettingsService settingsService, IUnitOfWork unitOfWork)
    {
        _settingsService = settingsService;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Get all system settings
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<SystemSettingDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllAsync()
    {
        var settings = await _settingsService.GetAllAsync();
        return Ok(new ApiResponse<IEnumerable<SystemSettingDto>>
        {
            Success = true,
            Data = settings,
            StatusCode = StatusCodes.Status200OK
        });
    }

    /// <summary>
    /// Update a system setting
    /// </summary>
    [HttpPut("{key}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAsync(string key, [FromBody] UpdateSettingRequest request)
    {
        var result = await _settingsService.UpdateAsync(key, request.Value);
        if (!result)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Setting not found",
                StatusCode = StatusCodes.Status404NotFound
            });
        }

        await _unitOfWork.SaveChangesAsync();
        
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Setting updated successfully",
            StatusCode = StatusCodes.Status200OK
        });
    }
}