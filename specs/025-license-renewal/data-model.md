# Data Model: License Renewal

## Entities

### RenewalApplication
Inherits from **Application**. Represents the specific state and metadata for a renewal request.

| Field | Type | Description |
|-------|------|-------------|
| OldLicenseId | Guid | Reference to the license being renewed. |
| NewLicenseId | Guid? | Reference to the new license (set after issuance). |
| RenewalFeePaid | bool | Flag for issuance fee payment. |
| MedicalExaminationId | Guid? | Link to the specific medical exam for this renewal. |
| ServiceType | enum | Forced to `ServiceType.Renewal`. |

### License
Represents the issued credential.

| Field | Type | Description |
|-------|------|-------------|
| LicenseStatus | enum | `Active`, `Renewed`, `Expired`, `Suspended`, `Revoked`. |
| ExpiresAt | DateTime | Reset upon renewal based on category rules. |
| IssuedAt | DateTime | The date/time of the renewal issuance. |

### SystemSetting
Configuration keys for renewal logic.

| Key | Default | Description |
|-----|---------|-------------|
| RENEWAL_GRACE_PERIOD_DAYS | 365 | Max days after expiry allowed for simplified renewal. |
| RENEWAL_REQUIRED_CONSENT | true | Whether the user must accept terms specifically for renewal. |

## Relationships

- **RenewalApplication** 1 → 1 **License** (OldLicense)
- **RenewalApplication** 0..1 → 1 **License** (NewLicense)
- **RenewalApplication** 1 → 0..1 **MedicalExamination**

## State Transitions

### Application Status
1. `Draft` → `Submitted` (Initial Fee Paid)
2. `Submitted` → `MedicalExamination` (Wait for fitness)
3. `MedicalExamination` → `PendingFinalApproval` (Tests skipped)
4. `PendingFinalApproval` → `PendingIssuancePayment` (Approved)
5. `PendingIssuancePayment` → `Issued` (Success)

### License Status
- Old License: `Active/Expired` → `Renewed` (At the moment of new issuance)
- New License: `Active` (Created at issuance)
