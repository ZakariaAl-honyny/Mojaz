# Research: 016-appointment-system

## 1. Concurrency and Race Conditions in EF Core 8
- **Decision**: Use database-level optimistic concurrency using a `RowVersion` byte array on the Appointment Slot capacity tracker.
- **Rationale**: Ensures 100% prevention of double bookings. Catching `DbUpdateConcurrencyException` allows returning a clean 409 Conflict Response without needing expensive Pessimistic locking or Redis distributed locks.
- **Alternatives considered**: Pessimistic locking (table/row locks).

## 2. Dynamic Calendar Generation vs Pre-computed
- **Decision**: Pre-compute empty slots on demand when queried for a given week/month, and do a LEFT JOIN against booked appointments to calculate capacity.
- **Rationale**: Easier to manage capacity changes and "grandfathering" logic (admin reducing capacity doesn't destroy existing bookings) than pre-inserting millions of rows.
- **Alternatives considered**: Pre-inserting daily empty slot records in a dedicated `TimeSlots` table.

## 3. Frontend UI Aesthetics & Performance (Next.js)
- **Decision**: Strictly apply `vercel-react-best-practices` to the Calendar UI implementation. Specifically: prevent suspense waterfalls by parallelizing SWR queries for slots and branch details, and use `startTransition` or `useDeferredValue` for smooth date picking. Apply `frontend-design` guidelines using a highly polished, interactive layout based on Absher's "Royal Green" scheme with crisp typography (Cairo/Inter) and bold layout choices, abstaining from generic templates.
- **Rationale**: The user explicitly requested leveraging these two skills. This ensures a production-grade, fast, and visually distinct interface.

## 4. Reminder Engine Architecture (Hangfire)
- **Decision**: Use a recurring Hangfire job running periodically (e.g., every 15 minutes) to scan for appointments exactly 24h away (plus a catch-up block down to 12h away).
- **Rationale**: Fits the Mojaz Constitution "Async-First Notifications" rule perfectly. Instead of scheduling millions of individual delayed jobs, scanning batches via a recurring job is more robust for temporary outages.
- **Alternatives considered**: Using `BackgroundJob.Schedule` for 24h in the future upon each booking creation. This is prone to missing updates if appointments are rescheduled.
