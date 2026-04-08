# Tasks: Unified Notification Service

**Input**: Design documents from `/specs/010-unified-notifications/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic dependencies

- [X] T001 [P] Ensure Hangfire, SendGrid, Twilio, and Firebase Admin SDK NuGet packages are installed in `src/Mojaz.Infrastructure/Mojaz.Infrastructure.csproj`
- [X] T002 [P] Ensure Firebase JS SDK package is installed in `frontend/package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Create `Notification` entity in `src/Mojaz.Domain/Entities/Notifications/Notification.cs`
- [X] T004 [P] Create `PushToken` entity in `src/Mojaz.Domain/Entities/Notifications/PushToken.cs`
- [X] T005 [P] Create `EmailLog` and `SmsLog` entities in `src/Mojaz.Domain/Entities/Notifications/`
- [X] T006 Configure EF Core mappings for Notification entities in `src/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T007 Add DbSets to `ApplicationDbContext` and generate EF Core migration for Notifications

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Applicant receives real-time application updates (Priority: P1) 🎯 MVP

**Goal**: As an applicant, I want to be notified instantly in-system when my application status changes, so I don't miss important updates or requirements.

**Independent Test**: Can be fully tested by triggering an application status change and verifying the notification bell updates with the new unread count and specific message via short-polling.

### Implementation for User Story 1

- [X] T008 [P] [US1] Create `NotificationRequest` DTO and `NotificationEvent` Enum in `src/Mojaz.Application/DTOs/Notifications/`
- [X] T009 [P] [US1] Create `INotificationService` interface in `src/Mojaz.Application/Services/Notifications/INotificationService.cs`
- [X] T010 [US1] Implement base `NotificationService` (handling synchronous In-App payload only) in `src/Mojaz.Infrastructure/Notifications/NotificationService.cs`
- [X] T011 [US1] Implement `NotificationsController` with GET list, unread-count, and read-all actions in `src/Mojaz.API/Controllers/NotificationsController.cs`
- [X] T012 [P] [US1] Create `notification.service.ts` API client in `frontend/src/services/`
- [X] T013 [P] [US1] Create React Query hook with polling in `frontend/src/hooks/useNotifications.ts`
- [X] T014 [US1] Create `NotificationBell.tsx` component in `frontend/src/components/domain/notification/`
- [X] T015 [US1] Create `NotificationList.tsx` modal/page in `frontend/src/components/domain/notification/`

**Checkpoint**: At this point, User Story 1 should be fully functional (In-App notifications work globally).

---

## Phase 4: User Story 2 - Automated Multi-Channel Dispatch (SMS, Email, Push) (Priority: P1)

**Goal**: As the system, I want to dispatch important events through SMS, Email, and Push Notifications simultaneously.

**Independent Test**: Can be fully tested by triggering `SendAsync` and verifying that Hangfire queues and processes Email, SMS, and Push jobs successfully.

### Implementation for User Story 2

- [X] T016 [P] [US2] Implement `SendGridService` interface/class in `src/Mojaz.Infrastructure/External/`
- [X] T017 [P] [US2] Implement `TwilioService` interface/class in `src/Mojaz.Infrastructure/External/`
- [X] T018 [P] [US2] Implement `FirebaseService` interface/class in `src/Mojaz.Infrastructure/External/`
- [X] T019 [US2] Create Hangfire `EmailJobProcessor`, `SmsJobProcessor`, `PushJobProcessor` with custom Retry Policies in `src/Mojaz.Infrastructure/Notifications/`
- [X] T020 [US2] Update `NotificationService.SendAsync` to Enqueue Hangfire jobs for external channels in `src/Mojaz.Infrastructure/Notifications/NotificationService.cs`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Async channels correctly log failures to DB on retry exhaustion.

---

## Phase 5: User Story 3 - User controls notification preferences (Priority: P2)

**Goal**: As a user, I want to be able to disable certain notification channels to prevent spam, while In-App notifications remain mandatory.

**Independent Test**: Can be tested by toggling off SMS in settings, triggering an event, and verifying that only Push, Email, and In-App fire in logs.

### Implementation for User Story 3

- [X] T021 [P] [US3] Add `EnableEmail`, `EnableSms`, `EnablePush` preferences flags to the `User` entity or `UserPreferences` in `src/Mojaz.Domain/Entities/`
- [X] T022 [US3] Add preference validation check before enqueuing Hangfire jobs inside `NotificationService.SendAsync`
- [X] T023 [US3] Add preference toggle UI controls in `frontend/src/components/domain/user/PreferencesForm.tsx` (or related settings page)

**Checkpoint**: All user stories should now be functional. Users have granular control over their experience.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T024 [P] Update API documentation (Swagger annotations) in `NotificationsController.cs`
- [X] T025 Run local test with Hangfire Dashboard attached to ensure queue health handling is stable.
- [X] T026 Verify all RTL (Arabic) notification templating renders correctly on the frontend (`NotificationList.tsx`).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Phase 3 (US1) constructs the base `NotificationService` required by Phase 4 (US2).
  - Phase 4 (US2) must be complete before Phase 5 (US3) adds preference checks to the Job queuing mechanism.
- **Polish (Final Phase)**: Depends on all user stories being complete

### Parallel Opportunities

- Entities creation in Phase 2 can happen concurrently.
- Frontend React Query hooks and services in Phase 3 can happen concurrently with Backend Controller construction.
- External Service implementations (`TwilioService`, `SendGridService`, `FirebaseService`) in Phase 4 can all be scaffolded independently in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)
1. Complete Phase 1 & 2 logic.
2. Build In-App Polling logic (User Story 1).
3. Connect Hangfire async dispatch (User Story 2). This completes the Core Engine. 
4. Verify end-to-end functionality before moving to Preferences UI.
