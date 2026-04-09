# Task Breakdown: 017-medical-examination

**Branch**: `017-medical-examination`
**Input**: Plan, Data Model, API Contracts, and Spec.

## Phase 1: Setup

*Goal: Project initialization and foundational configuration.*

- [X] T001 Define `FitnessResult` enum in `src/Mojaz.Domain/Enums/FitnessResult.cs`
- [X] T002 Implement `MedicalResult` entity in `src/Mojaz.Domain/Entities/MedicalResult.cs`
- [X] T003 Add `MedicalResult` to EF Core DbContext in `src/Mojaz.Infrastructure/Persistence/ApplicationDbContext.cs`
- [X] T004 Create database migration for MedicalResult table in `src/Mojaz.Infrastructure/Persistence/Migrations/`

## Phase 2: Foundational

*Goal: Shared infrastructure before specialized workflows.*

- [X] T005 [P] Create DTOs (`CreateMedicalResultRequest`, `MedicalResultDto`) in `src/Mojaz.Application/DTOs/Medical/`
- [X] T006 [P] Create validators for DTOs in `src/Mojaz.Application/Validators/`
- [X] T007 Implement `IMedicalService` interface in `src/Mojaz.Application/Services/IMedicalService.cs`

## Phase 3: Doctor Records Medical Result (US1)

*Goal: Allow Doctors to record fitness results with instantaneous frontend feedback.*

- [X] T008 [US1] Write backend tests for `MedicalService` creation logic in `tests/Mojaz.Application.Tests/Services/MedicalServiceTests.cs`
- [X] T009 [US1] Implement `MedicalService.CreateMedicalResultAsync` with Result evaluation and Event triggering in `src/Mojaz.Application/Services/MedicalService.cs`
- [X] T010 [US1] Implement `MedicalService.GetByApplicationIdAsync` in `src/Mojaz.Application/Services/MedicalService.cs`
- [X] T011 [US1] Implement `MedicalService.UpdateResultAsync` in `src/Mojaz.Application/Services/MedicalService.cs`
- [X] T012 [P] [US1] Create `MedicalExamsController` exposing POST, GET, PATCH endpoints in `src/Mojaz.API/Controllers/MedicalExamsController.cs`
- [X] T013 [P] [US1] Define frontend types in `frontend/src/types/medical.types.ts`
- [X] T014 [US1] Implement frontend service with TanStack Query in `frontend/src/services/medical.service.ts`
- [X] T015 [US1] Build `MedicalResultForm` component with optimistic updates using `useTransition` in `frontend/src/components/domain/medical/MedicalResultForm.tsx`
- [X] T016 [P] [US1] Add Arabic and English translations to `frontend/public/locales/`
- [X] T017 [US1] Integrate `MedicalResultForm` into Doctor application portal page `frontend/src/app/[locale]/(employee)/applications/[id]/medical/page.tsx`

## Phase 4: Medical Validity Tracking (US2)

*Goal: Enforce medical certificate validity during the final Gate 4 approval.*

- [X] T018 [US2] Update Gate 4 validation logic to verify expiration using `SystemSettings["MEDICAL_VALIDITY_DAYS"]` in `src/Mojaz.Application/Services/ApplicationWorkflowService.cs`
- [X] T019 [US2] Add unit tests for Gate 4 rejection on expired medical certificate in `tests/Mojaz.Application.Tests/Services/ApplicationWorkflowServiceTests.cs`
- [X] T020 [US2] Ensure Gate 4 rejections render contextual UI feedback on the employee dashboard front-end logic.

## Phase 5: Polish & Cross-Cutting Concerns

*Goal: Aesthetics, async notifications, review.*

- [ ] T021 [P] Implement `MedicalExamPassedEvent` and `MedicalExamFailedEvent` handlers bridging Hangfire background jobs in `src/Mojaz.Infrastructure/Events/`
- [X] T022 [P] Polish Doctor interface aesthetics with intense High-Contrast indicators and smooth CSS-only micro-animations in `frontend/src/components/domain/medical/MedicalResultForm.tsx`
- [ ] T023 Refactor React query hooks ensuring `React.cache` and parallel fetching is correctly leveraged in Next.js Server Components.

---

## Dependencies 
- Phase 1 & 2 must be completed before Phase 3.
- Phase 3 frontend (T013-T017) can be executed cleanly parallel to backend (T008-T012).
- Phase 4 relies on Phase 3 backend completion.

## Parallel Execution Examples
- Developer A takes T008-T012 (US1 Backend).
- Developer B takes T013-T017 (US1 Frontend).
- Developer C takes T005 & T006 DTO validation.

## Implementation Strategy
- Provide the database migrations first (MVP setup).
- Complete the Medical API for the Doctor Portal (US1).
- Enforce validation rules iteratively (US2).
- Polish frontend and connect Hangfire Notification pipelines last.
