---
description: "Task list for 016-appointment-system feature implementation"
---

# Tasks: 016-appointment-system

**Input**: Design documents from `/specs/016-appointment-system/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are not explicitly requested, but Clean Architecture requires xUnit implementations. We will add backend tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure.

- [x] T001 Initialize SystemSettings parameters for SLOTS and RESCHEDULE limits in `src/backend/Mojaz.Infrastructure/Data/Seed/SystemSettingsSeeder.cs`
- [x] T002 Add required translation keys for calendar and appointment logic to `src/frontend/public/locales/ar/appointment.json`
- [x] T003 Add required translation keys for calendar and appointment logic to `src/frontend/public/locales/en/appointment.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Create `AppointmentType` enum in `src/backend/Mojaz.Domain/Enums/AppointmentType.cs`
- [x] T005 [P] Create `AppointmentStatus` enum in `src/backend/Mojaz.Domain/Enums/AppointmentStatus.cs`
- [x] T006 Create `Appointment` entity model in `src/backend/Mojaz.Domain/Entities/Appointment.cs` with `RowVersion` concurrency token
- [x] T007 Configure EF Core mapping for `Appointment` in `src/backend/Mojaz.Infrastructure/Data/Configurations/AppointmentConfiguration.cs`
- [x] T008 Add `DbSet<Appointment>` to `src/backend/Mojaz.Infrastructure/Data/MojazDbContext.cs` and generate a migration internally
- [x] T009 Implement `IAppointmentRepository` and `AppointmentRepository` in Application/Infrastructure layers

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Book an Appointment (Priority: P1) 🎯 MVP

**Goal**: Applicant can browse available slots and book an appointment with conflict prevention.

**Independent Test**: Can be tested by querying available slots and submitting a booking for a specific ApplicationId.

### Implementation for User Story 1

- [x] T010 [P] [US1] Create `AppointmentDto` and `AvailableSlotDto` in `src/backend/Mojaz.Application/DTOs/Appointments/`
- [x] T011 [P] [US1] Create Validation logic for Pre-booking (Gate 2 checks) in a Domain/Application service `AppointmentBookingValidator.cs`
- [x] T012 [US1] Implement `GetAvailableSlotsQuery` and `GetAvailableSlotsQueryHandler` in Application layer
- [x] T013 [US1] Implement `CreateAppointmentCommand` and `CreateAppointmentCommandHandler` in Application layer, handling concurrency exceptions
- [x] T014 [US1] Implement `AppointmentsController` with GET and POST endpoints in `src/backend/Mojaz.API/Controllers/AppointmentsController.cs`
- [x] T015 [P] [US1] Map frontend hooks and backend client calls in `src/frontend/src/services/appointment.service.ts`
- [x] T016 [US1] Create frontend calendar Date Picker component `src/frontend/src/components/domain/appointment/AppointmentCalendar.tsx`
- [x] T017 [US1] Create frontend Time Slot Grid component `src/frontend/src/components/domain/appointment/TimeSlotPicker.tsx`
- [x] T018 [US1] Create frontend Appointment Booking View `src/frontend/src/app/[locale]/(applicant)/applications/[id]/appointment/page.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Reschedule an Appointment (Priority: P2)

**Goal**: Applicant can reschedule their appointment respecting configured limits.

**Independent Test**: Booking a new time slot over an existing appointment cancels the old slot and validates limit logic.

### Implementation for User Story 2

- [x] T019 [P] [US2] Create DTO `RescheduleAppointmentRequest` in Application layer
- [x] T020 [P] [US2] Implement `RescheduleAppointmentCommand` and `RescheduleAppointmentCommandHandler`
- [x] T021 [US2] Add PATCH `/api/v1/appointments/{id}/reschedule` to `AppointmentsController`
- [x] T022 [US2] Add frontend `rescheduleAppointment` binding to `appointment.service.ts`
- [x] T023 [US2] Add Reschedule logic to existing specific Calendar UI flows
- [x] T024 [US2] Implement `CancelAppointmentCommand` and matching PATCH endpoint for soft cancellation functionality mapped alongside rescheduling.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - 24-Hour Reminder (Priority: P2)

**Goal**: System automatically dispatches push, email, SMS reminders exactly 24 hours prior.

**Independent Test**: Time-traveling background execution tests successful dispatch exactly 24 hours out.

### Implementation for User Story 3

- [x] T025 [P] [US3] Create `ProcessAppointmentRemindersJob` inside `src/backend/Mojaz.Infrastructure/BackgroundJobs/`
- [x] T026 [US3] Integrate Notifications via `INotificationService` into the job logic covering appointments 12h-24h out.
- [x] T027 [US3] Register the recurring Hangfire job execution schedule in `src/backend/Mojaz.API/Program.cs` or Bootstrapper.

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T028 [P] Add xUnit tests for `AppointmentBookingValidator` covering Gate 2 validation edges
- [x] T029 Add xUnit tests for `CreateAppointmentCommandHandler` covering `DbUpdateConcurrencyException` scenarios
- [x] T030 Ensure Playwright end-to-end testing script `tests/e2e/appointment_booking.spec.ts` covers success booking flows.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel if needed
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Integrates logically after US1
- **User Story 3 (P2)**: Asynchronous, can run completely parallel to US1/US2.

### Parallel Opportunities

- Enums and API DTO models are marked parallel `[P]`.
- Frontend service configuration can run parallel to backend database development.
- UI Layout framing can run parallel to API Handlers.