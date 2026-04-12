# Feature Specification: User Registration via Email and Phone with OTP Verification

**Feature Branch**: `004-auth-registration`
**Created**: 2026-04-06
**Status**: Completed ✅
**Input**: User description: "Complete user registration system supporting two methods (email and phone) with real OTP verification."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Registration via Email (Priority: P1)

A citizen or resident visits the platform for the first time and chooses to create an account using their email address. They fill in their full name, email, and a strong password, accept the terms, and select their preferred language. The system sends them a real 6-digit verification code to their email. Once they enter the code successfully, their account is activated and they are redirected to the dashboard.

**Why this priority**: Email registration is the primary and most common registration path. Without this flow, no citizen can access any service on the platform.

**Independent Test**: Can be fully tested by submitting a valid registration form via email, receiving the OTP in a real inbox, entering it, and verifying the account is activated.

**Acceptance Scenarios**:

1. **Given** a new user with a valid, unique email address, **When** they submit the registration form with all required fields and accept the terms, **Then** the system creates an inactive account and sends a 6-digit OTP to the provided email (valid for 15 minutes).
2. **Given** the user has received the OTP, **When** they enter the correct code within the validity period, **Then** their account is activated and they can log in.
3. **Given** the user enters an incorrect OTP, **When** they have not yet exceeded the maximum attempts, **Then** the system rejects the code and informs them of remaining attempts.
4. **Given** the OTP has expired, **When** the user attempts to verify with the expired code, **Then** the system rejects it and prompts them to request a new code.

---

### User Story 2 — Registration via Phone Number (Priority: P2)

A citizen or resident prefers to register using their mobile phone number. They enter their full name, phone number with country code, and a strong password. The system sends them a 6-digit OTP via SMS. They enter the code to activate their account.

**Why this priority**: Phone registration is the secondary path required by the PRD. Some users may not have or prefer not to use email.

**Independent Test**: Can be fully tested by submitting a valid phone registration, receiving the SMS OTP, entering it, and confirming account activation.

**Acceptance Scenarios**:

1. **Given** a new user with a valid, unique phone number in international format, **When** they submit the registration form with all required fields and accept the terms, **Then** the system creates an inactive account and sends a 6-digit OTP via SMS (valid for 5 minutes).
2. **Given** the user has received the SMS OTP, **When** they enter the correct code within the validity period, **Then** their account is activated and they gain access to the dashboard.
3. **Given** the user enters an incorrect OTP, **When** they have not yet exceeded the maximum 5 input attempts, **Then** the system rejects the code and informs them of remaining attempts.

---

### User Story 3 — OTP Resend (Priority: P2)

A user who did not receive their verification code (email or SMS) can request a new one. The system enforces a cooldown and a maximum number of resends per hour to prevent abuse.

**Why this priority**: Without resend capability, any delivery failure permanently blocks registration, severely degrading user experience.

**Independent Test**: Can be tested by requesting a new OTP immediately (should be blocked by cooldown), then after 60 seconds (should succeed), and by verifying the previous code is invalidated.

**Acceptance Scenarios**:

1. **Given** a user has registered but not yet verified, **When** they request a new OTP before the 60-second cooldown has elapsed, **Then** the system rejects the resend request.
2. **Given** the 60-second cooldown has elapsed, **When** the user requests a new OTP and has resent fewer than 3 times in the past hour, **Then** the system sends a new code and invalidates any previously issued code.
3. **Given** the user has already resent 3 times within the hour, **When** they attempt another resend, **Then** the system blocks the request and informs them of the hourly limit.

---

### User Story 4 — Duplicate Account Prevention (Priority: P1)

A user who already has an account attempts to register again using the same email or phone number. The system must detect the conflict and inform the user without exposing account details.

**Why this priority**: Allowing duplicate accounts would violate the PRD's "one account per identifier" policy and cause integrity issues across the entire platform.

**Independent Test**: Can be tested by attempting to register with an already-registered email or phone and confirming the system returns a conflict response without creating a second account.

**Acceptance Scenarios**:

1. **Given** an email already exists in the system, **When** a new user attempts to register with that same email, **Then** the system rejects the registration and informs the user that the email is already in use.
2. **Given** a phone number already exists in the system, **When** a new user attempts to register with that same phone number, **Then** the system rejects the registration and informs the user that the phone number is already in use.

---

### User Story 5 — Rate Limiting and Abuse Prevention (Priority: P2)

The platform enforces rate limits on the registration endpoint to prevent bots and abuse. Users who exceed the registration rate limit receive a clear, non-alarming message.

**Why this priority**: Without rate limiting, the registration endpoint is vulnerable to enumeration attacks and spam account creation.

**Independent Test**: Can be tested by submitting more than 5 registration requests per minute from the same IP address and confirming all excess requests are blocked.

**Acceptance Scenarios**:

1. **Given** an IP address that has submitted 5 registration requests within 60 seconds, **When** a 6th request is submitted, **Then** the system blocks the request and informs the user to try again later.

---

### Edge Cases

