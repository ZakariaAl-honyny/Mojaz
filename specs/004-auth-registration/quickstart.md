# Quickstart: Auth Registration

## High-Level Overview

This module is responsible for verifying users before letting them access the Mojaz Driving License portal. We offer two registration paths:
1. **Email** (generates email OTP valid for 15m)
2. **Phone** (generates SMS OTP valid for 5m)

## Important Configuration Requirements
Ensure the following are properly defined in your environment and/or local database `SystemSettings` table:

- `OTP_VALIDITY_MINUTES_SMS` = 5
- `OTP_VALIDITY_MINUTES_EMAIL` = 15
- `OTP_MAX_ATTEMPTS` = 5
- `OTP_RESEND_COOLDOWN_SECONDS` = 60
- `OTP_MAX_RESEND_PER_HOUR` = 3

## Architectural Highlights
- **OTP Generation**: Uses cryptographically secure random values. Stored securely as Bcrypt hashes in the `OtpCodes` table.
- **Delivery mechanism**: Sending via Twilio / SendGrid happens through an async job via Hangfire.
- **Failures**: Registration succeeds locally even if the immediate async SendGrid/Twilio API fails. The user can easily request a resend using the `/auth/resend-otp` route.
- **Abuse Prevention**: Max 5 attempts per IP limit. Max 3 resend attempts per hour are tracked directly in the DB to avoid SMS bumping abuse.
