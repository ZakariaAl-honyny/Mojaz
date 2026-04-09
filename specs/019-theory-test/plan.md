# Implementation Plan: 019-theory-test

**Feature Branch**: `019-theory-test`
**Spec**: [spec.md](./spec.md)
**Status**: Ready for Implementation
**Updated**: 2026-04-09

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Architecture Supremacy | ✅ Compliant | Domain entity already exists; service/interface split mirrors Training pattern exactly |
| II. Security First | ✅ Compliant | `[Authorize(Roles = "Examiner")]` on write endpoint; ownership check in service for Applicant reads |
| III. Configuration over Hardcoding | ✅ Compliant | `MIN_PASS_SCORE_THEORY`, `MAX_THEORY_ATTEMPTS`, `COOLING_PERIOD_DAYS` all read from `SystemSettings` |
| IV. Internationalization by Default | ✅ Compliant | All frontend text uses `useTranslations`; bilingual notification payloads |
| V. API Contract Consistency | ✅ Compliant | All endpoints return `ApiResponse<T>` or `ApiResponse<PagedResult<T>>` |
| VI. Test Discipline | ✅ Compliant | Unit tests for score logic; integration tests for attempt limit + cooling period gate |
| VII. Async-First Notifications | ✅ Compliant | In-App sync, Push/Email/SMS dispatched via `INotificationService` (Hangfire async) |

---

## Technical Context

### Current State Analysis

| Component | Status | Notes |
|-----------|--------|-------|
| `TheoryTest` entity | ✅ Exists | Missing `IsAbsent` field — must be added |
| `PracticalTest` entity | ✅ Exists | Not in scope for this feature |
| `ApplicationStages.Theory` constant | ✅ Exists | `"06: Theory"` |
| `ApplicationStatus.TheoryTest` | ✅ Exists | Used for stage status |
| `TestResult` enum | ✅ Exists | `Pass`, `Fail`, `Absent` — all needed values present |
| `ITheoryService` | ❌ Missing | Must be created |
| `TheoryService` | ❌ Missing | Must be created |
| `ITheoryRepository` | ❌ Missing | Must be created |
| `TheoryRepository` | ❌ Missing | Must be created |
| `TheoryTestsController` | ❌ Missing | Must be created |
| `TheoryTestDto` / DTOs | ❌ Missing | DTOs folder for Theory must be created |
| `TheoryTests` DbSet in DbContext | ❓ Unknown | Must verify / add |
| `TheoryAttemptCount` on Application | ❌ Missing | Field must be added to entity + migration |
| Frontend: theory result page | ⚠️ Partial | `test-results/page.tsx` is a static mockup; needs real API integration |
| Cooling period gate in `AppointmentBookingValidator` | ❌ Missing | Needs theory-specific check added |
| SystemSettings seed for `MIN_PASS_SCORE_THEORY` | ❌ Missing | Must add to seed data |

### Dependency Map

```
019-theory-test DEPENDS ON:
  ├── Feature 016 (Appointments) — cooling period booking gate plugs into AppointmentBookingValidator
  ├── Feature 017 (Medical) — Gate 3 check reads MedicalFitnessResult (already implemented)
  ├── Feature 018 (Training) — Gate 3 check reads training completion (ITrainingService.IsTrainingCompleteAsync ✅)
  └── Notification system — INotificationService already implemented

019-theory-test IS DEPENDED ON BY:
  └── Feature 020 (Practical Test) — practical test booking uses same Gate 3 logic pattern
```

---

## Phase 0: Research Findings

### Decision: `IsAbsent` field on `TheoryTest` entity

**Decision**: Add `IsAbsent` (bool, default `false`) to the existing `TheoryTest` entity. When `IsAbsent = true`, `Score` is nullable (null = not taken) and `Result = Absent`.

**Rationale**: Absent is a distinct state from failing with 0 (which would be an actual score). The existing `TestResult.Absent` enum value anticipates this. Score must be nullable to cleanly represent "no score taken."

**Alternative considered**: Using a `Score = -1` sentinel — rejected because it pollutes the numeric range and breaks range validation.

### Decision: `TheoryAttemptCount` storage location

