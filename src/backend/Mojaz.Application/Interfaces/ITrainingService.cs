using Mojaz.Application.DTOs.Training;
using Mojaz.Shared;

namespace Mojaz.Application.Interfaces
{
    public interface ITrainingService
    {
        Task<ApiResponse<TrainingRecordDto>> CreateAsync(CreateTrainingRecordRequest request);
        Task<ApiResponse<TrainingRecordDto>> GetByApplicationIdAsync(Guid applicationId, Guid? currentUserId = null, string? currentUserRole = null);
        Task<ApiResponse<TrainingRecordDto>> UpdateHoursAsync(Guid id, UpdateTrainingHoursRequest request);
        Task<ApiResponse<TrainingRecordDto>> CreateExemptionAsync(CreateExemptionRequest request);
        Task<ApiResponse<TrainingRecordDto>> ApproveExemptionAsync(Guid id, ExemptionActionRequest request);
        Task<ApiResponse<TrainingRecordDto>> RejectExemptionAsync(Guid id, ExemptionActionRequest request);
        Task<ApiResponse<bool>> IsTrainingCompleteAsync(Guid applicationId);
    }
}