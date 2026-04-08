# Feature Specification: Role-Based Access Control, User Management, and System Settings

**Feature Branch**: `011-rbac-user-settings`  
**Created**: 2026-04-08  
**Status**: Ready for Planning
**Input**: Clarified Requirements for Feature 011

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure System Access via RBAC (Priority: P1)

As the system, I need to enforce Role-Based Access Control across all 7 defined roles so that each user only accesses features and data permitted by their specific role.

**Why this priority**: Without RBAC, the system has no security boundary between roles (Applicant, Receptionist, Doctor, Examiner, Manager, Security, Admin). This is the foundation of the platform.

**Independent Test**: Can be fully tested by attempting to access protected resources with different identity assumptions and confirming access is denied when unauthorized, and permitted when authorized.

**Acceptance Scenarios**:

1. **Given** an Applicant is logged in, **When** they request applications, **Then** they should only see their own applications.
2. **Given** a Receptionist is logged in, **When** they attempt to modify system settings, **Then** access is denied.

---

### User Story 2 - User Management Operations (Priority: P1)

As a System Administrator, I need to manage user accounts, change user roles, and toggle user active status so that I can control who has access to internal platform capabilities.

**Why this priority**: Required to onboard employees and manage internal staff access to the system.

**Independent Test**: Can be fully tested by an Admin creating a new user, toggling their status, and assigning a role.

**Acceptance Scenarios**:

1. **Given** an Administrator is in the User Management portal, **When** they create a new Receptionist employee, **Then** the system generates a temporary password and flags them to change it on first login.
2. **Given** an Administrator changes a user's role, **When** the user's session token refreshes, **Then** the new permissions take effect.

---

### User Story 3 - System Settings and Fee Management (Priority: P2)

As a System Administrator, I need to view and update system policies and fee structures so that I can dynamically configure system behavior without requiring system downtime or developer intervention.

**Why this priority**: Application flows depend on configurable variables (ages, fees) that must be centrally managed.

**Independent Test**: Can be tested by an Admin updating a fee setting and immediately seeing the updated fee applied in a new application workflow.

**Acceptance Scenarios**:

1. **Given** an Administrator updates a system setting, **When** the update is saved, **Then** the memory cache is invalidated immediately and the new policy is applied system-wide.
2. **Given** an Administrator updates a fee, **When** the transaction completes, **Then** an AuditLog entry is recorded with the old and new values.

---

### User Story 4 - Password Recovery and Auth Flows (Priority: P2)

As any user, I need to be able to securely recover my password using an OTP verification step so that I can regain access if I forget my credentials.

**Why this priority**: Ensures users can self-service their lockouts securely.

**Independent Test**: Can be tested by requesting password recovery, receiving OTP, entering OTP, and setting a new password.

**Acceptance Scenarios**:

1. **Given** a user forgets their password, **When** they initiate recovery, **Then** they must verify a One-Time Password sent to their registered contact method before resetting.

### Edge Cases

- What happens when a user's role is changed while they have an active session? The new role applies seamlessly upon the next background refresh cycle.
- What happens if the memory cache for system settings fails to invalidate? The system should have an automatic expiration fallback to self-correct.
- How does the system handle rapid back-to-back setting updates by an Admin? Audit logs capture every discrete event sequentially for traceability.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST enforce authorization policies (ApplicantOnly, EmployeeOnly, MedicalStaff, TestingStaff, ApprovalAuthority, ManagementOnly, AdminOnly, ManagementOrAdmin) across all interfaces.
- **FR-002**: System MUST enforce resource ownership (e.g., Applicants only access their own data).
- **FR-003**: System MUST provide Admin interfaces for User Management (view users, create users, update users, modify role, toggle active status).
- **FR-004**: System MUST provision new employee accounts with a temporary password and enforce a mandatory password change on first login.
- **FR-005**: System MUST apply role changes and user deactivations upon the user's next session refresh cycle.
- **FR-006**: System MUST provide Admin interfaces for System Settings (view and update policies, view and update fees).
- **FR-007**: System MUST record an audit trail for system setting and fee changes in a centralized AuditLogs table using a flexible structured payload for before/after states.
- **FR-008**: System MUST provide frontend User Management and Settings pages.
- **FR-009**: System MUST complete the Auth pages (Registration, Login, OTP, Password Recovery).
- **FR-010**: System MUST utilize OTP verification (Email/SMS) as a strict prerequisite for Password Recovery.

### Key Entities

- **User**: Represents a system actor, containing identity and active status.
- **Role**: Defines the permissions boundary for the User.
- **SystemSetting**: Stores configurable policies (e.g., minimum age).
- **FeeStructure**: Stores configurable fee amounts for services.
- **AuditLog**: Records discrete administrator actions, capturing User ID, Timestamp, Action, and old/new values.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Role violations are blocked 100% of the time with an "Access Denied" state.
- **SC-002**: Administrator changes to system settings are reflected in system behavior instantly (via immediate application memory cache invalidation).
- **SC-003**: 100% of administrative mutations to user roles, system settings, and fee structures generate verifiable AuditLog entries.
- **SC-004**: Users successfully recovering a password can complete the flow securely via OTP in under 3 minutes.

## Assumptions

- The existing Email and SMS notification services are operational and will be reused for Password Recovery OTPs.
- Application memory caching mechanisms are available to support high-performance reading of system settings.
- The foundation of User session token generation is already in place from prior features.
