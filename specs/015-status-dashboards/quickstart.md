# Phase 1: Quickstart for Implementation

## Overview
This feature implements the core visual tracking, status mapping, and operational dashboards/queues for the Mojaz platform. It connects the 10-stage workflow logic to the UI for both applicants and employees. Most of the complexity resides in the Next.js frontend (TanStack Table, responsive dashboard layouts, animations) and optimizing read models on the backend.

## Component Strategy
1. **Shared Components** (`src/components/shared/`):
   - `StatusBadge` (Tailwind variants per status, localized labels, `React.memo` optimization).
   - `ApplicationTimeline` (Vertical layout, Framer Motion staggered reveals, mobile responsive).
2. **Dashboard Views** (`src/app/[locale]/(applicant)/dashboard/` & `src/app/[locale]/(employee)/dashboard/`):
   - Wrap heavy sections in `<Suspense fallback={<Skeleton />}>` for non-blocking server progressive rendering.
   - Separate container components (e.g., `ManagerDashboard`, `ReceptionistDashboard`) allowing for distinct API fetches per role without bloating a monolithic client bundle.
3. **Queue Interface** (`src/components/employee/queue/`):
   - `EmployeeApplicationQueue` utilizes TanStack Table core hooks (`useReactTable`).
   - Implement debounced server-side text searching.
   - Control URL params for sorting, filtering, and pagination to persist state.

## Vercel React Best Practices to Apply
- **Data Fetching**: Do NOT perform initial data fetching inside deep client components for dashboards; fetch in Server Components (`page.tsx`) utilizing `Promise.all()` to prevent waterfalls (`async-parallel`), passing DTOs directly or relying on `React.cache`.
- **Bundle Optimization**: Use `next/dynamic` (`ssr: false`) for `Recharts` inside `ManagerDashboard` (`bundle-dynamic-imports`).
- **Re-render Optimization**: Table filtering logic should use `startTransition` so the user input remains snappy while the table filters (`rerender-transitions`).
- **Translations**: Always pull strings via `useTranslations()` or `getTranslations()` from `next-intl` to adhere strictly to the RTL+i18n rules of Mojaz. 

## Starting Point
1. Run `npm run dev` in `frontend/` to start the frontend server and backend APIs.
2. In `frontend/public/locales/{ar,en}/`, verify translation files exist or add namespaced JSON objects for `dashboard`, `timeline`, `queue`, and `status`.
3. Scaffold the `StatusBadge` and `ApplicationTimeline` components isolated in a mock page or storybook-like testing layout before integrating them.
