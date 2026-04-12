# Data Model: License Category Upgrade

## Entities

### `CategoryUpgrade`
Links an existing license to a new application for a higher category.

| Field | Type | Description |
| :--- | :--- | :--- |
| `Id` | `Guid` | Primary Key |
| `LicenseId` | `Guid` | Link to the source license being upgraded. |
| `ApplicationId` | `Guid` | Link to the upgrade application. |
| `FromCategory` | `Enum` | Source category code (e.g., B). |
| `ToCategory` | `Enum` | Target category code (e.g., C). |
| `UpgradedAt` | `DateTime` | Timestamp of final issuance. |
| `ProcessedBy` | `Guid?` | Examiner/Admin who approved the final stage. |

## Configuration (SystemSettings)

| Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `MIN_HOLDING_PERIOD_UPGRADE` | `int` | `12` | Minimum months current license must be held. |
| `UPGRADE_TRAINING_REDUCTION_PCNT` | `int` | `25` | Percentage reduction for training hours. |

## State Transitions

1. **Eligibility Check**: `License.IssueDate` + `MIN_HOLDING_PERIOD_UPGRADE` <= `DateTime.UtcNow`.
2. **Application Initiation**: ServiceType = `CategoryUpgrade`.
3. **Workflow Stages**:
    - ... (Stage 1-5)
    - **Stage 5 (Training)**: Hours = `RequiredHours` * (1 - `REDUCTION_PCNT`).
    - **Stage 6 (Theory)**: Skipped if `From:C/D/E` and `To:D/E`.
    - ...
4. **Completion (Stage 10)**: 
    - Create `CategoryUpgrade` record.
    - Archive `License` (if superseding).
    - Issue new `License`.
