using Mojaz.Application.Dashboards.Dtos;
using Mojaz.Shared;

namespace Mojaz.Application.Interfaces.Services;

public interface IDashboardService
{
    Task<ApiResponse<DashboardSummaryDto>> GetApplicantDashboardAsync(Guid userId);
    Task<ApiResponse<ManagerKpiDto>> GetManagerDashboardAsync();
}
