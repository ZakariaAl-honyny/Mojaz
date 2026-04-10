# Tasks: 027-category-upgrade

**Input**: Design documents from `specs/027-category-upgrade/`
**Prerequisites**: plan.md ✅ | spec.md ✅
**Branch**: `027-category-upgrade`
**Created**: 2026-04-06

## Phase 1: Persistence & Configuration (Priority: P1)

- [ ] **T2701**: Add `Upgrade` to `ServiceType` enum (New, Renewal, Replacement, Upgrade).
- [ ] **T2702**: Add `UPGRADE_FEE` to `FeeStructures` and `MIN_HOLDING_PERIOD_UPGRADE` (e.g., 1y) in `SystemSettings`.
- [ ] **T2703**: Define `Superseded` status for `License.Status` enum.
- [ ] **T2704**: Seed `AllowedUpgradePaths` (e.g., `B->C`, `B->D`, `C->D`, `F->B`) in `SystemSettings`.

## Phase 2: Domain Logic & API (Priority: P1)

- [ ] **T2705**: Create `IUpgradeService` and `UpgradeService` in the Application layer.
- [ ] **T2706**: Implement `InitiateUpgradeAsync` (Verify holding period, path eligibility).
- [ ] **T2707**: Implement Full Workflow requirement for `ServiceType == Upgrade` (Medical, Training, Testing).
- [ ] **T2708**: Add `POST /api/v1/applications/upgrade` for applicants.
- [ ] **T2709**: Update `LicenseService` to mark old license as `Superseded` if applicable (Feature 024).

## Phase 3: Frontend Wizard Integration (Priority: P1)

- [ ] **T2710**: Update `ServiceSelectionStep` (from 013) to show the "Upgrade My License" service.
- [ ] **T2711**: Build `UpgradeCategoryStep` (Filters destination category based on current license category).
- [ ] **T2712**: Add "Minimum Holding Period" warning if within 1 year.

## Phase 4: Notifications & Audit (Priority: P2)

- [ ] **T2713**: Trigger `INotificationService` on upgrade initiation.
- [ ] **T2714**: Create `AuditLog` entry per upgrade request.
- [ ] **T2715**: Verify category consistency check (National ID must match previous license).

## Phase 5: Verification (Priority: P2)

- [ ] **T2716**: Unit tests for Upgrade Path validation logic (Check `B->C` pass, `A->D` fail).
- [ ] **T2717**: Integration tests for Holding Period enforcement (1y minimum).
- [ ] **T2718**: Verify `UPGRADE_FEE` is charged instead of full application fee.
- [ ] **T2719**: Verify new license reflects higher category and original ID.
- [ ] **T2720**: Verify old license mark as `Superseded` if the category is higher.

## Success Criteria Checklist

- [ ] Upgrade only allowed for valid paths.
- [ ] Holding period (1y or setting) enforced correctly.
- [ ] Full application lifecycle (Medical/Training/Testing) is followed.
- [ ] New license generated with higher category.
- [ ] Old license superseded if applicable.
- [ ] Build completes without errors.
