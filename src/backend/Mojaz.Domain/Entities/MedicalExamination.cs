using Mojaz.Domain.Enums;

namespace Mojaz.Domain.Entities;

public class MedicalExamination : SoftDeletableEntity
{
    public int ApplicationId { get; set; }
    public int DoctorId { get; set; }
    public DateTime ExaminedAt { get; set; } = DateTime.UtcNow;
    public MedicalFitnessResult FitnessResult { get; set; }
    public BloodTypeEnum? BloodType { get; set; }
    public string? Notes { get; set; }
    public string? ReportReference { get; set; }
    public DateTime? ValidUntil { get; set; }
    public string? CertificatePath { get; set; }

    public virtual Application Application { get; set; } = null!;
}