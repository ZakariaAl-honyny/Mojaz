# Feature Specification: License Renewal Simplified Workflow

**Feature Branch**: `025-license-renewal`  
**Created**: 2026-04-10  
**Status**: Draft  
**Input**: User description: "Simplified renewal workflow with existing license verification."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Renew Active or Recently Expired License (Priority: P1)

As an applicant with an active or recently expired driving license, I want to renew my license through a simplified workflow that skips unnecessary training and testing stages so that I can quickly receive my updated license.

**Why this priority**: License renewal is a high-volume, critical service that must provide a seamless experience for users whose credentials form an essential daily requirement.

**Independent Test**: Can be fully tested by submitting a renewal application for a user with a valid license, observing the skipped stages, and verifying the issuance of the new license.

**Acceptance Scenarios**:

1. **Given** an applicant has an active license or one expired within the allowed grace period, **When** they apply for renewal, **Then** the system creates a renewal application that skips the Training and Testing stages but includes the Medical Exam stage.
2. **Given** a renewal application reaches the payment stage, **When** the applicant pays, **Then** the correct renewal fee from `FeeStructures` is charged.

---

### User Story 2 - Deactivate Old License on Renewal (Priority: P2)

As a system administrator, I want the system to seamlessly deactivate the old license and calculate new dates for the renewed license to maintain accurate and singular validity records.

**Why this priority**: Prevents users from holding multiple valid licenses for the same category and ensures regulatory compliance.

**Independent Test**: Can be tested by completing a renewal and checking the database records for both the old and new license states.

**Acceptance Scenarios**:

1. **Given** a successful license renewal application is approved and paid for, **When** the new license is issued, **Then** the previous license record is marked as `Renewed/Inactive`.
2. **Given** a new license is generated, **When** it is issued, **Then** the `IssueDate` reflects the current date and the `ExpiryDate` is calculated appropriately (e.g., 5 or 10 years).

### Edge Cases

- What happens when an applicant attempts to renew a license that has been expired beyond the grace period policy? (Should it require full re-testing?)
- How does system handle ongoing or unpaid traffic violations during the renewal process?
- What happens if the medical examination returns a "Medically Unfit" result during the renewal process?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST verify that the applicant holds an existing, eligible license in the same requested category.
- **FR-002**: System MUST apply a simplified workflow that skips the Training and Testing stages if the license is within the acceptable renewal period (e.g., within 1 year before/after expiry).
- **FR-003**: System MUST require a valid Medical Exam result for all license renewals.
- **FR-004**: System MUST fetch and apply the base "Renewal Fee" from the `FeeStructures` table, distinct from "New Application" fees.
- **FR-005**: System MUST calculate a new `IssueDate` and `ExpiryDate` correctly based on category validity parameters upon final issuance.
- **FR-006**: System MUST generate a new `License` record upon completion.
- **FR-007**: System MUST mark the old `License` record as `Renewed/Inactive` concurrently with the new license issuance.

### Key Entities

- **Application**: Represents the renewal process incorporating stages tailored to the applicant's existing license status.
- **License**: The actual credential; involves checking the state of the old license and generating the newly validated record.
- **FeeStructure**: Provides the financial parameters specific to the renewal service.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of renewal applications initiated for valid previous licenses automatically skip Training and Testing stages.
- **SC-002**: 100% of newly issued renewal licenses strictly coincide with the deactivation of their predecessor records.
- **SC-003**: The time to complete the operational stages of a renewal is reduced by 70% compared to new issuance (excluding medical exam wait times).

## Assumptions

- Renewal policy threshold (acceptable time frame after expiry to renew without re-testing) is configured in `SystemSettings`.
- Medical exams remain a mandatory requirement to ensure continued physical fitness of the drivers.
- The applicant's existing license data is accurately stored and accessible from the system infrastructure.
