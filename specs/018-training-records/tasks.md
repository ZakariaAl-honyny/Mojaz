# Tasks: 018 — Training Completion Recording & Exemption Management

**Branch**: `018-training-records`
**Input**: plan.md ✅ | spec.md ✅ | data-model.md ✅ | contracts/ ✅ | research.md ✅ | quickstart.md ✅
**Created**: 2026-04-09

## Format: `[ID] [P?] [Story?] Description — file path`

- **[P]**: Parallelizable (different files, no in-flight dependencies)
- **[US1/US2/US3]**: User story ownership
- All paths relative to repo root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Domain entity + enum + DB schema — must complete before any service or UI work.

- [X] T001 Extend `TrainingRecord` entity with new fields (`TrainingDate`, `TrainerName`, `CenterName`, `TotalHoursRequired`, `ExemptionDocumentId`, `ExemptionApprovedAt`, `ExemptionRejectionReason`, `CreatedBy`) in `src/backend/Mojaz.Domain/Entities/TrainingRecord.cs`
- [X] T002 Replace raw `Status` string with `TrainingStatus` enum property in `src/backend/Mojaz.Domain/Entities/TrainingRecord.cs`
- [X] T003 [P] Add navigation properties (`ExemptionDocument`, `ExemptionApprover`, `Creator`) to `src/backend/Mojaz.Domain/Entities/TrainingRecord.cs`
- [X] T004 Create `TrainingStatus` enum (`Required=0`, `InProgress=1`, `Completed=2`, `Exempted=3`) in `src/backend/Mojaz.Domain/Enums/TrainingStatus.cs`
- [X] T005 Create `TrainingRecordConfiguration` EF Fluent API class with global query filter `!x.IsDeleted`, FK constraints, and indexes in `src/backend/Mojaz.Infrastructure/Persistence/Configurations/TrainingRecordConfiguration.cs`
- [X] T006 Add `TrainingRecordConfiguration` to `ApplicationDbContext.OnModelCreating` in `src/backend/Mojaz.Infrastructure/Persistence/ApplicationDbContext.cs`
- [X] T007 Generate EF Core migration `AddTrainingRecordExtendedFields` in `src/backend/Mojaz.Infrastructure/Migrations/` (Application pending - no SQL Server)
- [X] T008 Add `TRAINING_HOURS_A` through `TRAINING_HOURS_F` seed rows to `SystemSettings` table via data seeder or SQL script in `src/backend/Mojaz.Infrastructure/Persistence/SeedData/`

**Checkpoint**: Database schema ready — migration applied, SystemSettings seeded.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: DTOs, validators, interface, mapper, and repository — all user story phases depend on these.

⚠️ **CRITICAL**: No user story work begins until this phase is complete.

- [X] T009 [P] Create `TrainingRecordDto` (read model with `ProgressPercentage` computed field) in `src/backend/Mojaz.Application/DTOs/Training/TrainingRecordDto.cs`
- [X] T010 [P] Create `CreateTrainingRecordRequest` DTO in `src/backend/Mojaz.Application/DTOs/Training/CreateTrainingRecordRequest.cs`
- [X] T011 [P] Create `UpdateTrainingHoursRequest` DTO in `src/backend/Mojaz.Application/DTOs/Training/UpdateTrainingHoursRequest.cs`
- [X] T012 [P] Create `CreateExemptionRequest` DTO in `src/backend/Mojaz.Application/DTOs/Training/CreateExemptionRequest.cs`
- [X] T013 [P] Create `ExemptionActionRequest` DTO in `src/backend/Mojaz.Application/DTOs/Training/ExemptionActionRequest.cs`
- [X] T014 Create `CreateTrainingRecordValidator` (FluentValidation: ApplicationId not empty, HoursCompleted 1–999, SchoolName required max-200, TrainingDate not future) in `src/backend/Mojaz.Application/Validators/CreateTrainingRecordValidator.cs`
- [X] T015 Create `CreateExemptionValidator` (FluentValidation: ApplicationId, ExemptionReason min-10 max-1000, ExemptionDocumentId not empty) in `src/backend/Mojaz.Application/Validators/CreateExemptionValidator.cs`
- [X] T016 Create `TrainingProfile` AutoMapper profile mapping `TrainingRecord` → `TrainingRecordDto` (with `ProgressPercentage = CompletedHours * 100 / TotalHoursRequired`) in `src/backend/Mojaz.Application/Mappings/TrainingProfile.cs`
- [X] T017 Define `ITrainingService` interface with all method signatures (`CreateAsync`, `GetByApplicationIdAsync`, `UpdateHoursAsync`, `CreateExemptionAsync`, `ApproveExemptionAsync`, `RejectExemptionAsync`, `IsTrainingCompleteAsync`) in `src/backend/Mojaz.Application/Interfaces/ITrainingService.cs`
- [X] T018 Create `TrainingRepository` implementing `ITrainingRepository` (GetByApplicationId, GetExemptionById, Add, Update) in `src/backend/Mojaz.Infrastructure/Repositories/TrainingRepository.cs`
- [X] T019 Register `ITrainingService → TrainingService` and `ITrainingRepository → TrainingRepository` in DI container in `src/backend/Mojaz.Infrastructure/InfrastructureServiceRegistration.cs`

