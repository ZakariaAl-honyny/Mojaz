# Tasks: 016-appointment-system

**Input**: Design documents from `/specs/016-appointment-system/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Phase 1: Setup
**Purpose**: Initialize structure, configs, and dependencies

- [x] T001 Initialize SystemSettings parameters for SLOTS and RESCHEDULE limits in `src/backend/Mojaz.Infrastructure/Data/Seed/SystemSettingsSeeder.cs`
- [x] T002 Add required translation keys for calendar and appointment logic to `src/frontend/public/locales/ar/appointment.json`
- [x] T003 Add required translation keys for calendar and appointment logic to `src/frontend/public/locales/en/appointment.json`

---

## Phase 2: Tests
**Purpose**: TDD - write tests for entities, services, and API

- [X] T004 [P] Write unit tests for `AppointmentBookingValidator` covering Gate 2 validation edges in `tests/Mojaz.Application.Tests`
- [X] T005 [P] Write unit tests for `CreateAppointmentCommandHandler` covering `DbUpdateConcurrencyException` in `tests/Mojaz.Application.Tests`
- [ ] T006 [P] Write integration tests for `AppointmentsController` endpoints in `tests/Mojaz.API.Tests`
- [ ] T007 [P] Write unit tests for `ProcessAppointmentRemindersJob` in `tests/Mojaz.Infrastructure.Tests`
- [X] T008 [P] Run Playwright E2E test `tests/e2e/appointment_booking.spec.ts`

---

## Phase 3: Core
**Purpose**: Implement Domain, Application, Infrastructure, API, and UI

- [x] T009 [P] Create `AppointmentType` enum in `src/backend/Mojaz.Domain/Enums/AppointmentType.cs`
- [x] T010 [P] Create `AppointmentStatus` enum in `src/backend/Mojaz.Domain/Enums/AppointmentStatus.cs`
- [x] T011 Create `Appointment` entity model in `src/backend/Mojaz.Domain/Entities/Appointment.cs`
- [x] T012 Configure EF Core mapping for `Appointment` in `src/backend/Mojaz.Infrastructure/Data/Configurations/AppointmentConfiguration.cs`
- [x] T013 Add `DbSet<Appointment>` to `src/backend/Mojaz.Infrastructure/Data/MojazDbContext.cs` and generate migration
- [x] T014 Implement `IAppointmentRepository` and `AppointmentRepository`
- [x] T015 [P] [US1] Create `AppointmentDto` and `AvailableSlotDto` in `src/backend/Mojaz.Application/DTOs/Appointments/`
- [x] T016 [P] [US1] Create Validation logic for Pre-booking (Gate 2 checks) in `AppointmentBookingValidator.cs`
- [x] T017 [US1] Implement `GetAvailableSlotsQuery` and `GetAvailableSlotsQueryHandler` in Application layer
- [x] T018 [US1] Implement `CreateAppointmentCommand` and `CreateAppointmentCommandHandler` (handling concurrency)
- [x] T019 [US1] Implement `AppointmentsController` with GET and POST endpoints in `src/backend/Mojaz.API/Controllers/AppointmentsController.cs`
- [x] T020 [P] [US1] Map frontend hooks and backend client calls in `src/frontend/src/services/appointment.service.ts`
- [x] T021 [US1] Create frontend calendar Date Picker component `src/frontend/src/components/domain/appointment/AppointmentCalendar.tsx`
- [x] T022 [US1] Create frontend Time Slot Grid component `src/frontend/src/components/domain/appointment/TimeSlotPicker.tsx`
- [x] T023 [US1] Create frontend Appointment Booking View `src/frontend/src/app/[locale]/(applicant)/applications/[id]/appointment/page.tsx`
- [x] T024 [P] [US2] Create DTO `RescheduleAppointmentRequest` in Application layer
- [x] T025 [P] [US2] Implement `RescheduleAppointmentCommand` and `RescheduleAppointmentCommandHandler`
- [x] T026 [US2] Add PATCH `/api/v1/appointments/{id}/reschedule` to `AppointmentsController`
- [x] T027 [US2] Add frontend `rescheduleAppointment` binding to `appointment.service.ts`
- [x] T028 [US2] Add Reschedule logic to existing Calendar UI flows
- [x] T029 [US2] Implement `CancelAppointmentCommand` and matching PATCH endpoint
- [x] T030 [P] [US3] Create `ProcessAppointmentRemindersJob` inside `src/backend/Mojaz.Infrastructure/BackgroundJobs/`
- [x] T031 [US3] Integrate Notifications via `INotificationService` into the job logic
- [x] T032 [US3] Register the recurring Hangfire job execution schedule in `src/backend/Mojaz.API/Program.cs`

---

## Phase 4: Integration
**Purpose**: Wire everything together, handle errors, and logging

- [X] T033 Verify Gate 2 pre-conditions block booking if documents not approved or payment not cleared
- [X] T034 Verify concurrency handling (Optimistic Concurrency) for the last available slot
- [X] T035 Verify 24-hour reminder job triggers correctly across all enabled channels

---

## Phase 5: Polish
**Purpose**: i18n translations, RTL support, Dark Mode, and Final Validation

- [ ] T036 Responsive audit for Calendar UI on mobile (320px+)
- [ ] T037 Accessibility audit (WCAG 2.1 AA) for Date Picker and Time Slot Grid
- [ ] T038 Dark mode audit for all appointment components
- [ ] T039 Final end-to-end validation of booking, rescheduling, and cancellation flows
