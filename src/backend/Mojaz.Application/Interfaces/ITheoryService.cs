using Mojaz.Application.DTOs.Theory;
using Mojaz.Shared;
using System;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces
{
    public interface ITheoryService
    {
        Task<ApiResponse<TheoryTestDto>> SubmitResultAsync(Guid applicationId, SubmitTheoryResultRequest request, Guid examinerId);
        Task<ApiResponse<PagedResult<TheoryTestDto>>> GetHistoryAsync(Guid applicationId, Guid userId, string role, int page = 1, int pageSize = 10);
        Task<bool> IsInCoolingPeriodAsync(Guid applicationId);
        Task<bool> HasReachedMaxAttemptsAsync(Guid applicationId);
    }
}
