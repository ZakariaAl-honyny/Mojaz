# Feature Specification: 015 — Application Timeline, Status Tracking & Role-Based Dashboards

**Feature Branch**: `015-status-dashboards`
**Created**: 2026-04-09
**Status**: Ready for Planning
**Linked PRD Sections**: §8 (Workflow Stages), §19 (UI Screens by Role), §5 (User Roles), §16 (Notifications), §4 (Tech Stack)

---

## Summary

Build the visual heartbeat of the Mojaz platform: a shared status badge system, a vertical animated 10-stage application timeline, a rich applicant self-service dashboard, role-specific employee dashboards (Receptionist / Doctor / Examiner / Manager / Security), a TanStack Table-powered employee work queue, and a structured application detail view for employees. All components must support RTL/LTR switching, Dark/Light mode, bilingual content, and Framer Motion animations.

---

## User Scenarios & Testing

### User Story 1 — Applicant Tracks Their Application Progress (Priority: P1)

An applicant logs in and immediately sees, on their dashboard, the current state of their active application expressed as a vertical numbered timeline. Each of the 10 workflow stages is rendered with a clear visual state: completed (solid green with checkmark), current (animated pulse), failed (red with icon), or future (muted/gray). The applicant can expand any completed or current stage to see a timestamp, the actor who performed the action, and a short status note.

**Why this priority**: This is the single most important user-facing feature — applicants need transparent, real-time visibility into where their application sits in the 10-stage workflow. Without it, applicant trust collapses and support load spikes.

**Independent Test**: Create a mock application object at each of the 10 stage states and verify the Timeline component renders the correct visual state per stage independent of any API call.

**Acceptance Scenarios**:

1. **Given** an applicant with an active application at Stage 04 (Medical Examination), **When** they visit their dashboard, **Then** stages 01–03 show "Completed" (green with checkmark), stage 04 shows "Current" (animated pulse in brand primary green), and stages 05–10 show "Future" (muted gray outline).
2. **Given** an applicant whose theory test attempt failed, **When** they view the timeline, **Then** Stage 06 (Theory Test) shows a "Failed" state (red indicator with retry icon) while the stage details panel displays the failure reason and next available retry date.
3. **Given** an applicant clicks a completed stage row, **When** the expansion animation completes, **Then** they see: timestamp (e.g., "Completed on 3 Mar 2026"), actor name (e.g., "Dr. Khalid Almutairi"), and a brief outcome note (e.g., "Medically Fit — valid for 90 days").
4. **Given** the UI is in Arabic (RTL mode), **When** the timeline renders, **Then** the stage indicator connector line flows right-to-left, icon positions mirror correctly, and all labels use Arabic locale text with no layout breaking.

---

### User Story 2 — Applicant Uses Their Personal Dashboard (Priority: P1)

An applicant logs in and sees a rich personal dashboard with: a personalized welcome card (name, profile completion indicator), quick-action buttons (New Application, Book Appointment, Pay Fees, Download License), a live list of their active/recent applications with status badges, upcoming appointments in a calendar-style card, and a notification feed showing the latest 5 unread items.

**Why this priority**: The dashboard is the applicant's home base. A well-designed one reduces navigation friction and surfaces the most urgent actions (e.g., "Your documents are missing — complete now").

**Independent Test**: Render the applicant dashboard page with mocked data arrays for 3 applications, 2 appointments, and 5 notifications. Verify all sections render without requiring live API connections.

**Acceptance Scenarios**:

1. **Given** an applicant has 2 active applications and 1 upcoming appointment, **When** they reach the dashboard, **Then** the "Active Applications" section shows 2 cards each with application number, license category badge, current status badge, and a "View Details" link.
2. **Given** the applicant has 3 unread notifications, **When** they view the notification feed widget, **Then** 3 items appear highlighted with an unread dot and a "Mark all as read" action is visible.
3. **Given** the applicant has no active applications, **When** they land on the dashboard, **Then** an illustrated empty-state prompt appears with a "Start Your First Application" call-to-action that links to the application wizard.
4. **Given** the quick-action "Pay Fees" is shown, **When** the applicant clicks it, **Then** they are navigated to the payments page with the relevant application pre-selected.

