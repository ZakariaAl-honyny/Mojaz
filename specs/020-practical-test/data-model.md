# Data Model: 020 — Practical Test Recording

**Branch**: `020-practical-test` | **Date**: 2026-04-09

---

## Entities Affected

### 1. `PracticalTest` (UPDATE — currently a placeholder entity)

**Table**: `PracticalTests`
**Inherits**: `SoftDeletableEntity` (provides `Id`, `CreatedAt`, `UpdatedAt`, `IsDeleted`)

| Column | Type | Nullable | Constraints | Notes |
|--------|------|----------|-------------|-------|
| `Id` | `Guid` | No | PK | from `BaseEntity` |
| `ApplicationId` | `Guid` | No | FK → Applications(Id) | Index: `IX_PracticalTests_ApplicationId` |
| `ExaminerId` | `Guid` | No | FK → Users(Id) | The Examiner who recorded the result |
| `AttemptNumber` | `int` | No | > 0 | 1-based attempt counter |
| `ConductedAt` | `DateTime` | No | UTC | Rename from `TestDate` |
| `Score` | `int?` | Yes | 0–100 | Null when `IsAbsent = true` |
| `PassingScore` | `int` | No | 0–100 | Snapshot of `MIN_PASS_SCORE_PRACTICAL` at time of test |
| `Result` | `TestResult` (enum) | No | | Pass / Fail / Absent |
| `IsAbsent` | `bool` | No | Default: false | Absence counts as failed attempt |
| `Notes` | `string?` | Yes | MaxLen: 1000 | Examiner's optional observations |
| `VehicleUsed` | `string?` | Yes | MaxLen: 200 | Free-text vehicle description in v1 |
| `RequiresAdditionalTraining` | `bool` | No | Default: false | Distinguishing Feature 020 field |
| `AdditionalHoursRequired` | `int?` | Yes | > 0 when set | Number of additional training hours |
| `IsDeleted` | `bool` | No | Global query filter | from `SoftDeletableEntity` |
| `CreatedAt` | `DateTime` | No | UTC | from `AuditableEntity` |
| `UpdatedAt` | `DateTime?` | Yes | UTC | from `AuditableEntity` |

**Validation rules** (enforced by FluentValidation in Application layer):
- If `IsAbsent = false` → `Score` is required and must be 0–100
- If `IsAbsent = true` → `Score` must be null
- If `RequiresAdditionalTraining = true` → `AdditionalHoursRequired` is required and must be > 0
- `VehicleUsed` required (non-absent result)

**State transitions** driven by `Result`:
```
Result = Pass   → Application.Status = Approved, Application.CurrentStage = "FinalApproval"
Result = Fail   (non-terminal) → Application.PracticalAttemptCount++, AdditionalTrainingRequired updated
Result = Fail   (terminal, attempt == maxAttempts) → Application.Status = Rejected,
                                                      Application.RejectionReason = "MaxPracticalAttemptsReached"
Result = Absent → Treated as Fail for attempt counting and state transition purposes
```

**Navigation properties**:
```csharp
public virtual Application Application { get; set; } = null!;
public virtual User Examiner { get; set; } = null!;
```

---

### 2. `Application` (UPDATE — add practical tracking fields)

**Table**: `Applications`
**Changes**: Add 3 new columns

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `PracticalAttemptCount` | `int` | No | `0` | Mirrors `TheoryAttemptCount`; incremented on every result |
| `AdditionalTrainingRequired` | `bool` | No | `false` | Set on failing result; cleared by TrainingService (Feature 018) |
| `PracticalTests` | Navigation | — | — | `ICollection<PracticalTest>` |

**Migration impact**: Non-breaking; both columns have defaults → no data loss.

---

### 3. `SystemSettings` (SEED — add 3 new keys)

| Key | Value | Type | Description |
|-----|-------|------|-------------|
| `MIN_PASS_SCORE_PRACTICAL` | `80` | int | Minimum score to pass practical test (inclusive) |
| `MAX_PRACTICAL_ATTEMPTS` | `3` | int | Maximum allowed practical test attempts per application |
| `COOLING_PERIOD_DAYS_PRACTICAL` | `7` | int | Days applicant must wait before rebooking after a failure |

