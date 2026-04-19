using DrivingLicenseIssuanceSystem.Application.DTOs.LicenseReplacement;
using DrivingLicenseIssuanceSystem.Application.DTOs.Application;
using DrivingLicenseIssuanceSystem.Application.DTOs.License;
using DrivingLicenseIssuanceSystem.Shared;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DrivingLicenseIssuanceSystem.Application.Interfaces;

/// <summary>
/// Service interface for License Replacement business logic
/// </summary>
public interface IReplaceLicenseService
{
    /// <summary>
    /// Checks if the applicant is eligible for license replacement
    /// </summary>
    Task<ApiResponse<ReplacementEligibilityDto>> CheckEligibilityAsync(Guid userId);

    /// <summary>
    /// Creates a new license replacement application
    /// </summary>
    Task<ApiResponse<Guid>> CreateReplacementAsync(CreateReplacementRequest request, Guid userId);

    /// <summary>
    /// Gets the details of a license replacement application
    /// </summary>
    Task<ApiResponse<LicenseReplacementDto>> GetReplacementDetailsAsync(Guid applicationId);

    /// <summary>
    /// Updates the verification status of a police report for stolen licenses
    /// </summary>
    Task<ApiResponse<bool>> UpdateReportVerificationAsync(Guid applicationId, bool isVerified, string? comments, Guid reviewerId);

    /// <summary>
    /// Processes the payment for a replacement application
    /// </summary>
    Task<ApiResponse<bool>> ProcessPaymentAsync(Guid applicationId, Guid paymentId);

    /// <summary>
    /// Processes the issuance of a replacement license
    /// </summary>
    Task<ApiResponse<Guid>> IssueReplacementAsync(Guid applicationId, Guid processedById);
}