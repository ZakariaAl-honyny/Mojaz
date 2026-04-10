# Data Model: 022 — Final Approval with Gate 4 Validation

**Branch**: `022-final-approval` | **Phase**: 1 — Design | **Date**: 2026-04-10

---

## Entity Changes

### 1. `User` Entity — New Field

**File**: `Mojaz.Domain/Entities/User.cs`

| Field | Type | Nullable | Default | Notes |
|-------|------|:--------:|---------|-------|
| `IsSecurityBlocked` | `bool` | No | `false` | Set by Security/Regulatory role. Distinct from `IsLocked` (auth lockout). |

**Rationale**: See RES-003. MVP proxy for a future `SecurityBlocks` table.

---

### 2. `Application` Entity — New Fields

**File**: `Mojaz.Domain/Entities/Application.cs`

| Field | Type | Nullable | Default | Notes |
|-------|------|:--------:|---------|-------|
| `FinalDecision` | `FinalDecisionType?` | Yes | `null` | Set only when a finalization action is recorded |
| `FinalDecisionBy` | `Guid?` | Yes | `null` | UserId of the Manager who made the decision |
| `FinalDecisionAt` | `DateTime?` | Yes | `null` | UTC timestamp of the decision |
| `FinalDecisionReason` | `string?` | Yes | `null` | Max 1000 chars. Mandatory for Reject/Return. |
| `ReturnToStage` | `string?` | Yes | `null` | Stage key for Return action (e.g., "02-Documents") |
| `ManagerNotes` | `string?` | Yes | `null` | Max 1000 chars. Optional supplemental notes. |

---

### 3. New Enum: `FinalDecisionType`

**File**: `Mojaz.Domain/Enums/FinalDecisionType.cs` (new file)

```csharp
namespace Mojaz.Domain.Enums;

public enum FinalDecisionType
{
    Approved,
    Rejected,
    Returned
}
```

---

### 4. New Enum value in `NotificationEventType`

**File**: `Mojaz.Domain/Enums/NotificationEventType.cs`

Add three new event types:
- `FinalApprovalApproved`
- `FinalApprovalRejected`
- `FinalApprovalReturned`

---

## Value Objects (Non-Persisted)

### `Gate4ValidationResult`

Returned by `IGate4ValidationService.ValidateAsync(...)`. Not stored in the database.

| Property | Type | Notes |
|----------|------|-------|
| `IsFullyPassed` | `bool` | True only when ALL 6 conditions pass |
| `Conditions` | `List<Gate4Condition>` | One entry per gate condition |

### `Gate4Condition`

| Property | Type | Notes |
|----------|------|-------|
| `Key` | `string` | Machine-readable key, e.g., `"TheoryTestPassed"` |
| `LabelAr` | `string` | Arabic display label |
| `LabelEn` | `string` | English display label |
| `IsPassed` | `bool` | True if condition is satisfied |
| `FailureMessageAr` | `string?` | Arabic failure description (null if passed) |
| `FailureMessageEn` | `string?` | English failure description (null if passed) |

**The 6 standard Gate 4 conditions (in order)**:

| Key | Check |
|-----|-------|
| `TheoryTestPassed` | Latest `TheoryTest` for application has `TestResult.Passed` |
| `PracticalTestPassed` | Latest `PracticalTest` for application has `TestResult.Passed` |
| `SecurityStatusClean` | `Application.Applicant.IsSecurityBlocked == false` |
| `IdentityDocumentValid` | `User.NationalId` is not empty AND `IdExpiryDate > DateTime.UtcNow` (if stored; for MVP gate falls back to document verification status) |
| `MedicalCertificateValid` | Latest `MedicalExamination.ValidUntil > DateTime.UtcNow` AND `FitnessResult == MedicalFitnessResult.Fit` |
| `AllPaymentsCleared` | No `Payment` linked to this application has `Status == PaymentStatus.Pending` or `PaymentStatus.Failed` |

