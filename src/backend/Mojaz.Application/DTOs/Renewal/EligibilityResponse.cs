using DrivingLicenseIssuanceSystem.Shared;

namespace DrivingLicenseIssuanceSystem.Application.DTOs.Renewal;

public class EligibilityResponse
{
    public bool IsEligible { get; set; }
    public string? Reason { get; set; }
    public DateTime? CurrentLicenseExpiresAt { get; set; }
    public DateTime? GracePeriodEndsAt { get; set; }
    public decimal? RenewalFeeAmount { get; set; }
}