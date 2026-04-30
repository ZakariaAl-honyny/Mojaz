using Mojaz.Shared;

namespace Mojaz.Application.DTOs.Renewal;

public class CreateRenewalRequest
{
    public int OldLicenseId { get; set; }
    public int LicenseCategoryId { get; set; }
}