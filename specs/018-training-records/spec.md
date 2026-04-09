# Feature Specification: 018-training-records

**Feature Branch**: `018-training-records`
**Created**: 2026-04-06
**Updated**: 2026-04-09
**Status**: Draft
**Input**: User description: "read 1-specify.md and spec.md and PRD.md and use skills frontend-design and vercel-react-best-practices"

## Summary

Training Completion Recording and Exemption Management system — Stage 05 of the 10-stage new license issuance workflow. Employees manually record training hours completed by applicants at accredited driving schools, with hours tracked per license category using configurable `TRAINING_HOURS_{Category}` values from SystemSettings. A Manager-only exemption workflow allows skipping mandatory training for eligible applicants (e.g., international license holders). Gate 3 enforces training completion before any test booking is permitted.

The frontend interface adopts a **refined governmental authority aesthetic**: sharp geometric grid layout, IBM Plex Sans Arabic / IBM Plex Mono typography pairing, Royal Green (#006C35) as the dominant ink on a warm off-white canvas with deep green sidebar accents. Smooth progress arc animations convey training completion in real-time. All data fetching is structured to eliminate waterfall requests using parallel server-side fetching and React Suspense streaming — compliant with Vercel React Best Practices.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Employee Records Training Hours (Priority: P1)

As an authorized Employee (Receptionist or Trainer role), I want to record the training hours completed by an applicant at a certified driving school so that the system tracks their progress toward the required hours and unlocks the testing stage when training is complete.

**Why this priority**: Training completion is Gate 3 — without this, applicants can never advance to Theory or Practical Tests. The entire post-training workflow is blocked without this feature.

**Independent Test**: Can be tested by creating an application in `TrainingRequired` stage, authenticating as Receptionist, calling POST `/api/v1/training-records`, and verifying the status transitions and progress calculation.

**Acceptance Scenarios:**
1. **Given** an application with status `TrainingRequired` or `TrainingInProgress`, **When** Employee records hours that bring the total to ≥ required hours (from SystemSettings `TRAINING_HOURS_{Category}`), **Then** training status is set to `Completed`, application advances to `ReadyForTheoryTest`, and the applicant receives a notification.
2. **Given** training hours recorded, **When** total hours are less than `TRAINING_HOURS_{Category}`, **Then** training status remains `InProgress` and the UI shows a real-time progress arc reflecting the percentage completed.
3. **Given** an applicant already in `Completed` or `Exempted` status, **When** Employee attempts to add more hours, **Then** API returns a 400 error and the UI displays a graceful contextual warning without breaking the form state.

### User Story 2 — Manager Approves Training Exemption (Priority: P2)

As a Manager, I want to review and approve (or reject) a training exemption request for an eligible applicant so they can bypass mandatory training hours and proceed directly to testing without waiting for school completion.

**Why this priority**: Without an exemption path, experienced drivers (e.g., international license holders) are unnecessarily blocked for weeks. This is a regulatory flow but not the primary path, so it is P2.

**Independent Test**: Can be tested by creating an exemption record via POST `/api/v1/training-records/exemption`, then authenticating as Manager and calling PATCH `/approve` or `/reject`, verifying status transitions and applicant notifications.

**Acceptance Scenarios:**
1. **Given** an employee submits an exemption request with a valid supporting document reference, **When** Manager approves it, **Then** training status is set to `Exempted`, application advances to `ReadyForTheoryTest`, and the applicant receives a notification across all channels.
2. **Given** an exemption request is pending, **When** Manager rejects it with a reason, **Then** training status returns to `Required`, the rejection reason is stored, and the applicant is notified so they can enroll in a driving school.
3. **Given** a pending exemption, **When** a non-Manager user attempts to call the approve endpoint, **Then** API returns 403 Forbidden.

### User Story 3 — Applicant Views Training Progress (Priority: P3)

As an Applicant, I want to see my training progress (hours completed vs required, and current status) in my personal timeline so I know exactly how many more hours are needed before I can take my tests.

**Why this priority**: Transparency reduces support requests and builds trust. Applicant cannot modify data — read-only view only.

**Independent Test**: Can be tested by authenticating as an Applicant, calling GET `/api/v1/training-records/{applicationId}`, and verifying only their own record is returned.

**Acceptance Scenarios:**
1. **Given** an applicant views their application timeline, **When** training is InProgress, **Then** they see a visual progress indicator showing hours completed / hours required with a percentage and the current training center name.
2. **Given** training is Exempted, **When** applicant views timeline, **Then** they see an "Exempted" badge with the approval date and approving manager's display name.

### Edge Cases

- **Gate 3 enforcement**: Applicant or Employee attempts to book a Theory or Practical Test before training status is `Completed` or `Exempted` → API returns 400 with message `"Training requirement not fulfilled (Gate 3)"`. The UI shows a prominent locked-state on the test booking step.
- **Missing SystemSettings key**: `TRAINING_HOURS_B` is absent from SystemSettings → System defaults to 30 hours and logs a warning. No silent failures.
- **Zero-hours submission**: Employee submits training session with 0 hours → API returns 400; frontend validates client-side before submit.
- **Duplicate exemption**: A second exemption request is submitted when one is already `Pending` or `Exempted` → API returns 409 Conflict.
- **Exemption document reference**: Supporting document referenced in exemption request must exist in the Documents table (Feature 014) — if not found, API returns 422.

---

## Requirements *(mandatory)*

### Functional Requirements

#### Core Training Record Management

- **FR-001**: `POST /api/v1/training-records` — Employee records a training session or updates total hours for a given `ApplicationId`. Body includes: `ApplicationId`, `SchoolName`, `CertificateNumber`, `HoursCompleted`, `TrainingDate`, `TrainerName`, `Notes`.
- **FR-002**: `GET /api/v1/training-records/{applicationId}` — Retrieve the full training record including history of sessions, total hours, status, and exemption status. Accessible by Employee, Manager, and the owning Applicant (ownership-checked).
- **FR-003**: `PATCH /api/v1/training-records/{id}/hours` — Update hours on an existing session (e.g., correction). Only allowed if status is `Required` or `InProgress`.
- **FR-004**: Training status enum: `Required` (0), `InProgress` (1), `Completed` (2), `Exempted` (3). Status transitions are server-controlled only.
- **FR-005**: When recorded hours ≥ `TRAINING_HOURS_{LicenseCategoryCode}` from SystemSettings, auto-transition status to `Completed` and advance application `CurrentStage` to `ReadyForTheoryTest`.
- **FR-006**: Record stored fields: `ApplicationId`, `SchoolName`, `CertificateNumber`, `TotalHoursRequired` (sourced from SystemSettings at record creation time), `HoursCompleted`, `TrainingDate`, `TrainerName`, `CenterName`, `Notes`, `Status`, `IsExempted`, `ExemptionReason`, `ExemptionDocumentId` (FK → Documents), `ExemptionApprovedBy` (FK → Users), `ExemptionApprovedAt`, `ExemptionRejectionReason`, `CreatedAt`, `UpdatedAt`.

#### Exemption Workflow

- **FR-007**: `POST /api/v1/training-records/exemption` — Employee submits an exemption request on behalf of an applicant. Body: `ApplicationId`, `ExemptionReason`, `ExemptionDocumentId`. Only 1 active exemption per application is allowed.
- **FR-008**: `PATCH /api/v1/training-records/exemption/{id}/approve` — Manager approves the exemption. Sets `IsExempted = true`, status → `Exempted`, application stage → `ReadyForTheoryTest`. Fires all notification channels.
- **FR-009**: `PATCH /api/v1/training-records/exemption/{id}/reject` — Manager rejects with a reason (`RejectionReason` in body). Sets status back to `Required`, notifies applicant.
- **FR-010**: Only Manager role can call approve/reject endpoints. 403 returned for any other role.

#### Gate Check & Audit

- **FR-011**: Gate 3 Check service method `ValidateTrainingGate(applicationId)` — returns pass/fail. Called internally before any appointment booking for Theory or Practical tests. Fails if status is not `Completed` or `Exempted`.
- **FR-012**: `AuditLog` entry created for every create, update, approve, and reject operation. Fields: `UserId`, `Action`, `EntityType = "TrainingRecord"`, `EntityId`, `OldValues (JSON)`, `NewValues (JSON)`, `Timestamp`, `IpAddress`.
- **FR-013**: Notifications on: (1) Training Completed — Applicant notified via In-App + Push + Email + SMS; (2) Exemption Approved — In-App + Push + Email + SMS; (3) Exemption Rejected — In-App + Push + Email + SMS.
- **FR-014**: Only Receptionist and Trainer (Employee roles) can POST/PATCH training records. Manager-only for exemption approve/reject. Applicant is GET-only (own record).

### Frontend Aesthetics & Performance Requirements (via frontend-design skill)

- **FR-015**: The Employee training recording interface MUST adopt a **refined governmental authority aesthetic** — NOT a generic form layout. Design language: geometric grid structure, strong horizontal rules, IBM Plex Mono for numbers/hours (creates a "ledger" feel), IBM Plex Sans Arabic for text content, Royal Green (#006C35) as authority accent on warm off-white (#FAF9F6) background.
- **FR-016**: Training progress MUST be visualized as a **circular arc progress indicator** (SVG-based, CSS-only animation) showing hours_completed / hours_required. The arc strokes from muted to vivid Royal Green as training nears completion. At 100%, a subtle burst micro-animation fires. This is the central UI element — NOT a generic progress bar.
- **FR-017**: The Manager exemption review interface MUST feel deliberate and weighty — a focused card view showing applicant summary, exemption reason, linked document preview badge, and two prominent action buttons (Approve = Royal Green fill, Reject = warm red outline). A translucent overlay confirms the decision with a countdown before final submission.
- **FR-018**: Status badges (`Required`, `InProgress`, `Completed`, `Exempted`) MUST use distinct, high-contrast government-grade color tokens — never generic grey pills. `Completed` = Royal Green; `Exempted` = Government Gold (#D4A017); `InProgress` = blue-tinted neutral; `Required` = warm amber warning.
- **FR-019**: The applicant-facing training stage in the application timeline MUST show a visual "locked/unlocked gate" metaphor: when training is incomplete, the Theory Test step shows a subtle padlock icon with training status; when Completed/Exempted, the padlock unlocks with a smooth CSS transition.

### Frontend Performance Requirements (via vercel-react-best-practices skill)

- **FR-020** (`async-parallel`): The training record page MUST fetch training data, application metadata, and SystemSettings required hours in **parallel** using `Promise.all()` in the Server Component, preventing waterfall requests. Each piece of data is independent and MUST NOT be awaited sequentially.
- **FR-021** (`bundle-dynamic-imports`): The exemption approval modal (heavy rich-text rendering + document preview) MUST be lazy-loaded via `next/dynamic` with a loading skeleton. It is not part of the initial bundle.
- **FR-022** (`server-cache-react`): The SystemSettings lookup for `TRAINING_HOURS_{Category}` MUST be wrapped in `React.cache()` to deduplicate per-request calls (multiple components may read the same setting).
- **FR-023** (`rerender-transitions`): The hours submission form MUST use `startTransition` for the update action so that typing in the hours field remains instantly responsive while the save is in-flight, preventing UI freezes.
- **FR-024** (`rendering-conditional-render`): All conditional rendering of status-dependent UI elements MUST use explicit ternaries (`condition ? A : B`) rather than `condition && A` to avoid accidental rendering of `0` or `false` in the DOM.
- **FR-025** (`rerender-no-inline-components`): `TrainingProgressArc`, `ExemptionCard`, `SessionHistoryRow` MUST be defined as top-level components — never defined inline inside the parent page component — to prevent unnecessary re-mounting on parent state changes.

### Key Entities

- **TrainingRecord**: `Id`, `ApplicationId`, `SchoolName`, `CertificateNumber`, `TotalHoursRequired`, `HoursCompleted`, `TrainingDate`, `TrainerName`, `CenterName`, `Notes`, `Status` (enum), `IsExempted`, `ExemptionReason`, `ExemptionDocumentId`, `ExemptionApprovedBy`, `ExemptionApprovedAt`, `ExemptionRejectionReason`, `CreatedAt`, `UpdatedAt`, `CreatedBy`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Employees can record a training session (school name, hours, date) in under 45 seconds due to the focused, uncluttered interface.
- **SC-002**: The training records page achieves a Largest Contentful Paint (LCP) under 1.2 seconds by parallelizing all server-side data fetches (no waterfall).
- **SC-003**: Gate 3 blocks 100% of test booking attempts where training status is not `Completed` or `Exempted`, with zero false positives.
- **SC-004**: The full exemption workflow (submit → manager review → approve/reject → applicant notified) completes in a single working session without requiring page refreshes.
- **SC-005**: Notifications are dispatched within 5 seconds of training completion or exemption decision.
- **SC-006**: Role-based access is enforced with 0% unauthorized data access: applicants see only their own record, employees see assigned applications, manager-only for exemption approvals.
- **SC-007**: Training status is accurately reflected in the application timeline for applicants, with visual clarity distinguishing all four states.
- **SC-008**: The progress arc animation renders at 60fps via CSS transitions with no JavaScript frame-blocking.

---

## Assumptions

- Training hours required per category are stored in `SystemSettings` using keys `TRAINING_HOURS_A`, `TRAINING_HOURS_B`, `TRAINING_HOURS_C`, `TRAINING_HOURS_D`, `TRAINING_HOURS_E`, `TRAINING_HOURS_F`. Default values match PRD Section 7.3 (A=20, B=30, C=40, D=50, E=50, F=20) if settings are absent.
- Training is conducted at external certified driving schools — the system only records completion outcomes and does not schedule or manage school sessions directly.
- Exemption supporting documents are already uploaded via Feature 014 (Document Management) and referenced by `DocumentId`.
- A single `TrainingRecord` exists per application. Multiple training sessions accumulate into a single record's `HoursCompleted` field (additive updates), rather than creating separate records per session.
- The Trainer role is treated as an Employee role for permissions purposes in MVP; no separate Trainer role entity exists.
- `TrainingDate` recorded is the date of completion at the school as declared by the employee — not the system's `CreatedAt`.
