# Tasks: 009-push-notifications

**Input**: Design documents from `/specs/009-push-notifications/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

 - [X] T001 [P] Install FirebaseAdmin NuGet package in src/Mojaz.Infrastructure
 - [X] T002 [P] Install firebase npm package in frontend

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

 - [X] T003 Create PushToken entity in src/Mojaz.Domain/Entities/PushToken.cs
 - [X] T004 Add PushTokens DbSet and configure EF mapping in src/Mojaz.Infrastructure/Data/ApplicationDbContext.cs
 - [X] T005 Create database migration for PushTokens table
 - [X] T006 Initialize FirebaseApp with credentials from configuration in src/Mojaz.API/Program.cs
 - [X] T007 Define IPushNotificationService interface in src/Mojaz.Application/Interfaces/IPushNotificationService.cs
 - [X] T008 [P] Add base firebase-messaging-sw.js in frontend/public/firebase-messaging-sw.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Enable Push Notifications (Priority: P1) 🎯 MVP

**Goal**: As an authenticated user, I want to be prompted to enable push notifications after logging in, so that I can receive real-time updates about my license applications.

**Independent Test**: Can be fully tested by logging in, accepting the browser permission prompt, and verifying the token is saved in the database.

### Implementation for User Story 1

- [ ] T009 [P] [US1] Create RegisterPushTokenRequest DTO in src/Mojaz.Application/DTOs/Push/RegisterPushTokenRequest.cs
- [ ] T010 [US1] Implement RegisterTokenAsync in src/Mojaz.Infrastructure/Notifications/FirebasePushService.cs
- [ ] T011 [US1] Implement POST /register endpoint in src/Mojaz.API/Controllers/PushTokensController.cs
- [ ] T012 [P] [US1] Create frontend API service in frontend/src/services/push-token.service.ts
- [ ] T013 [US1] Create usePushNotifications hook in frontend/src/hooks/usePushNotifications.ts
- [ ] T014 [US1] Create PushNotificationPrompt component in frontend/src/components/feedback/PushNotificationPrompt.tsx
- [ ] T015 [US1] Integrate PushNotificationPrompt into authenticated dashboard layout

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Receive Real-time Notifications (Priority: P1)

**Goal**: As a user, I want to receive push notifications when important events occur (e.g., application status change), so I can stay updated without keeping the website open.

**Independent Test**: Can be fully tested by triggering a backend notification event and confirming it appears in the user's browser/system tray.

### Implementation for User Story 2

- [ ] T016 [US2] Implement SendToUserAsync using FirebaseMessaging.DefaultInstance in src/Mojaz.Infrastructure/Notifications/FirebasePushService.cs
- [ ] T017 [US2] Ensure SendToUserAsync handles bilingual payloads based on user preference
- [ ] T018 [US2] Handle incoming push messages and click navigation in frontend/public/firebase-messaging-sw.js
- [ ] T019 [US2] Trigger IPushNotificationService via Hangfire on milestone events in src/Mojaz.Application/Services/ApplicationService.cs

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Token Cleanup on Logout (Priority: P2)

**Goal**: As a user, I want to stop receiving notifications on a device after I log out, so my privacy is protected.

**Independent Test**: Can be fully tested by logging out and attempting to trigger a message for that user's device.

### Implementation for User Story 3

- [ ] T020 [P] [US3] Create UnregisterPushTokenRequest DTO in src/Mojaz.Application/DTOs/Push/UnregisterPushTokenRequest.cs
- [ ] T021 [US3] Implement UnregisterTokenAsync in src/Mojaz.Infrastructure/Notifications/FirebasePushService.cs
- [ ] T022 [US3] Implement DELETE endpoint in src/Mojaz.API/Controllers/PushTokensController.cs
- [ ] T023 [US3] Update useAuth hook to call unregister token during logout flow in frontend/src/hooks/useAuth.ts

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T024 [P] Document environment variables and config required for FCM in docs/
- [ ] T025 Handle "NotRegistered" exception from Firebase SDK to automatically set PushToken IsActive to false
- [ ] T026 Add error handling and audit logging for push token registration/unregistration actions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2).
- **User Story 2 (P1)**: Depends on US1 (needs token registration working to deliver to a token).
- **User Story 3 (P2)**: Depends on US1 (needs registered token to unregister).

### Parallel Opportunities

- FirebaseAdmin backend setup and Firebase JS SDK frontend setup (T001, T002) can run concurrently.
- Frontend hook/service (T012, T013) can be built concurrently with backend DTOs (T009) and Controller (T011).

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1 (Enables prompt and token storage)
4. Validate Token successfully persists in SQL server.

### Incremental Delivery

1. Follow MVP for US1.
2. Complete User Story 2: Allows backend to dispatch messages asynchronously.
3. Complete User Story 3: Finalizes token lifecycle cleanup.
