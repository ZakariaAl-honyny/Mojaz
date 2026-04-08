# Implementation Plan: Unified Notification Service

**Branch**: `010-unified-notifications` | **Date**: 2026-04-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-unified-notifications/spec.md`

## Summary

The Unified Notification Service provides asynchronous, multi-channel dispatch capabilities for the Mojaz platform. It processes in-app notifications synchronously for immediate DB persistence, while routing SMS, Email, and Push notifications through Hangfire background jobs using a custom retry policy to guarantee high availability without blocking HTTP threads.

## Technical Context

**Language/Version**: C# 12 / .NET 8 (Backend), TypeScript 5 / Next.js 15 (Frontend)
**Primary Dependencies**: EF Core 8, Hangfire, Firebase Admin SDK (C#), Firebase JS SDK (Web), SendGrid, Twilio
**Storage**: SQL Server 2022
**Testing**: xUnit, Moq, FluentAssertions, Jest, React Testing Library
**Target Platform**: Web Application (Mojaz Platform)
**Project Type**: Full-Stack Web Service
**Performance Goals**: `SendAsync` execution < 100ms; Background dispatch within 30s; Unread polling query < 50ms
**Constraints**: Must never block the primary HTTP thread; Must fail localized external deliveries gracefully without cascading failures.
**Scale/Scope**: System-wide shared component utilized by all 8 license sub-services.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Clean Architecture Supremacy**: Passed. Hangfire integration and external vendor logic reside strictly in `Mojaz.Infrastructure`.
- **Security First**: Passed. Secrets are managed external to code; no sensitive data transmitted unnecessarily.
- **Configuration over Hardcoding**: Passed. Bilingual texts and job policies are structured efficiently without hardcoded secrets.
- **Internationalization by Default**: Passed. Payload contains Arabic and English properties matching constitution rules.
- **API Contract Consistency**: Passed. Endpoints utilize `ApiResponse<T>` and `PagedResult<T>`.
- **Async-First Notifications**: Passed. The architecture perfectly matches this principle.

## Project Structure

### Documentation (this feature)

```text
specs/010-unified-notifications/
├── plan.md              # This file
├── research.md          # Output of Phase 0
├── data-model.md        # Output of Phase 1
├── quickstart.md        # Output of Phase 1
├── contracts/           # Output of Phase 1
│   └── api.md
└── tasks.md             # To be created by /speckit.tasks
```

### Source Code (repository root)

```text
Mojaz.sln
├── src/
│   ├── Mojaz.Domain/
│   │   ├── Entities/Notifications/
│   │   │   ├── Notification.cs
│   │   │   ├── PushToken.cs
│   │   │   ├── EmailLog.cs
│   │   │   └── SmsLog.cs
│   │   └── Enums/NotificationEvent.cs
│   │
│   ├── Mojaz.Application/
│   │   ├── Services/Notifications/
│   │   │   ├── INotificationService.cs
│   │   │   └── NotificationService.cs
│   │   └── DTOs/Notifications/
│   │
│   ├── Mojaz.Infrastructure/
│   │   ├── Persistence/Configurations/   # Entity configurations
│   │   ├── Notifications/                # Hangfire job processors
│   │   │   ├── EmailJobProcessor.cs
│   │   │   ├── SmsJobProcessor.cs
│   │   │   └── PushJobProcessor.cs
│   │   └── External/
│   │       ├── FirebaseService.cs
│   │       ├── SendGridService.cs
│   │       └── TwilioService.cs
│   │
│   └── Mojaz.API/
│       └── Controllers/NotificationsController.cs
│
├── frontend/
│   └── src/
│       ├── components/domain/notification/
│       │   ├── NotificationBell.tsx
│       │   └── NotificationList.tsx
│       ├── services/notification.service.ts
│       └── hooks/useNotifications.ts
```

**Structure Decision**: Utilizing the Full-Stack Web Application (Clean Architecture + App Router) standard already adopted in Mojaz.

## Complexity Tracking

No constitution violations detected. Standard Clean Architecture and Hangfire integration patterns will be strictly utilized.
