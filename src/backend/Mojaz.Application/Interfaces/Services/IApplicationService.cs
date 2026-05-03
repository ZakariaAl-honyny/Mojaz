using Mojaz.Application.DTOs.Application;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

public interface IApplicationService
{
    Task<ApiResponse<ApplicationDto>> CreateAsync(CreateApplicationRequest request, int userId);
    Task<ApiResponse<ApplicationDto>> CreateDraftAsync(ServiceType serviceType, int userId);
    Task<ApiResponse<ApplicationDto>> GetByIdAsync(int id, int userId, string role);
    Task<ApiResponse<ApplicationWizardDto>> GetWizardDataAsync(int id, int userId, string role);
    Task<ApiResponse<ApplicationWizardDto>> UpdateWizardDataAsync(int id, UpdateWizardDataRequest request, int userId);
    Task<ApiResponse<PagedResult<ApplicationDto>>> GetListAsync(int userId, string role, int page = 1, int pageSize = 20, string? search = null, string? status = null);
    Task<ApiResponse<IEnumerable<ApplicationDto>>> GetByApplicationNumberAsync(string applicationNumber);
    Task<ApiResponse<bool>> UpdateAsync(int id, UpdateApplicationRequest request, int userId);
    Task<ApiResponse<bool>> CancelAsync(int id, string reason, int userId);
    Task<ApiResponse<bool>> UpdateStatusAsync(int id, ApplicationStatus status, string reason, int userId);
    Task<bool> IsOwnerAsync(int applicationId, int userId);
    Task<ApiResponse<List<LicenseCategoryDto>>> GetLicenseCategoriesAsync();
    
    // Upgrade & Replacement
    Task<ApiResponse<ApplicationDto>> CreateUpgradeApplicationAsync(UpgradeApplicationRequest request, int userId);
    Task<ApiResponse<ReplacementEligibilityResponse>> GetReplacementEligibilityAsync(int userId);
    Task<ApiResponse<ApplicationDto>> CreateReplacementApplicationAsync(ReplacementApplicationRequest request, int userId);
    
    // Queue for employee review
    Task<ApiResponse<PagedResult<ApplicationDto>>> GetQueueAsync(int page = 1, int pageSize = 20, string? search = null, string? stage = null);
    
    // Workflow actions
    Task<ApiResponse<bool>> SubmitAsync(int id, int userId);
    Task<ApiResponse<bool>> ApproveAsync(int id, string reason, int userId);
    Task<ApiResponse<bool>> RejectAsync(int id, string reason, int userId);
    Task<ApiResponse<bool>> MarkAsPaidAsync(int id, int userId);
    
    // Timeline
    Task<ApiResponse<ApplicationWorkflowTimelineDto>> GetTimelineAsync(int id);
    
    // Security Verification (Gate 4)
    Task<ApiResponse<PagedResult<ApplicationDto>>> GetSecurityPendingQueueAsync(int page = 1, int pageSize = 20, string? search = null);
    Task<ApiResponse<bool>> RecordSecurityVerificationAsync(int id, SecurityVerificationRequest request, int userId);

    // Medical Exam Queue (Stage 4)
    Task<ApiResponse<PagedResult<ApplicationDto>>> GetMedicalPendingQueueAsync(int page = 1, int pageSize = 20, string? search = null);

    // Receptionist Forward Actions
    Task<ApiResponse<bool>> ForwardToMedicalAsync(int id, int userId);
    Task<ApiResponse<bool>> ForwardToTrainingAsync(int id, int userId);
    Task<ApiResponse<EligibilityResponseDto>> CheckEligibilityAsync(int userId, LicenseCategoryCode categoryCode, ServiceType serviceType);
    
    // Staff Assignment
    Task<ApiResponse<bool>> AssignAsync(int id, AssignApplicationRequest request, int userId);

    // My Applications (for applicant)
    Task<ApiResponse<PagedResult<ApplicationDto>>> GetMyApplicationsAsync(int userId, int page = 1, int pageSize = 20, string? status = null);

    // Doctor Applications (for Doctor role)
    Task<ApiResponse<PagedResult<ApplicationDto>>> GetDoctorApplicationsAsync(int userId, int page = 1, int pageSize = 20, string? search = null);

    // Examiner Applications (for Examiner role)
    Task<ApiResponse<PagedResult<ApplicationDto>>> GetExaminerApplicationsAsync(int userId, int page = 1, int pageSize = 20, string? search = null);
}