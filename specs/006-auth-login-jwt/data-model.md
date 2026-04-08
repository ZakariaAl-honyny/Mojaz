# Data Model: Auth & JWT

## Entities

### `User` (Existing)
Updates to track authentication state and locking.
- `FailedLoginAttempts` (int): Number of consecutive failed login attempts.
- `LockoutEnd` (DateTime?): UTC timestamp when the lockout period expires.
- `IsActive` (bool): If false, user cannot log in.
- `IsVerified` (bool): If false, user cannot log in.
- `PasswordHash` (string): BCrypt hashed password.

### `RefreshToken` (New)
Tracks refresh tokens for users to handle rotation and revocation securely.
- `Id` (GUID): Primary key.
- `UserId` (GUID): Foreign key to `User`.
- `Token` (string): The generated secure string for refresh.
- `ExpiresAt` (DateTime): Expiry time.
- `CreatedAt` (DateTime): Creation time.
- `CreatedByIp` (string): IP address that requested the token.
- `RevokedAt` (DateTime?): Time it was revoked.
- `RevokedByIp` (string?): IP address that revoked the token.
- `ReplacedByToken` (string?): Token string that replaced this one (used in family rotation to detect reuse).
- `IsActive` (Computed): `RevokedAt == null && !IsExpired`.
- `IsExpired` (Computed): `DateTime.UtcNow >= ExpiresAt`.

### `OtpCode`
Temporary codes used for password reset.
- `Id` (GUID): Primary key.
- `UserId` (GUID): Foreign key.
- `CodeHash` (string): BCrypt hashed OTP value.
- `Purpose` (string): Enum string 'PasswordReset'.
- `ExpiresAt` (DateTime): Expiry time.
- `IsUsed` (bool): Indicates if it has been used.

### `AuditLog` (Existing)
Logs authentication events.
- `UserId` (GUID?): Optional user ID.
- `Action` (string): Type of event (Login, Logout, TokenRefresh, PasswordReset).
- `IsSuccess` (bool): Result of the action.
- `IpAddress` (string): Client IP.
- `Details` (string/JSON): Additional event data.
