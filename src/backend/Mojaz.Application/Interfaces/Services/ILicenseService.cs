using Mojaz.Application.DTOs.License;
using Mojaz.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface ILicenseService
{
    Task<ApiResponse<LicenseDto>> IssueLicenseAsync(int applicationId, int issuerId);
    Task<ApiResponse<LicenseDto>> GetByIdAsync(int id, int userId, string role);
    Task<ApiResponse<LicenseDto>> GetByApplicationIdAsync(int applicationId, int userId, string role);
    Task<ApiResponse<List<LicenseDto>>> GetUserLicensesAsync(int userId, string role);
    Task<ApiResponse<List<UpgradeTargetCategoryDto>>> GetUpgradeTargetsAsync(int licenseId);
}