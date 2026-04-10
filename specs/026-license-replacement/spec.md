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
