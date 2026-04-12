# Feature Specification: User Login with JWT Access Token and Refresh Token Rotation

**Feature Branch**: `006-auth-login-jwt`  
**Created**: 2026-04-06  
**Status**: Draft  
**Input**: User description: "Feature 006: User Login with JWT Access Token and Refresh Token Rotation"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Login (Priority: P1)

As a registered user, I want to securely log in to the Mojaz platform using my email or phone number and password so that I can access my personalized dashboard and services.

**Why this priority**: Login is the gateway to all authenticated features in the system; without it, no user can access restricted services.

**Independent Test**: Can be fully tested by submitting valid and invalid credentials via the API and verifying the correct generation of access tokens or error responses.

**Acceptance Scenarios**:

1. **Given** valid credentials (email/phone and password), **When** the user attempts to log in, **Then** the system grants access, returns a JWT and a refresh token, and logs the login event in the audit trail.
2. **Given** invalid credentials, **When** the user attempts to log in, **Then** the system returns a generic "Invalid credentials" error and increments the failed attempt counter.
3. **Given** an unverified or deactivated account, **When** the user attempts to log in, **Then** the system denies access with an appropriate message.
4. **Given** 5 consecutive failed login attempts, **When** a new login attempt is made, **Then** the system locks the account for 15 minutes and prevents login.

---

### User Story 2 - Token Refresh & Session Continuation (Priority: P1)

As an active user, I want my session to be extended seamlessly before it expires so that I don't have to log in repeatedly during long operations.

**Why this priority**: Crucial for user experience and maintaining security with short-lived access tokens.

**Independent Test**: Can be tested by submitting a valid unexpired refresh token to the refresh endpoint and receiving a new JWT and refresh token pair while the old refresh token is revoked.

**Acceptance Scenarios**:

1. **Given** a valid refresh token, **When** the user requests a token refresh, **Then** the system generates new access and refresh tokens, and revokes the old refresh token.
2. **Given** an expired or invalid refresh token, **When** the user requests a token refresh, **Then** the system denies the request, requiring the user to re-authenticate.

---

### User Story 3 - Password Recovery (Priority: P2)

As a user who forgot their password, I want to easily and securely reset my password using OTP sent to my registered email or phone so that I can regain access to my account.

**Why this priority**: Important for users who lose their access, reducing IT support overhead.

**Independent Test**: Can be tested by initiating a password reset, generating an OTP, and successfully resetting the password with that OTP.

**Acceptance Scenarios**:

1. **Given** a registered user email/phone, **When** the user requests password recovery, **Then** the system sends a PasswordReset OTP to their registered contact info.
2. **Given** a valid OTP and a new password, **When** the user submits the password reset request, **Then** the system updates the password successfully and invalidates all existing refresh tokens.

---

### User Story 4 - Secure Logout (Priority: P2)

As an authenticated user, I want to securely log out of my session from all devices so that unauthorized individuals cannot access my account if I leave my device unattended.

**Why this priority**: Required for security and session lifecycle management.

**Independent Test**: Can be tested by calling the logout endpoint with an active token and ensuring the token is invalidated.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they choose to log out, **Then** the system revokes their current refresh token and logs the logout event.

---

### Edge Cases

- What happens when a user attempts to refresh a token while their account has been deactivated by an admin?
- How does the system handle parallel refresh token requests to prevent race conditions during refresh token rotation?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a secure login endpoint accepting identifier (email or phone), password, and login method (Email/Phone).
- **FR-002**: System MUST validate credentials against the user records, rejecting invalid, unverified, deactivated, or locked accounts.
- **FR-003**: System MUST track failed login attempts, locking the account for 15 minutes after 5 consecutive failures.
- **FR-004**: System MUST generate a JWT using HMAC-SHA256 with a 60-minute expiry containing claims: sub, email, phone, role, fullName, language, and jti upon successful login.
- **FR-005**: System MUST implement secure refresh token rotation, issuing new tokens and revoking previously used ones on each refresh request.
- **FR-006**: System MUST provide a logout mechanism that revokes the active refresh token.
- **FR-007**: System MUST provide password recovery capabilities using OTPs for validation.
- **FR-008**: System MUST automatically invalidate all active refresh tokens for a user when their password is changed or reset.
- **FR-009**: System MUST log all authentication events (login success/failure, logout) in the AuditLog.

### Key Entities

- **User**: The identity attempting authentication. Contains state flags (verified, active, locked).
- **Refresh Token**: A secure token stored in the database mapped to a user, used for session continuation.
- **OTP Code**: A secure, temporary code generated for verifying password reset requests.
- **Audit Log**: A record of authentication activities, retaining timestamps, IP/device details, and outcomes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Passwords can be reset successfully in under 3 minutes assuming instant OTP delivery.
- **SC-002**: Token refresh requests complete in under 200ms at the P95 level.
- **SC-003**: Account locking completely prevents login via accurate 15-minute intervals verified securely.
- **SC-004**: 100% of successful and failed authentication attempts are persisted to the audit log.

## Assumptions

- Users have already been registered in the system with valid email and phone numbers.
- A functional Notification system (SMS/Email) exists for delivering the OTPs.
- Environment variables securely handle JWT signing secrets to avoid hardcoded credentials.
