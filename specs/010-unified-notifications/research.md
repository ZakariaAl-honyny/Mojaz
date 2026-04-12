# Phase 0: Research & Decisions

## Context
Researching implementation details for the Unified Notification Service, conforming to the `.specify/memory/constitution.md` and feature `spec.md`. No `[NEEDS CLARIFICATION]` tags remained in the spec, but we formalize technical decisions below.

### 1. In-App Notification Delivery
- **Decision**: Client-side short polling via React Query `useQuery` with `refetchInterval` (e.g., 30s-60s).
- **Rationale**: The PRD stack does not list SignalR. Polling unread counts via a lightweight DB query (< 50ms) is adequate for real-time responsiveness without introducing WebSocket infrastructure complexity.
- **Alternatives considered**: SignalR (rejected due to architectural constraints), Server-Sent Events (SSE) (rejected due to connection limit overhead for a simple counter).

### 2. Hangfire Async Retry Policy for External Channels
- **Decision**: Custom `[AutomaticRetry(Attempts = 3)]` attribute per async notification job (Email/SMS/Push), with a DLQ strategy capturing permanent failures into `EmailLogs` and `SmsLogs`.
- **Rationale**: The default Hangfire retry policy uses exponential backoff reaching hours/days. Time-critical notifications (like OTPs or Appointment Reminders) lose value if delayed. Limiting attempts ensures failures are surfaced promptly in the admin dashboard and logs.
- **Alternatives considered**: Default Hangfire 10 retries (rejected as inappropriate for notification TTLs), strict Fail-Fast (rejected as too sensitive to transient SMS gateway network hiccups).

### 3. Firebase Web Push Setup
- **Decision**: Store web client FCM tokens in `PushTokens` table. Use Firebase Admin SDK in the ASP.NET Application layer (`INotificationService`) to dispatch.
- **Rationale**: Fits explicitly within the approved PRD tech stack.

### 4. Bilingual Templating
- **Decision**: Storing identical Arabic and English keys in the `Notifications` table (`TitleAr`, `TitleEn`, `MessageAr`, `MessageEn`) directly during the `SendAsync` call.
- **Rationale**: Aligns perfectly with the Database specifications inside the PRD, avoiding complex runtime translations and ensuring the history is preserved exactly as it was meant to be read on delivery.
