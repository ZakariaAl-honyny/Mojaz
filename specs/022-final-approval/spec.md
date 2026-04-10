# Feature Specification: 022 — Final Approval with Gate 4 Comprehensive Validation

**Feature Branch**: `022-final-approval`
**Created**: 2026-04-10
**Status**: Draft
**Input**: "Final approval stage with Gate 4 validation, approve/reject/return actions."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Manager Validates Gate 4 and Approves Application (Priority: P1)

A Manager opens an application that has successfully completed all prior workflow stages (theory passed, practical passed, training complete, payments cleared, ID valid, medical valid, no security blocks). The system displays a comprehensive Gate 4 checklist showing all conditions as green/passed. The Manager reviews the checklist and the full application dossier, then clicks **Approve**. The system records the decision, transitions the application to the next stage (Issuance Payment), and sends a congratulatory notification to the applicant.

**Why this priority**: This is the core happy path. Without the ability to approve a complete dossier, no license can ever be issued. All other user stories depend on this flow being correct first.

**Independent Test**: Can be fully tested by seeding a complete, gate-passing application and performing an approval action — delivering a correctly transitioned application status and a triggered notification.

**Acceptance Scenarios**:

1. **Given** an application where all 7 Gate 4 conditions are satisfied, **When** the Manager opens the final approval screen, **Then** all checklist items show a green/passed indicator and the Approve button is enabled.
2. **Given** a fully passing application, **When** the Manager clicks Approve and optionally adds Manager Notes, **Then** the application status transitions to "Approved / Pending Issuance Payment", `ApprovedBy` and `ApprovedAt` are recorded, and a ManagerNotes entry is saved.
3. **Given** a successful approval, **When** the decision is saved, **Then** the applicant receives a congratulatory notification via all applicable channels (in-app, email, SMS, push) and the AuditLog records who approved and when.

---

### User Story 2 — Manager Rejects an Application After Gate 4 Failure (Priority: P2)

A Manager reviews an application that has been flagged for final review despite failing one or more Gate 4 conditions (e.g., an outstanding security block). The checklist shows the failing condition(s) in red. The Manager determines that the failure is terminal and selects **Reject**, providing a mandatory rejection reason. The system permanently closes the application, notifies the applicant of the rejection with the stated reason, and logs the action.

**Why this priority**: Rejection is the second most critical decision path. It must be clearly distinct from "Return" and must permanently close the application lifecycle.

**Independent Test**: Tested by attempting a rejection action on an application with at least one failing Gate 4 condition and verifying that status transitions to "Finally Rejected" and is non-reversible.

**Acceptance Scenarios**:

1. **Given** an application with a failing Gate 4 condition, **When** the Manager views the checklist, **Then** the failing item(s) are displayed with a red/failed indicator.
2. **Given** the Manager selects Reject, **When** no rejection reason is provided, **Then** the system prevents submission and shows a validation error ("Rejection reason is required").
3. **Given** the Manager submits a rejection with a reason, **When** the decision is saved, **Then** the application status transitions to "Finally Rejected", the applicant is notified with the rejection reason, and the AuditLog records the event.

---

### User Story 3 — Manager Returns Application for Correction (Priority: P2)

An application has a correctable issue (e.g., an expired identity document or an expired medical certificate) that does not warrant permanent rejection. The Manager selects **Return**, specifies the target stage to return the application to (e.g., Document Review, Medical Examination), and adds notes explaining what must be corrected. The application reverts to the specified stage, the applicant is notified and directed to take corrective action.

**Why this priority**: The Return action preserves the application lifecycle for fixable issues, reducing unnecessary rejections and supporting citizen service quality — a key PRD goal.

**Independent Test**: Tested by selecting Return on an application with a correctable failing condition, specifying a target stage, and verifying the application appears in the correct stage queue with the assigned notes.

**Acceptance Scenarios**:

1. **Given** the Manager selects Return, **When** no target stage is selected, **Then** the system prevents submission and shows a validation error ("Return stage is required").
2. **Given** the Manager selects Return with a valid target stage and notes, **When** the decision is saved, **Then** the application status reverts to the appropriate stage status, the application appears in that stage's queue, and the applicant receives a notification explaining what must be corrected.
3. **Given** a Return decision is recorded, **Then** the AuditLog captures the original stage, the target return stage, the returning manager's ID, and the timestamp.

