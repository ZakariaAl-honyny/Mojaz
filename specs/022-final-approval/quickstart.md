# Quickstart: 022 — Final Approval with Gate 4 Validation

**Branch**: `022-final-approval`

## What This Feature Adds

Stage 08 final approval: a Manager reviews a Gate 4 checklist (6 conditions) and records an Approve / Reject / Return decision on a completed application dossier.

## Key Files to Modify

### Backend (implement in this order)

1. `Mojaz.Domain/Enums/FinalDecisionType.cs` — **NEW** enum
2. `Mojaz.Domain/Enums/NotificationEventType.cs` — add 3 new event values
3. `Mojaz.Domain/Entities/User.cs` — add `IsSecurityBlocked` property
4. `Mojaz.Domain/Entities/Application.cs` — add 6 nullable decision fields
5. `Mojaz.Application/Interfaces/Services/IGate4ValidationService.cs` — **NEW**
6. `Mojaz.Application/Interfaces/Services/IFinalApprovalService.cs` — **NEW**
7. `Mojaz.Application/Services/Gate4ValidationService.cs` — **NEW** (core business logic)
8. `Mojaz.Application/Services/FinalApprovalService.cs` — **NEW** (orchestration)
9. `Mojaz.Application/DTOs/Application/FinalizeApplicationRequest.cs` — **NEW**
10. `Mojaz.Application/DTOs/Application/ApplicationDecisionDto.cs` — **NEW**
11. `Mojaz.Application/DTOs/Application/Gate4ValidationResultDto.cs` — **NEW**
12. `Mojaz.Application/Validators/FinalizeApplicationRequestValidator.cs` — **NEW**
13. `Mojaz.Infrastructure/Migrations/` — generate `AddFinalApprovalFields` migration
14. `Mojaz.API/Controllers/ApplicationsController.cs` — add `GET gate4` + `POST finalize`
15. `Mojaz.API/Program.cs` — register new services

### Frontend (implement in this order)

1. `src/types/finalApproval.types.ts` — **NEW** TypeScript types
2. `src/services/finalApproval.service.ts` — **NEW** API client functions
3. `public/locales/ar/final-approval.json` — **NEW** Arabic translations
4. `public/locales/en/final-approval.json` — **NEW** English translations
5. `src/components/domain/application/Gate4Checklist.tsx` — **NEW**
6. `src/components/domain/application/FinalDecisionModal.tsx` — **NEW**
7. `src/components/domain/application/FinalApprovalPanel.tsx` — **NEW**
8. `src/app/[locale]/(employee)/applications/[id]/final-approval/page.tsx` — **NEW**

### Tests

1. `tests/Mojaz.Application.Tests/Services/Gate4ValidationServiceTests.cs` — **NEW**
2. `tests/Mojaz.Application.Tests/Services/FinalApprovalServiceTests.cs` — **NEW**

## Key Behaviors to Implement

### Gate 4 — 6 Conditions (in order)

| Condition Key | Logic |
|---------------|-------|
| `TheoryTestPassed` | Latest `TheoryTest` where `ApplicationId == X` has `TestResult.Passed` |
| `PracticalTestPassed` | Latest `PracticalTest` where `ApplicationId == X` has `TestResult.Passed` |
| `SecurityStatusClean` | `Application.Applicant.IsSecurityBlocked == false` |
| `IdentityDocumentValid` | `User.NationalId` not empty (MVP: no real expiry check — assume valid if NationalId set) |
| `MedicalCertificateValid` | Latest `MedicalExamination.ValidUntil > DateTime.UtcNow` AND `FitnessResult == Fit` |
| `AllPaymentsCleared` | No `Payment` for this application has `Status == Pending \|\| Status == Failed` |

### Decision → Status Transitions

| Decision | `Application.Status` | `Application.CurrentStage` |
|----------|---------------------|---------------------------|
| Approve | `Approved` | `"09-IssuancePayment"` |
| Reject | `Rejected` | unchanged (terminal) |
| Return `02-Documents` | `DocumentReview` | `"02-Documents"` |
| Return `04-Medical` | `MedicalExam` | `"04-Medical"` |
| Return `06-Theory` | `TheoryTest` | `"06-Theory"` |
| Return `07-Practical` | `PracticalTest` | `"07-Practical"` |

## Run the Feature Locally

```bash
# Backend: Add migration
cd src/backend
dotnet ef migrations add AddFinalApprovalFields --project Mojaz.Infrastructure --startup-project Mojaz.API
dotnet ef database update --project Mojaz.Infrastructure --startup-project Mojaz.API

# Backend: Run API
dotnet run --project Mojaz.API

# Frontend
cd src/frontend
npm run dev
```

## Test with Swagger

1. Authenticate as Manager: `POST /api/v1/auth/login`
2. Get gate 4 status: `GET /api/v1/applications/{id}/gate4`
3. Approve: `POST /api/v1/applications/{id}/finalize` `{ "decision": "Approve", "managerNotes": "..." }`
4. Verify status changed to `Payment` via `GET /api/v1/applications/{id}`
