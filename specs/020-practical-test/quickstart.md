# Quickstart: 020 — Practical Test Recording

**Branch**: `020-practical-test` | **Date**: 2026-04-09

This guide walks a developer through implementing Feature 020 from scratch, following the same approach as Feature 019 (Theory Test) with the additional-training flag as the key differentiator.

---

## Step 0: Environment Check

```bash
# Confirm you are on the correct branch
git branch --show-current
# Expected: 020-practical-test

# Confirm backend builds cleanly
cd src/backend
dotnet build Mojaz.sln
```

---

## Step 1: Domain — Update `PracticalTest` Entity

**File**: `src/backend/Mojaz.Domain/Entities/PracticalTest.cs`

Replace the existing placeholder with the full entity (add `Score`, `PassingScore`, `IsAbsent`, rename `TestDate` → `ConductedAt`, add `Examiner` nav).

> Reference: `data-model.md` → Entity 1 field table

---

## Step 2: Domain — Update `Application` Entity

**File**: `src/backend/Mojaz.Domain/Entities/Application.cs`

Add:
```csharp
public int PracticalAttemptCount { get; set; } = 0;
public bool AdditionalTrainingRequired { get; set; } = false;
public virtual ICollection<PracticalTest> PracticalTests { get; set; } = [];
```

---

## Step 3: Application — DTOs

Create directory `src/backend/Mojaz.Application/DTOs/Practical/` with:

- `SubmitPracticalResultRequest.cs` — request body DTO
- `PracticalTestDto.cs` — response DTO

> Reference: `data-model.md` → DTOs section

---

## Step 4: Application — Validator

**File**: `src/backend/Mojaz.Application/Validators/SubmitPracticalResultValidator.cs`

```csharp
// Key rules:
RuleFor(x => x.Score)
    .NotNull().When(x => !x.IsAbsent)
    .InclusiveBetween(0, 100).When(x => x.Score.HasValue);
RuleFor(x => x.Score)
    .Null().When(x => x.IsAbsent);
RuleFor(x => x.AdditionalHoursRequired)
    .NotNull().GreaterThan(0).When(x => x.RequiresAdditionalTraining);
RuleFor(x => x.Notes).MaximumLength(1000);
RuleFor(x => x.VehicleUsed).MaximumLength(200);
```

---

## Step 5: Application — Interfaces

Create:
- `src/backend/Mojaz.Application/Interfaces/IPracticalRepository.cs`
- `src/backend/Mojaz.Application/Interfaces/IPracticalService.cs`

> Reference: `data-model.md` → Interfaces section for exact method signatures

---

## Step 6: Application — AutoMapper Profile

**File**: `src/backend/Mojaz.Application/Mappings/PracticalMappingProfile.cs`

> Reference: `data-model.md` → AutoMapper Profile section

---

## Step 7: Application — `PracticalService`

**File**: `src/backend/Mojaz.Application/Services/PracticalService.cs`

Implement `IPracticalService`. Follow `TheoryService.cs` pattern exactly, with these differences:
1. Uses `PracticalAttemptCount` (not `TheoryAttemptCount`)
2. Uses `MIN_PASS_SCORE_PRACTICAL` and `MAX_PRACTICAL_ATTEMPTS` and `COOLING_PERIOD_DAYS_PRACTICAL` keys
3. Sets `Application.AdditionalTrainingRequired` when `request.RequiresAdditionalTraining = true` on a failing result
4. Stage transition: Pass → `Approved` / `FinalApproval` (not `PracticalTest`)
5. Adds `HasAdditionalTrainingRequiredAsync` method

---

## Step 8: Application — Extend `AppointmentBookingValidator`

**File**: `src/backend/Mojaz.Application/Services/AppointmentBookingValidator.cs`

1. Add `IPracticalService _practicalService` constructor injection
2. After the existing `if (request.Type == AppointmentType.TheoryTest)` block (line ~139), add:

```csharp
if (request.Type == AppointmentType.PracticalTest)
{
    if (await _practicalService.HasReachedMaxAttemptsAsync(request.ApplicationId))
    {
        result.IsValid = false;
        result.Errors.Add("Maximum practical test attempts have been reached.");
        return result;
    }

    if (await _practicalService.HasAdditionalTrainingRequiredAsync(request.ApplicationId))
    {
        result.IsValid = false;
        result.Errors.Add("Additional training is required before booking another practical test.");
        return result;
    }

    if (await _practicalService.IsInCoolingPeriodAsync(request.ApplicationId))
    {
        result.IsValid = false;
        // Compute eligible date for helpful error message
        result.Errors.Add("You are in a cooling period after a failed attempt. Please wait before rebooking.");
        return result;
    }
}
```

---

## Step 9: Infrastructure — `PracticalRepository`

**File**: `src/backend/Mojaz.Infrastructure/Repositories/PracticalRepository.cs`

Implement `IPracticalRepository` — mirror `TheoryRepository.cs` exactly (same 3 methods).

---

## Step 10: Infrastructure — EF Configuration

**File**: `src/backend/Mojaz.Infrastructure/Configurations/PracticalTestConfiguration.cs`

> Reference: `data-model.md` → EF Core Configuration section

---

## Step 11: Infrastructure — Migration

```bash
cd src/backend
dotnet ef migrations add AddPracticalTestFields_020 --project Mojaz.Infrastructure --startup-project Mojaz.API
dotnet ef database update --project Mojaz.Infrastructure --startup-project Mojaz.API
```