---

## DTOs (Application Layer)

### `SubmitPracticalResultRequest`

```csharp
// Request body for POST /api/v1/practical-tests/{appId}/result
{
  "score": int?,              // Required if not absent; 0–100
  "isAbsent": bool,           // Defaults to false
  "requiresAdditionalTraining": bool,  // NEW: Feature 020 differentiator
  "additionalHoursRequired": int?,     // Required if requiresAdditionalTraining = true; > 0
  "vehicleUsed": string?,     // Optional free-text
  "notes": string?            // Optional examiner notes; max 1000 chars
}
```

### `PracticalTestDto`

```csharp
// Response DTO — matches TheoryTestDto structure + additional training fields
{
  "id": Guid,
  "applicationId": Guid,
  "attemptNumber": int,
  "score": int?,
  "passingScore": int,
  "result": string,           // "Pass" | "Fail" | "Absent"
  "isPassed": bool,
  "isAbsent": bool,
  "requiresAdditionalTraining": bool,   // NEW
  "additionalHoursRequired": int?,      // NEW
  "vehicleUsed": string?,
  "conductedAt": DateTime,
  "examinerId": Guid,
  "examinerName": string?,
  "notes": string?,
  "retakeEligibleAfter": DateTime?,     // Null if passed; calculated from ConductedAt + COOLING_PERIOD_DAYS_PRACTICAL
  "applicationStatus": string           // Snapshot of Application.Status after this result
}
```

---

## Interfaces (Application Layer)

### `IPracticalRepository`

```csharp
public interface IPracticalRepository : IRepository<PracticalTest>
{
    Task<PracticalTest?> GetLatestByApplicationIdAsync(Guid applicationId);
    Task<IEnumerable<PracticalTest>> GetAllByApplicationIdAsync(Guid applicationId);
    Task<int> GetAttemptCountAsync(Guid applicationId);
}
```

### `IPracticalService`

```csharp
public interface IPracticalService
{
    Task<ApiResponse<PracticalTestDto>> SubmitResultAsync(Guid applicationId, SubmitPracticalResultRequest request, Guid examinerId);
    Task<ApiResponse<PagedResult<PracticalTestDto>>> GetHistoryAsync(Guid applicationId, Guid userId, string role, int page = 1, int pageSize = 10);
    Task<bool> IsInCoolingPeriodAsync(Guid applicationId);
    Task<bool> HasReachedMaxAttemptsAsync(Guid applicationId);
    Task<bool> HasAdditionalTrainingRequiredAsync(Guid applicationId);  // NEW vs ITheoryService
}
```

---

## AutoMapper Profile

```csharp
// PracticalMappingProfile.cs
CreateMap<PracticalTest, PracticalTestDto>()
    .ForMember(d => d.IsPassed, o => o.MapFrom(s => s.Result == TestResult.Pass))
    .ForMember(d => d.Result, o => o.MapFrom(s => s.Result.ToString()))
    .ForMember(d => d.ExaminerName, o => o.Ignore())     // Populated in service after map
    .ForMember(d => d.RetakeEligibleAfter, o => o.Ignore())  // Calculated in service
    .ForMember(d => d.ApplicationStatus, o => o.Ignore());   // Set in service after transition
```

---

## EF Core Configuration

```csharp
// PracticalTestConfiguration.cs
builder.HasIndex(p => p.ApplicationId).HasDatabaseName("IX_PracticalTests_ApplicationId");
builder.Property(p => p.Notes).HasMaxLength(1000);
builder.Property(p => p.VehicleUsed).HasMaxLength(200);
builder.HasOne(p => p.Application).WithMany(a => a.PracticalTests).HasForeignKey(p => p.ApplicationId);
builder.HasOne(p => p.Examiner).WithMany().HasForeignKey(p => p.ExaminerId);
builder.HasQueryFilter(p => !p.IsDeleted);
```