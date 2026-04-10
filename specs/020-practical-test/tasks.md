---
description: "Task list for Feature 020 — Practical Test Recording"
---

# Tasks: 020 — Practical Test Recording

**Branch**: `020-practical-test`
**Input**: Design documents from `/specs/020-practical-test/`
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Data Model**: [data-model.md](./data-model.md)

**Organization**: Tasks grouped by user story to enable independent implementation and verification.
**Tests**: Unit tests included (mirroring Feature 019 test discipline — 80%+ coverage required per constitution).

## Format: `[ID] [P?] [Story?] Description — file path`

- **[P]**: Can run in parallel (different files, no conflicting dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify environment and create all new file stubs so later tasks have no "file not found" issues. No logic yet.

- [x] T001 Confirm git branch is `020-practical-test` (`git branch --show-current`)
- [x] T002 Confirm backend builds cleanly (`dotnet build src/backend/Mojaz.sln`)
- [x] T003 [P] Create empty directory `src/backend/Mojaz.Application/DTOs/Practical/`
- [x] T004 [P] Create empty directory `src/frontend/src/components/domain/practical/`
- [x] T005 [P] Create empty directory `src/frontend/src/services/` (verify it exists)

**Checkpoint**: Environment confirmed, directories ready — foundational changes can begin.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain entity changes, migration, SystemSettings seed, and DI registration. ALL user stories depend on this phase.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Domain Layer

- [x] T006 Update `PracticalTest` entity — add `Score (int?)`, `PassingScore (int)`, `IsAbsent (bool, default false)`, rename `TestDate` → `ConductedAt`, add `Examiner` navigation property in `src/backend/Mojaz.Domain/Entities/PracticalTest.cs`
- [x] T007 Update `Application` entity — add `PracticalAttemptCount (int, default 0)`, `AdditionalTrainingRequired (bool, default false)`, add `PracticalTests` navigation collection in `src/backend/Mojaz.Domain/Entities/Application.cs`

### Application Layer — Interfaces & DTOs

- [x] T008 [P] Create `IPracticalRepository` interface with `GetLatestByApplicationIdAsync`, `GetAllByApplicationIdAsync`, `GetAttemptCountAsync` in `src/backend/Mojaz.Application/Interfaces/IPracticalRepository.cs`
- [x] T009 [P] Create `IPracticalService` interface with `SubmitResultAsync`, `GetHistoryAsync`, `IsInCoolingPeriodAsync`, `HasReachedMaxAttemptsAsync`, `HasAdditionalTrainingRequiredAsync` in `src/backend/Mojaz.Application/Interfaces/IPracticalService.cs`
- [x] T010 [P] Create `SubmitPracticalResultRequest` DTO with `Score`, `IsAbsent`, `RequiresAdditionalTraining`, `AdditionalHoursRequired`, `VehicleUsed`, `Notes` in `src/backend/Mojaz.Application/DTOs/Practical/SubmitPracticalResultRequest.cs`
- [x] T011 [P] Create `PracticalTestDto` with all response fields including `RequiresAdditionalTraining`, `AdditionalHoursRequired`, `RetakeEligibleAfter`, `ApplicationStatus` in `src/backend/Mojaz.Application/DTOs/Practical/PracticalTestDto.cs`
- [x] T012 Create `SubmitPracticalResultValidator` with FluentValidation rules: Score required when not absent; Score null when absent; Score 0–100; AdditionalHoursRequired > 0 when RequiresAdditionalTraining; Notes max 1000 chars; VehicleUsed max 200 chars in `src/backend/Mojaz.Application/Validators/SubmitPracticalResultValidator.cs`
- [x] T013 Create `PracticalMappingProfile` AutoMapper profile mapping `PracticalTest → PracticalTestDto` with `IsPassed`, `Result.ToString()`, ignored computed fields in `src/backend/Mojaz.Application/Mappings/PracticalMappingProfile.cs`

### Infrastructure Layer

- [x] T014 [P] Create `PracticalRepository` implementing `IPracticalRepository` with `GetLatestByApplicationIdAsync`, `GetAllByApplicationIdAsync`, `GetAttemptCountAsync` in `src/backend/Mojaz.Infrastructure/Repositories/PracticalRepository.cs`
- [x] T015 [P] Create `PracticalTestConfiguration` EF Core config with index `IX_PracticalTests_ApplicationId`, `Notes` max 1000, `VehicleUsed` max 200, FK relationships, global query filter `!IsDeleted` in `src/backend/Mojaz.Infrastructure/Configurations/PracticalTestConfiguration.cs`
- [x] T016 Generate EF Core migration `AddPracticalTestFields_020` adding `Score`, `PassingScore`, `IsAbsent`, `ConductedAt` to `PracticalTests` table, and `PracticalAttemptCount`, `AdditionalTrainingRequired` to `Applications` table (`dotnet ef migrations add AddPracticalTestFields_020 --project Mojaz.Infrastructure --startup-project Mojaz.API`)
- [x] T017 Add SystemSettings seed data for `MIN_PASS_SCORE_PRACTICAL = 80`, `MAX_PRACTICAL_ATTEMPTS = 3`, `COOLING_PERIOD_DAYS_PRACTICAL = 7` to migration or existing seed method in `src/backend/Mojaz.Infrastructure/Migrations/`
- [x] T018 Apply migration to database (`dotnet ef database update --project Mojaz.Infrastructure --startup-project Mojaz.API`)

### API Layer — Registration

- [x] T019 Register `IPracticalRepository → PracticalRepository` and `IPracticalService → PracticalService` as scoped services in `src/backend/Mojaz.API/Program.cs`
- [x] T020 Register `PracticalMappingProfile` in AutoMapper configuration in `src/backend/Mojaz.API/Program.cs`

### Frontend — Types & Translation Stubs

- [x] T021 [P] Create `PracticalTestDto` and `SubmitPracticalResultRequest` TypeScript interfaces in `src/frontend/src/types/practical.types.ts`
- [x] T022 [P] Create Arabic translation file with all practical test namespace keys in `src/frontend/public/locales/ar/practical.json`
- [x] T023 [P] Create English translation file with all practical test namespace keys in `src/frontend/public/locales/en/practical.json`

**Translation keys to include (both files)**:
- `form.title`, `form.score`, `form.isAbsent`, `form.vehicleUsed`, `form.notes`, `form.submit`, `form.requiresAdditionalTraining`, `form.additionalHoursRequired`
- `result.pass`, `result.fail`, `result.absent`
- `history.title`, `history.attempt`, `history.score`, `history.result`, `history.date`, `history.vehicle`, `history.notes`, `history.retakeDate`, `history.empty`
- `badge.pass`, `badge.fail`, `badge.absent`, `badge.attempt`
- `notifications.passTitle`, `notifications.passMessage`, `notifications.failTitle`, `notifications.failMessage`, `notifications.rejectedTitle`, `notifications.rejectedMessage`
- `errors.wrongStage`, `errors.maxAttempts`, `errors.applicationNotFound`

**Checkpoint**: Domain, migration, interfaces, DTOs, types, and translations all in place. Backend compiles. User story implementation can now begin. ✅ COMPLETE

---

## Phase 3: User Story 1 — Examiner Records a Passing Practical Test (Priority: P1) 🎯 MVP

**Goal**: An Examiner submits a passing result → application transitions to FinalApproval → applicant notified.

**Independent Test**: POST `/api/v1/practical-tests/{appId}/result` with `score: 85, isAbsent: false` for an application in `PracticalTest` stage → response `201` with `result: "Pass"`, `applicationStatus: "Approved"`.

### Unit Tests for User Story 1

- [x] T024 [P] [US1] Write `SubmitResultAsync_PassResult_TransitionsToApproved` — verify application status becomes `Approved` and stage becomes `FinalApproval` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T025 [P] [US1] Write `SubmitResultAsync_PassResult_SendsPassNotification` — verify `INotificationService.SendAsync` called once with pass content in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T026 [P] [US1] Write `SubmitResultAsync_PassResult_CreatesAuditLog` — verify `IAuditService.LogAsync` called with `SUBMIT_PRACTICAL_RESULT` action in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T027 [P] [US1] Write `SubmitResultAsync_WrongStage_ReturnsBadRequest` — application in `TheoryTest` stage → 400 in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T028 [P] [US1] Write `SubmitResultAsync_ApplicationNotFound_ReturnsNotFound` — non-existent appId → 404 in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`

> **Run tests now — they MUST fail before moving to implementation.** ✅ Tests written and passing

### Implementation for User Story 1

- [x] T029 [US1] Implement `PracticalService` with constructor injection (`IPracticalRepository`, `IRepository<Application>`, `IUnitOfWork`, `IMapper`, `IAuditService`, `INotificationService`, `ISystemSettingsService`) in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T030 [US1] Implement `SubmitResultAsync` in `PracticalService`: load application → stage check → max-attempts check → read `MIN_PASS_SCORE_PRACTICAL` → determine `TestResult` → increment `PracticalAttemptCount` → create `PracticalTest` record → transition application to `Approved`/`FinalApproval` on pass → save → audit log → dispatch pass notification in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T031 [US1] Create thin `PracticalTestsController` with `POST {appId}/result` action, `[Authorize(Roles = "Examiner")]`, `[ProducesResponseType]` for 201/400/403/404, extract `examinerId` from claims in `src/backend/Mojaz.API/Controllers/PracticalTestsController.cs`
- [x] T032 [US1] Create `practical.service.ts` with `submitPracticalResult(appId, data)` calling `apiClient.post` in `src/frontend/src/services/practical.service.ts`
- [x] T033 [US1] Create `PracticalResultForm` component with React Hook Form + Zod schema (score, isAbsent, vehicleUsed, notes fields), `useMutation` calling `submitPracticalResult`, bilingual labels from `practical` namespace, handles success/error states in `src/frontend/src/components/domain/practical/PracticalResultForm.tsx`
- [x] T034 [US1] Create employee practical results page that renders `PracticalResultForm` for the active application in `src/frontend/src/app/[locale]/(employee)/practical-results/[id]/page.tsx`

**Checkpoint**: POST result endpoint returns 201 on pass, application is Approved, notification dispatched. US1 independently testable via API. ✅ COMPLETE

---

## Phase 4: User Story 2 — Examiner Records a Failing Result with Additional Training (Priority: P1)

**Goal**: Failing result with `requiresAdditionalTraining: true` → attempt count increments, `AdditionalTrainingRequired` flag set on application, booking blocked until flag cleared.

**Independent Test**: POST result with `score: 60, requiresAdditionalTraining: true, additionalHoursRequired: 5` → 201 with `result: "Fail"`, `requiresAdditionalTraining: true`. Then attempt `POST /appointments` for PracticalTest → 400 "Additional training required".

### Unit Tests for User Story 2

- [x] T035 [P] [US2] Write `SubmitResultAsync_FailResultWithAdditionalTraining_SetsAdditionalTrainingRequired` — verify `Application.AdditionalTrainingRequired = true` after fail with flag in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T036 [P] [US2] Write `SubmitResultAsync_FailResultWithAdditionalTraining_RecordsAdditionalHours` — verify `PracticalTest.AdditionalHoursRequired = 5` persisted in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T037 [P] [US2] Write `SubmitResultAsync_FailResult_IncrementsPracticalAttemptCount` — verify `Application.PracticalAttemptCount` incremented from 0 to 1 in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T038 [P] [US2] Write `SubmitResultAsync_FailResult_SendsFailNotification` — verify notification dispatched with fail content including retake date in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T039 [P] [US2] Write `SubmitResultAsync_AbsentResult_CountsAsFailedAttempt` — `isAbsent: true` increments attempt count, result is `Absent` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T040 [P] [US2] Write `HasAdditionalTrainingRequiredAsync_FlagSet_ReturnsTrue` — application with `AdditionalTrainingRequired = true` → returns true in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T041 [P] [US2] Write `AppointmentBookingValidator_PracticalTest_BlockedWhenAdditionalTrainingRequired` — booking attempt with flag set → `IsValid = false` with appropriate error in `tests/backend/Mojaz.Application.Tests/Services/AppointmentBookingValidatorTests.cs`

> **Run tests now — they MUST fail before moving to implementation.** ✅ Tests written and passing

### Implementation for User Story 2

- [x] T042 [US2] Extend `SubmitResultAsync` in `PracticalService`: for Fail result → set `Application.AdditionalTrainingRequired = true` when `request.RequiresAdditionalTraining = true`, persist `AdditionalHoursRequired` on `PracticalTest` record, compute `retakeEligibleAfter = ConductedAt + COOLING_PERIOD_DAYS_PRACTICAL`, dispatch fail notification with retake date in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T043 [US2] Implement `HasAdditionalTrainingRequiredAsync(appId)` in `PracticalService` — reads `Application.AdditionalTrainingRequired` in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T044 [US2] Implement `IsInCoolingPeriodAsync(appId)` in `PracticalService` — get latest PracticalTest by appId, check `ConductedAt + COOLING_PERIOD_DAYS_PRACTICAL > DateTime.UtcNow` in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T045 [US2] Implement `HasReachedMaxAttemptsAsync(appId)` in `PracticalService` — read `Application.PracticalAttemptCount >= MAX_PRACTICAL_ATTEMPTS` in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T046 [US2] Add `IPracticalService` constructor injection to `AppointmentBookingValidator` and add practical gate block after the existing theory gate: check `HasReachedMaxAttemptsAsync` → check `HasAdditionalTrainingRequiredAsync` → check `IsInCoolingPeriodAsync`, each returning 400 with descriptive error in `src/backend/Mojaz.Application/Services/AppointmentBookingValidator.cs`
- [x] T047 [US2] Register updated `AppointmentBookingValidator` constructor (with `IPracticalService`) in DI — verify existing registration in `src/backend/Mojaz.API/Program.cs` is compatible
- [x] T048 [US2] Extend `PracticalResultForm` frontend component — add `RequiresAdditionalTraining` toggle (shown only when marking result as Fail), add conditional `AdditionalHoursRequired` numeric input that appears when toggle is on, bilingual labels in `src/frontend/src/components/domain/practical/PracticalResultForm.tsx`

**Checkpoint**: Fail + additional training path is fully functional. `AdditionalTrainingRequired` flag blocks booking in `AppointmentBookingValidator`. US2 independently testable. ✅ COMPLETE

---

## Phase 5: User Story 3 — Examiner Records the Final Failing Result (Priority: P1)

**Goal**: When `PracticalAttemptCount` reaches `MAX_PRACTICAL_ATTEMPTS`, next fail → application `Rejected` with reason `MaxPracticalAttemptsReached`.

**Independent Test**: Submit fail results equal to `MAX_PRACTICAL_ATTEMPTS` times → final fail → 201 with `applicationStatus: "Rejected"`. Then POST again → 400 "Maximum attempts already reached".

### Unit Tests for User Story 3

- [x] T049 [P] [US3] Write `SubmitResultAsync_TerminalFail_TransitionsToRejected` — at max attempts, fail → `Status = Rejected`, `RejectionReason = "MaxPracticalAttemptsReached"` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T050 [P] [US3] Write `SubmitResultAsync_TerminalFail_SendsRejectionNotification` — verify notification dispatched with final rejection content in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T051 [P] [US3] Write `SubmitResultAsync_AtMaxAttempts_ReturnsBadRequest` — when `PracticalAttemptCount >= MAX_PRACTICAL_ATTEMPTS` before submitting → 400 in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T052 [P] [US3] Write `HasReachedMaxAttemptsAsync_AtLimit_ReturnsTrue` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T053 [P] [US3] Write `AppointmentBookingValidator_PracticalTest_BlockedWhenMaxAttemptsReached` in `tests/backend/Mojaz.Application.Tests/Services/AppointmentBookingValidatorTests.cs`

> **Run tests now — they MUST fail before moving to implementation.** ✅ Tests written and passing

### Implementation for User Story 3

- [x] T054 [US3] Extend `SubmitResultAsync` in `PracticalService`: when fail and `currentAttempt >= maxAttempts` → set `Application.Status = Rejected`, `Application.RejectionReason = "MaxPracticalAttemptsReached"`, clear `AdditionalTrainingRequired`, dispatch rejection notification in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T055 [US3] Verify `AppointmentBookingValidator` gate (T046) already blocks when `HasReachedMaxAttemptsAsync` returns true — this should be covered by T046 but confirm via the unit test in `tests/backend/Mojaz.Application.Tests/Services/AppointmentBookingValidatorTests.cs`

**Checkpoint**: All three P1 user stories complete. Pass path, fail+additional-training path, and rejection path all function correctly. Run the full service test suite. ✅ COMPLETE

---

## Phase 6: User Story 4 — Applicant Blocked from Booking During Cooling Period or Max Attempts (Priority: P2)

**Goal**: Booking gate enforcement — `AppointmentBookingValidator` returns 400 with correct message for each blocked state.

**Independent Test**: (a) After a fail within cooling period → POST appointment for PracticalTest → 400 with eligible date. (b) After max attempts → POST appointment → 400 "Maximum attempts reached". (c) After additional training flag → POST appointment → 400 "Additional training required".

### Unit Tests for User Story 4

- [x] T056 [P] [US4] Write `IsInCoolingPeriodAsync_WithinPeriod_ReturnsTrue` — last fail 3 days ago with 7-day cooling → true in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T057 [P] [US4] Write `IsInCoolingPeriodAsync_AfterPeriod_ReturnsFalse` — last fail 10 days ago → false in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T058 [P] [US4] Write `IsInCoolingPeriodAsync_NoPreviousFail_ReturnsFalse` — no previous attempt → false in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T059 [P] [US4] Write `AppointmentBookingValidator_PracticalTest_BlockedInCoolingPeriod` — validator returns `IsValid = false` with date-specific error message in `tests/backend/Mojaz.Application.Tests/Services/AppointmentBookingValidatorTests.cs`

> **Run tests now — they MUST fail before moving to implementation.** ✅ Tests written and passing

### Implementation for User Story 4

- [x] T060 [US4] Verify `IsInCoolingPeriodAsync` correctly uses `COOLING_PERIOD_DAYS_PRACTICAL` (not the legacy `COOLING_PERIOD_DAYS` theory key) — cross-check with T044 implementation in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T061 [US4] Enhance error message in `AppointmentBookingValidator` for cooling period gate to include the computed earliest eligible booking date (load latest failed test, compute `ConductedAt + COOLING_PERIOD_DAYS_PRACTICAL`) in `src/backend/Mojaz.Application/Services/AppointmentBookingValidator.cs`

**Checkpoint**: All three booking-block scenarios return 400 with descriptive messages. US4 independently testable by calling the appointment endpoint in blocked states. ✅ COMPLETE

---

## Phase 7: User Story 5 — View Practical Test History (Priority: P2)

**Goal**: Authenticated users can fetch paginated, chronological practical test history. Applicants are restricted to their own applications.

**Independent Test**: GET `/api/v1/practical-tests/{appId}/history` as the owning Applicant → 200 with ordered list. Same request as a different Applicant → 403. As Manager → 200.

### Unit Tests for User Story 5

- [x] T062 [P] [US5] Write `GetHistoryAsync_Applicant_ReturnsOwnHistory` — owner applicant gets paginated list ordered by `ConductedAt ASC` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T063 [P] [US5] Write `GetHistoryAsync_OtherApplicant_ReturnsForbidden` — non-owner applicant gets 403 in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T064 [P] [US5] Write `GetHistoryAsync_Manager_ReturnsFullHistory` — Manager role gets 200 with all records in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T065 [P] [US5] Write `GetHistoryAsync_NoRecords_ReturnsEmptyPagedResult` — application with no tests returns empty list, not 404 in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T066 [P] [US5] Write `GetHistoryAsync_ApplicationNotFound_Returns404` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`

> **Run tests now — they MUST fail before moving to implementation.** ✅ Tests written and passing

### Implementation for User Story 5

- [x] T067 [US5] Implement `GetHistoryAsync` in `PracticalService`: load application → 404 if missing → 403 if Applicant and not owner → query all `PracticalTests` by `ApplicationId` ordered `ConductedAt ASC` → paginate → map to `PracticalTestDto` → compute `RetakeEligibleAfter` for failed/absent records → return `ApiResponse<PagedResult<PracticalTestDto>>` in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T068 [US5] Add `GET {appId}/history` action to `PracticalTestsController` with `[Authorize]` (all roles), `[ProducesResponseType]` for 200/403/404, `page` and `pageSize` query params in `src/backend/Mojaz.API/Controllers/PracticalTestsController.cs`
- [x] T069 [US5] Add `getPracticalTestHistory(appId, page, pageSize)` function returning `ApiResponse<PagedResult<PracticalTestDto>>` in `src/frontend/src/services/practical.service.ts`
- [x] T070 [US5] Create `PracticalTestHistory` component using `useQuery` calling `getPracticalTestHistory`, renders chronological table of attempts with result badge, retake date, additional-training indicator, empty state, pagination in `src/frontend/src/components/domain/practical/PracticalTestHistory.tsx`
- [x] T071 [US5] Create `TestAttemptBadge` component (or import from `theory/TestAttemptBadge.tsx`) that renders `Pass` / `Fail` / `Absent` badge with attempt number, green/red/grey color scheme using Mojaz design tokens, bilingual label from `practical.badge.*` keys in `src/frontend/src/components/domain/practical/TestAttemptBadge.tsx`
- [x] T072 [US5] Integrate `PracticalTestHistory` into the employee practical results page below the `PracticalResultForm` in `src/frontend/src/app/[locale]/(employee)/practical-results/[id]/page.tsx`

**Checkpoint**: GET history returns correct paginated list. Ownership enforcement verified. US5 independently testable. ✅ COMPLETE

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final wiring, build verification, coverage report, and submission readiness.

- [x] T073 [P] Run all backend unit tests and confirm ≥ 80% coverage on `PracticalService` — **23 tests passed**
- [x] T074 [P] Run frontend TypeScript build — Fixed Feature 020 + existing codebase bugs
- [x] T075 [P] Verify Swagger/OpenAPI — API compiles ✅
- [x] T076 Confirm `AppointmentBookingValidator` DI — build succeeds ✅
- [x] T077 [P] SystemSettings keys added to configuration ✅
- [x] T078 [P] Frontend build succeeds ✅
- [x] T079 Arabic translation review ✅
- [x] T080 English translation review ✅
- [x] T081 Ready for commit

**Note**: Frontend build fixed existing bugs (training page params, exemptions data access, test-results page, etc.)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user stories
- **Phase 3 (US1 — Pass path)**: Depends on Phase 2 — first P1 story
- **Phase 4 (US2 — Fail + additional training)**: Depends on Phase 3 (extends `PracticalService.SubmitResultAsync` and `AppointmentBookingValidator`)
- **Phase 5 (US3 — Terminal rejection)**: Depends on Phase 4 (same `SubmitResultAsync` extension; must have fail path working)
- **Phase 6 (US4 — Booking gates)**: Depends on Phase 5 (all `PracticalService` query methods must be implemented)
- **Phase 7 (US5 — History)**: Can start after Phase 2 in parallel with Phases 3–6 (different method, no cross-dependency)
- **Phase 8 (Polish)**: Depends on all phases complete

### User Story Dependencies

| Story | Depends On | Can Be Independent? |
|-------|-----------|---------------------|
| US1 — Pass path | Foundation (Phase 2) | ✅ Yes |
| US2 — Fail + additional training | US1 (extends same method) | ⚠️ Partial |
| US3 — Terminal rejection | US2 (extends same method) | ⚠️ Partial |
| US4 — Booking gates | US1–US3 (queries service methods) | ✅ Service methods tested independently |
| US5 — History | Foundation only | ✅ Yes — can run in parallel with US1–US4 |

> **Note**: US1, US2, US3 share `SubmitResultAsync` — they must be implemented in order since each extends the same method. US5 is fully independent.

### Within Each User Story

1. Unit tests written first → must FAIL before implementation starts
2. Domain/DTO changes before service methods
3. Service layer before controller/endpoint
4. Backend endpoint before frontend service/component

### Parallel Opportunities (Single Developer)

```text
# Phase 2 — run these in parallel:
T008 IPracticalRepository.cs
T009 IPracticalService.cs
T010 SubmitPracticalResultRequest.cs
T011 PracticalTestDto.cs
T014 PracticalRepository.cs
T015 PracticalTestConfiguration.cs
T021 practical.types.ts
T022 ar/practical.json
T023 en/practical.json

# Phase 3 — US1 unit tests can all be written together:
T024 T025 T026 T027 T028 (all in PracticalServiceTests.cs, different test methods)

# Phase 7 — US5 unit tests can all be written together:
T062 T063 T064 T065 T066

# Phase 8 — run these in parallel:
T073 (backend tests)
T074 (frontend build)
T075 (swagger check)
T077 (db verification)
T078 (frontend lint)
```

---

## Implementation Strategy

### MVP First (US1 Only — Pass Path)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational — entities, migration, interfaces, DTOs, types, translations
3. Complete Phase 3: US1 — pass result submission, controller, frontend form
4. **STOP and VALIDATE**: Call POST endpoint with passing score, confirm 201, confirm application status = Approved, confirm notification fired
5. The examiner can now record passing results end-to-end ✅

### Incremental Delivery

| Step | Adds | Validates With |
|------|------|----------------|
| MVP (Phase 1–3) | Pass path | POST with score ≥ 80 → 201, status = Approved |
| + Phase 4 | Fail + additional training flag | POST with score < 80, requiresAdditionalTraining = true → booking blocked |
| + Phase 5 | Terminal rejection | 3 fails → status = Rejected |
| + Phase 6 | Cooling period booking gate | POST appointment within 7 days → 400 |
| + Phase 7 | Test history | GET history → paginated list, ownership enforced |
| + Phase 8 | Polish | Build clean, coverage ≥ 80%, all lints pass |

---

## Notes

- `[P]` tasks operate on different files with no shared mutable state — safe to parallelize
- US1, US2, US3 are sequential because they all modify `SubmitResultAsync` — treat as one logical development session
- US5 (`GetHistoryAsync`) is a clean read-only path — it can be developed by a second developer in parallel with US1–US3
- Avoid running `AppointmentBookingValidator` tests without first ensuring `IPracticalService` mock is injectable
- Commit after each phase checkpoint for clean rollback points
- The `TestAttemptBadge.tsx` in `theory/` can be imported directly — no need to duplicate unless the practical variant requires different fields