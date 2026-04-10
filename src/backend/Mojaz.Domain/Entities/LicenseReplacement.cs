using Mojaz.Domain.Common;
using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Domain.Entities;

public class LicenseReplacement : AuditableEntity
{
    public Guid LicenseId { get; set; }
    public Guid ApplicationId { get; set; }
    public ReplacementReason Reason { get; set; }
    public bool IsReportVerified { get; set; }
    public string? ReviewComments { get; set; }
    public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;
    public Guid? ProcessedBy { get; set; }

    public virtual License License { get; set; } = null!;
    public virtual Application Application { get; set; } = null!;
}