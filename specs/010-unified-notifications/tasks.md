# Tasks: Unified Notification Service

**Input**: Design documents from `/specs/010-unified-notifications/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md

## Phase 1: Setup
**Purpose**: Initialize structure, configs, and dependencies

- [X] T001 [P] Ensure Hangfire, SendGrid, Twilio, and Firebase Admin SDK NuGet packages are installed in `src/Mojaz.Infrastructure/Mojaz.Infrastructure.csproj`
- [X] T002 [P] Ensure Firebase JS SDK package is installed in `frontend/package.json`

---

## Phase 2: Tests
**Purpose**: TDD - write tests for entities, services, and API

- [ ] T003 [P] Write unit tests for Notification and PushToken entities in tests/Mojaz.Domain.Tests
- [ ] T004 [P] Write unit tests for NotificationService logic in tests/Mojaz.Application.Tests
- [ ] T005 [P] Write integration tests for NotificationsController in tests/Mojaz.API.Tests
- [ ] T006 [P] Write unit tests for NotificationBell and NotificationList components in frontend/tests

---

## Phase 3: Core
**Purpose**: Implement Domain, Application, Infrastructure, API, and UI

- [X] T007 [P] Create `Notification` entity in `src/Mojaz.Domain/Entities/Notifications/Notification.cs`
- [X] T008 [P] Create `PushToken` entity in `src/Mojaz.Domain/Entities/Notifications/PushToken.cs`
- [X] T009 [P] Create `EmailLog` and `SmsLog` entities in `src/Mojaz.Domain/Entities/Notifications/`
- [X] T010 Configure EF Core mappings for Notification entities in `src/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T011 Add DbSets to `ApplicationDbContext` and generate EF Core migration for Notifications
- [X] T012 [P] [US1] Create `NotificationRequest` DTO and `NotificationEvent` Enum in `src/Mojaz.Application/DTOs/Notifications/`
- [X] T013 [P] [US1] Create `INotificationService` interface in `src/Mojaz.Application/Services/Notifications/INotificationService.cs`
- [X] T014 [US1] Implement base `NotificationService` (handling synchronous In-App payload only) in `src/Mojaz.Infrastructure/Notifications/NotificationService.cs`
- [X] T015 [US1] Implement `NotificationsController` with GET list, unread-count, and read-all actions in `src/Mojaz.API/Controllers/NotificationsController.cs`
- [X] T016 [P] [US1] Create `notification.service.ts` API client in `frontend/src/services/`
- [X] T017 [P] [US1] Create React Query hook with polling in `frontend/src/hooks/useNotifications.ts`
- [X] T018 [US1] Create `NotificationBell.tsx` component in `frontend/src/components/domain/notification/`
- [X] T019 [US1] Create `NotificationList.tsx` modal/page in `frontend/src/components/domain/notification/`
- [X] T020 [P] [US2] Implement `SendGridService` interface/class in `src/Mojaz.Infrastructure/External/`
- [X] T021 [P] [US2] Implement `TwilioService` interface/class in `src/Mojaz.Infrastructure/External/`
- [X] T022 [P] [US2] Implement `FirebaseService` interface/class in `src/Mojaz.Infrastructure/External/`
- [X] T023 [US2] Create Hangfire `EmailJobProcessor`, `SmsJobProcessor`, `PushJobProcessor` with custom Retry Policies in `src/Mojaz.Infrastructure/Notifications/`
- [X] T024 [US2] Update `NotificationService.SendAsync` to Enqueue Hangfire jobs for external channels in `src/Mojaz.Infrastructure/Notifications/NotificationService.cs`
- [X] T025 [P] [US3] Add `EnableEmail`, `EnableSms`, `EnablePush` preferences flags to the `User` entity or `UserPreferences` in `src/Mojaz.Domain/Entities/`
- [X] T026 [US3] Add preference validation check before enqueuing Hangfire jobs inside `NotificationService.SendAsync`
- [X] T027 [US3] Add preference toggle UI controls in `frontend/src/components/domain/user/PreferencesForm.tsx` (or related settings page)

---

## Phase 4: Integration
**Purpose**: Wire everything together, handle errors, and logging

- [X] T028 [P] Update API documentation (Swagger annotations) in `NotificationsController.cs`
- [X] T029 Run local test with Hangfire Dashboard attached to ensure queue health handling is stable.

---

## Phase 5: Polish
**Purpose**: i18n translations, RTL support, Dark Mode, and Final Validation

- [X] T030 [P] Verify all RTL (Arabic) notification templating renders correctly on the frontend (`NotificationList.tsx`).
- [ ] T031 Add i18n translations for notification messages and UI in public/locales/
- [ ] T032 Verify Dark Mode support for NotificationBell and NotificationList components
- [ ] T033 Final end-to-end validation of the multi-channel notification flow