---

### User Story 3 — Employee Sees Their Role-Specific Work Queue (Priority: P1)

An employee (Receptionist, Doctor, Examiner, or Security) logs in and is presented with a data table showing only the applications relevant to their role. The table supports column sorting, multi-field filtering (by status, stage, date range, category), full-text search by applicant name or application number, and pagination. The employee can click any row to open the Application Detail view.

**Why this priority**: Without a properly scoped, searchable work queue, employees cannot efficiently process applications — the platform's operational throughput depends entirely on this.

**Independent Test**: Mount the `EmployeeApplicationQueue` component with a mocked paginated response of 50 applications and verify that filter controls, sort, and pagination all function correctly with mock data handlers.

**Acceptance Scenarios**:

1. **Given** a Receptionist logs in, **When** the queue loads, **Then** it shows only applications in "Submitted" or "DocumentsIncomplete" stages, sorted by submission date ascending (oldest first = most urgent), with columns: Application #, Applicant Name, Category, Submitted Date, Status.
2. **Given** a Doctor logs in, **When** the queue loads, **Then** it shows only applications in "PendingMedicalExam" stage, with columns: Application #, Applicant Name, Category, Appointment Date, Medical Status.
3. **Given** an employee types "MOJ-2025" in the search field, **When** results update (debounced 300ms), **Then** only rows matching that application number prefix are shown.
4. **Given** the queue has 120 rows, **When** pagination is set to 20 per page, **Then** the footer shows "Page 1 of 6" with prev/next controls and a page-size selector (10/20/50).
5. **Given** an employee selects 3 rows via checkboxes, **When** they choose "Bulk: Mark as Reviewed", **Then** a confirmation modal appears listing the 3 application numbers before the action is confirmed.

---

### User Story 4 — Manager Views KPI Dashboard (Priority: P2)

The Manager role sees a dashboard focused on operational health: stat cards for total applications today / this week / this month, a bar/line chart for applications by status over time, a pie chart for pass/fail ratios (theory and practical separately), a table of delayed/stalled applications (no activity in 7+ days), and a top-performers leaderboard for employees.

**Why this priority**: Managers need aggregate visibility to identify bottlenecks and make operational decisions. This is secondary to individual workflow screens but essential for oversight.

**Independent Test**: Render the `ManagerDashboard` component with mocked summary API data and verify Recharts renders correctly with no real API dependency.

**Acceptance Scenarios**:

1. **Given** a Manager logs in, **When** the dashboard loads, **Then** they see 4 stat cards: "Total Applications (Today)", "Pending Review (Receptionist)", "Pending Medical (Doctor)", "Pending Tests (Examiner)".
2. **Given** the "Applications by Status" chart renders, **When** the manager hovers over a bar, **Then** a tooltip shows the exact count and status name in the active locale.
3. **Given** 5 applications have had no status change in 7+ days, **When** the manager views the "Stalled Applications" widget, **Then** those 5 applications appear highlighted in amber with the number of days stalled shown.
4. **Given** the manager is viewing data, **When** the page is in Arabic mode, **Then** all chart labels, legends, and stat card titles render in Arabic, and all numbers display in Arabic numeral format.

---

### User Story 5 — Employee Reviews Application Detail (Priority: P2)

An employee opens a single application's detail page. The page displays: a sticky header with application number, license category, applicant name, current status badge and a primary action button (e.g., "Approve Documents" for Receptionist); a tabbed body with panels for Applicant Info, Documents (integrated from Feature 014), the 10-stage Timeline, and a Decision / Notes area where the employee records their action and free-text notes.

**Why this priority**: This is the execution surface — where employees actually do their work. It must be information-dense but visually organized.

**Independent Test**: Render `ApplicationDetailPage` with a fully mocked application object at Stage 02 and verify all 4 tabs render their respective content panels including the timeline in the correct state.

