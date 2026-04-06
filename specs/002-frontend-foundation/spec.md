# Feature Specification: Frontend Foundation

**Feature Branch**: `002-frontend-foundation`  
**Created**: 2026-04-05  
**Status**: Approved (Remediated)  
**Input**: Master PRD & `frontend-design` mandates

## User Scenarios & Testing

### User Story 1 - Bilingual Platform Access (Priority: P1)

As a citizen or resident user, I need to access the platform in either Arabic (default RTL) or English (LTR) so that I can seamlessly read requirements and track my applications in my preferred language.

**Why this priority**: Saudi government portals mandate Arabic-first usage, while serving a massive expatriate population that depends on English.
**Independent Test**: The app loads in Arabic (RTL) by default. A toggle switches to English (LTR) with all layout positioning correctly mirrored without reloading the page.

**Acceptance Scenarios**:
1. **Given** I am a new visitor, **When** I land on the homepage, **Then** the layout is RTL.
2. **Given** I toggle the language picker to English, **When** the change applies, **Then** the interface updates to LTR and the text utilizes the dictionary.

---

### User Story 2 - Distinctive UI/UX Branding & Theming (Priority: P1)

As a user, I want a striking, highly polished UI inspired by Absher (Royal Green #006C35 & Government Gold #D4A017) that embraces a clear aesthetic direction (e.g., *Refined Government Utilitarian*) featuring distinctive typography, fluid micro-interactions, and dark/light modes.

**Why this priority**: Avoids generic "AI slop" layouts. The system requires a production-grade UI that instills trust and feels premium.
**Independent Test**: Theme toggling between Light and Dark mode correctly applies semantic CSS variables.

**Acceptance Scenarios**:
1. **Given** system preference is Dark, **When** I open the app, **Then** shadcn components render with high-contrast, refined dark mode palettes.
2. **Given** I hover over buttons or cards, **When** the interaction triggers, **Then** distinct CSS-based micro-animations run smoothly.

---

### User Story 3 - Role-Based Navigation Layouts (Priority: P2)

As a user with a specific role (Applicant, Employee, Admin), I need a layout tailored to my permissions so that I can access my designated tools.

**Why this priority**: The PRD defines 7 roles that operate in completely distinct contexts (public portal vs. dashboard).
**Independent Test**: Authenticating as an "Applicant" routes to a layout with a specific sidebar, distinct from the missing sidebar of a "Public" user.

**Acceptance Scenarios**:
1. **Given** I visit `/ar/employee/dashboard`, **When** the page renders, **Then** it uses the Employee layout with an administrative sidebar.

---

### User Story 4 - Secure API & Auth Communication (Priority: P2)

As the front-end system, I need a robust API client wrapper that automatically manages JWT tokens and API requests so that HTTP calls are securely signed.

**Why this priority**: Foundation for all data fetching.
**Independent Test**: Firing an API request interceptor injects the stored JWT successfully or handles 401s.

**Acceptance Scenarios**:
1. **Given** I am logged in, **When** I fetch my applications, **Then** Axios injects the `Authorization` header automatically.

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST strictly support Next.js 15 App Router standard conventions.
- **FR-002**: System MUST default to Arabic RTL utilizing `next-intl`.
- **FR-003**: System MUST provide distinct application shells (`layout.tsx`) for Public, Applicant, Employee, and Admin.
- **FR-004**: System MUST intercept all XHR traffic via Axios, injecting Bearer Tokens and Locale headers.
- **FR-005**: System MUST utilize Zustand for client-side Auth tracking.

### Non-Functional Requirements (Design)
- **FR-006**: System MUST use distinctive typography (e.g., IBM Plex Arabic/Cairo for AR; Inter for EN) rather than defaulting to Times or generic fallbacks.
- **FR-007**: System MUST map Tailwind CSS colors to the PRD specifications using robust CSS variables to facilitate theme swapping.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Translation toggle responds in < 500ms.
- **SC-002**: `npm run build` issues zero TypeScript 5 strict errors.
- **SC-003**: Lighthouse Performance and Accessibility scores are > 90%.

## Assumptions
- MVP authentication relies on LocalStorage persistence for the JWT.
- Employee layout serves the various sub-roles (Doctor, Receptionist, Security) under one unified layout shell with varied permissions.
