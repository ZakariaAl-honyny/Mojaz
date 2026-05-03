using Mojaz.Domain.Enums;

namespace Mojaz.Domain.Entities;

public class RenewalApplication : Application
{
    // Note: OldLicenseId, NewLicenseId, MedicalExaminationId, TrainingExempt, TheoryExempt, PracticalExempt, 
    // RenewalFeePaid, and Discriminator are now inherited from Application base class
    // The FK properties are inherited - no need to redefine them

    // Navigation properties (use 'new' to shadow inherited nullable navigation properties from Application)
    public new virtual License OldLicense { get; set; } = null!;
    public new virtual License? NewLicense { get; set; }
    public new virtual MedicalExamination? MedicalExamination { get; set; }

    // Override ServiceType to always be Renewal
    public new ServiceType ServiceType { get; set; } = ServiceType.Renewal;
}