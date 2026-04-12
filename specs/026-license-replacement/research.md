# Research: License Replacement Implementation

## Decision: Data Representation of Replacement
- **Selection**: Each replacement generates a new `License` record linked to the `ApplicantId`.
- **Rationale**: Storing each physical/digital issue as a separate record allows for a full history of active/inactive licenses, each with its own `LicenseNumber`, while maintaining relationships to the original application.
- **Alternatives Considered**: Modifying a single `License` record with a `Version` column. Rejected because it makes auditing individual card statuses (Lost vs Replaced) more complex.

## Decision: Fee Structure Implementation
- **Selection**: Add a `FeeType.LicenseReplacement` enum value and configure a fixed entry in `FeeStructures`.
- **Rationale**: Aligns with Principle III (Configuration). Allows admins to change the replacement cost without code changes.
- **Alternatives Considered**: Using the standard `IssuanceFee`. Rejected because replacements are generally cheaper than new licenses as they exclude training/testing costs.

## Decision: Manual Review Workflow
- **Selection**: Introduce an `ApplicationType.Replacement` and use the existing `Status` machine but with a custom `Stage` sequence: `InitialPayment` -> `DocumentReview` (Conditional) -> `FinalApproval` -> `Issuance`.
- **Rationale**: For "Stolen", the workflow stops at `DocumentReview` for a Receptionist. For "Lost/Damaged", it can skip or auto-advance if no review is required (per policy, but we've chosen manual for Stolen).
- **Alternatives Considered**: A separate `ReplacementRequest` table outside the `Application` system. Rejected because it duplicates status tracking and notification logic already built into the `Application` core.

## Decision: Document Verification
- **Selection**: Use Blob storage with a naming convention `replacement-docs/{ApplicationId}/{FileName}`.
- **Rationale**: Standard practice in the current project. Ensures sensitive photos and police reports are isolated.
