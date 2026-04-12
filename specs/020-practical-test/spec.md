# Feature Specification: 020-practical-test

**Feature Branch**: `020-practical-test`
**Created**: 2026-04-09
**Status**: Ready for Planning
**Priority**: P1 (Direct continuation after theory test — Stage 07 of workflow)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Examiner Records a Passing Practical Test (Priority: P1)

After an applicant has passed the theory test and completed any required training, they sit for a practical driving test. The Examiner attends, conducts the evaluation, and records the result in the system. When the applicant passes, the system automatically advances the application to the Final Approval stage and notifies the applicant.

**Why this priority**: The pass path is the core happy path of Stage 07 — without it, no application can ever advance to license issuance. It delivers end-to-end value for the majority of applicants.

**Independent Test**: Can be fully tested by having an Examiner submit a passing result for an eligible application and verifying that the application moves to the next stage and a success notification is dispatched.

**Acceptance Scenarios**:

1. **Given** an application in `PracticalTest` stage with a valid appointment and at least one remaining attempt, **When** the Examiner submits a passing result (score at or above the configurable pass threshold), **Then** the application advances to the `FinalApproval` stage, a `PracticalTest` record is created with result = Pass, and the applicant receives a pass notification on all enabled channels.
2. **Given** the pass notification is sent, **When** the applicant views it, **Then** it includes a congratulations message and clear next-steps guidance toward license issuance payment.
3. **Given** a non-Examiner role attempts to submit a practical test result, **When** they submit the request, **Then** the system rejects it with an authorization error.

---

### User Story 2 — Examiner Records a Failing Result with Additional Training Required (Priority: P1)

When an applicant fails the practical test, the Examiner records the failure. Depending on business rules, the system may flag the applicant as requiring additional training hours before they can rebook. This is distinct from the theory test failure path — practical failure triggers a potential additional-training requirement, not just a cooling period.

**Why this priority**: This is the differentiating requirement of Feature 020 versus 019. The additional-training flag on practical failure is a core business rule defined in the PRD and must be captured correctly.

**Independent Test**: Can be tested by submitting a failing result and verifying attempt count increments, the optional additional-training flag is persisted, the applicant is notified with retake eligibility details, and rebooking is gated on both the cooling period and (if flagged) additional training completion.

**Acceptance Scenarios**:

1. **Given** an application in `PracticalTest` stage with remaining attempts, **When** the Examiner records a failing result, **Then** the attempt count increments, the application remains in `PracticalTest` stage, and a fail notification is dispatched.
2. **Given** the Examiner marks the result as requiring additional training, **When** the result is saved, **Then** the application is flagged with `AdditionalTrainingRequired = true` and the required additional hours are recorded.
3. **Given** the application has `AdditionalTrainingRequired = true`, **When** an Applicant attempts to book a new practical test appointment, **Then** the booking is blocked with a message indicating they must complete the additional training hours first.
4. **Given** the application does not have the additional-training flag, **When** an Applicant attempts to book after the cooling period, **Then** booking proceeds normally.
5. **Given** a fail result is submitted with `isAbsent = true`, **Then** absence counts as a failed attempt with all the same consequences.

---

### User Story 3 — Examiner Records the Final Failing Result (Maximum Attempts Exhausted) (Priority: P1)

When an applicant has reached the configured maximum number of practical test attempts, the next failing result closes the application as rejected.

**Why this priority**: Enforcing attempt limits is a non-negotiable regulatory requirement. Without it, applicants could attempt the test indefinitely.

**Independent Test**: Can be tested by submitting a failing result when the attempt count equals the configured maximum and verifying the application transitions to `Rejected` with the correct rejection reason.

**Acceptance Scenarios**:

1. **Given** an application at the maximum allowed practical attempts (configurable, default 3), **When** the Examiner records another failing result, **Then** the application status transitions to `Rejected`, the rejection reason is recorded as `MaxPracticalAttemptsReached`, and the applicant receives a final rejection notification.
2. **Given** the rejection notification is sent, **When** the applicant views it, **Then** it explains all attempts have been exhausted and offers guidance on submitting a new application.
3. **Given** a rejected application, **When** an Examiner attempts to submit another result, **Then** the system rejects it with a validation error indicating the application is closed.

---

### User Story 4 — Applicant is Blocked from Booking During Cooling Period or Max Attempts (Priority: P2)

The system must prevent applicants from booking a new practical test appointment before the cooling period has elapsed or when they have exhausted all attempts.

**Why this priority**: Booking control is a gate that depends on result recording (US1–US3) being complete first. This is a constraint enforcement story, not a new workflow.

**Independent Test**: Can be tested independently by attempting a booking in each blocked state and confirming the appropriate rejection message.

**Acceptance Scenarios**:

1. **Given** an applicant failed a practical test fewer days ago than the cooling period (configurable, default 7 days), **When** they attempt to book a new practical test appointment, **Then** the booking is rejected with a message showing the earliest eligible booking date.
2. **Given** an applicant has reached the maximum attempts, **When** they attempt to book a practical test, **Then** the booking is rejected with a "Maximum attempts reached" message.
3. **Given** an applicant has the `AdditionalTrainingRequired` flag set, **When** they attempt to book even after the cooling period, **Then** the booking is blocked until the additional training flag is cleared.

---

### User Story 5 — View Practical Test History (Priority: P2)

Applicants, Examiners, and Managers can view a paginated history of all practical test attempts for a given application, ordered chronologically.

**Why this priority**: History is a supporting capability for transparency and management oversight. It does not block the core workflow but is essential for applicant self-service and employee review.

**Independent Test**: Can be tested by requesting history for an application with multiple attempt records and verifying correct ordering, pagination, and ownership/authorization enforcement.

**Acceptance Scenarios**:

