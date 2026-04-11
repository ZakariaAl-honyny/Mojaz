# Data Model: Application CRUD & Status Tracking (Feature 012)

**Phase**: 1 — Design  
**Branch**: `012-application-crud`  
**Date**: 2026-04-08

---

## Existing Entities (No Changes Required)

These entities already exist in `Mojaz.Domain/Entities/` and are used as-is:

### Application *(existing — partial gaps)*

```csharp
// Mojaz.Domain/Entities/Application.cs
public class Application : SoftDeletableEntity
{
    public string ApplicationNumber { get; set; } = string.Empty;
    public Guid ApplicantId { get; set; }
    public ServiceType ServiceType { get; set; }
    public Guid LicenseCategoryId { get; set; }
    public Guid? BranchId { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Draft;  // ← Fix: default to Draft
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

    // Navigation
    public virtual User Applicant { get; set; } = null!;
    public virtual LicenseCategory LicenseCategory { get; set; } = null!;
    public virtual ICollection<ApplicationStatusHistory> StatusHistory { get; set; } = [];
}
```

**Gaps to fix**:
- Default `Status` should be `Draft` (not `Submitted`)
- Add `StatusHistory` navigation collection

---

### ApplicationStatusHistory *(existing — no changes)*

```csharp
// Mojaz.Domain/Entities/ApplicationStatusHistory.cs
public class ApplicationStatusHistory : BaseEntity
{
    public Guid ApplicationId { get; set; }
    public ApplicationStatus FromStatus { get; set; }
    public ApplicationStatus ToStatus { get; set; }
    public Guid ChangedBy { get; set; }       // UserId of actor
    public string? Notes { get; set; }         // Reason / notes
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    public virtual Application Application { get; set; } = null!;
}
```

---

## Modified Entities

### ApplicationStatus Enum — Add `Expired` + `DocumentReview`

```csharp
// Mojaz.Domain/Enums/ApplicationStatus.cs
public enum ApplicationStatus
{
    Draft,           // Saved, not submitted
    Submitted,       // Gate 1 passed, formal submission complete
    DocumentReview,  // Receptionist reviewing documents (Stage 02)  ← ADD
    InReview,        // General review alias (kept for compatibility)
    MedicalExam,     // Doctor at Stage 04
    Training,        // Stage 05 — driving school
    TheoryTest,      // Stage 06
    PracticalTest,   // Stage 07
    Approved,        // Final approval (Stage 08)
    Payment,         // Issuance payment pending (Stage 09)
    Issued,          // License issued (Stage 10)
    Active,          // License active
    Rejected,        // Terminal — rejected
    Cancelled,       // Terminal — user/employee cancelled
    Expired          // Terminal — system auto-cancelled ← ADD
}
```

---

## New DTOs (Application Layer)

### ApplicationFilterRequest

```csharp
// Mojaz.Application/DTOs/Application/ApplicationFilterRequest.cs
public class ApplicationFilterRequest
{
    public ApplicationStatus? Status { get; set; }
    public string? CurrentStage { get; set; }
    public ServiceType? ServiceType { get; set; }
    public Guid? LicenseCategoryId { get; set; }
    public Guid? BranchId { get; set; }
    public string? Search { get; set; }          // ApplicationNumber or applicant name
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public string SortBy { get; set; } = "createdAt";
    public string SortDir { get; set; } = "desc";
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
```

### UpdateDraftRequest (renamed from UpdateApplicationRequest)

```csharp
// Mojaz.Application/DTOs/Application/ApplicationDtos.cs
public class UpdateDraftRequest
{
    public ServiceType? ServiceType { get; set; }
    public Guid? LicenseCategoryId { get; set; }
    public Guid? BranchId { get; set; }
    public string? PreferredLanguage { get; set; }
    public bool? SpecialNeeds { get; set; }
    // All fields nullable — partial update allowed in Draft mode
}
```

### SubmitApplicationRequest (new — submission-specific)

```csharp
public class SubmitApplicationRequest
{
    // No extra fields needed — submission is a status transition
    // triggered on the already-stored draft.
    // Optionally carry DataAccuracyConfirmed confirmation.
    public bool DataAccuracyConfirmed { get; set; }
}
```

### EligibilityCheckRequest / EligibilityCheckResult

```csharp
public class EligibilityCheckRequest
{
    public Guid LicenseCategoryId { get; set; }
}

public class EligibilityCheckResult
{
    public bool IsEligible { get; set; }
    public List<string> Reasons { get; set; } = [];  // Why ineligible
}
```

### ApplicationTimelineDto (updated)

```csharp
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
```

### ApplicationDto (updated — add missing fields)

