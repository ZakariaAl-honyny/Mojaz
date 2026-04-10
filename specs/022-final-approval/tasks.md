---
description: "Task list for Feature 022 — Final Approval with Gate 4 Comprehensive Validation"
---

# Tasks: Feature 022 — Final Approval with Gate 4 Comprehensive Validation

**Input**: Design documents from `specs/022-final-approval/`
**Prerequisites**: `plan.md`, `spec.md`, `data-model.md`, `contracts/api-contracts.md`
**Tests**: Unit tests are required based on the specification and architecture guidelines for service implementations.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure. This feature builds on an existing backend and frontend structure. No standalone setup is required beyond foundational entity updates.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and data model updates that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T001 [P] Create `FinalDecisionType` enum in `src/backend/Mojaz.Domain/Enums/FinalDecisionType.cs` with values: `Approved`, `Rejected`, `Returned`.
- [X] T002 [P] Update `NotificationEventType` enum in `src/backend/Mojaz.Domain/Enums/NotificationEventType.cs` adding `FinalApprovalApproved`, `FinalApprovalRejected`, `FinalApprovalReturned`.
- [X] T003 Update `User` entity in `src/backend/Mojaz.Domain/Entities/User.cs` adding `public bool IsSecurityBlocked { get; set; } = false;`
- [X] T004 Update `Application` entity in `src/backend/Mojaz.Domain/Entities/Application.cs` adding nullable properties: `FinalDecision`, `FinalDecisionBy`, `FinalDecisionAt`, `FinalDecisionReason`, `ReturnToStage`, `ManagerNotes`.
- [X] T005 Update `ApplicationConfiguration.cs` and `UserConfiguration.cs` in `src/backend/Mojaz.Infrastructure/Persistence/Configurations/` to map the new EF core properties.
- [X] T006 Generate EF Core Migration `AddFinalApprovalFields` via CLI and verify migration file in `src/backend/Mojaz.Infrastructure/Migrations/`
- [X] T007 [P] Create DTO `Gate4ValidationResultDto` and related `Gate4ConditionDto` in `src/backend/Mojaz.Application/DTOs/Application/Gate4ValidationResultDto.cs`
- [X] T008 [P] Create DTO `FinalizeApplicationRequest` in `src/backend/Mojaz.Application/DTOs/Application/FinalizeApplicationRequest.cs` (adding Decision, Reason, ReturnToStage, ManagerNotes).
- [X] T009 [P] Create DTO `ApplicationDecisionDto` in `src/backend/Mojaz.Application/DTOs/Application/ApplicationDecisionDto.cs`
- [X] T010 [P] Create Validator `FinalizeApplicationRequestValidator` in `src/backend/Mojaz.Application/Validators/FinalizeApplicationRequestValidator.cs` containing explicit FluentValidation rules from contracts.
- [X] T011 Update `ApplicationProfile.cs` in `src/backend/Mojaz.Application/Mappings/ApplicationProfile.cs` to register mappings for new Application logic and `ApplicationDecisionDto`.
- [X] T012 [P] Create `IGate4ValidationService` in `src/backend/Mojaz.Application/Interfaces/Services/IGate4ValidationService.cs`
- [X] T013 [P] Create `IFinalApprovalService` in `src/backend/Mojaz.Application/Interfaces/Services/IFinalApprovalService.cs`

**Checkpoint**: Foundation ready - DB model exists and API surface is configured. User story implementation can now begin.

---

## Phase 3: User Story 4 - Gate 4 Blocks Approval When Any Condition Fails (Priority: P1)

**Goal**: A Manager attempts to record an Approve decision for an application while at least one Gate 4 condition is failing. The system must prevent the approval from being saved by enforcing Gate 4 server-side.

**Independent Test**: Calling the API or mocking Gate4ValidationService verifies proper checks.

### Tests for User Story 4

- [X] T014 [US4] Create `Gate4ValidationServiceTests` in `tests/Mojaz.Application.Tests/Services/Gate4ValidationServiceTests.cs` (verify condition failure logic).

### Implementation for User Story 4

- [X] T015 [US4] Implement `Gate4ValidationService` in `src/backend/Mojaz.Application/Services/Gate4ValidationService.cs` (Check theory, practical, security status, identity doc, medical cert, payments).
- [X] T016 [P] [US4] Create `finalApproval.types.ts` in `src/frontend/src/types/finalApproval.types.ts` defining frontend interfaces matching the Gate4 DTOs.
- [X] T017 [P] [US4] Create Gate4 condition translations in `src/frontend/public/locales/ar/final-approval.json` and `en/final-approval.json`.
- [X] T018 [US4] Implement `Gate4Checklist` UI component in `src/frontend/src/components/domain/application/Gate4Checklist.tsx` showing read-only pass/fail indicators based on the 6 conditions.

---

## Phase 4: User Story 1 - Manager Validates Gate 4 and Approves Application (Priority: P1) 🎯 MVP

**Goal**: Manager opens an application that has successfully completed all prior workflow stages. The system displays a comprehensive Gate 4 checklist. Manager reviews and approves, transitioning the Application to issuance.

**Independent Test**: Can be fully tested by seeding a complete, gate-passing application and performing an approval action — delivering a correctly transitioned application status and a triggered notification.

### Tests for User Story 1

