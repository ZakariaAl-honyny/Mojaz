# Implementation Plan: Multi-Step Application Wizard

**Branch**: `013-application-wizard` | **Date**: 2026-04-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/013-application-wizard/spec.md`

---

## Summary

Feature 013 delivers the citizen-facing 5-step application wizard — the primary UI entry point for creating a new driving license application. It is a **frontend-only** feature that consumes the Application CRUD API implemented in Feature 012. The wizard orchestrates step navigation, per-step Zod validation, Zustand state persistence, 30-second auto-save, bilingual RTL/LTR layouts, and a final review + submission step. No new backend code is required beyond what Feature 012 provides.

---

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 15 (App Router)
**Primary Dependencies**: React Hook Form 7, Zod 3, Zustand 5, React Query 5, next-intl 3, next-themes, shadcn/ui, Tailwind CSS 4, Lucide React, Framer Motion 11
**Storage**: No new database tables — reads/writes `Applications` via Feature 012 REST API. Wizard draft state persisted in `sessionStorage` via Zustand persist middleware.
**Testing**: Jest + React Testing Library (unit/component), Playwright (E2E)
**Target Platform**: Web (Next.js 15 App Router, browsers: Chrome/Firefox/Safari/Edge — last 2 versions)
**Project Type**: Frontend Web Application (pure UI feature, no backend changes)
**Performance Goals**: Wizard initial load < 1.5 s; Step transition animation < 200 ms; Auto-save API call completes within 2 s; No Cumulative Layout Shift during step transitions.
**Constraints**: Must support viewports 320 px–1440 px+; RTL and LTR without layout regression; Dark and Light mode; WCAG 2.1 AA; No additional bundle dependency without approval.
**Scale/Scope**: Single multi-step form used by all Applicant-role users as their primary entry point for 8 services.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **Clean Architecture Supremacy**: Not applicable to frontend; the wizard calls only the established `/api/v1/applications` REST surface from Feature 012. No new backend layers introduced.
- ✅ **Security First**: JWT token is attached by the existing Axios interceptor (Feature 006). No sensitive data (national IDs, DOB) logged to console. All inputs validated server-side by Feature 012. File uploads are out of scope for this feature.
- ✅ **Configuration over Hardcoding**: Minimum ages per category are fetched from the backend lookup endpoint (not hardcoded); service card metadata defined in a typed `constants.ts` file, not inline strings. All display text uses `next-intl` translation keys.
- ✅ **Internationalization by Default**: All text via `next-intl`; Tailwind logical properties only (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`); direction-sensitive icons flipped with `rtl:rotate-180`; root `dir`/`lang` set by locale layout (already established in Feature 002).
- ✅ **API Contract Consistency**: The wizard consumes `ApiResponse<T>` responses from Feature 012. No new endpoints defined.
- ✅ **Test Discipline**: Unit tests for Zod schemas and Zustand store; component tests for each wizard step; E2E Playwright test for happy-path submission and age-validation blocking.
- ✅ **Async-First Notifications**: After submission, the backend (Feature 012) triggers notifications asynchronously. The wizard only shows a success toast; it does not block on notification delivery.

*Post-design re-check: All gates still pass. No constitution violations detected.*

---

## Project Structure

### Documentation (this feature)

```text
specs/013-application-wizard/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── api.md           # API surface consumed by the wizard
└── tasks.md             # Created by /speckit.tasks
```

### Source Code (repository root)

```text
frontend/
└── src/
    ├── app/
    │   └── [locale]/
    │       └── (applicant)/
    │           └── applications/
    │               └── new/
    │                   └── page.tsx                    # Wizard route — lazy loads WizardShell
    │
    ├── components/
    │   └── domain/
    │       └── application/
    │           ├── wizard/
    │           │   ├── WizardShell.tsx                 # Root container: progress bar + step router + nav buttons
    │           │   ├── WizardProgressBar.tsx           # Step indicator (completed / current / upcoming)
    │           │   ├── WizardNavButtons.tsx            # Back / Next / Submit buttons
    │           │   ├── steps/
    │           │   │   ├── Step1ServiceSelection.tsx   # 8 service cards
    │           │   │   ├── Step2LicenseCategory.tsx    # 6 category cards + age validation
    │           │   │   ├── Step3PersonalInfo.tsx        # 9-field personal info form
    │           │   │   ├── Step4ApplicationDetails.tsx # 5-field application details form
    │           │   │   └── Step5ReviewSubmit.tsx       # Read-only summary + declaration + submit
    │           │   └── shared/
    │           │       ├── ServiceCard.tsx             # Reusable clickable card (Step 1)
    │           │       ├── CategoryCard.tsx            # Reusable category card with age gate (Step 2)
    │           │       ├── StepSection.tsx             # Section wrapper with edit link (Step 5)
    │           │       └── AutoSaveIndicator.tsx       # Subtle "Last saved at HH:MM" indicator
    │           └── StatusBadge.tsx                     # (already exists from Feature 012)
    │
    ├── hooks/
    │   ├── useWizardAutoSave.ts                        # Encapsulates 30-second interval + debounce logic
    │   └── useApplicationWizard.ts                    # Facade hook: exposes goTo, goBack, goNext, submit
    │
    ├── stores/
    │   └── wizard-store.ts                            # Zustand store with sessionStorage persist
    │
    ├── lib/
    │   └── validations/
    │       ├── step1Schema.ts                         # Zod: service selection
    │       ├── step2Schema.ts                         # Zod: license category + age check
    │       ├── step3Schema.ts                         # Zod: personal info (9 fields)
    │       ├── step4Schema.ts                         # Zod: application details (5 fields)
    │       └── step5Schema.ts                         # Zod: declaration checkbox
    │
    ├── services/
    │   └── application.service.ts                     # (extended from Feature 012) + updateDraft, submitApplication
    │
    ├── types/
    │   └── wizard.types.ts                            # WizardState, StepId, ServiceType, CategoryCard types
    │
    └── public/
        └── locales/
            ├── ar/
            │   └── wizard.json                        # All Arabic wizard strings
            └── en/
                └── wizard.json                        # All English wizard strings
```

**Structure Decision**: Frontend-only (Option 2 pattern — single frontend project). No backend changes. All new files are additive under `frontend/src/`; no existing files deleted.

---

## Complexity Tracking

No constitution violations detected. The Zustand persist middleware is a standard First-party pattern (documented in Project constitution). No additional complexity justified or introduced.
