using Mojaz.Domain.Enums;
using System.Collections.Generic;

namespace Mojaz.Domain.Entities;

public class Application : SoftDeletableEntity
{
    public string ApplicationNumber { get; set; } = string.Empty;
    public int ApplicantId { get; set; }
    public ServiceType ServiceType { get; set; }
    public int LicenseCategoryId { get; set; }
    public int? BranchId { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Draft;
    public string CurrentStage { get; set; } = string.Empty;
    public string PreferredLanguage { get; set; } = "ar";
    public string? SpecialNeeds { get; set; }
    public bool DataAccuracyConfirmed { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public int? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? Notes { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? CancellationReason { get; set; }
    public int TheoryAttemptCount { get; set; } = 0;
    public int PracticalAttemptCount { get; set; } = 0;
    public bool AdditionalTrainingRequired { get; set; } = false;
    
    // Final Approval fields
    public FinalDecisionType? FinalDecision { get; set; }
    public int? FinalDecisionBy { get; set; }
    public DateTime? FinalDecisionAt { get; set; }
    public string? FinalDecisionReason { get; set; }
    public string? ReturnToStage { get; set; }
    public string? ManagerNotes { get; set; }
    
    // Security Verification (Gate 4)
    public SecurityStatus SecurityStatus { get; set; } = SecurityStatus.Pending;
    public int? SecurityVerifiedBy { get; set; }
    public DateTime? SecurityVerifiedAt { get; set; }
    public string? SecurityNotes { get; set; }
    
    // Staff Assignment (Receptionist assigns to Doctor/Examiner)
    public int? AssignedToId { get; set; }
    public DateTime? AssignedAt { get; set; }
    public string? AssignmentNotes { get; set; }
    
    public virtual User Applicant { get; set; } = null!;
    public virtual LicenseCategory LicenseCategory { get; set; } = null!;
    public virtual ICollection<ApplicationStatusHistory> StatusHistory { get; set; } = [];
    public virtual ICollection<TheoryTest> TheoryTests { get; set; } = [];
    public virtual ICollection<PracticalTest> PracticalTests { get; set; } = [];
}
