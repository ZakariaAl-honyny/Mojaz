# Mojaz Project Constitution

## Project Identity
- **Name:** Mojaz (مُجاز) meaning "Licensed/Authorized" in Arabic
- **Type:** Full-Stack Web Application
- **Domain:** Government / GovTech / Driving License Management
- **Primary Color:** #006C35 (Royal Green)
- **Design System:** Absher-Inspired, government official style

## Tech Stack

### Backend
- ASP.NET Core 8 Web API
- Clean Architecture (5 layers: Domain → Shared → Application → Infrastructure → API)
- Entity Framework Core 8 + SQL Server 2022
- JWT + Refresh Token authentication
- FluentValidation, AutoMapper, Hangfire, Serilog, QuestPDF
- SendGrid (email), Twilio (SMS), Firebase Admin SDK (push notifications)

### Frontend
- Next.js 15 (App Router) + TypeScript 5
- Tailwind CSS 4 + shadcn/ui (Mojaz-themed)
- React Query 5 (server state) + Zustand 5 (client state)
- React Hook Form 7 + Zod 3 (forms/validation)
- next-intl 3 (i18n) + next-themes (dark/light)
- Recharts 2 (charts) + TanStack Table 8 (tables)
- Firebase JS SDK 10 (push client)

## Architecture Rules
1. Domain layer has ZERO external dependencies
2. Application layer NEVER references Infrastructure
3. Controllers are THIN — all logic in Application services
4. Repository Pattern + Unit of Work for data access
5. ALL business values stored in SystemSettings table — NEVER hardcoded
6. ALL fee amounts in FeeStructures table — NEVER hardcoded
7. Soft Delete only — NEVER physical delete
8. DateTime.UtcNow always — NEVER DateTime.Now
9. ALL API responses use ApiResponse<T> wrapper
10. ALL paginated lists use PagedResult<T>

## Naming Conventions
- C# classes/methods: PascalCase
- C# private fields: _camelCase
- C# interfaces: IPascalCase
- C# async methods: end with Async
- TypeScript components: PascalCase.tsx
- TypeScript hooks: useCamelCase.ts
- TypeScript services: camelCase.service.ts
- Database tables: PascalCase (plural)
- Database columns: PascalCase
- Git commits: type(scope): description

## Internationalization
- Arabic (RTL) is DEFAULT language
- English (LTR) fully supported
- NEVER hardcode text strings — always use translation keys
- Use CSS logical properties (ms-/me-/ps-/pe-) NOT physical (ml-/mr-)
- Sidebar: RIGHT in Arabic, LEFT in English
- Direction-sensitive icons MUST flip in RTL
- Arabic font: IBM Plex Sans Arabic or Cairo
- English font: Inter or IBM Plex Sans

## Security (NON-NEGOTIABLE)
- NEVER hardcode secrets or API keys
- NEVER log passwords, tokens, OTPs, or national IDs
- NEVER return password hashes in API responses
- ALWAYS hash passwords with BCrypt (cost 12+)
- ALWAYS hash OTP codes before storing
- ALWAYS validate ALL input server-side with FluentValidation
- ALWAYS use [Authorize] with specific roles on protected endpoints
- ALWAYS validate resource ownership (applicant sees only own data)
- ALWAYS log sensitive operations in AuditLog table
- Rate limiting on auth endpoints
- HTTPS mandatory in production
- Security headers on all responses

## Notification Rules
- 4 channels: In-App (sync), Push/Email/SMS (async via Hangfire)
- NEVER block main request for external notifications
- Respect user notification preferences
- In-App cannot be disabled by user
- All notifications bilingual (AR/EN based on user preference)

## Testing
- Backend: xUnit + Moq + FluentAssertions
- Frontend: Jest + React Testing Library
- E2E: Playwright
- Test naming: MethodName_Scenario_ExpectedResult (backend)
- Test naming: "should [behavior] when [condition]" (frontend)
- Minimum 80% coverage for business logic

## Git
- Branches: feature/MOJAZ-XXX-description, bugfix/, hotfix/, release/
- Commits: feat(scope):, fix(scope):, docs():, test():, refactor():
- PR required for main and develop branches
