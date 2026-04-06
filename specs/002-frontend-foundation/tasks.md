---
description: "Task list for frontend foundation implementation"
---

# Tasks: Frontend Foundation

**Input**: Design documents from `/specs/002-frontend-foundation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and core Next.js configuration

- [X] T001 Initialize Next.js 15 App Router project in `src/frontend/` with TypeScript and Tailwind CSS 4
- [X] T002 [P] Configure strict TypeScript 5 rules in `src/frontend/tsconfig.json`
- [X] T003 [P] Initial configuration of ESLint and Prettier for the frontend project
- [ ] T004 Setup `jest.config.ts`, `playwright.config.ts`, and React Testing Library

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core library installations required before any user stories can proceed.

- [X] T005 Install and configure `next-intl` in `src/frontend/`
- [X] T006 Install and configure `next-themes`
- [X] T007 Install and configure `zustand`
- [X] T008 Install and configure `@tanstack/react-query`
- [X] T009 Install and configure `axios`
- [X] T010 Install `shadcn/ui` CLI and configure base components: Button, Input, Card, Label
- [X] T011 Create global CSS with Mojaz themes (Primary: #006C35, Secondary: #D4A017) in `src/frontend/src/app/globals.css`

**Checkpoint**: Core foundational libraries are installed and ready.

## Phase 3: User Story 1 - Bilingual Platform Access (Priority: P1) 🎯 MVP

**Goal**: Support Arabic (RTL) and English (LTR) language switching.

**Independent Test**: Build the app, visit the site, and toggle the language successfully impacting content and direction.

- [X] T012 [P] [US1] Unit test language switcher logic in `src/frontend/tests/unit/components/LanguageSwitcher.test.tsx`
- [X] T013 [P] [US1] Setup translation dictionaries JSON files in `src/frontend/public/locales/{ar,en}/`
- [X] T014 [US1] Implement next-intl middleware in `src/frontend/src/middleware.ts` for routing `/[locale]`
- [X] T015 [US1] Create RootLayout in `src/frontend/src/app/[locale]/layout.tsx` handling `dir` and `lang` attributes, wrapping providers.
- [X] T016 [US1] Implement `<LanguageSwitcher />` component in `src/frontend/src/components/shared/LanguageSwitcher.tsx`
- [X] T017 [US1] Create custom Bilingual 404 page in `src/frontend/src/app/[locale]/not-found.tsx`

## Phase 4: User Story 2 - Distinctive UI/UX Branding & Theming (Priority: P1)

**Goal**: Support Mojaz branding with a bold *Government Utilitarian* aesthetic, distinctive typography, and Dark/Light modes.

**Independent Test**: Toggle dark/light mode and verify colors change automatically without page reload, alongside bold typography rendering.

- [X] T018 [P] [US2] Implement ThemeProvider wrapper in `src/frontend/src/providers/theme-provider.tsx`
- [X] T019 [US2] Implement `<ThemeToggler />` component in `src/frontend/src/components/shared/ThemeToggler.tsx`
- [X] T020 [US2] Configure custom `tailwind.config` to inject distinctive typography (e.g., IBM Plex Arabic/Inter) via CSS variables.
- [X] T021 [US2] Implement global utility classes for high-impact structural composition and refined grain/mesh overlays for the luxury government aesthetic.
- [X] T022 [US2] Install `framer-motion` and build standard micro-interaction wrapper components (e.g., `<FadeIn />`, `<SlideUp />`) to prevent static "AI slop".

## Phase 5: User Story 3 - Role-Based Navigation Layouts (Priority: P2)

**Goal**: Build layouts for Public, Applicant, Employee, and Admin views.

**Independent Test**: Route to dummy pages matching those roles and verify sidebars/headers render properly.

- [X] T021 [P] [US3] Create `PublicLayout` in `src/frontend/src/app/[locale]/(public)/layout.tsx`
- [X] T022 [P] [US3] Create `ApplicantLayout` and Sidebar in `src/frontend/src/app/[locale]/(applicant)/layout.tsx`
- [X] T023 [P] [US3] Create `EmployeeLayout` and Sidebar in `src/frontend/src/app/[locale]/(employee)/layout.tsx`
- [X] T024 [P] [US3] Create `AdminLayout` and Sidebar in `src/frontend/src/app/[locale]/(admin)/layout.tsx`

## Phase 6: User Story 4 - Secure API Communication (Priority: P2)

**Goal**: Configure Axios and Zustand for API calling and session state management.

**Independent Test**: Mock 401 response and verify Axio interceptor refreshes token automatically.

- [X] T025 [P] [US4] Implement `AuthStore` in `src/frontend/src/stores/auth-store.ts` using `zustand/middleware` persist (localStorage)
- [X] T026 [P] [US4] Create `api.types.ts` in `src/frontend/src/types/api.types.ts` for ApiResponse<T>
- [X] T027 [US4] Implement `apiClient` instance with request interceptors (Inject tokens and locale) in `src/frontend/src/lib/api-client.ts`
- [X] T028 [US4] Add 401 retry and refresh logic to Axios response interceptor.

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T029 Run Playwright E2E test verifying language toggle, theme toggle, and public layout display.
- [ ] T030 Ensure 0 strict TypeScript errors using `npm run build`
- [ ] T031 Run Lighthouse audit to verify Performance > 90.

---

## Dependencies & Execution Order

- **Phase 1** must complete first.
- **Phase 2** must complete before User Stories begin.
- **Phase 3 and 4 (P1)** can run in parallel.
- **Phase 5 and 6 (P2)** can run in parallel after P1 stories are mostly established.
