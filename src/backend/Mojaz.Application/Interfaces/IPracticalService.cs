using Mojaz.Application.DTOs.Practical;
using Mojaz.Domain.Entities;
using Mojaz.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces;

/// <summary>
/// Service interface for PracticalTest business logic
/// </summary>
public interface IPracticalService
{
    /// <summary>
    /// Submits a practical test result for an application
    /// </summary>
    Task<ApiResponse<PracticalTestDto>> SubmitResultAsync(Guid applicationId, SubmitPracticalResultRequest request, Guid examinerId);

    /// <summary>
    /// Gets the practical test history for an application
    /// </summary>
    Task<ApiResponse<PagedResult<PracticalTestDto>>> GetHistoryAsync(Guid applicationId, Guid userId, string role, int page = 1, int pageSize = 10);

    /// <summary>
    /// Checks if the applicant is in the cooling period after a failed attempt
    /// </summary>
    Task<bool> IsInCoolingPeriodAsync(Guid applicationId);

    /// <summary>
    /// Checks if the applicant has reached the maximum number of practical test attempts
    /// </summary>
    Task<bool> HasReachedMaxAttemptsAsync(Guid applicationId);

    /// <summary>
    /// Checks if additional training is required for the applicant
    /// </summary>
    Task<bool> HasAdditionalTrainingRequiredAsync(Guid applicationId);
}