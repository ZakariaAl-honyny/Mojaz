using Mojaz.Application.DTOs.Application;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using System;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IApplicationWorkflowService
{
    Task<ApiResponse<bool>> AdvanceStageAsync(Guid applicationId, ApplicationStatus nextStatus, string notes, Guid userId);
    Task<ApiResponse<bool>> RejectAsync(Guid applicationId, string reason, Guid userId);
}