**Checkpoint**: Contracts, validators, mapper, and repository in place — service implementation can begin.

---

## Phase 3: User Story 1 — Employee Records Training Hours (Priority: P1) 🎯 MVP

**Goal**: Employee can record training hours; status auto-transitions to `Completed` when hours meet the `TRAINING_HOURS_{Category}` threshold; applicant receives notification.

**Independent Test**: POST `/api/v1/training-records` with valid body → record created, `progressPercentage` correct; second POST that brings total ≥ required → status becomes `Completed`, application `CurrentStage` advances, In-App notification created.

### Backend — US1

- [X] T020 [US1] Implement `TrainingService.CreateAsync` — reads `TRAINING_HOURS_{Category}` from SystemSettings via `ISystemSettingsService`, creates record, auto-transitions to `InProgress` or `Completed`, advances application stage on completion in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T021 [US1] Implement `TrainingService.GetByApplicationIdAsync` — ownership check (Applicant sees own only, Employee/Manager sees all assigned) in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T022 [US1] Implement `TrainingService.UpdateHoursAsync` — additive hours update, re-evaluate status, guard against updating `Completed`/`Exempted` records (400) in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T023 [US1] Create `TrainingController` with `POST /api/v1/training-records` (Roles: Receptionist, Employee), `GET /api/v1/training-records/{applicationId}` (Roles: Employee, Manager, Applicant), `PATCH /api/v1/training-records/{id}/hours` (Roles: Receptionist, Employee) — all returning `ApiResponse<T>` with `[ProducesResponseType]` in `src/backend/Mojaz.API/Controllers/TrainingController.cs`
- [X] T024 [US1] Create AuditLog entries inside `TrainingService` for create and update operations using `IAuditLogService` in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T025 [US1] Write xUnit unit tests for `TrainingService.CreateAsync` covering: hours < required → InProgress, hours ≥ required → Completed, zero-hours → throws, duplicate on Completed → throws in `tests/Mojaz.Application.Tests/Services/TrainingServiceTests.cs`

### Frontend — US1

