using Mojaz.Application.DTOs.TestRetake;
using Mojaz.Shared;
using System;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface ITestRetakeService
{
    Task<ApiResponse<RetakeEligibilityDto>> CheckEligibilityAsync(Guid applicationId);
    Task<ApiResponse<bool>> RequestRetakeAsync(Guid applicationId, RetakeRequest request);
}