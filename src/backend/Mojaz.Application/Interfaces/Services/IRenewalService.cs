using Mojaz.Application.DTOs.Renewal;
using Mojaz.Shared;

namespace Mojaz.Application.Interfaces.Services;

public interface IRenewalService
{
    Task<ApiResponse<EligibilityResponse>> ValidateEligibilityAsync(Guid applicantId, Guid licenseCategoryId);
    Task<ApiResponse<Guid>> CreateRenewalAsync(CreateRenewalRequest request);
    Task<ApiResponse<bool>> ProcessMedicalResultAsync(Guid applicationId, Guid medicalExaminationId);
    Task<ApiResponse<bool>> PayRenewalFeeAsync(Guid applicationId, PaymentRequest paymentInfo);
    Task<ApiResponse<IssueLicenseResponse>> IssueLicenseAsync(Guid applicationId);
}