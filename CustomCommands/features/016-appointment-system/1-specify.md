# Feature 016: Appointment Booking, Rescheduling, and Reminder System

> **Status:** To be generated via `/speckit.clarify`

## WHAT WE'RE BUILDING:
Complete appointment system with available slots, booking, rescheduling, cancellation, and 24h reminders.

## REQUIREMENTS:
- Available slots generation based on branch capacity
- Booking with conflict check (no double-booking)
- Reschedule within limits
- Cancel with reason
- 24h reminder via Hangfire
- Calendar UI with time slot picker
- Gate 2 validation before booking

## API Endpoints:
- POST /appointments
- GET /appointments/available-slots
- PATCH /appointments/{id}/reschedule
- PATCH /appointments/{id}/cancel

## ACCEPTANCE CRITERIA:
- [ ] Available slots generated correctly
- [ ] Booking prevents conflicts
- [ ] Reschedule works within limits
- [ ] Cancel with reason works
- [ ] 24h reminder sent via Hangfire
- [ ] Calendar UI displays slots
- [ ] Gate 2 validation enforced
