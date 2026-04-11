# Tasks: 020 — Practical Test Recording

**Branch**: `020-practical-test`
**Input**: Design documents from `/specs/020-practical-test/`
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Data Model**: [data-model.md](./data-model.md)

## Format: `[ID] [P?] [Story?] Description — file path`

- **[P]**: Can run in parallel (different files, no conflicting dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- All paths are relative to repo root

---

## Phase 1: Setup (Initialize structure, configs, dependencies)

**Purpose**: Verify environment and create all new file stubs.

- [x] T001 Confirm git branch is `020-practical-test`
- [x] T002 Confirm backend builds cleanly (`dotnet build src/backend/Mojaz.sln`)
- [x] T003 [P] Create empty directory `src/backend/Mojaz.Application/DTOs/Practical/`
- [x] T004 [P] Create empty directory `src/frontend/src/components/domain/practical/`
- [x] T005 [P] Create empty directory `src/frontend/src/services/`

---

## Phase 2: Tests (TDD: write tests for entities, services, API)

**Purpose**: Establish failure baselines before implementation.

- [x] T024 [P] [US1] Write `SubmitResultAsync_PassResult_TransitionsToApproved` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T025 [P] [US1] Write `SubmitResultAsync_PassResult_SendsPassNotification` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T026 [P] [US1] Write `SubmitResultAsync_PassResult_CreatesAuditLog` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T027 [P] [US1] Write `SubmitResultAsync_WrongStage_ReturnsBadRequest` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T028 [P] [US1] Write `SubmitResultAsync_ApplicationNotFound_ReturnsNotFound` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T035 [P] [US2] Write `SubmitResultAsync_FailResultWithAdditionalTraining_SetsAdditionalTrainingRequired` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T036 [P] [US2] Write `SubmitResultAsync_FailResultWithAdditionalTraining_RecordsAdditionalHours` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T037 [P] [US2] Write `SubmitResultAsync_FailResult_IncrementsPracticalAttemptCount` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T038 [P] [US2] Write `SubmitResultAsync_FailResult_SendsFailNotification` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T039 [P] [US2] Write `SubmitResultAsync_AbsentResult_CountsAsFailedAttempt` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T040 [P] [US2] Write `HasAdditionalTrainingRequiredAsync_FlagSet_ReturnsTrue` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T041 [P] [US2] Write `AppointmentBookingValidator_PracticalTest_BlockedWhenAdditionalTrainingRequired` in `tests/backend/Mojaz.Application.Tests/Services/AppointmentBookingValidatorTests.cs`
- [x] T049 [P] [US3] Write `SubmitResultAsync_TerminalFail_TransitionsToRejected` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T050 [P] [US3] Write `SubmitResultAsync_TerminalFail_SendsRejectionNotification` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T051 [P] [US3] Write `SubmitResultAsync_AtMaxAttempts_ReturnsBadRequest` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T052 [P] [US3] Write `HasReachedMaxAttemptsAsync_AtLimit_ReturnsTrue` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T053 [P] [US3] Write `AppointmentBookingValidator_PracticalTest_BlockedWhenMaxAttemptsReached` in `tests/backend/Mojaz.Application.Tests/Services/AppointmentBookingValidatorTests.cs`
- [x] T056 [P] [US4] Write `IsInCoolingPeriodAsync_WithinPeriod_ReturnsTrue` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T057 [P] [US4] Write `IsInCoolingPeriodAsync_AfterPeriod_ReturnsFalse` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T058 [P] [US4] Write `IsInCoolingPeriodAsync_NoPreviousFail_ReturnsFalse` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T059 [P] [US4] Write `AppointmentBookingValidator_PracticalTest_BlockedInCoolingPeriod` in `tests/backend/Mojaz.Application.Tests/Services/AppointmentBookingValidatorTests.cs`
- [x] T062 [P] [US5] Write `GetHistoryAsync_Applicant_ReturnsOwnHistory` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T063 [P] [US5] Write `GetHistoryAsync_OtherApplicant_ReturnsForbidden` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T064 [P] [US5] Write `GetHistoryAsync_Manager_ReturnsFullHistory` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T065 [P] [US5] Write `GetHistoryAsync_NoRecords_ReturnsEmptyPagedResult` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`
- [x] T066 [P] [US5] Write `GetHistoryAsync_ApplicationNotFound_Returns404` in `tests/backend/Mojaz.Application.Tests/Services/PracticalServiceTests.cs`

---

## Phase 3: Core (Implement Domain, Application, Infrastructure, API, and UI)

**Purpose**: Implement business logic and user interfaces.

### Foundational (Blocking)
- [x] T006 Update `PracticalTest` entity in `src/backend/Mojaz.Domain/Entities/PracticalTest.cs`
- [x] T007 Update `Application` entity in `src/backend/Mojaz.Domain/Entities/Application.cs`
- [x] T008 [P] Create `IPracticalRepository` interface in `src/backend/Mojaz.Application/Interfaces/IPracticalRepository.cs`
- [x] T009 [P] Create `IPracticalService` interface in `src/backend/Mojaz.Application/Interfaces/IPracticalService.cs`
- [x] T010 [P] Create `SubmitPracticalResultRequest` DTO in `src/backend/Mojaz.Application/DTOs/Practical/SubmitPracticalResultRequest.cs`
- [x] T011 [P] Create `PracticalTestDto` in `src/backend/Mojaz.Application/DTOs/Practical/PracticalTestDto.cs`
- [x] T012 Create `SubmitPracticalResultValidator` in `src/backend/Mojaz.Application/Validators/SubmitPracticalResultValidator.cs`
- [x] T013 Create `PracticalMappingProfile` in `src/backend/Mojaz.Application/Mappings/PracticalMappingProfile.cs`
- [x] T014 [P] Create `PracticalRepository` in `src/backend/Mojaz.Infrastructure/Repositories/PracticalRepository.cs`
- [x] T015 [P] Create `PracticalTestConfiguration` EF Core config in `src/backend/Mojaz.Infrastructure/Configurations/PracticalTestConfiguration.cs`
- [x] T016 Generate EF Core migration `AddPracticalTestFields_020`
- [x] T017 Add SystemSettings seed data for Practical limits
- [x] T018 Apply migration to database
- [x] T019 Register `IPracticalRepository` and `IPracticalService` in DI in `src/backend/Mojaz.API/Program.cs`
- [x] T020 Register `PracticalMappingProfile` in `src/backend/Mojaz.API/Program.cs`
- [x] T021 [P] Create TypeScript interfaces in `src/frontend/src/types/practical.types.ts`
- [x] T022 [P] Create Arabic translations in `src/frontend/public/locales/ar/practical.json`
- [x] T023 [P] Create English translations in `src/frontend/public/locales/en/practical.json`

### User Story 1 — Examiner Records a Passing Practical Test (P1)
- [x] T029 [US1] Implement `PracticalService` constructor injection in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T030 [US1] Implement `SubmitResultAsync` (Pass path) in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T031 [US1] Create `PracticalTestsController` with `POST {appId}/result` in `src/backend/Mojaz.API/Controllers/PracticalTestsController.cs`
- [x] T032 [US1] Create `practical.service.ts` in `src/frontend/src/services/practical.service.ts`
- [x] T033 [US1] Create `PracticalResultForm` component in `src/frontend/src/components/domain/practical/PracticalResultForm.tsx`
- [x] T034 [US1] Create employee practical results page in `src/frontend/src/app/[locale]/(employee)/practical-results/[id]/page.tsx`

### User Story 2 — Examiner Records a Failing Result (P1)
- [x] T042 [US2] Extend `SubmitResultAsync` for Fail results and `AdditionalTrainingRequired` flag in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T043 [US2] Implement `HasAdditionalTrainingRequiredAsync` in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T044 [US2] Implement `IsInCoolingPeriodAsync` in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T045 [US2] Implement `HasReachedMaxAttemptsAsync` in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T048 [US2] Extend `PracticalResultForm` frontend component with additional training toggle in `src/frontend/src/components/domain/practical/PracticalResultForm.tsx`

### User Story 3 — Maximum Attempts Exhausted (P1)
- [x] T054 [US3] Extend `SubmitResultAsync` for terminal failures (Rejection) in `src/backend/Mojaz.Application/Services/PracticalService.cs`

### User Story 5 — View Practical Test History (P2)
- [x] T067 [US5] Implement `GetHistoryAsync` in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T068 [US5] Add `GET {appId}/history` action to `PracticalTestsController` in `src/backend/Mojaz.API/Controllers/PracticalTestsController.cs`
- [x] T069 [US5] Add `getPracticalTestHistory` function to `practical.service.ts` in `src/frontend/src/services/practical.service.ts`
- [x] T070 [US5] Create `PracticalTestHistory` component in `src/frontend/src/components/domain/practical/PracticalTestHistory.tsx`
- [x] T071 [US5] Create `TestAttemptBadge` component in `src/frontend/src/components/domain/practical/TestAttemptBadge.tsx`
- [x] T072 [US5] Integrate `PracticalTestHistory` into employee results page in `src/frontend/src/app/[locale]/(employee)/practical-results/[id]/page.tsx`

---

## Phase 4: Integration (Wire everything together, handle errors, logging)

**Purpose**: Enforce booking gates and verify audit trail.

- [x] T046 [US2] Add practical gate block to `AppointmentBookingValidator` in `src/backend/Mojaz.Application/Services/AppointmentBookingValidator.cs`
- [x] T047 [US2] Register updated `AppointmentBookingValidator` in DI in `src/backend/Mojaz.API/Program.cs`
- [x] T060 [US4] Verify `IsInCoolingPeriodAsync` uses correct `COOLING_PERIOD_DAYS_PRACTICAL` key in `src/backend/Mojaz.Application/Services/PracticalService.cs`
- [x] T061 [US4] Enhance `AppointmentBookingValidator` error message with earliest eligible date in `src/backend/Mojaz.Application/Services/AppointmentBookingValidator.cs`

---

## Phase 5: Polish (i18n translations, RTL support, Dark Mode, Final Validation)

**Purpose**: Final quality checks and build verification.

- [x] T073 [P] Run all backend unit tests and confirm ≥ 80% coverage on `PracticalService`
- [x] T074 [P] Run frontend TypeScript build
- [x] T075 [P] Verify Swagger/OpenAPI docs
- [x] T076 Confirm `AppointmentBookingValidator` DI succeeds
- [x] T077 [P] Verify SystemSettings keys in DB
- [x] T078 [P] Frontend build succeeds
- [x] T079 Arabic translation review
- [x] T080 English translation review
- [x] T081 Ready for commit
