# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

## Technical Context

**Language/Version**: C# 12 (.NET 8) and TypeScript 5 (Next.js 15)
**Primary Dependencies**: EF Core 8, Hangfire, MediatR, FluentValidation (Backend); SWR/React Query, shadcn/ui, Tailwind CSS (Frontend)
**Storage**: SQL Server 2022
**Testing**: xUnit, Playwright, Jest
**Project Type**: Full-Stack Web Application (Mojaz Government Platform)
**Performance Goals**: Frontend Booking flow under 90s; API endpoints under 200ms p95.
**Constraints**: 100% prevention of explicit double-booking via optimistic concurrency.
**Scale/Scope**: Serves high-volume bookings natively.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Clean Architecture Supremacy**: Endpoints map to Application layer use-cases without bypassing logic.
- [x] **Security First**: No secrets, proper User Authorization (Applicant).
- [x] **Configuration over Hardcoding**: Reschedule limits and capacities map to SystemSettings.
- [x] **Internationalization by Default**: Frontent Calendar UI uses localized `next-intl` keys.
- [x] **API Contract Consistency**: Follows `ApiResponse<T>`.
- [x] **Test Discipline**: Covered by integrations and unit tests.
- [x] **Async-First Notifications**: Reminders offloaded to Hangfire.

## Project Structure

### Documentation (this feature)

```text
specs/016-appointment-system/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
# Web application
src/backend/
├── Mojaz.Domain/        # Entities, Enums
├── Mojaz.Shared/        # Constants
├── Mojaz.Application/   # DTOs, Handlers, Services, Validators
├── Mojaz.Infrastructure/# EF Configurations, Migrations, Repositories
└── Mojaz.API/           # Controllers

src/frontend/
├── src/app/[locale]/(applicant)/applications/
├── src/components/domain/appointment/ # Calendar UI
└── src/services/        # application.service.ts bindings
```

**Structure Decision**: Selected Option 2 (Web application) mapped strictly to the Mojaz Clean Architecture `.sln` and Next.js App Router workspace folder.