- [X] T019 [P] [US1] Create unit tests in `tests/Mojaz.Application.Tests/Services/FinalApprovalServiceTests.cs` for successful approval scenario.
- [X] T020 [US1] Implement `FinalizeAsync` Approve logic in `src/backend/Mojaz.Application/Services/FinalApprovalService.cs` (Requires dependency on `IGate4ValidationService`, transition to `09-IssuancePayment`, record audit log, dispatch sync + async notifications).
- [X] T021 [US1] Add `GET gate4` and `POST finalize` endpoints to `src/backend/Mojaz.API/Controllers/ApplicationsController.cs` with `[Authorize(Roles = "Manager")]`.
- [X] T022 [US1] Ensure DI registration for `Gate4ValidationService` and `FinalApprovalService` in `src/backend/Mojaz.API/Program.cs`.
- [X] T023 [P] [US1] Implement `finalApproval.service.ts` in `src/frontend/src/services/finalApproval.service.ts` using React Query to call `/gate4` and `/finalize` APIs.
- [X] T024 [P] [US1] Add Approve action wording to translations in `src/frontend/public/locales/ar/final-approval.json` and `en/final-approval.json`.
- [X] T025 [US1] Implement `FinalApprovalPanel.tsx` in `src/frontend/src/components/domain/application/FinalApprovalPanel.tsx` wrapping the `Gate4Checklist`.
- [X] T026 [US1] Implement `FinalDecisionModal.tsx` in `src/frontend/src/components/domain/application/FinalDecisionModal.tsx` supporting the Approve action submission.
- [X] T027 [US1] Implement page layout `page.tsx` in `src/frontend/src/app/[locale]/(employee)/applications/[id]/final-approval/page.tsx` integrating the gate4 UI hooks.

**Checkpoint**: At this point, User Story 1 (Happy Path) should be fully functional and testable independently.

---

## Phase 5: User Story 2 - Manager Rejects an Application After Gate 4 Failure (Priority: P2)

**Goal**: Manager reviews an application with terminal failure and selects Reject, providing a mandatory rejection reason to permanently close it.

**Independent Test**: Rejecting an application successfully records status "Finally Rejected" permanently.

### Tests for User Story 2

- [X] T028 [P] [US2] Expand `FinalApprovalServiceTests.cs` in `tests/Mojaz.Application.Tests/Services/FinalApprovalServiceTests.cs` testing the Reject scenario (must require rationale, terminal status transition).

### Implementation for User Story 2

- [X] T029 [US2] Update `FinalApprovalService.cs` in `src/backend/Mojaz.Application/Services/FinalApprovalService.cs` extending `FinalizeAsync` to handle Rejection workflow (terminal state logic).
- [X] T030 [P] [US2] Add Reject action wording to translations in `src/frontend/public/locales/ar/final-approval.json` and `en/final-approval.json`.
- [X] T031 [US2] Update `FinalDecisionModal.tsx` in `src/frontend/src/components/domain/application/FinalDecisionModal.tsx` adding the textarea for the mandatory Reject reason field.

---

## Phase 6: User Story 3 - Manager Returns Application for Correction (Priority: P2)

**Goal**: An application has a correctable issue. The Manager selects Return to revert it to a specific target stage.

**Independent Test**: Manager returns an app to "Document Review" and it queues properly there.

### Tests for User Story 3

- [X] T032 [P] [US3] Expand `FinalApprovalServiceTests.cs` in `tests/Mojaz.Application.Tests/Services/FinalApprovalServiceTests.cs` testing the Return scenario with valid and invalid target stages.

### Implementation for User Story 3

- [X] T033 [US3] Update `FinalApprovalService.cs` in `src/backend/Mojaz.Application/Services/FinalApprovalService.cs` extending `FinalizeAsync` to handle Return workflow (state resets to target stage, validation of target stage).
- [X] T034 [P] [US3] Add Return action terminology to translations in `src/frontend/public/locales/ar/final-approval.json` and `en/final-approval.json`.
- [X] T035 [US3] Update `FinalDecisionModal.tsx` in `src/frontend/src/components/domain/application/FinalDecisionModal.tsx` adding the select drop-down configuration for `ReturnToStage` target binding.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [X] T036 Review all application stages in sequence locally utilizing Swagger UI (API test) and localhost (frontend tests). Ensure validation blocks appropriately.
- [X] T037 Run Lint and fix any style errors across `src/frontend/`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup & Foundational**: Execution blocks all subsequent stories.
- **US4 (Gate 4 Checks)**: Must be implemented before US1, US2, and US3, as this provides the baseline condition checks.
- **US1 (Approve)**: Can run parallel to or immediately after US4.
- **US2, US3 (Reject, Return)**: Expand upon the groundwork of US1. Best implemented asynchronously in parallel or right after US1.

### Parallel Opportunities

- DTOs, Enums, and Validators within the foundational phase can be created in parallel.
- Service interfaces can be drafted independently.
- UI translation keys and typescript interface boundaries can operate without backend execution.

## Implementation Strategy

1. Execute Foundational tasks. Apply the EF migration locally.
2. Develop the backend `Gate4ValidationService` exclusively. Verify via tests without HTTP boundary.
3. Build the `GET gate4` endpoint. Expose testing via backend swagger.
4. Develop the frontend checklist React components, hooking locally to gate 4 live readout.
5. Create logic for `POST finalize`, wiring Approve logic only initially.
6. Connect Frontend finalization requests, completing MVP.
7. Wrap up Reject and Return backend logic, surfacing UI to support reasons/stages. Validation enforces robustness.
