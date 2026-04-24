using Mojaz.Application.Dashboards.Dtos;
using Mojaz.Shared;

namespace Mojaz.Application.Interfaces.Services;

public interface IDashboardService
{
    Task<ApiResponse<DashboardSummaryDto>> GetApplicantDashboardAsync(Guid userId);
    Task<ApiResponse<ManagerKpiDto>> GetManagerDashboardAsync();
    Task<ApiResponse<AdminKpiDto>> GetAdminDashboardAsync();
    Task<ApiResponse<EmployeeDashboardDto>> GetEmployeeDashboardAsync(Guid userId);
    Task<ApiResponse<ReceptionistDashboardDto>> GetReceptionistDashboardAsync(Guid userId);
}
