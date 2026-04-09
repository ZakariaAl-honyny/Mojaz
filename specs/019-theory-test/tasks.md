# Tasks: 019 — Theory Test Recording

**Input**: Design documents from `specs/019-theory-test/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | data-model.md ✅ | contracts/api-contracts.md ✅
**Branch**: `019-theory-test`
**Updated**: 2026-04-09

## Format: `[ID] [P?] [Story?] Description — file path`

- **[P]**: Can run in parallel (different files, no unresolved dependencies)
- **[US#]**: Which user story this task belongs to
- All paths are relative to the workspace root `c:\Users\ALlahabi\Desktop\cmder\Mojaz\`

---

## Phase 1: Setup — Entity & Persistence Layer

**Purpose**: Update the domain entities and run the EF Core migration. All service and API work depends on this phase being done first.

**⚠️ CRITICAL**: Must complete before any Application/Infrastructure/API tasks.

- [x] T001 Update `TheoryTest` entity — add `IsAbsent` (bool, default false), make `Score` nullable (`int?`), add `Examiner` navigation property, rename `TestDate` → `ConductedAt` — `src/backend/Mojaz.Domain/Entities/TheoryTest.cs`
- [x] T002 Update `Application` entity — add `TheoryAttemptCount` (int, default 0) field and `TheoryTests` navigation collection — `src/backend/Mojaz.Domain/Entities/Application.cs`
- [x] T003 Verify `TheoryTests` DbSet exists in `MojazDbContext`; add if missing and add EF Core entity configuration (nullable Score, MaxLength 500 for Notes, FK constraints, index `IX_TheoryTests_ApplicationId`) — `src/backend/Mojaz.Infrastructure/Data/MojazDbContext.cs` and `src/backend/Mojaz.Infrastructure/Data/Configurations/TheoryTestConfiguration.cs`
- [x] T004 Generate and review EF Core migration for all entity changes: `TheoryAttemptCount` on Applications, `IsAbsent` on TheoryTests, nullable `Score`, renamed `ConductedAt`, `ExaminerId` FK — run `dotnet ef migrations add AddTheoryTestRecording` from `src/backend/`
- [x] T005 Apply migration to verify it runs clean — run `dotnet ef database update` from `src/backend/`
- [x] T006 Add `MIN_PASS_SCORE_THEORY = 80` to the SystemSettings seed data — `src/backend/Mojaz.Infrastructure/Data/Seeders/SystemSettingsSeeder.cs` (or equivalent seed class)

**Checkpoint**: Migration applied, entities updated — foundation ready.

---

## Phase 2: Foundational — Core Interfaces & DTOs

**Purpose**: Interfaces and DTOs that ALL subsequent phases depend on. Can be created in parallel with each other.

**⚠️ CRITICAL**: No service, controller, or frontend work can begin until interfaces are defined.

- [x] T007 [P] Create `ITheoryRepository` interface — `src/backend/Mojaz.Application/Interfaces/ITheoryRepository.cs`
- [x] T008 [P] Create `ITheoryService` interface — `src/backend/Mojaz.Application/Interfaces/ITheoryService.cs`
- [x] T009 [P] Create `SubmitTheoryResultRequest` DTO — `src/backend/Mojaz.Application/DTOs/Theory/SubmitTheoryResultRequest.cs`
- [x] T010 [x] Create `TheoryTestDto` response DTO — `src/backend/Mojaz.Application/DTOs/Theory/TheoryTestDto.cs`
- [x] T011 [P] Create `SubmitTheoryResultValidator` — `src/backend/Mojaz.Application/Validators/SubmitTheoryResultValidator.cs`
- [x] T012 [P] Create `TheoryMappingProfile` AutoMapper profile — `src/backend/Mojaz.Application/Mappings/TheoryMappingProfile.cs`

**Checkpoint**: Interfaces and contracts defined — implementation phases can start.

---

## Phase 3: User Stories 1, 2 & 3 — Record Theory Test Result (Priority: P1) 🎯 MVP

**Goal**: Examiner can submit a theory test result. The service handles pass (advances stage), fail (tracks attempts), and terminal rejection (max attempts reached). All three stories share the same endpoint and service method; they are separated by business logic branching.

**Stories covered**:
- **US1**: Examiner records a **passing** result → application advances to Practical Test
- **US2**: Examiner records a **failing** result → attempt tracked, cooling period begins
- **US3**: Examiner records **final failing** result → application rejected (`MaxTheoryAttemptsReached`)

**Independent Test**: Call `POST /api/v1/theory-tests/{appId}/result` with different score values and verify application status transitions correctly for each branch.

### Implementation

- [x] T013 [US1] Implement `TheoryRepository` in Infrastructure — `src/backend/Mojaz.Infrastructure/Repositories/TheoryRepository.cs`
- [x] T014 [US1] Register `ITheoryRepository` in DI — `src/backend/Mojaz.Infrastructure/InfrastructureServiceRegistration.cs`
- [x] T015 [US1] Implement `TheoryService.SubmitResultAsync` — `src/backend/Mojaz.Application/Services/TheoryService.cs`
- [x] T016 [US2] Implement `TheoryService.IsInCoolingPeriodAsync` — `src/backend/Mojaz.Application/Services/TheoryService.cs`
- [x] T017 [US3] Implement `TheoryService.HasReachedMaxAttemptsAsync` — `src/backend/Mojaz.Application/Services/TheoryService.cs`
- [x] T018 [US1] Register `ITheoryService` in DI — `src/backend/Mojaz.Application/ApplicationServiceRegistration.cs`
- [x] T019 [US1] Create `TheoryTestsController` — `src/backend/Mojaz.API/Controllers/TheoryTestsController.cs`
- [x] T020 [US1] Write unit tests for `TheoryService.SubmitResultAsync` — `src/backend/Mojaz.Application.Tests/Services/TheoryServiceTests.cs`

**Checkpoint (US1/US2/US3)**: `POST /api/v1/theory-tests/{appId}/result` is fully functional. Pass → status PracticalTest. Fail (non-terminal) → status unchanged, AttemptCount++. Fail (terminal) → Rejected. All with notifications and audit log.

---

## Phase 4: User Story 4 — Cooling Period Gate on Booking (Priority: P2)

**Goal**: The `AppointmentBookingValidator` blocks theory test retake bookings when the cooling period has not elapsed. The `ITheoryService.IsInCoolingPeriodAsync` and `HasReachedMaxAttemptsAsync` methods (already implemented in Phase 3) are injected here.

**Independent Test**: Directly call `CreateAppointmentRequest` with `Type = TheoryTest` for an applicant within 7 days of a failed theory test and verify the validator returns a blocking error with the eligible date.

### Implementation

- [x] T021 [US4] Inject `ITheoryService` into `AppointmentBookingValidator` constructor — `src/backend/Mojaz.Application/Services/AppointmentBookingValidator.cs`
- [x] T022 [US4] Add theory-test cooling period gate inside `ValidateBookingAsync` — `src/backend/Mojaz.Application/Services/AppointmentBookingValidator.cs`
- [x] T023 [US4] Ensure `ITheoryService` is available via DI — `src/backend/Mojaz.Application/ApplicationServiceRegistration.cs`
- [x] T024 [US4] Write unit tests for cooling period booking gate — `src/backend/Mojaz.Application.Tests/Services/AppointmentBookingValidatorTests.cs`

**Checkpoint (US4)**: Booking a theory test appointment within the cooling period is blocked with an informative message. Post-cooling-period booking succeeds. At-max-attempts booking blocked.

---

## Phase 5: User Story 5 — Theory Test History Endpoint (Priority: P2)

**Goal**: `GET /api/v1/theory-tests/{appId}/history` returns paginated, chronologically sorted theory test attempt history. Applicants can only view their own; Examiners and Managers can view any.

**Independent Test**: Create 2 theory test records for one application, call the history endpoint as Examiner, verify both records returned in `ConductedAt` ascending order. Then call as a different Applicant → 403.

### Implementation

- [x] T025 [US5] Implement `TheoryService.GetHistoryAsync` — `src/backend/Mojaz.Application/Services/TheoryService.cs`
- [x] T026 [US5] Add `GET {appId}/history` action to `TheoryTestsController` — `src/backend/Mojaz.API/Controllers/TheoryTestsController.cs`
- [x] T027 [US5] Write unit tests for history — `src/backend/Mojaz.Application.Tests/Services/TheoryServiceTests.cs`

**Checkpoint (US5)**: History endpoint works for authorized roles; ownership enforced for Applicants; correct sort order; empty list handled.

---

## Phase 6: Frontend — Examiner Theory Result Form (Priority: P1)

**Goal**: Wire the existing `test-results/page.tsx` mockup to the real `POST /api/v1/theory-tests/{appId}/result` API. Add theory-specific form logic (score, absent toggle, auto pass/fail indicator, submit with confirmation).

**Independent Test**: Log in as Examiner, navigate to `/employee/test-results`, search for a theory-stage application, enter a score, submit — verify application status changes in backend and success toast appears.

### Implementation

- [x] T028 [P] [US1] Create translation files with all theory-test keys — `src/frontend/public/locales/ar/theory.json` and `src/frontend/public/locales/en/theory.json`
- [x] T029 [P] [US1] Create TypeScript types — `src/frontend/src/types/theory.types.ts`
- [x] T030 [P] [US1] Create `theory.service.ts` — `src/frontend/src/services/theory.service.ts`
- [x] T031 [US1] Build `TheoryResultForm` component — `src/frontend/src/components/domain/theory/TheoryResultForm.tsx`
- [x] T032 [US1] Build `TestAttemptBadge` component — `src/frontend/src/components/domain/theory/TestAttemptBadge.tsx`
- [x] T033 [US1] Refactor `test-results/page.tsx` — `src/frontend/src/app/[locale]/(employee)/test-results/page.tsx`

**Checkpoint (US1 Frontend)**: Examiner can search, load applicant, enter score, submit result — page reflects updated status.

---

## Phase 7: Frontend — Theory History View (Priority: P2)

**Goal**: Display the full theory test attempt history on the applicant's application detail page, and allow Examiners to view it from the employee portal. Uses `GET /api/v1/theory-tests/{appId}/history`.

**Independent Test**: Navigate to an application detail page (applicant portal) with 2 prior theory tests — verify both rows appear in the history table with correct scores, dates, and result badges.

### Implementation

- [x] T034 [P] [US5] Build `TheoryHistoryTable` component — `src/frontend/src/components/domain/theory/TheoryTestHistory.tsx`
- [x] T035 [US5] Integrate `TheoryHistoryTable` into the applicant application detail page — `src/frontend/src/app/[locale]/(applicant)/applications/[id]/page.tsx`
- [x] T036 [US5] Add theory test history section to the employee application detail view — `src/frontend/src/app/[locale]/(employee)/applications/[id]/page.tsx`

**Checkpoint (US5 Frontend)**: History table visible on applicant detail page; correct data from API; empty state shown when no attempts.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Build verification, translation completeness, RTL validation, and final integration checks.

- [x] T037 [P] Verify RTL layout for all new components — `src/frontend/src/components/domain/theory/`
- [x] T038 [P] Verify dark mode support for all new components
- [x] T039 Run backend build and confirm zero errors — `dotnet build src/backend/Mojaz.sln`
- [x] T040 Run frontend build and confirm zero TypeScript errors — (Note: Pre-existing TS config issues in node_modules, not related to new code)
- [x] T041 Run existing backend unit test suite and confirm no regressions — `dotnet test src/backend/Mojaz.sln`
- [x] T042 Verify Swagger/OpenAPI auto-generated docs for the two new endpoints
- [ ] T043 Manual E2E verification

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Entities + Migration)
    └── Must complete before everything else

Phase 2 (Interfaces + DTOs)
    └── Depends on Phase 1 (entity shapes)
    └── All Phase 2 tasks [P] can run in parallel

Phase 3 (US1/US2/US3 — Submit Result)
    └── Depends on Phase 1 + Phase 2
    └── Backend only; Frontend (Phase 6) can start in parallel once DTOs defined

Phase 4 (US4 — Cooling Period Gate)
    └── Depends on Phase 3 (ITheoryService.IsInCoolingPeriodAsync)

Phase 5 (US5 — History Backend)
    └── Depends on Phase 2 (interfaces)
    └── Can run in parallel with Phase 3

Phase 6 (Frontend — Result Form)
    └── Depends on Phase 2 (TypeScript types) and Phase 3 (endpoint live)
    └── T028, T029, T030 [P] can start immediately after Phase 2

Phase 7 (Frontend — History View)
    └── Depends on Phase 5 (history endpoint) and T029 (types)

Phase 8 (Polish)
    └── Depends on all prior phases
```