Migration adds:
- `PracticalTests.Score (int? nullable)`
- `PracticalTests.PassingScore (int)`
- `PracticalTests.IsAbsent (bool default false)`
- `PracticalTests.ConductedAt (datetime)` — rename from `TestDate` if needed
- `Applications.PracticalAttemptCount (int default 0)`
- `Applications.AdditionalTrainingRequired (bool default false)`
- SystemSettings seed rows for the 3 new keys

---

## Step 12: Infrastructure — Seed SystemSettings

Add a migration seed (or `HasData`) for:

```csharp
new SystemSetting { Key = "MIN_PASS_SCORE_PRACTICAL", Value = "80" },
new SystemSetting { Key = "MAX_PRACTICAL_ATTEMPTS", Value = "3" },
new SystemSetting { Key = "COOLING_PERIOD_DAYS_PRACTICAL", Value = "7" },
```

---

## Step 13: API — `PracticalTestsController`

**File**: `src/backend/Mojaz.API/Controllers/PracticalTestsController.cs`

Mirror `TheoryTestsController.cs` exactly. Route: `api/v1/practical-tests`.

Two actions:
1. `POST {appId}/result` — `[Authorize(Roles = "Examiner")]`
2. `GET {appId}/history` — `[Authorize]`

---

## Step 14: API — DI Registration

**File**: `src/backend/Mojaz.API/Program.cs`

Add after theory service registrations:
```csharp
builder.Services.AddScoped<IPracticalRepository, PracticalRepository>();
builder.Services.AddScoped<IPracticalService, PracticalService>();
```

---

## Step 15: Unit Tests

**File**: `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`

Test cases (naming: `MethodName_Scenario_ExpectedResult`):
- `SubmitResultAsync_PassResult_TransitionsToApproved`
- `SubmitResultAsync_PassResult_SendsPassNotification`
- `SubmitResultAsync_FailResult_IncrementsPracticalAttemptCount`
- `SubmitResultAsync_FailResultWithAdditionalTraining_SetsAdditionalTrainingRequired`
- `SubmitResultAsync_AbsentResult_CountsAsFailedAttempt`
- `SubmitResultAsync_TerminalFail_TransitionsToRejected`
- `SubmitResultAsync_WrongStage_ReturnsBadRequest`
- `SubmitResultAsync_AtMaxAttempts_ReturnsBadRequest`
- `GetHistoryAsync_Applicant_ReturnsOnlyOwnHistory`
- `GetHistoryAsync_OtherApplicant_ReturnsForbidden`
- `IsInCoolingPeriodAsync_WithinPeriod_ReturnsTrue`
- `IsInCoolingPeriodAsync_AfterPeriod_ReturnsFalse`
- `HasAdditionalTrainingRequiredAsync_FlagSet_ReturnsTrue`

---

## Step 16: Frontend — Types

**File**: `src/frontend/src/types/practical.types.ts`

```typescript
export interface PracticalTestDto {
  id: string;
  applicationId: string;
  attemptNumber: number;
  score: number | null;
  passingScore: number;
  result: 'Pass' | 'Fail' | 'Absent';
  isPassed: boolean;
  isAbsent: boolean;
  requiresAdditionalTraining: boolean;
  additionalHoursRequired: number | null;
  vehicleUsed: string | null;
  conductedAt: string;
  examinerId: string;
  examinerName: string | null;
  notes: string | null;
  retakeEligibleAfter: string | null;
  applicationStatus: string;
}

export interface SubmitPracticalResultRequest {
  score?: number;
  isAbsent: boolean;
  requiresAdditionalTraining: boolean;
  additionalHoursRequired?: number;
  vehicleUsed?: string;
  notes?: string;
}
```

---

## Step 17: Frontend — Service

**File**: `src/frontend/src/services/practical.service.ts`

```typescript
export const submitPracticalResult = (appId: string, data: SubmitPracticalResultRequest) =>
  apiClient.post<ApiResponse<PracticalTestDto>>(`/practical-tests/${appId}/result`, data);

export const getPracticalTestHistory = (appId: string, page = 1, pageSize = 20) =>
  apiClient.get<ApiResponse<PagedResult<PracticalTestDto>>>(
    `/practical-tests/${appId}/history`, { params: { page, pageSize } }
  );
```

---

## Step 18: Frontend — Translation Files

Create `src/frontend/public/locales/ar/practical.json` and `en/practical.json` with keys for:
- Form labels, validation messages, result messages
- History table headers, empty state
- Pass/fail/absent badge labels
- Additional training section labels

---

## Step 19: Frontend — Components

1. `PracticalResultForm.tsx` — mirrors `TheoryResultForm.tsx` + adds `requiresAdditionalTraining` toggle and `additionalHoursRequired` input (conditionally shown when toggle is on)
2. `PracticalTestHistory.tsx` — mirrors `TheoryTestHistory.tsx`; imports `TestAttemptBadge` from `theory/`

---

## Step 20: Frontend — Employee Page

**File**: `src/frontend/src/app/[locale]/(employee)/practical-results/page.tsx`

Employee-facing page showing `PracticalResultForm` for current applicant in `PracticalTest` stage.

---

## Step 21: Build & Verify

```bash
# Backend
cd src/backend && dotnet build Mojaz.sln && dotnet test

# Frontend
cd src/frontend && npm run build
```

---

## Completion Checklist

- [ ] Domain entities updated and compiling
- [ ] Migration applied and database updated
- [ ] SystemSettings seed values present
- [ ] `PracticalService` fully implemented
- [ ] `AppointmentBookingValidator` extended with practical gate
- [ ] `PracticalTestsController` wired and returning correct responses
- [ ] DI registrations added
- [ ] Unit tests passing (80%+ coverage on `PracticalService`)
- [ ] Frontend types, service, and components created
- [ ] Translation files complete for AR + EN
- [ ] Frontend builds without TypeScript errors
