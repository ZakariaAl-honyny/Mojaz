# Contract: Security Alert Email

## Endpoint Trigger (Implicit)
Triggered by `SecurityAlertingService` when threshold is exceeded.

## Payload (Email Template Context)

| Field | Type | Description |
| :--- | :--- | :--- |
| `AlertId` | `string` | Unique identifier (GUID). |
| `Severity` | `string` | "HIGH" / "CRITICAL". |
| `EventDescription` | `string` | Human-readable explanation (e.g., "5 failed logins detected"). |
| `IpAddress` | `string` | Suspected IP address. |
| `Timestamp` | `DateTime` | UTC time of alert generation. |
| `InvolvedAccount` | `string` | Username/Email involved (if applicable). |

## Response Action
- Delivered via SendGrid. 
- Logged in `AuditLog` with `ActionType = "SecurityAlertSent"`.
