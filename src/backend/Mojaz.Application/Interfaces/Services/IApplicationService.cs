using Mojaz.Application.DTOs.Application;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IApplicationService
{
    Task<ApiResponse<ApplicationDto>> CreateAsync(CreateApplicationRequest request, Guid userId);
    Task<ApiResponse<ApplicationDto>> CreateDraftAsync(ServiceType serviceType, Guid userId);
    Task<ApiResponse<ApplicationDto>> GetByIdAsync(Guid id, Guid userId, string role);
    Task<ApiResponse<ApplicationWizardDto>> GetWizardDataAsync(Guid id, Guid userId);
    Task<ApiResponse<ApplicationWizardDto>> UpdateWizardDataAsync(Guid id, UpdateWizardDataRequest request, Guid userId);
    Task<ApiResponse<PagedResult<ApplicationDto>>> GetListAsync(Guid userId, string role, int page = 1, int pageSize = 20, string? search = null, string? status = null);
    Task<ApiResponse<IEnumerable<ApplicationDto>>> GetByApplicationNumberAsync(string applicationNumber);
    Task<ApiResponse<bool>> UpdateAsync(Guid id, UpdateApplicationRequest request, Guid userId);
    Task<ApiResponse<bool>> CancelAsync(Guid id, string reason, Guid userId);
    Task<ApiResponse<bool>> UpdateStatusAsync(Guid id, ApplicationStatus status, string reason, Guid userId);
    Task<bool> IsOwnerAsync(Guid applicationId, Guid userId);
    Task<ApiResponse<List<LicenseCategoryDto>>> GetLicenseCategoriesAsync();
    
    // Upgrade & Replacement
    Task<ApiResponse<ApplicationDto>> CreateUpgradeApplicationAsync(UpgradeApplicationRequest request, Guid userId);
    Task<ApiResponse<ReplacementEligibilityResponse>> GetReplacementEligibilityAsync(Guid userId);
    Task<ApiResponse<ApplicationDto>> CreateReplacementApplicationAsync(ReplacementApplicationRequest request, Guid userId);
    
    // Queue for employee review
    Task<ApiResponse<PagedResult<ApplicationDto>>> GetQueueAsync(int page = 1, int pageSize = 20, string? search = null, string? stage = null);
    
    // Timeline
    Task<ApiResponse<ApplicationWorkflowTimelineDto>> GetTimelineAsync(Guid id);
}