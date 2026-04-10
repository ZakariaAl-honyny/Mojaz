using Mojaz.Domain.Common;
using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Domain.Entities;

public class License : SoftDeletableEntity
{
    public string LicenseNumber { get; set; } = string.Empty;
    public Guid ApplicationId { get; set; }
    public Guid HolderId { get; set; } // Same as ApplicantId
    public Guid LicenseCategoryId { get; set; }
    public Guid? BranchId { get; set; }
    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public Guid? IssuedBy { get; set; }
    public LicenseStatus Status { get; set; } = LicenseStatus.Active;
    public string? QrCode { get; set; }
    public string? BlobUrl { get; set; }
    public DateTime? PrintedAt { get; set; }
    public DateTime? DownloadedAt { get; set; }

    public virtual User Holder { get; set; } = null!;
    public virtual LicenseCategory LicenseCategory { get; set; } = null!;
}
