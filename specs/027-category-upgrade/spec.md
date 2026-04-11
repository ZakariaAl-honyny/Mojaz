# Feature Specification: 027-category-upgrade

**Feature Branch**: `027-category-upgrade`
**Created**: 2026-04-06
**Status**: Draft

## Summary

System to handle upgrading from one license category to another (e.g., Private to Commercial). Includes validation of allowed upgrade paths and enforcement of holding period requirements.

## Requirements

### Functional Requirements

- **FR-001**: Upgrade Path Validation: Enforce allowed sequences based on `LicenseCategories` (e.g., B → C, C → D, F → B).
- **FR-002**: Holding Period Check: Applicant must have held their current license for a minimum duration (e.g., 12 or 24 months) defined in SystemSettings (`MIN_HOLDING_PERIOD_UPGRADE`).
- **FR-003**: Full Stage Workflow: Upgrading to a more complex category (e.g., B to D) requires the full lifecycle: Medical → Training (reduced hours if applicable) → Theory → Practical.
- **FR-004**: Upgrade Fee: Fetch from `FeeStructures`.
- **FR-005**: On Success:
    - Issue new license for the higher category.
    - Keep current license (if dual-holding allowed) or mark it as "Archived" if the new one supersedes it.
- **FR-006**: Wizard Integration: Upgrade options shown clearly in the service selection step.

## Success Criteria

- **SC-001**: Upgrade only allowed for valid paths (400 error for invalid jumps).
- **SC-002**: Holding period enforced; prevents premature upgrades.
- **SC-003**: Correct training hours and fees applied for the upgrade category.
- **SC-004**: Final license reflects the new category accurately.

## Assumptions

- Some categories allow dual-holding (e.g., private + agricultural), while others supersede (e.g., private superseded by commercial for certain vehicle types).
- Holding period check uses `IssueDate` of the active license.
