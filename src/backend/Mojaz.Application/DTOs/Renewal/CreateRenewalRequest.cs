using Mojaz.Shared;

namespace Mojaz.Application.DTOs.Renewal;

public class CreateRenewalRequest
{
    public Guid OldLicenseId { get; set; }
    public Guid LicenseCategoryId { get; set; }
}