# Implementation Plan: 018 — Training Completion Recording & Exemption Management

**Branch**: `018-training-records` | **Date**: 2026-04-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/018-training-records/spec.md`

---

## Summary

Implement Stage 05 (Driving School Training) of the 10-stage license issuance workflow. The feature adds:
1. **Backend** — `TrainingRecord` entity extension, `ITrainingService` / `TrainingService`, CRUD + exemption endpoints, Gate 3 validator, AuditLog integration, async Hangfire notifications.
2. **Frontend** — Employee training-entry page (circular arc progress, governmental ledger aesthetic), Manager exemption review UI (focused approval card with delay-confirmation overlay), Applicant timeline gate-lock visual, fully bilingual (AR/EN RTL/LTR).

The existing `TrainingRecord` domain entity is a stub that must be significantly extended. All configurable thresholds live in `SystemSettings`; no magic numbers in code.

---

## Technical Context

**Language/Version**: C# 12 / .NET 8 (backend) · TypeScript 5 / Next.js 15 App Router (frontend)
**Primary Dependencies**: ASP.NET Core 8, EF Core 8, FluentValidation, AutoMapper, Hangfire; Next.js 15 + Tailwind CSS 4 + shadcn/ui + TanStack Query 5 + Zustand 5 + React Hook Form 7 + Zod 3 + next-intl 3
**Storage**: SQL Server 2022 — `TrainingRecords` table (existing stub, needs migration)
**Testing**: xUnit + Moq + FluentAssertions (backend), Jest + React Testing Library (frontend), Playwright (E2E)
**Target Platform**: Web server (ASP.NET Core 8) + Next.js SSR/RSC on web host
**Performance Goals**: API responses < 2s p95; frontend LCP < 1.2s (parallel server fetch); 60fps arc animation CSS-only
**Constraints**: SystemSettings must never be hardcoded; soft-delete only; DateTime.UtcNow throughout; all text via next-intl; CSS logical properties only
**Scale/Scope**: MVP — 100–500 concurrent users; single training record per application; 6 categories; 4 training statuses

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| **I. Clean Architecture** | TrainingService lives in Application layer; TrainingRepository in Infrastructure; TrainingRecord entity in Domain; zero cross-layer direct refs | ✅ PASS |
| **I. Thin Controllers** | `TrainingController` delegates entirely to `ITrainingService`; no business logic in controller | ✅ PASS |
| **II. Security First** | All endpoints use `[Authorize(Roles = "...")]`; Applicant ownership enforced in service; AuditLog on all writes | ✅ PASS |
| **II. No stack traces** | GlobalExceptionMiddleware already in place; training errors flow through `ApiResponse<T>` | ✅ PASS |
| **III. Configuration over Hardcoding** | `TRAINING_HOURS_{A-F}` read from SystemSettings service; fallback documented, not hardcoded | ✅ PASS |
| **III. Soft Delete** | `TrainingRecord` extends `AuditableEntity` which has `IsDeleted`; global EF query filter applies | ✅ PASS |
| **IV. Internationalization** | All UI text via `training.json` locale files; CSS uses `ms-`, `me-`, `text-start`; sidebar direction per locale | ✅ PASS |
| **V. API Contract** | All endpoints return `ApiResponse<T>`; paginated list uses `PagedResult<T>`; URL follows `/api/v1/training-records` | ✅ PASS |
| **VI. Test Discipline** | Service unit tests ≥ 80% coverage; Gate 3 has dedicated integration test; Playwright E2E for employee form | ✅ PASS |
| **VII. Async Notifications** | In-App created synchronously; Push/Email/SMS dispatched via Hangfire jobs; API never blocks on delivery | ✅ PASS |

**Constitution Check Result: ALL GATES PASS — proceed to Phase 0.**

---

## Project Structure

### Documentation (this feature)

```text
specs/018-training-records/
├── plan.md              ← This file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── api-contracts.md ← Phase 1 output
├── checklists/
│   └── requirements.md  ← Spec quality checklist
└── tasks.md             ← Phase 2 output (via /speckit.tasks)
```

### Source Code (Backend — Clean Architecture)

```text
src/backend/
├── Mojaz.Domain/
│   ├── Entities/
│   │   └── TrainingRecord.cs          ← EXTEND (add missing fields: TrainingDate, TrainerName,
│   │                                     CertificateNumber, ExemptionDocumentId,
│   │                                     ExemptionApprovedAt, ExemptionRejectionReason,
│   │                                     TotalHoursRequired, Status enum ref)
│   └── Enums/
│       └── TrainingStatus.cs          ← NEW (Required=0, InProgress=1, Completed=2, Exempted=3)
│
├── Mojaz.Application/
│   ├── DTOs/
│   │   └── Training/                  ← NEW directory
│   │       ├── TrainingRecordDto.cs
│   │       ├── CreateTrainingRecordRequest.cs
│   │       ├── UpdateTrainingHoursRequest.cs
│   │       ├── CreateExemptionRequest.cs
│   │       └── ExemptionActionRequest.cs
│   ├── Interfaces/
│   │   └── ITrainingService.cs        ← NEW
│   ├── Validators/
│   │   ├── CreateTrainingRecordValidator.cs  ← NEW
│   │   └── CreateExemptionValidator.cs      ← NEW
│   ├── Mappings/
│   │   └── TrainingProfile.cs         ← NEW (AutoMapper)
│   └── Services/
│       └── TrainingService.cs         ← NEW
│
├── Mojaz.Infrastructure/
│   ├── Persistence/
│   │   └── Configurations/
│   │       └── TrainingRecordConfiguration.cs ← NEW (EF Fluent API config)
│   ├── Repositories/
│   │   └── TrainingRepository.cs      ← NEW (implements ITrainingRepository from Domain)
│   └── Migrations/
│       └── [timestamp]_AddTrainingRecordFields.cs ← NEW migration
│
└── Mojaz.API/
    └── Controllers/
        └── TrainingController.cs      ← NEW
