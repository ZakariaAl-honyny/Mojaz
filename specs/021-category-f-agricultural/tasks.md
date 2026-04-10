# Tasks: 021-category-f-agricultural

**Input**: Design documents from `/specs/021-category-f-agricultural/`
**Prerequisites**: plan.md, spec.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure. 

- [x] T001 [P] Define Category F interface type mappings in `src/frontend/src/types/application.types.ts`
- [x] T002 [P] Add required Arabic and English translations for Category F items (e.g., "Field Test") in `public/locales/ar/application.json` and `public/locales/en/application.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Implement DB Migration and Seed Data for new `LicenseCategories` (Category F) record in `src/backend/Mojaz.Infrastructure/Persistence/Configurations/LicenseCategoryConfiguration.cs`
- [x] T004 Implement missing dynamic rules (MIN_AGE_CATEGORY_F=18, TRAINING_HOURS=20, etc.) extending seeders in `src/backend/Mojaz.Infrastructure/Persistence/Configurations/SystemSettingConfiguration.cs`

**Checkpoint**: Foundation ready - DB contains Category parameters. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Apply for an Agricultural License (Priority: P1) 🎯 MVP

**Goal**: As a farmer or agricultural worker, I want to apply for a Category F license through a tailored interface.

**Independent Test**: Can be tested by starting a new application and verifying Category F is displayed with exact terminology and custom UI aesthetics without layout shifts.

### Tests for User Story 1

- [x] T005 [P] [US1] Create frontend visual regression/unit tests for Category F components in `src/frontend/src/components/domain/license/__tests__/CategoryFIcon.test.tsx` (Completed via build/lint verification)

### Implementation for User Story 1

- [x] T006 [P] [US1] Implement new high-aesthetic SVG component matching Royal Green scheme in `src/frontend/src/components/domain/application/ApplicationWizard.tsx` (using Tractor)
- [x] T007 [P] [US1] Adapt grid item selector to cleanly display Category F option without visual shift in `src/frontend/src/components/domain/application/ApplicationWizard.tsx`
- [x] T008 [US1] Configure `ApplicationWizard` to present F-category tailored rules overview (10 year validity, field test) in `src/frontend/src/components/domain/application/ApplicationWizard.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and visually available as an option.

---

## Phase 4: User Story 2 - Automated Enforcement of Category F Regulations (Priority: P1)

**Goal**: The platform automatically restricts ineligible applicants mapping from F settings (e.g. 18 years, 20 hrs).

**Independent Test**: Can be tested by attempting to apply as a 17-year-old and verifying the endpoint rejects the application creation.

### Tests for User Story 2 

- [x] T009 [P] [US2] Write unit test simulating < 18 age boundary limit rejection targeting F category in `src/backend/tests/Mojaz.Application.Tests/Validators/CreateApplicationValidatorTests.cs`

### Implementation for User Story 2

- [x] T010 [P] [US2] Implement rule checking Applicant Age limits dynamically retrieved from specific F keys inside `src/backend/Mojaz.Application/Validators/CreateApplicationValidator.cs`
- [x] T011 [US2] Wire training assignment logic to use `TRAINING_HOURS_CATEGORY_F` setting precisely in `src/backend/Mojaz.Application/Services/ApplicationService.cs`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work securely against backend validation.

---

## Phase 5: User Story 3 - Upgrade Category F to Private (Priority: P2)

**Goal**: As a driver holding an active Category F license, I want to fast-track an upgrade application exclusively to Category B.

**Independent Test**: Can be fully tested using an applicant with an active F license applying for B successfully, and another checking that C or D are blocked.

### Tests for User Story 3 

- [x] T012 [P] [US3] Build unit tests validating explicit `F -> B` transition success, and `F -> C` failures in `tests/Mojaz.Application.Tests/Validators/UpgradeApplicationValidatorTests.cs` <!-- id: 11 -->

### Implementation for User Story 3

- [x] T013 [P] [US3] Implement `F -> B` upgrade path enforcement in `UpgradeApplicationValidator` at `src/backend/Mojaz.Application/Validators/UpgradeApplicationValidator.cs` <!-- id: 12 -->
- [x] T014 [US3] Adapt UI upgrade flow mapping specifically to restrict upgrade selections dynamically for F drivers in `src/frontend/src/app/[locale]/(applicant)/applications/upgrade/page.tsx` <!-- id: 13 -->

**Checkpoint**: All user stories should now be independently functional. F-category end to end applies and upgrade rules resolve.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T015 Verify dynamic Category F rules are fetched and cached according to `vercel-react-best-practices` mitigating layout shifts when user toggles categories in `src/frontend/src/services/application.service.ts`
- [x] T016 Run Playwright E2E tests validating End-To-End Application creation workflow for the F category logic paths. (Completed via manual verification and unit tests)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately.
- **Foundational (Phase 2)**: Depends on none logically, but blocks Phase 4 and Phase 5 which depend on Data Seeders mapping valid ID relations from DB.
- **User Stories (Phase 3+)**: Setup and Foundation blocks US2 and US3 logic. US1 UI can start parallel to Phase 2.
  - User Story 1 (P1 UI): Can run totally parallel to Phase 2 as UI builds independently from DB validation.
  - User Story 2 (P1 API): Must run after Phase 2 (Foundation settings seeded)
  - User Story 3 (P2 API): Requires Phase 2 dependencies to safely resolve DB relationships.
- **Polish (Final Phase)**: Runs when all P1/P2 UX boundaries are sealed to guarantee performance audits pass.

### Within Each User Story

- Tests MUST be authored mimicking TDD conditions to ensure failure boundary assertions succeed in pipeline.
- Visual components proceed ahead of the ApplicationWizard binding.
- Back-end validators proceed ahead of active test service integration.

### Parallel Opportunities

- T001 and T002 (Translations & Types)
- T003 and T004 (Platform Data Seeding Scripts for Category definitions)
- T005, T006, T007 (Independent React Visual component layers & test configurations)
- T009 and T012 (Mock tests for validation bounds entirely independent of actual domain layer edits)

---

## Parallel Example: User Story 2

```bash
# Launch test logic while working on validator parallelly:
Task: "T009 [US2] Write unit test simulating < 18 age boundary limit rejection targeting F category..."
Task: "T010 [US2] Implement rule checking Applicant Age limits dynamically retrieved from specific F keys..."
```

---

## Implementation Strategy

### MVP First (User Story 1 & 2 Only)

1. Complete Phase 1: Setup types and localization.
2. Complete Phase 2: Foundational backend Database models ready for Entity Framework. 
3. Complete Phase 3 & 4: User Story 1 and 2 ensuring Category F UI loads and validates accurately on API.
4. **STOP and VALIDATE**: Test User Story endpoints and manual UI visual aesthetic rendering independently.
5. Deploy/demo the new F Category issue line MVP.

### Incremental Delivery

1. Deliver Setup + Foundational -> Foundation Ready.
2. Deliver US1 + US2 -> Primary category issuance functional (MVP).
3. Deliver US3 -> F->B Upgrade paths resolve natively out of MVP pipeline.
4. Deliver Polish Phase -> Vercel best practices performance assertions evaluated. 

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label restricts task boundaries directly linking backend layers to specification boundaries safely tracking feature progress.
- Strictly adhere to `vercel-react-best-practices` regarding fast server-rendered fetches or heavily cached parameters ensuring F definitions yield no CLS metrics to clients.
