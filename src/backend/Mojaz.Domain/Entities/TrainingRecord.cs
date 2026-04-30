using Mojaz.Domain.Enums;

namespace Mojaz.Domain.Entities;

public class TrainingRecord : SoftDeletableEntity
{
    public int ApplicationId { get; set; }
    public string SchoolName { get; set; } = string.Empty;
    public string? CertificateNumber { get; set; }
    public int CompletedHours { get; set; }
    public int TotalHoursRequired { get; set; }
    public TrainingStatus TrainingStatus { get; set; } = TrainingStatus.Required;
    public bool IsExempted { get; set; }
    public string? ExemptionReason { get; set; }
    public int? ExemptionDocumentId { get; set; }
    public int? ExemptionApprovedBy { get; set; }
    public DateTime? ExemptionApprovedAt { get; set; }
    public string? ExemptionRejectionReason { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? TrainingDate { get; set; }
    public string? TrainerName { get; set; }
    public string? CenterName { get; set; }

    // Navigation properties
    public virtual Application Application { get; set; } = null!;
    public virtual User? ExemptionApprover { get; set; }
    public virtual User? Creator { get; set; }
    public virtual ApplicationDocument? ExemptionDocument { get; set; }
}