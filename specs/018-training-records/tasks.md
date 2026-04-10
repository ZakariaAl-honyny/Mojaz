# Tasks: 018 — Training Completion Recording & Exemption Management

**Branch**: `018-training-records`
**Input**: plan.md ✅ | spec.md ✅ | data-model.md ✅ | contracts/ ✅ | research.md ✅ | quickstart.md ✅
**Created**: 2026-04-09

## Format: `[ID] [P?] [Story?] Description — file path`

- **[P]**: Parallelizable (different files, no in-flight dependencies)
- **[US1/US2/US3]**: User story ownership
- All paths relative to repo root

---

## Phase 1: Setup (Initialize structure, configs, dependencies)

**Purpose**: Domain entity + enum + DB schema.

- [X] T001 Extend `TrainingRecord` entity with new fields (`TrainingDate`, `TrainerName`, `CenterName`, `TotalHoursRequired`, `ExemptionDocumentId`, `ExemptionApprovedAt`, `ExemptionRejectionReason`, `CreatedBy`) in `src/backend/Mojaz.Domain/Entities/TrainingRecord.cs`
- [X] T002 Replace raw `Status` string with `TrainingStatus` enum property in `src/backend/Mojaz.Domain/Entities/TrainingRecord.cs`
- [X] T003 [P] Add navigation properties (`ExemptionDocument`, `ExemptionApprover`, `Creator`) to `src/backend/Mojaz.Domain/Entities/TrainingRecord.cs`
- [X] T004 Create `TrainingStatus` enum (`Required=0`, `InProgress=1`, `Completed=2`, `Exempted=3`) in `src/backend/Mojaz.Domain/Enums/TrainingStatus.cs`
- [X] T005 Create `TrainingRecordConfiguration` EF Fluent API class with global query filter `!x.IsDeleted`, FK constraints, and indexes in `src/backend/Mojaz.Infrastructure/Persistence/Configurations/TrainingRecordConfiguration.cs`
- [X] T006 Add `TrainingRecordConfiguration` to `ApplicationDbContext.OnModelCreating` in `src/backend/Mojaz.Infrastructure/Persistence/ApplicationDbContext.cs`
- [X] T007 Generate EF Core migration `AddTrainingRecordExtendedFields` in `src/backend/Mojaz.Infrastructure/Migrations/`
- [X] T008 Add `TRAINING_HOURS_A` through `TRAINING_HOURS_F` seed rows to `SystemSettings` table via data seeder or SQL script in `src/backend/Mojaz.Infrastructure/Persistence/SeedData/`

---

## Phase 2: Tests (TDD: write tests for entities, services, API)

**Purpose**: Establish test baseline before core implementation.

- [X] T025 [US1] Write xUnit unit tests for `TrainingService.CreateAsync` covering: hours < required → InProgress, hours ≥ required → Completed, zero-hours → throws, duplicate on Completed → throws in `tests/Mojaz.Application.Tests/Services/TrainingServiceTests.cs`
- [X] T042 [US2] Write xUnit unit tests for exemption workflow: duplicate exemption → 409, non-existent document → 422, Manager approve → Exempted status, Manager reject → Required status, non-Manager approve → 403 in `tests/Mojaz.Application.Tests/Services/TrainingServiceTests.cs`
- [X] T050 [US3] Add integration test for Gate 3: POST appointment for Theory type with `TrainingStatus=Required` → expect 400 `"Training requirement not fulfilled (Gate 3)"` in `tests/Mojaz.Application.Tests/Services/AppointmentBookingValidatorTests.cs`
- [X] T055 [P] Write Playwright E2E test for the complete Employee hours recording flow (partial → arc animates → full → status flips to Completed) in `src/frontend/tests/e2e/training-record.spec.ts`
- [X] T056 [P] Write Playwright E2E test for Gate 3 enforcement: attempt Theory Test booking → verify padlock UI + API 400 response in `src/frontend/tests/e2e/gate3-enforcement.spec.ts`

---

## Phase 3: Core (Implement Domain, Application, Infrastructure, API, and UI)

**Purpose**: Implement the business logic and user interfaces.

### Foundational (Blocking)
- [X] T009 [P] Create `TrainingRecordDto` (read model with `ProgressPercentage` computed field) in `src/backend/Mojaz.Application/DTOs/Training/TrainingRecordDto.cs`
- [X] T010 [P] Create `CreateTrainingRecordRequest` DTO in `src/backend/Mojaz.Application/DTOs/Training/CreateTrainingRecordRequest.cs`
- [X] T011 [P] Create `UpdateTrainingHoursRequest` DTO in `src/backend/Mojaz.Application/DTOs/Training/UpdateTrainingHoursRequest.cs`
- [X] T012 [P] Create `CreateExemptionRequest` DTO in `src/backend/Mojaz.Application/DTOs/Training/CreateExemptionRequest.cs`
- [X] T013 [P] Create `ExemptionActionRequest` DTO in `src/backend/Mojaz.Application/DTOs/Training/ExemptionActionRequest.cs`
- [X] T014 Create `CreateTrainingRecordValidator` (FluentValidation) in `src/backend/Mojaz.Application/Validators/CreateTrainingRecordValidator.cs`
- [X] T015 Create `CreateExemptionValidator` (FluentValidation) in `src/backend/Mojaz.Application/Validators/CreateExemptionValidator.cs`
- [X] T016 Create `TrainingProfile` AutoMapper profile in `src/backend/Mojaz.Application/Mappings/TrainingProfile.cs`
- [X] T017 Define `ITrainingService` interface in `src/backend/Mojaz.Application/Interfaces/ITrainingService.cs`
- [X] T018 Create `TrainingRepository` in `src/backend/Mojaz.Infrastructure/Repositories/TrainingRepository.cs`
- [X] T019 Register services in DI in `src/backend/Mojaz.Infrastructure/InfrastructureServiceRegistration.cs`

