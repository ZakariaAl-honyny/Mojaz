# Feature 011: Role-Based Access Control, User Management, and System Settings

## WHAT WE'RE BUILDING:
RBAC with 7 roles, admin user management CRUD, and system settings management.

## REQUIREMENTS:
### 1. RBAC: 7 Roles (Applicant, Receptionist, Doctor, Examiner, Manager, Security, Admin)
Policies: ApplicantOnly, EmployeeOnly, MedicalStaff, TestingStaff, ApprovalAuthority, ManagementOnly, AdminOnly, ManagementOrAdmin
Resource ownership enforcement

### 2. User Management (Admin): GET/POST/PUT users, PATCH role, PATCH toggle-active
### 3. System Settings (Admin): GET/PUT policies, GET/PUT fees
### 4. Frontend: User Management table, Settings pages, Auth pages (Registration, Login, OTP, Password Recovery)

## ACCEPTANCE CRITERIA:
- [ ] Each role can only access permitted endpoints
- [ ] Applicant sees only own data
- [ ] Admin CRUD users
- [ ] Admin manage settings/fees
- [ ] Audit trail for setting changes
- [ ] Auth pages complete
