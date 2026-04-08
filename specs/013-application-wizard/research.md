# Research: Multi-Step Application Wizard

**Feature**: `013-application-wizard` | **Phase**: 0 | **Date**: 2026-04-08

---

## Decision Log

### D-001: Wizard State Management Strategy

**Decision**: Zustand 5 store with `persist` middleware backed by `sessionStorage`.

**Rationale**:
- The PRD and spec explicitly mandate Zustand for client state.
- `sessionStorage` (vs `localStorage`) is preferred because the wizard session should not bleed across browser sessions — if an applicant returns in a new browser session they should be offered to resume only from backend-fetched draft state (which survives server-side), not stale local form data from a previous device.
- `sessionStorage` auto-clears on tab close, reducing the risk of stale partially-filled data confusing returning applicants.
- On page load, the wizard checks `GET /api/v1/applications?status=Draft&pageSize=1` via React Query; if a draft exists, it hydrates the store from the API response, discarding the sessionStorage state so the server is the source of truth for persistence.

**Alternatives considered**:
- `localStorage` — rejected because data persists across sessions/devices and could mislead users.
- URL state (search params) — rejected because wizard data (National ID, mobile) must not appear in browser history or URL bar.
- React Context — rejected; causes full subtree re-renders on every field change, which is expensive for a 9-field personal info step.

---

### D-002: Form Validation Strategy

**Decision**: React Hook Form 7 with per-step Zod schemas. Each step registers its own `useForm` with its step-specific Zod schema. On "Next" click, `handleSubmit` triggers schema validation; on success the step data is written to the Zustand store and the wizard advances.

**Rationale**:
- React Hook Form minimizes re-renders via uncontrolled inputs — ideal for a 9-field personal info step.
- Per-step schemas (not one monolithic schema) allow clean progressive validation. The user is never told Step 4 has errors while they are on Step 2.
- Zod provides TypeScript-first type inference: the validated form values are typed automatically, eliminating manual type assertions.
- The Zustand store holds the aggregated state across steps; each form initializes from the store's current values on mount (enabling back-navigation data restoration).

**Alternatives considered**:
- Single monolithic Zod schema with `superRefine` for cross-step rules — rejected because it requires all steps to be mounted simultaneously, which conflicts with the per-step render approach.
- Formik — rejected; heavier and slower than React Hook Form; the Mojaz tech stack already specifies RHF.

---

### D-003: Age Validation Placement (Client-Side vs Server-Side)

**Decision**: Client-side validation on Step 2 (instant UX feedback) **plus** server-side validation in Feature 012 ApplicationService (source of truth). For client-side, minimum ages are fetched from `GET /api/v1/license-categories` which embeds `minAge` per category (sourced from `SystemSettings` on the backend — not hardcoded frontend constants).

**Rationale**:
- Client validation must not be the only gate (security requirement per constitution §II).
- Fetching `minAge` dynamically means a policy change in `SystemSettings` propagates to the wizard without a frontend deploy.
- React Query caches the category list with `staleTime: 5 * 60 * 1000` (5 min) so the lookup doesn't fire on every step visit.

**Alternatives considered**:
- Hardcode minimum ages in `constants.ts` — rejected per constitution Principle III (Configuration over Hardcoding).
- Server-round-trip on every category click — rejected as too slow; client-side check is an optimistic UX gate backed by server enforcement at submission.

---

### D-004: Auto-Save Implementation

**Decision**: A custom `useWizardAutoSave` hook runs a `setInterval` at 30-second cadence. The hook compares `store.lastSavedHash` (a fast JSON hash of current store state) against the state at last save. If a diff is detected, it fires `PATCH /api/v1/applications/{id}`. A ref tracks the in-flight request to prevent overlapping saves.

**Rationale**:
- Interval-based polling is the simplest correct approach for 30-second auto-save; debouncing on every keystroke would be too aggressive (the user might not pause for 30 seconds).
- The hash comparison avoids unnecessary API calls when the user is idle.
- The hook exposes `lastSavedAt` (timestamp) to `AutoSaveIndicator.tsx` via the Zustand store, so the UI shows "Last saved at 9:14 PM" without the hook needing to interact with any component.
- Three consecutive failures → a non-blocking warning banner is shown (FR-008 edge case).

