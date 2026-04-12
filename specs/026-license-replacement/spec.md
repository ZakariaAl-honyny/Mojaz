<<<<<<< HEAD
# Feature Specification: License Replacement (026-license-replacement)

## 1. Clarifications & Key Decisions
- **Data Representation**: Every replacement request results in a new `License` record. This ensures a full audit trail of all issued licenses for an applicant. The previous license is marked with a status of `Replaced`.
- **Fee Structure**: A dedicated `FeeType.LicenseReplacement` is used. The fee is retrieved from the `FeeStructures` table to allow administrative updates without code changes.
- **Workflow Routing**:
    - **Lost/Damaged**: Application $\rightarrow$ Payment $\rightarrow$ Final Approval $\rightarrow$ Issuance.
    - **Stolen**: Application $\rightarrow$ Payment $\rightarrow$ **Document Review (Police Report)** $\rightarrow$ Final Approval $\rightarrow$ Issuance.
- **Document Verification**: Stolen licenses require a police report. The verification is a manual step performed by a Receptionist/Employee.

## 2. User Scenarios & Testing

### User Story 1: Lost/Damaged License Replacement
**Actor**: Applicant
**Scenario**: The user has lost their physical license or it is damaged and needs a new one.
- **Pre-condition**: User has an active driving license.
- **Action**:
    1. User navigates to "License Replacement".
    2. User selects reason: `Lost` or `Damaged`.
    3. User pays the `LicenseReplacement` fee.
    4. System automatically advances the application to `Final Approval`.
    5. System issues a new license and marks the old one as `Replaced`.
- **Expected Result**: A new license is issued; the old license is invalidated.

### User Story 2: Stolen License Replacement
**Actor**: Applicant, Receptionist
**Scenario**: The user's license was stolen and they have a police report.
- **Pre-condition**: User has an active driving license.
- **Action**:
    1. User selects reason: `Stolen`.
    2. User pays the `LicenseReplacement` fee.
    3. User uploads a copy of the Police Report.
    4. **Receptionist** reviews the uploaded Police Report.
    5. Receptionist approves the report.
    6. System advances the application to `Final Approval`.
    7. System issues a new license and marks the old one as `Replaced`.
- **Expected Result**: License is issued only after the police report is verified.

## 3. Functional Requirements

| ID | Requirement | Description |
| :--- | :--- | :--- |
| **FR-001** | Eligibility Check | System must verify the applicant has a currently active license before allowing a replacement request. |
| **FR-002** | Workflow Routing | Route application to `DocumentReview` stage if `ReplacementReason` is `Stolen`. Skip for `Lost/Damaged`. |
| **FR-003** | Fee Retrieval | Retrieve the current replacement fee from `FeeStructures` using `FeeType.LicenseReplacement`. |
| **FR-004** | License State Transition | Upon issuance of the replacement license, the existing active license must be updated to `LicenseStatus.Replaced`. |
| **FR-005** | Document Validation | For `Stolen` reason, the application cannot progress to `FinalApproval` until `IsReportVerified` is `true`. |

## 4. Key Entities
- **Application**: Core entity tracking the replacement request.
- **LicenseReplacement**: Extension entity containing `ReplacementReason`, `IsReportVerified`, and `ReviewComments`.
- **License**: The issued license record (Original and Replacement).
- **ApplicationDocument**: Stores the Police Report (for stolen) or Damaged License photo.
- **FeeStructure**: Provides the cost for `FeeType.LicenseReplacement`.

## 5. Success Criteria
- 100% of replacement requests for "Stolen" licenses require and pass manual verification of the police report before issuance.
- 100% of replacement issuances correctly mark the previous license as `Replaced`.
- Fees are correctly applied based on the `FeeStructures` table.
- Applicants without an active license are blocked from initiating a replacement.
=======
# Feature Specification: 026-license-replacement

**Feature Branch**: `026-license-replacement`
**Created**: 2026-04-06
**Status**: Draft

## Summary

Process for replacing a lost or damaged driving license. Requires an active license and documentation for the replacement reason, while maintaining the original license details on the new physical/digital copy.

## Requirements

### Functional Requirements

- **FR-001**: Verify Active License: Applicant must have an active license to request a replacement.
- **FR-002**: Reason Documentation: Applicant must select a reason (Lost, Damaged, Stolen) and optionally upload a report (e.g., police report for stolen).
- **FR-003**: Replacement Fee: Fetch from `FeeStructures` table.
- **FR-004**: Workflow Skip: Conceptually skips Medical, Training, and Testing stages; proceeds from Payment to Issuance.
- **FR-005**: New License Generation:
    - Generate a new `LicenseNumber` (or maintain original if policy dictates).
    - Original dates (Issue/Expiry) are maintained.
    - Increment `Version` or `ReplacementCount` field.
- **FR-006**: Deactivate Previous: Mark the previous physical license instance as `Replaced/Inactive`.

## Success Criteria

- **SC-001**: Replacement only allowed for currently active licenses.
- **SC-002**: Replacement fee correctly charged.
- **SC-003**: New license PDF generated with the same validity dates as the original.
- **SC-004**: Old license record deactivated in the database.
- **SC-005**: Applicant can track the replacement request on their dashboard.

## Assumptions

- Replacement doesn't reset the expiry date; it only provides a new copy of the current license.
- "Lost" vs "Damaged" might have different document requirements but follow the same fee structure.
>>>>>>> 025-license-renewal
