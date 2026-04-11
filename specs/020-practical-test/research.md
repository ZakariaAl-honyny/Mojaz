# Research: 020 — Practical Test Recording

**Branch**: `020-practical-test` | **Date**: 2026-04-09

---

## Research Summary

All decisions below were resolved by examining the existing Feature 019 (Theory Test) implementation, which established the canonical patterns for this feature. No external unknowns remain.

---

## Decision 1: Entity Gaps in `PracticalTest.cs`

**Decision**: Update `PracticalTest` entity to add `Score`, `IsAbsent`, `PassingScore`, `ConductedAt` fields, and `Examiner` navigation property — mirroring `TheoryTest.cs`.

**Rationale**: The existing `PracticalTest.cs` entity was a placeholder with only `RequiresAdditionalTraining` and `AdditionalHoursRequired` (the Feature 020 differentiators) but missing `Score`, `IsAbsent`, `PassingScore`, and `ConductedAt` — all of which `TheoryTest.cs` has and that the service needs for cooling-period calculation and pass/fail determination.

**Current state** (`PracticalTest.cs`):
```csharp
public Guid ApplicationId { get; set; }
public Guid ExaminerId { get; set; }
public int AttemptNumber { get; set; }
public DateTime TestDate { get; set; } = DateTime.UtcNow;   // ← rename to ConductedAt
public TestResult Result { get; set; }
public string? Notes { get; set; }
public string? VehicleUsed { get; set; }
public bool RequiresAdditionalTraining { get; set; }         // ← already present ✅
public int? AdditionalHoursRequired { get; set; }            // ← already present ✅
```

**Fields to add**: `Score (int?)`, `PassingScore (int)`, `IsAbsent (bool)`, rename `TestDate` → `ConductedAt`, add `Examiner` nav property.

**Alternatives considered**: Keep `TestDate` as-is → rejected, inconsistency with `TheoryTest.ConductedAt` creates confusion in cooling-period calculation logic.

---

## Decision 2: Application Entity — Missing Practical Tracking Fields

**Decision**: Add `PracticalAttemptCount (int, default 0)`, `AdditionalTrainingRequired (bool, default false)`, and `PracticalTests` navigation collection to `Application.cs`.

**Rationale**: `Application.cs` already has `TheoryAttemptCount` (used by `TheoryService`). The practical-test service needs the same counter pattern plus the additional-training flag that gates appointment booking.

**Alternatives considered**: Track attempt count via count-query on `PracticalTests` table → rejected, inconsistent with `TheoryAttemptCount` pattern; adds a JOIN on every relevant service call.

---

## Decision 3: AppointmentBookingValidator — Practical Gate Gap

**Decision**: Extend `AppointmentBookingValidator.ValidateBookingAsync` with a practical-test gate that calls `IPracticalService.IsInCoolingPeriodAsync` and `IPracticalService.HasReachedMaxAttemptsAsync` and `IPracticalService.HasAdditionalTrainingRequiredAsync`.

**Rationale**: The validator already handles the theory test gate (lines 139–162 of `AppointmentBookingValidator.cs`) but has NO equivalent for `AppointmentType.PracticalTest`. The feature spec FR-008, FR-009, FR-010 all require booking to be blocked. Injecting `IPracticalService` into the validator follows the same pattern as the existing `ITheoryService` injection.

**Impact on DI**: `PracticalService` must be registered in `Program.cs` before `AppointmentBookingValidator` is used — registration order matters. Add IPracticalService → PracticalService scoped registration.

**Alternatives considered**: Add the gate check inside `AppointmentService` directly → rejected, `AppointmentBookingValidator` is the established gate-check location (separation of concerns).

---

## Decision 4: Cooling Period — Separate Setting Key

**Decision**: Use `COOLING_PERIOD_DAYS_PRACTICAL` as the SystemSettings key (not the shared `COOLING_PERIOD_DAYS` used by theory).

**Rationale**: The PRD notes practical and theory tests as distinct configurable limits. Using a separate key allows the Admin to configure them independently (e.g., theory = 7 days, practical = 14 days for higher-stakes retesting). In `TheoryService`, "COOLING_PERIOD_DAYS" is used — a legacy generic key. For practical, a specific key avoids ambiguity.

**Alternatives considered**: Reuse `COOLING_PERIOD_DAYS` → rejected, ambiguous when admins change it (unclear which test type is affected).

**Seed data required**: `COOLING_PERIOD_DAYS_PRACTICAL` = 7 (same default, but independently configurable).

---

## Decision 5: Additional-Training Flag — Who Clears It?

**Decision**: `PracticalService.SubmitResultAsync` **sets** `AdditionalTrainingRequired = true` on the `Application` entity when the Examiner marks `RequiresAdditionalTraining = true`. Clearing it is **out of scope for Feature 020** — it will be managed by the Training workflow (Feature 018/TrainingService).

**Rationale**: Spec Section "Assumptions" explicitly states: *"The additional-training flag clearing mechanism is handled by the training workflow — this feature only sets the flag and records required hours."*

**Implication for booking gate**: `IPracticalService.HasAdditionalTrainingRequiredAsync(appId)` simply reads `Application.AdditionalTrainingRequired` — it does not need complex logic.

---

## Decision 6: Frontend Component Strategy — Reuse TestAttemptBadge

**Decision**: The `TestAttemptBadge.tsx` component in `src/frontend/src/components/domain/theory/` will be **reused without moving** — simply imported by `PracticalTestHistory.tsx`. No duplication.

**Rationale**: The badge shows attempt # and pass/fail/absent status — fully generic. Moving it to a shared `ui/` folder is a nice-to-have refactor outside this feature's scope.

**Alternatives considered**: Create a separate `TestAttemptBadge.tsx` in `practical/` → rejected, duplication; copy the logic → rejected for same reason.

---

## Decision 7: SystemSettings Seed Values Required

The following must be present in the database (migration seed or dev data script):

| Key | Default Value | Type | Used By |
|-----|--------------|------|---------|
| `MIN_PASS_SCORE_PRACTICAL` | `80` | int | `PracticalService.SubmitResultAsync` |
| `MAX_PRACTICAL_ATTEMPTS` | `3` | int | `PracticalService.SubmitResultAsync`, `IPracticalService.HasReachedMaxAttemptsAsync` |
| `COOLING_PERIOD_DAYS_PRACTICAL` | `7` | int | `PracticalService.IsInCoolingPeriodAsync` |

---

## Decision 8: No New Notification Event Types Needed

**Decision**: Reuse `NotificationEventType.StatusChanged` for all three notification scenarios (pass, fail, final rejection) — the same approach as `TheoryService`.

**Rationale**: The notification content is differentiated in the title/message strings, not by event type. Adding new enum values (e.g., `PracticalTestPassed`) is a nice-to-have for future analytics filtering but is out of scope for MVP.

---

## All NEEDS CLARIFICATION Resolved

No unresolved clarifications remain. All gaps are addressed above.
