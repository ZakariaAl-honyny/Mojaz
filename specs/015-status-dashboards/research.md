# Phase 0: Research & Context

## Technical Choices & Best Practices

### 1. TanStack Table v8
- **Decision**: Use `@tanstack/react-table` for the Employee Queue and Stalled Applications table.
- **Rationale**: It provides headless table utilities which are perfect for a heavily customized, role-based table that requires server-side pagination, multi-column filtering, row selection, and virtualization (for >1000 rows).
- **Vercel Best Practice Application**: 
  - Wrap search/filter updates in `useTransition` + `startTransition` (`rerender-transitions`) to keep the UI responsive during heavy re-renders.
  - Use `React.memo` for rendering heavy rows (`rerender-memo`).
  - Keep table sorting/pagination states in URL parameters (e.g., via `nuqs` or standard router replacements) to enable link sharing and avoid large React state dependencies causing unnecessary re-renders.

### 2. Recharts
- **Decision**: Use `recharts` for the Manager Dashboard KPI charts (bar and pie charts).
- **Rationale**: Recharts is a stable, React-native charting library that integrates well with our Next.js + Tailwind stack.
- **Vercel Best Practice Application**: Loading Recharts is heavy on the bundle size. We will use `next/dynamic` with `ssr: false` to conditionally load chart components (`bundle-dynamic-imports`) which improves initial page load metrics for the Manager Dashboard.

### 3. Framer Motion
- **Decision**: Use `framer-motion` for staggering dashboard cards and the animated pulse in the Timeline.
- **Rationale**: Simplifies integration for list staggering and continuous loop animations required by FR-035.
- **Vercel Best Practice Application**: Animations should animate CSS variables instead of layout properties where possible to prevent browser repaints (`rendering-animate-svg-wrapper`). For the timeline pulse, CSS-only animations (`animate-pulse`) should be combined with Framer for entry orchestration (`AnimatePresence`).

### 4. React Suspense & Parallel Fetching
- **Decision**: Break down role dashboards into granular, independent Server Components wrapped in their own `<Suspense>` boundaries.
- **Rationale**: Prevents a slow query (e.g., fetching rows for the employee queue) from blocking the rendering of the top-level KPI cards and layout.
- **Vercel Best Practice Application**:
  - `async-parallel`: Avoid consecutive awaits. Use `Promise.all` in the dashboard route.
  - `async-suspense-boundaries`: Stream content independently via `Suspense`.
  - `server-dedup-props`: Avoid duplicate serialization when passing server-fetched DTOs down to client table components.

### Clarifications Resolved
No open clarifications required. The PRD and spec provide exact details regarding roles, UI components, states, formatting, and DTO requirements.
