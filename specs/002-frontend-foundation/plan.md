**Feature Branch**: `002-frontend-foundation`
**Status**: Draft

## Architecture Overview

A Next.js 15 (App Router) foundation using TypeScript, Tailwind CSS 4, and shadcn/ui. The project will follow a strict atomic/feature-based directory structure inside `src/`.

### Tech Stack
- **Core**: Next.js 15, React 19, TypeScript 5.
- **Styling**: Tailwind CSS 4, shadcn/ui, Framer Motion (for animations).
- **Internationalization**: `next-intl` (Next.js 15 compatible).
- **State Management**: Zustand (for client-side auth and UI state).
- **Data Fetching**: TanStack React Query v5 + Axios.
- **Theming**: `next-themes`.
- **Forms**: React Hook Form + Zod.

### Directory Structure
```
frontend/
├── public/
│   ├── locales/
│   │   ├── ar/
│   │   └── en/
├── src/
│   ├── app/
│   │   └── [locale]/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── shared/
│   ├── hooks/
│   ├── lib/
│   │   ├── api-client.ts
│   │   └── utils.ts
│   ├── providers/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── styles/
```

## User Story 1 — Bilingual Layout (Arabic RTL / English LTR)

- **Objective**: Implement locale-based routing and RTL/LTR layout flipping.
- **Implementation**:
    - Use `next-intl` middleware and routing.
    - Root layout `html` tag sets `dir` attribute based on locale.
    - Use CSS logical properties (e.g., `ms-`, `pe-`, `start-0`) via Tailwind.
    - Load fonts: IBM Plex Sans Arabic for `ar`, Inter for `en`.

## User Story 2 — Theme Support (Dark/Light/System)

- **Objective**: Provide a premium theme that persists and respects system settings.
- **Implementation**:
    - Use `next-themes` provider.
    - Extend Tailwind theme with Mojaz colors (#006C35 Primary, #D4A017 Secondary).
    - Map shadcn/ui variables to Mojaz colors.
    - Persist preference in `localStorage`.

## Phases of Implementation

### Phase 1: Core Setup
1. Scaffold Next.js 15 app in `src/frontend`. (Actually, the user's `ls` shows `src` at the root, I should check if a frontend directory already exists).
2. Install base dependencies: `tailwind-merge`, `clsx`, `lucide-react`, `next-themes`, `next-intl`, `zustand`, `@tanstack/react-query`, `axios`, `zod`, `react-hook-form`.
3. Configure `tailwind.config.ts` with Mojaz theme tokens.

### Phase 2: i18n & Layouts
1. Setup `next-intl` middleware and `[locale]` folder structure.
2. Create `i18n.ts` configuration.
3. Implement `RootLayout` with dynamic `dir` and `lang`.
4. Implement `Header` with language and theme toggles.

### Phase 3: Infrastructure
1. Configure `api-client.ts` with Axios interceptors for JWT.
2. Setup `QueryProvider` and `StoreProvider`.
3. Implement core utility functions in `lib/utils.ts`.

## Risks & Mitigations
- **SSR Rehydration**: i18n and themes can cause hydration mismatches. Use `next-intl`'s App Router patterns and `next-themes` client-side only mounting where necessary.
- **RTL Flipping**: Ensure all hardcoded `left/right` values are replaced with `start/end`.
=======
# Implementation Plan: Frontend Foundation

**Branch**: `002-frontend-foundation` | **Date**: 2026-04-05 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-frontend-foundation/spec.md`

## Summary

Build a Next.js 15 App Router platform with strict TypeScript 5, integrating Tailwind CSS 4 and shadcn/ui tailored to the Mojaz Royal Green/Government Gold palette. Establish the core translation system (next-intl), theme toggling, routing layouts for different roles (Public, Applicant, Employee, Admin), and the global state/API clients (Zustand, React Query, Axios).

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20+
**Primary Dependencies**: Next.js 15 (App Router), Tailwind CSS 4, shadcn/ui, next-intl 3, next-themes, Zustand 5, React Query 5, Axios 1.7
**Storage**: localStorage (Persisted Auth State & Theme Preference)
**Testing**: Jest + React Testing Library (Unit), Playwright (E2E)
**Target Platform**: Web Browsers (Responsive Desktop/Tablet/Mobile)
**Project Type**: Full-Stack Web Application (Frontend tier)
**Performance Goals**: Lighthouse score 90+, < 500ms theme/language switch
**Constraints**: Fully bilingual (RTL/LTR) by default. Must adhere to bold, refined *Government Utilitarian* aesthetics with distinctive typography (IBM Plex Arabic / Inter), avoiding "AI slop" or generic layouts. Must include fluid micro-animations for high-impact spatial composition.
**Scale/Scope**: Foundation for 8 services, 6 license categories, 7 user roles. Includes base layouts and auth logic.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Internationalization by Default**: Uses `next-intl`. Root layout will set `dir` and `lang`. Arabic is default (RTL). Hardcoded strings are forbidden.
- [x] **Test Discipline**: Uses Jest, React Testing Library, and Playwright. 
- [x] **Security First**: Employs backend-driven security, stores tokens in localStorage (assumed sufficient for MVP based on PRD), Axios interceptors for JWT injection.
- [x] **Naming Conventions**: Components `PascalCase.tsx`, Hooks `useCamelCase.ts`, Stores `camelCase-store.ts`, Types `PascalCase{Dto/Response}`.

## Project Structure

### Documentation (this feature)

```text
specs/002-frontend-foundation/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/frontend/
├── public/
│   └── locales/
│       ├── ar/
│       │   ├── common.json
│       │   ├── auth.json
│       │   ├── dashboard.json
│       │   └── navigation.json
│       └── en/
│           ├── common.json
│           ├── auth.json
│           ├── dashboard.json
│           └── navigation.json
├── src/
│   ├── app/
│   │   └── [locale]/
│   │       ├── (public)/
│   │       ├── (applicant)/
│   │       ├── (employee)/
│   │       ├── (admin)/
│   │       └── layout.tsx
│   ├── components/
│   │   ├── ui/          # shadcn components
│   │   ├── layout/      # Headers, Sidebars, Footers
│   │   └── shared/      # Shared foundational components
│   ├── hooks/
│   ├── lib/
│   │   ├── utils.ts
│   │   └── api-client.ts
│   ├── providers/
│   │   ├── theme-provider.tsx
│   │   └── query-provider.tsx
│   ├── services/
│   ├── stores/
│   │   └── auth-store.ts
│   └── types/
│       ├── api.types.ts
│       └── auth.types.ts
└── tests/
    ├── e2e/             # Playwright
    └── unit/            # Jest + RTL
```

**Structure Decision**: Monorepo-style split (backend/frontend). The above captures the specific Next.js App Router structure required for the frontend.
