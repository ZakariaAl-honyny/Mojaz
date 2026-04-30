using Mojaz.Application.DTOs.LicenseReplacement;
using Mojaz.Application.DTOs.Application;
using Mojaz.Application.DTOs.License;
using Mojaz.Shared;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Mojaz.Application.Interfaces;

/// <summary>
/// Service interface for License Replacement business logic
/// </summary>
public interface IReplaceLicenseService
{
    /// <summary>
    /// Checks if the applicant is eligible for license replacement
    /// </summary>
    Task<ApiResponse<ReplacementEligibilityDto>> CheckEligibilityAsync(int userId);

    /// <summary>
    /// Creates a new license replacement application
    /// </summary>
    Task<ApiResponse<int>> CreateReplacementAsync(CreateReplacementRequest request, int userId);

    /// <summary>
    /// Gets the details of a license replacement application
    /// </summary>
    Task<ApiResponse<LicenseReplacementDto>> GetReplacementDetailsAsync(int applicationId);

    /// <summary>
    /// Updates the verification status of a police report for stolen licenses
    /// </summary>
    Task<ApiResponse<bool>> UpdateReportVerificationAsync(int applicationId, bool isVerified, string? comments, int reviewerId);

    /// <summary>
    /// Processes the payment for a replacement application
    /// </summary>
    Task<ApiResponse<bool>> ProcessPaymentAsync(int applicationId, int paymentId);

    /// <summary>
    /// Processes the issuance of a replacement license
    /// </summary>
    Task<ApiResponse<int>> IssueReplacementAsync(int applicationId, int processedById);
}