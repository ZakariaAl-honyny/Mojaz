# Feature Specification: 019-theory-test

**Feature Branch**: `019-theory-test`
**Created**: 2026-04-06
**Updated**: 2026-04-09
**Status**: Draft

## Summary

Theory test recording system where an Examiner records the score and result (Pass/Fail) for an applicant's theory test (Stage 06 in the new license issuance workflow). The system tracks all attempt history, enforces a configurable maximum attempt limit (`MAX_THEORY_ATTEMPTS`, default: 3), and applies a mandatory cooling period (`COOLING_PERIOD_DAYS`, default: 7) between retakes. Upon reaching the maximum allowed attempts, the application transitions to a terminal rejected state. All configurable thresholds are read from `SystemSettings` and never hardcoded.

---

## User Scenarios & Testing

### User Story 1 — Examiner Records a Passing Theory Test Result (Priority: P1)

As an Examiner, I want to record a passing theory test score for an applicant so that the application automatically advances to the Practical Test stage and the applicant is notified of their success.

**Why this priority**: This is the core happy-path action in Stage 06. Without it, no application can progress through the workflow. Every other story depends on a result being recorded first.

**Independent Test**: Can be fully tested by submitting a score at or above the configurable pass threshold via the result recording endpoint, verifying the application status changes to `PracticalTestPending`, and confirming a pass notification is dispatched.

**Acceptance Scenarios**:

1. **Given** an application in the `TheoryTesting` stage on its first attempt, **When** the Examiner records a score ≥ `MIN_PASS_SCORE_THEORY` (from `SystemSettings`, default: 80), **Then** application status transitions to `PracticalTestPending`, a new `TheoryTest` record is created with `IsPassed = true`, and a pass notification (Email + SMS + Push) is sent to the applicant.
2. **Given** an application in the `TheoryTesting` stage, **When** the Examiner submits a result for an application that is NOT in `TheoryTesting` stage, **Then** the request is rejected with an error indicating the application is not eligible for theory test recording.
3. **Given** an application in the `TheoryTesting` stage, **When** a non-Examiner role (e.g., Receptionist) attempts to record a result, **Then** the request is rejected with an authorization error.

---

### User Story 2 — Examiner Records a Failing Theory Test Result (Priority: P1)

As an Examiner, I want to record a failing theory test score so that the attempt count is incremented and the applicant is notified about the cooling period before they can reschedule.

**Why this priority**: Failures are statistically common and their correct handling (attempt tracking + cooling period) is a core regulatory requirement. Incorrect handling corrupts the application lifecycle.

**Independent Test**: Can be fully tested by submitting a score below the pass threshold, verifying the attempt count increments, the application remains in `TheoryTesting` stage with status `RetakeRequired`, and a fail notification with cooling period information is dispatched.

**Acceptance Scenarios**:

1. **Given** an application in `TheoryTesting` stage with `AttemptCount < MAX_THEORY_ATTEMPTS`, **When** the Examiner records a score < `MIN_PASS_SCORE_THEORY`, **Then** a `TheoryTest` record is created with `IsPassed = false`, the application `AttemptCount` increments by 1, application status changes to `RetakeRequired`, and a fail notification (Email + SMS + Push) is sent with retake eligibility date.
2. **Given** a failed result was just recorded, **When** the system calculates the retake eligibility, **Then** the earliest retake date = `FailedAt + COOLING_PERIOD_DAYS` days.

---

### User Story 3 — Maximum Attempts Reached: Application Rejected (Priority: P1)

As an Examiner recording the final allowed theory test result (attempt = `MAX_THEORY_ATTEMPTS`), I want the system to automatically mark the application as rejected when the result is a fail, so that the applicant is clearly informed and cannot continue without starting a new application.

**Why this priority**: This is a non-negotiable regulatory enforcement rule. If unimplemented, applicants could attempt the test indefinitely, violating government regulations.

**Independent Test**: Can be fully tested by seeding an application already at `AttemptCount = MAX_THEORY_ATTEMPTS - 1`, recording a failing result, and verifying the application transitions to `Rejected` with reason `MaxTheoryAttemptsReached`.

**Acceptance Scenarios**:

1. **Given** an application with `AttemptCount = MAX_THEORY_ATTEMPTS - 1` (the final allowed attempt), **When** the Examiner records a failing score, **Then** `AttemptCount` is incremented to `MAX_THEORY_ATTEMPTS`, the application status is set to `Rejected` with reason `MaxTheoryAttemptsReached`, and a rejection notification is sent to the applicant.
2. **Given** an application already in `Rejected` status due to `MaxTheoryAttemptsReached`, **When** any user attempts to record another theory test result, **Then** the request is rejected with a clear error: "Maximum theory test attempts have been reached for this application."
3. **Given** a rejection due to max attempts, **When** the applicant wants to retry, **Then** they must submit a brand-new application (this one is permanently closed).