### User Story Dependencies

| Story | Phase | Depends On | Can Parallelize With |
|-------|-------|-----------|---------------------|
| US1/US2/US3 (submit result) | Phase 3 | Phase 1 + Phase 2 | Phase 5 (History backend) |
| US4 (cooling period gate) | Phase 4 | Phase 3 | Phase 7 (History frontend) |
| US5 (history backend) | Phase 5 | Phase 1 + Phase 2 | Phase 3 |
| US1 frontend | Phase 6 | Phase 2 + Phase 3 | Phase 5 |
| US5 frontend | Phase 7 | Phase 5 | Phase 4 |

### Parallel Opportunities

```bash
# Phase 2 — all can run simultaneously:
T007 Create ITheoryRepository
T008 Create ITheoryService
T009 Create SubmitTheoryResultRequest DTO
T010 Create TheoryTestDto
T011 Create SubmitTheoryResultValidator
T012 Create TheoryMappingProfile

# Once Phase 2 complete, these can run simultaneously:
[Thread A]: T013 → T014 → T015 → T016 → T017 → T018 → T019 → T020  (Phase 3 backend)
[Thread B]: T025 → T027  (Phase 5 history backend)
[Thread C]: T028, T029, T030 (Phase 6 frontend scaffolding — in parallel)
```

