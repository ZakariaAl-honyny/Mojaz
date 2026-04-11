---
description: "Task list template for Professional Government Landing Page implementation"
---

# Tasks: Professional Government Landing Page

**Input**: Design documents from `/specs/029-landing-page/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and ensuring all required frontend dependencies are met.

- [x] T001 Ensure `framer-motion` and `lucide-react` are installed in `src/frontend/package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, wrappers, and localization structures that MUST be complete before ANY user story can be implemented.

- [x] T002 Create TypeScript types mapped from data-model in `src/frontend/src/types/landing.types.ts`
- [x] T003 [P] Create Framer Motion wrapper `ScrollReveal.tsx` in `src/frontend/src/components/ui/` with `"use client"` directive
- [x] T004 [P] Create Framer Motion wrapper `StaggeredFade.tsx` in `src/frontend/src/components/ui/` with `"use client"` directive
- [x] T005 [P] Initialize English translation file for the landing namespace in `src/frontend/public/locales/en/landing.json`
- [x] T006 [P] Initialize Arabic translation file for the landing namespace in `src/frontend/public/locales/ar/landing.json`

**Checkpoint**: Foundation ready - UI development can begin in parallel.

---

## Phase 3: User Story 1 - Discovering Services and Accessing the Portal (Priority: P1) 🎯 MVP

**Goal**: Present an immersive Hero section and clearly showcase the 8 primary services.

**Independent Test**: Root page `/en` and `/ar` load instantly with a visible Hero banner and Service Grid without layout shift. CTAs for Register and Login navigate correctly.

### Implementation for User Story 1

- [x] T007 [P] [US1] Create `HeroSection.tsx` in `src/frontend/src/app/[locale]/(public)/_components/` featuring bold typography and CTAs
- [x] T008 [P] [US1] Create `ServiceGrid.tsx` in `src/frontend/src/app/[locale]/(public)/_components/` listing the 8 distinct operations
- [x] T009 [US1] Set up main `page.tsx` in `src/frontend/src/app/[locale]/(public)/` integrating the Hero and Service Grid components

**Checkpoint**: The initial above-the-fold landing experience should be highly engaging and interactive.

---

## Phase 4: User Story 2 - Understanding the Rules, Workflow, and Statistics (Priority: P2)

**Goal**: Implement a step-by-step chronological workflow, list the 6 license categories, highlight features, provide hardcoded platform statistics, and an interactive FAQ.

**Independent Test**: Scrolling down the page triggers smooth motion reveals for timeline steps, stats animate their numbers, and clicking on FAQs smoothly expands the accordion.

### Implementation for User Story 2

- [x] T010 [P] [US2] Create `WorkflowSection.tsx` with animated timeline connector
- [x] T011 [P] [US2] Create `CategoryCards.tsx` showcasing license types and age rules
- [x] T012 [P] [US2] Create `HighlightFeatures.tsx` explaining platform USPs
- [x] T013 [P] [US2] Create `PlatformStats.tsx` with count-up animations
- [x] T014 [P] [US2] Create `FAQSection.tsx` using a custom animated accordion
- [x] T015 [US2] Update main `page.tsx` adding all sections from T010-T014 and a CTA footer

**Checkpoint**: The entire 9-section landing page is structurally complete and fully interactive.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Performance optimization, internationalization validation, and accessibility.

- [ ] T016 Run Lighthouse audits (`npm run build` && `npm run start`) to guarantee SC-001 (>90 score) and SC-004 (0.0 CLS)
- [ ] T017 Verify strict RTL mirroring by toggling locale from `/en` to `/ar`, ensuring all Tailwind `start`/`end` and `ms-`/`me-` utilities are correctly applied

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all user stories being completed

### Parallel Opportunities

- Foundational `ScrollReveal.tsx`, `StaggeredFade.tsx`, and `.json` translation initialization can be worked concurrently.
- All User Story 2 sub-components (Workflow, Category, Features, Stats, FAQ) can be built independently before being integrated into `page.tsx`.

## Implementation Strategy

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Check Hero + Grid → Deploy/Demo (MVP!)
3. Add User Story 2 → Integrate additional 5 sections → Deploy/Demo
4. Final Polish → Verify WCAG 2.1 AA and Lighthouse scores.