---

### User Story 4 — Cooling Period Enforcement on Retake Booking (Priority: P2)

As an applicant who failed the theory test, I want to see my earliest retake eligibility date and be blocked from booking before that date, so that I can plan accordingly.

**Why this priority**: The booking gate check is a prerequisite for the appointment booking feature (Feature 016) to function correctly in retake scenarios. However, the primary recording logic (P1 stories) can be tested and delivered first.

**Independent Test**: Can be tested independently by calling the theory test appointment booking endpoint within and after the cooling period window and verifying the correct block/allow responses.

**Acceptance Scenarios**:

1. **Given** a failed theory test recorded today, **When** the applicant or system attempts to book a theory test retake before `COOLING_PERIOD_DAYS` have elapsed since the last `ConductedAt` date, **Then** booking is blocked with a message indicating the earliest eligible date.
2. **Given** `COOLING_PERIOD_DAYS` have elapsed since the last failed test, **When** the applicant books a retake theory test appointment, **Then** the booking succeeds, a new appointment is created, and the attempt count on the next result recording will increment correctly.
3. **Given** an applicant with 0 theory test attempts (first attempt), **When** they attempt to book a theory test, **Then** no cooling period check is applied and booking proceeds normally (subject to other Gate 3 checks).

---

### User Story 5 — View Theory Test Attempt History (Priority: P2)

As an applicant or Examiner, I want to see the full history of theory test attempts for a given application so that I can review scores, dates, and results without ambiguity.

**Why this priority**: Transparency and auditability are core to the platform. Both applicants and staff rely on history to track progress and verify compliance.

**Independent Test**: Can be tested by creating multiple theory test records for a single application and calling the history endpoint, verifying all records are returned in chronological order with correct data.

**Acceptance Scenarios**:

1. **Given** an application with 2 recorded theory test attempts, **When** an Examiner or the owning applicant calls the history endpoint, **Then** both attempt records are returned in chronological order (oldest first), each containing: `AttemptNumber`, `Score`, `IsPassed`, `ConductedAt`, `ExaminerId`, `Notes`.
2. **Given** an application with no theory test attempts recorded, **When** the history endpoint is called, **Then** an empty list is returned with a 200 OK status.
3. **Given** an applicant requesting history for an application that belongs to a different applicant, **When** the endpoint is called, **Then** it returns a 403 Forbidden error.

---

### Edge Cases

- **Absent applicant**: If the applicant is absent from a scheduled theory test, the Examiner records the result with `IsAbsent = true`. This counts as an attempt (to prevent indefinite no-shows that hold slots). Cooling period still applies.
- **Score at exact pass threshold**: A score exactly equal to `MIN_PASS_SCORE_THEORY` (e.g., 80) counts as a **pass**, not a fail (boundary inclusive).
- **System default fallback**: If `MIN_PASS_SCORE_THEORY` is not found in `SystemSettings`, the system defaults to 80 and logs a warning. It must NEVER fail silently with a wrong value.
- **Concurrent result submission**: If two requests attempt to record a result for the same application simultaneously, only one succeeds. The second receives an error: "A result has already been recorded for this test session."
- **Cooling period not yet elapsed at booking time**: The check occurs at booking time (appointment creation), not at result recording time. Recording a result never checks the cooling period.
- **Notes field**: Optional free-text field for the Examiner to annotate observations. Maximum 500 characters.

---

## Requirements

### Functional Requirements

