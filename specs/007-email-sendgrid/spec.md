# Feature Specification: Real Email Delivery via SendGrid with 10 HTML Templates

**Feature Branch**: `007-email-sendgrid`  
**Created**: 2026-04-07  
**Status**: Draft  
**Input**: User description: "Real Email Delivery via SendGrid with 10 HTML Templates"

---

## Overview

The Mojaz platform requires a production-grade email delivery system to communicate critical lifecycle events to applicants — from account verification to license issuance. All emails must be delivered reliably in bilingual Arabic (RTL) and English (LTR) via a professional HTML template system, sent from the official government sender address.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Account Verification Email Delivery (Priority: P1) 🎯 MVP

As a newly registered applicant, I receive a professional bilingual email containing my OTP code immediately after registering, so that I can verify my account and begin my application process.

**Why this priority**: Email verification is the first touchpoint in the user journey. Without it, the entire registration flow is blocked. This is the most critical email in the system.

**Independent Test**: Can be fully tested by registering a new account and confirming a well-formatted bilingual HTML email arrives in the inbox with a valid OTP code and expiry notice.

**Acceptance Scenarios**:

1. **Given** a new user registers with their email, **When** the registration completes, **Then** a bilingual account-verification email is dispatched within 30 seconds containing the OTP code and expiry time.
2. **Given** an email is sent, **When** opened in Gmail, Outlook, or Apple Mail, **Then** the Arabic section renders right-to-left and the English section renders correctly with proper layout.
3. **Given** the SendGrid API is temporarily unavailable, **When** the send attempt fails, **Then** the system retries up to 3 times with exponential backoff before logging the failure.
4. **Given** a send attempt (success or failure), **When** the operation completes, **Then** a record is created in the email log with the status, recipient, template name, and timestamp.

---

### User Story 2 — Password Recovery Email (Priority: P1)

As a user who has forgotten their password, I receive a password recovery email containing a reset OTP and a clear security warning so that I can securely regain access to my account.

**Why this priority**: Password recovery directly impacts platform access. A failed or missing recovery email leaves users locked out, increasing support burden.

**Independent Test**: Can be tested by triggering a forgot-password request and verifying a password-recovery email arrives with correct OTP, security disclaimer, and RTL/LTR rendering.

**Acceptance Scenarios**:

1. **Given** a user requests password recovery, **When** the request is processed, **Then** a bilingual password-recovery email is sent with the reset OTP and a security warning (e.g., "If you did not request this, ignore this email").
2. **Given** the email is delivered, **When** rendered on a mobile device, **Then** the layout remains responsive and readable without horizontal scrolling.

---

### User Story 3 — Application & Appointment Lifecycle Emails (Priority: P2)

As an applicant progressing through a license application, I receive contextual emails at each milestone — application received, appointment confirmed, medical result, test result, and final decision — so that I am always informed about the status of my application without needing to log in.

**Why this priority**: These transactional emails replace the need for applicants to continuously check the portal, reducing portal load and improving trust in the platform.

**Independent Test**: Can be tested by simulating each lifecycle event (application creation, appointment booking, etc.) and confirming the correct bilingual email template is dispatched with accurate data.

**Acceptance Scenarios**:

1. **Given** an application is submitted, **When** the system confirms receipt, **Then** an application-received email is sent with the application number, selected service type, and next steps in both Arabic and English.
2. **Given** an appointment is booked or modified, **When** the confirmation is saved, **Then** an appointment-confirmed email is sent containing the appointment type, date, time, and location.
3. **Given** a medical exam result is recorded by the doctor, **When** the result is saved, **Then** a medical-result email is sent to the applicant with the result, doctor name, and next steps.
4. **Given** a theory or practical test result is recorded, **When** the examiner finalizes the result, **Then** a test-result email is sent with the test type, pass/fail result, and score.
5. **Given** the application review is finalized (approved or rejected), **When** the decision is recorded, **Then** an application-decision email is sent clearly stating the outcome with appropriate messaging.

---

### User Story 4 — License Issuance & Payment Confirmation Emails (Priority: P2)

As an applicant who has completed the full process, I receive a license-issuance email with a download link and a payment-confirmed email after each successful payment, so that I have a clear record of all transactions and can access my license immediately.

**Why this priority**: These emails close the loop on the application journey. The license email is the highest-value communication in the entire flow.

**Independent Test**: Can be tested by triggering a license issuance event and a payment event, then verifying the correct email arrives with accurate license number/download link and payment reference.

**Acceptance Scenarios**:

1. **Given** a license is issued and ready for download, **When** the issuance is recorded, **Then** a license-issued email is sent containing the license number and a download link.
2. **Given** a payment is processed successfully, **When** the payment confirmation is received, **Then** a payment-confirmed email is sent with the payment amount, reference number, and fee type.

---

### User Story 5 — Missing Documents Notification (Priority: P2)

As an applicant with incomplete documents, I receive an email listing what is missing and the deadline to submit, so that I can take corrective action before my application is rejected.

**Why this priority**: Proactive communication about missing documents prevents delays and application rejections, reducing staff intervention.

**Independent Test**: Can be tested by flagging an application as having missing documents via the employee portal and verifying that the applicant receives an email with the correct document list and deadline.

**Acceptance Scenarios**:

1. **Given** an employee flags missing documents on an application, **When** the flag is saved, **Then** a documents-missing email is sent to the applicant listing each missing document and the submission deadline.
2. **Given** the email is sent, **When** the list of missing documents is more than 3 items, **Then** all items are clearly enumerated in both Arabic and English within the template.

---

### Edge Cases

