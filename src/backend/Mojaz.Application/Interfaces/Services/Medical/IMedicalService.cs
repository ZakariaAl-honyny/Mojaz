using Mojaz.Application.DTOs.Medical;
using Mojaz.Domain.Enums;
using Mojaz.Shared;
using System;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces.Services;

/// <summary>
/// Interface for medical examination service
/// </summary>
public interface IMedicalService
{
    /// <summary>
    /// Creates a medical examination result
    /// </summary>
    Task<ApiResponse<MedicalResultDto>> CreateMedicalResultAsync(
        CreateMedicalResultRequest request,
        Guid doctorId);

    /// <summary>
    /// Gets medical examination result by application ID
    /// </summary>
    Task<ApiResponse<MedicalResultDto>> GetByApplicationIdAsync(Guid applicationId);

    /// <summary>
    /// Updates the medical examination result
    /// </summary>
    Task<ApiResponse<MedicalResultDto>> UpdateResultAsync(
        Guid id,
        MedicalFitnessResult result,
        string? notes);
}