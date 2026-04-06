# Feature Specification: 002-frontend-foundation

**Feature Branch**: `002-frontend-foundation`
**Created**: 2026-04-03
**Status**: Draft

## Summary

Next.js 15 application with App Router serving as the foundation for all frontend development, including theming, i18n, layouts, and API client configuration.

## User Scenarios & Testing

### User Story 1 — Bilingual Layout (Priority: P1)

As a user, I want the interface to display in Arabic (RTL) or English (LTR) so that I can use it in my preferred language.

**Acceptance Scenarios:**
1. **Given** the app loads, **When** locale is `ar`, **Then** layout is RTL with Arabic font.
2. **Given** the app loads, **When** locale is `en`, **Then** layout is LTR with English font.
3. **Given** a locale switch, **When** user toggles language, **Then** direction flips instantly.

### User Story 2 — Theme Support (Priority: P1)

As a user, I want to switch between Dark and Light mode so that the interface suits my environment.

**Acceptance Scenarios:**
1. **Given** the app loads, **When** system is dark, **Then** dark mode is applied.
2. **Given** dark mode, **When** toggle clicked, **Then** light mode applied and persisted.

## Requirements

### Functional Requirements

- **FR-001**: Next.js 15 App Router with TypeScript 5 strict mode and `src/` structure.
- **FR-002**: Tailwind CSS 4 + shadcn/ui with full Mojaz theme (Primary #006C35, Secondary #D4A017, Status colors).
- **FR-003**: next-intl 3 with locale routing `/ar/...` and `/en/...`; Arabic RTL as default locale.
- **FR-004**: next-themes with Dark/Light/System preference and localStorage persistence.
- **FR-005**: Layout system: RootLayout, PublicLayout, ApplicantLayout, EmployeeLayout, AdminLayout.
- **FR-006**: Axios API client with JWT interceptors, 401 → refresh → retry, and error toasts.
- **FR-007**: TanStack React Query provider with 5min stale time, retry 1, DevTools in dev.
- **FR-008**: Zustand auth store persisted to localStorage with SSR hydration handling.
- **FR-009**: TypeScript types: ApiResponse<T>, PaginatedResult<T>, User types, Common types.
- **FR-010**: Utility functions: cn(), formatDate(), formatCurrency(), calculateAge(), getStatusColor(), getInitials().
- **FR-011**: Shared components: LoadingSkeleton, EmptyState, ErrorState, PageLoading.
- **FR-012**: Bilingual 404 page with link back to home.

## Success Criteria

- **SC-001**: App loads at localhost:3000 with Arabic RTL layout.
- **SC-002**: Language switches instantly and layout direction flips correctly.
- **SC-003**: Dark/Light mode toggles and persists between refreshes.
- **SC-004**: All shadcn components render in Mojaz theme colors.
- **SC-005**: Auth store persists between page refreshes.
- **SC-006**: Responsive on mobile, tablet, desktop.
- **SC-007**: Arabic font (IBM Plex Sans Arabic) and English font (Inter) load correctly.
