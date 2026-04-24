using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.SystemSettings;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Interfaces;
using Mojaz.Shared.Constants;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

/// <summary>
/// Manage system settings for the Mojaz platform.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly ISystemSettingsService _settingsService;
    private readonly IRepository<SystemSetting> _settingsRepository;
    private readonly IRepository<AuditLog> _auditLogRepository;
    private readonly IUnitOfWork _unitOfWork;

    public SettingsController(
        ISystemSettingsService settingsService,
        IRepository<SystemSetting> settingsRepository,
        IRepository<AuditLog> auditLogRepository,
        IUnitOfWork unitOfWork)
    {
        _settingsService = settingsService;
        _settingsRepository = settingsRepository;
        _auditLogRepository = auditLogRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Get all system settings (paginated).
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<SystemSettingDto>>), 200)]
    public async Task<IActionResult> GetAllAsync(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        [FromQuery] string? category = null,
        [FromQuery] string? search = null)
    {
        var allSettings = await _settingsService.GetAllAsync();
        var query = allSettings.ToList();

        // Filter by category if provided
        if (!string.IsNullOrEmpty(category))
        {
            var settings = await _settingsRepository.FindAsync(s => s.Category == category);
            var settingKeys = settings.Select(s => s.SettingKey).ToHashSet();
            query = query.Where(s => settingKeys.Contains(s.Key)).ToList();
        }

        // Filter by search if provided
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(s =>
                s.Key.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                (s.Description?.Contains(search, StringComparison.OrdinalIgnoreCase) ?? false)
            ).ToList();
        }

        // Calculate pagination
        var totalCount = query.Count;
        var pagedItems = query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var result = new PagedResult<SystemSettingDto>
        {
            Items = pagedItems,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };

        return Ok(ApiResponse<PagedResult<SystemSettingDto>>.Ok(result, "تم استرجاع إعدادات النظام بنجاح."));
    }

    /// <summary>
    /// Get a single system setting by key.
    /// </summary>
    [HttpGet("{key}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<SystemSettingDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetByKeyAsync(string key)
    {
        var value = await _settingsService.GetAsync(key);
        if (value == null)
        {
            return NotFound(ApiResponse<SystemSettingDto>.NotFound($"الإعداد '{key}' غير موجود."));
        }

        var settings = await _settingsRepository.FindAsync(s => s.SettingKey == key);
        var setting = settings.FirstOrDefault();

        var dto = new SystemSettingDto
        {
            Key = key,
            Value = value,
            Description = setting?.Description,
            UpdatedAt = setting?.UpdatedAt
        };

        return Ok(ApiResponse<SystemSettingDto>.Ok(dto, "تم استرجاع الإعداد بنجاح."));
    }

    /// <summary>
    /// Update a system setting value.
    /// </summary>
    [HttpPut("{key}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<UpdateSettingResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> UpdateAsync(string key, [FromBody] UpdateSettingRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Check if setting exists
        var settings = await _settingsRepository.FindAsync(s => s.SettingKey == key);
        var existingSetting = settings.FirstOrDefault();

        if (existingSetting == null)
        {
            return NotFound(ApiResponse<UpdateSettingResponse>.NotFound($"الإعداد '{key}' غير موجود."));
        }

        // Store old value for audit
        var oldValue = existingSetting.SettingValue;

        // Update the setting
        var success = await _settingsService.UpdateAsync(key, request.Value);
        if (!success)
        {
            return BadRequest(ApiResponse<UpdateSettingResponse>.Fail(400, "فشل في تحديث الإعداد."));
        }

        await _unitOfWork.SaveChangesAsync();

        // Log the change in audit log
        await LogSettingChangeAsync(userId, "Update", key, oldValue, request.Value);

        var response = new UpdateSettingResponse
        {
            Key = key,
            Value = request.Value,
            UpdatedAt = DateTime.UtcNow
        };

        return Ok(ApiResponse<UpdateSettingResponse>.Ok(response, "تم تحديث الإعداد بنجاح."));
    }

    /// <summary>
    /// Reset a system setting to its default value.
    /// </summary>
    [HttpDelete("{key}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<UpdateSettingResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> ResetAsync(string key)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Check if setting exists
        var settings = await _settingsRepository.FindAsync(s => s.SettingKey == key);
        var existingSetting = settings.FirstOrDefault();

        if (existingSetting == null)
        {
            return NotFound(ApiResponse<UpdateSettingResponse>.NotFound($"الإعداد '{key}' غير موجود."));
        }

        // Store old value for audit
        var oldValue = existingSetting.SettingValue;

        // Get default value - in practice, you'd store this in the entity or look it up
        // For now, we set to empty string as reset
        var defaultValue = string.Empty;

        // Update the setting to default
        var success = await _settingsService.UpdateAsync(key, defaultValue);
        if (!success)
        {
            return BadRequest(ApiResponse<UpdateSettingResponse>.Fail(400, "فشل في إعادة تعيين الإعداد."));
        }

        await _unitOfWork.SaveChangesAsync();

        // Log the change in audit log
        await LogSettingChangeAsync(userId, "Reset", key, oldValue, defaultValue);

        var response = new UpdateSettingResponse
        {
            Key = key,
            Value = defaultValue,
            UpdatedAt = DateTime.UtcNow
        };

        return Ok(ApiResponse<UpdateSettingResponse>.Ok(response, "تم إعادة تعيين الإعداد للقيمة الافتراضية."));
    }

    /// <summary>
    /// Helper method to log setting changes to audit log.
    /// </summary>
    private async Task LogSettingChangeAsync(Guid userId, string action, string key, string oldValue, string newValue)
    {
        try
        {
            var auditLog = new AuditLog
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ActionType = action,
                ActionCategory = "Settings",
                EntityName = "SystemSetting",
                EntityId = key,
                Payload = System.Text.Json.JsonSerializer.Serialize(new
                {
                    Key = key,
                    OldValue = oldValue,
                    NewValue = newValue,
                    ChangedAt = DateTime.UtcNow
                }),
                Timestamp = DateTime.UtcNow,
                IsSuccess = true
            };

            await _auditLogRepository.AddAsync(auditLog);
            await _unitOfWork.SaveChangesAsync();
        }
        catch
        {
            // Don't fail the main operation if audit logging fails
            // In production, use proper logging
        }
    }
}