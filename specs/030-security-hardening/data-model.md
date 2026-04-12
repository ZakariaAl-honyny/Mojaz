# Data Model: Security Hardening

## Updates to Existing Entities

### `AuditLog` (Modified)
We will extend the existing `AuditLog` entity to capture more forensic data during security events.

| Property | Type | Description |
| :--- | :--- | :--- |
| `IpAddress` | `string` | IP address of the requester. |
| `UserAgent` | `string` | User agent string for device identification. |
| `IsSuccess` | `bool` | Flag for authentication/authorization success/failure. |
| `ActionCategory` | `string` | e.g., "Authentication", "DataAccess", "SecurityConfiguration". |

### `SystemSetting` (Seed Data/New Keys)
New keys to be added to manage security thresholds dynamically.

| Setting Key | Default Value | Description |
| :--- | :--- | :--- |
| `SECURITY_LOG_RETENTION_DAYS` | `90` | Cleanup period for AuditLogs. |
| `RATE_LIMIT_AUTH_PERMIT` | `10` | Permits for Login/Register. |
| `RATE_LIMIT_AUTH_WINDOW` | `60` | Window (seconds) for Auth rate limit. |
| `RATE_LIMIT_GLOBAL_PERMIT` | `100` | Permits for general data endpoints. |
| `RATE_LIMIT_GLOBAL_WINDOW` | `60` | Window (seconds) for Global rate limit. |
| `MAX_FILE_SIZE_BYTES` | `5242880` | 5MB limit for uploads. |
| `SECURITY_ALERT_THRESHOLD` | `5` | Failed attempts before alerting. |
| `SECURITY_ALERT_WINDOW_MINS` | `10` | Window for alerting threshold. |

## New Value Objects / Enums

### `SecurityEventType` (Enum)
- `LoginFailure` - Repeated failed logins.
- `UnauthorizedAccess` - Access to restricted resource.
- `SuspiciousFileUpload` - File content mismatch.
- `ProtocolViolation` - Missing mandatory security headers.
