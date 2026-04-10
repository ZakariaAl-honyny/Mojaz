# Tasks: Application Creation, Management & Status Tracking (Feature 012)

**Input**: Design documents from `/specs/012-application-crud/`  
**Branch**: `012-application-crud`  

## Phase 1: Setup
**Purpose**: Initialize structure, configs, and dependencies

- [x] T001 Add `DocumentReview`, `Training`, and `Expired` to `ApplicationStatus` enum in `Mojaz.Domain/Enums/ApplicationStatus.cs`
- [x] T002 Fix `Application` entity: set default `Status = ApplicationStatus.Draft`, add `StatusHistory` navigation property `ICollection<ApplicationStatusHistory>` in `Mojaz.Domain/Entities/Application.cs`
- [x] T003 Add stage-name constants for role-scoped filtering in `Mojaz.Shared/Constants/ApplicationStages.cs`

---

## Phase 2: Tests
**Purpose**: TDD - write tests for entities, services, and API

- [X] T004 [P] Write unit tests for `CreateAsync` and `CheckEligibilityAsync` (Gate 1 branches) in `tests/Mojaz.Application.Tests/Services/ApplicationServiceTests.cs`
- [X] T005 [P] Write unit tests for `SubmitAsync` in `tests/Mojaz.Application.Tests/Services/ApplicationServiceTests.cs`
- [X] T006 [P] Write unit tests for `GetListAsync` role-scoped filtering in `tests/Mojaz.Application.Tests/Services/ApplicationServiceTests.cs`
- [X] T007 [P] Write unit tests for `CancelAsync` in `tests/Mojaz.Application.Tests/Services/ApplicationServiceTests.cs`
- [X] T008 [P] Write unit tests for `ProcessExpiredApplicationsJob.ExecuteAsync` in `tests/Mojaz.Infrastructure.Tests/Jobs/ProcessExpiredApplicationsJobTests.cs`

---

## Phase 3: Core
**Purpose**: Implement Domain, Application, Infrastructure, API, and UI

- [x] T009 Add `ApplicationFilterRequest` DTO class in `Mojaz.Application/DTOs/Application/ApplicationFilterRequest.cs`
- [x] T010 [P] Add `EligibilityCheckRequest` and `EligibilityCheckResult` classes in `Mojaz.Application/DTOs/Application/EligibilityDtos.cs`
- [x] T011 [P] Add `UpdateDraftRequest` class in `Mojaz.Application/DTOs/Application/ApplicationDtos.cs`
- [x] T012 [P] Add `SubmitApplicationRequest` class in `Mojaz.Application/DTOs/Application/ApplicationDtos.cs`
- [x] T013 Update `ApplicationDto` in `Mojaz.Application/DTOs/Application/ApplicationDtos.cs`
- [x] T014 Update `ApplicationTimelineDto` in `Mojaz.Application/DTOs/Application/ApplicationDtos.cs`
- [x] T015 Update `IApplicationService` interface in `Mojaz.Application/Interfaces/Services/IApplicationService.cs`
- [x] T016 Update `ApplicationProfile` AutoMapper mapping in `Mojaz.Application/Mappings/ApplicationProfile.cs`
- [x] T017 [US1] Extract Gate 1 validation into `CheckEligibilityAsync` in `Mojaz.Application/Services/ApplicationService.cs`
- [x] T018 [US1] Add retry loop for unique application number in `Mojaz.Application/Services/ApplicationService.cs`
- [x] T019 [US1] Fix `CreateAsync` to start in `Draft` status and perform Gate 1 validation in `Mojaz.Application/Services/ApplicationService.cs`
- [x] T020 [US1] Add `GET /api/v1/applications/eligibility` endpoint to `Mojaz.API/Controllers/ApplicationsController.cs`
- [x] T021 [US1] Add `CreateApplicationValidator` in `Mojaz.Application/Validators/Application/CreateApplicationValidator.cs`
- [x] T022 [US2] Implement `UpdateDraftAsync` in `Mojaz.Application/Services/ApplicationService.cs`
- [x] T023 [US2] Add `UpdateDraftValidator` in `Mojaz.Application/Validators/Application/UpdateDraftValidator.cs`
- [x] T024 [US2] Implement `SubmitAsync` in `Mojaz.Application/Services/ApplicationService.cs`
- [x] T025 [US2] Add `SubmitApplicationValidator` in `Mojaz.Application/Validators/Application/SubmitApplicationValidator.cs`
- [x] T026 [US2] Add `PUT /api/v1/applications/{id}/draft` endpoint to `Mojaz.API/Controllers/ApplicationsController.cs`
- [x] T027 [US2] Add `PATCH /api/v1/applications/{id}/submit` endpoint to `Mojaz.API/Controllers/ApplicationsController.cs`
- [x] T028 [US2] Update `{id}` route conflict in `Mojaz.API/Controllers/ApplicationsController.cs`
- [x] T029 [US3] Update `GetListAsync` with role-scoped predicates in `Mojaz.Application/Services/ApplicationService.cs`
- [x] T030 [US3] Add filter composition to `GetListAsync` in `Mojaz.Application/Services/ApplicationService.cs`
- [x] T031 [US3] Add dynamic sorting and pagination to `GetListAsync` in `Mojaz.Application/Services/ApplicationService.cs`
- [x] T032 [US3] Update `GET /api/v1/applications` controller action in `Mojaz.API/Controllers/ApplicationsController.cs`
- [x] T033 [US4] Update `CancelAsync` with terminal-state guard in `Mojaz.Application/Services/ApplicationService.cs`
- [x] T034 [US4] Update `PATCH /api/v1/applications/{id}/cancel` controller action in `Mojaz.API/Controllers/ApplicationsController.cs`
- [x] T035 [US4] Add `CancelApplicationRequest` and validator in `Mojaz.Application/DTOs/Application/`
- [x] T036 [US5] Verify `ApplicationStatusHistory` DbSet and EF configuration in `Mojaz.Infrastructure/Persistence/MojazDbContext.cs`
- [x] T037 [US5] Add `IRepository<ApplicationStatusHistory>` to `ApplicationService`
- [x] T038 [US5] Implement `GetTimelineAsync` in `Mojaz.Application/Services/ApplicationService.cs`
- [x] T039 [US5] Add `GET /api/v1/applications/{id}/timeline` endpoint to `Mojaz.API/Controllers/ApplicationsController.cs`
- [x] T040 [US6] Create `ProcessExpiredApplicationsJob` in `Mojaz.Infrastructure/Jobs/ProcessExpiredApplicationsJob.cs`
- [x] T041 [US6] Register `ProcessExpiredApplicationsJob` in `Mojaz.Infrastructure/InfrastructureServiceRegistration.cs`
- [x] T042 [US6] Add `IRecurringJobSetup` or registration in `Mojaz.API/Extensions/HangfireExtensions.cs`

---

## Phase 4: Integration
**Purpose**: Wire everything together, handle errors, and logging

- [X] T043 Verify EF Core relationship configuration for `ApplicationStatusHistory` in `Mojaz.Infrastructure/Data/Configurations/ApplicationConfiguration.cs`
- [X] T044 Update Swagger XML documentation comments on all new controller actions

---

## Phase 5: Polish
**Purpose**: i18n translations, RTL support, Dark Mode, and Final Validation

- [ ] T045 Run manual smoke test via Swagger UI against local environment
