using DrivingLicenseIssuanceSystem.Application.DTOs.Application;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using DrivingLicenseIssuanceSystem.Shared;
using System;
using System.Threading.Tasks;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Services;

public interface IApplicationWorkflowService
{
    Task<ApiResponse<bool>> AdvanceStageAsync(Guid applicationId, ApplicationStatus nextStatus, string notes, Guid userId);
    Task<ApiResponse<bool>> RejectAsync(Guid applicationId, string reason, Guid userId);
}
