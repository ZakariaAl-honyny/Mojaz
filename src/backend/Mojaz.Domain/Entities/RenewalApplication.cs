using Mojaz.Domain.Common;
using Mojaz.Domain.Enums;
using System;
using System.Collections.Generic;

namespace Mojaz.Domain.Entities;

public class RenewalApplication : Application
{
    public Guid OldLicenseId { get; set; }
    public Guid? NewLicenseId { get; set; }
    public bool RenewalFeePaid { get; set; } = false;
    public Guid? MedicalExaminationId { get; set; }

    public virtual License OldLicense { get; set; } = null!;
    public virtual License? NewLicense { get; set; }
    public virtual MedicalExamination? MedicalExamination { get; set; }

    // Override ServiceType to always be Renewal
    public new ServiceType ServiceType { get; set; } = ServiceType.Renewal;
}