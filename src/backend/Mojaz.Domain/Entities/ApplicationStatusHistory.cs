using DrivingLicenseIssuanceSystem.Domain.Common;
using DrivingLicenseIssuanceSystem.Domain.Enums;
using System;

namespace DrivingLicenseIssuanceSystem.Domain.Entities;

public class ApplicationStatusHistory : BaseEntity
{
    public Guid ApplicationId { get; set; }
    public ApplicationStatus FromStatus { get; set; }
    public ApplicationStatus ToStatus { get; set; }
    public Guid ChangedBy { get; set; }
    public string? Notes { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    public virtual Application Application { get; set; } = null!;
}