1. **Given** a valid application with at least one practical test record, **When** the owning Applicant requests the test history, **Then** they receive a paginated list of all attempts ordered by date ascending, including result, score, notes, and any additional-training flags.
2. **Given** a Manager or Examiner requests history for any application, **Then** they receive the full history regardless of ownership.
3. **Given** an Applicant requests history for another applicant's application, **When** the request is submitted, **Then** the system returns `403 Forbidden`.
4. **Given** an application with no practical test records yet, **When** the history is requested, **Then** the system returns an empty list with a `200 OK` response, not an error.

---

### Edge Cases

- What happens when a result is submitted for an application not in `PracticalTest` stage? → System must reject with a clear business rule error.
- What happens when `isAbsent = true` and additional training is also marked? → Absence counts as a failed attempt; additional-training flag may still be recorded.
- What if the score is exactly at the pass threshold? → Should be treated as a pass (pass threshold is inclusive from above).
- What if the same application receives two results submitted simultaneously (race condition)? → Idempotency or optimistic concurrency must prevent duplicate attempt records.
- What if the cooling period setting changes in `SystemSettings` after a failure has been recorded? → The new setting should apply to future checks only.
- What if additional training hours tracked reach 0 or negative? → Validation must prevent saving invalid hours values.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow an authenticated Examiner to record a practical test result (pass or fail) for an application currently in the `PracticalTest` stage, including score, absence flag, optional notes, and vehicle used.
- **FR-002**: The system MUST determine pass/fail automatically based on a configurable pass score threshold (stored in system settings, default 80); a score at or above the threshold counts as a pass.
- **FR-003**: The system MUST allow the Examiner to mark a failing result as requiring additional training, recording the number of additional hours required.
- **FR-004**: The system MUST increment `PracticalAttemptCount` on the application for every recorded result (including absences where `isAbsent = true`).
- **FR-005**: The system MUST transition the application to the `FinalApproval` stage upon a passing result.
- **FR-006**: The system MUST leave the application in `PracticalTest` stage upon a failing result that does not exhaust the maximum attempt count.
- **FR-007**: The system MUST transition the application to `Rejected` status with reason `MaxPracticalAttemptsReached` when a failing result is recorded and the attempt count has reached the configurable maximum (default 3).
- **FR-008**: The system MUST block practical test appointment booking if fewer days have elapsed since the last failed test than the configurable cooling period (default 7 days).
- **FR-009**: The system MUST block practical test appointment booking if the application has the `AdditionalTrainingRequired` flag set (additional training must be completed and cleared first).
- **FR-010**: The system MUST block practical test appointment booking if the application has reached the maximum attempt count.
- **FR-011**: The system MUST send multi-channel notifications (in-app, push, email, SMS) for: (a) passing result, (b) failing result with retake details, (c) final rejection due to exhausted attempts.
- **FR-012**: The system MUST create an audit log entry for every practical test result recording action.
- **FR-013**: The system MUST provide a paginated, date-ascending list of all practical test attempts for an application, accessible to: the owning Applicant (own applications only), Examiners, and Managers.
- **FR-014**: The system MUST reject any result submission for an application not in the appropriate workflow stage with a descriptive error.
- **FR-015**: The system MUST validate all inputs server-side; invalid data (negative score, score > 100, missing required fields) must be rejected before any state change.

### Key Entities

- **PracticalTest**: Represents a single practical test attempt. Key attributes: application reference, result (Pass/Fail), score (0–100), isAbsent flag, additionalTrainingRequired flag, additionalHoursRequired (numeric), vehicle used, notes, recorded by (Examiner reference), recorded date.
- **Application**: The parent entity whose `PracticalAttemptCount`, `CurrentStage`, `Status`, and `AdditionalTrainingRequired` flag are updated as a result of recording practical test outcomes.
- **SystemSettings**: Stores all configurable thresholds: pass score, maximum attempts, cooling period length, additional training defaults — never hardcoded in business logic.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An Examiner can record a practical test result for an eligible application in under 60 seconds from opening the recording form to receiving confirmation.
- **SC-002**: An application transitions to the correct next stage within 2 seconds of a result being successfully submitted, with no manual intervention required.
- **SC-003**: All three notification channels (in-app, push, email/SMS) deliver the result notification to the applicant within 5 minutes of result recording.
- **SC-004**: The booking-block enforcement is 100% reliable — no case where an applicant in a blocked state (cooling period, additional training, max attempts) can successfully book a practical test appointment.
- **SC-005**: Practical test history returns all attempts in chronological order with correct data; zero cases where an applicant can access another applicant's records.
- **SC-006**: All configurable thresholds (pass score, max attempts, cooling period) can be changed by an Admin in system settings and take effect on subsequent operations without any code changes or deployment.
- **SC-007**: Every result recording action produces an audit log entry; audit completeness rate is 100%.

---

## Assumptions

- The 019-theory-test feature (Stage 06) is complete and the `PracticalTest` workflow stage is reachable from it.
- Appointment booking logic already enforces that only applicants with an appointment in `PracticalTest` stage appear on the Examiner's session list; this feature does not re-implement appointment scheduling.
- The additional-training flag clearing mechanism (marking additional training as complete) is handled by the training workflow — this feature only sets the flag and records required hours; clearing it is out of scope for Feature 020.
- Absent means the applicant did not appear for the scheduled test; the Examiner still records the session as a failed/absent attempt.
- Vehicle type recorded is a free-text field in v1; structured vehicle type taxonomy is deferred to a later phase.
- Multi-channel notifications infrastructure is already established from earlier features; this feature raises events, it does not implement the notification delivery system.
- All fees associated with practical test retakes are managed by the payment/fee system already in place; this feature enforces attempt limits but does not initiate payment flows directly.