# Feature Specification: 013-application-wizard

**Feature Branch**: `013-application-wizard`
**Created**: 2026-04-08
**Status**: Draft
**Input**: User description: "5-step wizard for creating license applications with validation, auto-save, and bilingual support."

---

## User Scenarios & Testing

### User Story 1 – Complete Application Submission (Priority: P1)

An authenticated applicant navigates to the new-application page and completes all 5 wizard steps in sequence: selects a service, chooses a license category that matches their age, fills personal information, fills application details, reviews the summary, accepts the declaration, and submits the application. The system creates a draft record in the backend immediately on Step 1 and updates it continuously via auto-save. On final submission the application transitions from Draft → Submitted and the applicant is redirected to the application detail/tracking page.

**Why this priority**: This is the entire purpose of Feature 013. Without a working end-to-end submission path there is nothing to build upon.

**Independent Test**: Can be fully tested by a logged-in applicant completing all 5 steps with valid data for Category B (age ≥ 18) and verifying that the resulting application appears in their dashboard with status "Submitted".

**Acceptance Scenarios**:

1. **Given** a logged-in applicant on Step 1, **When** they click "New License Issuance", **Then** the system creates a Draft application record and stores the service choice in the Zustand store.
2. **Given** a 21-year-old applicant on Step 2, **When** they select Category C, **Then** the age validation passes and they can proceed to Step 3.
3. **Given** all 5 steps filled with valid data, **When** the applicant ticks the declaration checkbox and clicks "Submit", **Then** the API creates/updates the application record with status Submitted, a success notification fires, and the page redirects to the application detail page (e.g., `/ar/applicant/applications/{id}`).

---

### User Story 2 – Age Validation Blocks Ineligible Category (Priority: P1)

A 17-year-old applicant tries to select Category B (minimum age 18). The wizard immediately shows an inline error and disables the "Next" button so they cannot advance until they select an eligible category (A only at age 16–17).

**Why this priority**: Enforcing eligibility at the client level is a core business requirement (PRD §9.1) and prevents downstream workflow errors.

**Independent Test**: Can be fully tested by signing in as a user whose date of birth makes them 17 years old, reaching Step 2, and attempting to select Category B — the system must block advancement and display an age-error message.

**Acceptance Scenarios**:

1. **Given** an applicant whose calculated age is 17, **When** they select Category B on Step 2, **Then** an inline error message displays (e.g., "Minimum age for Category B is 18 years") and the Next button is disabled.
2. **Given** the same applicant, **When** they select Category A, **Then** the error clears and the Next button becomes enabled.
3. **Given** an applicant whose calculated age is 16, **When** they open Step 2, **Then** Categories B, C, D, E, F are visually marked as unavailable with a tooltip explaining the age requirement.

---

### User Story 3 – Auto-Save Draft & Resume (Priority: P2)

An applicant starts the wizard, completes Steps 1–3, and closes the browser tab (or session times out). When they return and navigate to "New Application", the wizard resumes from where they left off with all previously entered data pre-populated. Auto-save fires silently in the background every 30 seconds without any user action.

**Why this priority**: Government applications are long and interrupted sessions are common. Losing entered data creates significant friction and support burden.

**Independent Test**: Can be fully tested by completing Steps 1–3, waiting 30 seconds (verifying network call to save draft), closing and reopening the browser, navigating back to the wizard, and confirming data is pre-populated.

**Acceptance Scenarios**:

1. **Given** an applicant has completed Steps 1–3 and 30 seconds have elapsed, **When** a background auto-save fires, **Then** a network request to `PATCH /api/v1/applications/{id}` is made with the latest wizard state and no success toast interrupts the user.
2. **Given** an applicant with a saved draft reopens the wizard, **When** the page loads, **Then** the wizard initializes at the last completed step with all fields pre-populated from the stored draft.
3. **Given** an auto-save request fails (network error), **When** the next auto-save interval fires, **Then** the system retries the save without displaying an error to the user (silent retry).

---

### User Story 4 – Bilingual & RTL/LTR Layout (Priority: P2)

An Arabic-speaking applicant uses the wizard entirely in RTL Arabic. All labels, placeholders, error messages, progress indicators, and buttons are in Arabic, and the layout mirrors correctly (progress bar reads right-to-left, Back/Next buttons swap sides, icons with directional meaning flip).

