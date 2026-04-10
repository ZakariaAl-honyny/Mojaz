using Mojaz.Application.DTOs.License;
using Mojaz.Shared;
using System;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface ILicenseService
{
    Task<ApiResponse<LicenseDto>> IssueLicenseAsync(Guid applicationId, Guid issuerId);
    Task<ApiResponse<LicenseDto>> GetByIdAsync(Guid id);
    Task<ApiResponse<LicenseDto>> GetByApplicationIdAsync(Guid applicationId);
}
