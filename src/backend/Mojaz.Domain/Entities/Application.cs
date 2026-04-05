using Mojaz.Domain.Common;
using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Domain.Entities;

public class Application : SoftDeletableEntity
{
    public string ApplicationNumber { get; set; } = string.Empty;
    public Guid ApplicantId { get; set; }
    public ServiceType ServiceType { get; set; }
    public Guid LicenseCategoryId { get; set; }
    public Guid? BranchId { get; set; }
    public ApplicationStatus Status { get; set; }
    public string? CurrentStage { get; set; }
    public string PreferredLanguage { get; set; } = "ar";
    public bool SpecialNeeds { get; set; }
    public bool DataAccuracyConfirmed { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public Guid? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? Notes { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? CancellationReason { get; set; }
    
    public virtual User Applicant { get; set; } = null!;
    public virtual LicenseCategory LicenseCategory { get; set; } = null!;
}
