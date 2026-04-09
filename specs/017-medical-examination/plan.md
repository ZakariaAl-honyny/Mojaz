# Implementation Plan: 017-medical-examination

**Branch**: `017-medical-examination` | **Date**: 2026-04-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/017-medical-examination/spec.md`

## Summary

Implement the medical examination recording feature where a Doctor records fitness results, triggering validity tracking, status advancement, and async notifications. The implementation will follow the strict `.NET 8` Clean Architecture backend and a Next.js `App Router` frontend styled with a highly distinctive Absher-inspired UI that adheres strictly to Vercel's React Best Practices (optimistic updates, zero-waterfall fetches).

## Technical Context

**Language/Version**: C# 12 (.NET 8) backend, TypeScript 5 (Next.js 15) frontend.
**Primary Dependencies**: ASP.NET Core, Entity Framework Core 8, FluentValidation, React, Tailwind CSS 4, shadcn/ui, TanStack Query.
**Storage**: SQL Server 2022.
**Testing**: xUnit + Moq (Backend), Jest + React Testing Library + Playwright (Frontend).
**Target Platform**: Web (Employee/Doctor portal and Applicant portal).
**Project Type**: Full-stack web application.
**Performance Goals**: < 1s LCP using bundle-splitting; Instantaneous form submission perceived performance using `useTransition`.
**Constraints**: Strict RTL (Arabic default), Strict security (Role = Doctor only for POST/PATCH), No hardcoded magic strings (use SystemSettings for validity).
**Scale/Scope**: Medical Result submission logic affecting the core Application lifecycle state machine.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Clean Architecture Supremacy**: `IMedicalService` will reside in Application layer; `MedicalResult` in Domain; Controllers are thin delegates. Passes.
- **II. Security First**: `Authorize(Roles="Doctor")` on the endpoints. Passes.
- **III. Configuration over Hardcoding**: `MEDICAL_VALIDITY_DAYS` will be queried from `SystemSettings`. Uses `DateTime.UtcNow`. Passes.
- **IV. Internationalization by Default**: Uses `next-intl`. No hardcoded strings in components, logical CSS (`ms-4`) enforced. Passes.
- **V. API Contract Consistency**: Always returns `ApiResponse<T>`. Routes use `/api/v1/medical-exams`. Passes.
- **VI. Test Discipline**: 80%+ test coverage planned in `Mojaz.Application.Tests` and `Mojaz.API.Tests`. Passes.
- **VII. Async-First Notifications**: Notification dispatch handled via Hangfire tasks to avoid blocking the Doctor's HTTP request. Passes.

*Status: ALL GATES PASSED.*

## Project Structure

### Documentation (this feature)

```text
specs/017-medical-examination/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output 
```

### Source Code (repository root)

```text
Mojaz.sln
├── src/
│   ├── Mojaz.Domain/
│   │   └── Entities/MedicalResult.cs
│   │   └── Enums/FitnessResult.cs
│   ├── Mojaz.Shared/
│   ├── Mojaz.Application/
│   │   ├── Services/MedicalService.cs
│   │   ├── DTOs/Medical/
│   │   └── Validators/
│   ├── Mojaz.Infrastructure/
│   │   └── Persistence/ApplicationDbContext.cs
│   └── Mojaz.API/
│       └── Controllers/MedicalExamsController.cs
├── tests/
│   ├── Mojaz.Application.Tests/Services/MedicalServiceTests.cs
│   └── Mojaz.API.Tests/Controllers/MedicalExamsControllerTests.cs

frontend/
├── src/
│   ├── app/[locale]/(employee)/applications/[id]/medical/
│   ├── components/domain/medical/MedicalResultForm.tsx
│   ├── services/medical.service.ts
│   └── types/medical.types.ts
```

**Structure Decision**: A split Monorepo approach mapping exactly to the existing Clean Architecture .NET backend and Next.js frontend structures defined in `AGENTS.md`.
