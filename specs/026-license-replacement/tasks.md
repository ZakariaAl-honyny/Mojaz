# Tasks: 026-license-replacement

**Input**: Design documents from `specs/026-license-replacement/`
**Prerequisites**: plan.md ✅ | spec.md ✅
**Branch**: `026-license-replacement`
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
- [ ] Build completes without errors.
