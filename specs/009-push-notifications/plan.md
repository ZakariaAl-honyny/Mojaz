# Implementation Plan: 009-push-notifications

**Branch**: `009-push-notifications` | **Date**: 2026-04-07 | **Spec**: [spec.md/009-push-notifications](spec.md)
**Input**: Feature specification from `/specs/009-push-notifications/spec.md`

## Summary

Full-stack web push notification implementation using Firebase Cloud Messaging (FCM) via ASP.NET Core backend (`IPushNotificationService` via FCM HTTP v1 API) and Next.js React frontend (Firebase JS SDK, service worker, `usePushNotifications` hook). Enables real-time, asynchronous, bilingual notifications for core system milestones.

## Technical Context

**Language/Version**: C# (ASP.NET Core 8), TypeScript (Next.js 15)  
**Primary Dependencies**: Firebase Admin SDK (.NET), Firebase JS SDK (TS), next-intl  
**Storage**: SQL Server 2022 (EF Core 8) for tracking PushTokens
**Testing**: xUnit + Moq + FluentAssertions (Backend), Jest + RTL (Frontend)
**Target Platform**: Web Browsers (Chrome, Firefox, Safari versions supporting Web Push)
**Project Type**: Full-Stack Web Application  
**Performance Goals**: Asynchronous dispatch in <2s via Hangfire, minimal frontend rendering impact  
**Constraints**: 100% token cleanup upon logout, strict privacy around token storage
**Scale/Scope**: Supporting notifications for individual users (unicast) or multiple users simultaneously (multicast).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Clean Architecture**: Firebase integration must be fully encapsulated in `Mojaz.Infrastructure`. Interfaces defined in `Mojaz.Application`. The `PushToken` entity must be in `Mojaz.Domain` without any FCM/infrastructure leakage. Business logic for managing tokens in Application layer.
- **II. Security First**: No hardcoded FCM credentials in code. Secrets must reside in `appsettings.json` / User Secrets. Role-based `[Authorize]` applies to token registration.
- **III. Configuration over Hardcoding**: Configuration such as service account JSON paths/settings must pull from `IConfiguration`.
- **IV. Internationalization**: Notification payloads must determine proper Arabic/English text dynamically based on the receiving user's preferred locale.
- **V. API Contract Consistency**: `PushTokensController` must return `ApiResponse<T>`.
- **VII. Async-First Notifications**: Push dispatch operations MUST execute via Hangfire background jobs to prevent blocking HTTP request processing.

*Result*: All gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/009-push-notifications/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
    └── push-contracts.md
```

### Source Code (repository root)

```text
src/
├── Mojaz.Domain/
│   └── Entities/PushToken.cs
├── Mojaz.Application/
│   ├── DTOs/Push/
│   │   ├── RegisterPushTokenRequest.cs
│   │   └── UnregisterPushTokenRequest.cs
│   └── Interfaces/
│       └── IPushNotificationService.cs
├── Mojaz.Infrastructure/
│   └── Notifications/
│       └── FirebasePushService.cs
└── Mojaz.API/
    └── Controllers/PushTokensController.cs

frontend/
├── src/
│   ├── hooks/usePushNotifications.ts
│   ├── services/push-token.service.ts
│   └── components/feedback/PushNotificationPrompt.tsx
└── public/
    └── firebase-messaging-sw.js
```

**Structure Decision**: Integrated seamlessly across the frontend/backend divide based on Clean Architecture constraints outlined in Constitution. Backend coordinates via Hangfire (Infrastructure configuration) and SQL. Frontend handles FCM JS initializations and user-consent popups.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*(No violations. Clean Application abstraction wrapping Firebase SDK.)*
