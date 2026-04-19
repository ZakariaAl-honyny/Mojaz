using DrivingLicenseIssuanceSystem.Application.DTOs.Application;
using DrivingLicenseIssuanceSystem.Application.Applications.Dtos;
using DrivingLicenseIssuanceSystem.Application.DTOs.LicenseReplacement;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using DrivingLicenseIssuanceSystem.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Services;

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
    Task<ApiResponse<List<DrivingLicenseIssuanceSystem.Application.DTOs.Application.ApplicationTimelineDto>>> GetTimelineAsync(Guid id, Guid userId, string role);
    Task<ApiResponse<ApplicationWorkflowTimelineDto>> GetWorkflowTimelineAsync(Guid id, Guid userId, string role);
    Task<ApiResponse<EligibilityCheckResult>> CheckEligibilityAsync(Guid userId, EligibilityCheckRequest request);
    Task<ApiResponse<ApplicationDto>> UpgradeAsync(UpgradeApplicationRequest request, Guid userId);
    Task<bool> IsOwnerAsync(Guid applicationId, Guid userId);
    Task<ApiResponse<List<LicenseCategoryDto>>> GetLicenseCategoriesAsync();
}
