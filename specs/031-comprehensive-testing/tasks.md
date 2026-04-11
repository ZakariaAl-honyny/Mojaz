# Tasks: Comprehensive Testing Suite

**Input**: Design documents from `/specs/031-comprehensive-testing/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Create project structure for Playwright in `src/frontend/playwright/` and subfolders
- [X] T002 [P] Configure `src/frontend/playwright.config.ts` with multi-browser matrix and project-specific locales/themes
- [X] T003 [P] Configure linting/formatting for test files in `src/frontend/eslint.config.mjs`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure for test data and session management

- [x] T004 [P] Create `src/frontend/playwright/auth.setup.ts` to manage auth session storage for 6 roles
- [x] T005 [P] Implement database seeding scripts (`TestDataSeeder.cs` + `TestingController`) in `src/backend/Mojaz.Infrastructure/Data/Seeding`
- [x] T006 [P] Define shared test utilities (performance, toast, date helpers) in `src/frontend/playwright/utils.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

### Phase 3: User Story 1 - Full Applicant Lifecycle E2E (Priority: P1) 🎯 MVP - **COMPLETED**

**Goal**: Verify the entire journey from registration to license issuance.

**Independent Test**: Run `npx playwright test e2e/applicant/` and verify the test user status transitions from `New` to `Issued`.

- [x] T007 [P] [US1] Implement Registration and OTP verification tests in `src/frontend/playwright/e2e/applicant/auth.spec.ts`
- [x] T008 [P] [US1] Implement 10-stage "New License Issuance" journey in `src/frontend/playwright/e2e/applicant/issuance.spec.ts`
- [x] T009 [P] [US1] Implement Payment simulation and status verification in `src/frontend/playwright/e2e/applicant/payment.spec.ts`
- [x] T010 [P] [US1] Implement License download verification in `src/frontend/playwright/e2e/applicant/download.spec.ts`

**Checkpoint**: User Story 1 (Applicant Lifecycle) functional and testable.

---

### Phase 4: User Story 2 - Employee Portal and RBAC (Priority: P1) - **COMPLETED**

**Goal**: Verify official dashboards and secure access controls.

**Independent Test**: Run `npx playwright test e2e/employee/` and verify that each role sees only permitted data.

- [x] T011 [P] [US2] Implement Receptionist document verification tests in `src/frontend/playwright/e2e/employee/receptionist.spec.ts`
- [x] T012 [P] [US2] Implement Official (Doctor/Examiner) result entry tests in `src/frontend/playwright/e2e/employee/officials.spec.ts`
- [x] T013 [P] [US2] Implement RBAC security violation tests (cross-role access denial) in `src/frontend/playwright/e2e/employee/rbac.spec.ts`

**Checkpoint**: Employee portal and security boundaries verified.

---

### Phase 5: User Story 3 - Visual Regression and Multi-Mode (Priority: P2) - **COMPLETED**

**Goal**: Ensure UI perfection in AR/EN and Dark/Light mode combinations.

**Independent Test**: Run `npx playwright test visual/` and review results for 100% pixel match.

- [x] T014 [P] [US3] Implement Landing Page visual snapshots for all locales/themes in `src/frontend/playwright/visual/landing.spec.ts`
- [x] T015 [P] [US3] Implement Portal Dashboard visual snapshots in `src/frontend/playwright/visual/dashboard.spec.ts`
- [x] T016 [P] [US3] Implement Logical Property (RTL flip) verification tests in `src/frontend/playwright/visual/layout.spec.ts`

---

## Phase 6: User Story 4 - Performance and Responsiveness (Priority: P2)

**Goal**: Verify API and page load performance SLAs.

**Independent Test**: Run `npx playwright test perf/` and verify all timings are within limits (API < 2s).

- [x] T017 [P] [US4] Implement API Latency timing assertions in `src/frontend/playwright/perf/api-latency.spec.ts`
- [x] T018 [P] [US4] Implement Frontend Performance metrics (FCP/LCP) in `src/frontend/playwright/perf/frontend-perf.spec.ts`
- [x] T019 [P] [US4] Implement Mobile Viewport responsiveness tests in `src/frontend/playwright/perf/responsive.spec.ts`

---

### Phase N: Polish & Cross-Cutting Concerns - **COMPLETED**

**Purpose**: Automation integration and final verification.

- [x] T020 [P] Configure GitHub Actions workflow in `.github/workflows/playwright.yml`
- [x] T021 [P] Update `specs/031-comprehensive-testing/quickstart.md` with final reporting instructions
- [x] T022 Final system validation with 500+ passing assertions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on T001 completion.
- **User Stories (Phase 3+)**: All depend on Phase 2 (Foundational) for consistent test state.
- **Polish (Final Phase)**: Depends on all user story phases completion.

### Parallel Opportunities

- ALL tasks marked [P] can run in parallel within their respective phases.
- Once Phase 2 is done, all User Stories (US1, US2, US3, US4) can be implemented in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2 (Setup & Foundation).
2. Complete Phase 3 (US1 - Applicant Journey).
3. **STOP and VALIDATE**: Verify end-to-end applicant journey.

### Incremental Delivery

1. Add US2 (Employee Portals).
2. Add US3 (Visual Regression).
3. Add US4 (Performance).
