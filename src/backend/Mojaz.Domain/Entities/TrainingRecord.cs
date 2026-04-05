using Mojaz.Domain.Common;
using System;

namespace Mojaz.Domain.Entities;

public class TrainingRecord : AuditableEntity
{
    public Guid ApplicationId { get; set; }
    public string SchoolName { get; set; } = string.Empty;
    public string? CertificateNumber { get; set; }
    public int CompletedHours { get; set; }
    public int RequiredHours { get; set; }
    public bool IsExempt { get; set; }
    public string? ExemptionReason { get; set; }
    public Guid? ExemptionApprovedBy { get; set; }
    public string Status { get; set; } = "InProgress"; // InProgress|Completed|Exempt
    public DateTime? CompletedAt { get; set; }

    public virtual Application Application { get; set; } = null!;
}