- What happens if the email provider fails to deliver the OTP? → Account is still created (inactive); user can request a resend.
- What happens if the SMS provider fails to deliver the OTP? → Account is still created (inactive); user can request a resend.
- What happens if the user submits the registration form with both email and phone present? → The system uses only the field corresponding to the chosen `registrationMethod`.
- What happens if a user attempts OTP verification after the account has been inactive for a very long time? → The OTP will be expired; the user must request a new code.
- What happens if the user provides a phone number not in international format? → The system rejects the request with a validation error before creating any record.
- What happens if the terms and conditions are not accepted? → The system rejects the registration attempt.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow a new user to create an account by providing their full name, email address, a strong password, preferred language, and accepting the terms and conditions (email registration path).
- **FR-002**: System MUST allow a new user to create an account by providing their full name, phone number (with country code), a strong password, preferred language, and accepting the terms and conditions (phone registration path).
- **FR-003**: For email registration, the system MUST deliver a 6-digit one-time verification code to the user's email address within the configured validity period (default: 15 minutes).
- **FR-004**: For phone registration, the system MUST deliver a 6-digit one-time verification code to the user's phone number via SMS within the configured validity period (default: 5 minutes).
- **FR-005**: System MUST enforce password complexity rules: minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character.
- **FR-006**: System MUST reject registration if the provided email or phone number is already associated with an existing account, regardless of the existing account's verification status.
- **FR-007**: System MUST require acceptance of terms and conditions as a mandatory condition for account creation.
- **FR-008**: System MUST create the account immediately upon registration submission but mark it as unverified; access to all platform services MUST be blocked until verification is complete.
- **FR-009**: System MUST allow users to resend the verification code, subject to: a minimum 60-second cooldown between resends, and a maximum of 3 resend attempts per hour.
- **FR-010**: Previously issued verification codes MUST be invalidated when a new code is issued via resend.
- **FR-011**: Verification codes MUST expire after the configured validity period and MUST be rejected if submitted after expiry.
- **FR-012**: System MUST limit registration requests to a maximum of 5 per minute per IP address to prevent abuse.
- **FR-013**: System MUST log every email send attempt (success or failure) in the email log.
- **FR-014**: System MUST log every SMS send attempt (success or failure) in the SMS log.
- **FR-015**: System MUST create an audit log entry for every registration attempt, including the outcome.
- **FR-016**: System MUST store all verification codes in a hashed form; plain-text codes MUST never be persisted.
- **FR-017**: System MUST store all passwords in a hashed form; plain-text passwords MUST never be persisted.
- **FR-018**: The preferred language selected at registration (Arabic or English) MUST be saved to the user's profile and used as the default for all subsequent communications.
- **FR-019**: System MUST continue account creation even if the email or SMS delivery fails, and communicate clearly to the user that verification is pending.

### Key Entities

- **User**: Represents a platform account. Key attributes: full name, email (nullable), phone (nullable), hashed password, registration method (Email or Phone), verification status (email and phone independently), active flag, preferred language, failed login attempt count, lockout expiry. At least one of email or phone must be present. Soft-deletable.
- **OTP Code**: Represents a one-time verification code. Key attributes: linked user, destination address, destination type (Email or Phone), hashed code, purpose (Registration, Login, PasswordReset), expiry time, usage status, attempt count, maximum allowed attempts, IP address of the requester.
- **Email Log**: Tracks each email send event. Key attributes: recipient address, template used, send status (Sent, Failed, Bounced), provider reference ID, failure reason if any.
- **SMS Log**: Tracks each SMS send event. Key attributes: recipient phone, message type (OTP, Notification, Reminder), send status, provider reference ID, failure reason if any.
- **Audit Log**: Immutable record of security events. Key attributes: actor (user ID), action performed, entity type and ID affected, old and new values (JSON), timestamp, IP address, user agent.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can complete the full email registration (form submission → OTP delivery → account activation) in under 2 minutes under normal network conditions.
- **SC-002**: A new user can complete the full phone registration (form submission → OTP delivery via SMS → account activation) in under 2 minutes under normal network conditions.
- **SC-003**: 100% of one-time verification codes are expired and rejected after their configured validity window elapses.
- **SC-004**: Zero duplicate accounts can be created with the same email or phone number.
- **SC-005**: 100% of registration events (successes and failures) are captured in the audit log.
- **SC-006**: Rate limiting successfully blocks all registration attempts from any IP that exceeds 5 requests per minute.
- **SC-007**: At least 95% of users successfully verify their accounts on the first OTP attempt in production.
- **SC-008**: Email or SMS delivery failure does not result in permanent inaccessibility — users can always request a resend.
- **SC-009**: All verification codes and passwords are stored exclusively in hashed form; zero plain-text credentials exist in the data store.

---

## Assumptions

- Only the **Applicant** (citizen/resident) role is created through self-registration. All employee and admin accounts are provisioned by the System Administrator.
- Phone numbers are required to be in E.164 international format (e.g., `+966XXXXXXXXX`). No auto-formatting is applied by the system.
- The preferred language defaults to Arabic (`ar`) if not explicitly selected.
- All OTP validity periods, resend limits, cooldown durations, and rate limits are stored in the `SystemSettings` table and are fully configurable without code changes.
- Email delivery uses a real email provider (SendGrid or equivalent); SMS delivery uses a real SMS provider (Twilio or equivalent). Both are configured via environment variables, not hardcoded.
- The system does not support 2FA (two-factor authentication) in MVP; OTP is used only for initial account verification.
- Mobile application registration is out of scope for MVP (web only).
- The verification OTP for phone registration has a maximum of 5 entry attempts before the code is invalidated, as specified in the PRD.
- If a user registers with email but also provides a phone number (or vice versa), the unverified secondary contact is stored but not verified during this flow.
