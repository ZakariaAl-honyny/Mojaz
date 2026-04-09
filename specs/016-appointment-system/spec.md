# Feature Specification: 016-appointment-system

**Feature Branch**: `016-appointment-system`
**Created**: 2026-04-09
**Status**: Draft

## Summary

Complete appointment system covering slot generation, booking, conflict prevention, rescheduling, cancellation, automated 24-hour reminders, a calendar UI, and Gate 2 pre-booking validation.

## Clarifications

### Session 2026-04-09
- Q: How does the system handle booking attempts that happen at the exact same millisecond for the last available slot? → A: Database constraint (First commit wins): The second request fails with a friendly "Slot unavailable" error.
- Q: What happens if the branch capacity is reduced after slots have already been booked? → A: Grandfather existing bookings: The existing bookings remain valid, but no new bookings are allowed until the count naturally drops below the new capacity.
- Q: What happens if the reminder scheduling service goes down temporarily when the 24h mark arrives? → A: Catch-up processing: The system will dispatch the missed 24h reminder as long as the appointment is > 12 hours away; otherwise it skips it.

## User Scenarios & Testing

### User Story 1 — Book an Appointment (Priority: P1)

As an applicant, I want to book an available appointment slot so that I can attend my required exam or test.

**Why this priority**: Core functionality without which applicants cannot proceed through the licensing process.
**Independent Test**: Can be tested by selecting an available slot in the UI and confirming the appointment is successfully recorded.

**Acceptance Scenarios:**
1. **Given** available slots exist, **When** the applicant books one, **Then** an appointment is created with status `Scheduled` and a confirmation notification is sent.
2. **Given** a slot is already booked by another applicant, **When** attempting to book the same slot, **Then** an error message indicating a conflict is returned.
3. **Given** Gate 2 pre-conditions are not met (e.g., documents not approved), **When** a booking is attempted, **Then** a descriptive error prevents the booking.

### User Story 2 — Reschedule an Appointment (Priority: P2)

As an applicant, I want to reschedule my appointment so that I can choose a more convenient time.

**Why this priority**: Flexibility is needed for applicants, reducing no-shows.
**Independent Test**: Can be tested by selecting a scheduled appointment and picking a new available slot, observing the old slot being freed up.

**Acceptance Scenarios:**
1. **Given** an existing `Scheduled` appointment, **When** rescheduling is requested with a valid new slot, **Then** the old slot is freed and a new appointment is created.
2. **Given** the reschedule limit has been exceeded, **When** rescheduling is attempted, **Then** an error prevents the action.

### User Story 3 — 24-Hour Reminder (Priority: P2)

As an applicant, I want to receive a reminder 24 hours before my appointment so that I don't miss it.

**Why this priority**: Reduces no-show rates systematically.
**Independent Test**: Can be tested by creating an appointment scheduled for exactly 24 hours plus 1 minute from now, and observing a reminder trigger within the expected time frame.

**Acceptance Scenarios:**
1. **Given** a confirmed appointment scheduled for tomorrow, **When** the system runs automated checks, **Then** a push, email, and SMS reminder is dispatched.

---

### Edge Cases
- **Branch Capacity Reductions**: If an admin reduces the capacity for a timeslot below the number of current bookings, existing bookings are "grandfathered in" and remain valid, but no new bookings will be allowed until the count drops below the new capacity.
- **Concurrency & Race Conditions**: If two applicants attempt to book the same last available slot simultaneously, the system relies on database-level constraints. The first commit wins, while the second fails gracefully with a "Slot unavailable" error.
- **System Outages (Reminders)**: If the backend reminder polling service is temporarily down exactly 24 hours before the appointment, it will run catch-up processing when it recovers. It will dispatch the missed 24h reminder as long as the appointment is still more than 12 hours away. If the appointment is closer than 12 hours, the reminder is skipped.
- How is the system handling time zone differences if users travel before their appointment? (Assuming all appointments are in local KSA time).

## Requirements

### Functional Requirements

- **FR-001**: Available slots MUST be generated based on branch capacity settings; each slot MUST define a date, time, duration, and appointment type.
- **FR-002**: System MUST allow creating an appointment and enforce robust conflict prevention to avoid double-booking.
- **FR-003**: System MUST provide a paginated list of available slots filtered by type, date, and branch.
- **FR-004**: System MUST allow rescheduling an appointment to a new slot while strictly enforcing the configured allowed reschedule limit.
- **FR-005**: System MUST allow soft-cancellation of an appointment with a required cancellation reason.
- **FR-006**: System MUST enforce Gate 2 validations (documents approved, medical passed if required, payment cleared) before finalizing any booking.
- **FR-007**: System MUST automatically dispatch reminders across all enabled channels exactly 24 hours prior to the appointment.
- **FR-008**: System MUST provide a frontend calendar UI featuring a date picker and time slot grid that shows slot availability in real-time.
- **FR-009**: System MUST enforce the appointment status lifecycle: Scheduled → Confirmed → Completed | Cancelled | NoShow.
- **FR-010**: System MUST record audit log entries on create, reschedule, and cancel actions, and dispatch notifications on any status change.

### Key Entities

- **Appointment**: Represents a scheduled visit. Key attributes: Application reference, Applicant reference, Type, Scheduled Date/Time, Duration, Location, Status, Assigned Employee, Notes, Cancelled Reason.

## Success Criteria

### Measurable Outcomes
- **SC-001**: 100% prevention of double-booked slots under high concurrency (e.g., tested with 100 simultaneous requests for 1 slot).
- **SC-002**: 95% of applicants can complete the booking flow from available slots selection to confirmation in under 90 seconds.
- **SC-003**: System dispatches 24-hour reminders for at least 99.9% of appointments, sent within a 5-minute window of the exact 24h mark.
- **SC-004**: Reschedule limit policies properly block 100% of attempts beyond the configured maximum count.

## Assumptions

- Branch capacity and slot duration are defined within system configuration settings.
- The maximum allowed reschedule count is defined globally in the system configuration.
- Appointment types are standardized (e.g., WrittenTest, PracticalTest, MedicalTest, PhotoCapture, DocumentVerification).
- All times are handled in UTC in the backend and displayed in the configured local time on the frontend.
