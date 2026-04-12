# Feature Specification: Real Push Notifications via Firebase Cloud Messaging

**Feature Branch**: `009-push-notifications`  
**Created**: 2026-04-07  
**Status**: Draft  
**Input**: User description: "Feature 009: Real Push Notifications via Firebase Cloud Messaging"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enable Push Notifications (Priority: P1)

As an authenticated user, I want to be prompted to enable push notifications after logging in, so that I can receive real-time updates about my license applications.

**Why this priority**: Without enabling push notifications, the system cannot register the token, breaking the entire Web Push feature.

**Independent Test**: Can be fully tested by logging in, accepting the browser permission prompt, and verifying the token is saved in the database.

**Acceptance Scenarios**:

1. **Given** the user has just logged in, **When** they land on their dashboard, **Then** a browser prompt requests notification permissions.
2. **Given** the user accepts the permission, **When** the service worker registers, **Then** the push token is sent to the backend and stored in the `PushTokens` table.

---

### User Story 2 - Receive Real-time Notifications (Priority: P1)

As a user, I want to receive push notifications when important events occur (e.g., application status change), so I can stay updated without keeping the website open.

**Why this priority**: Delivering the notifications is the core value proposition of this feature.

**Independent Test**: Can be fully tested by triggering a backend notification event and confirming it appears in the user's browser/system tray.

**Acceptance Scenarios**:

1. **Given** the user has registered a valid push token, **When** a backend system event triggers `SendToUserAsync`, **Then** the push notification is delivered and appears in the browser/OS UI with bilingual titles.
2. **Given** the user receives a push notification, **When** they click on the notification, **Then** they are navigated to the correct relevant page (e.g., application tracking details).

---

### User Story 3 - Token Cleanup on Logout (Priority: P2)

As a user, I want to stop receiving notifications on a device after I log out, so my privacy is protected.

**Why this priority**: Crucial for security and reducing redundant message sends to inactive endpoints.

**Independent Test**: Can be fully tested by logging out and attempting to trigger a message for that user's device.

**Acceptance Scenarios**:

1. **Given** an active session with a registered push token, **When** the user logs out, **Then** the frontend triggers the token unregistration endpoint and the backend removes or invalidates the token from the `PushTokens` table.

### Edge Cases

- What happens when the user explicitly declines the browser push notification permission?
- How does the system handle an expired/invalid FCM token when a notification is dispatched?
- What happens if the user clears browser site data and the service worker is unregistered manually?
- How does the system deduplicate notifications if the user is authenticated simultaneously on multiple devices?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST prompt for push notification permissions after user login in the frontend.
- **FR-002**: System MUST register successful FCM tokens in the backend `PushTokens` table via a dedicated registration endpoint.
- **FR-003**: System MUST expose an `IPushNotificationService` for sending targeted notifications (`SendToUserAsync`, `SendToUsersAsync`, `RegisterTokenAsync`, `UnregisterTokenAsync`).
- **FR-004**: System MUST use the FCM HTTP v1 API via a `FirebasePushService` backend implementation.
- **FR-005**: System MUST properly unregister and clean up FCM tokens from the database upon user logout via an unregistration endpoint.
- **FR-006**: System MUST handle bilingual content (Arabic/English) dynamically based on the target user's locale when delivering notifications.
- **FR-007**: System MUST support 10 predefined push event types, matching the platform's multi-channel notification requirements.
- **FR-008**: System MUST navigate the user to the correct target URL mapping when a received push notification is clicked.

### Key Entities

- **PushToken**: Represents a registered FCM device token. Tracks `UserId`, `Token`, `DeviceType`, `CreatedAt`, `LastUsedAt`, and `IsActive` state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Notifications are successfully dispatched to FCM within 2 seconds of the backend trigger in 95% of cases.
- **SC-002**: 100% of expired/unregistered FCM tokens are automatically cleaned up or marked inactive on delivery failure.
- **SC-003**: 100% token cleanup upon user logout to prevent unauthorized notification persistence.
- **SC-004**: System successfully triggers Push Notifications alongside Email and SMS for all 10 core system milestone events.

## Assumptions

- Existing authentication mechanism provides clear hooks for login and logout events.
- Firebase project is set up, and FCM credentials (service account JSON) are securely available in the backend environment.
- The end-users' browsers natively support Web Push Notifications and Service Workers.
- The system handles user preferences defaulting to enabled for notifications; a UI to toggle them off explicitly is out of scope for MVP unless stipulated by PRD.
