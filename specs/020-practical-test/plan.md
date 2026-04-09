# Implementation Plan: 020 — Practical Test Recording

**Branch**: `020-practical-test` | **Date**: 2026-04-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/020-practical-test/spec.md`

---

## Summary

Feature 020 implements Stage 07 (Practical Test) of the Mojaz driving license issuance workflow. It follows the same architectural pattern as Feature 019 (Theory Test) but introduces two key differentiators: (a) **the additional-training flag** — on failure, an Examiner can flag the applicant as requiring additional training hours before they can rebook, and (b) **booking gate enforcement** for that flag in the `AppointmentBookingValidator`. The backend adds `IPracticalRepository`, `IPracticalService`, `PracticalService`, `PracticalTestsController`, and related DTOs/validators/mappings. The frontend adds a `PracticalResultForm`, `PracticalTestHistory`, and `TestAttemptBadge` (reuse from theory), wired to a new `practical.service.ts`. A database migration adds `PracticalAttemptCount` and `AdditionalTrainingRequired` to the `Applications` table, and populates `SystemSettings` with `MIN_PASS_SCORE_PRACTICAL`, `MAX_PRACTICAL_ATTEMPTS`, and `COOLING_PERIOD_DAYS_PRACTICAL`.

---

## Technical Context

**Language/Version**: C# 12 / .NET 8 (backend); TypeScript 5 / Next.js 15 App Router (frontend)
**Primary Dependencies**:
- Backend: ASP.NET Core 8, EF Core 8, AutoMapper, FluentValidation, Hangfire, Serilog, Moq, xUnit, FluentAssertions
- Frontend: React Query 5, React Hook Form 7, Zod 3, next-intl 3, shadcn/ui, Tailwind CSS 4

**Storage**: SQL Server 2022 — `PracticalTests` table (already exists), `Applications` table (columns to add)
**Testing**: xUnit + Moq + FluentAssertions (backend); Jest + React Testing Library (frontend); Playwright (E2E)
**Target Platform**: Web service (Linux server / IIS); web app (Next.js SSR)
**Project Type**: Full-stack web application (GovTech)
**Performance Goals**: API response < 2s at p95; notification dispatch < 5 min
**Constraints**: All business values from `SystemSettings`; no hardcoded thresholds; UTC everywhere; soft delete only
**Scale/Scope**: MVP — ~10k users; 52 API endpoints total; this feature adds 2 endpoints

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| **I. Clean Architecture** | `PracticalService` in Application; `PracticalRepository` in Infrastructure; Controller thin; no DbContext outside Infrastructure | ✅ PASS |
| **I. Clean Architecture** | `IPracticalService` and `IPracticalRepository` interfaces defined in Application; implemented in Infrastructure | ✅ PASS |
| **II. Security First** | `[Authorize(Roles = "Examiner")]` on result endpoint; ownership check (Applicant can only view own history) in service layer | ✅ PASS |
| **II. Security First** | All inputs validated via FluentValidation before state change; audit log on every result | ✅ PASS |
| **III. Configuration over Hardcoding** | `MIN_PASS_SCORE_PRACTICAL`, `MAX_PRACTICAL_ATTEMPTS`, `COOLING_PERIOD_DAYS_PRACTICAL` from `SystemSettings`; never in code | ✅ PASS |
| **III. Configuration over Hardcoding** | Soft delete on `PracticalTest` entity (inherits `SoftDeletableEntity`) | ✅ PASS |
| **IV. Internationalization** | All frontend text in `public/locales/{ar,en}/practical.json` via `next-intl`; RTL/LTR logical properties | ✅ PASS |
| **V. API Contract** | `POST /api/v1/practical-tests/{appId}/result` returns `ApiResponse<PracticalTestDto>`; `GET /api/v1/practical-tests/{appId}/history` returns `ApiResponse<PagedResult<PracticalTestDto>>` | ✅ PASS |
| **VI. Test Discipline** | Unit tests for `PracticalService` in `Mojaz.Application.Tests`; 80%+ coverage on service methods | ✅ PASS |
| **VII. Async Notifications** | In-App synchronous; Push/Email/SMS via Hangfire background jobs on pass, fail, and rejection | ✅ PASS |

**Post-design re-check**: After Phase 1 design, re-verify that:
- `Application` entity additions (`PracticalAttemptCount`, `AdditionalTrainingRequired`) do not introduce business logic in the Domain layer
- `AppointmentBookingValidator` extension for practical test gates injects `IPracticalService` (not the concrete implementation)

**No Complexity Tracking violations** — all patterns are direct mirrors of the already-approved Feature 019 structure.

---

## Project Structure

### Documentation (this feature)

```text
specs/020-practical-test/
├── plan.md              ← This file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── contracts/           ← Phase 1 output
│   ├── POST_practical-tests_{appId}_result.md
│   └── GET_practical-tests_{appId}_history.md
├── quickstart.md        ← Phase 1 output
├── checklists/
│   └── requirements.md
└── tasks.md             ← Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── backend/
│   ├── Mojaz.Domain/
│   │   └── Entities/
│   │       ├── PracticalTest.cs            ← UPDATE: add Score, IsAbsent, PassingScore, ConductedAt, Examiner nav
│   │       └── Application.cs              ← UPDATE: add PracticalAttemptCount, AdditionalTrainingRequired,
│   │                                                  PracticalTests navigation collection
│   │
│   ├── Mojaz.Application/
│   │   ├── Interfaces/
│   │   │   ├── IPracticalRepository.cs     ← NEW
│   │   │   └── IPracticalService.cs        ← NEW
│   │   ├── DTOs/
│   │   │   └── Practical/
│   │   │       ├── SubmitPracticalResultRequest.cs  ← NEW
│   │   │       └── PracticalTestDto.cs              ← NEW
│   │   ├── Validators/
│   │   │   └── SubmitPracticalResultValidator.cs    ← NEW
│   │   ├── Mappings/
│   │   │   └── PracticalMappingProfile.cs           ← NEW
│   │   └── Services/
│   │       ├── PracticalService.cs                  ← NEW
│   │       └── AppointmentBookingValidator.cs        ← UPDATE: add practical gate check
│   │
│   ├── Mojaz.Infrastructure/
│   │   ├── Repositories/
│   │   │   └── PracticalRepository.cs      ← NEW
│   │   ├── Configurations/
│   │   │   └── PracticalTestConfiguration.cs        ← NEW (EF config)
│   │   └── Migrations/                     ← NEW: add PracticalAttemptCount + AdditionalTrainingRequired
│   │
│   └── Mojaz.API/
│       ├── Controllers/
│       │   └── PracticalTestsController.cs ← NEW
│       └── Program.cs                      ← UPDATE: register IPracticalRepository, IPracticalService
│
├── frontend/
│   ├── public/
│   │   └── locales/
│   │       ├── ar/practical.json           ← NEW
│   │       └── en/practical.json           ← NEW
│   └── src/
│       ├── types/
│       │   └── practical.types.ts          ← NEW
│       ├── services/
│       │   └── practical.service.ts        ← NEW
│       ├── components/
│       │   └── domain/
│       │       └── practical/
│       │           ├── PracticalResultForm.tsx   ← NEW
│       │           ├── PracticalTestHistory.tsx  ← NEW
│       │           └── TestAttemptBadge.tsx      ← REUSE from theory (or copy-adapt)
│       └── app/
│           └── [locale]/
│               └── (employee)/
│                   └── practical-results/
│                       └── page.tsx         ← NEW
│
tests/
└── backend/
    └── Mojaz.Application.Tests/
        └── Services/
            └── PracticalServiceTests.cs     ← NEW
```

**Structure Decision**: Web application pattern (Option 2) — same full-stack structure as Feature 019.

---

## Complexity Tracking

> No constitution violations to justify. All patterns mirror Feature 019 (approved and delivered).
