using DrivingLicenseIssuanceSystem.Application.DTOs.Medical;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using DrivingLicenseIssuanceSystem.Shared;
using System;
using System.Threading.Tasks;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces.Services;

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