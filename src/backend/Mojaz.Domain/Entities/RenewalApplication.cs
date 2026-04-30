using Mojaz.Domain.Enums;

namespace Mojaz.Domain.Entities;

public class RenewalApplication : Application
{
    public int OldLicenseId { get; set; }
    public int? NewLicenseId { get; set; }
    public bool RenewalFeePaid { get; set; } = false;
    public int? MedicalExaminationId { get; set; }

    // Stage Exempt tracking for simplified renewal workflow
    // Renewal workflow skips: Stage 05 (Training), Stage 06 (Theory), Stage 07 (Practical)
    public bool TrainingExempt { get; set; } = true;
    public bool TheoryExempt { get; set; } = true;
    public bool PracticalExempt { get; set; } = true;

    public virtual License OldLicense { get; set; } = null!;
    public virtual License? NewLicense { get; set; }
    public virtual MedicalExamination? MedicalExamination { get; set; }

    // Override ServiceType to always be Renewal
    public new ServiceType ServiceType { get; set; } = ServiceType.Renewal;
}