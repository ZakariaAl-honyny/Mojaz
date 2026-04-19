using DrivingLicenseIssuanceSystem.Shared;

namespace DrivingLicenseIssuanceSystem.Application.DTOs.Renewal;

public class CreateRenewalRequest
{
    public Guid OldLicenseId { get; set; }
    public Guid LicenseCategoryId { get; set; }
}