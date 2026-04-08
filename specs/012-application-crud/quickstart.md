# Quickstart: Application CRUD & Status Tracking (Feature 012)

**Branch**: `012-application-crud`  
**Date**: 2026-04-08  
**Pre-requisites**: Auth service (Feature 003–005), Notification service (Feature 010), AuditLog service (Feature 011) all operational.

---

## What This Feature Adds

This feature completes the core application lifecycle backend:

1. **Draft/Submit split** — Application starts as `Draft`; explicit `PATCH /submit` triggers Gate 1 + full validation.
2. **Rich filtering** — `GET /applications` now supports 8 filter parameters + full sort/pagination.
3. **Role-scoped data access** — Each employee role sees only the applications relevant to their workflow stage.
4. **Timeline endpoint** — `GET /applications/{id}/timeline` returns the full `ApplicationStatusHistory`.
5. **Eligibility pre-check** — `GET /applications/eligibility` runs Gate 1 before the wizard starts.
6. **Expiry job** — Daily Hangfire job auto-closes applications past their `ExpiresAt`.

---

## Key Files Changed / Added

### Domain Layer (`Mojaz.Domain`)

| File | Change |
|------|--------|
| `Enums/ApplicationStatus.cs` | Add `DocumentReview`, `Training`, `Expired` |
| `Entities/Application.cs` | Fix default `Status = Draft`; add `StatusHistory` nav |

### Application Layer (`Mojaz.Application`)

| File | Change |
|------|--------|
| `DTOs/Application/ApplicationDtos.cs` | Update `ApplicationDto` (add missing fields); add `UpdateDraftRequest`, `SubmitApplicationRequest`, `ApplicationTimelineDto` (updated) |
| `DTOs/Application/ApplicationFilterRequest.cs` | **NEW** — full filter DTO |
| `DTOs/Application/EligibilityDtos.cs` | **NEW** — `EligibilityCheckRequest`, `EligibilityCheckResult` |
| `Interfaces/Services/IApplicationService.cs` | Add `SubmitAsync`, `UpdateDraftAsync`, `GetTimelineAsync`, `CheckEligibilityAsync`; update `GetListAsync` signature |
| `Services/ApplicationService.cs` | Implement all missing methods; fix Draft default; add role filter logic |
| `Validators/Application/CreateApplicationValidator.cs` | **NEW** or update |
| `Validators/Application/SubmitApplicationValidator.cs` | **NEW** — mandatory field enforcement |
| `Validators/Application/UpdateDraftValidator.cs` | **NEW** — lenient validation for draft updates |
| `Mappings/ApplicationProfile.cs` | Update AutoMapper profile for new DTO fields |

### Infrastructure Layer (`Mojaz.Infrastructure`)

| File | Change |
|------|--------|
| `Jobs/ProcessExpiredApplicationsJob.cs` | **NEW** — Hangfire recurring job |
| `InfrastructureServiceRegistration.cs` | Register recurring job with daily CRON |
| `Persistence/MojazDbContext.cs` | Verify `ApplicationStatusHistory` DbSet + config |
| `Data/Configurations/ApplicationConfiguration.cs` | Add `StatusHistory` relationship config |

### API Layer (`Mojaz.API`)

| File | Change |
|------|--------|
| `Controllers/ApplicationsController.cs` | Add `submit`, `timeline`, `eligibility` endpoints; update `GetListAsync` to accept `[FromQuery] ApplicationFilterRequest` |

### Tests (`tests/`)

| File | Description |
|------|-------------|
| `Mojaz.Application.Tests/Services/ApplicationServiceTests.cs` | Unit tests for all service methods |
| `Mojaz.API.Tests/Controllers/ApplicationsControllerTests.cs` | Controller integration tests |

---

## Implementation Order

```
Step 1  │ Add enum values to ApplicationStatus (DocumentReview, Training, Expired)
Step 2  │ Fix Application entity defaults + add StatusHistory navigation
Step 3  │ Add new DTOs (ApplicationFilterRequest, EligibilityDtos, updated ApplicationDto)
Step 4  │ Update IApplicationService interface (add missing methods)
Step 5  │ Implement CheckEligibilityAsync (extract Gate 1 logic)
Step 6  │ Implement UpdateDraftAsync (rename + add Draft guard)  
Step 7  │ Implement SubmitAsync (Gate 1 re-check + FluentValidation + status history)
Step 8  │ Fix ApplicationNumber uniqueness (add retry loop)
Step 9  │ Update GetListAsync (add ApplicationFilterRequest + role-scoped filtering)
Step 10 │ Implement GetTimelineAsync (query ApplicationStatusHistory)
Step 11 │ Implement ProcessExpiredApplicationsJob + register in DI
Step 12 │ Update ApplicationsController (new endpoints + filter param)
Step 13 │ Update AutoMapper profile for new DTO fields
Step 14 │ Add FluentValidation validators (Submit, UpdateDraft)
Step 15 │ Write unit tests (ApplicationService) — ~20 test cases
Step 16 │ Manual API smoke test via Swagger UI
```

---

## Gate 1 Check Reference

```
✓ 1. Valid Applicant profile exists (User record has NationalId + DateOfBirth)
✓ 2. Age ≥ MIN_AGE_CATEGORY_{code} from SystemSettings
✓ 3. No active application (status NOT IN: Cancelled, Rejected, Expired, Issued, Active)
✓ 4. No security/judicial block (User.IsSecurityBlocked flag — simulated in MVP)
```

---

## Key Invariants

- Application number MUST match `MOJ-{YEAR}-{8 digits}` — enforced in `GenerateApplicationNumber()` with uniqueness retry.
- `DateTime.UtcNow` MUST be used everywhere — `DateTime.Now` is forbidden per Constitution.
- `ApplicationStatusHistory` MUST be written for EVERY status transition without exception.
- `AuditLog` MUST be written for every create, update, submit, cancel, and status-change.
- In-App notification MUST be created synchronously; Push/Email dispatched via Hangfire.
- The service layer MUST enforce ownership — controllers MUST NOT perform authorization checks.

---

## Testing Checklist

- [ ] Gate 1 blocks underage applicant
- [ ] Gate 1 blocks applicant with existing active application
- [ ] Gate 1 blocks applicant with security block
- [ ] Draft creates without error with partial data
- [ ] Draft updates do not advance status
- [ ] Submit fails when required fields missing
- [ ] Submit passes and transitions to `Submitted`
- [ ] Submit writes `ApplicationStatusHistory` record
- [ ] ApplicationNumber matches `MOJ-{YEAR}-{8 digits}` pattern
- [ ] Applicant can only GET own applications
- [ ] Receptionist sees only DocumentReview stage applications
- [ ] Doctor sees only MedicalExam stage applications  
- [ ] Manager sees all applications
- [ ] Cancel records reason and timestamp
- [ ] Cancel fails on terminal state
- [ ] Timeline returns records in chronological order
- [ ] Eligibility returns correct reasons when ineligible
- [ ] Expired applications auto-closed by Hangfire job
- [ ] All endpoints return `ApiResponse<T>` wrapper
- [ ] Pagination fields correct (`totalPages`, `hasPreviousPage`, etc.)
