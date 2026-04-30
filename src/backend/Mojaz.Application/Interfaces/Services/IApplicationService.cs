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
    Task<ApiResponse<ApplicationWizardDto>> GetWizardDataAsync(Guid id, Guid userId, string role);
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
    
    // Workflow actions
    Task<ApiResponse<bool>> SubmitAsync(Guid id, Guid userId);
    Task<ApiResponse<bool>> ApproveAsync(Guid id, string reason, Guid userId);
    Task<ApiResponse<bool>> RejectAsync(Guid id, string reason, Guid userId);
    Task<ApiResponse<bool>> MarkAsPaidAsync(Guid id, Guid userId);
    
    // Timeline
    Task<ApiResponse<ApplicationWorkflowTimelineDto>> GetTimelineAsync(Guid id);
    
    // Security Verification (Gate 4)
    Task<ApiResponse<PagedResult<ApplicationDto>>> GetSecurityPendingQueueAsync(int page = 1, int pageSize = 20, string? search = null);
    Task<ApiResponse<bool>> RecordSecurityVerificationAsync(Guid id, SecurityVerificationRequest request, Guid userId);

    // Medical Exam Queue (Stage 4)
    Task<ApiResponse<PagedResult<ApplicationDto>>> GetMedicalPendingQueueAsync(int page = 1, int pageSize = 20, string? search = null);

    // Receptionist Forward Actions
    Task<ApiResponse<bool>> ForwardToMedicalAsync(Guid id, Guid userId);
    Task<ApiResponse<bool>> ForwardToTrainingAsync(Guid id, Guid userId);
    Task<ApiResponse<EligibilityResponseDto>> CheckEligibilityAsync(Guid userId, LicenseCategoryCode categoryCode, ServiceType serviceType);
    
    // Staff Assignment
    Task<ApiResponse<bool>> AssignAsync(Guid id, AssignApplicationRequest request, Guid userId);
}