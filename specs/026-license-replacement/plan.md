# Implementation Plan: 026-license-replacement

**Feature Branch**: `026-license-replacement`
**Status**: Draft

## Architecture Overview

Implementation of the license replacement (Lost, Damaged, Stolen) workflow. This feature allows existing license holders to request a new physical/digital copy of their active license without resetting the expiry date.

### Tech Stack
- **Backend**: .NET 8, EF Core 8.
- **Persistence**: `Licenses`, `Applications`, `Documents`.

## Functional Breakdown

### 1. Replacement Eligibility & Initiation (Backend)
- **Logic**:
    1. Verify current `User` has an `Issued` (Active) license.
    2. Ensure no pending replacement/renewal application exists.
    3. **Initiation**: Create a new `Application` with `ServiceType = Replacement`.
- **Skip Logic**: 
    - Set `MedicalStatus = Exempted` (Inherited).
    - Set `TrainingStatus = Exempted` (Inherited).
    - Set `TheoryTestResult = Pass` (Inherited).
    - Set `PracticalTestResult = Pass` (Inherited).
- **Endpoint**: `POST /api/v1/applications/replace`

### 2. Replacement Workflow Gating
- **Document Stage**: Required (Reason: Lost/Damaged/Stolen, optional Police Report upload).
- **Payment Stage**: Charge `REPLACEMENT_FEE` (from `FeeStructures`).
- **Issuance**: Advance to 024 for a new `License` record with the **original** `ExpiryDate`.

### 3. Record Linking & Legacy Inactivation
- **Logic**:
    - Mark the old `License.Status` as `Replaced`.
    - Link `NewLicense.OriginalLicenseId` and `OldLicenseId`.
    - Maintain `OriginalIssueDate` and `OriginalExpiryDate`.
    - Increment `ReplacementCount` (Version) on the new digital copy.

### 4. Applicant Interface (Frontend)
- **Component**: `ReplaceLicenseCard` (from 024).
- **Features**:
    - "Request Replacement" button on an active license.
    - Simplified 2-step confirmation: 1. Select Reason, 2. Proceed to Payment.
    - Display "Replacement In Progress" status.

## Phases of Implementation

### Phase 1: Persistence & Settings
1. Add `REPLACEMENT` value to `ServiceType` enum.
2. Add `REPLACEMENT_FEE` to `FeeStructures`.
3. Define `Replaced` status for `License.Status` enum.

### Phase 2: Workflow Logic & Initiation API
1. Implement `LicenseService.InitiateReplacementAsync(appId)`.
2. Build the stage-skipping logic for `ServiceType == Replacement`.
3. Add `POST /applications/replace`.

### Phase 3: Frontend Integration
1. Update `LicenseCard` to show the "Replace" action.
2. Build the simplified `ReplacementWizard` component.

### Phase 4: Verification
1. Unit tests for replacement eligibility (Must have active license).
2. Integration tests for "Pass through" logic (Skip Medical/Training/Testing).
3. Verify fee retrieval (Replacement price).
4. Verify new license preserves original dates (Expiry should NOT change).

## Risks & Mitigations
- **Fraudulent Replacement**: Require mandatory "Reason" selection and audit log for each request.
- **Expiry Expiration**: If the license is about to expire (within the renewal window), redirect the user to "Renewal" instead of "Replacement".
- **Double-holding**: Ensure old license is marked as `Replaced` and its QR code is invalidated (Optional).
