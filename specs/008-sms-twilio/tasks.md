# Tasks: SMS Delivery via Twilio

**Input**: Design documents from `/specs/008-sms-twilio/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Install `Twilio` NuGet package in `src/Mojaz.Infrastructure/Mojaz.Infrastructure.csproj`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Create `SmsStatus` enum in `src/Mojaz.Domain/Enums/SmsStatus.cs`
- [X] T003 Create `SmsLog` entity in `src/Mojaz.Domain/Entities/SmsLog.cs`
- [X] T004 Define `ISmsService` interface in `src/Mojaz.Application/Interfaces/Outside/ISmsService.cs`
- [X] T005 Update DbContext to include `DbSet<SmsLog>` and configurations in `src/Mojaz.Infrastructure/Data/MojazDbContext.cs`
- [X] T006 Generate database migration for SmsLogs table via EF Core CLI

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Registration Validation (Priority: P1) 🎯 MVP

**Goal**: Applicant requests an OTP during phone registration to activate their account. The system sends a bilingual SMS to verify their identity.

**Independent Test**: Can be independently tested by initiating phone registration and verifying the SMS is received with the correct OTP and format.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

- [X] T007 [P] [US1] Integration test for Twilio SMS sending in `tests/Mojaz.Infrastructure.Tests/Notifications/Sms/TwilioSmsServiceTests.cs`

### Implementation for User Story 1

- [X] T008 [P] [US1] Create `TwilioSettings` model for configuration in `src/Mojaz.Infrastructure/Configuration/TwilioSettings.cs`
- [X] T009 [US1] Implement `TwilioSmsService` in `src/Mojaz.Infrastructure/Notifications/Sms/TwilioSmsService.cs`
- [X] T010 [US1] Add Twilio dependency injection to `src/Mojaz.Infrastructure/DependencyInjection.cs`
- [X] T011 [US1] Create template constant `SmsTemplates.RegistrationOtp` in `src/Mojaz.Shared/Constants/SmsTemplates.cs`
- [X] T012 [US1] Update `AuthService` in `src/Mojaz.Application/Services/AuthService.cs` to trigger `SendOtpAsync` for phone registration using Hangfire or direct background job

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Password Recovery Validation (Priority: P1)

**Goal**: Applicant requests to reset their forgotten password using their phone number. The system sends a recovery OTP.

**Independent Test**: Can be tested by initiating the forgot password flow via phone and receiving the recovery code.

### Implementation for User Story 2

- [X] T013 [P] [US2] Create template constant `SmsTemplates.RecoveryOtp` in `src/Mojaz.Shared/Constants/SmsTemplates.cs`
- [X] T014 [US2] Update password recovery flow in `src/Mojaz.Application/Services/AuthService.cs` to trigger SMS recovery OTP sending via `ISmsService`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Appointment and Action Notifications (Priority: P2)

**Goal**: Applicants receive critical updates about their appointments, test results, and license readiness to ensure they don't miss important stages.

**Independent Test**: Can be tested by triggering a test result or appointment confirmation and verifying the SMS content and cost logging.

### Implementation for User Story 3

- [X] T015 [P] [US3] Create remaining template constants inside `src/Mojaz.Shared/Constants/SmsTemplates.cs` (appointment-confirmed, appointment-reminder, test-result, license-ready)
- [X] T016 [US3] Update `SmsTemplates.cs` to contain actual bilingual payload generators capping at 160 characters.
- [X] T017 [US3] Update `NotificationService` in `src/Mojaz.Application/Services/NotificationService.cs` to trigger SMS fallback/sending for these events in parallel with Email/Push

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T018 Code cleanup and refactoring in `TwilioSmsService` for retry and error logging mechanism
- [X] T019 Update global `appsettings.json` to include placeholder values for Twilio credentials

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Phase 2, independent of US1, but shares the internal logic layout.
- **User Story 3 (P3)**: Follows US1 setup, mostly adds templates to existing framework.

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Models within a story marked [P] can run in parallel

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready
