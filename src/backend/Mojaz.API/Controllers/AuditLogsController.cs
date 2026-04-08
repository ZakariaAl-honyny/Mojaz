using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.DTOs.Audit;
using Mojaz.Application.Services;
using Mojaz.Shared.Constants;
using Mojaz.Shared;

namespace Mojaz.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
[Authorize(Policy = RolePolicies.AdminOnly)]
public class AuditLogsController : ControllerBase
{
    private readonly IAuditLogService _auditLogService;

    public AuditLogsController(IAuditLogService auditLogService)
    {
        _auditLogService = auditLogService;
    }

    /// <summary>
    /// Get audit logs with filtering and pagination
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<AuditLogResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLogs([FromQuery] AuditLogQueryRequest request)
    {
        var result = await _auditLogService.GetAuditLogsAsync(request);
        return Ok(new ApiResponse<AuditLogResponse>
        {
            Success = true,
            Data = result,
            StatusCode = StatusCodes.Status200OK
        });
    }

    /// <summary>
    /// Get audit log by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<AuditLogDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var log = await _auditLogService.GetAuditLogByIdAsync(id);
        if (log == null)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Audit log not found",
                StatusCode = StatusCodes.Status404NotFound
            });
        }

        return Ok(new ApiResponse<AuditLogDto>
        {
            Success = true,
            Data = log,
            StatusCode = StatusCodes.Status200OK
        });
    }
}