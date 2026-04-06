# Feature 009: Real Push Notifications via Firebase Cloud Messaging

> **Status:** To be generated via `/speckit.clarify`

## WHAT WE'RE BUILDING:
Web push notification system using Firebase Cloud Messaging (FCM).

## REQUIREMENTS:
BACKEND: IPushNotificationService (SendToUserAsync, SendToUsersAsync, RegisterTokenAsync, UnregisterTokenAsync), FirebasePushService with FCM HTTP v1 API, register/unregister token endpoints.

FRONTEND: Firebase JS SDK config, service worker, usePushNotifications hook, permission flow (after login), 10 push event types.

## ACCEPTANCE CRITERIA:
- [ ] Push permission after login
- [ ] Token registered in PushTokens table
- [ ] Push notification appears in browser
- [ ] Click navigates to correct page
- [ ] Token cleanup on logout
- [ ] Bilingual titles
