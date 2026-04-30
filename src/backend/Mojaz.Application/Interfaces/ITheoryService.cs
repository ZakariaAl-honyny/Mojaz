using Mojaz.Application.DTOs.Theory;
using Mojaz.Shared;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces
{
    public interface ITheoryService
    {
        Task<ApiResponse<TheoryTestDto>> SubmitResultAsync(int applicationId, SubmitTheoryResultRequest request, int examinerId);
        Task<ApiResponse<PagedResult<TheoryTestDto>>> GetHistoryAsync(int applicationId, int userId, string role, int page = 1, int pageSize = 10);
        Task<ApiResponse<PagedResult<TheoryTestDto>>> GetHistoryByApplicationNumberAsync(string applicationNumber, int userId, string role, int page = 1, int pageSize = 10);
        Task<bool> IsInCoolingPeriodAsync(int applicationId);
        Task<bool> HasReachedMaxAttemptsAsync(int applicationId);
        Task<bool> IsTheoryExemptForUpgradeAsync(int applicationId);
    }
}
