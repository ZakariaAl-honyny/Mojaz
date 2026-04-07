# Phase 0: Research (Feature 005 - OTP Verification)

## Context
The feature specification for 005 requires an OTP Verification endpoint to activate user accounts and an OTP Resend endpoint with rate limiting (60s cooldown, 3/hour) and cooldown logic. The constitution requires Clean Architecture, strict security (BCrypt hashing, masked logs, zero stack traces), and configurable limits managed via the `SystemSettings` table.

## Findings & Technical Decisions

- **Decision 1**: Database storage for OTP codes.
  **Rationale**: Since OTP verification requires tracking attempts, expiration times, invalidation statuses, and linking to users, storing them in the SQL Server database via EF Core within the `OtpCodes` table guarantees transactional consistency when marked as used and account is activated.
  **Alternatives**: In-memory caching (Redis). Rejected because of the constitution's requirement for full auditability and reliance on SQL Server as the primary database in MVP.

- **Decision 2**: Rate limiting approach.
  **Rationale**: The `AuthService` will coordinate with the database to execute queries that count OTP requests within the last hour and evaluate the timestamp of the last generated OTP. This keeps rate-limiting coupled with the domain rules as prescribed by Clean Architecture.
  
- **Decision 3**: BCrypt hashing for OTP verification.
  **Rationale**: The constitution strictly mandates hashing all OTP codes using BCrypt (cost factor 12+). Plain text storage is forbidden.

- **Decision 4**: Dependency Injection for system settings.
  **Rationale**: Cooldown durations (60s), hourly limits (3), and expiration bounds will be injected via `ISystemSettingsService` exactly as required by the constitution, preventing hardcoded logic.

All "NEEDS CLARIFICATION" points have been resolved by aligning perfectly with the provided Constitution boundaries.
