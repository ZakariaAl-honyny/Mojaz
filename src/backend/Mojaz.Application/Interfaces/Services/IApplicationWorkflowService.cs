using Mojaz.Application.DTOs.Application;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IApplicationWorkflowService
{
    Task<ApiResponse<bool>> AdvanceStageAsync(int applicationId, ApplicationStatus nextStatus, string notes, int userId);
    Task<ApiResponse<bool>> RejectAsync(int applicationId, string reason, int userId);
}