**Decision**: Store `TheoryAttemptCount` (int, default 0) directly on the `Application` entity as a denormalized field for fast Gate 3 checks, in addition to the full attempt history in `TheoryTests` table.

**Rationale**: The `AppointmentBookingValidator` runs on every booking request and must check attempt count without a full JOIN on `TheoryTests`. This mirrors how `Application.CurrentStage` is denormalized. Source of truth remains `TheoryTests.Count`.

**Alternative considered**: Always counting from `TheoryTests` table — rejected for performance; each booking check would need an COUNT query per application.

### Decision: Cooling period enforcement location

**Decision**: The cooling period check lives in `AppointmentBookingValidator.ValidateBookingAsync()`, added as a new gate for `AppointmentType.TheoryTest`. The `TheoryService.SubmitResultAsync()` does NOT check cooling periods — it only records results.

**Rationale**: Matches the existing architecture exactly. Training completion is already checked in `AppointmentBookingValidator`. Cooling period is a booking constraint, not a result-recording constraint.

### Decision: `MIN_PASS_SCORE_THEORY` default

**Decision**: Default to `80` with a `Serilog` warning log: `"MIN_PASS_SCORE_THEORY not found in SystemSettings — defaulting to 80"`. Do NOT throw; silently apply the default and continue.

**Rationale**: Prevents a missing SystemSettings key from blocking all examiner submissions. The warning surfaces the configuration gap in logs for the admin to fix.

---

## Phase 1: Data Model

### Entity Changes

#### `TheoryTest` entity — additions required

```csharp
// File: Mojaz.Domain/Entities/TheoryTest.cs
// Changes: Score becomes nullable; add IsAbsent; rename TestDate → ConductedAt for consistency

public class TheoryTest : SoftDeletableEntity
{
    public Guid ApplicationId { get; set; }
    public Guid ExaminerId { get; set; }
    public int AttemptNumber { get; set; }
    public DateTime ConductedAt { get; set; } = DateTime.UtcNow;  // renamed from TestDate
    public int? Score { get; set; }           // nullable: null when IsAbsent = true
    public int PassingScore { get; set; }
    public TestResult Result { get; set; }
    public bool IsAbsent { get; set; } = false;
    public string? Notes { get; set; }        // max 500 chars (enforced via FluentValidation)

    public virtual Application Application { get; set; } = null!;
    public virtual User Examiner { get; set; } = null!;  // navigation
}
```

#### `Application` entity — field addition

```csharp
// Add to Application.cs:
public int TheoryAttemptCount { get; set; } = 0;

// Also add navigation:
public virtual ICollection<TheoryTest> TheoryTests { get; set; } = [];
```

#### State Transitions

```
Application.Status = TheoryTest (Stage 06 active)
    │
    ├─ Score >= MIN_PASS_SCORE_THEORY
    │   └─ Application.Status → PracticalTest
    │      Application.CurrentStage → "07: Practical"
    │      TheoryAttemptCount += 1
    │
    └─ Score < MIN_PASS_SCORE_THEORY (or IsAbsent = true)
        ├─ AttemptCount + 1 < MAX_THEORY_ATTEMPTS
        │   └─ Application stays in TheoryTest stage
        │      Application.CurrentStage remains "06: Theory"
        │      TheoryAttemptCount += 1
        │      (cooling period enforced at next booking)
        │
        └─ AttemptCount + 1 = MAX_THEORY_ATTEMPTS
            └─ Application.Status → Rejected
               Application.RejectionReason = "MaxTheoryAttemptsReached"
               TheoryAttemptCount += 1
```

### SystemSettings Seeds Required

| Key | Default Value | Type |
|-----|--------------|------|
| `MIN_PASS_SCORE_THEORY` | `80` | int |
| `MAX_THEORY_ATTEMPTS` | `3` | int (already exists per AGENTS.md) |
| `COOLING_PERIOD_DAYS` | `7` | int (already exists per AGENTS.md) |

> ⚠️ `MIN_PASS_SCORE_THEORY` is NOT in the existing AGENTS.md SystemSettings list. It must be added to the seed data.

---

## Phase 2: API Contracts

### Endpoints

#### `POST /api/v1/theory-tests/{appId}/result`

