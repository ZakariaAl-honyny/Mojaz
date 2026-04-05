<!--
  Sync Impact Report
  ==================
  Version change: 0.0.0 (template) → 1.0.0
  Modified principles: N/A (initial ratification)
  Added sections:
    - Core Principles (7 principles)
    - Technology Stack & Naming Conventions
    - Development Workflow & Quality Gates
    - Governance
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ compatible (Constitution Check section present)
    - .specify/templates/spec-template.md ✅ compatible (requirements/success criteria align)
    - .specify/templates/tasks-template.md ✅ compatible (phase structure supports principle-driven tasks)
  Follow-up TODOs: None
-->

# Mojaz (مُجاز) Constitution

## Core Principles

### I. Clean Architecture Supremacy

All code MUST follow strict Clean Architecture layering with five layers: Domain → Shared → Application → Infrastructure → API.

- The **Domain** layer MUST have ZERO external dependencies — no NuGet packages, no framework references.
- The **Application** layer MUST NEVER reference **Infrastructure** directly — use interfaces defined in Application, implemented in Infrastructure.
- **Controllers** MUST be thin — all business logic MUST reside in Application service classes.
- All database access MUST go through the **Repository Pattern + Unit of Work** — no direct DbContext usage outside Infrastructure.
- Business logic MUST NEVER exist in repositories or controllers.
- Dependency direction MUST always flow inward: API → Infrastructure → Application → Domain.

**Rationale**: Government systems require long-term maintainability, auditability, and the ability to swap infrastructure components (e.g., database, email provider) without touching business rules.

### II. Security First (NON-NEGOTIABLE)

Security constraints are absolute and MUST NOT be relaxed under any circumstance.

- NEVER hardcode secrets, API keys, connection strings, or credentials in source code.
- NEVER log passwords, tokens, OTP codes, or national IDs — mask sensitive fields (e.g., `NationalId: ****7890`).
- NEVER return password hashes in API responses — DTOs MUST exclude `PasswordHash`.
- ALWAYS hash passwords with BCrypt (cost factor 12+) — plain-text storage is forbidden.
- ALWAYS hash OTP codes before persisting to the `OtpCodes` table.
- ALWAYS validate ALL input server-side using FluentValidation — client-side validation is supplementary only.
- ALWAYS use `[Authorize]` with explicit role specification on every protected endpoint.
- ALWAYS validate resource ownership in the service layer — an Applicant MUST only access their own data.
- ALWAYS log security-sensitive operations (login, logout, failed attempts, permission changes, data modifications) in the `AuditLog` table.
- Rate limiting MUST be enforced on authentication endpoints (Login: 10/min, Register: 5/min, OTP: 3/min).
- HTTPS MUST be mandatory in production with HTTP-to-HTTPS redirect.
- Security headers MUST be set on all responses: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Content-Security-Policy`, `Strict-Transport-Security`.
- File uploads MUST be validated by MIME type, file size (max 5 MB), extension whitelist, and file header inspection.
- Production error responses MUST NEVER expose stack traces — use global exception handler middleware.

**Rationale**: This platform handles national identity data and government-issued documents. Any security lapse can compromise citizens' data and government trust.

### III. Configuration over Hardcoding

All business-configurable values MUST be stored in the database and NEVER appear as magic numbers or literals in code.

- All business thresholds (minimum ages, max attempts, cooling periods, validity durations) MUST reside in the `SystemSettings` table.
- All fee amounts MUST reside in the `FeeStructures` table with effective date ranges.
- OTP settings (validity minutes, max attempts, resend cooldown) MUST be in `SystemSettings`.
- JWT token durations, password policies, and lockout thresholds MUST be in `SystemSettings`.
- Application and license number formats MUST follow `MOJ-{YEAR}-{8_RANDOM_DIGITS}` (e.g., `MOJ-2025-48291037`).
- `DateTime.UtcNow` MUST be used universally — `DateTime.Now` is forbidden. Frontend converts to local timezone for display only.
- Soft Delete MUST be the only deletion strategy — physical deletion of records is forbidden. Use `IsDeleted` flag with EF Core global query filters.

**Rationale**: Government regulations change frequently. Hardcoded values force code deployments for policy changes; database-driven configuration allows authorized administrators to update rules without developer intervention.

### IV. Internationalization by Default

Every UI element MUST support Arabic (RTL) as the default language and English (LTR) as a fully supported secondary language.

- NEVER hardcode text strings in components — always use translation keys via `next-intl`.
- Translation files MUST follow the structure: `public/locales/{ar,en}/{namespace}.json`.
- CSS MUST use logical properties (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`) — physical direction properties (`ml-`, `mr-`, `text-left`, `text-right`) are forbidden.
- Direction-sensitive icons (arrows, chevrons) MUST flip in RTL using `rtl:rotate-180`.
- Universal icons (search, settings, user) MUST NOT flip.
- The root layout MUST set `dir` and `lang` attributes based on the active locale.
- Arabic font MUST be `IBM Plex Sans Arabic` or `Cairo`; English font MUST be `Inter` or `IBM Plex Sans`.
- The sidebar MUST appear on the RIGHT in Arabic and LEFT in English.

