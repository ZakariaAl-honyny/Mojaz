# Tasks: 026-license-replacement

**Input**: Design documents from `specs/026-license-replacement/`
**Prerequisites**: plan.md ✅ | spec.md ✅
**Branch**: `026-license-replacement`
<<<<<<< HEAD
**Created**: 2026-04-10

## Phase 1: Persistence & Configuration (Priority: P1)

- [ ] **T2601**: Add `Replacement` to `ServiceType` enum in `Mojaz.Domain`. [P]
- [ ] **T2602**: Add `ReplacementFee` to `FeeType` enum in `Mojaz.Domain`. [P]
- [ ] **T2603**: Add `Replaced` status to `LicenseStatus` enum in `Mojaz.Domain`.
- [ ] **T2604**: Seed `REPLACEMENT_FEE` in `FeeStructures` table.
- [ ] **T2605**: Add replacement-related settings to `SystemSettings` if required.

## Phase 2: Core Logic & API (Priority: P1)

- [ ] **T2606**: Create `IReplacementService` and `ReplacementService` in the Application layer.
- [ ] **T2607**: Implement `ValidateReplacementEligibilityAsync` (Check for active license, ownership).
- [ ] **T2608**: Implement `InitiateReplacementAsync` (Create application with `ServiceType.Replacement`).
- [ ] **T2609**: Implement streamlined workflow logic (Skip Medical, Training, and Testing stages). [P]
- [ ] **T2610**: Update `LicenseService` to transition old license to `Replaced` status upon new license issuance.
- [ ] **T2611**: Create `POST /api/v1/applications/replacement` endpoint in `ApplicationsController`.

## Phase 3: Frontend Wizard Integration (Priority: P1)

- [ ] **T2612**: Update `ServiceSelectionStep` to include "License Replacement" as a service option. [P]
- [ ] **T2613**: Create `ReplacementReasonStep` (Users select: Lost, Stolen, or Damaged).
- [ ] **T2614**: Update `ApplicationWizard` to skip non-applicable stages for replacement services.
- [ ] **T2615**: Implement Frontend validation for replacement requests (ensure an active license is selected).

## Phase 4: Notifications & Audit (Priority: P2)

- [ ] **T2616**: Integrate `INotificationService` to alert user upon replacement request submission. [P]
- [ ] **T2617**: Implement `AuditLog` entry for license replacement initiation and completion. [P]
- [ ] **T2618**: Add i18n translation keys for replacement reasons and status messages in `locales/*.json`.

## Phase 5: Verification (Priority: P2)

- [ ] **T2619**: Unit tests for `ReplacementService` (Eligibility checks, Ownership validation).
- [ ] **T2620**: Integration tests for the replacement API endpoint (Success and Failure scenarios).
- [ ] **T2621**: Verify `REPLACEMENT_FEE` is correctly applied from `FeeStructures`.
- [ ] **T2622**: Verify old license status is updated to `Replaced` after the new license is issued.
- [ ] **T2623**: E2E tests for the replacement flow (Service Selection $\rightarrow$ Reason $\rightarrow$ Payment $\rightarrow$ Issuance).

## Success Criteria Checklist

- [ ] Only users with an active license can initiate a replacement.
- [ ] Replacement application skips medical and testing requirements.
- [ ] Correct replacement fee is charged.
- [ ] Previous license is marked as `Replaced` upon successful replacement.
- [ ] Full RTL/LTR and AR/EN support for replacement-specific UI.
- [ ] All API responses wrapped in `ApiResponse<T>`.
=======
**Created**: 2026-04-06

## Phase 1: Persistence & Configuration (Priority: P1)

- [ ] **T2601**: Add `Replacement` to `ServiceType` enum (New, Renewal, Replacement, Upgrade).
- [ ] **T2602**: Add `REPLACEMENT_FEE` to `FeeStructures`.
- [ ] **T2603**: Define `Replaced` status for `License.Status` enum.
- [ ] **T2604**: Update `ApplicationDbContext` with `REPLACEMENT` seeder data.

## Phase 2: Domain Logic & API (Priority: P1)

- [ ] **T2605**: Create `IReplacementService` and `ReplacementService` in the Application layer.
- [ ] **T2606**: Implement `InitiateReplacementAsync` (Verify eligibility, create simplified application).
- [ ] **T2607**: Implement Stage-Skipping logic:
    - Auto-set `MedicalStatus` to `Exempted`.
    - Auto-set `TrainingStatus` to `Exempted`.
    - Auto-set `TheoryResult` to `Pass`.
    - Auto-set `PracticalResult` to `Pass`.
- [ ] **T2608**: Add `POST /api/v1/applications/replace` for applicants.
- [ ] **T2609**: Implement logic to preserve `OriginalExpiryDate` on new replacement issuance (Feature 024).

## Phase 3: Frontend Replacement Interface (Priority: P1)

- [ ] **T2610**: Update `LicenseCard` (from 024) to show "Request Replacement" if active.
- [ ] **T2611**: Build `ReplacementWizard` (Simplified - Steps: Reason Selection, Payment).
- [ ] **T2612**: Add dropdown for replacement reasons (Lost, Damaged, Stolen).

## Phase 4: Notifications & Audit (Priority: P2)

- [ ] **T2613**: Trigger `INotificationService` on replacement initiation.
- [ ] **T2614**: Create `AuditLog` entry per replacement request.
- [ ] **T2615**: Verify redirection to "Renewal" if within the expiration window.

## Phase 5: Verification (Priority: P2)

- [ ] **T2616**: Unit tests for Replacement eligibility (Active license holder check).
- [ ] **T2617**: Integration tests for skipped stages (Medical/Training/Testing "Exempted" state).
- [ ] **T2618**: Verify `REPLACEMENT_FEE` is charged instead of full application fee.
- [ ] **T2619**: Verify new license preserves original dates (Expiry does NOT change).
- [ ] **T2620**: Verify old license is correctly inactivated (Replaced status).

## Success Criteria Checklist

- [ ] Replacement only allowed for currently active licenses.
- [ ] Replacement fee correctly charged.
- [ ] Original validity dates (Issue/Expiry) are maintained on new copy.
- [ ] Old license inactivated.
- [ ] Applicant notified on initiation and completion.
>>>>>>> 025-license-renewal
- [ ] Build completes without errors.
