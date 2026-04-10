# Tasks: 017-medical-examination

**Branch**: `017-medical-examination`
**Input**: Plan, Data Model, API Contracts, and Spec.

## Phase 1: Setup
**Purpose**: Project initialization and foundational configuration.

- [X] T001 Define `FitnessResult` enum in `src/Mojaz.Domain/Enums/FitnessResult.cs`
- [X] T002 Implement `MedicalResult` entity in `src/Mojaz.Domain/Entities/MedicalResult.cs`
- [X] T003 Add `MedicalResult` to EF Core DbContext in `src/Mojaz.Infrastructure/Persistence/ApplicationDbContext.cs`
- [X] T004 Create database migration for MedicalResult table in `src/Mojaz.Infrastructure/Persistence/Migrations/`

---

## Phase 2: Tests
**Purpose**: TDD - write tests for entities, services, and API

- [X] T005 [P] Write unit tests for `MedicalService` creation logic in `tests/Mojaz.Application.Tests/Services/MedicalServiceTests.cs`
- [X] T006 [P] Write unit tests for Gate 4 rejection on expired medical certificate in `tests/Mojaz.Application.Tests/Services/ApplicationWorkflowServiceTests.cs`
- [ ] T007 [P] Write integration tests for `MedicalExamsController` endpoints in `tests/Mojaz.API.Tests`
- [ ] T008 [P] Write component tests for `MedicalResultForm` (optimistic updates, validation) in `frontend/tests`

---

## Phase 3: Core
**Purpose**: Implement Domain, Application, Infrastructure, API, and UI

- [X] T009 [P] Create DTOs (`CreateMedicalResultRequest`, `MedicalResultDto`) in `src/Mojaz.Application/DTOs/Medical/`
- [X] T010 [P] Create validators for DTOs in `src/Mojaz.Application/Validators/`
- [X] T011 Implement `IMedicalService` interface in `src/Mojaz.Application/Services/IMedicalService.cs`
- [X] T012 [US1] Implement `MedicalService.CreateMedicalResultAsync` with Result evaluation and Event triggering in `src/Mojaz.Application/Services/MedicalService.cs`
- [X] T013 [US1] Implement `MedicalService.GetByApplicationIdAsync` in `src/Mojaz.Application/Services/MedicalService.cs`
- [X] T014 [US1] Implement `MedicalService.UpdateResultAsync` in `src/Mojaz.Application/Services/MedicalService.cs`
- [X] T015 [P] [US1] Create `MedicalExamsController` exposing POST, GET, PATCH endpoints in `src/Mojaz.API/Controllers/MedicalExamsController.cs`
- [X] T016 [P] [US1] Define frontend types in `frontend/src/types/medical.types.ts`
- [X] T017 [US1] Implement frontend service with TanStack Query in `frontend/src/services/medical.service.ts`
- [X] T018 [US1] Build `MedicalResultForm` component with optimistic updates using `useTransition` in `frontend/src/components/domain/medical/MedicalResultForm.tsx`
- [X] T019 [P] [US1] Add Arabic and English translations to `frontend/public/locales/`
- [X] T020 [US1] Integrate `MedicalResultForm` into Doctor application portal page `frontend/src/app/[locale]/(employee)/applications/[id]/medical/page.tsx`
- [X] T021 [US2] Update Gate 4 validation logic to verify expiration using `SystemSettings["MEDICAL_VALIDITY_DAYS"]` in `src/Mojaz.Application/Services/ApplicationWorkflowService.cs`
- [X] T022 [US2] Ensure Gate 4 rejections render contextual UI feedback on the employee dashboard front-end logic.

---

## Phase 4: Integration
**Purpose**: Wire everything together, handle errors, and logging

- [ ] T023 [P] Implement `MedicalExamPassedEvent` and `MedicalExamFailedEvent` handlers bridging Hangfire background jobs in `src/Mojaz.Infrastructure/Events/`
- [ ] T024 Verify end-to-end flow: Doctor submits result → Application advances status → Applicant receives notification

---

## Phase 5: Polish
**Purpose**: i18n translations, RTL support, Dark Mode, and Final Validation

- [X] T025 [P] Polish Doctor interface aesthetics with intense High-Contrast indicators and smooth CSS-only micro-animations in `frontend/src/components/domain/medical/MedicalResultForm.tsx`
- [ ] T026 Refactor React query hooks ensuring `React.cache` and parallel fetching is correctly leveraged in Next.js Server Components.
- [ ] T027 Responsive audit for Doctor portal pages on mobile (320px+)
- [ ] T028 Accessibility audit (WCAG 2.1 AA) for MedicalResultForm
- [ ] T029 Dark mode audit for all medical examination components
- [ ] T030 Final end-to-end validation of the medical recording flow
