using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mojaz.Application.Interfaces.Services;
using Mojaz.Application.Reports.Dtos;
using Mojaz.Shared.Constants;
using Mojaz.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
[Authorize(Roles = "Manager,Admin")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    /// <summary>
    /// Get reporting dashboard summary
    /// </summary>
    [HttpGet("summary")]
    [ProducesResponseType(typeof(ApiResponse<ReportSummaryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSummaryAsync([FromQuery] ReportingFilter filter)
    {
        var result = await _reportService.GetDashboardSummaryAsync(filter);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get status distribution data
    /// </summary>
    [HttpGet("status-distribution")]
    [ProducesResponseType(typeof(ApiResponse<List<StatusDistributionDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetStatusDistributionAsync([FromQuery] ReportingFilter filter)
    {
        var result = await _reportService.GetStatusDistributionAsync(filter);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get service distribution data
    /// </summary>
    [HttpGet("service-distribution")]
    [ProducesResponseType(typeof(ApiResponse<List<ServiceStatsDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetServiceDistributionAsync([FromQuery] ReportingFilter filter)
    {
        var result = await _reportService.GetServiceStatsAsync(filter);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get delayed applications list
    /// </summary>
    [HttpGet("delayed-applications")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<DelayedApplicationEntry>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDelayedApplicationsAsync([FromQuery] ReportingFilter filter, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _reportService.GetDelayedApplicationsAsync(filter, page, pageSize);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get test performance metrics
    /// </summary>
    [HttpGet("test-performance")]
    [ProducesResponseType(typeof(ApiResponse<List<TestPerformanceDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTestPerformanceAsync([FromQuery] ReportingFilter filter)
    {
        var result = await _reportService.GetTestPerformanceAsync(filter);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get branch throughput data
    /// </summary>
    [HttpGet("branch-throughput")]
    [ProducesResponseType(typeof(ApiResponse<List<BranchThroughputDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetBranchThroughputAsync([FromQuery] ReportingFilter filter)
    {
        var result = await _reportService.GetBranchThroughputAsync(filter);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get employee productivity metrics
    /// </summary>
    [HttpGet("employee-activity")]
    [ProducesResponseType(typeof(ApiResponse<List<EmployeeActivityDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetEmployeeActivityAsync([FromQuery] ReportingFilter filter)
    {
        var result = await _reportService.GetEmployeeActivityAsync(filter);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>
    /// Get issuance timeline trends
    /// </summary>
    [HttpGet("issuance-timeline")]
    [ProducesResponseType(typeof(ApiResponse<List<DailyLoadDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetIssuanceTimelineAsync([FromQuery] ReportingFilter filter)
    {
        var result = await _reportService.GetIssuanceTimelineAsync(filter);
        return StatusCode(result.StatusCode, result);
    }
    /// <summary>
    /// Export reports data to CSV
    /// </summary>
    [HttpGet("export-csv")]
    [Produces("text/csv")]
    public async Task<IActionResult> ExportCsvAsync([FromQuery] ReportingFilter filter)
    {
        var csvBytes = await _reportService.ExportReportsToCsvAsync(filter);
        return File(csvBytes, "text/csv", $"mojaz-report-{DateTime.UtcNow:yyyyMMddHHmmss}.csv");
    }
}
