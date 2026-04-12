# Feature Specification: Security Review and Production Hardening

**Feature Branch**: `030-security-hardening`  
**Created**: 2026-04-11  
**Status**: Draft  
**Input**: User description: "Security Review and Production Hardening"

## Clarifications

### Session 2026-04-11
- Q: What is the required retention period for these audit logs before they are archived or deleted? → A: 90 Days (Focus on performance, short-term forensics)
- Q: Should the system implement real-time alerts for specific high-risk events, and if so, what is the threshold? → A: Email Alert on repeated failures (Threshold: 5 in 10 mins)
- Q: How should sensitive configuration values (API keys, connection strings, secrets) be managed as part of the production hardening phase? → A: Environment Variables + User Secrets (Standard ASP.NET Core approach)


## User Scenarios & Testing *(mandatory)*

### User Story 1 - API Security Audit (Priority: P1)

As a System Administrator, I want to ensure that all API endpoints are protected by industry-standard security measures so that the platform is resilient against common web attacks.

**Why this priority**: High priority as it protects the core infrastructure and data of the government platform.

**Independent Test**: Can be tested by inspecting API responses for security headers and attempting unauthorized access or malformed requests to verify rejection.

**Acceptance Scenarios**:

1. **Given** a request to any API endpoint, **When** the response is received, **Then** it must include `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `Strict-Transport-Security`.
2. **Given** an API request from an unauthorized domain, **When** CORS is evaluated, **Then** the request must be rejected unless the domain is in the whitelist.

---

### User Story 2 - Secure Document Upload (Priority: P1)

As an Applicant, I want to upload my documents securely knowing that the system validates every file to prevent malicious scripts from being uploaded or executing on the server.

**Why this priority**: Critical to prevent server-side compromise and ensure data integrity.

**Independent Test**: Can be tested by attempting to upload files with changed extensions (e.g., .exe renamed to .jpg) or files exceeding the 5MB limit.

**Acceptance Scenarios**:

1. **Given** a file upload request, **When** the file is processed, **Then** the system MUST validate the actual MIME type (magic numbers), not just the extension.
2. **Given** a file larger than `MAX_FILE_SIZE_MB`, **When** upload is attempted, **Then** it MUST be rejected with a user-friendly error message.

---

### User Story 3 - Production Error Sanitization (Priority: P2)

As a Security Auditor, I want to ensure that the system never leaks sensitive internal information or stack traces in error responses so that attackers cannot gain insight into the system's architecture.

**Why this priority**: Prevents information disclosure which is a common reconnaissance step for attackers.

**Independent Test**: Can be tested by triggering various error conditions (404, 500) and verifying the JSON response body.

**Acceptance Scenarios**:

1. **Given** a server-side exception occurs, **When** the API response is generated, **Then** it MUST return a generic error message in `ApiResponse.Message` and NO stack trace or internal details.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST enforce HTTPS for all communications and implement HSTS (HTTP Strict Transport Security) with a minimum age of 1 year.
- **FR-002**: System MUST implement secure headers on all API responses as defined in AGENTS.md (nosniff, DENY, 1; mode=block).
- **FR-003**: System MUST implement Rate Limiting: Login/Auth endpoints (10/min), Registration (5/min), and Generic Data endpoints (100/min).
- **FR-004**: System MUST perform server-side input sanitization on all incoming request data to prevent XSS and SQL Injection via EF Core's parameterized queries.
- **FR-005**: File uploads MUST be validated against a strict whitelist of extensions and MIME types, with a maximum size limit of 5MB.
- **FR-006**: JWT implementation MUST use a secure signing algorithm (HS256 or RS256) and tokens MUST have a short expiration (max 60 mins) with secure Refresh Token rotation.
- **FR-007**: CORS MUST be configured to only allow requests from the official Mojaz frontend domains and development environments.
- **FR-008**: All security-sensitive events (Logins, Failed attempts, Permission changes, Data modifications) MUST be logged in the `AuditLog` table and retained for a minimum of 90 days.
- **FR-009**: System MUST implement a global exception handler to catch all unhandled exceptions and return a sanitized `ApiResponse` object.
- **FR-010**: System MUST mask sensitive data in logs (e.g., National ID, Phone Numbers) and never log passwords or OTPs.
- **FR-011**: System MUST implement an alerting mechanism to notify Administrators via Email when high-risk events exceed thresholds (e.g., 5 failed login attempts from the same IP within 10 minutes).
- **FR-012**: Sensitive configuration values (API keys, connection strings, JWT secrets) MUST be managed using Environment Variables and User Secrets, ensuring they are NEVER stored in plain text within source control.

### Key Entities *(include if feature involves data)*

- **AuditLog**: Represents a security event record. Attributes include UserId, Action, EntityType, OldValues, NewValues, IpAddress, and Timestamp.
- **OtpCodes**: Represents transient security codes. Attributes include User, Destination, CodeHash, Purpose, and ExpiresAt.
- **RefreshTokens**: Represents long-lived session persistence. Attributes include Token, UserId, and Expiry.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: API Scan Score: Automated security scanning tools (OWASP ZAP) return zero "High" or "Medium" severity vulnerabilities.
- **SC-002**: Header Compliance: 100% of API endpoints return the required security headers in every response.
- **SC-003**: Rate Limit Effectiveness: 100% of requests exceeding the defined thresholds are rejected with HTTP 429 Too Many Requests.
- **SC-004**: Information Leakage: Zero instances of stack traces or internal server details found in production error responses.
- **SC-005**: Validation Integrity: 100% of file uploads with spoofed MIME types are correctly identified and rejected.

## Assumptions

- [Existing authentication system using JWT is already partially implemented as per PRD]
- [System will be deployed behind a load balancer or reverse proxy that supports SSL termination]
- [MIME type validation will be performed on the server-side using file header analysis]
- [The default `SystemSettings` for rate limits and file sizes are available in the database]