**Rationale**: This is a Saudi government platform. Arabic RTL is the primary citizen language; English support serves expatriate users and international standards compliance.

### V. API Contract Consistency

Every API endpoint MUST conform to a uniform response contract and URL convention.

- ALL endpoints MUST return responses wrapped in `ApiResponse<T>` with fields: `Success`, `Message`, `Data`, `Errors`, `StatusCode`.
- ALL paginated list endpoints MUST return `ApiResponse<PagedResult<T>>` with fields: `Items`, `TotalCount`, `Page`, `PageSize`, `TotalPages`, `HasPreviousPage`, `HasNextPage`.
- URL structure MUST follow: `/api/v1/{resource}` with RESTful verbs (GET list, GET by id, POST create, PUT update, PATCH action, DELETE soft-delete).
- Pagination query parameters MUST use: `page`, `pageSize`, `sortBy`, `sortDir`, `search`, `status`, `from`, `to`.
- Controller classes MUST use `[ApiController]`, `[Route("api/v1/[controller]")]`, and `[Produces("application/json")]` attributes.
- Every action MUST have `[ProducesResponseType]` attributes documenting success and error shapes.

**Rationale**: A uniform API surface reduces frontend integration effort, simplifies error handling, and ensures predictable behavior across all 8+ services.

### VI. Test Discipline

All production code MUST be covered by appropriate tests following established naming and structural conventions.

- Backend testing MUST use **xUnit + Moq + FluentAssertions**.
- Frontend testing MUST use **Jest + React Testing Library**.
- End-to-end testing MUST use **Playwright**.
- Backend test naming MUST follow: `MethodName_Scenario_ExpectedResult`.
- Frontend test naming MUST follow: `"should [behavior] when [condition]"`.
- Minimum **80% code coverage** MUST be maintained for business logic in Application services.
- Test projects MUST mirror the source project structure: `Mojaz.Domain.Tests`, `Mojaz.Application.Tests`, `Mojaz.Infrastructure.Tests`, `Mojaz.API.Tests`.

**Rationale**: Government systems require demonstrable correctness. Test coverage provides confidence during regulatory audits and prevents regressions in critical workflows like license issuance and payment processing.

### VII. Async-First Notifications

Notifications MUST be delivered through 4 channels without blocking the primary request flow.

- **In-App** notifications MUST be created synchronously (same request).
- **Push** (Firebase), **Email** (SendGrid), and **SMS** (Twilio) notifications MUST be dispatched asynchronously via Hangfire background jobs.
- The main API request MUST NEVER block or fail due to external notification delivery failures.
- User notification preferences MUST be respected for Push, Email, and SMS channels.
- In-App notifications MUST NOT be disableable by the user.
- All notification content MUST be bilingual (Arabic/English) based on the user's language preference.
- Every notification-triggering event (application status change, test results, appointment reminders, payment confirmations) MUST fire through ALL applicable channels.

**Rationale**: Citizens expect timely updates on their license applications. Async dispatch ensures API responsiveness while guaranteeing multi-channel delivery. Bilingual content serves the diverse Saudi population.

## Technology Stack & Naming Conventions

### Backend Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | ASP.NET Core | 8 |
| ORM | Entity Framework Core | 8 |
| Database | SQL Server | 2022 |
| Authentication | JWT + Refresh Tokens | — |
| Validation | FluentValidation | — |
| Mapping | AutoMapper | — |
| Background Jobs | Hangfire | — |
| Logging | Serilog | — |
| PDF Generation | QuestPDF | — |
| Email | SendGrid | — |
| SMS | Twilio | — |
| Push Notifications | Firebase Admin SDK | — |

