# Phase 1: Data Model

## License Entity

| Field | Type | Required | Description |
|---|---|---|---|
| Id | Guid / int | Yes | Primary Key |
| LicenseNumber | string | Yes | Unique identifier MOJ-YYYY-XXXXXXXX |
| IssueDate | DateTime | Yes | UTC date of issuance |
| ExpiryDate | DateTime | Yes | Calculated via LicenseCategory |
| CategoryId | Guid / int | Yes | FK to LicenseCategories |
| UserId | Guid / string | Yes | FK to Users table (Applicant) |
| ApplicationId | Guid / int | Yes | FK to Applications |
| BlobUrl | string | Yes | Reference relative path mapping to stored PDF blob |
| IsActive | bool | Yes | Defaults to true |

**Validation Rules**
- `LicenseNumber` must match regex `^MOJ-\d{4}-\d{8}$`.
- `ExpiryDate` must strictly be greater than `IssueDate`.
- `BlobUrl` must not be null/empty upon finalized creation.

**State Transitions**
- This feature only dictates entity creation. Active state toggles are managed by subsequent workflows (revocations).