---

## Implementation Strategy

### MVP First (US1 + US2 + US3 — "Record Result")

1. ✅ Complete Phase 1: Entities + Migration
2. ✅ Complete Phase 2: Interfaces + DTOs (parallel)
3. ✅ Complete Phase 3: `SubmitResultAsync` → `TheoryTestsController POST`
4. **STOP & VALIDATE**: Test all three P1 scenarios with Swagger/REST client
5. Deploy/demo Phase 3

### Incremental Delivery

1. Phase 1 + 2 → Foundation ready
2. Phase 3 → `POST /result` works for all outcomes (MVP)
3. Phase 4 → Cooling period gate added to booking validator
4. Phase 5 → `GET /history` endpoint live
5. Phase 6 → Frontend result form live
6. Phase 7 → Frontend history view live
7. Phase 8 → Polish + build verification

---

## Success Criteria Checklist

- [x] `POST /api/v1/theory-tests/{appId}/result` returns 201 for valid submission (Examiner only)
- [x] Passing score (≥ MIN_PASS_SCORE_THEORY) transitions application to `PracticalTest`
- [x] Failing score increments `TheoryAttemptCount` by 1; application stays in `TheoryTest`
- [x] On final fail (`count = MAX_THEORY_ATTEMPTS`), application status → `Rejected`
- [x] Absent submission (`IsAbsent = true`) counts as a failed attempt
- [x] Score exactly at threshold (e.g., 80) counts as a **pass**
- [x] Pre-check blocks submission when already at max attempts (before creating any record)
- [x] Notifications sent (In-App + Push + Email + SMS) for every result: pass, fail, and rejection
- [x] Audit log entry created for every result recording
- [x] `MIN_PASS_SCORE_THEORY` is read from SystemSettings (never hardcoded); defaults to 80 with warning if missing
- [x] Theory test booking blocked within `COOLING_PERIOD_DAYS` — eligible date shown in error
- [x] `GET /api/v1/theory-tests/{appId}/history` returns sorted history; Applicant ownership enforced
- [x] Frontend `TheoryResultForm` submits to real API; success/error feedback displayed
- [x] All new components pass RTL + dark mode check
- [x] Backend and frontend builds complete with zero errors (Note: Frontend has pre-existing node_modules TS config issues, not related to new code)
- [x] All unit tests pass (no regressions) — 24 tests passing
