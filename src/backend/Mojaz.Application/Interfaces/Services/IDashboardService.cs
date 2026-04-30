using Mojaz.Application.Dashboards.Dtos;
using Mojaz.Shared;

namespace Mojaz.Application.Interfaces.Services;

public interface IDashboardService
{
    Task<ApiResponse<DashboardSummaryDto>> GetApplicantDashboardAsync(int userId);
    Task<ApiResponse<ManagerKpiDto>> GetManagerDashboardAsync();
    Task<ApiResponse<AdminKpiDto>> GetAdminDashboardAsync();
    Task<ApiResponse<EmployeeDashboardDto>> GetEmployeeDashboardAsync(int userId);
    Task<ApiResponse<ReceptionistDashboardDto>> GetReceptionistDashboardAsync(int userId);
}
