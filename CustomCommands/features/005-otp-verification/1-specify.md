# Feature 005: OTP Verification and Resend System

> **Status:** To be generated via `/speckit.clarify`

## WHAT WE'RE BUILDING:
OTP verification endpoint that activates user accounts, and OTP resend endpoint with rate limiting and cooldown.

## REQUIREMENTS:

### 1. Verify OTP Endpoint:
POST /api/v1/auth/verify-otp

Request: { "destination": "email or phone", "code": "123456", "purpose": "Registration" }

Logic:
- Find most recent unused OTP for destination + purpose
- Check OTP not expired, attempt count < maxAttempts (3)
- Compare code against stored hash (BCrypt verify)
- On SUCCESS: Mark OTP used, activate user account, create audit log
- On FAILURE: Increment AttemptCount, if >= MaxAttempts invalidate OTP
- On EXPIRED: Return error suggesting resend

### 2. Resend OTP Endpoint:
POST /api/v1/auth/resend-otp

Logic:
- Check cooldown: last OTP sent < 60 seconds → reject
- Check hourly limit: OTPs in last hour < 3 → reject
- Invalidate previous unused OTPs, generate new, hash, store, send

## ACCEPTANCE CRITERIA:
- [ ] Correct OTP within time limit → account activated
- [ ] Wrong OTP → attempt count incremented, remaining shown
- [ ] Expired OTP → clear error message
- [ ] 3 wrong attempts → OTP invalidated
- [ ] Resend within 60s cooldown → 429
- [ ] Resend more than 3/hour → 429
- [ ] Old OTPs invalidated when new sent
- [ ] Destination masked in response
