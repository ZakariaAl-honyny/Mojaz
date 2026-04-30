using Mojaz.Application.DTOs.Training;
using Mojaz.Shared;

namespace Mojaz.Application.Interfaces
{
    public interface ITrainingService
    {
        Task<ApiResponse<TrainingRecordDto>> CreateAsync(CreateTrainingRecordRequest request);
        Task<ApiResponse<TrainingRecordDto>> GetByApplicationIdAsync(int applicationId, int? currentUserId = null, string? currentUserRole = null);
        Task<ApiResponse<PagedResult<TrainingRecordDto>>> GetAllAsync(int userId, string role, int page = 1, int pageSize = 20, string? search = null, string? status = null);
        Task<ApiResponse<TrainingRecordDto>> UpdateHoursAsync(int id, UpdateTrainingHoursRequest request);
        Task<ApiResponse<TrainingRecordDto>> CreateExemptionAsync(CreateExemptionRequest request);
        Task<ApiResponse<TrainingRecordDto>> ApproveExemptionAsync(int id, ExemptionActionRequest request);
        Task<ApiResponse<TrainingRecordDto>> RejectExemptionAsync(int id, ExemptionActionRequest request);
        Task<ApiResponse<bool>> IsTrainingCompleteAsync(int applicationId);
        Task<ApiResponse<List<TrainingRecordDto>>> GetPendingExemptionsAsync();
    }
}