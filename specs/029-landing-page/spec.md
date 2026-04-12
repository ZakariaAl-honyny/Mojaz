# Feature Specification: Professional Government Landing Page

**Feature Branch**: `029-landing-page`  
**Created**: 2026-04-10  
**Status**: Draft  
**Input**: User description: "read 1-specify.md and spec.md and docs/PRD.md and use skills frontend-design and vercel-react-best-practices"

## Clarifications

### Session 2026-04-10
- Q: Which 8 services exactly should be displayed in the grid? → A: New License, Renewal, Replacement (Lost/Damaged), Category Upgrade, International License, Agricultural Vehicles, Probationary License, Learner Permit.
- Q: Are the statistics to be hardcoded or dynamic? → A: Hardcoded high-fidelity approximations (4.2M+ Active Licenses, 142 Centers, 18 min Avg Processing, 12M+ Verified Citizens).
- Q: Where should the "Start Now" CTA point? → A: Navigate to the Registration page (/register).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discovering Services and Accessing the Portal (Priority: P1)

As a citizen or resident visiting the Mojaz platform for the first time, I want to immediately understand its purpose through a visually striking, high-impact hero section and clear call-to-actions, so that I can easily navigate to the service I need (e.g., New License, Renewal).

**Why this priority**: The hero section and primary CTA are the gateway to the entire digital licensing platform. A highly accessible, high-performance landing experience is critical for reducing citizen friction and increasing platform adoption.

**Independent Test**: Can be fully tested by verifying that the landing page loads instantly without layout shifts (CLS), displays the hero and service grid, and provides working links to the login and registration flows in both Arabic and English.

**Acceptance Scenarios**:

1. **Given** a user navigates to the landing page root `/`, **When** the page loads, **Then** the Hero section should render immediately with staggered reveal animations and the primary CTA should be clearly visible overhead.
2. **Given** a user is viewing the Service Grid, **When** they hover over a service card, **Then** the card should respond with a subtle interaction, displaying hover states smoothly.
3. **Given** a user switches the locale from English to Arabic, **When** the switch completes, **Then** the entire page layout including animations, icons, and text alignment should seamlessly transition to Right-To-Left (RTL).

---

### User Story 2 - Understanding the Rules, Workflow, and Statistics (Priority: P2)

As a prospective driver, I want to see a clear, step-by-step workflow of the issuance process, view the available license categories, and inspect platform statistics, so that I understand exactly what is required and how the system works without having to contact customer support.

**Why this priority**: Providing transparent procedural information reduces the volume of inquiries to support centers and sets proper expectations for citizens completing their digital journey.

**Independent Test**: Can be fully tested by verifying the rendering of the chronological workflow section, the category cards, and the interactive FAQ accordion.

**Acceptance Scenarios**:

1. **Given** a user scrolls down to the Workflow section, **When** the elements come into view, **Then** the sequence of 6 steps should animate smoothly into place without blocking the main thread.
2. **Given** a user reviews the License Categories, **When** they look at a specific category (e.g. Motorcycle), **Then** they should clearly see the required minimum age and specific criteria.
3. **Given** a user has a question, **When** they click to expand an item in the FAQ accordion, **Then** the answer should reveal smoothly using an accessible disclosure pattern.

---

### Edge Cases

- What happens when a user prefers reduced motion (OS-level setting)? (Animations should gracefully degrade or disable)
- How does the system handle high-latency or slow 3G networks? (Images should be prioritized, and Next.js static rendering should provide instant text display before JS hydration completes)
- What happens if JavaScript is completely disabled? (The core content and navigation links must still be accessible and visible, even if Framer Motion animations do not run)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present a highly engaging Hero section featuring bold typography, dynamic background elements, and clear CTAs: "Start Now" (pointing to /register) and "Login" (pointing to /login).
- **FR-002**: System MUST display an 8-item Services Grid indicating the different operations: New License, Renewal, Replacement (Lost/Damaged), Category Upgrade, International License, Agricultural Vehicles, Probationary License, and Learner Permit, with associated iconography.
- **FR-003**: System MUST display a 6-step Practical Workflow (Registration -> Medical -> Training -> Theory -> Practical -> Issuance) utilizing scroll-triggered animations.
- **FR-004**: System MUST list 6 distinct License Categories (A through F) with clear indicators of age requirements.
- **FR-005**: System MUST present a Features Highlight section showcasing the platform's core systemic values (Cloud Sync, Digital Wallet, etc.).
- **FR-006**: System MUST show a Statistics section with 4 hardcoded data points: 4.2M+ Active Licenses, 142 Approved Centers, 18 min average processing time, and 12M+ Verified Citizens.
- **FR-007**: System MUST provide a responsive FAQ Accordion using state-driven expanding functional components.
- **FR-008**: System MUST utilize strict Next.js App Router performance patterns, avoiding client-side waterfalls and minimizing bundle size (e.g. dynamic imports where necessary, standard Lucide icons).
- **FR-009**: System MUST support full internationalization (i18n), fetching translations from `landing.json` correctly for both English (`ltr`) and Arabic (`rtl`).
- **FR-010**: System MUST embody a premium, Absher-inspired Royal Green design aesthetic without relying on generic styling.

### Key Entities

*(No backend persistence entities are modified; this is a purely presentational frontend feature.)*

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The landing page achieves a Google Lighthouse Performance, Accessibility, and SEO Score of 90+ on desktop and mobile.
- **SC-002**: Time to Interactive (TTI) and Largest Contentful Paint (LCP) fall within Google Core Web Vitals "Good" thresholds (< 2.5 seconds).
- **SC-003**: The final Javascript bundle size for the root group does not increase by more than 50 KB (gzipped) compared to the baseline template.
- **SC-004**: Zero Cumulative Layout Shift (CLS) occurs during the initial load and font-loading phases.
- **SC-005**: 100% of text elements are fully localized with correct RTL layout logic.

## Assumptions

- Users have modern browsers capable of CSS transforms and standard modern JS rendering.
- The `next-intl` configuration and `i18n` Next.js setup are already stable and active in the project root.
- Icons will be sourced from `lucide-react` and standard Tailwind CSS logic will drive responsive behaviors without a separate UI framework (outside of `shadcn/ui` components).
