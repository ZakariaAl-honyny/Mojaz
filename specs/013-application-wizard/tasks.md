# Tasks: Multi-Step Application Wizard

**Input**: Design documents from `/specs/013-application-wizard/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/api.md ✅ quickstart.md ✅
**Feature Branch**: `013-application-wizard`
**Date**: 2026-04-08

**Organization**: Tasks grouped by user story for independent implementation and testing.
**Tests**: Component + unit tests included per constitution §VI (Test Discipline).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no conflict)
- **[Story]**: User story label (US1–US7) mapping to spec.md priorities

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create all new files and directories needed by the wizard feature. No existing files modified.

- [X] T001 Create directory `frontend/src/components/domain/application/wizard/steps/` and `wizard/shared/`
- [X] T002 [P] Create directory `frontend/src/hooks/` (if it doesn't already exist from Feature 002)
- [X] T003 [P] Create directory `frontend/src/lib/validations/` (if it doesn't already exist)
- [X] T004 [P] Create directory `frontend/src/types/` (if it doesn't already exist)
- [X] T005 [P] Create empty `frontend/public/locales/ar/wizard.json` with `{}` placeholder
- [X] T006 [P] Create empty `frontend/public/locales/en/wizard.json` with `{}` placeholder

**Checkpoint**: All directories and placeholder files created — implementation can begin.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Types, store, schemas, and service stubs that ALL user stories depend on. Must complete before any wizard UI work.

⚠️ **CRITICAL**: No user story work can begin until this phase is complete.

- [X] T007 Define all TypeScript types and enums in `frontend/src/types/wizard.types.ts`: `StepId`, `ServiceType` (8 values), `LicenseCategoryCode` (A–F), `LicenseCategoryOption`, `ExamCenter`, `ServiceCardConfig`, `Step1Data`, `Step2Data`, `Step3Data`, `Step4Data`, `WizardState` — per data-model.md §1–2
- [X] T008 [P] Create Zustand store `frontend/src/stores/wizard-store.ts`: implement `WizardState` interface with all step slices (`step1`–`step4`), actions (`setStep1`–`setStep4`, `goTo`, `markCompleted`, `setApplicationId`, `setLastSavedAt`, `incrementSaveFailures`, `resetSaveFailures`, `resetWizard`, `setDeclaration`), and `persist` middleware writing `{ applicationId, currentStep, completedSteps, step1, step2, step3, step4 }` to `sessionStorage` with key `mojaz-wizard-draft` — per data-model.md §1 and research.md D-001
- [X] T009 [P] Create Zod schema `frontend/src/lib/validations/step1Schema.ts`: `step1Schema` validating `serviceType` as `z.nativeEnum(ServiceType)` with translation key error message — per data-model.md §3
- [X] T010 [P] Create Zod schema `frontend/src/lib/validations/step2Schema.ts`: export `createStep2Schema(dateOfBirth, minAgeMap)` factory that validates `categoryCode` as `z.nativeEnum(LicenseCategoryCode)` with `superRefine` age check using `calculateAge()` utility — per data-model.md §3 and research.md D-003
- [X] T011 [P] Create Zod schema `frontend/src/lib/validations/step3Schema.ts`: `step3Schema` validating all 9 personal info fields (`nationalId`, `dateOfBirth`, `nationality`, `gender`, `mobileNumber`, `email`, `address`, `city`, `region`) with field-specific rules and translation key error messages — per data-model.md §3
- [X] T012 [P] Create Zod schema `frontend/src/lib/validations/step4Schema.ts`: `step4Schema` validating all 5 application detail fields (`applicantType`, `preferredCenterId`, `testLanguage`, `appointmentPreference`, `specialNeedsDeclaration`) with `superRefine` requiring `specialNeedsNote` when `specialNeedsDeclaration` is true — per data-model.md §3
- [X] T013 [P] Create Zod schema `frontend/src/lib/validations/step5Schema.ts`: `step5Schema` validating `declarationAccepted` as `z.literal(true)` — per data-model.md §3
- [X] T014 [P] Add `calculateAge(dateOfBirth: string): number` utility to `frontend/src/lib/utils.ts` — returns integer years between DOB and today (used by step2Schema and Step2 component)
- [X] T015 Extend `frontend/src/services/application.service.ts` with three wizard-specific functions: `createDraftApplication(serviceType)` → `POST /api/v1/applications`, `updateDraftApplication(id, data)` → `PATCH /api/v1/applications/{id}`, `submitApplication(id)` → `POST /api/v1/applications/{id}/submit` — using the Axios instance from Feature 006; response typed as `ApiResponse<ApplicationDraftDto>` per contracts/api.md
- [X] T016 [P] Add lookup service functions to `frontend/src/services/application.service.ts` (or a new `frontend/src/services/lookup.service.ts`): `getLicenseCategories()` → `GET /api/v1/license-categories`, `getExamCenters()` → `GET /api/v1/exam-centers`, `getNationalities()` → `GET /api/v1/lookups/nationalities`, `getRegions()` → `GET /api/v1/lookups/regions` — per contracts/api.md §5–7
- [X] T017 [P] Define React Query key constants in `frontend/src/lib/constants.ts` (or append): `wizardQueryKeys` object with `existingDraft`, `licenseCategories`, `examCenters`, `nationalities`, `regions` — per contracts/api.md §React Query Key Conventions
- [X] T018 Populate `frontend/public/locales/en/wizard.json` with all English strings: step titles (steps 1–5), all service card keys (8 services), all category card keys (6 categories), all form field labels and placeholders (steps 3–4), navigation button labels (`back`, `next`, `saveDraft`), auto-save indicator strings (`saving`, `saved`, `failed`), review section labels, declaration text, all validation error messages (per quickstart.md §Translation Key Convention)
- [X] T019 Populate `frontend/public/locales/ar/wizard.json` with Arabic equivalents of all keys from T018 — full RTL Arabic translations for every key

**Checkpoint**: Types, store, schemas, service functions, and translation strings are all ready. No UI work is blocked.

---

## Phase 3: User Story 1 — Complete Application Submission (Priority: P1) 🎯 MVP

**Goal**: A logged-in applicant can complete all 5 steps with valid data and submit a Draft → Submitted application, then be redirected to the detail page.

**Independent Test**: Log in as an Applicant-role user (age ≥ 21), complete all 5 steps with valid data for Category B, click "Submit Application", and verify the new application appears in the dashboard with status "Submitted".

### Implementation for User Story 1

- [X] T020 [US1] Create `frontend/src/app/[locale]/(applicant)/applications/new/page.tsx`: server component that checks auth (redirects to login if unauthenticated), calls `GET /api/v1/applications?status=Active,Submitted,InReview&pageSize=1` via React Query on mount, conditionally renders `ExistingApplicationBanner` (if active app exists) or `WizardShell` — per plan.md Source Code tree and research.md D-007
- [X] T021 [P] [US1] Create `frontend/src/components/domain/application/wizard/WizardShell.tsx`: root wizard container; reads `currentStep` and `completedSteps` from Zustand store; renders `WizardProgressBar`, the active step component (conditionally, one at a time), and `WizardNavButtons`; implements `goNext()` and `goBack()` via `useApplicationWizard` hook — per plan.md and research.md D-005
- [X] T022 [P] [US1] Create `frontend/src/components/domain/application/wizard/WizardProgressBar.tsx`: renders 5 step items as a horizontal stepper; completed steps show a check icon (Lucide `CheckCircle2`) and are clickable (call `goTo(step)`); current step is highlighted with `primary-500` color; upcoming steps are muted; directional icons respect RTL with `rtl:scale-x-[-1]`; uses `useTranslations('wizard')` for step labels — per spec.md US5
- [X] T023 [P] [US1] Create `frontend/src/components/domain/application/wizard/WizardNavButtons.tsx`: renders Back / Next / Submit buttons; Back hidden on Step 1; Submit replaces Next on Step 5; buttons disabled during loading states; uses `cn()` for conditional classes; translations from `wizard.nav.*` — per spec.md US6
- [X] T024 [US1] Create `frontend/src/hooks/useApplicationWizard.ts`: facade hook exposing `{ currentStep, completedSteps, goTo, goNext, goBack, submit, isSubmitting }`; `goNext` validates current step via React Hook Form trigger, writes step data to Zustand store on success, calls `markCompleted`, advances `currentStep`; `submit` calls `submitApplication(id)` mutation, clears sessionStorage, redirects to `/[locale]/applicant/applications/{id}` on success — per research.md D-005
- [X] T025 [P] [US1] Create `frontend/src/components/domain/application/wizard/shared/ServiceCard.tsx`: clickable card component for Step 1; props: `type: ServiceType`, `titleKey`, `descriptionKey`, `icon`, `selected: boolean`, `onClick`; uses Lucide icon; green border + bg highlight when selected; full RTL/LTR + dark/light support via Tailwind logical properties — per spec.md FR-002
- [X] T026 [US1] Create `frontend/src/components/domain/application/wizard/steps/Step1ServiceSelection.tsx`: renders 8 `ServiceCard` components in a responsive grid (2 cols mobile, 4 cols desktop); uses `useForm` with `step1Schema`; initializes from `wizardStore.step1`; on unmount cleanup writes form values to `setStep1()`; "New License Issuance" card is the primary MVP path — per spec.md FR-002 and research.md D-005
- [X] T027 [P] [US1] Create `frontend/src/components/domain/application/wizard/shared/CategoryCard.tsx`: clickable card for Step 2; props: `option: LicenseCategoryOption`, `selected: boolean`, `disabled: boolean`, `disabledReason?: string`, `onClick`; disabled state shows lock icon + tooltip with age requirement message; uses translation keys for category names — per spec.md US2
- [X] T028 [US1] Create `frontend/src/components/domain/application/wizard/steps/Step2LicenseCategory.tsx`: renders 6 `CategoryCard` components in a responsive grid (2 cols mobile, 3 cols desktop); fetches `getLicenseCategories()` via React Query (key: `wizardQueryKeys.licenseCategories`, `staleTime: 5min`); builds `minAgeMap` from response; derives applicant age from `wizardStore.step3.dateOfBirth` (or profile); uses `createStep2Schema(dob, minAgeMap)` with `useForm`; initializes from `wizardStore.step2`; on unmount writes to `setStep2()` — per spec.md FR-003 and research.md D-003
- [X] T029 [US1] Create `frontend/src/components/domain/application/wizard/steps/Step3PersonalInfo.tsx`: renders 9 RHF-controlled fields (`nationalId`, `dateOfBirth`, `nationality` dropdown, `gender` radio, `mobileNumber`, `email`, `address`, `city`, `region` dropdown); fetches nationalities and regions via React Query; shows skeleton loaders while loading; uses `step3Schema` with `useForm({ mode: 'onBlur' })`; inline errors per field; initializes from `wizardStore.step3`; on unmount writes to `setStep3()` — per spec.md FR-004
- [X] T030 [US1] Create `frontend/src/components/domain/application/wizard/steps/Step4ApplicationDetails.tsx`: renders 5 RHF-controlled fields (`applicantType` radio, `preferredCenterId` dropdown from `getExamCenters()`, `testLanguage` toggle, `appointmentPreference` radio group, `specialNeedsDeclaration` checkbox + conditional `specialNeedsNote` textarea); uses `step4Schema`; initializes from `wizardStore.step4`; on unmount writes to `setStep4()` — per spec.md FR-005
- [X] T031 [P] [US1] Create `frontend/src/components/domain/application/wizard/shared/StepSection.tsx`: read-only section wrapper for Step 5 review; props: `titleKey`, `onEdit: () => void`, `children`; renders an "Edit" link button that calls `onEdit`; used by Step 5 for each of the 4 data sections — per spec.md US7
- [X] T032 [US1] Create `frontend/src/components/domain/application/wizard/steps/Step5ReviewSubmit.tsx`: renders 4 `StepSection` blocks showing read-only summaries of Steps 1–4 data from Zustand store; each section's "Edit" onClick calls `goTo(stepN)`; renders declaration checkbox wired to `step5Schema`; Submit button disabled until checkbox checked; on submit calls `useApplicationWizard.submit()` with loading spinner; shows error alert on `400`/`409` responses — per spec.md US7 and FR-006
- [X] T033 [US1] Unit test `frontend/src/lib/validations/step1Schema.ts`: verify valid `serviceType` passes, missing value fails with correct error key — in `frontend/src/__tests__/validations/step1Schema.test.ts`
- [X] T034 [P] [US1] Unit test `frontend/src/lib/validations/step2Schema.ts`: verify age-valid category passes, age-invalid category fails with parameterized error; verify edge cases (exactly minimum age passes) — in `frontend/src/__tests__/validations/step2Schema.test.ts`
- [X] T035 [P] [US1] Unit test `frontend/src/lib/validations/step3Schema.ts`: verify valid 9-field payload passes; verify each required field individually triggers correct error key — in `frontend/src/__tests__/validations/step3Schema.test.ts`
- [X] T036 [P] [US1] Unit test `frontend/src/lib/validations/step4Schema.ts`: verify `specialNeedsNote` required when `specialNeedsDeclaration=true`; verify optional note allowed when `specialNeedsDeclaration=false` — in `frontend/src/__tests__/validations/step4Schema.test.ts`
- [X] T037 [P] [US1] Unit test `frontend/src/stores/wizard-store.ts`: verify initial state, `setStep1` updates store, `goTo` changes step, `markCompleted` adds to `completedSteps`, `resetWizard` clears all — in `frontend/src/__tests__/stores/wizard-store.test.ts`

**Checkpoint**: All 5 wizard steps render, validate, and submit. The core application creation flow is end-to-end functional.

---

## Phase 4: User Story 2 — Age Validation Blocks Ineligible Category (Priority: P1)

**Goal**: A 17-year-old applicant attempting to select Category B sees an inline error and cannot advance.

**Independent Test**: Sign in as a user with DOB making them 17 years old. Navigate to Step 2. Click Category B. Verify inline error appears and Next button is disabled. Select Category A. Verify error clears and Next is enabled.

> **Note**: Core age validation logic is already in `Step2LicenseCategory.tsx` (T028) and `step2Schema.ts` (T010). This phase adds the visual treatment for disabled categories.

### Implementation for User Story 2

- [X] T038 [US2] Polish `frontend/src/components/domain/application/wizard/shared/CategoryCard.tsx` (T027): implement disabled visual state — greyed-out card, lock icon overlay (`Lucide Lock`), tooltip showing "Minimum age: X years" (using `wizard.step2.categoryN.ageNote` translation key with `{{minAge}}` param); disabled cards must not be keyboard-focusable (add `aria-disabled="true"` and `tabIndex={-1}`) — per spec.md US2
- [X] T039 [US2] Update `frontend/src/components/domain/application/wizard/steps/Step2LicenseCategory.tsx` (T028): compute `disabledCategories` set from `minAgeMap` + `applicantAge`; pass `disabled={disabledCategories.has(code)}` and `disabledReason` to each `CategoryCard`; show a global info banner at top of step when any categories are disabled (e.g., "X categories unavailable for your age") — per spec.md US2 acceptance scenarios
- [X] T040 [US2] Component test for `CategoryCard.tsx`: verify disabled state renders lock icon, verify click handler not called when disabled, verify `aria-disabled` attribute present — in `frontend/src/__tests__/components/CategoryCard.test.tsx`
- [X] T041 [P] [US2] Component test for `Step2LicenseCategory.tsx` with mocked `getLicenseCategories` returning minAges (mock 17-year-old user): verify Categories B–F are disabled, Category A is enabled, selecting A clears any error — in `frontend/src/__tests__/components/Step2LicenseCategory.test.tsx`

**Checkpoint**: Age validation fully functional with accessible disabled states.

---

## Phase 5: User Story 3 — Auto-Save Draft & Resume (Priority: P2)

**Goal**: Wizard auto-saves to backend every 30 seconds with hash-diff detection; returning users resume from saved draft.

**Independent Test**: Complete Steps 1–3, wait 30 seconds, verify network request `PATCH /api/v1/applications/{id}` fired. Close tab, reopen, navigate to wizard — verify data pre-populated at last step.

### Implementation for User Story 3

- [X] T042 [US3] Create `frontend/src/hooks/useWizardAutoSave.ts`: implement `setInterval(30_000)` auto-save; compute `stateHash` as `JSON.stringify({step1,step2,step3,step4})` and compare to `lastSavedHash` ref; if diff detected AND `applicationId` exists, call `updateDraftApplication(id, mergedStepData)`; update `setLastSavedAt` on success; call `incrementSaveFailures` on error and `resetSaveFailures` on success; cancel interval on unmount — per research.md D-004
- [X] T043 [US3] Wire `useWizardAutoSave` into `WizardShell.tsx` (T021): call the hook with current store state; ensure auto-save starts after `applicationId` is set (after Step 1 Next triggers `POST /api/v1/applications`)
- [X] T044 [P] [US3] Create `frontend/src/components/domain/application/wizard/shared/AutoSaveIndicator.tsx`: reads `lastSavedAt` and `consecutiveSaveFailures` from Zustand store; shows "Saving…" spinner during in-flight save (new `isSaving` flag in store); shows "Saved at HH:MM" (formatted per locale) when `consecutiveSaveFailures === 0`; shows non-blocking yellow warning banner "Could not auto-save. Changes will be saved when you click Next." when `consecutiveSaveFailures >= 3` — per research.md D-004 and spec.md edge cases
- [X] T045 [US3] Add `isSaving: boolean` and `setSaving: (v: boolean) => void` to `wizard-store.ts` (T008) and update `useWizardAutoSave` to toggle it during in-flight saves; update `WizardShell.tsx` to render `AutoSaveIndicator` in the wizard header
- [X] T046 [US3] Handle draft resume in `frontend/src/app/[locale]/(applicant)/applications/new/page.tsx` (T020): after `GET /api/v1/applications?status=Draft&pageSize=1` returns an item, hydrate Zustand store from the API response (call `setApplicationId`, `setStep1`, `setStep2`, `setStep3`, `setStep4`, `goTo(lastStep)`) discarding any stale sessionStorage state; show "Resuming your saved application…" indicator during hydration
- [X] T047 [US3] Add browser-leave confirmation in `WizardShell.tsx` (T021): add `beforeunload` event listener via `useEffect`; show browser dialog "Changes you made may not be saved" when `consecutiveSaveFailures > 0` or when time since `lastSavedAt` > 30 seconds; remove listener on wizard unmount or successful submission — per spec.md edge cases
- [X] T048 [P] [US3] Unit test `useWizardAutoSave.ts`: mock `updateDraftApplication`; verify interval fires every 30s; verify no API call when hash unchanged; verify `consecutiveSaveFailures` increments on error; verify `resetSaveFailures` called on success — in `frontend/src/__tests__/hooks/useWizardAutoSave.test.ts` using `jest.useFakeTimers()`

**Checkpoint**: Auto-save fires silently every 30 seconds; returning users resume seamlessly.

---

## Phase 6: User Story 4 — Bilingual RTL/LTR Layout (Priority: P2)

**Goal**: All 5 wizard steps render perfectly in Arabic RTL and English LTR with no layout or text regressions.

**Independent Test**: Switch locale to `ar`, complete all 5 steps — no hardcoded English text visible, all directional icons are flipped, progress bar reads right-to-left, Back/Next swap sides correctly.

### Implementation for User Story 6

> **Note**: RTL/LTR is a cross-cutting concern implemented alongside every component. This phase captures the verification and any remaining RTL-specific fixes after other phases are delivered.

- [X] T049 [US4] RTL audit of all wizard components (T021–T032, T038–T039, T044): verify each component uses only logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`) and no physical properties (`ml-`, `mr-`, `text-left`, `text-right`); fix any violations — per constitution §IV
- [X] T050 [P] [US4] RTL audit of icon directionality in `WizardProgressBar.tsx` (T022): chevrons / arrow icons separating steps must flip in RTL (add `rtl:rotate-180` or `rtl:scale-x-[-1]` to direction-indicating icons); universal icons (check, lock) must NOT flip — per AGENTS.md RTL rules
- [X] T051 [P] [US4] RTL audit of `WizardNavButtons.tsx` (T023): in RTL mode, Back button appears on the right (logical `end`) and Next/Submit on the left (logical `start`) — implemented via `flex-row-reverse` or Tailwind `rtl:flex-row-reverse`; verify tab order remains logical
- [X] T052 [US4] Verify all `next-intl` keys are wired: grep wizard components for any hardcoded Arabic or English display strings not behind `useTranslations('wizard')` and replace with translation keys — convention: `wizard.*` namespace only
- [X] T053 [P] [US4] Component test for `WizardProgressBar.tsx` RTL rendering: render with `dir="rtl"`, verify step order is visually reversed (Step 5 leftmost), verify completed step click still calls correct `goTo(step)` — in `frontend/src/__tests__/components/WizardProgressBar.test.tsx`

