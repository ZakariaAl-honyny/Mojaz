# Feature Specification: Reports & Analytics System

**Feature Branch**: `028-reports-system`  
**Created**: 2026-04-10
**Status**: Draft  
**Input**: User description: "Operational reporting system with 7 core reports, charts, tables, and export capabilities for management oversight."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Operational Oversight (Priority: P1)

As a **Manager**, I want to see a distribution of applications by their current status so that I can monitor the health of the operational pipeline and identify where volume is concentrated.

**Why this priority**: Core visibility into the system's primary workflow is critical for management.

**Independent Test**: Can be tested by navigating to the Reports Dashboard and verifying the "Applications by Status" donut chart matches the database counts for each status.

**Acceptance Scenarios**:

1. **Given** there are applications in various stages (Draft, Submitted, Approved), **When** a Manager views the Dashboard, **Then** a donut chart displays showing the percentage distribution of these statuses.
2. **Given** a specific "Branch" filter is applied, **When** the Page refreshes, **Then** the chart updates to show only applications belonging to that branch.

---

### User Story 2 - Identifying Bottlenecks (Priority: P1)

As a **Manager**, I want to see a list of "Delayed Applications" that have exceeded the standard processing time so that I can take corrective action on stalled files.

**Why this priority**: Directly impacts the "Application Processing Time < 14 days" strategic goal from the PRD.

**Independent Test**: Can be tested by creating an application and manually backdating its last update, then verifying it appears in the "Delayed Applications" report.

**Acceptance Scenarios**:

1. **Given** applications that have been in their current stage for > 14 days (or the `APPLICATION_VALIDITY_MONTHS` threshold), **When** the Manager views the "Delayed Applications" report, **Then** these applications are listed in a data table.
2. **Given** the list of delayed applications, **When** the Manager clicks on an application ID, **Then** they are navigated to that application's detail page.

---

### User Story 3 - Performance Metrics (Priority: P2)

As an **Admin**, I want to compare the throughput and pass/fail rates of different branches and examiners so that I can ensure quality and consistency across the platform.

**Why this priority**: Essential for regulatory compliance and operational excellence.

**Independent Test**: Can be tested by filtering the "Test Pass/Fail Rates" report by "Examiner" and verifying the calculation matches the recorded test results.

**Acceptance Scenarios**:

1. **Given** test results recorded by Doctor A and Doctor B, **When** the "Employee Activity" report is viewed, **Then** it shows the count of medical exams finalized by each employee.
2. **Given** multiple branches, **When** viewing "Branch Performance", **Then** a bar chart compares the number of applications processed per branch.

---

### User Story 4 - Data Portability (Priority: P2)

As a **Manager**, I want to export report data to CSV so that I can perform further analysis in external tools or share snapshots with stakeholders.

**Why this priority**: Required for stakeholder reporting and archival.

**Independent Test**: Can be tested by applying a filter and clicking "Export CSV", then verifying the resulting file contains the filtered data set.

**Acceptance Scenarios**:

1. **Given** a filtered list of delayed applications, **When** the "Export" button is clicked, **Then** a CSV file is downloaded containing the exact rows and columns shown in the table.

---

### Edge Cases

- **Zero Data State**: How does the chart render when no applications match the filters? (Should show empty state placeholders, not error out).
- **Large Data Volume**: How does the system handle 10,000+ records in the "Delayed Applications" list? (Should utilize TanStack Table pagination and server-side filtering).
- **Unauthorized Access**: If an "Applicant" tries to access `/reports`, they must be redirected to their dashboard or shown a 403 error.
- **Service Type Changes**: If a new service is added to the system, the "Applications by Service" report should automatically include it without code changes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **Access Control**: Entire Reports module and related API endpoints MUST be restricted to users with `Manager` or `Admin` roles.
- **FR-002**: **Status Distribution Report**: MUST provide a donut chart showing the distribution of active applications across all stages (Stage 01 to Stage 10).
- **FR-003**: **Service Distribution Report**: MUST provide a bar chart comparing application volume by service type (New, Renewal, Upgrade, Replacement).
- **FR-004**: **Test Performance Report**: MUST provide pass/fail percentages for Theory and Practical tests, filterable by date and branch.
- **FR-005**: **Delayed Applications Report**: MUST identify applications that have exceeded the configurable processing threshold [NEEDS CLARIFICATION: Is the threshold globally 14 days or stage-specific?] and display them in a searchable table.
- **FR-006**: **Branch/Employee Productivity**: MUST list throughput counts for branches and finalized assessment counts for Examiners/Doctors. [NEEDS CLARIFICATION: Should these include average processing time per employee?]
- **FR-007**: **Issuance Timeline**: MUST provide a line chart showing daily/monthly trends of issued licenses (Stage 10 completion).
- **FR-008**: **Global Filtering**: All reports MUST support filtering by Date Range (From/To), Branch, and License Category.
- **FR-009**: **Export Capabilities**: Users MUST be able to export any report's raw data table to CSV format. PDF export MUST be available for summary dashboards.
- **FR-010**: **Data Display**: MUST use **Recharts** for visualizations and **TanStack Table** for data grids, following the Mojaz Design System (Royal Green theme).

### Key Entities *(include if feature involves data)*

- **ReportData**: A DTO representing the aggregate data returned for a specific report (e.g., Label, Value, Percentage).
- **DelayedApplicationEntry**: A projection of application data including ID, Applicant Name, Status, Days in Current Status, and Assigned Branch.
- **AnalyticalScope**: A value object containing common filter parameters (DateRange, BranchId, CategoryId).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 7 core reports render data in under 2 seconds for a dataset of 5,000 applications.
- **SC-002**: Filters applied to the dashboard correctly refresh all 7 reports within a single unified view.
- **SC-003**: 100% of export attempts generate a valid file containing the exact filtered data set.
- **SC-004**: Users with `Applicant` role are strictly blocked from accessing any `/reports` endpoint or view.
- **SC-005**: All charts and tables are fully responsive and readable on tablet (horizontal) and desktop viewports.

## Assumptions

- **Read-Only Context**: To optimize performance, reports will utilize a read-only DB context or `AsNoTracking()` in EF Core.
- **Real-Time Data**: Reports reflect live application data from the production database without a separate data warehouse for MVP.
- **Standard Threshold**: Unless otherwise specified, the default "Delayed" threshold is 14 days in a single stage.
- **Design Consistency**: Recharts will be styled using the `mojazColors` primary green (`#006C35`).