**Authorization**: `[Authorize(Roles = "Examiner")]`

**Request body** (`SubmitTheoryResultRequest`):
```json
{
  "score": 85,
  "isAbsent": false,
  "notes": "Clear lane changes, good signal usage."
}
```

| Field | Type | Validation |
|-------|------|-----------|
| `score` | `int?` | Required when `isAbsent = false`; range 0–100 |
| `isAbsent` | `bool` | Required; defaults to `false` |
| `notes` | `string?` | Optional; max 500 chars |

**Success Response** `201 Created`:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Theory test result recorded successfully.",
  "data": {
    "id": "uuid",
    "applicationId": "uuid",
    "attemptNumber": 1,
    "score": 85,
    "passingScore": 80,
    "result": "Pass",
    "isAbsent": false,
    "conductedAt": "2026-04-09T17:00:00Z",
    "examinerId": "uuid",
    "notes": "Clear lane changes.",
    "applicationStatus": "PracticalTest"
  },
  "errors": null
}
```

**Error Responses**:
- `400`: Application not in `TheoryTest` stage
- `400`: Already at max attempts (before recording)
- `400`: Score required when `isAbsent = false`
- `403`: User is not Examiner
- `404`: Application not found
- `409`: Concurrent result submission conflict

---

#### `GET /api/v1/theory-tests/{appId}/history`

**Authorization**: `[Authorize]` — Applicant (own only), Examiner, Manager, Admin

**Query parameters**: `page`, `pageSize`, `sortDir` (default: `asc` by `ConductedAt`)

**Success Response** `200 OK`:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "uuid",
        "attemptNumber": 1,
        "score": 60,
        "passingScore": 80,
        "result": "Fail",
        "isAbsent": false,
        "conductedAt": "2026-04-01T10:00:00Z",
        "examinerId": "uuid",
        "examinerName": "Ahmed Al-Rashidi",
        "notes": "Did not reach minimum signal count.",
        "retakeEligibleAfter": "2026-04-08T10:00:00Z"
      }
    ],
    "totalCount": 1,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  },
  "errors": null
}
```

---

### Validator (`SubmitTheoryResultValidator`)

```csharp
public class SubmitTheoryResultValidator : AbstractValidator<SubmitTheoryResultRequest>
{
    public SubmitTheoryResultValidator()
    {
        RuleFor(x => x.IsAbsent).NotNull();

        When(x => !x.IsAbsent, () =>
        {
            RuleFor(x => x.Score)
                .NotNull().WithMessage("Score is required when applicant is present.")
                .InclusiveBetween(0, 100).WithMessage("Score must be between 0 and 100.");
        });

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Notes cannot exceed 500 characters.")
            .When(x => x.Notes != null);
    }
}
```

---

## Phase 3: Implementation Layers

### Layer 1: Domain — `Mojaz.Domain`

**Tasks**:
1. Update `TheoryTest.cs` — add `IsAbsent`, make `Score` nullable, add `Examiner` navigation, rename `TestDate` → `ConductedAt`
2. Update `Application.cs` — add `TheoryAttemptCount` field and `TheoryTests` navigation

**Files**:
- `Mojaz.Domain/Entities/TheoryTest.cs` — update
- `Mojaz.Domain/Entities/Application.cs` — update

---

### Layer 2: Application — `Mojaz.Application`

**New interface** (`ITheoryService`):
```csharp
// Mojaz.Application/Interfaces/ITheoryService.cs
public interface ITheoryService
{
    Task<ApiResponse<TheoryTestDto>> SubmitResultAsync(Guid appId, SubmitTheoryResultRequest request, Guid examinerId);
    Task<ApiResponse<PagedResult<TheoryTestDto>>> GetHistoryAsync(Guid appId, Guid? currentUserId, string? currentUserRole, int page, int pageSize);
    Task<bool> IsInCoolingPeriodAsync(Guid appId);              // Used by AppointmentBookingValidator
    Task<bool> HasReachedMaxAttemptsAsync(Guid appId);           // Used by AppointmentBookingValidator
}
```