### Frontend Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js (App Router) | 15 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS + shadcn/ui | 4 |
| Server State | React Query | 5 |
| Client State | Zustand | 5 |
| Forms | React Hook Form + Zod | 7 / 3 |
| i18n | next-intl | 3 |
| Theming | next-themes | — |
| Charts | Recharts | 2 |
| Tables | TanStack Table | 8 |
| Push Client | Firebase JS SDK | 10 |

### Naming Conventions

**Backend (C#)**:
- Classes/methods: `PascalCase`
- Interfaces: `IPascalCase` (e.g., `IApplicationService`)
- Private fields: `_camelCase` (e.g., `_applicationRepository`)
- Async methods: MUST end with `Async` (e.g., `CreateApplicationAsync`)
- DTOs: end with `Dto`, `Request`, or `Response`
- Validators: end with `Validator`
- Constants: `UPPER_SNAKE_CASE`
- Enums: `PascalCase` (singular)

**Frontend (TypeScript)**:
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Services: `camelCase.service.ts`
- Stores: `camelCase-store.ts`
- Types: `PascalCase` with suffix (`Dto`, `Request`, `Response`)
- Schemas (Zod): `camelCaseSchema`
- Constants: `UPPER_SNAKE_CASE`
- Translation keys: `dot.separated.lowercase`

**Database**:
- Tables: `PascalCase` (plural, e.g., `Applications`, `Users`)
- Columns: `PascalCase` (e.g., `CreatedAt`, `FullName`)
- Primary Keys: always `Id`
- Foreign Keys: `{RelatedTableSingular}Id` (e.g., `ApplicantId`)
- Indexes: `IX_TableName_ColumnName`
- Constraints: `CK_TableName_Description`

**Git**:
- Branches: `feature/MOJAZ-XXX-description`, `bugfix/`, `hotfix/`, `release/`
- Commits: `type(scope): description` (types: `feat`, `fix`, `docs`, `test`, `refactor`)
- PR required for `main` and `develop` branches

## Development Workflow & Quality Gates

### Design System

- Primary color: **Royal Green** `#006C35` (full palette from `primary-50` to `primary-900`)
- Secondary color: **Government Gold** `#D4A017` (full palette from `secondary-50` to `secondary-900`)
- Design inspiration: **Absher** (Saudi government portal)
- ALWAYS use Tailwind CSS utility classes — NEVER use inline styles
- NEVER create per-component CSS files — only `globals.css`
- Use `cn()` utility from `lib/utils.ts` for conditional classes
- Every component MUST support RTL, LTR, Dark mode, and Light mode

### Code Review Gates

1. **Architecture compliance** — No layer violations, no circular dependencies
2. **Security audit** — No hardcoded secrets, no sensitive data in logs or responses
3. **i18n compliance** — No hardcoded strings, logical CSS properties only
4. **API consistency** — All endpoints return `ApiResponse<T>`, pagination uses `PagedResult<T>`
5. **Test coverage** — 80%+ on Application service methods
6. **Naming convention adherence** — All names follow the conventions defined above

### MVP Scope

- **8 services**: New License, Renewal, Replacement, International, Status Change, Transfer, Medical Extension, Temporary License
- **6 license categories**: A (Motorcycle), B (Private), C (Truck), D (Bus), E (Heavy), F (Special)
- **7 roles**: Applicant, Receptionist, Doctor, Examiner, Manager, Security, Admin
- **10 workflow stages**: Draft → Submitted → Under Review → Medical Examination → Theory Test → Practical Test → Approved → Payment → Issuance → Active

## Governance

1. This Constitution **supersedes** all ad-hoc practices, informal conventions, and individual preferences. In case of conflict, the Constitution wins.
2. **Amendments** MUST be documented with:
   - A clear description of the change and its rationale
   - Impact analysis on existing code and templates
   - Version bump following semantic versioning (MAJOR for breaking governance changes, MINOR for new principles/sections, PATCH for clarifications)
   - Migration plan for any code that violates the amended rule
3. **All pull requests and code reviews** MUST verify compliance with every applicable principle before merging.
4. **Complexity MUST be justified** — any deviation from simplicity (e.g., adding a new layer, introducing a new pattern) requires a documented rationale in the PR description.
5. Use the **AGENTS.md** file as the runtime development guidance reference for implementation details that extend beyond this Constitution's scope.
6. **Compliance reviews** SHOULD be conducted quarterly to ensure the codebase adheres to all principles and to identify any principles that need amendment.

**Version**: 1.0.0 | **Ratified**: 2026-04-02 | **Last Amended**: 2026-04-02
