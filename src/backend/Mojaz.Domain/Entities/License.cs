using Mojaz.Domain.Enums;

namespace Mojaz.Domain.Entities;

public class License : SoftDeletableEntity
{
    public string LicenseNumber { get; set; } = string.Empty;
    public int ApplicationId { get; set; }
    public int HolderId { get; set; } // Same as ApplicantId
    public int LicenseCategoryId { get; set; }
    public int? BranchId { get; set; }
    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public int? IssuedBy { get; set; }
    public LicenseStatus Status { get; set; } = LicenseStatus.Active;
    public string? QrCode { get; set; }
    public string? BlobUrl { get; set; }
    public DateTime? PrintedAt { get; set; }
    public DateTime? DownloadedAt { get; set; }
    public int ReplacementCount { get; set; } = 0;

    public virtual User Holder { get; set; } = null!;
    public virtual LicenseCategory LicenseCategory { get; set; } = null!;
}
