# Tasks: License Renewal Simplified Workflow

**Input**: Design documents from `/specs/025-license-renewal/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | data-model.md ✅ | contracts/ ✅

## Format: `[ID] [P?] [Story?] Description — file path`

- **[P]**: Parallelizable (different files, no in-flight dependencies)
- **[US#]**: User story ownership
- All paths relative to repo root

---

## Phase 1: Setup (Initialize structure, configs, dependencies)

**Purpose**: Project initialization and service registration

- [X] T001 Register `IRenewalService` and its implementation in `src/backend/Mojaz.API/Program.cs`
- [X] T002 [P] Create initial translation keys for renewal in `frontend/public/locales/ar/common.json` and `frontend/public/locales/en/common.json`

---

## Phase 2: Foundational (Core infrastructure and settings retrieval)

**Purpose**: Core infrastructure and settings retrieval

- [X] T003 Implement `RENEWAL_GRACE_PERIOD_DAYS` retrieval in `src/backend/Mojaz.Infrastructure/Services/SettingsService.cs`
- [X] T004 [P] Extend `FeeService` to support `ServiceType.Renewal` lookups in `src/backend/Mojaz.Infrastructure/Services/FeeService.cs`
- [X] T005 Update `ApplicationService` to recognize `ServiceType.Renewal` during stage initialization in `src/backend/Mojaz.Application/Services/ApplicationService.cs`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 & 2 - [Eligible Renewal] (Priority: P1) 🎯 MVP

**Goal**: Enable simplified renewal for active or recently expired licenses (within 365-day grace period).

**Independent Test**: Initiate renewal for an active license and an expired license (30 days ago). Verify stages 05-07 are skipped and `RenewalFee` is applied.

### Implementation for US1 & US2

- [X] T006 [US1] [US2] Implement `ValidateEligibilityAsync` in `src/backend/Mojaz.Application/Services/RenewalService.cs` (Checks expiry vs `RENEWAL_GRACE_PERIOD_DAYS`)
- [X] T007 [US1] [US2] Implement `CreateRenewalAsync` in `src/backend/Mojaz.Application/Services/RenewalService.cs` (Validates old license ownership)
- [X] T008 [US1] [US2] Implement the `SimplifiedWorkflow` logic in `src/backend/Mojaz.Application/Workflows/RenewalWorkflow.cs` (Auto-completes Stages 05, 06, 07)
- [ ] T009 [P] [US1] [US2] Create the frontend `RenewalWizard.tsx` in `frontend/src/components/domain/license/RenewalWizard.tsx`

**Checkpoint**: Users can now apply for renewal and advance to Medical Examination stage.

---

## Phase 4: User Story 3 - [Atomic Deactivation] (Priority: P2)

**Goal**: Ensure old license is deactivated *only* when the new one is successfully issued.

**Independent Test**: Complete the renewal flow and check the DB `Licenses` table. Verify old record is `Renewed` and new record is `Active`.

### Implementation for US3

- [X] T010 [US3] Implement `IssueRenewedLicenseAsync` in `src/backend/Mojaz.Application/Services/RenewalService.cs` using an `IDbContextTransaction`
- [X] T011 [US3] Update `ApplicationStatus` to `Issued` ensuring atomic update of old license status in `src/backend/Mojaz.Infrastructure/Repositories/LicenseRepository.cs`
- [X] T012 [US3] [P] Implement `LicenseRenewed` notification trigger in `src/backend/Mojaz.Application/Handlers/RenewalNotificationHandler.cs`

---

## Phase 5: Polish (i18n translations, RTL support, Dark Mode, Final Validation)

**Purpose**: Final verification and UI polish

- [X] T013 [P] Add unit tests for `RenewalService.ValidateEligibilityAsync` in `tests/Mojaz.Application.Tests/Services/RenewalServiceTests.cs`
- [ ] T014 [P] Add E2E Playwright test for the full renewal flow in `tests/e2e/license-renewal.spec.ts`
- [ ] T015 Run quickstart.md validation to ensure dev experience is smooth

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Stories (Phase 3 & 4)**: Depend on Foundational (Phase 2).
- **Polish (Phase 5)**: Depends on all user stories.

### Parallel Opportunities
- T002 (Translations) and T001 (DI registration) can run in parallel.
- T004 (FeeService) and T003 (Settings) are parallelizable.
- T009 (Frontend Wizard) can start as soon as `RenewalService` API contracts are defined in `api.md`.
- Notification triggers (T012) can be developed in parallel with the core issuance logic (T010).

---

## Implementation Strategy

### MVP First (User Story 1 & 2)
1. Complete Phase 1 & 2.
2. Implement Phase 3 (Initiation & Eligibility).
3. **STOP and VALIDATE**: Test that a user can start a renewal and see the simplified stages.

### Incremental Delivery
1. Foundation -> Eligible Initiation (MVP ready for internal review).
2. Atomic Issuance (Ready for production).
3. Polish (Hardening).