---

### User Story 4 — Gate 4 Blocks Approval When Any Condition Fails (Priority: P1)

A Manager attempts to record an Approve decision for an application while at least one Gate 4 condition is failing (e.g., issuance fee not yet paid, or medical certificate expired). The system must prevent the approval from being saved, regardless of UI state, by enforcing Gate 4 server-side.

**Why this priority**: This is a data-integrity and compliance requirement. Gate 4 must be enforced at the API level — not just the UI — to prevent any bypass.

**Independent Test**: Tested by calling the approval endpoint directly (bypassing UI) with an application that has a failing Gate 4 condition and verifying the server returns an error listing the failed conditions.

**Acceptance Scenarios**:

1. **Given** an application with a failing Gate 4 condition, **When** the approval endpoint is called, **Then** the server returns a `400 Bad Request` response with a structured list of the specific conditions that failed.
2. **Given** all Gate 4 conditions pass, **When** the approval endpoint is called, **Then** the server accepts and records the decision.
3. **Given** the Gate 4 checklist UI, **When** at least one condition is failing, **Then** the Approve button is visually disabled, and a tooltip explains why.

---

### Edge Cases

- What happens when a Manager tries to approve an application that another Manager has already approved or rejected simultaneously? — System must handle concurrent access and return a conflict error.
- What happens when an applicant's ID expires between passing the practical test and reaching final approval? — Gate 4 must detect the expired ID and block approval, even if it was valid at an earlier stage.
- What happens when a security block is added to the applicant's profile after the application entered the final approval queue? — Gate 4 re-check at approval time must catch this.
- What happens if the issuance fee is listed as "paid" but the payment status update is delayed or failed? — Gate 4 should check the canonical payment record, not a cached status.
- What happens if the Manager submits a Return action targeting the current stage? — System should either reject this as invalid or treat it as a no-op with a warning.
- What happens if the Manager Notes field contains special characters or exceeds maximum length? — System must sanitize input and enforce a character limit (e.g., 1000 characters).

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST enforce **Gate 4 validation** before any approval can be recorded. Gate 4 requires ALL of the following conditions to be true simultaneously:
  1. Theory Test result = Passed
  2. Practical Test result = Passed
  3. Security/regulatory status = Clean (no active blocks on the applicant)
  4. Applicant's identity documents are valid (not expired as of the approval date)
  5. Medical certificate is valid (not expired — validity period from `SystemSettings: MEDICAL_VALIDITY_DAYS`)
  6. All required payments are cleared (no pending fees for this application)
