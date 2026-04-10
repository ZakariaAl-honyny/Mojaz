# Tasks: Feature 022 — Final Approval with Gate 4 Comprehensive Validation

**Input**: Design documents from `specs/022-final-approval/`
**Prerequisites**: `plan.md`, `spec.md`, `data-model.md`, `contracts/api-contracts.md`

## Format: `[ID] [P?] [Story] Description — file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)

---

## Phase 1: Setup (Initialize structure, configs, dependencies)

**Purpose**: Foundational data model updates and API surface configuration.

- [X] T001 [P] Create `FinalDecisionType` enum in `src/backend/Mojaz.Domain/Enums/FinalDecisionType.cs`
- [X] T002 [P] Update `NotificationEventType` enum in `src/backend/Mojaz.Domain/Enums/NotificationEventType.cs`
- [X] T003 Update `User` entity adding `IsSecurityBlocked` in `src/backend/Mojaz.Domain/Entities/User.cs`
- [X] T004 Update `Application` entity adding `FinalDecision`, `FinalDecisionBy`, `FinalDecisionAt`, `FinalDecisionReason`, `ReturnToStage`, `ManagerNotes` in `src/backend/Mojaz.Domain/Entities/Application.cs`
- [X] T005 Update `ApplicationConfiguration.cs` and `UserConfiguration.cs` in `src/backend/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T006 Generate EF Core Migration `AddFinalApprovalFields` in `src/backend/Mojaz.Infrastructure/Migrations/`
- [X] T007 [P] Create DTO `Gate4ValidationResultDto` in `src/backend/Mojaz.Application/DTOs/Application/Gate4ValidationResultDto.cs`
- [X] T008 [P] Create DTO `FinalizeApplicationRequest` in `src/backend/Mojaz.Application/DTOs/Application/FinalizeApplicationRequest.cs`
- [X] T009 [P] Create DTO `ApplicationDecisionDto` in `src/backend/Mojaz.Application/DTOs/Application/ApplicationDecisionDto.cs`
- [X] T010 [P] Create Validator `FinalizeApplicationRequestValidator` in `src/backend/Mojaz.Application/Validators/FinalizeApplicationRequestValidator.cs`
- [X] T011 Update `ApplicationProfile.cs` in `src/backend/Mojaz.Application/Mappings/ApplicationProfile.cs`
- [X] T012 [P] Create `IGate4ValidationService` in `src/backend/Mojaz.Application/Interfaces/Services/IGate4ValidationService.cs`
- [X] T013 [P] Create `IFinalApprovalService` in `src/backend/Mojaz.Application/Interfaces/Services/IFinalApprovalService.cs`

---

## Phase 2: Tests (TDD: write tests for entities, services, API)

**Purpose**: Define failure and success boundaries for the approval workflow.

- [X] T014 [US4] Create `Gate4ValidationServiceTests` in `tests/Mojaz.Application.Tests/Services/Gate4ValidationServiceTests.cs`
- [X] T019 [P] [US1] Create unit tests in `tests/Mojaz.Application.Tests/Services/FinalApprovalServiceTests.cs` for successful approval.
- [X] T028 [P] [US2] Expand `FinalApprovalServiceTests.cs` testing the Reject scenario.
- [X] T032 [P] [US3] Expand `FinalApprovalServiceTests.cs` testing the Return scenario.

---

## Phase 3: Core (Implement Domain, Application, Infrastructure, API, and UI)

**Purpose**: Implement the Gate 4 validation, the decision logic, and the Manager's UI.

### Gate 4 Validation (US4)
- [X] T015 [US4] Implement `Gate4ValidationService` in `src/backend/Mojaz.Application/Services/Gate4ValidationService.cs`
- [X] T016 [P] [US4] Create `finalApproval.types.ts` in `src/frontend/src/types/finalApproval.types.ts`
- [X] T017 [P] [US4] Create Gate4 condition translations in `src/frontend/public/locales/ar/final-approval.json` and `en/final-approval.json`
- [X] T018 [US4] Implement `Gate4Checklist` UI component in `src/frontend/src/components/domain/application/Gate4Checklist.tsx`

### Approval Workflow (US1)
- [X] T020 [US1] Implement `FinalizeAsync` Approve logic in `src/backend/Mojaz.Application/Services/FinalApprovalService.cs`
- [X] T021 [US1] Add `GET gate4` and `POST finalize` endpoints to `src/backend/Mojaz.API/Controllers/ApplicationsController.cs`
- [X] T022 [US1] Ensure DI registration for services in `src/backend/Mojaz.API/Program.cs`
- [X] T023 [P] [US1] Implement `finalApproval.service.ts` in `src/frontend/src/services/finalApproval.service.ts`
- [X] T024 [P] [US1] Add Approve action wording to translations in `src/frontend/public/locales/ar/final-approval.json` and `en/final-approval.json`
- [X] T025 [US1] Implement `FinalApprovalPanel.tsx` in `src/frontend/src/components/domain/application/FinalApprovalPanel.tsx`
- [X] T026 [US1] Implement `FinalDecisionModal.tsx` in `src/frontend/src/components/domain/application/FinalDecisionModal.tsx`
- [X] T027 [US1] Implement page layout `page.tsx` in `src/frontend/src/app/[locale]/(employee)/applications/[id]/final-approval/page.tsx`

### Rejection & Return (US2, US3)
- [X] T029 [US2] Update `FinalApprovalService.cs` to handle Rejection workflow in `src/backend/Mojaz.Application/Services/FinalApprovalService.cs`
- [X] T030 [P] [US2] Add Reject action wording to translations in `src/frontend/public/locales/ar/final-approval.json` and `en/final-approval.json`
- [X] T031 [US2] Update `FinalDecisionModal.tsx` adding mandatory Reject reason field in `src/frontend/src/components/domain/application/FinalDecisionModal.tsx`
- [X] T033 [US3] Update `FinalApprovalService.cs` to handle Return workflow in `src/backend/Mojaz.Application/Services/FinalApprovalService.cs`
- [X] T034 [P] [US3] Add Return action terminology to translations in `src/frontend/public/locales/ar/final-approval.json` and `en/final-approval.json`
- [X] T035 [US3] Update `FinalDecisionModal.tsx` adding `ReturnToStage` drop-down in `src/frontend/src/components/domain/application/FinalDecisionModal.tsx`

---

## Phase 4: Integration (Wire everything together, handle errors, logging)

**Purpose**: Verify the end-to-end decision flow and audit trails.

- [X] T036 Review all application stages in sequence locally utilizing Swagger UI and localhost. Ensure validation blocks appropriately.

---

## Phase 5: Polish (i18n translations, RTL support, Dark Mode, Final Validation)

**Purpose**: Final quality assurance and style cleanup.

- [X] T037 Run Lint and fix any style errors across `src/frontend/`.