**Alternatives considered**:
- `useDebounce` on Zustand state changes — would fire after every field change blur, potentially generating 50+ API calls during the Personal Info step. Rejected.
- Silent auto-save without any indicator — rejected for UX trust; applicants need to know their progress is saved.

---

### D-005: Step Navigation & Progress Bar

**Decision**: The `WizardShell` owns a `currentStep` (integer 1–5) and `completedSteps` (Set<number>) state from the Zustand store. `WizardProgressBar` renders 5 step items; clicking a completed step calls `goTo(step)` which updates `currentStep` in the store. Each step component is conditionally rendered (not mounted/unmounted) using `display: none` toggling to preserve React Hook Form internal state across back-navigation.

**Wait — design revision**: Conditionally rendering (keeping all steps mounted with `display:none`) would cause all form fields to register simultaneously, which conflicts with per-step validation. **Revised decision**: Each step IS unmounted when not active. On unmount, the step's `useEffect` cleanup writes current form values to the Zustand store. On re-mount, the step form initializes from the Zustand store. This gives clean per-step form isolation while preserving data.

**Rationale**:
- The unmount + store write pattern is the cleanest separation of form state and persistent wizard state.
- The Zustand store acts as the "handoff" layer between step unmounts and re-mounts.
- Framer Motion `AnimatePresence` can animate the step transitions (slide left/right based on direction) using this mount/unmount lifecycle.

**Alternatives considered**:
- `display:none` toggling (all steps always mounted) — rejected because React Hook Form registers all fields simultaneously which breaks per-step `handleSubmit` scope.
- URL-based step state (`?step=3`) — rejected because the spec requires state to survive Step 5 "Edit" links without URL manipulation causing browser history noise.

---

### D-006: RTL/LTR Step Transition Animation

**Decision**: Framer Motion `AnimatePresence` with `custom` prop carrying the navigation direction (+1 forward, -1 backward). The animation variant shifts `x` by `±100%` pre-enter and `∓100%` post-exit. In RTL mode (`dir="rtl"`), the direction values are inverted so the slide feels natural.

**Rationale**:
- Framer Motion is already in the Mojaz tech stack (AGENTS.md); no new dependency.
- Direction inversion for RTL is a single conditional: `const multiplier = isRTL ? -1 : 1`.

---

### D-007: Existing Application Guard

**Decision**: On wizard page load (`/[locale]/applicant/applications/new`), the page component queries `GET /api/v1/applications?status=Active,Submitted,InReview&pageSize=1` via React Query. If an active application exists, the page renders a full-page `ExistingApplicationBanner` component (not a redirect, to avoid losing scroll position context), which links to the existing application. The wizard form is not rendered in this case.

**Rationale**:
- One active application per applicant is a hard business rule (PRD §9.2 Gate 1).
- A banner rather than a silent redirect gives the applicant context about why they cannot start a new wizard.

---

### D-008: Translation Namespace

**Decision**: All wizard strings live in a dedicated `wizard.json` namespace (`public/locales/ar/wizard.json` and `public/locales/en/wizard.json`). Keys follow `dot.separated.lowercase` convention from the constitution.

**Rationale**:
- Separating the wizard into its own namespace keeps the `ar/*.json` files manageable and avoids namespace collisions with other features (e.g., `application.json` already holds status names from Feature 012).
- `next-intl` supports per-page message loading for performance (wizard namespace only loaded on the wizard route, not every page).

---

## Technology Decisions Summary

| Decision | Chosen Approach |
|----------|----------------|
| Wizard state | Zustand 5 + sessionStorage persist |
| Form validation | React Hook Form 7 + per-step Zod schemas |
| Age validation source | Backend lookup (`/api/v1/license-categories`.`minAge`) |
| Auto-save mechanism | `setInterval` 30s + hash diff + PATCH API |
| Step isolation | Mount/unmount + Zustand store handoff |
| RTL step animation | Framer Motion `AnimatePresence` with direction inversion |
| Existing app guard | Query on load + banner UI (no silent redirect) |
| i18n namespace | `wizard.json` (dedicated, lazy-loaded per route) |
