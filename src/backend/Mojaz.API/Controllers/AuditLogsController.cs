using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Shared;

namespace Mojaz.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize(Roles = "Admin")]
public class AuditLogsController : ControllerBase
{
    private readonly IAuditService _auditService;

    public AuditLogsController(IAuditService auditService)
    {
        _auditService = auditService;
    }

    [HttpGet]
    public async Task<IActionResult> GetLogs([FromQuery] string? entityType = null, [FromQuery] string? entityId = null)
    {
        var logs = await _auditService.GetLogsAsync(entityType, entityId);
        return Ok(ApiResponse<IEnumerable<Mojaz.Domain.Entities.AuditLog>>.Ok(logs));
    }
}
