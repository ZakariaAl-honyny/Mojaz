# Tasks: SMS Delivery via Twilio

**Input**: Design documents from `/specs/008-sms-twilio/`
**Prerequisites**: plan.md ✅ | spec.md ✅
**Branch**: `feat-008-sms-twilio`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (independent files, no dependency on incomplete task)
- **[US#]**: Which user story this task belongs to
- All paths are relative to repository root

---

## Phase 1: Setup
**Purpose**: Initialize dependencies and libraries.

- [X] T001 Install `Twilio` NuGet package in `src/backend/src/Mojaz.Infrastructure/Mojaz.Infrastructure.csproj`

---

## Phase 2: Tests
**Purpose**: TDD and verification of SMS delivery.

- [X] T007 [P] [US1] Integration test for Twilio SMS sending in `tests/Mojaz.Infrastructure.Tests/Notifications/Sms/TwilioSmsServiceTests.cs`

---

## Phase 3: Core
**Purpose**: Implement the SMS service, templates, and integration with other services.

### Foundational
- [X] T002 Create `SmsStatus` enum in `src/backend/src/Mojaz.Domain/Enums/SmsStatus.cs`
- [X] T003 Create `SmsLog` entity in `src/backend/src/Mojaz.Domain/Entities/SmsLog.cs`
- [X] T004 Define `ISmsService` interface in `src/backend/src/Mojaz.Application/Interfaces/Services/ISmsService.cs`
- [X] T005 Update DbContext to include `DbSet<SmsLog>` and configurations in `src/backend/src/Mojaz.Infrastructure/Persistence/MojazDbContext.cs`
- [X] T006 Generate database migration for SmsLogs table via EF Core CLI.

### US1 — Registration Validation
- [X] T008 [P] [US1] Create `TwilioSettings` model for configuration in `src/backend/src/Mojaz.Infrastructure/Authentication/TwilioSettings.cs`
- [X] T009 [US1] Implement `TwilioSmsService` in `src/backend/src/Mojaz.Infrastructure/Services/TwilioSmsService.cs`
- [X] T010 [US1] Add Twilio dependency injection to `src/backend/src/Mojaz.Infrastructure/Extensions/ServiceCollectionExtensions.cs`
- [X] T011 [US1] Create template constant `SmsTemplates.RegistrationOtp` in `src/backend/src/Mojaz.Shared/Constants/SmsTemplates.cs`
- [X] T012 [US1] Update `AuthService` in `src/backend/src/Mojaz.Application/Services/AuthService.cs` to trigger `SendOtpAsync` for phone registration via Hangfire.

### US2 — Password Recovery Validation
- [X] T013 [P] [US2] Create template constant `SmsTemplates.RecoveryOtp` in `src/backend/src/Mojaz.Shared/Constants/SmsTemplates.cs`
- [X] T014 [US2] Update password recovery flow in `src/backend/src/Mojaz.Application/Services/AuthService.cs` to trigger SMS recovery OTP sending via `ISmsService`.

### US3 — Appointment and Action Notifications
- [X] T015 [P] [US3] Create remaining template constants inside `src/backend/src/Mojaz.Shared/Constants/SmsTemplates.cs` (appointment-confirmed, appointment-reminder, test-result, license-ready)
- [X] T016 [US3] Update `SmsTemplates.cs` to contain actual bilingual payload generators capping at 160 characters.
- [X] T017 [US3] Update `NotificationService` in `src/backend/src/Mojaz.Application/Services/NotificationService.cs` to trigger SMS sending for these events in parallel with Email/Push via Hangfire.

---

## Phase 4: Integration
**Purpose**: Verify end-to-end delivery and edge cases.

- [ ] T018 Verify end-to-end SMS delivery for registration, recovery, and notifications.
- [ ] T019 Verify 160-character limit enforcement across all templates.
- [ ] T020 Verify automatic retry mechanism (2 retries) for transient Twilio API failures.

---

## Phase 5: Polish
**Purpose**: Final cleanup and configuration.

- [X] T021 Code cleanup and refactoring in `TwilioSmsService` for retry and error logging mechanism.
- [X] T022 Update global `appsettings.json` to include placeholder values for Twilio credentials.
