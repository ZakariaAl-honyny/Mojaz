# Implementation Plan: 027-category-upgrade

**Feature Branch**: `027-category-upgrade`
**Status**: Draft

## Architecture Overview

Implementation of the license category upgrade system. This allows existing license holders (e.g., Category B) to apply for a higher category (e.g., Category D) after meeting holding period and training requirements.

### Tech Stack
- **Backend**: .NET 8, EF Core 8.
- **Persistence**: `Licenses`, `Applications`, `LicenseCategories`.

## Functional Breakdown

### 1. Upgrade Path Validation (Backend)
- **Logic**:
    1. Verify current `User` has an `Issued` (Active) license.
    2. Define `AllowedUpgradePaths` in `SystemSettings` (e.g., `B->C`, `B->D`, `C->D`, `F->B`).
    3. **Holding Period**: Check `MIN_HOLDING_PERIOD_UPGRADE` (default 12 months) from `SystemSettings` using `OldLicense.IssueDate`.
- **Initiation**: Create a new `Application` with `ServiceType = Upgrade`.
- **Endpoint**: `POST /api/v1/applications/upgrade`

### 2. Upgrade Workflow Logic
- **Full Stage Requirement**: Upgrades, unlike simple renewals, require the full lifecycle (Medical → Training → Theory → Practical).
- **Reduced Training**: Apply `REDUCED_TRAINING_HOURS_UPGRADE` (if defined) in `SystemSettings` for the upgrade path.
- **Payment Stage**: Charge `UPGRADE_FEE` (from `FeeStructures`).

### 3. Application Wizard Integration
- **Component**: `ServiceSelectionStep` (from 013).
- **Features**:
    - "Upgrade My License" option shown only to active license holders.
    - Dropdown of valid higher categories (Filtered by `AllowedUpgradePaths`).
    - Warning if `MIN_HOLDING_PERIOD_UPGRADE` is not yet met.

### 4. Issuance & Record Transition
- **Logic**:
    - Record the link `NewLicense.SourceApplicationId` and `OldLicenseId`.
    - **Dual-holding Policy**: If `CATEGORY_SUPERSESSION` is true (e.g., D supersedes B), mark the old license as `Superseded/Inactive`.
    - Else, allow both to remain `Issued`.

## Phases of Implementation

### Phase 1: Persistence & Settings
1. Add `UPGRADE` value to `ServiceType` enum.
2. Add `UPGRADE_FEE` to `FeeStructures` and `MIN_HOLDING_PERIOD_UPGRADE` (e.g., 1y) in `SystemSettings`.
3. Seed `AllowedUpgradePaths` in `SystemSettings`.

### Phase 2: Workflow Logic & Initiation API
1. Implement `LicenseService.InitiateUpgradeAsync(appId)`.
2. Build the path and holding period validation logic.
3. Add `POST /applications/upgrade`.

### Phase 3: Frontend Wizard Integration
1. Update `ServiceSelectionStep` to show the "Upgrade" service.
2. Filter the "Category Selection" step based on destination paths.
3. Build the holding period countdown/warning message.

### Phase 4: Verification
1. Unit tests for upgrade path validation (Allowed vs Restricted).
2. Integration tests for holding period enforcement (11mo 30d fail, 1y pass).
3. Verify `UPGRADE_FEE` is charged.
4. Verify source license status (Superseded/Inactive vs Remained Active).

## Risks & Mitigations
- **Branch Skipping**: Ensure the full lifecycle is strictly enforced for upgrades unless specifically exempt.
- **Data Mismatch**: Verify that the "Category Upgrade" doesn't inadvertently allow identity changes (National ID must match).
- **Incompatible Licenses**: Explicitly define paths (e.g., cannot upgrade from B to A directly if separate testing is required).
