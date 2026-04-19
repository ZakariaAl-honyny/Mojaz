using DrivingLicenseIssuanceSystem.Application.DTOs.License;
using DrivingLicenseIssuanceSystem.Shared;
using System;
using System.Threading.Tasks;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Services;

public interface ILicenseService
{
    Task<ApiResponse<LicenseDto>> IssueLicenseAsync(Guid applicationId, Guid issuerId);
    Task<ApiResponse<LicenseDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<LicenseDto>> GetByApplicationIdAsync(Guid applicationId);
    Task<ApiResponse<List<LicenseDto>>> GetUserLicensesAsync(Guid userId);
    Task<ApiResponse<List<UpgradeTargetCategoryDto>>> GetUpgradeTargetsAsync(Guid licenseId);
}
