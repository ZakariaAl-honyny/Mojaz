# Research: Professional Government Landing Page

## Framer Motion in Next.js App Router
**Decision**: Create localized wrapper components with `"use client"` for all Framer Motion animated blocks (e.g., `<ScrollReveal />`, `<StaggeredFade />`), keeping the main structural layout in Server Components where possible.
**Rationale**: Vercel React Best Practices dictate that large swaths of the page should not be forced into client-side rendering. Framer Motion requires `use client`, so isolating its usage to generic wrapper components ensures the actual text and structure can remain statically rendered initially.
**Alternatives considered**: Applying `"use client"` to the entire LandingPage component. Rejected as it increases bundle size and delays LCP.

## Services Grid Icons
**Decision**: Use standard `lucide-react` icons (e.g., `Car`, `FileBadge`, `RefreshCcw`, `UploadCloud`) statically imported into the Service grid array.
**Rationale**: Keeps bundle size small, no extra dependencies, fits the Mojaz UI standards.
**Alternatives considered**: Custom SVG assets. Rejected as it adds maintenance overhead for a standard feature.

## FAQ State Management
**Decision**: Use `shadcn/ui` Accordion (which uses Radix UI under the hood) for the FAQ section.
**Rationale**: Project already utilizes `shadcn/ui`. The Accordion component perfectly handles accessible disclosure patterns with minimal overhead.
**Alternatives considered**: Custom state with `useState`. Rejected to maintain design system consistency and a11y primitives.
