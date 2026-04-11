# Research: Application CRUD & Status Tracking (Feature 012)

**Phase**: 0 — Research  
**Branch**: `012-application-crud`  
**Date**: 2026-04-08

---

## Decision 1: Draft vs. Submit — Two Explicit States vs. Single-Step Creation

**Decision**: Implement `Draft` and `Submitted` as two distinct states. Creation always starts as `Draft`. A separate `PATCH /submit` endpoint triggers Gate 1 validation and full FluentValidation before status advances.

**Rationale**: The existing codebase creates applications immediately in `Submitted` state. This is a gap — the spec requires partial data to be storable. Separating Draft and Submit ensures the applicant can save progress without triggering validation errors, matching the PRD's multi-step wizard UX.

**Alternatives Considered**:
- Single-step creation (current implementation) — rejected because partial data cannot be stored.
- Server-side auto-promotion — rejected because it removes user control over submission timing.

---

## Decision 2: Gate 1 Implementation — Where the Eligibility Check Lives

**Decision**: `CheckEligibilityAsync` in `IApplicationService` performs Gate 1 as a discrete, pre-creation check. Gate 1 is also re-run inside `CreateAsync` as a double-check. The eligibility check is exposed as a standalone `GET /api/v1/applications/eligibility?categoryId=` endpoint for the frontend wizard to use before the user reaches the final step.

**Rationale**: Pre-flight eligibility check improves UX — the wizard can show an error early rather than at submission. The double-check inside CreateAsync is a required security backstop (never trust client-only validation).

**Alternatives Considered**:
- Gate 1 only inside CreateAsync — rejected because it means the user fills 5 wizard steps before seeing the error.
- Eligibility baked into the Applicant profile — rejected because it's application-scoped (depends on `categoryId`).

---

## Decision 3: Role-Scoped Data Access — Filter Strategy

**Decision**: Implement role-scoped filtering in the service layer (not the controller). `GetListAsync` receives `userId` + `role` and constructs an `Expression<Func<Application, bool>>` predicate accordingly. The controller stays thin and passes the claims through.

**Mapping**:
- `Applicant` → `a.ApplicantId == userId`
- `Receptionist` → `a.CurrentStage == "DocumentReview"` 
- `Doctor` → `a.CurrentStage == "MedicalExam"`
- `Examiner` → `a.CurrentStage == "Testing"`
- `Manager`, `Admin` → no filter (all applications)

**Rationale**: Service layer enforcement is required by Constitution Principle II (security ownership validated in service, not controller). Using `CurrentStage` string matching is appropriate since stage values are controlled enum-like values set by the workflow.

**Alternatives Considered**:
- Policy-based authorization filter in controller — rejected because ownership logic belongs in service layer per Clean Architecture.
- Database-level row security — rejected as over-engineered for MVP.

---

## Decision 4: Rich Filter Support on GetListAsync

**Decision**: Introduce a dedicated `ApplicationFilterRequest` DTO to carry all filter parameters instead of bloating the method signature. Filters: `status`, `currentStage`, `serviceType`, `licenseCategoryId`, `branchId`, `search` (ApplicationNumber or applicant name), `from`, `to`, `sortBy` (default: `createdAt`), `sortDir` (default: `desc`).

**Rationale**: The existing `GetListAsync(userId, role, int page, int pageSize)` signature does not support any of the 8 required filters from FR-009. A DTO-based approach is cleaner and extensible.

**Alternatives Considered**:
- Individual method parameters — rejected as unreadable and non-extensible (8+ params).
- OData filter support — rejected as over-engineered for MVP.

---

## Decision 5: ApplicationNumber Uniqueness Guarantee

**Decision**: `GenerateApplicationNumber()` uses a retry loop (max 5 attempts). On each attempt, generate a random 8-digit number, check uniqueness against the DB. If all 5 attempts collide (statistically negligible), throw a `ApplicationNumberGenerationException` and alert via Serilog.

**Rationale**: The existing implementation generates without collision checking. With low MVP volume this is acceptable but the spec requires guaranteed uniqueness. The retry loop is a minimal addition.

**Alternatives Considered**:
- DB sequence/identity — rejected because the format `MOJ-YYYY-8digits` requires random-looking numbers, not sequential.
- GUID suffix — rejected because it violates the `MOJ-{YEAR}-{8 digits}` format requirement.

