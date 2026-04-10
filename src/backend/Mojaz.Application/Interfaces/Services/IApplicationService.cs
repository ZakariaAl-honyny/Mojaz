using Mojaz.Application.DTOs.Application;
using Mojaz.Application.Applications.Dtos;
using Mojaz.Application.DTOs.LicenseReplacement;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IApplicationService
{
    Task<ApiResponse<ApplicationDto>> CreateAsync(CreateApplicationRequest request, Guid userId);
    Task<ApiResponse<ApplicationDto>> GetByIdAsync(Guid id, Guid userId, string role);
    Task<ApiResponse<PagedResult<ApplicationDto>>> GetListAsync(Guid userId, string role, ApplicationFilterRequest filters);
    Task<ApiResponse<PagedResult<ApplicationSummaryDto>>> GetEmployeeQueueAsync(Guid userId, string role, ApplicationFilterRequest filters);
    Task<ApiResponse<ApplicationDto>> UpdateDraftAsync(Guid id, UpdateDraftRequest request, Guid userId);
    Task<ApiResponse<ApplicationDto>> SubmitAsync(Guid id, SubmitApplicationRequest request, Guid userId);
    Task<ApiResponse<bool>> UpdateStatusAsync(Guid id, ApplicationStatus status, string reason, Guid userId);
    Task<ApiResponse<bool>> CancelAsync(Guid id, string reason, Guid userId, string role);
    Task<ApiResponse<List<Mojaz.Application.DTOs.Application.ApplicationTimelineDto>>> GetTimelineAsync(Guid id, Guid userId, string role);
    Task<ApiResponse<ApplicationWorkflowTimelineDto>> GetWorkflowTimelineAsync(Guid id, Guid userId, string role);
    Task<ApiResponse<EligibilityCheckResult>> CheckEligibilityAsync(Guid userId, EligibilityCheckRequest request);
    Task<bool> IsOwnerAsync(Guid applicationId, Guid userId);
}