**Checkpoint**: Full bilingual support verified — zero hardcoded strings, correct RTL layout in all steps.

---

## Phase 7: User Story 5 — Step Navigation & Progress Indicator (Priority: P2)

**Goal**: Progress bar shows correct states; clicking a completed step returns to it without losing later data; clicking a future step does nothing.

**Independent Test**: Complete Steps 1–3, click Step 1 in progress bar, edit service, click Next twice back to Step 3, verify Step 3 data still intact.

> **Note**: Core navigation logic is implemented in T021 (WizardShell) and T022 (WizardProgressBar). This phase adds verification and any remaining back-navigation data-preservation polish.

### Implementation for User Story 5

- [X] T054 [US5] Verify data-preservation in `WizardShell.tsx` (T021): confirm that on `goTo(earlierStep)`, the current step's form cleanup writes to Zustand before unmount; confirm that when returning to a later step it re-mounts with `defaultValues` from Zustand store (not empty). Write an integration test if not already covered by T041 — in `frontend/src/__tests__/components/WizardShell.test.tsx`
- [X] T055 [P] [US5] Verify future-step click is no-op in `WizardProgressBar.tsx` (T022): step items for steps not in `completedSteps` and not `currentStep` must have `pointer-events-none cursor-not-allowed` and no `onClick` registered; add `aria-disabled="true"` for accessible enforcement — per spec.md US5 acceptance scenario 3
- [X] T056 [P] [US5] Add Framer Motion `AnimatePresence` step transitions to `WizardShell.tsx`: wrap each step component in a `motion.div` with slide-in/slide-out variants; use a `direction` ref (+1 forward, -1 backward) updated in `goNext`/`goBack`; invert `x` offset for RTL (`const multiplier = isRTL ? -1 : 1`) — per research.md D-006; animation duration ≤ 200 ms

