# Feature Specification: Unified Notification Service

**Feature Branch**: `010-unified-notifications`  
**Created**: 2026-04-08  
**Status**: Final  
**Input**: User description: "create new brach named 010-unified-notifications and specify inside it"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Applicant receives real-time application updates (Priority: P1)

As an applicant, I want to be notified instantly in-system when my application status changes, so I don't miss important updates or requirements.

**Why this priority**: In-app notifications are fundamental for user engagement and keeping applicants informed of the workflow progression without relying on external channels.

**Independent Test**: Can be fully tested by triggering an application status change and verifying the notification bell updates with the new unread count and specific message.

**Acceptance Scenarios**:

1. **Given** a user is logged into the Applicant Portal, **When** their application receives "Missing documents request", **Then** the notification bell increments immediately (via short polling) and shows the specific alert.
2. **Given** multiple unread notifications, **When** the user clicks "Mark all as read", **Then** the badge count clears and messages display as read.

---

### User Story 2 - Automated Multi-Channel Dispatch (SMS, Email, Push) (Priority: P1)

As the system, I want to dispatch important events through SMS, Email, and Push Notifications simultaneously, so the user is informed even when not actively on the platform.

**Why this priority**: External notifications guarantee high engagement and ensure time-critical items (like appointment reminders or test results) reach the user.

**Independent Test**: Can be fully tested by triggering `SendAsync` and verifying that Hangfire queues and processes Email, SMS, and Push jobs successfully.

**Acceptance Scenarios**:

1. **Given** an event that requires multi-channel delivery (e.g., Appointment Booking), **When** `INotificationService.SendAsync` is called, **Then** three separate async jobs (Email, SMS, Push) are queued in Hangfire.
2. **Given** a failed delivery attempt on an external channel, **When** Hangfire attempts execution, **Then** it follows the custom retry policy and logs the failure gracefully on exhaustion.

---

### User Story 3 - User controls notification preferences (Priority: P2)

As a user, I want to be able to disable certain notification channels (Email, SMS, Push) to prevent spam, while In-App notifications remain mandatory.

**Why this priority**: Empowers the user to control their experience and meets modern software standards for notification management.

**Independent Test**: Can be tested by toggling off SMS in settings, triggering an event, and verifying that only Push, Email, and In-App fire.

**Acceptance Scenarios**:

1. **Given** a user disabled SMS notifications, **When** a new test result is issued, **Then** only Email, Push, and In-App notifications are dispatched.
2. **Given** a user attempts to disable In-App notifications, **When** viewing the preferences page, **Then** the In-App channel is shown as mandatory and disabled for toggling.

---

### Edge Cases

- What happens when a user's Push token expires or is invalid? (Fail gracefully, do not block other channels).
- How does the system handle temporary outages of the SMS/Email provider? (Hangfire retry logic with limited backoff).
- What happens if the `SendAsync` call is made, but the user has no registered Email address? (Bypass the Email queue).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an `INotificationService.SendAsync(NotificationRequest)` method capable of routing messages to In-App, Email, SMS, and Push channels.
- **FR-002**: System MUST process In-App notifications synchronously to ensure immediate DB persistence.
- **FR-003**: System MUST process Email, SMS, and Push notifications asynchronously using Hangfire background jobs.
- **FR-004**: System MUST respect user-defined preferences for enabling/disabling Email, SMS, and Push channels. In-App notifications MUST be permanently enabled.
- **FR-005**: System MUST expose REST endpoints for the frontend: `GET /api/v1/notifications` (paginated), `PATCH /api/v1/notifications/read-all`, and `GET /api/v1/notifications/unread-count`.
- **FR-006**: System MUST poll for unread notifications in real-time (short-polling via React Query) to update the UI bell component.
- **FR-007**: System MUST provide an admin-only authorization layer to securely access the `/hangfire` dashboard.
- **FR-008**: System MUST support bilingual (Arabic/English) templates and resolve text appropriately for all channels.

### Key Entities 

- **Notification**: Stores internal application alerts linked to users. Contains Arabic and English messages, read status, and timestamps.
- **PushToken**: Stores user FCM device tokens for web-push delivery.
- **EmailLog / SmsLog**: Audit structures storing delivery statuses, provider reference IDs, and failure reasons for robust trackability.
- **NotificationRequest**: DTO representing the cross-channel dispatch payload containing target user, event type, and data payload.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `SendAsync` execution time does not exceed 100ms on the main HTTP thread (external calls offloaded).
- **SC-002**: Asynchronous channels (Email/SMS/Push) dispatch 95% of messages within 30 seconds of the event.
- **SC-003**: Notification polling does not degrade global frontend performance or overwhelm the backend (e.g., maintaining < 50ms DB query time for unread count).
- **SC-004**: 100% of failed external deliveries (Email/SMS/Push) are logged accurately in their respective audit tables.

## Assumptions

- We are using client-side short polling (React Query) for the notification bell as SignalR/WebSockets were not specified in the PRD's tech stack.
- Hangfire uses a custom retry profile for external messages (e.g., max 3 retries over an hour) rather than infinite retries, marking them as `Failed` in the Logs tables when exhausted.
- Notifications are strictly transactional per-user (no system-wide topic broadcasts in MVP).
- The "Bilingual" requirement means `SendAsync` saves/dispatches both Arabic and English text directly from configuration/templates, letting the frontend or receiving service determine the locale.