- What happens when the recipient email address is invalid or bounces? → The failure is logged in EmailLogs with the error code; no retry is attempted for permanent failures (4xx errors from SendGrid).
- What happens when the SendGrid API key is expired or revoked? → All send attempts fail, are logged as errors, and an alert is raised. The system does not crash.
- What happens when a template variable is missing (e.g., applicant name is null)? → A safe fallback value ("—" or locale-appropriate placeholder) is used; the email still sends.
- What happens when the same email is sent twice due to a race condition? → Idempotency is enforced via the EmailLogs table; duplicate attempts within a 60-second window for the same (recipient, template, reference) are suppressed.
- What happens when an email is sent to a non-Latin character domain? → The email address is validated before dispatch; internationalized email addresses are supported if the provider allows them.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST deliver all 10 email templates via the SendGrid API using the official sender `no-reply@mojaz.gov.sa`.
- **FR-002**: Every email MUST include bilingual content — Arabic text in RTL layout and English text in LTR layout — rendered correctly in a single email body.
- **FR-003**: All 10 templates MUST be responsive and render correctly in Gmail, Outlook (2016+), and Apple Mail without broken layouts.
- **FR-004**: The system MUST retry failed send attempts up to 3 times using exponential backoff (e.g., 1s → 2s → 4s delay).
- **FR-005**: Every send attempt (success or failure) MUST be recorded in the `EmailLogs` table with: recipient, template name, subject, status, error message (if any), attempt count, and timestamp.
- **FR-006**: The email service MUST support structured template rendering — each template accepts a typed data object containing only the variables needed for that specific template.
- **FR-007**: All templates MUST use professional government-grade design: green header (`#006C35`), official Mojaz branding, clean typography, and mobile-responsive layout.
- **FR-008**: The system MUST support optional file attachments in raw email sends (e.g., for documents or license PDFs).
- **FR-009**: The SendGrid API key, sender email, and sender name MUST be configurable via environment variables — never hardcoded.
- **FR-010**: The system MUST suppress duplicate sends for the same (recipient, template, application reference) within a configurable deduplication window.
- **FR-011**: All 10 email templates MUST send within 30 seconds of the triggering event under normal operating conditions.
- **FR-012**: The email service interface MUST be defined in the Application layer; the SendGrid implementation MUST reside in the Infrastructure layer (Clean Architecture compliance).

### Template Catalog

| # | Template Key | Trigger Event | Key Dynamic Variables |
|---|-------------|---------------|----------------------|
| 01 | `account-verification` | New account registration | OTP code, expiry time, recipient name |
| 02 | `password-recovery` | Password reset request | OTP code, expiry time, security warning |
| 03 | `application-received` | Application submission | App number, service type, next steps |
| 04 | `documents-missing` | Missing document flag | Document list, submission deadline |
| 05 | `appointment-confirmed` | Appointment booking/update | Type, date, time, location |
| 06 | `medical-result` | Medical exam result recorded | Result (fit/unfit), doctor name, next steps |
| 07 | `test-result` | Theory or practical test result | Test type, result (pass/fail), score |
| 08 | `application-decision` | Final approval or rejection | Decision (approved/rejected), reason |
| 09 | `license-issued` | License issuance | License number, download link |
| 10 | `payment-confirmed` | Successful payment | Amount, reference number, fee type |

### Key Entities

- **EmailMessage**: Represents a raw email send request — recipient address, name, subject, HTML body, optional attachments, language preference.
- **TemplatedEmailRequest**: Represents a template-based send request — template key, typed data model, recipient details, preferred language (AR/EN).
- **EmailLog**: Persistent record of every send attempt — recipient, template key, status (Sent/Failed/Retrying), attempt count, error detail, sent timestamp, application reference.
- **EmailTemplate**: An HTML file with Razor/Handlebars-style variable slots for dynamic data injection, stored in the Infrastructure layer's templates directory.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 10 email templates are delivered to the recipient's inbox within 30 seconds of the triggering event, under normal operating conditions.
- **SC-002**: Emails render without layout breakage in at least 3 major email clients (Gmail, Outlook, Apple Mail) on both desktop and mobile viewports.
- **SC-003**: Arabic content is displayed correctly in RTL direction and English content in LTR direction within the same email — verified by visual QA across all 10 templates.
- **SC-004**: 100% of send attempts (success or failure) are traceable in the EmailLogs table within 5 seconds of the attempt completing.
- **SC-005**: Failed sends are retried up to 3 times automatically — measured by inspecting the `AttemptCount` field in EmailLogs on simulated transient failure scenarios.
- **SC-006**: The `IEmailService` interface in the Application layer has zero direct references to SendGrid — confirmed by architecture linting or code review.
- **SC-007**: Sensitive configuration values (API keys, sender credentials) are not present in any committed source code file — verified by automated secret scanning.

---

## Assumptions

- SendGrid is the chosen provider for the MVP; the interface design keeps the provider swappable (Amazon SES, Mailgun) without changing application code.
- Email templates are stored as static HTML files with variable placeholders in the Infrastructure layer — no database-driven template management in MVP.
- The domain `mojaz.gov.sa` is assumed to have SPF, DKIM, and DMARC records configured externally by the infrastructure team; this feature does not manage DNS.
- All 10 templates share a common base layout (header, footer, branding) — template-specific content is inserted into a designated content block.
- Frontend email preview tooling (e.g., displaying email template previews in an admin UI) is out of scope for this feature.
- Mobile app push notification delivery is handled by a separate feature (FCF integration); this feature covers only email.
- All template HTML uses **inline CSS only** to maximize email client compatibility — external stylesheets are not used in email bodies.
- The `EmailLogs` table is append-only; no emails are ever deleted or edited after logging.
- Language selection for templates defaults to the recipient's `PreferredLanguage` field on the `User` entity; if unavailable, Arabic is the default.
