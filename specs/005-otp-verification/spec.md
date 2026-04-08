# Feature Specification: OTP Verification and Resend System

**Feature Branch**: `005-otp-verification`  
**Created**: 2026-04-06
**Status**: Draft  
**Input**: User description: "OTP verification endpoint that activates user accounts, and OTP resend endpoint with rate limiting and cooldown."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Verify OTP to Activate Account (Priority: P1)

As a newly registered user, I want to verify my email or phone number using an OTP so that I can activate my account and start using the platform.

**Why this priority**: Essential for completing the registration process and verifying user contact methods before allowing access to the Mojaz platform.

**Independent Test**: Can be independently tested by submitting a valid verification request with the correct OTP for a newly registered, inactive user.

**Acceptance Scenarios**:

1. **Given** an unverified user account with a valid, unexpired OTP, **When** the user submits the correct OTP code, **Then** the account is activated, the OTP is marked as used, and an audit log is created.
2. **Given** an unverified user account, **When** the user submits an incorrect OTP, **Then** an error is returned, the attempt count is incremented, and remaining attempts are shown.
3. **Given** an unverified user account, **When** the user submits an expired OTP, **Then** a clear error message is returned suggesting they request a new OTP.
4. **Given** an unverified user account with 2 failed OTP attempts, **When** the user submits an incorrect OTP for the 3rd time, **Then** the OTP is invalidated and no further attempts are permitted for that specific OTP.

---

### User Story 2 - Resend OTP Code (Priority: P2)

As a newly registered user who did not receive or lost the OTP code, I want to request a new OTP so that I can successfully verify my account.

**Why this priority**: Necessary fallback mechanism for users who face issues with email or SMS delivery.

**Independent Test**: Can be tested independently by calling the resend endpoint and verifying rate limits, cooldowns, and the invalidation of prior OTPs.

**Acceptance Scenarios**:

1. **Given** a user who previously requested an OTP more than 60 seconds ago and has not exceeded hourly limits, **When** the user requests a new OTP, **Then** any previous unused OTPs are invalidated, and a new OTP is generated, hashed, stored, and sent to the destination.
2. **Given** a user who requested an OTP within the last 60 seconds, **When** the user requests another OTP, **Then** the system returns a 429 Too Many Requests error due to the cooldown enforcement.
3. **Given** a user who has already requested 3 OTPs within the last hour, **When** the user requests another OTP, **Then** the system returns a 429 Too Many Requests error enforcing the hourly limit.
4. **Given** a successful OTP resend request, **When** the system sends the response, **Then** the destination (email/phone) is returned but suitably masked for privacy and security.

### Edge Cases

- What happens when a user attempts to verify an OTP that was already invalidated by a newer resend request? The system treats it as invalid/expired.
- How does the system handle concurrent verification and resend requests for the same user? Database locking or transaction scopes should ensure consistency and prevent race conditions.
- What happens if the email or SMS service is down during a resend request? The system should fail gracefully, not incrementing the hourly limit, and notify the user to try again later.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose a POST `/api/v1/auth/verify-otp` endpoint accepting destination, code, and purpose (e.g., "Registration").
- **FR-002**: System MUST find the most recent unused OTP for the specific destination and purpose.
- **FR-003**: System MUST verify the provided code against the stored hash using BCrypt verification.
- **FR-004**: System MUST activate the user account and log the action via the Audit service upon successful OTP verification.
- **FR-005**: System MUST increment an attempt counter for incorrect OTPs and invalidate the OTP if max attempts (3) are reached.
- **FR-006**: System MUST expose a POST `/api/v1/auth/resend-otp` endpoint to generate and send a new OTP.
- **FR-007**: System MUST enforce a 60-second cooldown between OTP resend requests per destination.
- **FR-008**: System MUST enforce a limit of 3 OTP requests per hour per destination.
- **FR-009**: System MUST invalidate all previous unused OTPs for a destination+purpose when a new one is generated.
- **FR-010**: System MUST mask the destination (email/phone) in the response of the resend endpoint.

### Key Entities

- **User**: The account being verified and activated.
- **OtpCode**: Stores the hashed OTP code, destination, purpose, expiry time, used status, attempt count, and invalidation status.
- **AuditLog**: Stores records of successful validations for security and tracking.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: OTP codes are verified in under 500ms on the backend.
- **SC-002**: Cooldown and hourly rate limit rules block 100% of abusive or spammy requests.
- **SC-003**: 99% of generated OTPs successfully invalidate preceding unverified OTPs.
- **SC-004**: All successful verification events generated an Audit Log entry.

## Assumptions

- The system relies on existing `SystemSettings` values for OTP validity periods (e.g., email vs phone expiry minutes).
- Active notifications integration (Email/SMS) is available and functional for delivering the reset OTPs.
- Hash comparison utilizes BCrypt algorithm as standardly required across Mojaz.
- OTPs are entirely numeric and typically 4-6 digits long.