**New interface** (`ITheoryRepository`):
```csharp
// Mojaz.Application/Interfaces/ITheoryRepository.cs
public interface ITheoryRepository : IRepository<TheoryTest>
{
    Task<TheoryTest?> GetLatestByApplicationIdAsync(Guid applicationId);
    Task<List<TheoryTest>> GetAllByApplicationIdAsync(Guid applicationId);
    Task<int> GetAttemptCountAsync(Guid applicationId);
}
```

**Service logic** (`TheoryService.SubmitResultAsync`):

```
1. Load application by appId — 404 if not found
2. Check application.CurrentStage == ApplicationStages.Theory — 400 if not
3. Check application.TheoryAttemptCount < MAX_THEORY_ATTEMPTS — 400 if at limit
4. Read MIN_PASS_SCORE_THEORY from SystemSettings (default 80, log warn if missing)
5. Determine isPassed:
   - If IsAbsent → isPassed = false, Result = Absent
   - Else if Score >= minPassScore → isPassed = true, Result = Pass
   - Else → isPassed = false, Result = Fail
6. Increment application.TheoryAttemptCount
7. Create TheoryTest record:
   - AttemptNumber = application.TheoryAttemptCount (post-increment)
   - PassingScore = minPassScore
   - ConductedAt = DateTime.UtcNow
8. Transition application based on result:
   - Pass → Status = PracticalTest, CurrentStage = "07: Practical"
   - Fail, not max → Status unchanged (TheoryTest), CurrentStage unchanged
   - Fail, reached max → Status = Rejected, RejectionReason = "MaxTheoryAttemptsReached"
9. await _unitOfWork.SaveChangesAsync()
10. Write AuditLog entry
11. Dispatch notifications (via INotificationService):
    - Pass: TitleAr "اجتزت الاختبار النظري", TitleEn "Theory Test Passed"
    - Fail (retake): TitleAr "لم تجتز الاختبار النظري", TitleEn "Theory Test Not Passed"
    - Terminal rejection: TitleAr "تم إغلاق طلبك", TitleEn "Application Closed"
12. Return ApiResponse<TheoryTestDto>
```

**DTOs** (new folder `Mojaz.Application/DTOs/Theory/`):
- `TheoryTestDto.cs` — response shape (all fields + `retakeEligibleAfter`)
- `SubmitTheoryResultRequest.cs` — request shape
- `TheoryTestHistoryDto.cs` — list item shape with `examinerName`

**AutoMapper profile**: `TheoryMappingProfile.cs`

**Validator**: `SubmitTheoryResultValidator.cs`

**AppointmentBookingValidator changes**:
Add theory-specific gate after the existing Training check:
```csharp
if (request.Type == AppointmentType.TheoryTest)
{
    // Check not at max attempts
    if (await _theoryService.HasReachedMaxAttemptsAsync(request.ApplicationId))
    {
        result.IsValid = false;
        result.Errors.Add("Maximum theory test attempts have been reached for this application.");
        return result;
    }

    // Check cooling period
    if (await _theoryService.IsInCoolingPeriodAsync(request.ApplicationId))
    {
        var latestFail = await /* get latest test date */;
        var coolingDays = await _systemSettingsService.GetIntAsync("COOLING_PERIOD_DAYS") ?? 7;
        var eligibleDate = latestFail.AddDays(coolingDays);
        result.IsValid = false;
        result.Errors.Add($"Cooling period in effect. Earliest retake date: {eligibleDate:yyyy-MM-dd}.");
        return result;
    }
}
```

---

### Layer 3: Infrastructure — `Mojaz.Infrastructure`

**New files**:
- `Mojaz.Infrastructure/Repositories/TheoryRepository.cs` — implements `ITheoryRepository`
- EF Core migration for: `TheoryAttemptCount` on Applications; `IsAbsent` + nullable `Score` + `ConductedAt` rename on TheoryTests; `ExaminerId` foreign key navigation

**EF Core configuration** (`TheoryTestConfiguration.cs` in `Data/Configurations/`):
```csharp
builder.Property(t => t.Notes).HasMaxLength(500);
builder.Property(t => t.Score).IsRequired(false);
builder.HasOne(t => t.Examiner).WithMany().HasForeignKey(t => t.ExaminerId).OnDelete(DeleteBehavior.Restrict);
builder.HasOne(t => t.Application).WithMany(a => a.TheoryTests).HasForeignKey(t => t.ApplicationId).OnDelete(DeleteBehavior.Cascade);
```

