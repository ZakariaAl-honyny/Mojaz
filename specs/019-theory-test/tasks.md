# Tasks: 019 — Theory Test Recording

**Input**: Design documents from `specs/019-theory-test/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | data-model.md ✅ | contracts/api-contracts.md ✅
**Branch**: `019-theory-test`
**Updated**: 2026-04-09

## Format: `[ID] [P?] [Story?] Description — file path`

- **[P]**: Can run in parallel (different files, no unresolved dependencies)
- **[US#]**: Which user story this task belongs to
- All paths are relative to the workspace root

---

## Phase 1: Setup (Initialize structure, configs, dependencies)

**Purpose**: Update domain entities and run the EF Core migration.

- [x] T001 Update `TheoryTest` entity — add `IsAbsent`, nullable `Score`, rename `TestDate` → `ConductedAt` — `src/backend/Mojaz.Domain/Entities/TheoryTest.cs`
- [x] T002 Update `Application` entity — add `TheoryAttemptCount` and `TheoryTests` collection — `src/backend/Mojaz.Domain/Entities/Application.cs`
- [x] T003 Verify `TheoryTests` DbSet and EF Core configuration — `src/backend/Mojaz.Infrastructure/Data/MojazDbContext.cs` and `src/backend/Mojaz.Infrastructure/Data/Configurations/TheoryTestConfiguration.cs`
- [x] T004 Generate EF Core migration `AddTheoryTestRecording` — `src/backend/`
- [x] T005 Apply migration to verify it runs clean — `src/backend/`
- [x] T006 Add `MIN_PASS_SCORE_THEORY = 80` to SystemSettings seed data — `src/backend/Mojaz.Infrastructure/Data/Seeders/SystemSettingsSeeder.cs`

---

## Phase 2: Tests (TDD: write tests for entities, services, API)

**Purpose**: Define expected behavior before implementation.

- [x] T020 [US1] Write unit tests for `TheoryService.SubmitResultAsync` — `src/backend/Mojaz.Application.Tests/Services/TheoryServiceTests.cs`
- [x] T027 [US5] Write unit tests for history — `src/backend/Mojaz.Application.Tests/Services/TheoryServiceTests.cs`

---

## Phase 3: Core (Implement Domain, Application, Infrastructure, API, and UI)

**Purpose**: Implement the core business logic and user interfaces.

### Foundational (Blocking)
- [x] T007 [P] Create `ITheoryRepository` interface — `src/backend/Mojaz.Application/Interfaces/ITheoryRepository.cs`
- [x] T008 [P] Create `ITheoryService` interface — `src/backend/Mojaz.Application/Interfaces/ITheoryService.cs`
- [x] T009 [P] Create `SubmitTheoryResultRequest` DTO — `src/backend/Mojaz.Application/DTOs/Theory/SubmitTheoryResultRequest.cs`
- [x] T010 [x] Create `TheoryTestDto` response DTO — `src/backend/Mojaz.Application/DTOs/Theory/TheoryTestDto.cs`
- [x] T011 [P] Create `SubmitTheoryResultValidator` — `src/backend/Mojaz.Application/Validators/SubmitTheoryResultValidator.cs`
- [x] T012 [P] Create `TheoryMappingProfile` AutoMapper profile — `src/backend/Mojaz.Application/Mappings/TheoryMappingProfile.cs`

### User Story 1, 2 & 3 — Record Theory Test Result (P1)
- [x] T013 [US1] Implement `TheoryRepository` — `src/backend/Mojaz.Infrastructure/Repositories/TheoryRepository.cs`
- [x] T014 [US1] Register `ITheoryRepository` in DI — `src/backend/Mojaz.Infrastructure/InfrastructureServiceRegistration.cs`
- [x] T015 [US1] Implement `TheoryService.SubmitResultAsync` — `src/backend/Mojaz.Application/Services/TheoryService.cs`
- [x] T016 [US2] Implement `TheoryService.IsInCoolingPeriodAsync` — `src/backend/Mojaz.Application/Services/TheoryService.cs`
- [x] T017 [US3] Implement `TheoryService.HasReachedMaxAttemptsAsync` — `src/backend/Mojaz.Application/Services/TheoryService.cs`
- [x] T018 [US1] Register `ITheoryService` in DI — `src/backend/Mojaz.Application/ApplicationServiceRegistration.cs`
- [x] T019 [US1] Create `TheoryTestsController` — `src/backend/Mojaz.API/Controllers/TheoryTestsController.cs`
- [x] T028 [P] [US1] Create translation files — `src/frontend/public/locales/ar/theory.json` and `src/frontend/public/locales/en/theory.json`
- [x] T029 [P] [US1] Create TypeScript types — `src/frontend/src/types/theory.types.ts`
- [x] T030 [P] [US1] Create `theory.service.ts` — `src/frontend/src/services/theory.service.ts`
- [x] T031 [US1] Build `TheoryResultForm` component — `src/frontend/src/components/domain/theory/TheoryResultForm.tsx`
- [x] T032 [US1] Build `TestAttemptBadge` component — `src/frontend/src/components/domain/theory/TestAttemptBadge.tsx`
- [x] T033 [US1] Refactor `test-results/page.tsx` — `src/frontend/src/app/[locale]/(employee)/test-results/page.tsx`

### User Story 5 — View Theory Test Attempt History (P2)
- [x] T025 [US5] Implement `TheoryService.GetHistoryAsync` — `src/backend/Mojaz.Application/Services/TheoryService.cs`
- [x] T026 [US5] Add `GET {appId}/history` action to `TheoryTestsController` — `src/backend/Mojaz.API/Controllers/TheoryTestsController.cs`
- [x] T034 [P] [US5] Build `TheoryHistoryTable` component — `src/frontend/src/components/domain/theory/TheoryTestHistory.tsx`
- [x] T035 [US5] Integrate `TheoryHistoryTable` into applicant application detail page — `src/frontend/src/app/[locale]/(applicant)/applications/[id]/page.tsx`
- [x] T036 [US5] Add theory test history section to employee application detail view — `src/frontend/src/app/[locale]/(employee)/applications/[id]/page.tsx`

---

## Phase 4: Integration (Wire everything together, handle errors, logging)

**Purpose**: Enforce booking gates and verify end-to-end flow.

- [x] T021 [US4] Inject `ITheoryService` into `AppointmentBookingValidator` — `src/backend/Mojaz.Application/Services/AppointmentBookingValidator.cs`
- [x] T022 [US4] Add theory-test cooling period gate inside `ValidateBookingAsync` — `src/backend/Mojaz.Application/Services/AppointmentBookingValidator.cs`
- [x] T023 [US4] Ensure `ITheoryService` is available via DI — `src/backend/Mojaz.Application/ApplicationServiceRegistration.cs`
- [x] T024 [US4] Write unit tests for cooling period booking gate — `src/backend/Mojaz.Application.Tests/Services/AppointmentBookingValidatorTests.cs`

---

## Phase 5: Polish (i18n translations, RTL support, Dark Mode, Final Validation)

**Purpose**: Build verification, translation completeness, and RTL validation.

- [x] T037 [P] Verify RTL layout for all new components — `src/frontend/src/components/domain/theory/`
- [x] T038 [P] Verify dark mode support for all new components
- [x] T039 Run backend build and confirm zero errors — `dotnet build src/backend/Mojaz.sln`
- [x] T040 Run frontend build and confirm zero TypeScript errors
- [x] T041 Run existing backend unit test suite and confirm no regressions — `dotnet test src/backend/Mojaz.sln`
- [x] T042 Verify Swagger/OpenAPI auto-generated docs for the new endpoints
- [ ] T043 Manual E2E verification