---

## Decision 6: Timeline Endpoint Implementation

**Decision**: `GetTimelineAsync` queries `ApplicationStatusHistory` ordered by `ChangedAt` ASC. Returns `ApplicationTimelineDto` with `FromStatus`, `ToStatus`, `ChangedAt`, `ChangedBy` (user display name), and `Notes/Reason`.

**Rationale**: `ApplicationStatusHistory` entity is already defined in the domain with all required fields. The timeline endpoint is a simple ordered query, no complex aggregation needed.

**Gap Found**: The current `ApplicationStatusHistory` entity has `Notes` but no `Reason` field separate from notes. The `CancellationReason` on the Application entity should also be surfaced in the timeline. Both fields should be included in the `Notes` string when writing history records for cancellation events.

---

## Decision 7: Expired Applications Background Job

**Decision**: Implement `ProcessExpiredApplicationsJob` as a Hangfire `IRecurringJob` registered with a daily CRON schedule (`0 2 * * *` — 2 AM UTC). The job queries all non-terminal applications where `ExpiresAt < DateTime.UtcNow`, transitions each to `ApplicationStatus.Expired`, creates an `ApplicationStatusHistory` record, and writes an `AuditLog` entry per application.

**New Status Needed**: `Expired` is not in the current `ApplicationStatus` enum. It must be added: `Draft, Submitted, InReview, DocumentReview, MedicalExam, TheoryTest, PracticalTest, Approved, Payment, Issued, Active, Rejected, Cancelled, Expired`.

**Rationale**: Hangfire is already registered in the infrastructure. A daily job at 2 AM UTC is a standard pattern for maintenance jobs. The new `Expired` status is a separate terminal state from `Cancelled` to preserve audit clarity.

**Alternatives Considered**:
- Setting status to `Cancelled` for expired apps — rejected because it conflates user-initiated with system-initiated closure.
- On-demand check per request — rejected as it creates inconsistency (expiry detected only on fetch).

---

## Decision 8: Submit Endpoint — Full FluentValidation

**Decision**: `SubmitAsync` calls a dedicated `SubmitApplicationValidator` (separate from the draft save validator) which enforces all mandatory fields. The validator is the single source of truth for what "complete" means.

**Required mandatory fields for submission**:
- `ServiceType` (non-default)
- `LicenseCategoryId` (non-empty Guid)
- `NationalId` (non-empty — on the User record)
- `DateOfBirth` (non-default)
- `Gender` (non-empty)
- `Nationality` (non-empty)
- `DataAccuracyConfirmed` (must be `true`)

**Rationale**: Separating draft-save and submission validators allows partial data at any point before submission without forcing all fields to be provided at once.

---

## Decision 9: Notification Events — Async Dispatch via Hangfire

**Decision**: Per Constitution Principle VII — In-App notifications created synchronously; Push/Email/SMS dispatched via Hangfire `_backgroundJobClient.Enqueue`. Notification events for application submission: In-App + Push + Email. For cancellation: In-App + Push.

**Rationale**: Existing pattern in `ApplicationService.CreateAsync` already follows this with `_backgroundJobClient.Enqueue(() => _emailService.SendTemplatedAsync(...))`. The pattern is consistent.

---

## Decision 10: Missing IApplicationService Methods — Gap vs. Current Implementation

The following methods exist in the spec but are **missing or incomplete** in the current `IApplicationService`:

| Method | Current State | Action Required |
|--------|---------------|-----------------|
| `SubmitAsync` | Missing (only `UpdateStatusAsync` exists) | Add dedicated submit with validation + status history |
| `UpdateDraftAsync` | `UpdateAsync` exists but does not enforce Draft-only | Rename + add Draft-status guard |
| `GetTimelineAsync` | Missing | Add new method querying `ApplicationStatusHistory` |
| `CheckEligibilityAsync` | Missing (Gate 1 is inline in `CreateAsync`) | Extract to standalone method |
| Filter-enabled `GetListAsync` | Missing (only `page`/`pageSize` supported) | Extend with `ApplicationFilterRequest` |
| Role-scoped filtering | Partial (only Applicant) | Add Receptionist, Doctor, Examiner scoping |

These gaps are the primary implementation targets for this feature.
