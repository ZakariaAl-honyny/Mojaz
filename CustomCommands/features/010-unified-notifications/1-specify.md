# Feature 010: Unified Notification Service with 4 Channels

## WHAT WE'RE BUILDING:
Single notification service dispatching to In-App, Push, Email, SMS based on event type and user preferences.

## REQUIREMENTS:
- INotificationService.SendAsync(NotificationRequest)
- InApp: SYNCHRONOUS (always on), Push/Email/SMS: ASYNC via Hangfire
- User preferences: EnableEmail/Sms/Push (default true), InApp always on
- Endpoints: GET /notifications, PATCH read/read-all, GET unread-count
- Notification bell component with badge, dropdown, real-time polling
- Hangfire dashboard at /hangfire (admin only)

## ACCEPTANCE CRITERIA:
- [ ] Single SendAsync dispatches to all channels
- [ ] InApp synchronous, others async
- [ ] User preferences respected
- [ ] Notification bell with unread count
- [ ] Mark as read (single/bulk)
- [ ] Hangfire dashboard for admin
- [ ] Bilingual notifications