**Acceptance Scenarios**:

1. **Given** a Receptionist opens an application in "DocumentsIncomplete" stage, **When** the detail page loads, **Then** the "Documents" tab is the default active tab and the header shows "Action Required: Review Documents" with an amber indicator.
2. **Given** the Receptionist switches to the "Timeline" tab, **When** it renders, **Then** the same visual 10-stage timeline appears showing stage 02 as "Current" and stage 01 as "Completed".
3. **Given** the employee writes a note in the notes field and clicks "Approve", **When** confirmed, **Then** the application status updates, a success toast appears, and the user is navigated back to the queue with the processed application removed.
4. **Given** an employee with the Doctor role opens the detail page for an application in Stage 01 (not their stage), **When** the page renders, **Then** no action buttons appear in the Decision panel — they see read-only info only.

---

### Edge Cases

- What happens when an applicant has **zero** applications? → Empty-state illustration with a call-to-action.
- What happens when a timeline stage has **no timestamp** yet (future stage)? → Render the stage card with placeholder dashes, no timestamp.
- What happens when a **failed stage has been retried and passed**? → Show the failed attempt as a sub-item under the passed stage, collapsable.
- What happens when the employee queue API returns **an empty result set** after filtering? → Render "No applications match your filters" empty state with a reset-filters button.
- What happens when an employee's **session expires** while bulk-actioning rows? → Mid-flight action fails gracefully: show toast "Session expired. Please log in again." and redirect to login without data loss.
- What happens when a **Manager opens a timeline** for an application at Stage 10 (complete)? → All 10 stages shown green/completed, final stage includes the license number and issuance date.
- What happens when a **status badge receives an unknown status string**? → Render a neutral gray "Unknown" badge instead of crashing, and log a warning.
- What happens when the **TanStack Table has >1000 rows** (for very busy days)? → Virtualisation via `@tanstack/react-virtual` ensures only visible rows are rendered in the DOM.

---

## Requirements

### Functional Requirements

#### Shared Status Badge System