**DI Registration** in `InfrastructureServiceRegistration.cs`:
```csharp
services.AddScoped<ITheoryRepository, TheoryRepository>();
```

**DI Registration** in `ApplicationServiceRegistration.cs`:
```csharp
services.AddScoped<ITheoryService, TheoryService>();
services.AddValidatorsFromAssemblyContaining<SubmitTheoryResultValidator>();
```

**Seed data**: Add `MIN_PASS_SCORE_THEORY = 80` to SystemSettings seeder.

---

### Layer 4: API — `Mojaz.API`

**New controller** (`TheoryTestsController.cs`):

```csharp
[ApiController]
[Route("api/v1/theory-tests")]
[Authorize]
[Produces("application/json")]
public class TheoryTestsController : ControllerBase
{
    private readonly ITheoryService _theoryService;

    public TheoryTestsController(ITheoryService theoryService)
        => _theoryService = theoryService;

    /// <summary>Submit a theory test result for an application</summary>
    [HttpPost("{appId}/result")]
    [Authorize(Roles = "Examiner")]
    [ProducesResponseType(typeof(ApiResponse<TheoryTestDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SubmitResult(Guid appId, [FromBody] SubmitTheoryResultRequest request)
    {
        var examinerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _theoryService.SubmitResultAsync(appId, request, examinerId);
        return StatusCode(result.StatusCode, result);
    }

    /// <summary>Get all theory test attempts for an application</summary>
    [HttpGet("{appId}/history")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<TheoryTestDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetHistory(Guid appId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role);
        var result = await _theoryService.GetHistoryAsync(appId, userId, role, page, pageSize);
        return StatusCode(result.StatusCode, result);
    }
}
```

---

### Layer 5: Frontend — `src/frontend`

#### Pages / Routes

| Route | File | Description |
|-------|------|-------------|
| `/[locale]/(employee)/test-results` | existing `page.tsx` | Upgrade from mock → real API integration for theory test recording |
| `/[locale]/(applicant)/applications/[id]` | existing detail page | Extend to show theory test history tab |

#### New Components

| Component | Path | Description |
|-----------|------|-------------|
| `TheoryResultForm` | `components/domain/theory/TheoryResultForm.tsx` | Score input, pass/fail indicator, absent toggle, notes, submit |
| `TheoryHistoryTable` | `components/domain/theory/TheoryHistoryTable.tsx` | Paginated table of attempts; shows retake eligibility date |
| `TestAttemptBadge` | `components/domain/theory/TestAttemptBadge.tsx` | Visual `N/MAX` counter with color coding |

#### New Service

`src/services/theory.service.ts`:
```typescript
export const theoryService = {
  submitResult: (appId: string, data: SubmitTheoryResultRequest) =>
    apiClient.post<ApiResponse<TheoryTestDto>>(`/theory-tests/${appId}/result`, data),

  getHistory: (appId: string, params?: PaginationParams) =>
    apiClient.get<ApiResponse<PagedResult<TheoryTestDto>>>(`/theory-tests/${appId}/history`, { params }),
};
```

#### New Translations

Files: `public/locales/ar/theory.json` and `public/locales/en/theory.json`

Key namespaces:
- `theory.result.title`, `theory.result.score`, `theory.result.absent`
- `theory.result.pass`, `theory.result.fail`
- `theory.result.notes`, `theory.result.submit`
- `theory.history.title`, `theory.history.attempt`, `theory.history.date`, `theory.history.retakeEligible`
- `theory.status.passed`, `theory.status.failed`, `theory.status.absent`
- `theory.error.maxAttempts`, `theory.error.coolingPeriod`

#### New Types

`src/types/theory.types.ts`:
```typescript
export interface SubmitTheoryResultRequest {
  score?: number;
  isAbsent: boolean;
  notes?: string;
}

export interface TheoryTestDto {
  id: string;
  applicationId: string;
  attemptNumber: number;
  score: number | null;
  passingScore: number;
  result: 'Pass' | 'Fail' | 'Absent';
  isAbsent: boolean;
  conductedAt: string;
  examinerId: string;
  examinerName?: string;
  notes?: string;
  retakeEligibleAfter?: string;
  applicationStatus: string;
}
```