### User Story 1 — Employee Records Training Hours (P1)
- [X] T020 [US1] Implement `TrainingService.CreateAsync` in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T021 [US1] Implement `TrainingService.GetByApplicationIdAsync` in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T022 [US1] Implement `TrainingService.UpdateHoursAsync` in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T023 [US1] Create `TrainingController` endpoints in `src/backend/Mojaz.API/Controllers/TrainingController.cs`
- [x] T026 [P] [US1] Define TypeScript types in `src/frontend/src/types/training.types.ts`
- [x] T027 [P] [US1] Implement `training.service.ts` in `src/frontend/src/services/training.service.ts`
- [x] T028 [P] [US1] Create `useTraining` hook in `src/frontend/src/hooks/useTraining.ts`
- [x] T029 [P] [US1] Create `TrainingStatusBadge` component in `src/frontend/src/components/domain/training/TrainingStatusBadge.tsx`
- [x] T030 [P] [US1] Create `TrainingProgressArc` component in `src/frontend/src/components/domain/training/TrainingProgressArc.tsx`
- [x] T031 [US1] Create `TrainingEntryForm` component in `src/frontend/src/components/domain/training/TrainingEntryForm.tsx`
- [x] T032 [US1] Create `SessionHistoryRow` component in `src/frontend/src/components/domain/training/SessionHistoryRow.tsx`
- [x] T033 [US1] Build Employee training page as RSC in `src/frontend/src/app/[locale]/(employee)/training/[applicationId]/page.tsx`

### User Story 2 — Manager Approves Training Exemption (P2)
- [X] T036 [US2] Implement `TrainingService.CreateExemptionAsync` in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T037 [US2] Implement `TrainingService.ApproveExemptionAsync` in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T038 [US2] Implement `TrainingService.RejectExemptionAsync` in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T039 [US2] Add exemption endpoints to `TrainingController` in `src/backend/Mojaz.API/Controllers/TrainingController.cs`
- [X] T040 [US2] Create Hangfire background notification job in `src/backend/Mojaz.Infrastructure/Jobs/TrainingNotificationJob.cs`
- [X] T043 [P] [US2] Create `ExemptionCard` component in `src/frontend/src/components/domain/training/ExemptionCard.tsx`
- [X] T044 [P] [US2] Create `ExemptionModal` component in `src/frontend/src/components/domain/training/ExemptionModal.tsx`
- [X] T045 [US2] Lazy-load `ExemptionModal` in `src/frontend/src/app/[locale]/(employee)/training/[applicationId]/page.tsx`
- [X] T046 [US2] Build Manager exemption review queue page in `src/frontend/src/app/[locale]/(employee)/exemptions/page.tsx`

### User Story 3 — Applicant Views Training Progress (P3)
- [X] T049 [US3] Enforce applicant ownership in `TrainingService.GetByApplicationIdAsync` in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [x] T051 [P] [US3] Create `GateLockIndicator` component in `src/frontend/src/components/domain/training/GateLockIndicator.tsx`
- [x] T052 [US3] Extend Applicant application timeline page in `src/frontend/src/app/[locale]/(applicant)/applications/[id]/page.tsx`

---

## Phase 4: Integration (Wire everything together, handle errors, logging)

**Purpose**: End-to-end connectivity, auditing, and gate enforcement.

- [X] T024 [US1] Create AuditLog entries inside `TrainingService` using `IAuditLogService` in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T041 [US2] Add AuditLog entries for exemption operations in `src/backend/Mojaz.Application/Services/TrainingService.cs`
- [X] T054 Extend `AppointmentBookingValidator` with async Gate 3 rule calling `ITrainingService.IsTrainingCompleteAsync` in `src/backend/Mojaz.Application/Services/AppointmentBookingValidator.cs`
- [X] T057 [P] Verify all `TrainingRecord` write operations produce `AuditLog` entries in `tests/Mojaz.Application.Tests/Services/TrainingAuditTests.cs`
- [X] T060 Run quickstart.md validation end-to-end

---

## Phase 5: Polish (i18n translations, RTL support, Dark Mode, Final Validation)

**Purpose**: User experience and final quality checks.

- [x] T034 [P] [US1] Add Arabic training locale file in `src/frontend/public/locales/ar/training.json`
- [x] T035 [P] [US1] Add English training locale file in `src/frontend/public/locales/en/training.json`
- [x] T047 [P] [US2] Extend Arabic locale file with exemption keys in `src/frontend/public/locales/ar/training.json`
- [x] T048 [P] [US2] Extend English locale file with exemption keys in `src/frontend/public/locales/en/training.json`
- [x] T053 [US3] Add `React.cache()` wrapper around SystemSettings fetch in `src/frontend/src/lib/server/training-data.ts`
- [x] T058 [P] Final CSS polish on `TrainingProgressArc` (60fps, IBM Plex Mono) in `src/frontend/src/components/domain/training/TrainingProgressArc.tsx`
- [x] T059 [P] Verify RTL layout and Arabic locale in training page
