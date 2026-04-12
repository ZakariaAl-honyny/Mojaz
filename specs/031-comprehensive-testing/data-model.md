# Test Data Model: Comprehensive Testing Suite

## Test Users (Mock Data)

| Role | Username | Permissions |
|------|----------|-------------|
| Applicant | `test_applicant` | Create/Track applications |
| Receptionist | `test_receptionist` | Review/Verify documents |
| Doctor | `test_doctor` | Enter medical results |
| Examiner | `test_examiner` | Enter test results |
| Admin | `test_admin` | Full system control |

## Visual Baseline Mapping

Snapshots will follow a naming convention:
`[component-name]-[locale]-[theme]-[viewport].png`
Example: `dashboard-ar-dark-mobile.png`

## State Transitions (E2E Hook)

| Action | API Trigger | Target Status |
|--------|-------------|---------------|
| `submit_application` | `POST /api/v1/applications` | `Submitted` |
| `approve_documents` | `PATCH /api/v1/applications/{id}/verify` | `UnderReview` |
| `record_medical` | `POST /api/v1/medical/results` | `MedicallyFit` |
