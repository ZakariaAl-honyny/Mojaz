# Data Model: Training Records (018)

## Domain Entities

### `TrainingRecord` (Mojaz.Domain/Entities/TrainingRecord.cs) — EXTEND

Extends `AuditableEntity`. One record per application.

**Fields** (delta from existing stub — fields to ADD):

| Field | Type | Notes |
|-------|------|-------|
| `TrainingDate` | `DateTime? (UTC)` | Date of training completion at school (from certificate) |
| `TrainerName` | `string?` | Name of trainer/instructor at the center |
| `CenterName` | `string?` | Driving school/center name (rename from `SchoolName` or add as alias) |
| `TotalHoursRequired` | `int` | Snapshot of SystemSettings value at record creation time |
| `TrainingStatus` | `TrainingStatus` (enum) | Replaces raw `Status` string |
| `ExemptionDocumentId` | `Guid?` | FK → ApplicationDocument (supporting doc uploaded via Feature 014) |
| `ExemptionApprovedAt` | `DateTime? (UTC)` | Timestamp of Manager approval |
| `ExemptionRejectionReason` | `string?` | Reason if Manager rejects exemption |
| `CreatedBy` | `Guid` | UserId of employee who created the record |

**Existing fields retained** (from stub):

| Field | Type | Notes |
|-------|------|-------|
| `ApplicationId` | `Guid` | FK → Applications |
| `SchoolName` | `string` | Keep existing field |
| `CertificateNumber` | `string?` | Training certificate reference |
| `CompletedHours` | `int` | Accumulated hours recorded |
| `RequiredHours` | `int` | Rename to `TotalHoursRequired` via migration |
| `IsExempt` | `bool` | Rename to `IsExempted` for consistency |
| `ExemptionReason` | `string?` | Reason for exemption request |
| `ExemptionApprovedBy` | `Guid?` | FK → Users (Manager who approved) |
| `CompletedAt` | `DateTime?` | When training was marked complete |

**Navigation properties**:
- `Application` (virtual) — already exists
- `ExemptionDocument` (virtual, nullable) → `ApplicationDocument`
- `ExemptionApprover` (virtual, nullable) → `User`
- `Creator` (virtual) → `User`

---

### `TrainingStatus` Enum (Mojaz.Domain/Enums/TrainingStatus.cs) — NEW

```csharp
public enum TrainingStatus
{
    Required = 0,    // Default — training not yet started
    InProgress = 1,  // Hours partially recorded
    Completed = 2,   // TotalHoursRequired met or exceeded
    Exempted = 3     // Manager-approved exemption
}
```

**State Transition Rules:**
```
Required → InProgress   : First hours recorded (CompletedHours > 0 but < TotalHoursRequired)
InProgress → Completed  : CompletedHours >= TotalHoursRequired (auto-transition by service)
Required → Exempted     : Manager approves exemption request
InProgress → Exempted   : Manager approves exemption request (partial hours already recorded)
Exempted → Required     : Manager rejects exemption (returns to original Required state)
```

---

## Application Layer Contracts

### DTOs

**`TrainingRecordDto`** (read model returned to clients):
```
Id, ApplicationId, SchoolName, CertificateNumber, CompletedHours, TotalHoursRequired,
ProgressPercentage (computed: int), TrainingDate, TrainerName, CenterName,
Status (enum string), IsExempted, ExemptionReason, ExemptionApprovedByName,
ExemptionApprovedAt, ExemptionRejectionReason, CreatedAt, UpdatedAt
```

**`CreateTrainingRecordRequest`** (Employee → POST):
```
ApplicationId*, SchoolName*, CertificateNumber, HoursCompleted*, TrainingDate*,
TrainerName, CenterName, Notes
```

**`UpdateTrainingHoursRequest`** (Employee → PATCH hours):
```
AdditionalHours* (must be > 0), Notes
```

**`CreateExemptionRequest`** (Employee → POST exemption):
```
ApplicationId*, ExemptionReason*, ExemptionDocumentId* (must exist in Documents table)
```

**`ExemptionActionRequest`** (Manager → PATCH approve/reject):
```
RejectionReason (required if REJECT action)
```

---

## Validation Rules (FluentValidation)

### `CreateTrainingRecordValidator`
- `ApplicationId` must not be empty
- `HoursCompleted` must be > 0 and ≤ 999
- `SchoolName` required, max 200 chars
- `TrainingDate` must not be in the future
- Application must exist and be in `TrainingRequired` or `TrainingInProgress` status

### `CreateExemptionValidator`
- `ApplicationId` must not be empty
- `ExemptionReason` required, min 10 chars, max 1000 chars
- `ExemptionDocumentId` must not be empty
- Referenced document must exist in `ApplicationDocuments` table
- No existing active exemption for this application (409 check in service)

---

## Database — EF Core Configuration

**Table**: `TrainingRecords` (already exists as stub)

**Migration**: `AddTrainingRecordExtendedFields`
- Add columns: `TrainingDate`, `TrainerName`, `CenterName`, `TotalHoursRequired`, `ExemptionDocumentId`, `ExemptionApprovedAt`, `ExemptionRejectionReason`, `CreatedBy`
- Rename: `Status` string → `TrainingStatus` int (enum-backed)
- Rename: `RequiredHours` → `TotalHoursRequired`
- Rename: `IsExempt` → `IsExempted`
- Add FK index: `IX_TrainingRecords_ApplicationId`
- Add FK index: `IX_TrainingRecords_ExemptionApprovedBy`

**EF Query Filter** (via `TrainingRecordConfiguration`):
```csharp
builder.HasQueryFilter(x => !x.IsDeleted);
```