**Checkpoint**: Progress indicator and back-navigation fully polished; transitions feel native.

---

## Phase 8: User Story 6 — Per-Step Validation Blocks Advancement (Priority: P1)

**Goal**: Clicking "Next" with invalid data shows per-field inline errors and prevents advancement; valid data allows next step.

**Independent Test**: On Step 3, leave National ID empty, click Next — error appears under National ID, wizard stays on Step 3. Fill all fields, click Next — wizard advances to Step 4.

> **Note**: Validation is wired via React Hook Form in each Step component (T026–T030). This phase adds explicit error-focus behavior and visual polish.

### Implementation for User Story 6

- [X] T057 [US6] In `useApplicationWizard.ts` (T024) `goNext()` implementation: after `trigger()` returns false, call `setFocus()` on the first invalid field (React Hook Form's `setFocus` API); scroll the field into view on mobile — per spec.md US6 acceptance scenario 1
- [X] T058 [P] [US6] Verify `mode: 'onBlur'` is set on all `useForm` calls in Steps 3 and 4 so inline errors appear immediately on field blur without requiring a Next click — per spec.md US6 acceptance scenario 3
- [X] T059 [P] [US6] Component test `Step3PersonalInfo.tsx`: render component, click Next without filling required fields, verify error messages appear under each required field; fill all required fields, click Next, verify no errors and `goNext` called — in `frontend/src/__tests__/components/Step3PersonalInfo.test.tsx`
- [X] T060 [P] [US6] Component test `Step5ReviewSubmit.tsx`: render with all steps completed; verify Submit button disabled when declaration unchecked; check declaration checkbox, verify Submit enabled; click Submit, verify loading spinner appears — in `frontend/src/__tests__/components/Step5ReviewSubmit.test.tsx`

**Checkpoint**: No invalid data can silently advance through the wizard.

---

## Phase 9: User Story 7 — Review & Submit Step (Priority: P1)

**Goal**: Step 5 shows accurate read-only summary of all 4 earlier steps; Edit links navigate back; Submit creates a Submitted application.

**Independent Test**: Complete Steps 1–4, reach Step 5, click "Edit" next to Step 2, change category, click Next back to Step 5 — verify updated category appears in the summary. Check declaration, Submit — verify redirect to application detail page.

> **Note**: `Step5ReviewSubmit.tsx` (T032) covers the core implementation. This phase adds service mutation, success/error handling, and redirect.

### Implementation for User Story 7

- [X] T061 [US7] In `useApplicationWizard.ts` (T024) `submit()` implementation: use React Query `useMutation` to call `submitApplication(applicationId)`; on success: call `resetWizard()`, clear sessionStorage key `mojaz-wizard-draft`, show `toast.success(t('wizard.submit.success'))`, push router to `/[locale]/applicant/applications/${id}`; on `400` error: call `goTo(1)` and display server error messages above Step 1; on `409` conflict: show error alert with link to existing application — per spec.md US7 and contracts/api.md §4
- [X] T062 [P] [US7] Add `ExistingApplicationBanner` component `frontend/src/components/domain/application/wizard/shared/ExistingApplicationBanner.tsx`: shown when `GET /api/v1/applications` returns an active non-draft application; displays application number, status badge, and a "View Application" link button; uses translation keys `wizard.existingApp.*` — per research.md D-007
- [X] T063 [P] [US7] Component test `Step5ReviewSubmit.tsx`: mock Zustand store with all 4 steps filled; verify each `StepSection` renders the correct field values; verify Edit button for Step 2 triggers `goTo(2)`; mock successful submit mutation, verify redirect triggered — in `frontend/src/__tests__/components/Step5ReviewSubmit.test.tsx`

**Checkpoint**: Full end-to-end wizard flow tested and working — Draft created, auto-saved, submitted, redirected.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Responsive design, accessibility, E2E tests, and final quality gates.

- [X] T064 Responsive audit: test all 5 step components at 320 px, 375 px, 768 px, 1024 px, and 1440 px viewport widths; fix any overflow, truncation, or layout collapse issues — per spec.md SC-004
- [X] T065 [P] Accessibility audit: verify all form fields have associated `<label>` elements (or `aria-label`); verify all error messages are announced via `aria-describedby` linking field to error span; verify `role="alert"` on validation error containers; verify keyboard tab order is logical in both LTR and RTL — per spec.md SC-008
- [X] T066 [P] Dark mode audit: toggle dark mode in all 5 steps; verify card backgrounds, text, borders, inputs, and buttons are correctly themed via Tailwind `dark:` variants; fix any missing dark states
- [X] T067 [P] Loading skeleton audit: verify `Step2LicenseCategory`, `Step3PersonalInfo` (nationalities/regions), and `Step4ApplicationDetails` (exam centers) all show `shadcn/ui Skeleton` components while their React Query data is loading — replace any blank states
- [X] T068 [P] Retry button: wherever a lookup API call fails (categories, centers, regions), show a "Retry" button (not just an error message) that calls `refetch()` from the React Query result — per spec.md edge cases
- [X] T069 Playwright E2E test — happy path: navigate to `/ar/applicant/applications/new` as Applicant role user; complete all 5 steps with valid Category B data; submit; assert redirect and status "Submitted" — in `e2e/tests/wizard/happy-path.spec.ts`
- [X] T070 [P] Playwright E2E test — age validation: navigate to `/en/applicant/applications/new` as a 17-year-old applicant; reach Step 2; assert Categories B–F are disabled; select Category A; assert Next is enabled — in `e2e/tests/wizard/age-validation.spec.ts`
- [X] T071 [P] Playwright E2E test — auto-save resume: complete 3 steps, wait 31 seconds, reload page, assert wizard resumes at Step 3 with data intact — in `e2e/tests/wizard/auto-save-resume.spec.ts`
- [/] T072 Bundle size check: run `next build` and check output; the `new` page route should add no more than 50 KB gzipped above the existing applicant dashboard route (lazy-loaded step components via `dynamic()` if needed)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all other phases**
- **Phase 3 (US1 — Submission)**: Depends on Phase 2 — primary P1 story
- **Phase 4 (US2 — Age Validation)**: Depends on T028 (Step2 component from Phase 3) — run after Phase 3
- **Phase 5 (US3 — Auto-Save)**: Depends on Phase 3 (needs `applicationId` flow from POST) — run after Phase 3
- **Phase 6 (US4 — Bilingual)**: Depends on all step components (T026–T032) from Phase 3 — run after Phase 3
- **Phase 7 (US5 — Navigation)**: Depends on T021, T022 from Phase 3 — run after Phase 3
- **Phase 8 (US6 — Validation)**: Depends on step components from Phase 3 — run after Phase 3
- **Phase 9 (US7 — Review)**: Depends on T032 from Phase 3 — run after Phase 3
- **Polish (Phase 10)**: Depends on Phases 3–9 complete

### User Story Dependencies

- **US1 (P1)** — After Phase 2 only. No US dependencies.
- **US2 (P1)** — After US1 (Step2 component). Can overlap with US3 start.
- **US6 (P1)** — After US1 (step components). Can run in parallel with US2.
- **US7 (P1)** — After US1 (Step5 component). Can run alongside US2.
- **US3 (P2)** — After US1 (`applicationId` flow established).
- **US4 (P2)** — After US1 (all step components exist).
- **US5 (P2)** — After US1 (WizardShell and ProgressBar exist).

### Task-Level Dependencies (Critical Path)

```
T001–T006 (Setup)
  → T007–T019 (Foundational)
    → T020–T032 (US1 core components) + T033–T037 (US1 tests)
      → T038–T041 (US2: age disabled states)
      → T042–T048 (US3: auto-save)
      → T049–T053 (US4: RTL audit)
      → T054–T056 (US5: nav polish)
      → T057–T060 (US6: validation UX)
      → T061–T063 (US7: submit flow)
        → T064–T072 (Polish)
```

---

## Parallel Opportunities

### Within Phase 2 (Foundational)

```
Can run in parallel:
  T008 (wizard-store)           ← independent file
  T009 (step1Schema)            ← independent file
  T010 (step2Schema)            ← independent file
  T011 (step3Schema)            ← independent file
  T012 (step4Schema)            ← independent file
  T013 (step5Schema)            ← independent file
  T014 (calculateAge utility)   ← independent function
  T016 (lookup service)         ← independent functions
  T017 (query key constants)    ← independent file
  T018 (EN translations)        ← independent file
  T019 (AR translations)        ← independent file
Sequential: T007 before T008–T013 (types must be defined first)
```

### Within Phase 3 (US1)

```
Can run in parallel (all different files):
  T021 (WizardShell)      T022 (WizardProgressBar)
  T023 (WizardNavButtons)  T025 (ServiceCard)
  T027 (CategoryCard)      T031 (StepSection)
  T033–T037 (unit tests)

Sequential:
  T028 (Step2) → needs CategoryCard (T027)
  T029 (Step3) → needs Step3Schema (T011)
  T030 (Step4) → needs Step4Schema (T012)
  T032 (Step5) → needs StepSection (T031) + T031
  T024 (useApplicationWizard) → wire after T021
```

---

## Implementation Strategy

### MVP Scope (P1 User Stories Only — Phases 1–3 + Phase 8 + Phase 9)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational) — all can run in parallel
3. Complete Phase 3 (US1 — Full Submission) — core wizard
4. Complete Phase 8 (US6 — Validation UX) — runs alongside Phase 3
5. Complete Phase 9 (US7 — Review + Submit) — extends Phase 3
6. **STOP and VALIDATE**: A user can now fully submit a wizard application end-to-end
7. Demo/test before adding P2 stories

### Incremental Delivery

1. **MVP**: Phases 1–3 + 8 + 9 → working wizard, submittable
2. **+Auto-Save**: Phase 5 → draft recovery works
3. **+Age Validation Polish**: Phase 4 → ineligible categories visually blocked
4. **+RTL polish**: Phase 6 → full bilingual QA pass
5. **+Nav Polish + Animations**: Phase 7 → premium UX
6. **+E2E + Final Polish**: Phase 10 → production-ready

### Parallel Team Strategy (2 developers)

**After Phase 2 completes:**
- Developer A: T020, T021, T023, T024, T025, T026 (shell + Step 1)
- Developer B: T027, T028, T029, T030, T031, T032 (steps 2–5)

---

## Notes

- All `[P]` tasks touch different files — no conflicts
- Each step component follows the same pattern: `useForm` → Zustand init → Zod schema → field render → unmount write
- On every PR: include screenshots of both `ar` (RTL Dark) and `en` (LTR Light) renders at minimum
- Commit after each logical group (e.g., after all Foundational tasks, after each step component)
- Never use `console.log` with form values — National ID and DOB are sensitive per constitution §II
- Run `next build` (T072) before marking feature complete to catch bundle regressions
