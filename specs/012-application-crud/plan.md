# Implementation Plan: Application Creation, Management & Status Tracking

**Branch**: `012-application-crud` | **Date**: 2026-04-08 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/012-application-crud/spec.md`

---

## Summary

Completes the full application lifecycle backend for the Mojaz platform. The existing `ApplicationService` and `ApplicationsController` provide a partial foundation (create, list, update, cancel) but are missing critical features: the Draft/Submit split, role-scoped filtering, the timeline endpoint, the eligibility pre-check, and the Hangfire expiry job. This plan defines all gaps, the correct implementation order, and the clean architecture constraints to follow.

**Primary deliverables**:
- `IApplicationService` fully implemented with 9 operations
- Gate 1 extracted to reusable `CheckEligibilityAsync`  
- `GET /applications` with 8 filter parameters and role-scoped data access
- `PATCH /submit` endpoint triggering FluentValidation
- `GET /applications/{id}/timeline` from `ApplicationStatusHistory`
- `ProcessExpiredApplicationsJob` (Hangfire, daily at 02:00 UTC)
- 3 new enum values (`DocumentReview`, `Training`, `Expired`)
- Unit test coverage ≥ 80% for `ApplicationService`

---

## Technical Context

**Language/Version**: C# 12 / .NET 8  
**Primary Dependencies**: ASP.NET Core 8, Entity Framework Core 8, FluentValidation 11, AutoMapper 13, Hangfire 1.8, Serilog  
**Storage**: SQL Server 2022 via `MojazDbContext` (EF Core — Repository + Unit of Work pattern)  
**Testing**: xUnit + Moq + FluentAssertions  
**Target Platform**: Linux server (containerized via Docker) / Windows development  
**Project Type**: Web service (ASP.NET Core REST API)  
**Performance Goals**: List endpoint < 2s at p95 for up to 500 concurrent users  
**Constraints**: All business values from `SystemSettings`; UTC-only `DateTime`; Soft Delete with `IsDeleted`; `ApiResponse<T>` on all endpoints  
**Scale/Scope**: MVP — up to 500 concurrent users; ~52 total API endpoints across the platform

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment | Status |
|-----------|------------|--------|
| **I. Clean Architecture Supremacy** | All business logic in `ApplicationService` (Application layer). Controllers thin. `ProcessExpiredApplicationsJob` in Infrastructure. No Domain→Infrastructure references. | ✅ PASS |
| **II. Security First** | Gate 1 checks in service layer (not controller). Ownership enforced in `GetByIdAsync`/`GetListAsync`. No stack traces in responses. `[Authorize]` on all endpoints with explicit roles. | ✅ PASS |
| **III. Configuration over Hardcoding** | `MIN_AGE_CATEGORY_X` and `APPLICATION_VALIDITY_MONTHS` from `SystemSettings`. No hardcoded fee amounts. `MOJ-{YEAR}-{8 digits}` format from constants. `DateTime.UtcNow` throughout. Soft Delete via `IsDeleted`. | ✅ PASS |
| **IV. Internationalization by Default** | Backend only — bilingual notification content in `TitleAr`/`TitleEn` and `MessageAr`/`MessageEn`. DTO fields include `LicenseCategoryNameAr`/`NameEn`. | ✅ PASS |
| **V. API Contract Consistency** | All 8 endpoints return `ApiResponse<T>`. List returns `ApiResponse<PagedResult<ApplicationDto>>`. URL follows `/api/v1/applications`. `[ProducesResponseType]` on all actions. | ✅ PASS |
| **VI. Test Discipline** | xUnit + Moq + FluentAssertions. Naming: `MethodName_Scenario_ExpectedResult`. 80%+ coverage target on `ApplicationService`. Test project: `Mojaz.Application.Tests`. | ✅ PASS |
| **VII. Async-First Notifications** | In-App created synchronously in `SubmitAsync`/`CancelAsync`. Push/Email dispatched via `_backgroundJobClient.Enqueue`. Main request never blocked by notification failures. | ✅ PASS |

**Constitution Check Result**: ✅ ALL GATES PASS — proceed to implementation.

---

## Project Structure

### Documentation (this feature)

```text
specs/012-application-crud/
├── spec.md          ✅ Complete
├── plan.md          ✅ This file
├── research.md      ✅ Phase 0 complete
├── data-model.md    ✅ Phase 1 complete
├── quickstart.md    ✅ Phase 1 complete
├── contracts/
│   └── api-contracts.md  ✅ Phase 1 complete
├── checklists/
│   └── requirements.md   ✅ Passed
└── tasks.md         ⬜ Phase 2 — /speckit.tasks
```

### Source Code Layout (Backend Only)

```text
src/backend/

