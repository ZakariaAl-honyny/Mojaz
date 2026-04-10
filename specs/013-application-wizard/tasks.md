# Tasks: Multi-Step Application Wizard

**Input**: Design documents from `/specs/013-application-wizard/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/api.md ✅ quickstart.md ✅
**Feature Branch**: `013-application-wizard`

## Phase 1: Setup
**Purpose**: Create all new files and directories needed by the wizard feature.

- [X] T001 Create directory `frontend/src/components/domain/application/wizard/steps/` and `wizard/shared/`
- [X] T002 [P] Create directory `frontend/src/hooks/`
- [X] T003 [P] Create directory `frontend/src/lib/validations/`
- [X] T004 [P] Create directory `frontend/src/types/`
- [X] T005 [P] Create empty `frontend/public/locales/ar/wizard.json`
- [X] T006 [P] Create empty `frontend/public/locales/en/wizard.json`

---

## Phase 2: Tests
**Purpose**: TDD - write tests for schemas, store, and components

- [ ] T007 [US1] Unit test `frontend/src/lib/validations/step1Schema.ts`
- [ ] T008 [P] [US1] Unit test `frontend/src/lib/validations/step2Schema.ts`
- [ ] T009 [P] [US1] Unit test `frontend/src/lib/validations/step3Schema.ts`
- [ ] T010 [P] [US1] Unit test `frontend/src/lib/validations/step4Schema.ts`
- [ ] T011 [P] [US1] Unit test `frontend/src/stores/wizard-store.ts`
- [ ] T012 [US2] Component test for `CategoryCard.tsx`
- [ ] T013 [P] [US2] Component test for `Step2LicenseCategory.tsx`
- [ ] T014 [P] [US3] Unit test `useWizardAutoSave.ts`
- [ ] T015 [P] [US4] Component test for `WizardProgressBar.tsx` RTL rendering
- [ ] T016 [US6] Component test `Step3PersonalInfo.tsx` validation
- [ ] T017 [P] [US6] Component test `Step5ReviewSubmit.tsx` submission logic
- [ ] T018 [P] [US7] Component test `Step5ReviewSubmit.tsx` summary and edit links

---

## Phase 3: Core
**Purpose**: Implement Domain, Application, Infrastructure, API, and UI

- [X] T019 Define TypeScript types and enums in `frontend/src/types/wizard.types.ts`
- [X] T020 [P] Create Zustand store `frontend/src/stores/wizard-store.ts`
- [X] T021 [P] Create Zod schema `frontend/src/lib/validations/step1Schema.ts`
- [X] T022 [P] Create Zod schema `frontend/src/lib/validations/step2Schema.ts`
- [X] T023 [P] Create Zod schema `frontend/src/lib/validations/step3Schema.ts`
- [X] T024 [P] Create Zod schema `frontend/src/lib/validations/step4Schema.ts`
- [X] T025 [P] Create Zod schema `frontend/src/lib/validations/step5Schema.ts`
- [X] T026 [P] Add `calculateAge` utility to `frontend/src/lib/utils.ts`
- [X] T027 Extend `frontend/src/services/application.service.ts` with wizard-specific functions
- [X] T028 [P] Add lookup service functions to `frontend/src/services/application.service.ts`
- [X] T029 [P] Define React Query key constants in `frontend/src/lib/constants.ts`
- [X] T030 Populate `frontend/public/locales/en/wizard.json`
- [X] T031 Populate `frontend/public/locales/ar/wizard.json`
- [X] T032 [US1] Create `frontend/src/app/[locale]/(applicant)/applications/new/page.tsx`
- [X] T033 [P] [US1] Create `frontend/src/components/domain/application/wizard/WizardShell.tsx`
- [X] T034 [P] [US1] Create `frontend/src/components/domain/application/wizard/WizardProgressBar.tsx`
- [X] T035 [P] [US1] Create `frontend/src/components/domain/application/wizard/WizardNavButtons.tsx`
- [X] T036 [US1] Create `frontend/src/hooks/useApplicationWizard.ts`
- [X] T037 [P] [US1] Create `frontend/src/components/domain/application/wizard/shared/ServiceCard.tsx`
- [X] T038 [US1] Create `frontend/src/components/domain/application/wizard/steps/Step1ServiceSelection.tsx`
- [X] T039 [P] [US1] Create `frontend/src/components/domain/application/wizard/shared/CategoryCard.tsx`
- [X] T040 [US1] Create `frontend/src/components/domain/application/wizard/steps/Step2LicenseCategory.tsx`
- [X] T041 [US1] Create `frontend/src/components/domain/application/wizard/steps/Step3PersonalInfo.tsx`
- [X] T042 [US1] Create `frontend/src/components/domain/application/wizard/steps/Step4ApplicationDetails.tsx`
- [X] T043 [P] [US1] Create `frontend/src/components/domain/application/wizard/shared/StepSection.tsx`
- [X] T044 [US1] Create `frontend/src/components/domain/application/wizard/steps/Step5ReviewSubmit.tsx`

---

## Phase 4: Integration
**Purpose**: Wire everything together, handle errors, and logging

- [X] T045 [US2] Polish `frontend/src/components/domain/application/wizard/shared/CategoryCard.tsx` for disabled states
- [X] T046 [US2] Update `frontend/src/components/domain/application/wizard/steps/Step2LicenseCategory.tsx` for disabled categories
- [X] T047 [US3] Create `frontend/src/hooks/useWizardAutoSave.ts`
- [X] T048 [US3] Wire `useWizardAutoSave` into `WizardShell.tsx`
- [X] T049 [P] [US3] Create `frontend/src/components/domain/application/wizard/shared/AutoSaveIndicator.tsx`
- [X] T050 [US3] Add `isSaving` state to `wizard-store.ts` and update `WizardShell.tsx`
- [X] T051 [US3] Handle draft resume in `frontend/src/app/[locale]/(applicant)/applications/new/page.tsx`
- [X] T052 [US3] Add browser-leave confirmation in `WizardShell.tsx`
- [X] T053 [US6] In `useApplicationWizard.ts`, implement focus on first invalid field on `goNext`
- [X] T054 [P] [US6] Verify `mode: 'onBlur'` is set on all `useForm` calls in Steps 3 and 4
- [X] T055 [US7] In `useApplicationWizard.ts`, implement `submit()` mutation and redirect
- [X] T056 [P] [US7] Create `frontend/src/components/domain/application/wizard/shared/ExistingApplicationBanner.tsx`

---

## Phase 5: Polish
**Purpose**: i18n translations, RTL support, Dark Mode, and Final Validation

- [X] T057 [US4] RTL audit of all wizard components
- [X] T058 [P] [US4] RTL audit of icon directionality in `WizardProgressBar.tsx`
- [X] T059 [P] [US4] RTL audit of `WizardNavButtons.tsx`
- [X] T060 [US4] Verify all `next-intl` keys are wired
- [X] T061 [US5] Verify data-preservation in `WizardShell.tsx` on back-navigation
- [X] T062 [P] [US5] Verify future-step click is no-op in `WizardProgressBar.tsx`
- [X] T063 [P] [US5] Add Framer Motion `AnimatePresence` step transitions to `WizardShell.tsx`
- [ ] T064 Responsive audit across 320px to 1440px
- [ ] T065 [P] Accessibility audit (WCAG 2.1 AA)
- [ ] T066 [P] Dark mode audit
- [ ] T067 [P] Loading skeleton audit
- [ ] T068 [P] Retry button for lookup API failures
- [ ] T069 Playwright E2E test — happy path
- [ ] T070 [P] Playwright E2E test — age validation
- [ ] T071 [P] Playwright E2E test — auto-save resume
- [ ] T072 Bundle size check
