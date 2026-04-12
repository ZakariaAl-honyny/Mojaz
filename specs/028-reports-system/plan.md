# Implementation Plan: Reports & Analytics System

**Branch**: `028-reports-system` | **Date**: 2026-04-10 | **Spec**: [spec.md](file:///c:/Users/ALlahabi/Desktop/cmder/Mojaz/specs/028-reports-system/spec.md)

## Summary

Build a comprehensive reporting engine providing 7 operational reports for management oversight. The backend will use optimized EF Core queries (read-only context) to provide aggregate data, and the frontend will utilize Recharts for visualizations and TanStack Table for granular data exploration. Access is strictly limited to Manager and Admin roles.

## Technical Context

**Language/Version**: C# (.NET 8), TypeScript (Next.js 15)  
**Primary Dependencies**: Recharts (Frontend), TanStack Table (Frontend), QuestPDF (Backend), EF Core (Backend)  
**Storage**: SQL Server 2022  
**Testing**: xUnit + Moq (Backend), Jest + RTL (Frontend)  
**Target Platform**: Web (Responsive Desktop/Tablet)
**Project Type**: Web Service + Unified Dashboard
**Performance Goals**: < 2s for all reports with 5k+ application records
**Constraints**: RBAC (Manager/Admin Only), Bilingual (AR/EN), RTL Support  
**Scale/Scope**: 7 specialized reports with cross-filtering (Branch, Date, Category)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I: Clean Architecture**: ✅ All logic in `ReportService` (Application), DTOs in `Mojaz.Application`, persistence in `Mojaz.Infrastructure`.
- **Principle II: Security**: ✅ Controllers decorated with `[Authorize(Roles = "Manager,Admin")]`. Resource ownership checked via branch/manager associations.
- **Principle III: Configuration**: ✅ Delayed threshold (14 days) and validity durations pulled from `SystemSettings`.
- **Principle IV: i18n**: ✅ All labels and chart legends translated via `next-intl`. Logical CSS used for RTL layouts.
- **Principle V: API Contract**: ✅ Uniform `ApiResponse<T>` and `PagedResult<T>` for all report endpoints.

## Project Structure

### Documentation (this feature)

```text
specs/028-reports-system/
├── plan.md              # This file
├── research.md          # Data aggregation and export strategies
├── data-model.md        # Report DTOs and aggregate views
├── quickstart.md        # Local environment setup for reports
└── contracts/           # API Endpoint specifications
```

### Source Code (repository root)

```text
src/
├── backend/
│   ├── Mojaz.Application/
│   │   ├── Reports/
│   │   │   ├── Dtos/          # ReportResponse, Aggregates
│   │   │   └── Services/      # IReportService, ReportService
│   ├── Mojaz.Infrastructure/
│   │   └── Persistence/       # Optimized queries/Sprocs (if needed)
│   └── Mojaz.API/
│       └── Controllers/       # ReportsController.cs
└── frontend/
    ├── src/
    │   ├── app/[locale]/(employee)/reports/
    │   ├── components/domain/reports/
    │   │   ├── charts/        # Recharts wrappers
    │   │   └── tables/        # TanStack Table configs
    │   └── services/          # reports.service.ts
```

**Structure Decision**: Standard Web Application structure. Logic is centralized in `Mojaz.Application.Reports`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Read-Only Context | Ensure report queries don't lock production tables | Standard context is optimized for ACID, not OLTAP. |

## Phase 0: Outline & Research

1. **Extract unknowns**:
   - Best practice for multi-series charts in Recharts for "Applications by Status".
   - PDF generation of complex charts using QuestPDF (Server-side rendering or Snapshot?).
2. **Consolidate findings**: Create `research.md`.

## Phase 1: Design & Contracts

1. **Data Model**: Define `ReportSummaryDto`, `StatusComparisonDto`, etc.
2. **Contracts**: Document JSON schemas for each report endpoint.
3. **Agent Update**: Update `AGENTS.md` with Reporting conventions.

## Phase 2: Implementation (Summary)

1. Backend: Implement `ReportService` with 7 methods.
2. Backend: Add `ReportsController` with RBAC.
3. Frontend: Build `ReportDashboard` page with filter bar.
4. Frontend: Create reusable `ChartCard` and `ReportTable` components.
5. Verification: Load 5k mock applications and verify performance.
