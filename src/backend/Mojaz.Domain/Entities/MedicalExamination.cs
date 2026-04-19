using DrivingLicenseIssuanceSystem.Domain.Common;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using System;

namespace DrivingLicenseIssuanceSystem.Domain.Entities;

public class MedicalExamination : SoftDeletableEntity
{
    public Guid ApplicationId { get; set; }
    public Guid DoctorId { get; set; }
    public DateTime ExaminedAt { get; set; } = DateTime.UtcNow;
    public MedicalFitnessResult FitnessResult { get; set; }
    public string? BloodType { get; set; }
    public string? Notes { get; set; }
    public string? ReportReference { get; set; }
    public DateTime? ValidUntil { get; set; }
    public string? CertificatePath { get; set; }

    public virtual Application Application { get; set; } = null!;
}