```csharp
public class ApplicationDto
{
    public Guid Id { get; set; }
    public string ApplicationNumber { get; set; } = string.Empty;
    public ServiceType ServiceType { get; set; }
    public Guid LicenseCategoryId { get; set; }
    public string LicenseCategoryNameAr { get; set; } = string.Empty;
    public string LicenseCategoryNameEn { get; set; } = string.Empty;
    public string LicenseCategoryCode { get; set; } = string.Empty;
    public Guid? BranchId { get; set; }
    public ApplicationStatus Status { get; set; }
    public string? CurrentStage { get; set; }
    public string PreferredLanguage { get; set; } = "ar";
    public bool SpecialNeeds { get; set; }
    public bool DataAccuracyConfirmed { get; set; }
    public DateTime? SubmittedAt { get; set; }     // ← ADD
    public DateTime? ExpiresAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? CancellationReason { get; set; }
    public string? RejectionReason { get; set; }    // ← ADD
    public Guid ApplicantId { get; set; }           // ← ADD
    public string ApplicantName { get; set; } = string.Empty;  // ← ADD (for employee views)
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }        // ← ADD
}
```

---

## Updated IApplicationService Interface

```csharp
// Mojaz.Application/Interfaces/Services/IApplicationService.cs
public interface IApplicationService
{
    // CRUD
    Task<ApiResponse<ApplicationDto>> CreateAsync(CreateApplicationRequest request, Guid userId);
    Task<ApiResponse<ApplicationDto>> GetByIdAsync(Guid id, Guid userId, string role);
    Task<ApiResponse<PagedResult<ApplicationDto>>> GetListAsync(
        Guid userId, string role, ApplicationFilterRequest filters);
    Task<ApiResponse<ApplicationDto>> UpdateDraftAsync(
        Guid id, UpdateDraftRequest request, Guid userId);

    // Workflow Actions
    Task<ApiResponse<ApplicationDto>> SubmitAsync(
        Guid id, SubmitApplicationRequest request, Guid userId);
    Task<ApiResponse<bool>> CancelAsync(Guid id, string reason, Guid userId);

    // Employee Actions
    Task<ApiResponse<bool>> UpdateStatusAsync(
        Guid id, ApplicationStatus status, string? reason, Guid userId);

    // Supporting
    Task<ApiResponse<List<ApplicationTimelineDto>>> GetTimelineAsync(
        Guid id, Guid userId, string role);
    Task<ApiResponse<EligibilityCheckResult>> CheckEligibilityAsync(
        Guid userId, EligibilityCheckRequest request);

    // Utility
    Task<bool> IsOwnerAsync(Guid applicationId, Guid userId);
}
```

---

## State Transitions

```
Draft ──────────────────────────────────────────────────► Cancelled (user)
  │
  └──[SubmitAsync + Gate 1]──► Submitted
                                   │
                                   └──[Receptionist]──► DocumentReview
                                                           │
                                                           ├──[Rejected]──► Rejected (terminal)
                                                           │
                                                           └──[Approved]──► MedicalExam
                                                                               │
                                                                               └──► Training
                                                                                       │
                                                                                       └──► TheoryTest
                                                                                               │
                                                                                               └──► PracticalTest
                                                                                                       │
                                                                                                       └──► Approved
                                                                                                               │
                                                                                                               └──► Payment
                                                                                                                       │
                                                                                                                       └──► Issued ──► Active

Any non-terminal status ──[ExpiresAt < UtcNow via Hangfire]──► Expired (terminal)
Any non-terminal status ──[CancelAsync by authorized role]──► Cancelled (terminal)
```

---

## New Hangfire Job

```csharp
// Mojaz.Infrastructure/Jobs/ProcessExpiredApplicationsJob.cs
public class ProcessExpiredApplicationsJob
{
    // Injected: IRepository<Application>, IRepository<ApplicationStatusHistory>,
    //           IAuditService, IUnitOfWork

    // Called by: Hangfire recurring job — daily at 02:00 UTC
    public async Task ExecuteAsync();
    // Queries: Status NOT IN (Cancelled, Rejected, Expired, Issued, Active)
    //          AND ExpiresAt < DateTime.UtcNow
    // For each: Status = Expired, create StatusHistory, create AuditLog
}
```

---

## Database Changes Required

| Change | Entity | Action |
|--------|--------|--------|
| Add `Expired` to `ApplicationStatus` | Enum | +1 value |
| Add `DocumentReview` to `ApplicationStatus` | Enum | +1 value |
| Add `Training` to `ApplicationStatus` | Enum | +1 value |
| Fix default `Status = Draft` on Application | Application | Entity default |
| Add `StatusHistory` navigation | Application | Navigation property |
| Add EF config for `ApplicationStatusHistory.Reason` | Config | Verify mapping |

> **Migration needed**: After enum changes, EF Core will need a new migration to update the `Status` column's allowed values if using a constrained column (SQL Server stores as int with EF, so no migration needed for enum-only changes — but Serilog logs will use the new names automatically).