---

## DTOs (Application Layer)

### `FinalizeApplicationRequest` (Request DTO)

| Field | Type | Required | Validation |
|-------|------|:--------:|-----------|
| `Decision` | `FinalDecisionType` | ✅ | Must be valid enum value |
| `Reason` | `string?` | Conditional | Required if Decision = Rejected or Returned. Max 1000 chars. |
| `ReturnToStage` | `string?` | Conditional | Required if Decision = Returned. Must be one of allowed values: `"02-Documents"`, `"04-Medical"`, `"06-Theory"`, `"07-Practical"` |
| `ManagerNotes` | `string?` | ❌ | Optional. Max 1000 chars. |

### `ApplicationDecisionDto` (Response DTO)

| Field | Type | Notes |
|-------|------|-------|
| `ApplicationId` | `Guid` | |
| `ApplicationNumber` | `string` | |
| `NewStatus` | `ApplicationStatus` | Status after the decision |
| `Decision` | `FinalDecisionType` | |
| `DecisionAt` | `DateTime` | UTC |
| `DecisionBy` | `string` | Manager's display name |
| `Gate4Result` | `Gate4ValidationResult` | Snapshot of gate state at decision time |

### `Gate4ValidationResultDto` (Response DTO for GET endpoint)

| Field | Type | Notes |
|-------|------|-------|
| `ApplicationId` | `Guid` | |
| `IsFullyPassed` | `bool` | |
| `Conditions` | `List<Gate4ConditionDto>` | |

### `Gate4ConditionDto`

Mirrors `Gate4Condition` value object fields for the API surface.

---

## Application Status Transitions

| Decision | From Status | To Status |
|----------|-------------|-----------|
| Approve | `Approved` (FinalApproval stage) | `Payment` (Issuance Payment stage) — `CurrentStage = "09-IssuancePayment"` |
| Reject | Any | `Rejected` — terminal state |
| Return → Documents | Any | `DocumentReview` — `CurrentStage = "02-Documents"` |
| Return → Medical | Any | `MedicalExam` — `CurrentStage = "04-Medical"` |
| Return → Theory | Any | `TheoryTest` — `CurrentStage = "06-Theory"` |
| Return → Practical | Any | `PracticalTest` — `CurrentStage = "07-Practical"` |

**Note**: For the **Approve** action, the Application.Status transitions to `Approved` (existing enum value) and the `CurrentStage` advances to `"09-IssuancePayment"`. The `ApplicationStatus.Approved` value already exists and will be reused.

---

## Service Interfaces (Application Layer)

### `IGate4ValidationService`

**File**: `Mojaz.Application.Interfaces.Services.IGate4ValidationService`

```csharp
Task<Gate4ValidationResult> ValidateAsync(Guid applicationId);
```

### `IFinalApprovalService`

**File**: `Mojaz.Application.Interfaces.Services.IFinalApprovalService`

```csharp
Task<ApiResponse<Gate4ValidationResultDto>> GetGate4StatusAsync(Guid applicationId, Guid managerId);
Task<ApiResponse<ApplicationDecisionDto>> FinalizeAsync(Guid applicationId, FinalizeApplicationRequest request, Guid managerId);
```

---

## Database Migration

**Migration Name**: `AddFinalApprovalFields`

### Users Table

```sql
ALTER TABLE Users
ADD IsSecurityBlocked bit NOT NULL DEFAULT 0;
```

### Applications Table

```sql
ALTER TABLE Applications
ADD FinalDecision int NULL,
    FinalDecisionBy uniqueidentifier NULL,
    FinalDecisionAt datetime2 NULL,
    FinalDecisionReason nvarchar(1000) NULL,
    ReturnToStage nvarchar(50) NULL,
    ManagerNotes nvarchar(1000) NULL;
```

No data migration needed — all columns are nullable or have a safe default value.