**Why this priority**: Arabic RTL is the default platform language (PRD §1) and government users primarily operate in Arabic.

**Independent Test**: Can be tested by switching the locale to `ar` and completing all 5 steps, verifying that no English text is visible, no layout element is left-aligned incorrectly, and directional icons (chevrons, arrows) flip.

**Acceptance Scenarios**:

1. **Given** the locale is `ar`, **When** the wizard renders, **Then** the `dir="rtl"` attribute is set on the wizard container, all text is sourced from Arabic translation files, and no hardcoded English strings are visible.
2. **Given** the locale is `ar`, **When** the applicant navigates between steps, **Then** the Back button appears on the right and the Next button on the left (logical end/start).
3. **Given** the locale toggles from `ar` to `en` mid-session, **When** the layout re-renders, **Then** all wizard data is preserved, the layout flips to LTR immediately, and no data is lost.

---

### User Story 5 – Step Navigation & Progress Indicator (Priority: P2)

The horizontal progress bar at the top of the wizard clearly shows which steps are completed (check-mark), which is current (highlighted), and which are upcoming (muted). The applicant can click on any completed step to go back and edit it without losing data entered in later steps. Clicking an upcoming (not-yet-reached) step has no effect.

**Why this priority**: Clear progress feedback and non-linear backward navigation are standard UX expectations for multi-step government forms.

**Independent Test**: Can be tested by completing Steps 1–3, clicking on Step 1 in the progress bar, editing a field, and then clicking "Next" twice to return to Step 3 — verifying that Step 3 data is still intact.

**Acceptance Scenarios**:

1. **Given** the applicant is on Step 3, **When** they look at the progress bar, **Then** Steps 1 and 2 show a completed state (check-mark icon), Step 3 shows the active state, and Steps 4–5 show the future/muted state.
2. **Given** the applicant is on Step 4, **When** they click Step 2 in the progress bar, **Then** the wizard navigates to Step 2 and all previously entered Step 4 data is preserved in the Zustand store.
3. **Given** the applicant is on Step 3, **When** they click Step 5 in the progress bar, **Then** nothing happens (Step 5 is not yet reachable).

---

### User Story 6 – Step-Level Validation Prevents Advancement (Priority: P1)

Each step independently validates its fields using Zod schemas. The applicant cannot click "Next" until all required fields on the current step pass validation. Per-field inline error messages appear on blur or on attempted Next-click.

**Why this priority**: Without per-step validation, invalid data could silently reach the Review step or the backend, causing submission failures with unclear errors.

**Independent Test**: Can be tested by clicking "Next" on Step 3 (Personal Info) with the National ID field empty — the system must display an error under the National ID field and keep the user on Step 3.

**Acceptance Scenarios**:

1. **Given** the National ID field on Step 3 is empty, **When** the applicant clicks "Next", **Then** an error message appears beneath the field and focus is moved to the invalid field; the wizard does not advance.
2. **Given** all required fields on Step 3 are valid, **When** the applicant clicks "Next", **Then** the wizard advances to Step 4 without any field errors.
3. **Given** the applicant blurs an email field with an invalid format, **When** the blur event fires, **Then** an inline error appears immediately without requiring a Next-click.

---

### User Story 7 – Review & Submit Step (Priority: P1)

Step 5 presents a read-only summary of all data entered across Steps 1–4, grouped by step. Each group has an "Edit" link that jumps back to that step. A terms declaration checkbox must be checked before the "Submit Application" button becomes active.

**Why this priority**: The Review step is a regulatory requirement (PRD §11.1, Field 15: Data Accuracy Declaration) and reduces submission errors by giving applicants a final chance to verify data.

**Independent Test**: Can be tested by completing Steps 1–4, reaching Step 5, clicking "Edit" next to Step 2, changing the license category, returning to Step 5, and verifying that the updated category appears in the summary.

**Acceptance Scenarios**:

1. **Given** the applicant is on Step 5, **When** the page renders, **Then** all data from Steps 1–4 is displayed in a read-only summary with no editable fields.
2. **Given** the declaration checkbox is unchecked, **When** the Submit button is visible, **Then** the Submit button is disabled.
3. **Given** the applicant clicks "Edit" next to the Personal Info section, **When** they return to Step 3 and change a field and click "Next" through to Step 5, **Then** the Step 5 summary reflects the updated value.
4. **Given** the declaration checkbox is checked and all data is valid, **When** the applicant clicks "Submit Application", **Then** a loading state appears on the button and the form is submitted to the backend.

