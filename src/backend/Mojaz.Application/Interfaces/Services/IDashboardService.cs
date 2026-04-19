using DrivingLicenseIssuanceSystem.Application.Dashboards.Dtos;
using DrivingLicenseIssuanceSystem.Shared;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Services;

public interface IDashboardService
{
    Task<ApiResponse<DashboardSummaryDto>> GetApplicantDashboardAsync(Guid userId);
    Task<ApiResponse<ManagerKpiDto>> GetManagerDashboardAsync();
}
