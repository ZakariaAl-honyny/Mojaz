# Data Model: PushToken

## Entity: `PushToken`

Belongs in `Mojaz.Domain.Entities`. Follows the standard entity base class format mapping to the `PushTokens` SQL table.

### Fields

| Name | Type | Description |
|------|------|-------------|
| `Id` | `int` (PK) | Primary Key (Assuming integer or Guid based on project's BaseEntity) |
| `UserId` | `string` / `int` (FK) | Foreign Key mapping to the `Users` table (Standard identity column type) |
| `Token` | `string` | The Firebase FCM Device Token. Max length constrained (e.g., 500 chars). |
| `DeviceType` | `string` | Operating system / Browser platform (e.g., "Web", "iOS", "Android") for potential segmentation later. |
| `CreatedAt` | `DateTime` | UTC timestamp of token registration creation. |
| `LastUsedAt` | `DateTime?` | UTC timestamp updated on successful push delivery to detect active usage. |
| `IsActive` | `bool` | Default `true`. Marks if the token is currently listening. Switched to `false` when user explicitly logs out or Firebase returns "NotRegistered" error. |

*Note: Since standard Soft Delete is enabled in the Constitution, `IsDeleted` will also be inherited/implemented.*

### Relationships

- **User**: Many-to-One. A single User can have multiple active `PushTokens` across different browsers (Mobile browser + PC browser).

### Constraints & Validations

- The `Token` must be unique across the table (an active Token should only be linked to one user at a time).
- Validating the `Token` exists and is non-empty upon insert.
- Validating the associated `UserId` is valid.