---

## Phase 4: Tests

### Backend Unit Tests (`Mojaz.Application.Tests/Services/TheoryServiceTests.cs`)

| Test | Scenario | Expected |
|------|----------|----------|
| `SubmitResult_PassingScore_TransitionsToPracticalTest` | Score >= MIN_PASS_SCORE_THEORY | Status → PracticalTest |
| `SubmitResult_FailingScore_IncreasesAttemptCount` | Score < MIN_PASS_SCORE_THEORY, count < max | AttemptCount + 1 |
| `SubmitResult_FailingScore_AtMaxAttempts_RejectsApplication` | Count = MAX - 1, fail | Status → Rejected |
| `SubmitResult_WhenAbsent_CountsAsFailedAttempt` | IsAbsent = true | AttemptCount + 1, Result = Absent |
| `SubmitResult_BoundaryScore_ExactlyAtPassThreshold_Passes` | Score = 80 exactly | IsPassed = true |
| `SubmitResult_WrongStage_Returns400` | CurrentStage ≠ Theory | 400 error |
| `SubmitResult_AlreadyAtMax_Returns400` | AttemptCount = MAX | 400 before recording |
| `GetHistory_Applicant_CannotSeeOthers` | Applicant requests other's appId | 403 |
| `GetHistory_EmptyHistory_ReturnsEmptyList` | No records | Empty Items list, 200 |

### Backend Integration Tests (Booking Validator)

| Test | Scenario | Expected |
|------|----------|----------|
| `ValidateBooking_TheoryTest_InCoolingPeriod_Blocked` | Last fail < 7 days ago | Error with eligible date |
| `ValidateBooking_TheoryTest_CoolingPeriodElapsed_Allowed` | Last fail >= 7 days ago | Valid |
| `ValidateBooking_TheoryTest_AtMaxAttempts_Blocked` | AttemptCount = MAX | Error message |
| `ValidateBooking_FirstAttempt_NoCoolingCheck` | No prior tests | Passes cooling check |

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| `ConductedAt` rename breaks existing data | Low | Migration uses `RenameColumn` (not drop+add) |
| `Score` nullability migration fails on existing rows | Low | Set `Score = 0` for existing records where `Score IS NULL` before altering to nullable |
| `MIN_PASS_SCORE_THEORY` missing in SystemSettings | Medium | Service defaults to 80 with warning log; add to seed and admin notice |
| Concurrent result submissions (race condition) | Low | Use `_unitOfWork.SaveChangesAsync()` with EF Core concurrency token; return 409 on conflict |
| `AppointmentBookingValidator` injection of `ITheoryService` creates circular DI | Very Low | Both are scoped services; no circularity since Theory doesn't depend on Appointments |

---

## Implementation Order

```
Day 1 (Backend Core):
  1. Update TheoryTest entity (IsAbsent, nullable Score, ConductedAt rename)
  2. Update Application entity (TheoryAttemptCount, TheoryTests navigation)
  3. Create ITheoryRepository + TheoryRepository (Infrastructure)
  4. Create ITheoryService + TheoryService (Application)
  5. Create DTOs, Validator, AutoMapper profile
  6. Register DI in both layers
  7. Create EF Core migration
  8. Add seed data for MIN_PASS_SCORE_THEORY

Day 2 (API + Cooling Period Gate):
  1. Create TheoryTestsController
  2. Add theory cooling period gate to AppointmentBookingValidator
  3. Add ITheoryService injection to AppointmentBookingValidator constructor + DI

Day 3 (Frontend):
  1. Create translation files (ar/en)
  2. Create TypeScript types
  3. Create theory.service.ts
  4. Build TheoryResultForm component
  5. Build TheoryHistoryTable component
  6. Wire test-results/page.tsx to real API

Day 4 (Tests + Polish):
  1. Unit tests for TheoryService
  2. Integration tests for booking validator
  3. Manual E2E verification (search → load → submit → verify status change)
  4. Build verification (backend + frontend)
```