Mojaz.Domain/
├── Enums/
│   └── ApplicationStatus.cs        ← Add DocumentReview, Training, Expired
├── Entities/
│   ├── Application.cs              ← Fix Status default, add StatusHistory nav
│   └── ApplicationStatusHistory.cs ← No change (already correct)

Mojaz.Application/
├── DTOs/Application/
│   ├── ApplicationDtos.cs          ← Update ApplicationDto, add new request DTOs
│   ├── ApplicationFilterRequest.cs ← NEW
│   └── EligibilityDtos.cs          ← NEW
├── Interfaces/Services/
│   └── IApplicationService.cs      ← Add 4 missing method signatures
├── Services/
│   └── ApplicationService.cs       ← Implement all gaps + fix existing issues
├── Validators/Application/
│   ├── CreateApplicationValidator.cs ← NEW or update
│   ├── SubmitApplicationValidator.cs ← NEW (mandatory fields)
│   └── UpdateDraftValidator.cs       ← NEW (lenient)
└── Mappings/
    └── ApplicationProfile.cs       ← Update for new DTO fields

Mojaz.Infrastructure/
├── Jobs/
│   └── ProcessExpiredApplicationsJob.cs  ← NEW
├── InfrastructureServiceRegistration.cs  ← Register recurring job
├── Persistence/
│   └── MojazDbContext.cs          ← Verify ApplicationStatusHistory config
└── Data/Configurations/
    └── ApplicationConfiguration.cs ← Add StatusHistory relationship if missing

Mojaz.API/
└── Controllers/
    └── ApplicationsController.cs  ← Add submit, timeline, eligibility endpoints

tests/
├── Mojaz.Application.Tests/
│   └── Services/ApplicationServiceTests.cs  ← NEW (~20 test cases)
└── Mojaz.API.Tests/
    └── Controllers/ApplicationsControllerTests.cs ← NEW/update
```

**Structure Decision**: Web application (backend-only for this feature). Clean Architecture 5-layer model as established. No new projects required — all changes within existing solution structure.

---

## Phase 0: Research Summary

All design decisions resolved. See [`research.md`](research.md) for full rationale. Key findings:

1. **Draft/Submit split** — Creation → `Draft`; `PATCH /submit` → Gate 1 + FluentValidation → `Submitted`
2. **Role-scoped filters** — By `CurrentStage` string, enforced in service layer
3. **ApplicationFilterRequest DTO** — Replaces ad-hoc method parameters for list
4. **`Expired`** — New terminal status, separate from `Cancelled`
5. **Eligibility endpoint** — Standalone `GET /eligibility` for wizard UX
6. **Uniqueness retry** — Max 5 attempts in `GenerateApplicationNumber()`
7. **Gap analysis** — 6 missing/incomplete methods in current `IApplicationService`

---

## Phase 1: Design Summary

All artifacts complete. See:

- [`data-model.md`](data-model.md) — Entity changes, new DTOs, updated interface, state machine
- [`contracts/api-contracts.md`](contracts/api-contracts.md) — Full request/response shapes, all 8 endpoints
- [`quickstart.md`](quickstart.md) — 16-step implementation order, file change matrix

### Phase 1 Constitution Re-Check

Post-design review confirms no violations introduced:
- New `ProcessExpiredApplicationsJob` correctly placed in Infrastructure (not Application)
- `CheckEligibilityAsync` correctly placed in Application service (not controller)
- No hard-coded values introduced in any DTO or service implementation plan
- All new endpoints maintain `ApiResponse<T>` wrapper consistency

✅ **Post-design constitution check: PASS**

---

## Complexity Tracking

> No unjustified complexity introduced.

| Decision | Justification |
|----------|---------------|
| Add `ApplicationFilterRequest` DTO | 8 filter params require a dedicated DTO — individual method params would be unreadable and non-extensible |
| Add `ProcessExpiredApplicationsJob` in Infrastructure | Hangfire job needs DbContext access (Infrastructure concern) — cannot be in Application layer per Clean Architecture |
| Retry loop in `GenerateApplicationNumber` | Uniqueness guarantee required by FR-003; collision probability is negligible but the spec is explicit |

---

## Risks & Mitigations

| Risk | Probability | Mitigation |
|------|-------------|------------|
| ApplicationStatus enum changes break existing data | Low | EF Core stores enum as int — adding new values doesn't break existing rows; no migration needed |
| Hangfire job runs while application is being processed | Low | Job only transitions non-terminal apps; exact same-second race is statistically negligible; idempotent design |
| `CurrentStage` string mismatch breaks role-scoped filters | Medium | Define stage name constants in `Shared/Constants/` and use them everywhere |
| `GenerateApplicationNumber` collision under load | Very Low | Retry loop with max 5 attempts; alert via Serilog if all 5 collide |
