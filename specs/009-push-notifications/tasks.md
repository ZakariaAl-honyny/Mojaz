# Tasks: 009-push-notifications

**Input**: Design documents from `/specs/009-push-notifications/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup
**Purpose**: Initialize structure, configs, and dependencies

- [X] T001 [P] Install FirebaseAdmin NuGet package in src/Mojaz.Infrastructure
- [X] T002 [P] Install firebase npm package in frontend
- [X] T003 Create PushToken entity in src/Mojaz.Domain/Entities/PushToken.cs
- [X] T004 Add PushTokens DbSet and configure EF mapping in src/Mojaz.Infrastructure/Data/ApplicationDbContext.cs
- [X] T005 Create database migration for PushTokens table
- [X] T006 Initialize FirebaseApp with credentials from configuration in src/Mojaz.API/Program.cs
- [X] T007 Define IPushNotificationService interface in src/Mojaz.Application/Interfaces/IPushNotificationService.cs
- [X] T008 [P] Add base firebase-messaging-sw.js in frontend/public/firebase-messaging-sw.js

---

## Phase 2: Tests
**Purpose**: TDD - write tests for entities, services, and API

- [ ] T009 [P] Write unit tests for PushToken entity validation in tests/Mojaz.Domain.Tests
- [ ] T010 [P] Write unit tests for IPushNotificationService implementation in tests/Mojaz.Application.Tests
- [ ] T011 [P] Write integration tests for PushTokensController in tests/Mojaz.API.Tests
- [ ] T012 [P] Write unit tests for usePushNotifications hook in frontend/tests

---

## Phase 3: Core
**Purpose**: Implement Domain, Application, Infrastructure, API, and UI

- [ ] T013 [P] [US1] Create RegisterPushTokenRequest DTO in src/Mojaz.Application/DTOs/Push/RegisterPushTokenRequest.cs
- [ ] T014 [US1] Implement RegisterTokenAsync in src/Mojaz.Infrastructure/Notifications/FirebasePushService.cs
- [ ] T015 [US1] Implement POST /register endpoint in src/Mojaz.API/Controllers/PushTokensController.cs
- [ ] T016 [P] [US1] Create frontend API service in frontend/src/services/push-token.service.ts
- [ ] T017 [US1] Create usePushNotifications hook in frontend/src/hooks/usePushNotifications.ts
- [ ] T018 [US1] Create PushNotificationPrompt component in frontend/src/components/feedback/PushNotificationPrompt.tsx
- [ ] T019 [US1] Integrate PushNotificationPrompt into authenticated dashboard layout
- [ ] T020 [US2] Implement SendToUserAsync using FirebaseMessaging.DefaultInstance in src/Mojaz.Infrastructure/Notifications/FirebasePushService.cs
- [ ] T021 [US2] Ensure SendToUserAsync handles bilingual payloads based on user preference
- [ ] T022 [US2] Handle incoming push messages and click navigation in frontend/public/firebase-messaging-sw.js
- [ ] T023 [P] [US3] Create UnregisterPushTokenRequest DTO in src/Mojaz.Application/DTOs/Push/UnregisterPushTokenRequest.cs
- [ ] T024 [US3] Implement UnregisterTokenAsync in src/Mojaz.Infrastructure/Notifications/FirebasePushService.cs
- [ ] T025 [US3] Implement DELETE endpoint in src/Mojaz.API/Controllers/PushTokensController.cs
- [ ] T026 [US3] Update useAuth hook to call unregister token during logout flow in frontend/src/hooks/useAuth.ts

---

## Phase 4: Integration
**Purpose**: Wire everything together, handle errors, and logging

- [ ] T027 [US2] Trigger IPushNotificationService via Hangfire on milestone events in src/Mojaz.Application/Services/ApplicationService.cs
- [ ] T028 [P] Handle "NotRegistered" exception from Firebase SDK to automatically set PushToken IsActive to false
- [ ] T029 [P] Add error handling and audit logging for push token registration/unregistration actions

---

## Phase 5: Polish
**Purpose**: i18n translations, RTL support, Dark Mode, and Final Validation

- [ ] T030 [P] Document environment variables and config required for FCM in docs/
- [ ] T031 Add i18n translations for PushNotificationPrompt in public/locales/
- [ ] T032 Verify RTL support for notification prompt UI
- [ ] T033 Verify Dark Mode support for notification prompt UI
- [ ] T034 Final end-to-end validation of the push notification lifecycle