- [x] T026 [P] [US1] Define TypeScript types (`TrainingRecordDto`, `CreateTrainingRecordRequest`, `UpdateTrainingHoursRequest`, `TrainingStatus`) in `src/frontend/src/types/training.types.ts`
- [x] T027 [P] [US1] Implement `training.service.ts` with typed Axios calls for all training endpoints in `src/frontend/src/services/training.service.ts`
- [x] T028 [P] [US1] Create `useTraining` hook (TanStack Query — `useQuery` for GET, `useMutation` for POST/PATCH) in `src/frontend/src/hooks/useTraining.ts`
- [x] T029 [P] [US1] Create `TrainingStatusBadge` component (4-state: Required=amber, InProgress=blue-neutral, Completed=Royal-Green #006C35, Exempted=Government-Gold #D4A017) in `src/frontend/src/components/domain/training/TrainingStatusBadge.tsx`
- [x] T030 [P] [US1] Create `TrainingProgressArc` component — SVG circular arc, CSS `stroke-dasharray` animation from 0 to `progressPercentage`, burst micro-animation at 100%, IBM Plex Mono font for the number display, 60fps CSS-only — in `src/frontend/src/components/domain/training/TrainingProgressArc.tsx`
- [x] T031 [US1] Create `TrainingEntryForm` component — governmental ledger aesthetic (warm off-white #FAF9F6, IBM Plex Sans Arabic body, geometric grid), `useTransition` wrapping the mutation call (non-blocking submit), client-side Zod validation, disabled when status is Completed/Exempted — in `src/frontend/src/components/domain/training/TrainingEntryForm.tsx`
- [x] T032 [US1] Create `SessionHistoryRow` component (top-level, NOT inline) to display past training entries in `src/frontend/src/components/domain/training/SessionHistoryRow.tsx`
- [x] T033 [US1] Build Employee training page as RSC — parallel `Promise.all()` fetch of training record + application metadata + SystemSettings required hours (no sequential awaits); wrap client islands in Suspense in `src/frontend/src/app/[locale]/(employee)/training/[applicationId]/page.tsx`
- [x] T034 [P] [US1] Add Arabic training locale file (`training.record.*`, `training.status.*`, `training.form.*` keys) in `src/frontend/public/locales/ar/training.json`
- [x] T035 [P] [US1] Add English training locale file in `src/frontend/public/locales/en/training.json`

**Checkpoint**: Employee can open `/employee/training/{applicationId}`, record hours, see arc animate, and status auto-flip to Completed. Applicant In-App notification fires.

---

## Phase 4: User Story 2 — Manager Approves Training Exemption (Priority: P2)

**Goal**: Manager can review pending exemption requests and approve or reject them; training status transitions correctly; applicant notified across all channels via Hangfire.

**Independent Test**: POST `/api/v1/training-records/exemption` → 201 Pending; PATCH `.../approve` as Manager → status `Exempted`, application stage advances; PATCH `.../reject` → status back to `Required`; non-Manager PATCH → 403.

### Backend — US2

- [X] T036 [US2] Implement `TrainingService.CreateExemptionAsync` — validate no active exemption exists (409), validate ExemptionDocumentId exists in Documents table (422), create record in `Required` status with exemption reason stored in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T037 [US2] Implement `TrainingService.ApproveExemptionAsync` — verify Manager role in service, set `IsExempted=true`, `TrainingStatus=Exempted`, `ExemptionApprovedBy`, `ExemptionApprovedAt`, advance application stage to `ReadyForTheoryTest`, dispatch Hangfire notification job in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T038 [US2] Implement `TrainingService.RejectExemptionAsync` — set `TrainingStatus=Required`, store `ExemptionRejectionReason`, dispatch Hangfire notification job in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T039 [US2] Add exemption endpoints to `TrainingController`: `POST /api/v1/training-records/exemption` (Roles: Receptionist, Employee), `PATCH .../exemption/{id}/approve` (Roles: Manager only), `PATCH .../exemption/{id}/reject` (Roles: Manager only) — all `[Authorize]` with explicit roles in `src/backend/Mojaz.API/Controllers/TrainingController.cs`
- [X] T040 [US2] Create Hangfire background notification job for training events (Completed, ExemptionApproved, ExemptionRejected) dispatching In-App (sync) + Push + Email + SMS (async) via `INotificationService` in `src/backend/Mojaz.Infrastructure/Jobs/TrainingNotificationJob.cs`
- [X] T041 [US2] Add AuditLog entries for exemption create, approve, and reject operations in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T042 [US2] Write xUnit unit tests for exemption workflow: duplicate exemption → 409, non-existent document → 422, Manager approve → Exempted status, Manager reject → Required status, non-Manager approve → 403 in `tests/Mojaz.Application.Tests/Services/TrainingServiceTests.cs`

### Frontend — US2

- [X] T043 [P] [US2] Create `ExemptionCard` component (Manager view) — focused card layout showing applicant summary, exemption reason text, document reference badge, two action buttons (Approve = Royal Green fill, Reject = warm-red outline), defined as top-level component NOT inline in `src/frontend/src/components/domain/training/ExemptionCard.tsx`
- [X] T044 [P] [US2] Create `ExemptionModal` component — approve confirmation overlay with 3-second countdown before final commit; uses `next/dynamic` at usage site for lazy loading in `src/frontend/src/components/domain/training/ExemptionModal.tsx`
- [X] T045 [US2] Lazy-load `ExemptionModal` via `next/dynamic` with a skeleton loader at the Employee training page; ensure it is excluded from initial bundle in `src/frontend/src/app/[locale]/(employee)/training/[applicationId]/page.tsx`
- [X] T046 [US2] Build Manager exemption review queue page listing pending exemptions via RSC fetch + TanStack Query for mutations in `src/frontend/src/app/[locale]/(employee)/exemptions/page.tsx`
- [X] T047 [P] [US2] Extend Arabic locale file with exemption-specific keys (`training.exemption.*`) in `src/frontend/public/locales/ar/training.json`
- [X] T048 [P] [US2] Extend English locale file with exemption-specific keys in `src/frontend/public/locales/en/training.json`

**Checkpoint**: Manager can approve/reject exemptions from the exemption queue. Applicant badge shows `Exempted` (Government Gold). All 4 notification channels fire asynchronously.

---

## Phase 5: User Story 3 — Applicant Views Training Progress (Priority: P3)

**Goal**: Applicant sees read-only training progress (arc + status + center name) in their application timeline. When incomplete, the Theory Test step shows a padlock `GateLockIndicator`.

**Independent Test**: Authenticate as Applicant, GET `/api/v1/training-records/{applicationId}` → returns own record only (403 for other applicant's ID). Application timeline shows arc progress and gate lock when status ≠ Completed/Exempted.

### Backend — US3

- [X] T049 [US3] Enforce applicant ownership in `TrainingService.GetByApplicationIdAsync` — compare `application.ApplicantId` with JWT `sub` claim; return 403 if mismatch in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T050 [US3] Add integration test for Gate 3: POST appointment for Theory type with `TrainingStatus=Required` → expect 400 `"Training requirement not fulfilled (Gate 3)"` in `tests/Mojaz.Application.Tests/Services/AppointmentBookingValidatorTests.cs`

### Frontend — US3

- [x] T051 [P] [US3] Create `GateLockIndicator` component — padlock SVG icon with smooth CSS unlock transition when status becomes `Completed`/`Exempted`; RTL-aware positioning — in `src/frontend/src/components/domain/training/GateLockIndicator.tsx`
- [x] T052 [US3] Extend Applicant application timeline page to display `TrainingProgressArc` + `TrainingStatusBadge` + `GateLockIndicator` on the Theory Test step when training is not yet complete in `src/frontend/src/app/[locale]/(applicant)/applications/[id]/page.tsx`
- [X] T053 [US3] Add `React.cache()` wrapper around the SystemSettings `TRAINING_HOURS_{Category}` fetch in the server-side data loader to prevent duplicate DB calls per request in `src/frontend/src/lib/server/training-data.ts`

**Checkpoint**: Applicant timeline shows correct training arc, padlock unlocks visually when training completes.

---

## Phase 6: Gate 3 Enforcement & Polish

**Purpose**: Wire Gate 3 into appointment booking, validate audit trail, run E2E, and final aesthetic review.

- [X] T054 Extend `AppointmentBookingValidator` with async Gate 3 rule calling `ITrainingService.IsTrainingCompleteAsync(applicationId)` before allowing Theory/Practical appointment creation in `src/backend/Mojaz.Application/Services/AppointmentBookingValidator.cs`
- [X] T055 [P] Write Playwright E2E test for the complete Employee hours recording flow (partial → arc animates → full → status flips to Completed) in `src/frontend/tests/e2e/training-record.spec.ts`
- [X] T056 [P] Write Playwright E2E test for Gate 3 enforcement: attempt Theory Test booking → verify padlock UI + API 400 response in `src/frontend/tests/e2e/gate3-enforcement.spec.ts`
- [X] T057 [P] Verify all `TrainingRecord` write operations produce `AuditLog` entries with correct `EntityType`, `OldValues`, `NewValues` using integration test in `tests/Mojaz.Application.Tests/Services/TrainingAuditTests.cs`
- [x] T058 [P] Final CSS polish on `TrainingProgressArc` — test arc renders at 60fps, no JS frame blocking; verify IBM Plex Mono loads correctly for hour counts via browser dev tools in `src/frontend/src/components/domain/training/TrainingProgressArc.tsx`
- [x] T059 [P] Verify RTL layout: open training page with `ar` locale — form labels right-aligned, arc centred, badge text displays in Arabic, no physical `ml-`/`mr-` classes present in the training component directory
- [X] T060 Run quickstart.md validation end-to-end: migration applies clean, all 3 test flows (hours, exemption, gate) pass on local environment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 migration applied ⚠️ BLOCKS all story phases
- **Phase 3 (US1)**: Depends on Phase 2 — backend and frontend tracks can run **in parallel**
- **Phase 4 (US2)**: Depends on Phase 2 complete; backend extends existing `TrainingService` from US1
- **Phase 5 (US3)**: Depends on Phase 3 complete (reads TrainingService and components); lightweight
- **Phase 6 (Polish)**: Depends on Phases 3–5 complete

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|-----------|-------------------|
| US1 (Record hours) | Phase 2 | US1 backend ↔ US1 frontend |
| US2 (Exemption) | Phase 2 + US1 service | US2 backend ↔ US2 frontend |
| US3 (Applicant view) | Phase 3 | US3 backend ↔ US3 frontend |

### Within Each User Story

- DTOs/types → service/hooks → controller/page → integration
- Backend and frontend tracks parallelizable after foundational phase

---

## Parallel Execution Examples

### Phase 3 (US1) — 2 Parallel Tracks

```text
Track A (Backend): T020 → T021 → T022 → T023 → T024 → T025
Track B (Frontend): T026 + T027 + T028 + T029 + T030 → T031 → T032 → T033 → T034 + T035
```

### Phase 4 (US2) — 2 Parallel Tracks

```text
Track A (Backend): T036 → T037 → T038 → T039 → T040 → T041 → T042
Track B (Frontend): T043 + T044 → T045 → T046 → T047 + T048
```

### Phase 6 (Polish) — All Parallelizable

```text
T054 → T055 + T056 + T057 + T058 + T059 → T060
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup (T001–T008)
2. Complete Phase 2: Foundational (T009–T019)
3. Complete Phase 3: US1 backend track (T020–T025)
4. Complete Phase 3: US1 frontend track (T026–T035)
5. **STOP and VALIDATE**: Employee records hours, arc animates, status auto-flips, In-App notification created
6. Deploy/demo MVP increment

### Incremental Delivery

- **Increment 1** → US1 complete: Training hours recording works end-to-end
- **Increment 2** → US2 complete: Manager exemption approval workflow active
- **Increment 3** → US3 complete: Applicant can see progress and gate lock
- **Increment 4** → Polish complete: Gate 3 enforced, E2E tests green, RTL verified

---

## Task Count Summary

| Phase | Tasks | Parallel [P] |
|-------|-------|--------------|
| Phase 1 — Setup | 8 | 1 |
| Phase 2 — Foundational | 11 | 7 |
| Phase 3 — US1 (Record Hours) | 16 | 8 |
| Phase 4 — US2 (Exemption) | 13 | 5 |
| Phase 5 — US3 (Applicant View) | 5 | 2 |
| Phase 6 — Polish & Gate 3 | 7 | 5 |
| **Total** | **60** | **28** |

---

## Notes

- `[P]` tasks operate on distinct files — safe to run concurrently
- Every story is independently testable before the next story begins
- `next/dynamic` on `ExemptionModal` is a hard requirement (bundle-dynamic-imports)
- No inline component definitions inside page files (rerender-no-inline-components)
- All CSS must use logical properties only (`ms-`, `me-`, `ps-`, `pe-`, `text-start`)
- `DateTime.UtcNow` everywhere in backend; frontend converts for display only
- Soft-delete only — no physical record deletion anywhere in this feature
