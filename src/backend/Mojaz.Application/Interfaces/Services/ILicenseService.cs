using Mojaz.Application.DTOs.License;
using Mojaz.Shared;
using System;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface ILicenseService
{
    Task<ApiResponse<LicenseDto>> IssueLicenseAsync(Guid applicationId, Guid issuerId);
    Task<ApiResponse<LicenseDto>> GetByIdAsync(Guid id, Guid userId, string role);
    Task<ApiResponse<LicenseDto>> GetByApplicationIdAsync(Guid applicationId, Guid userId, string role);
    Task<ApiResponse<List<LicenseDto>>> GetUserLicensesAsync(Guid userId, string role);
    Task<ApiResponse<List<UpgradeTargetCategoryDto>>> GetUpgradeTargetsAsync(Guid licenseId);
}
