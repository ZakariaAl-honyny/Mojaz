# Phase 1: Data Model - Unified Notification Service

## Overview
This defines the entities tracking Multi-Channel Notifications.

### Entity: Notification
| Field | Type | Note |
|-------|------|------|
| `Id` | INT (PK) | Auto increment |
| `UserId` | INT (FK) | Target user |
| `ApplicationId` | INT (FK) | Nullable link to relevant application |
| `TitleAr` | NVARCHAR(200) | |
| `TitleEn` | NVARCHAR(200) | |
| `MessageAr` | NVARCHAR(1000) | |
| `MessageEn` | NVARCHAR(1000) | |
| `EventType` | NVARCHAR(50) | Differentiates notification context |
| `IsRead` | BIT | Default 0 |
| `ReadAt` | DATETIME2 | Nullable |
| `CreatedAt` | DATETIME2 | UTC Default GETUTCDATE() |

### Entity: PushToken
| Field | Type | Note |
|-------|------|------|
| `Id` | INT (PK) | Auto increment |
| `UserId` | INT (FK) | Device owner |
| `Token` | NVARCHAR(500) | FCM client token |
| `DeviceType` | NVARCHAR(30) | Expected values: WebChrome/WebFirefox/WebSafari |
| `IsActive` | BIT | Default 1 |
| `CreatedAt` | DATETIME2 | UTC Default GETUTCDATE() |
| `LastUsedAt`| DATETIME2 | Updated upon dispatch |

### Entity: EmailLog
*(See Database Section 21.20 for full details)*
Tracks individual SendGrid dispatches, linking `UserId`, `ToEmail`, `ProviderMessageId`, `Status`, and `FailureReason`.

### Entity: SmsLog
*(See Database Section 21.21 for full details)*
Tracks individual Twilio dispatches, linking `UserId`, `ToPhone`, `ProviderMessageId`, `Status`, and `FailureReason`.
