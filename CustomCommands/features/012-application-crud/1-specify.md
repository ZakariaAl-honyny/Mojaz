# Feature 012: Application Creation, Management, and Status Tracking Backend

## WHAT WE'RE BUILDING:
Complete backend for application lifecycle: create, read, update, submit, cancel, and status tracking with Gate 1 validation.

## REQUIREMENTS:
### 1. Application Service: CreateAsync, GetByIdAsync, GetListAsync, UpdateDraftAsync, SubmitAsync, CancelAsync, GetTimelineAsync, CheckEligibilityAsync

### 2. Gate 1 — Pre-Creation Validation:
- Valid applicant profile exists
- Age >= minimum for category (from SystemSettings)
- No other active application
- No security/judicial block

### 3. Application Number: MOJ-{YEAR}-{8 random digits}, unique

### 4. Draft vs Submit: Draft = partial data, Submit = all required fields validated

### 5. Application Expiry: ExpiresAt + APPLICATION_VALIDITY_MONTHS, daily Hangfire check

### 6. Ownership: Applicant=own only, Receptionist=DocumentReview, Doctor=MedicalExam, Examiner=Testing, Manager/Admin=ALL

### 7. Endpoints: POST/GET/GET{id}/PUT/PATCH status/PATCH cancel/GET timeline

### 8. Filters: status, stage, serviceType, category, branch, search, date, sort, pagination

## ACCEPTANCE CRITERIA:
- [ ] Gate 1 blocks underage/active-application
- [ ] Application number correct format
- [ ] Draft updateable, Submit validates
- [ ] Ownership enforced
- [ ] Cancel with reason
- [ ] Timeline works
- [ ] Pagination/filter/sort
- [ ] Notifications on submit/cancel
- [ ] Audit log for all operations
- [ ] Expired auto-closed