- **FR-002**: Gate 4 validation MUST be enforced **server-side** on every approval request, independent of the UI state.
- **FR-003**: The system MUST expose a `POST /api/v1/applications/{id}/finalize` (or equivalent) endpoint that accepts a decision payload: `{ decision: "Approve" | "Reject" | "Return", reason?: string, returnToStage?: string, managerNotes?: string }`.
- **FR-004**: The **Approve** action MUST:
  - Transition the application status to "Approved — Pending Issuance Payment" (moving to Stage 09).
  - Record `ApprovedBy` (Manager's UserId), `ApprovedAt` (UTC timestamp), and `ManagerNotes`.
  - Trigger a congratulatory notification to the applicant (in-app, email, SMS, push where available).
  - Write an `AuditLog` entry.
- **FR-005**: The **Reject** action MUST:
  - Require a non-empty rejection `reason`.
  - Transition the application status to "Finally Rejected" — a terminal state.
  - Record `RejectedBy`, `RejectedAt`, and the `Reason` on the application.
  - Trigger a rejection notification to the applicant including the stated reason.
  - Write an `AuditLog` entry.
- **FR-006**: The **Return** action MUST:
  - Require a non-empty `reason` and a valid `returnToStage` value.
  - Transition the application back to the specified stage (e.g., DocumentReview, MedicalExamination) with an appropriate stage-specific status (e.g., "Pending Document Upload").
  - Record `ReturnedBy`, `ReturnedAt`, `ReturnReason`, and `ReturnToStage`.
  - Trigger a return notification to the applicant explaining what must be corrected.
  - Write an `AuditLog` entry.
- **FR-007**: Only users with the **Manager** role MUST be permitted to call the finalization endpoint. All other roles MUST receive a `403 Forbidden` response.
- **FR-008**: The system MUST provide a **Gate 4 Checklist UI** — a side panel or modal on the application detail screen — that displays each Gate 4 condition with a clear status indicator:
  - Green checkmark: condition met.
  - Red cross: condition not met (with a brief explanation of what is missing).
- **FR-009**: The Approve action button in the UI MUST be visually disabled when any Gate 4 condition is failing, with an accessible tooltip explaining the reason.
- **FR-010**: The checklist MUST be **read-only** and reflect live data — it must not be manually overridable by the Manager.
- **FR-011**: Manager Notes MUST be optional for Approve but encouraged; they MUST be required for Reject and Return (combined with `reason`).
- **FR-012**: The finalization endpoint MUST return a structured `ApiResponse<ApplicationDecisionDto>` regardless of outcome (success or gate failure).

### Key Entities

- **Application**: The central entity. Gains fields: `FinalDecision` (enum: Approve/Reject/Return), `ApprovedBy` (UserId FK), `ApprovedAt` (UTC DateTime), `RejectedBy` (UserId FK), `RejectedAt` (UTC DateTime), `ReturnedBy` (UserId FK), `ReturnedAt` (UTC DateTime), `ReturnToStage`, `DecisionReason`, `ManagerNotes`.
- **Gate4ValidationResult**: A value object (not persisted) returned by the validation service containing a list of `Gate4Condition` items, each with: `ConditionName`, `IsPassed` (bool), `FailureMessage` (nullable string).
- **ApplicationDecisionDto**: The API response shape containing the updated application status, the decision recorded, and the Gate4ValidationResult summary.
- **AuditLog**: Existing entity — receives a new entry for every finalization action (Approve/Reject/Return) with full context.
- **Notification**: Existing entity — receives entries triggered by each decision type.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Gate 4 correctly blocks approval for 100% of applications with at least one failing condition, with the server returning a descriptive error listing each specific failing condition.
- **SC-002**: A Manager can complete an Approve, Reject, or Return action within 3 user interactions from the application detail screen.
- **SC-003**: The Gate 4 checklist UI updates in real time (within 2 seconds of page load) to reflect the true current state of all 6 gate conditions.
- **SC-004**: Application statuses transition deterministically and correctly for all three decision paths: Approve → Stage 09 status, Reject → "Finally Rejected" (terminal), Return → correct prior stage status.
- **SC-005**: Applicants receive decision notifications within 5 minutes of the Manager recording the decision, across all configured channels.
- **SC-006**: Every finalization action (Approve/Reject/Return) is captured in the AuditLog with actor identity, decision type, reason, and UTC timestamp — with zero missing entries.
- **SC-007**: The `POST /finalize` endpoint rejects unauthorized access (non-Manager roles) 100% of the time with an appropriate error response.

---

## Assumptions

- Security block status is stored as a flag or record on the `User` entity (or in a dedicated `SecurityBlocks` table). The Gate 4 check queries this at runtime; there is no caching of security status.
- The "Return" action supports returning to these stages only in MVP: Document Review (Stage 02), Medical Examination (Stage 04), and Theory/Practical Test (Stage 06/07). Returning to Stage 01 is not supported.
- Medical certificate validity period is read from `SystemSettings` key `MEDICAL_VALIDITY_DAYS` (default: 90 days), consistent with the PRD.
- All notifications triggered by final approval decisions are sent through the existing `INotificationService` abstraction, covering in-app, email, SMS, and push channels.
- The "Finally Rejected" state is terminal — no re-opening of the same application is permitted in MVP. A new application must be created.
- Concurrent approval attempts by two Managers on the same application are handled by optimistic concurrency control on the Application entity (rowversion/timestamp).
- Identity document validity is determined by the `IdExpiryDate` field stored on the application/applicant record — no real-time integration with the civil registry in MVP (simulated).
- Payment "cleared" status is determined by querying the `Payments` table for any pending/failed payment records linked to this application (all required fee types must have a Paid status).
