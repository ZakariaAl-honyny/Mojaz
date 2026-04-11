# Tasks: Reports & Analytics System

**Input**: Design documents from `specs/028-reports-system/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)

---

## Phase 1: Setup (Shared Infrastructure) ✅ COMPLETE

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend directory structure for Reports at `src/backend/Mojaz.Application/Reports/`
- [X] T002 Create frontend directory structure for Reports at `frontend/src/app/[locale]/(employee)/reports/`
- [X] T003 [P] Define `DELAYED_APPLICATION_THRESHOLD_DAYS` setting in `Mojaz.Domain.Constants.Settings` (Value: "14")
- [X] T004 Define report DTOs in `src/backend/Mojaz.Application/Reports/Dtos/` based on `data-model.md`

---

## Phase 2: Foundational (Blocking Prerequisites) ✅ COMPLETE

**Purpose**: Core infrastructure for reporting logic

- [X] T005 Create `IReportService` interface in `src/backend/Mojaz.Application/Interfaces/Services/IReportService.cs`
- [X] T006 Implement `ReportService` skeleton in `src/backend/Mojaz.Application/Services/ReportService.cs`
- [X] T007 [P] Create `ReportsController` in `src/backend/Mojaz.API/Controllers/ReportsController.cs` with `[Authorize(Roles = "Manager,Admin")]`
- [X] T008 [P] Register `IReportService` in `src/backend/Mojaz.Application/ApplicationServiceRegistration.cs` for DI

---

## Phase 3: User Story 1 - Operational Oversight (Priority: P1) 🎯 MVP ✅ COMPLETE

**Goal**: Monitor application health via Status and Service distribution charts.

- [X] T009 [US1] Implement `GetStatusDistributionAsync` in `ReportService` using EF Core `GroupBy`
- [X] T010 [US1] Implement `GetServiceStatsAsync` in `ReportService` comparing New/Renewal/Upgrade volumes
- [X] T011 [US1] Create status distribution endpoint in `ReportsController.cs`
- [X] T012 [US1] Create service stats endpoint in `ReportsController.cs`
- [X] T013 [P] [US1] Create frontend Recharts wrapper `StatusDonutChart.tsx`
- [X] T014 [P] [US1] Create frontend Recharts wrapper `ServiceBarChart.tsx`
- [X] T015 [US1] Build Reports Dashboard page in `frontend/src/app/[locale]/(employee)/reports/page.tsx` with US1 charts

---

## Phase 4: User Story 2 - Identifying Bottlenecks (Priority: P1) ✅ COMPLETE

**Goal**: Identify "Delayed Applications" exceeding the 14-day threshold.

- [X] T016 [US2] Implement `GetDelayedApplicationsAsync` in `ReportService` using `DELAYED_APPLICATION_THRESHOLD_DAYS` setting
- [X] T017 [US2] Create delayed applications endpoint in `ReportsController.cs` (Paginated)
- [X] T018 [P] [US2] Create `DelayedAppsTable.tsx` in `frontend/src/components/domain/reports/tables/`
- [X] T019 [US2] Integrate `DelayedAppsTable` into the Reports Dashboard page

---

## Phase 5: User Story 3 - Performance Metrics (Priority: P2) ✅ COMPLETE

**Goal**: Monitor branch throughput, examiner productivity, and test pass rates.

- [X] T020 [US3] Implement `GetTestPerformanceAsync` in `ReportService` (Pass/Fail counts per type)
- [X] T021 [US3] Implement `GetBranchThroughputAsync` in `ReportService`
- [X] T022 [US3] Implement `GetEmployeeActivityAsync` in `ReportService`
- [X] T023 [US3] Add corresponding endpoints to `ReportsController.cs`
- [X] T024 [P] [US3] Create `BranchEfficiencyMap.tsx` and `PerformanceTrendChart.tsx`
- [X] T025 [P] [US3] Create `EmployeeProductivityTable.tsx`

---

## Phase 6: User Story 4 - Data Portability (Priority: P2) ✅ COMPLETE

**Goal**: Export report data to CSV for external analysis.

- [X] T026 [US4] Add `CsvHelper` package and implement CSV export utility logic
- [X] T027 [US4] Implement `ExportReportsToCsvAsync` in `ReportService`
- [X] T028 [US4] Create `/api/v1/reports/export-csv` endpoint
- [X] T029 [US4] Wire "Export" button in frontend dashboard

---

## Phase 7: Polish & Cross-Cutting Concerns ✅ COMPLETE

**Purpose**: Final trends, UI refinements, and performance verification.

- [X] T030 [P] Implement `GetIssuanceTimelineAsync` line chart data for daily progress
- [X] T031 [P] Create `DailyLoadTimeline.tsx` and integrate into Dashboard
- [X] T032 Refine Dashboard UI for Dark Mode and RTL alignment (logical CSS check)
- [X] T033 Verify all charts are responsive on Tablet/Desktop viewports
- [X] T034 Final manual verification of all 7 reports as per `spec.md`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all story implementation.
- **User Stories (Phase 3-6)**: Depend on Foundational completion.
  - US1 and US2 are P1 and should be completed first for MVP.

### Parallel Opportunities
- T013, T014 (Frontend charts) can be built while T009, T010 (Backend logic) are in progress.
- T018 (Delayed Table) can be built independently once DTOs are defined.
- T025 (Filter Bar) can be built early as it serves multiple stories.

## Implementation Strategy

### MVP First (User Story 1 & 2)
1. Complete Setup and Foundational.
2. Implement **Status Distribution** and **Delayed Applications**.
3. **STOP and VALIDATE**: Verify Manager can see core health and bottlenecks.

### Incremental Delivery
1. Add Test Performance and Employee stats.
2. Add CSV Export.
3. Finish with Issuance Timeline and Polish.
