# Tasks: 015-status-dashboards

**Input**: Design documents from `/specs/015-status-dashboards/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

## Phase 1: Setup
**Purpose**: Initialize structure, configs, and dependencies

- [X] T001 Initialize Framer Motion and Recharts dependencies in `src/frontend/package.json`
- [X] T002 [P] Configure TanStack Table dependencies in `src/frontend/package.json`
- [X] T003 Setup Dashboard and Status translation namespaces in `public/locales/`

---

## Phase 2: Tests
**Purpose**: TDD - write tests for entities, services, and API

- [ ] T004 [P] Write unit tests for `StatusBadge` and `ApplicationTimeline` visual states in `frontend/tests`
- [ ] T005 [P] Write integration tests for dashboard API endpoints (`/dashboards/applicant`, `/dashboards/manager`) in `tests/Mojaz.API.Tests`
- [ ] T006 [P] Write unit tests for `EmployeeApplicationQueue` filtering and pagination logic in `frontend/tests`
- [ ] T007 [P] Write component tests for `ManagerDashboard` charts (Recharts) in `frontend/tests`

---

## Phase 3: Core
**Purpose**: Implement Domain, Application, Infrastructure, API, and UI

- [X] T008 Create DTO model `DashboardSummaryDto.cs`
- [X] T009 [P] Create DTO model `ApplicationSummaryDto.cs`
- [X] T010 [P] Create DTO models for `TimelineStageDto.cs` and `ApplicationTimelineDto.cs`
- [X] T011 Define `ApplicationStatus` Enums mapping in `Mojaz.Domain/Enums/ApplicationStatus.cs`
- [X] T012 [P] [US1] Create frontend types matching backend DTOs in `src/frontend/src/types/application.types.ts`
- [X] T013 [US1] Build `StatusBadge` React component in `src/frontend/src/components/shared/status-badge.tsx`
- [X] T014 [US1] Build `ApplicationTimeline` React component in `src/frontend/src/components/shared/application-timeline.tsx`
- [X] T015 [P] [US1] Implement Backend GET API for fetching timeline stage histories in `Mojaz.API/Controllers/ApplicationsController.cs`
- [X] T016 [US2] Implement Backend Handler `GetApplicantDashboardQueryHandler.cs`
- [X] T017 [US2] Register Endpoint `[GET] /api/v1/dashboards/applicant` in `DashboardController.cs`
- [X] T018 [US2] Build `ApplicantDashboard` client container in `src/frontend/src/components/applicant/dashboard/applicant-dashboard.tsx`
- [X] T019 [US2] Integrate `StatusBadge` and Dashboard container onto `src/frontend/src/app/[locale]/(applicant)/dashboard/page.tsx`
- [X] T020 [US3] Implement Backend `GetEmployeeQueueQueryHandler.cs`
- [X] T021 [US3] Expose parameterized `[GET] /api/v1/applications/queue` in `ApplicationsController.cs`
- [X] T022 [P] [US3] Define strongly typed TanStack Table columns in `src/frontend/src/components/employee/queue/columns.tsx`
- [X] T023 [US3] Implement `EmployeeApplicationQueue` in `src/frontend/src/components/employee/queue/employee-application-queue.tsx`
- [X] T024 [US3] Connect queue on Employee Dashboard route `src/frontend/src/app/[locale]/(employee)/dashboard/page.tsx`
- [X] T025 [P] [US4] Create `ManagerKpiDto` in `src/backend/src/Mojaz.Application/Dashboards/Dtos/ManagerKpiDto.cs`
- [X] T026 [US4] Build unified aggregations in `GetManagerKpisQueryHandler.cs`
- [X] T027 [US4] Add `[GET] /api/v1/dashboards/manager` in `DashboardController.cs`
- [X] T028 [P] [US4] Build bar and pie Recharts wrapper components in `src/frontend/src/components/employee/dashboard/charts/`
- [X] T029 [US4] Assemble `ManagerDashboard` client wrapper `src/frontend/src/components/employee/dashboard/manager-dashboard.tsx`

---

## Phase 4: Integration
**Purpose**: Wire everything together, handle errors, and logging

- [X] T030 Audit all Frontend components (`queue`, `timeline`) for pure RTL layout `ms-` / `me-` compatibility
- [X] T031 Configure Security Gate assertions `[Authorize(Roles="Applicant")]` etc for dashboards endpoints
- [X] T032 Performance verification confirming Suspense fallbacks pop quickly while queues fetch

---

## Phase 5: Polish
**Purpose**: i18n translations, RTL support, Dark Mode, and Final Validation

- [ ] T033 Verify responsive layout for all dashboards on mobile (320px+)
- [ ] T034 Accessibility audit (WCAG 2.1 AA) for timeline and table components
- [ ] T035 Dark mode audit for all dashboard components
- [ ] T036 Final end-to-end validation of the dashboard ecosystem
