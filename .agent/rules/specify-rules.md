# Mojaz Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-09

## Active Technologies
- TypeScript 5, Node.js 20+ + Next.js 15 (App Router), Tailwind CSS 4, shadcn/ui, next-intl 3, next-themes, Zustand 5, React Query 5, Axios 1.7 (004-frontend-foundation)
- localStorage (Persisted Auth State & Theme Preference) (004-frontend-foundation)
- C# 12 / ASP.NET Core 8 (Backend), TypeScript 5 / Next.js 15 (Frontend) + EF Core 8, FluentValidation, BCrypt.Net-Next, SendGrid, Twilio (004-auth-registration)
- SQL Server 2022 (004-auth-registration)
- [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION] + [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION] (006-auth-login-jwt)
- [if applicable, e.g., PostgreSQL, CoreData, files or N/A] (006-auth-login-jwt)
- C# (ASP.NET Core 8), TypeScript (Next.js 15) + Firebase Admin SDK (.NET), Firebase JS SDK (TS), next-intl (009-push-notifications)
- SQL Server 2022 (EF Core 8) for tracking PushTokens (009-push-notifications)
- C# 12 / .NET 8 (Backend), TypeScript 5 / Next.js 15 (Frontend) + EF Core 8, Hangfire, Firebase Admin SDK (C#), Firebase JS SDK (Web), SendGrid, Twilio (010-unified-notifications)
- TypeScript 5 / Next.js 15 (App Router) + React Hook Form 7, Zod 3, Zustand 5, React Query 5, next-intl 3, next-themes, shadcn/ui, Tailwind CSS 4, Lucide React, Framer Motion 11 (013-application-wizard)
- No new database tables — reads/writes `Applications` via Feature 012 REST API. Wizard draft state persisted in `sessionStorage` via Zustand persist middleware. (013-application-wizard)
- C# / .NET 8 (backend) · TypeScript 5 / Next.js 15 App Router (frontend) + EF Core 8, FluentValidation, AutoMapper, Hangfire, INotificationService (Feature 010), ISystemSettingsService (Feature 011) (014-document-management)
- Local filesystem `uploads/` (MVP) abstracted via `IFileStorageService`; SQL Server 2022 for `ApplicationDocuments` table metadata (014-document-management)

- C# 12 / .NET 8 LTS + AutoMapper 13, FluentValidation 11, EF Core 8 (SqlServer), (003-backend-scaffold)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

# Add commands for C# 12 / .NET 8 LTS

## Code Style

C# 12 / .NET 8 LTS: Follow standard conventions

## Recent Changes
- 014-document-management: Added C# / .NET 8 (backend) · TypeScript 5 / Next.js 15 App Router (frontend) + EF Core 8, FluentValidation, AutoMapper, Hangfire, INotificationService (Feature 010), ISystemSettingsService (Feature 011)
- 013-application-wizard: Added TypeScript 5 / Next.js 15 (App Router) + React Hook Form 7, Zod 3, Zustand 5, React Query 5, next-intl 3, next-themes, shadcn/ui, Tailwind CSS 4, Lucide React, Framer Motion 11
- 012-application-crud: Added [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION] + [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
