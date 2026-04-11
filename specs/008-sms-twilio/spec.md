# Feature Specification: SMS Delivery via Twilio

**Feature Branch**: `feat-008-sms-twilio`
**Created**: 2026-04-07
**Status**: Draft
**Input**: Production SMS service using Twilio API with bilingual message templates.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registration Validation (Priority: P1)

Applicant requests an OTP during phone registration to activate their account. The system sends a bilingual SMS to verify their identity.

**Why this priority**: Crucial for user onboarding and platform security, serving as the first interaction with the applicant.

**Independent Test**: Can be independently tested by initiating phone registration and verifying the SMS is received with the correct OTP and format.

**Acceptance Scenarios**:

1. **Given** an applicant submits a valid phone number for registration, **When** the system generates an OTP, **Then** the applicant receives the SMS template `reg-otp` with Arabic and English text under 160 characters.
2. **Given** a generated SMS message, **When** sent, **Then** the SMS service attempts delivery and logs the result (success/failure) in the database.

---

### User Story 2 - Password Recovery Validation (Priority: P1)

Applicant requests to reset their forgotten password using their phone number. The system sends a recovery OTP.

**Why this priority**: Essential to recover accounts securely without manual intervention.

**Independent Test**: Can be tested by initiating the forgot password flow via phone and receiving the recovery code.

**Acceptance Scenarios**:

1. **Given** an applicant requests password recovery, **When** the system processes the request, **Then** the applicant receives the SMS template `recovery-otp` securely.
2. **Given** the recovery OTP is sent to Twilio, **When** the API call succeeds, **Then** the system logs a successful delivery attempt without logging the OTP value.

---

### User Story 3 - Appointment and Action Notifications (Priority: P2)

Applicants receive critical updates about their appointments, test results, and license readiness to ensure they don't miss important stages.

**Why this priority**: Enhances user experience by keeping them informed proactively, though less critical than authentication.

**Independent Test**: Can be tested by triggering a test result or appointment confirmation and verifying the SMS content and cost logging.

**Acceptance Scenarios**:

1. **Given** an applicant passes a driving test, **When** the examiner records the result, **Then** the system sends the `test-result` bilingual SMS.
2. **Given** an appointment is created or updated, **When** the action completes, **Then** the system sends the `appointment-confirmed` SMS.
3. **Given** an appointment is scheduled for tomorrow, **When** the daily reminder job runs, **Then** the `appointment-reminder` SMS is dispatched.
4. **Given** the final approval concludes and the license is ready, **When** the issuance process finishes, **Then** the system sends the `license-ready` SMS.

### Edge Cases

- What happens when the Twilio API is down or times out? System must retry 2 times before marking as failed.
- How does the system handle messages exceeding 160 characters? Must trim or validate at generation time to prevent multi-part billing.
- What happens when a user registers with an invalid phone format? The API should fail fast before attempting to call Twilio.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST implement an `ISmsService` interface containing `SendAsync` and `SendOtpAsync` methods.
- **FR-002**: System MUST integrate with Twilio REST API to dispatch messages.
- **FR-003**: System MUST enforce a maximum of 160 characters per SMS to avoid multi-part messaging costs.
- **FR-004**: System MUST support bilingual (Arabic and English) content in the same single message.
- **FR-005**: System MUST log all SMS outbound requests (success/failure, timestamps) but NEVER log plain text OTPs.
- **FR-006**: System MUST implement an automatic retry mechanism (2 retries) for transient Twilio API failures.
- **FR-007**: System MUST provide exactly 6 predefined SMS templates: registration-otp, recovery-otp, appointment-confirmed, appointment-reminder, test-result, license-ready.
- **FR-008**: System MUST use "TrafficLic" as the Sender Name.

### Key Entities

- **SmsLog**: Represents an outbound SMS attempt, storing recipient number (masked), message type/template, delivery status, cost, external message ID (from provider), and timestamps.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 99.9% of valid SMS requests are successfully transmitted to Twilio.
- **SC-002**: 100% of generated templates fit within the single-message 160 character limit.
- **SC-003**: 100% of all SMS attempts are logged for auditing and billing reconciliation.
- **SC-004**: System handles Twilio API timeouts properly without blocking the main application flow.

## Assumptions

- We already have an active Twilio account with API credentials suitable for sending SMS.
- Twilio can send messages using the "TrafficLic" sender ID without additional compliance overhead.
- Tracking costs means capturing the segment/price information provided by Twilio's HTTP response.
