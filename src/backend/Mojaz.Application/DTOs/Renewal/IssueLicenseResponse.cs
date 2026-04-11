using Mojaz.Shared;

namespace Mojaz.Application.DTOs.Renewal;

public class IssueLicenseResponse
{
    public Guid NewLicenseId { get; set; }
    public string LicenseNumber { get; set; } = string.Empty;
    public string BlobUrl { get; set; } = string.Empty;
    public DateTime IssuedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
}