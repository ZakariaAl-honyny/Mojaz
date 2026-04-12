# Feature 011: Role-Based Access Control, User Management, and System Settings

> **Status:** To be generated via `/speckit.clarify`

## Clarifications
### Session 2026-04-08
- Q: When an administrator deactivates a user account or changes their role, how soon should this change affect the user's active session? → A: Revoke on next token refresh (within access token expiry).
- Q: How should system settings be fetched given their high read frequency? → A: Cache settings in application memory (IMemoryCache) with immediate invalidation on update.
- Q: How should we structure the capture of audit trail events? → A: Use a centralized `AuditLogs` table tracking Action, User, Timestamp, and old/new values in a JSON payload.
- Q: How should internal employee accounts be provisioned by the Administrator? → A: Admin generates a temporary password; employee is forced to change it upon first login.
- Q: How is user identity verified during Password Recovery? → A: By utilizing the existing OTP (One-Time Password) mechanism via Email/SMS before accepting the new password.

## WHAT WE'RE BUILDING:
RBAC with 7 roles, admin user management CRUD, and system settings management.

## REQUIREMENTS:
### 1. RBAC: 7 Roles (Applicant, Receptionist, Doctor, Examiner, Manager, Security, Admin)
Policies: ApplicantOnly, EmployeeOnly, MedicalStaff, TestingStaff, ApprovalAuthority, ManagementOnly, AdminOnly, ManagementOrAdmin
Resource ownership enforcement

### 2. User Management (Admin): GET/POST/PUT users, PATCH role, PATCH toggle-active
- Note: Role changes and deactivations will take effect upon the user's next token refresh; immediate token revocation/blacklisting is not required.
- Note: Employee accounts are created by Admins with a temporary password and a "MustChangePassword" flag enforcing a reset on their first login.
### 3. System Settings (Admin): GET/PUT policies, GET/PUT fees
- Note: Must utilize `IMemoryCache` for high-performance reading with an immediate cache invalidation strategy when settings are updated.
### 4. Frontend: User Management table, Settings pages, Auth pages (Registration, Login, OTP, Password Recovery)
- Note: Password Recovery MUST utilize an OTP verification step sent to the user's registered Email/Phone, in line with Government-style designs.

## ACCEPTANCE CRITERIA:
- [ ] Each role can only access permitted endpoints
- [ ] Applicant sees only own data
- [ ] Admin CRUD users
- [ ] Admin manage settings/fees
- [ ] Audit trail for setting changes (using centralized AuditLogs with JSON payload)
- [ ] Auth pages complete