- **FR-001**: The system MUST expose `POST /api/v1/theory-tests/{appId}/result` for Examiners to submit a theory test score and result.
- **FR-002**: The system MUST expose `GET /api/v1/theory-tests/{appId}/history` to return all theory test attempt records for a given application, accessible by the owning Applicant and any Examiner or Manager.
- **FR-003**: On every result submission, the system MUST read `MIN_PASS_SCORE_THEORY` from `SystemSettings` to determine pass/fail (never hardcoded).
- **FR-004**: On every result submission, the system MUST increment the application's `TheoryAttemptCount` by 1, regardless of pass/fail outcome.
- **FR-005**: The system MUST enforce `MAX_THEORY_ATTEMPTS` (from `SystemSettings`, default: 3). Any result recording request where the current attempt would exceed the maximum MUST be rejected BEFORE recording.
- **FR-006**: When a result is a pass, the system MUST transition the application stage to `PracticalTestPending`.
- **FR-007**: When a result is a fail AND `AttemptCount < MAX_THEORY_ATTEMPTS`, the system MUST set application status to `RetakeRequired` and retain the stage as `TheoryTesting`.
- **FR-008**: When a result is a fail AND `AttemptCount = MAX_THEORY_ATTEMPTS` (after increment), the system MUST transition the application to `Rejected` with reason `MaxTheoryAttemptsReached`.
- **FR-009**: The system MUST block theory test appointment booking if `COOLING_PERIOD_DAYS` (from `SystemSettings`, default: 7) have not elapsed since the last `ConductedAt` date of a failed or absent attempt.
- **FR-010**: Gate 3 validation MUST be checked before acknowledging a new theory test appointment: medical exam result = Fit and not expired, training complete or exempted, and cooling period elapsed.
- **FR-011**: On a passing result, the system MUST send a notification (Email + SMS + Push) to the applicant with congratulatory message and next-step instructions.
- **FR-012**: On a failing result (non-terminal), the system MUST send a notification (Email + SMS + Push) with the score, fail reason, and earliest retake eligibility date.
- **FR-013**: On a terminal rejection (max attempts reached), the system MUST send a notification (Email + SMS + Push) explaining the rejection reason and that a new application is required.
- **FR-014**: Only users with the `Examiner` role MUST be authorized to call `POST /api/v1/theory-tests/{appId}/result`.
- **FR-015**: An absent applicant (`IsAbsent = true`) MUST be recorded as a failed attempt — the `AttemptCount` increments and the cooling period applies.
- **FR-016**: Every theory test result recording MUST create an entry in the Audit Log containing: `UserId` (Examiner), action `TheoryTestResultRecorded`, `EntityType = Application`, `EntityId = appId`, old/new values (JSON), timestamp, IP, User Agent.

### Key Entities

- **TheoryTest**: Represents a single theory test attempt.  
  Attributes: `Id`, `ApplicationId`, `AttemptNumber`, `Score` (0–100, nullable when `IsAbsent = true`), `IsPassed`, `IsAbsent`, `ExaminerId`, `ConductedAt`, `Notes` (optional, max 500 chars), `CreatedAt`.

- **Application** (updated fields): `TheoryAttemptCount` (integer, default: 0), `CurrentStage` (enum), `Status` (enum).

- **SystemSettings** (read-only by service): Keys `MIN_PASS_SCORE_THEORY`, `MAX_THEORY_ATTEMPTS`, `COOLING_PERIOD_DAYS`.

---

## Success Criteria

- **SC-001**: An Examiner can record a theory test result (pass or fail) in under 60 seconds from opening the result form to receiving confirmation.
- **SC-002**: A passing result reliably transitions the application to the practical test stage — 100% of the time with no manual intervention required.
- **SC-003**: The `MAX_THEORY_ATTEMPTS` limit is enforced without exception; no application can accumulate more theory test records than the configured maximum.
- **SC-004**: The `COOLING_PERIOD_DAYS` gate blocks all retake bookings within the cooling window — 0 false negatives (no retakes allowed before the period).
- **SC-005**: Notifications are delivered (Email + SMS + Push) within 5 minutes of every result recording event, for both pass and fail outcomes.
- **SC-006**: The theory test history endpoint returns all attempts for a given application in chronological order, with correct data, in under 2 seconds.
- **SC-007**: All configurable thresholds (`MIN_PASS_SCORE_THEORY`, `MAX_THEORY_ATTEMPTS`, `COOLING_PERIOD_DAYS`) can be changed via `SystemSettings` without any code deployment, and the new values take effect immediately on subsequent requests.
- **SC-008**: Every theory test result recording event is captured in the Audit Log — 100% traceability.

---

## Assumptions

- Theory test results are recorded manually by the Examiner (no automated scoring system integration in MVP); the Examiner enters the numeric score from a paper-based or digital test sheet.
- Score is a numeric integer in the range 0–100.
- `MIN_PASS_SCORE_THEORY` defaults to 80 if the `SystemSettings` key is missing. The service logs a warning when the default is applied.
- An absent applicant (no-show) is treated identically to a failed attempt for the purpose of attempt counting and cooling period enforcement.
- The cooling period enforcement happens at the appointment booking step (Feature 016), not at result recording. The result recording endpoint has no cooling period check.
- Only one theory test session can be active per application at a time; duplicate recording for the same session is rejected.
- Applicants who reach `MAX_THEORY_ATTEMPTS` must submit an entirely new application; there is no manager override in MVP to reset attempt counts.
- The `TheoryAttemptCount` field lives on the `Application` entity for quick Gate 3 checks; the source of truth for individual attempt details is the `TheoryTests` table.
- Retake fee (if applicable) is handled by the payment feature (Feature 013/015) and is outside the scope of this feature.
- Appointment booking for theory test retakes is handled by Feature 016; this feature only enforces the cooling period gate check logic.
