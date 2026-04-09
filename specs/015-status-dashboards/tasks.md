---
description: "Task list for Feature 015: Application Timeline, Status Tracking, and Role-Based Dashboards"
---

# Tasks: 015-status-dashboards

**Input**: Design documents from `/specs/015-status-dashboards/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `src/backend/src/Mojaz.Application`, `src/backend/src/Mojaz.API`, `src/frontend/src/app`, `src/frontend/src/components`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for dashboards

- [X] T001 Initialize Framer Motion and Recharts dependencies in `src/frontend/package.json`
- [X] T002 [P] Configure TanStack Table dependencies in `src/frontend/package.json`
- [X] T003 Setup Dashboard and Status translation namespaces inside `src/frontend/public/locales/ar/dashboard.json`, `src/frontend/public/locales/en/dashboard.json`, `src/frontend/public/locales/ar/status.json`, and `src/frontend/public/locales/en/status.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create DTO model `src/backend/src/Mojaz.Application/Dashboards/Dtos/DashboardSummaryDto.cs`
- [X] T005 [P] Create DTO model `src/backend/src/Mojaz.Application/Applications/Dtos/ApplicationSummaryDto.cs`
- [X] T006 [P] Create DTO models for `TimelineStageDto.cs` and `ApplicationTimelineDto.cs` in `src/backend/src/Mojaz.Application/Applications/Dtos/`
- [X] T007 Define `ApplicationStatus` Enums mapping in `src/backend/src/Mojaz.Domain/Enums/ApplicationStatus.cs`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Application Timeline & Status Badges (Priority: P1) 🎯 MVP

**Goal**: Build shared components (`StatusBadge` and `ApplicationTimeline`) to visually present application status according to detailed workflow states.

**Independent Test**: Load the `ApplicationTimeline` component in isolation (e.g. sandbox page). Provide it mock data of 10 stages and ensure completed items appear distinctly from "in-progress" animated items, and RTL flips cleanly.

### Implementation for User Story 1

- [X] T008 [P] [US1] Create frontend types matching backend DTOs in `src/frontend/src/types/application.types.ts`
- [X] T009 [US1] Build `StatusBadge` React component in `src/frontend/src/components/shared/status-badge.tsx` with color variants and `React.memo` optimization.
- [X] T010 [US1] Build `ApplicationTimeline` React component in `src/frontend/src/components/shared/application-timeline.tsx` with Frame Motion staggered animations.
- [X] T011 [P] [US1] Implement Backend GET API for fetching timeline stage histories in `src/backend/src/Mojaz.API/Controllers/ApplicationsController.cs`

**Checkpoint**: At this point, visual tracking components are standalone and fully styled.

---

## Phase 4: User Story 2 - Applicant Dashboard Hub (Priority: P1)

**Goal**: A comprehensive view for the applicant that mounts active application cards using the shared status components.

**Independent Test**: Sign in as 'Applicant'. Assert that `/dashboard` renders active application counts and recent notifications without crashing or throwing errors.

### Implementation for User Story 2

- [X] T012 [US2] Implement Backend Handler `GetApplicantDashboardQueryHandler.cs` inside `src/backend/src/Mojaz.Application/Dashboards/Queries/`
- [X] T013 [US2] Register Endpoint `[GET] /api/v1/dashboards/applicant` in `src/backend/src/Mojaz.API/Controllers/DashboardController.cs`
- [X] T014 [US2] Build `ApplicantDashboard` client/server container in `src/frontend/src/components/applicant/dashboard/applicant-dashboard.tsx`
- [X] T015 [US2] Integrate `StatusBadge` and Dashboard container onto React Router page `src/frontend/src/app/[locale]/(applicant)/dashboard/page.tsx` utilizing `<Suspense>` boundaries.

**Checkpoint**: Applicant dashboard effectively parses data and utilizes shared US1 components.

---

## Phase 5: User Story 3 - Employee Queue (Receptionist/Examiner) (Priority: P1)

**Goal**: A highly-filtered, server-side paginated TanStack table for listing active system workload to employees.

**Independent Test**: Sign in as 'Receptionist'. Assert that the work queue table mounts, parses >0 rows when available, pagination controls execute proper URL reloads, and debounce search executes correctly via API logs.

### Implementation for User Story 3

- [X] T016 [US3] Implement Backend `GetEmployeeQueueQueryHandler.cs` in `src/backend/src/Mojaz.Application/Applications/Queries/` mapped to employee scoped data.
- [X] T017 [US3] Expose parameterized `[GET] /api/v1/applications/queue` to `ApplicationsController.cs`
- [X] T018 [P] [US3] Define strongly typed TanStack Table columns in `src/frontend/src/components/employee/queue/columns.tsx`
- [X] T019 [US3] Implement `EmployeeApplicationQueue` in `src/frontend/src/components/employee/queue/employee-application-queue.tsx` utilizing `useReactTable` and server-side state parsing.
- [X] T020 [US3] Connect queue on Employee Dashboard route `src/frontend/src/app/[locale]/(employee)/dashboard/page.tsx`

**Checkpoint**: Data loads into the employee list view cleanly with server-side pagination bridging state perfectly.

---

## Phase 6: User Story 4 - Managerial KPI Dashboard (Priority: P2)

**Goal**: High-level visual metrics mapping platform load using localized dynamic ReCharts.

**Independent Test**: Sign in as 'Manager'. Observe pie chart segments reflecting active application statuses and stalled records alerting on UI correctly.

### Implementation for User Story 4

- [X] T021 [P] [US4] Create `ManagerKpiDto` in `src/backend/src/Mojaz.Application/Dashboards/Dtos/ManagerKpiDto.cs`
- [X] T022 [US4] Build unified aggregations in `GetManagerKpisQueryHandler.cs`
- [X] T023 [US4] Add `[GET] /api/v1/dashboards/manager` in `DashboardController.cs`
- [X] T024 [P] [US4] Build bar and pie Recharts wrapper components in `src/frontend/src/components/employee/dashboard/charts/` utilizing `next/dynamic`.
- [X] T025 [US4] Assemble `ManagerDashboard` client wrapper `src/frontend/src/components/employee/dashboard/manager-dashboard.tsx` incorporating charts.

**Checkpoint**: Manager dashboards provide analytic insights.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T026 Audit all Frontend components (`queue`, `timeline`) for pure RTL layout `ms-` / `me-` compatibility without direct physical offsets.
- [X] T027 Configure Security Gate assertions `[Authorize(Roles="Applicant")]` etc for the dashboards block endpoints.
- [X] T028 Performance verification confirming Suspense fallbacks pop quickly while queues fetch.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - However, Phase 4 (Applicant) heavily utilizes components built in Phase 3 (Timeline/Badges) and therefore Phase 3 must be constructed first.
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel.
- All Foundational tasks [P] (the definitions of DTOs and Enums in C#) can be built in completely parallel tracks.
- T012, T013 (US2 backend queries) can be built simultaneously with T016, T017 (US3 backend queries).
- Developers working on the backend Dashboard queries can work independently from frontend engineers mocking up the UI components (e.g. `StatusBadge`).

## Implementation Strategy

### MVP First (User Story 1 + 2)
1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: Shared Application Timeline & Status Badges (Visual foundational piece)
4. Complete Phase 4: Basic Applicant Dashboard
5. **VALIDATE**: Ensure the primary public participant role behaves optimally before introducing complex queue logic.

### Incremental Delivery
1. Post MVP (Applicant Flow) -> Add Employee queues (Receptionist workflows first)
2. Follow up with Analytics (Managerial views)
