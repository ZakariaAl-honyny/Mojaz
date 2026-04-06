# Tasks: 002-frontend-foundation

**Input**: Design documents from `specs/002-frontend-foundation/`
**Prerequisites**: plan.md ✅ | spec.md ✅
**Branch**: `002-frontend-foundation`
**Created**: 2026-04-06

## Phase 1: Project Setup (Priority: P1)

- [ ] **T201**: Initialize Next.js 15 project in `src/frontend` with App Router, TypeScript, ESLint, and Tailwind CSS.
- [ ] **T202**: Copy `tailwind.config.ts` from project constitution/PRD to include Mojaz colors and fonts.
- [ ] **T203**: Install core dependencies: `next-intl`, `next-themes`, `zustand`, `@tanstack/react-query`, `axios`, `zod`, `react-hook-form`, `lucide-react`, `clsx`, `tailwind-merge`.
- [ ] **T204**: Configure shadcn/ui and add base components: `Button`, `Card`, `Input`, `DropdownMenu`, `Dialog`, `Skeleton`.
- [ ] **T205**: Add global fonts: IBM Plex Sans Arabic (Google Fonts) and Inter.

## Phase 2: i18n & Layout Structure (Priority: P1)

- [ ] **T206**: Configure `next-intl` middleware and `i18n.ts` config for `/ar` and `/en`.
- [ ] **T207**: Update `src/app/[locale]/layout.tsx` to handle dynamic `dir` and `lang` based on route params.
- [ ] **T208**: Implement `next-themes` provider and wrap root layout.
- [ ] **T209**: Create `LanguageSwitcher` and `ThemeToggle` components.
- [ ] **T210**: Create `PublicLayout` and `DashboardLayout` base components.

## Phase 3: Infrastructure & Services (Priority: P2)

- [ ] **T211**: Setup `src/lib/api-client.ts` with Axios instance, base URL, and interceptors for Bearer token.
- [ ] **T212**: Implement `src/lib/utils.ts` with `cn()`, `formatDate()`, and `formatCurrency()`.
- [ ] **T213**: Setup `src/providers/QueryProvider.tsx` with TanStack React Query.
- [ ] **T214**: Create `src/stores/auth-store.ts` using Zustand with persistence.
- [ ] **T215**: Define global TypeScript types in `src/types/` (ApiResponse, User, LicenseCategory).

## Phase 4: Finalization & Verification (Priority: P2)

- [ ] **T216**: Create a bilingual `not-found.tsx` page.
- [ ] **T217**: Verify local development with `npm run dev`.
- [ ] **T218**: Run `npm run build` to ensure no build-time errors.
- [ ] **T219**: Audit accessibility and responsive design on the base layout.

## Success Criteria Checklist

- [ ] App loads at `localhost:3000/ar` with RTL layout.
- [ ] Locale switching works instantly.
- [ ] Dark/Light mode persists.
- [ ] API client handles tokens correctly.
- [ ] Build completes without errors.