---

### Edge Cases

- What happens when an applicant already has an active application (PRD §9.2 Hard Stop: one active application per applicant)? The wizard should redirect them to their existing application with an explanatory message instead of allowing creation of another draft.
- What happens when the backend auto-save call returns a 4xx/5xx error? The system must silently retry on the next interval; if three consecutive saves fail, show a non-blocking warning banner ("Could not auto-save. Changes will be saved when you click Next.").
- What happens when a user navigates away from the wizard mid-session using the browser's back button? A confirmation dialog must warn them that unsaved changes may be lost (if the last auto-save was more than 30 seconds ago).
- What happens if the date of birth entered in Step 3 conflicts with the category chosen in Step 2 (e.g., user changed DOB after step 2)? Step 5 Review must re-validate age eligibility and show an error directing the user to fix the conflict.
- What happens on very slow connections when the wizard is partially loaded? Steps 4 and 5 must not be rendered until the applicant actually reaches them (lazy loading per step) to reduce initial bundle size.
- What happens when a field like "Region" or "Preferred Center" depends on a backend lookup (dropdown populated via API call)? A loading skeleton must appear while the data loads, and a retry button must appear if the call fails.

---

## Requirements

### Functional Requirements

- **FR-001**: The wizard MUST present exactly 5 sequential steps: (1) Service Selection, (2) License Category, (3) Personal Information, (4) Application Details, (5) Review & Submit.
- **FR-002**: Step 1 — Service Selection MUST display 8 clickable service cards: New License Issuance, License Renewal, Lost/Damaged Replacement, Category Upgrade, Test Retake, Appointment Booking, Application Cancellation, Document Download.
- **FR-003**: Step 2 — License Category MUST display 6 category cards (A, B, C, D, E, F) and MUST perform client-side age validation against the applicant's date of birth (from Step 3 or their profile), blocking selection of ineligible categories and showing the reason.
- **FR-004**: Step 3 — Personal Information MUST include exactly 9 fields: National ID / Residence Number, Date of Birth, Nationality, Gender, Mobile Number, Email Address, Address, City, Region.
- **FR-005**: Step 4 — Application Details MUST include: Applicant Type (Citizen / Resident), Preferred Execution Center, Test Language (AR/EN), Appointment Preference (Morning/Afternoon/Evening or No Preference), Special Needs / Accessibility Declaration (boolean with optional note).
- **FR-006**: Step 5 — Review & Submit MUST render a read-only summary of all data from Steps 1–4 with an "Edit" link per section, a Data Accuracy Declaration checkbox (required), and a "Submit Application" button that is disabled until the checkbox is checked.
- **FR-007**: Application state MUST be managed via a Zustand store that persists wizard data across step navigation and survives page refreshes (via sessionStorage or localStorage hydration).
- **FR-008**: The wizard MUST auto-save the draft to the backend (`PATCH /api/v1/applications/{id}`) every 30 seconds when there are unsaved changes, without user interaction and without interrupting the UI.
- **FR-009**: A horizontal step progress indicator MUST be displayed at the top of the wizard, showing completed steps, the current step, and upcoming steps. Completed steps MUST be clickable to allow backward navigation without data loss.
- **FR-010**: All step fields MUST be validated with Zod schemas integrated with React Hook Form. Inline error messages MUST appear per field on blur or on failed Next-click. The Next button MUST be disabled (or trigger validation on click) when required fields are missing or invalid.
- **FR-011**: The wizard MUST be fully responsive across mobile (320px+), tablet, and desktop viewports.
- **FR-012**: The wizard MUST support both RTL (Arabic) and LTR (English) layouts; all text MUST come from `next-intl` translation files (`public/locales/ar/` and `public/locales/en/`). No text may be hardcoded.
- **FR-013**: The wizard MUST support both dark and light themes via `next-themes`.
- **FR-014**: The "Submit Application" action MUST call the backend API to finalize the application (status → Submitted) and MUST redirect the applicant to the application detail/tracking page on success.
- **FR-015**: If an applicant already has an active non-Draft application, the wizard MUST detect this (via API or frontend state) and redirect to the existing application with an explanatory message instead of allowing a second submission.
- **FR-016**: Dropdown fields that require backend data (e.g., Preferred Center, Region, Nationality) MUST display a loading skeleton while fetching and a retry option if the fetch fails.
- **FR-017**: The wizard MUST display a browser-leave confirmation dialog when the applicant attempts to navigate away with unsaved changes.

