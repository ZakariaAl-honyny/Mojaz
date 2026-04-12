# Tasks: Frontend Foundation

**Input**: Design documents from `/specs/002-frontend-foundation/`
**Prerequisites**: plan.md ✅ | spec.md ✅
**Branch**: `002-frontend-foundation`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (independent files, no dependency on incomplete task)
- **[US#]**: Which user story this task belongs to
- All paths are relative to repository root

---

## Phase 1: Setup
**Purpose**: Project initialization and core Next.js configuration.

- [X] T001 Initialize Next.js 15 App Router project in `src/frontend/` with TypeScript and Tailwind CSS 4
- [X] T002 [P] Configure strict TypeScript 5 rules in `src/frontend/tsconfig.json`
- [X] T003 [P] Initial configuration of ESLint and Prettier for the frontend project

---

## Phase 2: Tests
**Purpose**: TDD setup and verification.

- [ ] T004 Setup `jest.config.ts`, `playwright.config.ts`, and React Testing Library
- [X] T012 [P] [US1] Unit test language switcher logic in `src/frontend/tests/unit/components/LanguageSwitcher.test.tsx`
- [ ] T029 Run Playwright E2E test verifying language toggle, theme toggle, and public layout display.

---

## Phase 3: Core
**Purpose**: Implement foundational libraries, bilingual system, branding, role-based layouts, and API client.

### Foundational Libraries
- [X] T005 Install and configure `next-intl` in `src/frontend/`
- [X] T006 Install and configure `next-themes`
- [X] T007 Install and configure `zustand`
- [X] T008 Install and configure `@tanstack/react-query`
- [X] T009 Install and configure `axios`
- [X] T010 Install `shadcn/ui` CLI and configure base components: Button, Input, Card, Label
- [X] T011 Create global CSS with Mojaz themes (Primary: #006C35, Secondary: #D4A017) in `src/frontend/src/app/globals.css`

### US1 — Bilingual Platform Access
- [X] T013 [P] [US1] Setup translation dictionaries JSON files in `src/frontend/public/locales/{ar,en}/`
- [X] T014 [US1] Implement next-intl middleware in `src/frontend/src/middleware.ts` for routing `/[locale]`
- [X] T015 [US1] Create RootLayout in `src/frontend/src/app/[locale]/layout.tsx` handling `dir` and `lang` attributes, wrapping providers.
- [X] T016 [US1] Implement `<LanguageSwitcher />` component in `src/frontend/src/components/shared/LanguageSwitcher.tsx`
- [X] T017 [US1] Create custom Bilingual 404 page in `src/frontend/src/app/[locale]/not-found.tsx`

### US2 — Branding & Theming
- [X] T018 [P] [US2] Implement ThemeProvider wrapper in `src/frontend/src/providers/theme-provider.tsx`
- [X] T019 [US2] Implement `<ThemeToggler />` component in `src/frontend/src/components/shared/ThemeToggler.tsx`
- [X] T020 [US2] Configure custom `tailwind.config` to inject distinctive typography (e.g., IBM Plex Arabic/Inter) via CSS variables.
- [X] T021 [US2] Implement global utility classes for high-impact structural composition and refined grain/mesh overlays.
- [X] T022 [US2] Install `framer-motion` and build standard micro-interaction wrapper components (e.g., `<FadeIn />`, `<SlideUp />`).

### US3 — Role-Based Navigation Layouts
- [X] T023 [P] [US3] Create `PublicLayout` in `src/frontend/src/app/[locale]/(public)/layout.tsx`
- [X] T024 [P] [US3] Create `ApplicantLayout` and Sidebar in `src/frontend/src/app/[locale]/(applicant)/layout.tsx`
- [X] T025 [P] [US3] Create `EmployeeLayout` and Sidebar in `src/frontend/src/app/[locale]/(employee)/layout.tsx`
- [X] T026 [P] [US3] Create `AdminLayout` and Sidebar in `src/frontend/src/app/[locale]/(admin)/layout.tsx`

### US4 — Secure API Communication
- [X] T027 [P] [US4] Implement `AuthStore` in `src/frontend/src/stores/auth-store.ts` using `zustand/middleware` persist (localStorage)
- [X] T028 [P] [US4] Create `api.types.ts` in `src/frontend/src/types/api.types.ts` for ApiResponse<T>
- [X] T029 [US4] Implement `apiClient` instance with request interceptors (Inject tokens and locale) in `src/frontend/src/lib/api-client.ts`
- [X] T030 [US4] Add 401 retry and refresh logic to Axios response interceptor.

---

## Phase 4: Integration
**Purpose**: Wire providers and verify cross-component communication.

- [X] T031 Wire `QueryProvider` and `ThemeProvider` into the `RootLayout`.
- [X] T032 Verify that `AuthStore` state is correctly accessible within `apiClient` interceptors.
- [X] T033 Test the flow from `LanguageSwitcher` → `next-intl` middleware → Layout `dir` attribute.

---

## Phase 5: Polish
**Purpose**: Final validation and performance optimization.

- [ ] T034 Ensure 0 strict TypeScript errors using `npm run build`
- [ ] T035 Run Lighthouse audit to verify Performance > 90%.
- [ ] T036 Audit accessibility and responsive design on the base layouts.
