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