### Key Entities

- **WizardStore**: Client-side Zustand state containing `applicationId`, `currentStep`, `completedSteps[]`, `lastSaved` timestamp, and one sub-object per step (`serviceSelection`, `licenseCategory`, `personalInfo`, `applicationDetails`). Persisted to sessionStorage to survive refresh.
- **Application (Draft)**: Backend entity (from Feature 012) identified by `applicationId` generated on first wizard save. Contains all 21 PRD fields (§11.1). The wizard reads/writes this entity via the `/api/v1/applications` API.
- **ServiceType**: Enum of 8 MVP services rendered as cards in Step 1.
- **LicenseCategoryCard**: A UI entity for Step 2 representing a category (code, Arabic name, English name, minimum age, icon, description, upgrade path).
- **LookupData**: Data fetched from backend for dropdowns — ExamCenter list, Nationality list, Region/City lists.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: An applicant with no prior active application can start, complete, and submit the wizard in under 8 minutes on a desktop browser with average internet speed.
- **SC-002**: Age validation blocks 100% of ineligible category selections at the client layer before any API call is made.
- **SC-003**: Auto-save completes with no perceived UI interruption; the auto-save network call MUST finish within 2 seconds under normal conditions.
- **SC-004**: All 5 steps render correctly in both Arabic RTL and English LTR layouts, with zero visible layout breakage on viewports from 320px to 1440px width.
- **SC-005**: On attempted submission with invalid data in any step, the wizard navigates to the first step containing an error and highlights it — the applicant is never redirected away without understanding the issue.
- **SC-006**: Clicking "Submit Application" with valid data results in the application appearing in the applicant's dashboard with status "Submitted" within 3 seconds.
- **SC-007**: A returning applicant with a saved draft resumes from the correct step with all fields pre-populated, within 2 seconds of page load.
- **SC-008**: The wizard passes WCAG 2.1 AA accessibility checks — all form fields have associated labels, all error messages are announced to screen readers, and tab order follows logical reading order in both RTL and LTR.

---

## Assumptions

- The backend Application CRUD API (Feature 012) is fully implemented and available, specifically: `POST /api/v1/applications` (create draft), `PATCH /api/v1/applications/{id}` (update draft fields), `POST /api/v1/applications/{id}/submit` (or equivalent finalize action), and `GET /api/v1/applications/{id}` (load existing draft).
- The authenticated user's JWT token is available in the frontend auth store (Feature 011) and is automatically attached to all API requests via the Axios interceptor.
- Age validation on Step 2 uses the date of birth either from the user's profile (pre-filled) or from the value entered in Step 3. Since Step 3 comes after Step 2, the wizard will use the profile's DOB for the initial Step 2 validation; if the applicant changes DOB in Step 3, a re-validation is triggered when they reach the Review step.
- Minimum ages per category are fetched from the backend (exposed as a public configuration endpoint or bundled in the license category lookup response) so they can be updated via SystemSettings without a frontend deploy.
- The list of available Exam Centers, Regions, and Cities is fetched from the backend via lookup endpoints. These lists are assumed to be relatively static and can be cached in React Query for the duration of the wizard session.
- The wizard only supports the "New License Issuance" service for full 5-step flow in Feature 013 MVP. Other services (Renewal, Replacement, etc.) will have dedicated or simplified wizard variants in later features; Step 1 service cards for non-new-issuance services will navigate to coming-soon pages or existing feature pages.
- Document upload (Stage 02 per PRD §8.3) is handled in a separate feature/page after submission; the wizard itself does not include a document upload step.
- Mobile phone numbers and applicant profile data (name, DOB) may be pre-populated from the user profile retrieved after login, but all fields remain editable by the applicant within the wizard.
- The wizard does not perform real payment or appointment booking — those are separate feature flows triggered after submission.
