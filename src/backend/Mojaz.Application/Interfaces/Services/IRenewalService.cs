using Mojaz.Application.DTOs.Renewal;
using Mojaz.Shared;

namespace Mojaz.Application.Interfaces.Services;

public interface IRenewalService
{
    Task<ApiResponse<EligibilityResponse>> ValidateEligibilityAsync(int applicantId, int licenseCategoryId);
    Task<ApiResponse<int>> CreateRenewalAsync(CreateRenewalRequest request);
    Task<ApiResponse<bool>> ProcessMedicalResultAsync(int applicationId, int medicalExaminationId);
    Task<ApiResponse<bool>> PayRenewalFeeAsync(int applicationId, PaymentRequest paymentInfo);
    Task<ApiResponse<IssueLicenseResponse>> IssueLicenseAsync(int applicationId);
}