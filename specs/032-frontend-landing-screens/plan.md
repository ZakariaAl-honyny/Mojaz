# Implementation Plan: Public Landing Page & Frontend Screens

Technical implementation plan for building the complete frontend surface of the Mojaz platform, including the high-end public landing page, authentication flows, and role-based dashboards.

## User Scenarios & Goals

Implementing the requirements from PRD Sections 18, 19, and 20:
- **Landing Page**: 9 sections (Header, Hero, Services, Steps, Categories, Features, Stats, FAQ, Footer) with full AR/EN and Dark/Light support.
- **Portals**: Distinct paths for Applicants vs. Employees (Receptionist, Doctor, Examiner, Admin).
- **Security**: RBAC matrix enforcement.
- **Aesthetic**: Royal Green (#006C35), Premium Government design.

## Technical Context

- **Frontend**: Next.js 15 (App Router), Tailwind CSS 4, shadcn/ui.
- **i18n**: next-intl for bilingual support.
- **State**: Zustand for global auth and application state.
- **Motion**: Framer Motion for premium animations.

## Constitution Check

| Principle | Adherence Plan |
|-----------|----------------|
| **IV. Internationalization** | Use `next-intl` for all content. Logical CSS properties for all layouts. |
| **II. Security First** | RBAC check on every client-side route; mask sensitive data. |
| **III. Configuration** | Fetch fee structures and category rules dynamically from settings API. |

## Proposed Changes

### [Frontend] High-End Landing Page

#### [NEW] [LandingPage.tsx](file:///c:/Users/ALlahabi/Desktop/cmder/Mojaz/src/frontend/src/components/landing/LandingPage.tsx)
- Implementation of Header, Hero, Services, Timeline Steps, Categories, Features, Stats, FAQ, and Footer.
- Reveal animations on scroll.
- Responsive design.

### [Frontend] Portal Structures

#### [NEW] [portal-layout.tsx](file:///c:/Users/ALlahabi/Desktop/cmder/Mojaz/src/frontend/src/app/[locale]/(authenticated)/portal-layout.tsx)
- Unified authenticated layout handling Sidebar/Header for all roles.

#### [NEW] [ApplicantDashboard.tsx](file:///c:/Users/ALlahabi/Desktop/cmder/Mojaz/src/frontend/src/app/[locale]/(applicant)/dashboard/page.tsx)
- Applicant-specific view with active applications carousel and notifications.

#### [NEW] [EmployeeDashboard.tsx](file:///c:/Users/ALlahabi/Desktop/cmder/Mojaz/src/frontend/src/app/[locale]/(employee)/dashboard/page.tsx)
- Unified employee surface showing role-specific worklists.

## Open Questions

- **OTP Implementation**: Should we use real SMS/Email integration from day one, or provide a "debug/mock" mode for development?
- **Animations Intensity**: Do you prefer heavy scroll-animations (parallax, stagger) or subtle professional transitions?

## Verification Plan

### Automated Tests
- Run `npm test` for the rendering logic and translation keys.
- Playwright tests for language switching and role redirection.

### Manual Verification
- Visual inspection of the "Royal Green" theme consistency.
- Test RTL support on mobile viewports.
