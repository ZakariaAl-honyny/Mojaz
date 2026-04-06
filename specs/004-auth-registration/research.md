# Phase 0: Outline & Research

## Decisions & Rationale

**1. OTP Generation and Storage**
- **Decision**: Hash the OTP before storing it in the database and use high-entropy random generation (e.g., `RandomNumberGenerator`).
- **Rationale**: Storing raw OTPs in the database can lead to vulnerabilities if the DB is compromised. Hashing guarantees compliance with the Constitution.
- **Alternatives considered**: Encrypting OTPs rather than hashing (rejected because OTPs are short-lived, irreversible hashing via SHA256 is sufficient and secure).

**2. Handling Cooldown and Resends**
- **Decision**: Check and enforce cooldown using the `OtpCodes` table by comparing `CreatedAt` or the most recent attempt timestamp against the `SystemSettings` values.
- **Rationale**: Provides consistent enforcement server-side across distributed setups, rather than client-side or memory constraints.
- **Alternatives considered**: Redis rate-limiting (rejected because we need to remain strictly aligned with the DB configuration approach via `SystemSettings`).

**3. API Rate Limiting**
- **Decision**: Use ASP.NET Core's built-in `Microsoft.AspNetCore.RateLimiting` configured per IP limit for registration requests (Max 5/minute).
- **Rationale**: Robust, built-in feature that operates at the middleware layer to reject excessive requests immediately, satisfying FR-012 effectively.
- **Alternatives considered**: Custom action filters (rejected as less performant than native rate limiting middleware).

**4. External Provider Email/SMS Failure Handling**
- **Decision**: Enqueue SendGrid and Twilio jobs using Hangfire. Failures will not block the registration flow; they'll be logged in `EmailLog` / `SmsLog`.
- **Rationale**: Registration API must remain fast. User accounts are created in `IsActive=false` state until verified, and users can rely on the explicit resend endpoint.
- **Alternatives considered**: Inline synchronous sending (rejected because network errors would crash user registrations).