- **FR-001**: The `StatusBadge` component MUST map each `ApplicationStatus` enum value to a distinct color and localized label. Exact mappings:
  - `Draft` → Gray (#9CA3AF)
  - `Submitted` → Blue (#3B82F6)
  - `InReview` → Amber (#F59E0B)
  - `PendingPayment` → Orange (#F97316)
  - `DocumentsIncomplete` → Yellow (#EAB308)
  - `Approved` → Green (#10B981)
  - `Rejected` → Red (#EF4444)
  - `Cancelled` → Slate (#6B7280)
  - `Expired` → Rose (#FB7185)
- **FR-002**: `StatusBadge` MUST render in two size variants: `default` (for tables/lists) and `large` (for detail page headers).
- **FR-003**: `StatusBadge` MUST render its label from the active locale's translation keys (`status.draft`, `status.submitted`, etc.) — never hardcoded text.
- **FR-004**: `StatusBadge` MUST be fully accessible: `role="status"`, `aria-label` with the full readable status name.

#### Visual Application Timeline

- **FR-005**: The `ApplicationTimeline` component MUST display all 10 workflow stages in vertical order, each with: stage number, stage name (localized), and a state indicator.
- **FR-006**: Stage states and their visual treatments MUST be:
  - `completed` → Solid green circle with checkmark icon, green connector line to next stage
  - `current` → Animated Framer Motion pulse ring in brand primary (#006C35), "In Progress" label
  - `failed` → Red circle with X icon, red connector line, expandable failure reason
  - `future` → Muted gray circle outline, dashed connector line
- **FR-007**: Each stage card MUST be interactive — clicking a completed or current stage expands a detail panel showing: completion timestamp (in user's locale and timezone), actor name + role, and a short outcome note (max 300 characters).
- **FR-008**: The timeline MUST support a `compact` prop for embedding inside the Application Detail page tabs (hides timestamps, shows only stage icons and status).
- **FR-009**: In RTL mode, the connector line and icon positions MUST mirror correctly (icons on the right, line connects from right side).
- **FR-010**: The timeline MUST be scrollable independently if the page has more content, with a sticky "Current Stage" label at the top when scrolled past it.

#### Applicant Dashboard

- **FR-011**: The Applicant Dashboard MUST display a personalized welcome card with the user's full name, profile photo initial/avatar, and the count of active applications.
- **FR-012**: The dashboard MUST display 4 quick-action buttons: "New Application", "Book Appointment", "Pay Fees", "Download License". Each button MUST be disabled with a tooltip if its prerequisite condition is unmet (e.g., "Download License" is disabled if no license exists).
- **FR-013**: The "Active Applications" section MUST show up to 5 active applications as summary cards, each containing: application number, license category icon+name, current status badge, last-updated timestamp, and a "View Details" link. A "View All" link navigates to the full applications list.
- **FR-014**: The "Upcoming Appointments" section MUST show appointments within the next 14 days sorted by date, each card showing: appointment type (Medical/Theory/Practical), date, time, and branch name. If no upcoming appointments exist, show an empty state with a "Book Appointment" CTA.
- **FR-015**: The "Recent Notifications" feed MUST show the last 5 in-app notifications with: icon (type-based), title, relative timestamp ("2 hours ago"), and read/unread state. A "View All Notifications" link navigates to the full notifications page.
- **FR-016**: The dashboard MUST show 3 stats cards in a row: "Applications Submitted (All Time)", "Tests Passed", "Pending Actions". "Pending Actions" MUST show a count of items needing the applicant's attention (e.g., document upload required, payment due) and be highlighted in amber if > 0.

#### Employee Dashboard (Role-Specific)

- **FR-017**: The Employee Portal MUST render a different dashboard layout based on the authenticated user's role. Role → Dashboard component mapping:
  - `Receptionist` → `ReceptionistDashboard` (pending document queue summary + today's new applications count)
  - `Doctor` → `DoctorDashboard` (today's medical exam appointments list + pending results count)
  - `Examiner` → `ExaminerDashboard` (today's test schedule + pending result entry count)
  - `Manager` → `ManagerDashboard` (KPI cards + charts + stalled applications table)
  - `Security` → `SecurityDashboard` (flagged applications pending security review)
  - `Admin` → Redirected to the Admin Portal (out of scope for this feature)
- **FR-018**: Each role dashboard MUST display at minimum: a personalized greeting with the employee's name and role title, the count of items needing their action today, and a direct "Go to Queue" shortcut button.
- **FR-019**: The Manager Dashboard MUST include 4 KPI stat cards: total applications today, pending review (Receptionist queue size), pending medical exam (Doctor queue size), pending tests (Examiner queue size). Values MUST refresh every 60 seconds automatically (React Query polling).
- **FR-020**: The Manager Dashboard MUST include a Recharts BarChart showing "Applications by Status" for the last 30 days, with bars colored to match status badge colors. Tooltip on hover shows exact count.
- **FR-021**: The Manager Dashboard MUST include a Recharts PieChart for "Theory Test Results (Pass/Fail)" and another for "Practical Test Results (Pass/Fail)" rendered side-by-side.
- **FR-022**: The Manager Dashboard MUST include a "Stalled Applications" table listing applications with no status change in 7+ days, showing: Application #, Applicant Name, Current Stage, Days Stalled (amber at 7+, red at 14+). Configurable threshold to be read from `SystemSettings.STALL_ALERT_DAYS`.

#### Employee Work Queue (TanStack Table)

- **FR-023**: The `EmployeeApplicationQueue` MUST be implemented using **TanStack Table v8** with server-side pagination, sorting, and filtering.
- **FR-024**: The queue MUST display the following columns by default (some columns vary by role):
  - Application # (always visible, linkable)
  - Applicant Name (always visible)
  - License Category (badge)
  - Service Type
  - Current Stage
  - Status (StatusBadge component)
  - Submitted Date
  - Last Updated
  - Actions (row-level action button)
- **FR-025**: The queue MUST support the following filter controls in a collapsible filter panel above the table:
  - Status (multi-select dropdown)
  - License Category (multi-select)
  - Date Range (from / to date pickers) applied to SubmittedDate
  - Stage (dropdown)
  - Full-text search (applicant name OR application number, debounced 300ms) 
- **FR-026**: The queue MUST support row multi-select via checkboxes with a sticky bulk-actions bar that appears (with Framer Motion slide-up animation) when 1+ rows are selected. Bulk actions: `Mark as Reviewed`, `Assign to Self`, `Export Selected (CSV)`.
- **FR-027**: The active filter state MUST be persisted in the URL query parameters so that sharing/bookmarking the URL restores the exact filter+page state.
- **FR-028**: When >1000 rows are expected, row virtualisation MUST be enabled via `@tanstack/react-virtual` so only visible DOM rows are rendered.
- **FR-029**: Each table row MUST show a hover state with a subtle primary-green left border highlight. Clicking any non-checkbox area of a row navigates to the Application Detail page for that application.

#### Application Detail (Employee View)

- **FR-030**: The Application Detail page MUST render a sticky header (max-height 80px) containing: Application Number (copyable), License Category badge, Applicant Name, Current Status badge, and a context-sensitive primary action button whose label and behavior changes based on the employee's role and application stage.
- **FR-031**: The page body MUST be organized into 4 tabs:
  - **Overview**: Applicant personal info (name, national ID masked, DOB, nationality, contact), service details (type, category, preferred center, submission date), and application eligibility summary.
  - **Documents**: Embedded document review panel (Feature 014 integration — renders `DocumentReviewPanel` component).
  - **Timeline**: Full 10-stage timeline in compact mode showing the application's journey.
  - **Decision & Notes**: For employees with action permissions — a notes textarea (max 1000 chars), a status-change action set (Approve / Reject / Request More Info / Escalate), and a read-only audit history of past decisions on this application.
- **FR-032**: The "Decision & Notes" tab MUST show action buttons conditionally based on role-permission matrix (§20 PRD). Non-authorized roles see the notes and audit history in read-only mode only.
- **FR-033**: When an employee submits a decision (e.g., "Approve Documents"), a confirmation modal MUST appear showing: action name, applicant name, application number, and a mandatory notes field (minimum 10 characters). The action is only committed after confirmation.
- **FR-034**: After a successful decision, the system MUST navigate the employee back to their queue and display a success toast notification.

### Design & Performance Requirements

- **FR-035**: All dashboard components MUST implement Framer Motion staggered entrance animations: parent container fades in, child cards slide up with 50ms delay increments between items (implementing `server-parallel-fetching` and `async-suspense-boundaries` patterns).
- **FR-036**: Dashboard data sections MUST use React Suspense boundaries so independent sections load progressively — a loading skeleton shows per-section while data is fetching, not a full-page spinner.
- **FR-037**: Heavy components (Recharts charts, TanStack Table) MUST be loaded with `next/dynamic` with `ssr: false` (implementing `bundle-dynamic-imports`).
- **FR-038**: The TanStack Table search/filter updates MUST be wrapped in `useTransition` + `startTransition` to keep the UI responsive during filter changes (implementing `rerender-transitions`).
- **FR-039**: All dashboard API calls for independent sections MUST be parallelized via `Promise.all()` in RSC (implementing `async-parallel`).
- **FR-040**: The `StatusBadge` component MUST be memoized with `React.memo` since it renders in every table row (implementing `rerender-memo`).
- **FR-041**: All components MUST fully support RTL/LTR (using Tailwind logical properties: `ms-`, `me-`, `ps-`, `pe-`, `start`, `end`) and Dark/Light mode via `next-themes`.

### Key Entities

- **ApplicationSummaryDto**: Represents a list-view application card — Id, ApplicationNumber, ApplicantName, LicenseCategoryCode, ServiceType, CurrentStage, Status, CreatedAt, UpdatedAt.
- **ApplicationTimelineDto**: Represents the full timeline state for one application — array of 10 `TimelineStageDto` objects each with: stageNumber, stageName (AR + EN), state (completed/current/failed/future), completedAt?, actorName?, actorRole?, outcomeNote?.
- **DashboardSummaryDto** (Applicant variant): activeApplicationsCount, pendingActionsCount, upcomingAppointments (list), recentNotifications (list), stats.
- **EmployeeDashboardSummaryDto**: role, itemsNeedingActionCount, roleSummaryData (polymorphic per role — different fields for Receptionist vs. Doctor vs. Manager).
- **ManagerKpiDto**: totalApplicationsToday, receptionistQueueSize, doctorQueueSize, examinerQueueSize, applicationsByStatusChart (series data), theorytestPassRate, practicalTestPassRate, stalledApplications (list).

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: An applicant can open their dashboard and immediately see the current stage of their active application within 2 seconds of page load on a standard broadband connection.
- **SC-002**: All 10 timeline stages render with correct visual states for a given application snapshot — verifiable via automated component test with mocked stage data.
- **SC-003**: Status badges display the correct color for all 9 defined status values — verifiable via visual regression test.
- **SC-004**: Each employee role (Receptionist, Doctor, Examiner, Manager, Security) sees exclusively role-appropriate content — no cross-role data leakage, verifiable by testing with 5 separate user sessions.
- **SC-005**: The employee work queue renders 50 rows and supports filter + sort in under 1 second with no visible jank.
- **SC-006**: Full-text search in the employee queue returns filtered results within 300ms of the user stopping typing (debounce window).
- **SC-007**: The application detail page renders all 4 tabs without additional network waterfalls — all tab content is loaded in the initial page data fetch.
- **SC-008**: Dashboard pages render correctly in both Arabic RTL and English LTR — no text overflow, layout breakage, or directional icon errors — verifiable by visual inspection at both orientations.
- **SC-009**: Dashboard pages render correctly in Dark mode and Light mode with no contrast failures (WCAG AA minimum 4.5:1 ratio for text).
- **SC-010**: The Manager KPI dashboard shows live data updated not older than 60 seconds without requiring a manual page refresh.

---

## Assumptions

- **Auth context is available**: The authenticated user's role is accessible from the auth store (`useAuthStore`) on every page — no additional role-resolution API calls needed at page load.
- **Feature 014 (Document Management) is deployed**: The `DocumentReviewPanel` component from Feature 014 exists and is importable for embedding in the Application Detail's "Documents" tab.
- **Feature 012 (Application CRUD) is deployed**: The backend endpoints for listing applications, fetching application details, and fetching timeline stages exist and return the DTO shapes defined in this spec.
- **Status values are stable**: The`ApplicationStatus` enum values defined in this spec match the backend enum exactly. No additional runtime mapping is needed.
- **Translation keys follow project naming convention**: All translation keys for this feature use the namespaces `dashboard`, `timeline`, `queue`, and `status` in `public/locales/ar/` and `public/locales/en/`.
- **TanStack Virtual is out-of-scope for v1 unless measured**: Virtualisation (`@tanstack/react-virtual`) is implemented as a conditional enhancement — activated only if queue response size exceeds 500 rows. Standard TanStack Table pagination handles all other cases.
- **Recharts is already in the project dependencies** as listed in the PRD tech stack (§4.1).
- **Mobile responsiveness**: All dashboards must be fully functional on screens ≥ 768px (tablet). Screens below 768px (mobile) receive a simplified single-column layout — the timeline and queue remain functional but may collapse columns.
- **Bulk CSV export** is a client-side operation on the currently selected rows' visible data — no backend export endpoint is required in this feature iteration.
- **The `STALL_ALERT_DAYS` system setting defaults to `7`** if not found in `SystemSettings`, since this is a UI-only feature with no setting management in scope.
