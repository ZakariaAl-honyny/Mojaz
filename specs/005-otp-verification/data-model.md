# Phase 1: Data Model (Feature 005 - OTP Verification)

## 1. OtpCode Entity

This entity is responsible for storing verification codes independently, fulfilling the requirement for robust tracking and expiration handling.

**Fields:**
- `Id`: `Guid` (Primary Key)
- `UserId`: `Guid` (Foreign Key -> Users)
- `Destination`: `string` (Email or Phone number, masked for logging but stored encrypted or plain depending on config. Assumes plain in Db as per current auth schema)
- `Purpose`: `string` (e.g., "Registration", "PasswordRecovery")
- `CodeHash`: `string` (BCrypt hash of the numerical code)
- `ExpiryTime`: `DateTime` (UTC time when code expires)
- `IsUsed`: `bool` (Flag denoting if the code was successfully redeemed)
- `IsInvalidated`: `bool` (Flag denoting if superseded by a newer code or max attempts reached)
- `AttemptCount`: `int` (Tracks failed verification attempts to enforce the max limit of 3)
- `CreatedAt`: `DateTime` (UTC generation time)
- `UpdatedAt`: `DateTime` (UTC modification time for soft deletes or status changes)

## 2. AuditLog Entity (Reference)

Used heavily in this feature.
**Fields Logged for OTP:**
- `Action`: "OTP_VERIFICATION_SUCCESS", "OTP_VERIFICATION_FAILED_MAX_ATTEMPTS", "OTP_RESEND_SUCCESS", "OTP_RESEND_RATE_LIMITED"
- `UserId`: `Guid`
- `Details`: Masked info of the verification activity
- `CreatedAt`: `DateTime` (UTC)

## 3. SystemSettings (Reference)

Used to fetch configuration values dynamically for the flow logic.
**Keys Accessed:**
- `OTP_VALIDITY_MINUTES_SMS`
- `OTP_VALIDITY_MINUTES_EMAIL`
- `OTP_MAX_ATTEMPTS` (Default: 3)
- `OTP_RESEND_COOLDOWN_SECONDS` (Default: 60)
- `OTP_MAX_RESEND_PER_HOUR` (Default: 3)
