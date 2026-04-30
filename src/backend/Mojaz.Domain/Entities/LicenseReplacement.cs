using Mojaz.Domain.Enums;

namespace Mojaz.Domain.Entities;

public class LicenseReplacement : AuditableEntity
{
    public int LicenseId { get; set; }
    public int ApplicationId { get; set; }
    public ReplacementReason Reason { get; set; }
    public bool IsReportVerified { get; set; }
    public string? ReviewComments { get; set; }
    public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;
    public int? ProcessedBy { get; set; }

    public virtual License License { get; set; } = null!;
    public virtual Application Application { get; set; } = null!;
}