```

### Source Code (Frontend — Next.js App Router)

```text
src/frontend/
├── app/[locale]/
│   ├── (employee)/
│   │   └── training/                  ← NEW
│   │       └── [applicationId]/
│   │           └── page.tsx           ← Employee training entry page (RSC + Client island)
│   └── (applicant)/
│       └── applications/
│           └── [id]/
│               └── page.tsx           ← EXTEND: add Gate 3 lock visual to timeline
│
├── components/domain/
│   └── training/                      ← NEW directory
│       ├── TrainingProgressArc.tsx    ← SVG circular arc (CSS animated, 60fps)
│       ├── TrainingEntryForm.tsx      ← Employee hours recording form (useTransition)
│       ├── ExemptionCard.tsx          ← Manager review card (lazy-loaded)
│       ├── ExemptionModal.tsx         ← next/dynamic loaded, approval confirmation overlay
│       ├── SessionHistoryRow.tsx      ← Row for past training sessions
│       ├── TrainingStatusBadge.tsx    ← 4-state badge with government color tokens
│       └── GateLockIndicator.tsx      ← Padlock metaphor for applicant timeline
│
├── services/
│   └── training.service.ts            ← NEW (API calls for all training endpoints)
│
├── hooks/
│   └── useTraining.ts                 ← NEW (TanStack Query wrappers)
│
└── types/
    └── training.types.ts              ← NEW (TrainingRecordDto, CreateTrainingRecordRequest, etc.)
```

**Structure Decision**: Web Application (Option 2) — Clean Architecture 5-layer backend + Next.js 15 App Router frontend. Follows the exact pattern established by Feature 017 (medical examination). New files added in each layer following existing conventions. TrainingRecord entity already exists as a stub in Domain and requires field extension + new migration.

---

## Complexity Tracking

> No Constitution violations identified — this section is intentionally minimal.

| Item | Justification |
|------|---------------|
| `next/dynamic` for ExemptionModal | Modal contains rich document preview; excluding it from initial bundle is a direct Vercel best-practice requirement (bundle-dynamic-imports) and reduces LCP |
| `React.cache()` for SystemSettings lookup | Multiple server components on the training page read `TRAINING_HOURS_{Category}`; deduplication prevents redundant DB calls per request without cross-request cache pollution |
