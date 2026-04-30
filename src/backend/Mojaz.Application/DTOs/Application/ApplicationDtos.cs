using System.Text.Json.Serialization;
using Mojaz.Domain.Enums;

namespace Mojaz.Application.DTOs.Application;

public class EligibilityCheckRequest
{
    public Guid LicenseCategoryId { get; set; }
    public ServiceType? ServiceType { get; set; }
    public Guid? CurrentLicenseId { get; set; }
}

public class ApplicationFilterRequest
{
    public ApplicationStatus? Status { get; set; }
    public string? CurrentStage { get; set; }
    public ServiceType? ServiceType { get; set; }
    public Guid? LicenseCategoryId { get; set; }
    public Guid? BranchId { get; set; }
    public string? Search { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public string SortBy { get; set; } = "createdAt";
    public string SortDir { get; set; } = "desc";
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class CreateApplicationDraftRequest
{
    [JsonPropertyName("serviceType")]
    public ServiceType ServiceType { get; set; }
}

public class CreateApplicationRequest
{
    // Step 1: Service
    public ServiceType ServiceType { get; set; }

    // Step 2: Category
    public Guid LicenseCategoryId { get; set; }

    // Step 3: Personal Information (Updating Applicant profile)
    public string NationalId { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public GenderEnum? Gender { get; set; }
    public string Nationality { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Region { get; set; }
    public ApplicantType? ApplicantType { get; set; }

    // Step 4: Details
    public Guid? BranchId { get; set; }
    public string PreferredLanguage { get; set; } = "ar";
    public string? SpecialNeeds { get; set; }
    
    // Step 5: Review
    public bool DataAccuracyConfirmed { get; set; }
}

public class UpdateDraftRequest
{
    public ServiceType? ServiceType { get; set; }
    public Guid? LicenseCategoryId { get; set; }
    public Guid? BranchId { get; set; }
    public string? PreferredLanguage { get; set; }
    public string? SpecialNeeds { get; set; }
}

public class SubmitApplicationRequest
{
    public bool DataAccuracyConfirmed { get; set; }
}

public class CancelApplicationRequest
{
    public string Reason { get; set; } = string.Empty;
}

public class AssignApplicationRequest
{
    public Guid StaffId { get; set; }
    public string? Notes { get; set; }
}

public class UpdateApplicationRequest
{
    public ServiceType? ServiceType { get; set; }
    public Guid? LicenseCategoryId { get; set; }
    public Guid? BranchId { get; set; }
    public string? PreferredLanguage { get; set; }
    public string? SpecialNeeds { get; set; }
}

public class ApplicationDto
{
    public Guid Id { get; set; }
    public string ApplicationNumber { get; set; } = string.Empty;
    public ServiceType ServiceType { get; set; }
    public Guid LicenseCategoryId { get; set; }
    public string LicenseCategoryNameEn { get; set; } = string.Empty;
    public string LicenseCategoryNameAr { get; set; } = string.Empty;
    public Guid? BranchId { get; set; }
    public ApplicationStatus Status { get; set; }
    public string? CurrentStage { get; set; }
    public string PreferredLanguage { get; set; } = "ar";
    public string? SpecialNeeds { get; set; }
    public bool DataAccuracyConfirmed { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? CancellationReason { get; set; }
    public string? RejectionReason { get; set; }
    public Guid ApplicantId { get; set; }
    public string ApplicantName { get; set; } = string.Empty;
    public string LicenseCategoryCode { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Security Verification fields (Gate 4)
    public SecurityStatus SecurityStatus { get; set; }
    public DateTime? SecurityVerifiedAt { get; set; }
    
    // Staff Assignment fields
    public Guid? AssignedToId { get; set; }
    public DateTime? AssignedAt { get; set; }
    public string? AssignmentNotes { get; set; }
}

public class ApplicationListDto
{
    public Guid Id { get; set; }
    public string ApplicationNumber { get; set; } = string.Empty;
    public ServiceType ServiceType { get; set; }
    public string LicenseCategoryNameEn { get; set; } = string.Empty;
    public string LicenseCategoryNameAr { get; set; } = string.Empty;
    public ApplicationStatus Status { get; set; }
    public string? CurrentStage { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ApplicationTimelineDto
{
    public Guid Id { get; set; }
    public ApplicationStatus FromStatus { get; set; }
    public ApplicationStatus ToStatus { get; set; }
    public string? Notes { get; set; }
    public string ChangedByUserId { get; set; } = string.Empty;
    public string ChangedByName { get; set; } = string.Empty;
    public DateTime ChangedAt { get; set; }
}

public class ApplicationStatusUpdateRequest
{
    public ApplicationStatus Status { get; set; }
    public string? Reason { get; set; }
}

public class TimelineStageDto
{
    public int StageNumber { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty; // completed | current | failed | future
    public DateTime? CompletedAt { get; set; }
    public string? ActorName { get; set; }
    public string? ActorRole { get; set; }
    public string? OutcomeNote { get; set; }
}

public class ApplicationWorkflowTimelineDto
{
    public Guid ApplicationId { get; set; }
    public int CurrentStageNumber { get; set; }
    public List<TimelineStageDto> Stages { get; set; } = new();
}

public class UpgradeApplicationRequest
{
    public Guid CurrentLicenseId { get; set; }
    public Guid TargetCategoryId { get; set; }
    public Guid BranchId { get; set; }
    public string PreferredLanguage { get; set; } = "ar";
    public bool DataAccuracyConfirmed { get; set; }
}

/// <summary>
/// Complete wizard data response — includes both application fields and applicant user fields.
/// Used to restore wizard state on page refresh or app revisit.
/// </summary>
public class ApplicationWizardDto
{
    // Identity
    public Guid Id { get; set; }
    public string ApplicationNumber { get; set; } = string.Empty;
    public ApplicationStatus Status { get; set; }
    public string CurrentStage { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Step 1: Service
    public ServiceType ServiceType { get; set; }

    // Step 2: Category
    public Guid LicenseCategoryId { get; set; }
    public string LicenseCategoryCode { get; set; } = string.Empty;
    public string LicenseCategoryNameAr { get; set; } = string.Empty;
    public string LicenseCategoryNameEn { get; set; } = string.Empty;

    // Step 3: Personal Info (from User entity)
    public string? NationalId { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public GenderEnum? Gender { get; set; }
    public string? Nationality { get; set; }
    public string? MobileNumber { get; set; }  // User.PhoneNumber
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Region { get; set; }
    public ApplicantType? ApplicantType { get; set; }

    // Step 4: Preferences (from Application entity)
    public Guid? BranchId { get; set; }
    public string PreferredLanguage { get; set; } = "ar";
    public string? SpecialNeeds { get; set; }  // from Application entity
    public string? AppointmentPreference { get; set; }  // User.AppointmentPreference
}

/// <summary>
/// Request to update both application and applicant user data during wizard progression or auto-save.
/// </summary>
public class UpdateWizardDataRequest
{
    // Step 2
    public Guid? LicenseCategoryId { get; set; }

    // Step 3 (User fields)
    public string? NationalId { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public GenderEnum? Gender { get; set; }
    public string? Nationality { get; set; }
    public string? MobileNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Region { get; set; }
    public ApplicantType? ApplicantType { get; set; }

    // Step 4 (Application + User fields)
    public Guid? BranchId { get; set; }
    public string? PreferredLanguage { get; set; }
    public string? SpecialNeeds { get; set; }
    public string? AppointmentPreference { get; set; }
}

public class ReplacementApplicationRequest
{
    public Guid LicenseId { get; set; }
    public string Reason { get; set; } = string.Empty;
    public List<Guid>? DocumentIds { get; set; }
}

public class ReplacementEligibilityResponse
{
    public bool IsEligible { get; set; }
    public Guid LicenseId { get; set; }
    public string LicenseNumber { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public string? Message { get; set; }
}

/// <summary>
/// Security verification record request
/// </summary>
public class SecurityVerificationRequest
{
    public bool IsCleared { get; set; }
    public string? Notes { get; set; }
}

/// <summary>
/// Forward application to a specific stage request (Screen 3)
/// </summary>
public class ForwardApplicationRequest
{
    public string? ForwardToStage { get; set; } // "Medical", "Training", "DocumentReview"
    public string? Notes { get; set; }
}

public class EligibilityResponseDto
{
    public bool IsEligible { get; set; }
    public string? Message { get; set; }
    public Guid? ExistingApplicationId { get; set; }
    public string? ExistingApplicationNumber { get; set; }
}
