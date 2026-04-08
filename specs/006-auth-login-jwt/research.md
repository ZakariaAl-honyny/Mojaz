# Phase 0: Research - JWT Auth & Refresh Token Rotation

## Context
Implementing a secure login system with JWT access tokens and refresh tokens with secure rotation for the Mojaz platform.

## Decision 1: Refresh Token Storage & Rotation Approach
- **Decision**: Store refresh tokens in the database mapped to the User. Implement family rotation where using a revoked token automatically invalidates all related tokens in the family to prevent replay attacks.
- **Rationale**: Storing tokens in the database is necessary to manually revoke them and to properly implement token rotation correctly as per secure standards.
- **Alternatives considered**: Stateless refresh tokens (with JWT). Rejected because it limits the ability to immediately revoke access for specific devices or compromised tokens.

## Decision 2: Failed Attempt Locking Mechanism
- **Decision**: Track `FailedLoginAttempts` and `LockoutEnd` directly on the `User` entity. Upon 5 consecutive failed attempts, securely set `LockoutEnd` to `DateTime.UtcNow.AddMinutes(15)`. Reset `FailedLoginAttempts` upon successful login.
- **Rationale**: Simplest and most performant approach since it's a common column in Identity frameworks.

## Decision 3: Audit Logging for Auth Events
- **Decision**: Use the centralized `AuditLogs` table mandated by the constitution. Events logged will include: `LoginSuccess`, `LoginFailed`, `AccountLocked`, `Logout`, `PasswordResetRequested`, `PasswordResetSuccessful`.
- **Rationale**: Complies with the absolute mandatory security requirement (Constitution II) to log all security-sensitive operations.
