# Research: License Renewal Implementation

## Policy & Business Rules

### 1. Grace Period & Expiry Handling
- **Decision**: Licenses can be renewed without re-testing if they are within the `RENEWAL_GRACE_PERIOD_DAYS` (Default: 365).
- **Rationale**: Standard government policy allows a 1-year window after expiry to renew without full retraining.
- **Beyond Grace**: If the license is expired beyond the grace period, the application will be blocked, and the user will be directed to initiate a "New License Issuance" (Option A from the spec clarification).

### 2. Fee Mapping
- **Decision**: The system will use `FeeType.RenewalFee` for the issuance stage and `FeeType.ApplicationFee` for the initial stage (if applicable).
- **Rationale**: Consistency with existing `FeeType` enum and `FeeStructures` table.

### 3. Workflow Stages
- **Decision**: Simplified workflow skips Stages 05 (Training), 06 (Theory), and 07 (Practical).
- **Verification**: The code must explicitly handle `RenewalApplication` type to set these stages to `Skipped` or `Exempt` during the status transition logic.

## Technical Implementation

### 1. Atomic License Transition
- **Pattern**: Use EF Core `IDbContextTransaction` to ensure that:
  - The old license is marked as `LicenseStatus.Renewed`.
  - The new license record is created as `LicenseStatus.Active`.
  - The application is marked as `ApplicationStatus.Issued`.
- **Location**: This logic should reside in `LicenseService.IssueLicenseAsync` or a specialized `RenewalService`.

### 2. Data Model Consistency
- Existing `RenewalApplication` entity already inherits from `Application` and includes links to `OldLicenseId`.
- `License` entity has `Status` field with `Renewed` option.

## Integration & Best Practices

- **Notifications**: Trigger `NotificationEventType.LicenseRenewed` upon completion.
- **PDF Generation**: Reuse `QuestPdfLicenseGenerator` with a "Renewed" flag context if any visual distinction is needed (though usually, it's a fresh license document).
- **Audit Logging**: Log the transition from `OldLicenseId` to `NewLicenseId` in the `AuditLog`.

## Open Questions Resolved
- **Exceeded Grace Period**: Handled by blocking the renewal and requiring a new application.
- **Medical Validity**: Fixed requirement for all renewals.
- **Atomic Swap**: Handled via DB transaction.
