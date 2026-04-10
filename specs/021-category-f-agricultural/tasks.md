# Tasks: 021-category-f-agricultural

**Input**: Design documents from `/specs/021-category-f-agricultural/`
**Prerequisites**: plan.md, spec.md, data-model.md, quickstart.md

## Format: `[ID] [P?] [Story] Description — file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup (Initialize structure, configs, dependencies)

**Purpose**: Project initialization and basic structure.

- [x] T001 [P] Define Category F interface type mappings in `src/frontend/src/types/application.types.ts`
- [x] T002 [P] Add required Arabic and English translations for Category F items (e.g., "Field Test") in `public/locales/ar/application.json` and `public/locales/en/application.json`

---

## Phase 2: Tests (TDD: write tests for entities, services, API)

**Purpose**: Establish validation boundaries before implementing logic.

- [x] T005 [P] [US1] Create frontend visual regression/unit tests for Category F components in `src/frontend/src/components/domain/license/__tests__/CategoryFIcon.test.tsx`
- [x] T009 [P] [US2] Write unit test simulating < 18 age boundary limit rejection targeting F category in `src/backend/tests/Mojaz.Application.Tests/Validators/CreateApplicationValidatorTests.cs`
- [x] T012 [P] [US3] Build unit tests validating explicit `F -> B` transition success, and `F -> C` failures in `tests/Mojaz.Application.Tests/Validators/UpgradeApplicationValidatorTests.cs`

---

## Phase 3: Core (Implement Domain, Application, Infrastructure, API, and UI)

**Purpose**: Implement the core Category F logic and tailored interfaces.

### Foundational (Blocking)
- [x] T003 Implement DB Migration and Seed Data for Category F record in `src/backend/Mojaz.Infrastructure/Persistence/Configurations/LicenseCategoryConfiguration.cs`
- [x] T004 Implement dynamic rules (MIN_AGE_CATEGORY_F=18, TRAINING_HOURS=20) in `src/backend/Mojaz.Infrastructure/Persistence/Configurations/SystemSettingConfiguration.cs`

### User Story 1 - Apply for an Agricultural License (P1)
- [x] T006 [P] [US1] Implement new high-aesthetic SVG component (Tractor) in `src/frontend/src/components/domain/application/ApplicationWizard.tsx`
- [x] T007 [P] [US1] Adapt grid item selector for Category F without visual shift in `src/frontend/src/components/domain/application/ApplicationWizard.tsx`
- [x] T008 [US1] Configure `ApplicationWizard` to present F-category tailored rules overview in `src/frontend/src/components/domain/application/ApplicationWizard.tsx`

### User Story 2 - Automated Enforcement of Category F Regulations (P1)
- [x] T010 [P] [US2] Implement rule checking Applicant Age limits dynamically retrieved from F keys in `src/backend/Mojaz.Application/Validators/CreateApplicationValidator.cs`
- [x] T011 [US2] Wire training assignment logic to use `TRAINING_HOURS_CATEGORY_F` setting in `src/backend/Mojaz.Application/Services/ApplicationService.cs`

### User Story 3 - Upgrade Category F to Private (P2)
- [x] T013 [P] [US3] Implement `F -> B` upgrade path enforcement in `UpgradeApplicationValidator` in `src/backend/Mojaz.Application/Validators/UpgradeApplicationValidator.cs`
- [x] T014 [US3] Adapt UI upgrade flow mapping to restrict upgrade selections for F drivers in `src/frontend/src/app/[locale]/(applicant)/applications/upgrade/page.tsx`

---

## Phase 4: Integration (Wire everything together, handle errors, logging)

**Purpose**: End-to-end workflow validation.

- [x] T016 Run Playwright E2E tests validating End-To-End Application creation workflow for Category F logic paths.

---

## Phase 5: Polish (i18n translations, RTL support, Dark Mode, Final Validation)

**Purpose**: Performance and aesthetic refinement.

- [x] T015 Verify dynamic Category F rules are fetched and cached according to `vercel-react-best-practices` in `src/frontend/src/services/application.service.ts`
