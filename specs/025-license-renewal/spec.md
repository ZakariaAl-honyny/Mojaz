# Feature Specification: License Renewal Simplified Workflow

**Feature Branch**: `025-license-renewal`  
**Created**: 2026-04-10  
**Status**: Draft  
**Input**: User description: "Simplified renewal workflow with existing license verification from 025 and PRD."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Renew Active License (Priority: P1)

As an applicant with an active driving license that is near its expiry date, I want to renew it through a simplified workflow that verifies my physical fitness but skips training and testing so that I can maintain my driving privileges without redundant steps.

**Why this priority**: High-volume core service; essential for legal compliance of existing drivers.

**Independent Test**: Can be fully tested by initiating a renewal for a user with a valid license, verifying that stages 05 (Training), 06 (Theory), and 07 (Practical) are automatically marked as "Exempt" or "Skipped", and ensuring the new license is issued after medical and fee completion.

**Acceptance Scenarios**:

1. **Given** an applicant has a valid license in category B, **When** they apply for renewal, **Then** the system creates a renewal application that includes Stage 04 (Medical) and Stage 09 (Issuance Payment) but marks Stages 05, 06, and 07 as skipped.
2. **Given** a renewal application is submitted, **When** the system calculates the fee, **Then** it must use the `RENEWAL_FEE` from `FeeStructures` for the specific category.

---

### User Story 2 - Renew Recently Expired License (Priority: P1)

As an applicant with an expired license (within the grace period defined in `SystemSettings`), I want to renew my license without re-taking tests so that I can rectify my status quickly.

**Why this priority**: Essential for handling the standard "grace period" renewal cases.

**Independent Test**: Test with a license expired for 30 days. Verify the simplified workflow still applies.

**Acceptance Scenarios**:

1. **Given** a license expired within the `RENEWAL_GRACE_PERIOD_DAYS` (e.g., 365 days), **When** a renewal application is created, **Then** the simplified workflow is preserved.
2. **Given** a license expired *beyond* the grace period, **When** a renewal is attempted, **Then** [NEEDS CLARIFICATION: Should the system force a full "New Issuance" workflow or a "Restoration" workflow with re-testing?]

---

### User Story 3 - Automatic License Deactivation (Priority: P2)

As a system administrator, I want the system to ensure that only one license is active for a specific category at any time for a single user.

**Why this priority**: Prevents duplication and fraud; maintains clean state.

**Independent Test**: Complete a renewal and verify in the database that the old license record `Status` changed to `Renewed/Inactive` while the new one is `Active`.

**Acceptance Scenarios**:

1. **Given** a new license record is generated at Stage 10, **When** it is successfully issued, **Then** the previous license ID for that user/category is updated to `Renewed/Inactive`.
2. **Given** a renewal is in progress, **When** the old license is still valid, **Then** it remains `Active` until the *moment* the new one is issued.

---

### Edge Cases

- **Unpaid Violations**: What happens if the applicant has unpaid traffic violations? (PRD Gate 4 suggests "No outstanding blocking violations").
- **Medical Failure**: If the medical exam result is "Unfit", the renewal must be blocked.
- **Category Mismatch**: Attempting to renew into a different category must be blocked (this is "Category Upgrade", separate service).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST verify the existence and details (category, expiry) of the applicant's current license before allowing a renewal application.
- **FR-002**: System MUST apply a **Simplified Workflow** for renewals:
  - **Include**: Stage 01 (Creation), 02 (Review), 03 (Initial Fee), 04 (Medical), 08 (Final Approval), 09 (Issuance Fee), 10 (Issuance).
  - **Skip/Exempt**: Stage 05 (Training), 06 (Theory Test), 07 (Practical Test).
- **FR-003**: System MUST calculate the `RENEWAL_FEE` by looking up the entry in `FeeStructures` where `ServiceType = 'Renewal'`.
- **FR-004**: System MUST validate the `Medical Exam` result validity in accordance with the category requirements (e.g., 10 years for B, 5 for C).
- **FR-005**: System MUST calculate the new `ExpiryDate` based on the category's validity duration (e.g., `IssueDate + 10 Years` for Category B).
- **FR-006**: System MUST perform a concurrent update: Set old license to `Renewed/Inactive` and create new license as `Active`.
- **FR-007**: System MUST block renewal if a "Security/Judicial Block" exists on the applicant's profile (PRD Gate 4).

### Key Entities

- **Application**: The transaction record for the renewal process.
- **License**: The credential record (both old and new).
- **FeeStructure**: Configuration for renewal costs.
- **SystemSettings**: For grace period thresholds.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Renewal processing time (operational stages) is < 24 hours (excluding external medical exam completion).
- **SC-002**: Zero cases of an applicant holding two `Active` licenses for the same category after a renewal.
- **SC-003**: 100% of renewals correctly charge the configured `RENEWAL_FEE` rather than the `NEW_ISSUANCE_FEE`.

## Assumptions

- The `RENEWAL_GRACE_PERIOD_DAYS` is at least 365 days unless specified otherwise in settings.
- The applicant's existing license data is available in the `Licenses` table.
- Traffic violations are checked via a (simulated) integration and must be zeroed before the final issuance payment.
