using Mojaz.Application.DTOs.TestRetake;
using Mojaz.Shared;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface ITestRetakeService
{
    Task<ApiResponse<RetakeEligibilityDto>> CheckEligibilityAsync(int applicationId);
    Task<ApiResponse<bool>> RequestRetakeAsync(int applicationId, RetakeRequest request);
}