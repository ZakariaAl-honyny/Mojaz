using Mojaz.Application.Reports.Dtos;
using Mojaz.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IReportService
{
    Task<ApiResponse<ReportSummaryDto>> GetDashboardSummaryAsync(ReportingFilter filter);
    Task<ApiResponse<List<StatusDistributionDto>>> GetStatusDistributionAsync(ReportingFilter filter);
    Task<ApiResponse<List<ServiceStatsDto>>> GetServiceStatsAsync(ReportingFilter filter);
    Task<ApiResponse<PagedResult<DelayedApplicationEntry>>> GetDelayedApplicationsAsync(ReportingFilter filter, int page = 1, int pageSize = 10);
    Task<ApiResponse<List<TestPerformanceDto>>> GetTestPerformanceAsync(ReportingFilter filter);
    Task<ApiResponse<List<BranchThroughputDto>>> GetBranchThroughputAsync(ReportingFilter filter);
    Task<ApiResponse<List<EmployeeActivityDto>>> GetEmployeeActivityAsync(ReportingFilter filter);
    Task<ApiResponse<List<DailyLoadDto>>> GetIssuanceTimelineAsync(ReportingFilter filter);
    Task<byte[]> ExportReportsToCsvAsync(ReportingFilter filter);
}
