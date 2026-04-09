# Implementation Plan: 015-status-dashboards

**Branch**: `015-status-dashboards` | **Date**: 2026-04-09 | **Spec**: specs/015-status-dashboards/spec.md
**Input**: Feature specification from `/specs/015-status-dashboards/spec.md`

## Summary

Build the visual heartbeat of the Mojaz platform: a shared status badge system, a vertical animated 10-stage application timeline, a rich applicant self-service dashboard, role-specific employee dashboards, a TanStack Table-powered employee work queue, and a structured application detail view for multiple roles.

## Technical Context

**Language/Version**: TypeScript 5, C# 12 (.NET 8)
**Primary Dependencies**: Next.js 15 (App Router), Tailwind CSS 4, shadcn/ui, TanStack Table v8, Lucide React, Framer Motion 11, Recharts 2, ASP.NET Core 8
**Storage**: SQL Server 2022 / Entity Framework Core 8
**Testing**: Jest + React Testing Library (Frontend), xUnit + Moq (Backend)
**Target Platform**: Web Browsers (Responsive Desktop/Tablet/Mobile)
**Project Type**: Full-Stack Web Application (Government Portal)
**Performance Goals**: < 2 seconds Response time, independent suspense boundaries, debounce search (300ms)
**Constraints**: Fully bilingual (RTL/Arabic default), Dark/Light mode, WCAG 2.1 AA compliance
**Scale/Scope**: 7 user roles, 8 services, 10 workflow stages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Clean Architecture**: DTOs mapped cleanly from backend Application context boundaries to minimize data over-fetching. Role specific queries are located in the Service layer.
- **II. Security First**: Dashboards are highly role-scoped via RBAC endpoint constraints (`[Authorize(Roles="Role")]`), strict `UserId` filtering for applicants, and conditional UI rendering.
- **III. Config over Hardcoding**: Stall limits for tables (e.g. stalled application views) read dynamically from `SystemSettings`. Timestamp logic guarantees UTC.
- **IV. Internationalization**: Timeline connectors mirror physically in RTL via Tailwind logicals (`ms-`, `me-`). All labels supplied via `next-intl`.
- **V. API Contracts**: All Dashboard aggregation and list endpoints will use strictly validated `ApiResponse<T>` wrappers with `PagedResult<T>` when dealing with rows.
- **VI. Test Discipline**: TanStack Table and Timeline component unit testing via RTL. E2E workflows test role segregation.
- **VII. Async-First Notifications**: Timeline relies on async data feeds and doesn't block notifications.

All gates PASSED.

## Project Structure

### Documentation (this feature)

```text
specs/015-status-dashboards/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── Mojaz.Application/
│   │   ├── Dashboards/             # Dashboard aggregation queries
│   │   └── Applications/           # Timelines and Queue queries
│   └── Mojaz.API/
│       └── Controllers/
│           ├── DashboardController.cs
│           └── ApplicationsController.cs
           
frontend/
├── src/
│   ├── app/[locale]/
│   │   ├── (applicant)/dashboard/page.tsx
│   │   └── (employee)/dashboard/page.tsx
│   └── components/
│       ├── shared/
│       │   ├── status-badge.tsx
│       │   └── application-timeline.tsx
│       └── employee/
│           ├── dashboard/
│           │   ├── manager-dashboard.tsx
│           │   ├── receptionist-dashboard.tsx
│           │   └── ...
│           └── queue/
│               ├── employee-application-queue.tsx
│               └── columns.tsx
```

**Structure Decision**: Standard Mojaz Monorepo layout matching Clean Architecture implementation pattern.
