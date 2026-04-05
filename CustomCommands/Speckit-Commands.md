


# Mojaz — Spec-Kit Sprint Execution Guide

## Complete Sprint-by-Sprint Workflow Using Spec-Kit Commands

---

## How This Guide Works

```
For EACH sprint/phase, you will follow this exact sequence:

    ┌─────────────────────────┐
    │  /speckit.constitution  │ ← Once at project start (Sprint 0)
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │    /speckit.specify      │ ← Define WHAT to build for this sprint
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │    /speckit.clarify      │ ← Resolve ambiguities before planning
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │    /speckit.plan         │ ← Create HOW to build it technically
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │    /speckit.tasks        │ ← Generate actionable task checklist
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │    /speckit.analyze      │ ← Verify consistency & coverage
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │    /speckit.implement    │ ← Build it
    └─────────────────────────┘
```

---

## Project Directory Structure for Spec-Kit

```
mojaz/
├── .speckit/                          ← Spec-Kit config (auto-generated)
│
├── features/                          ← All sprint features live here
│   │
│   ├── 000-constitution/              ← Project constitution
│   │   └── constitution.md
│   │
│   ├── 001-project-scaffold/          ← Sprint 0
│   │   ├── 1-specify.md
│   │   ├── 2-clarify.md
│   │   ├── 3-plan.md
│   │   └── 4-tasks.md
│   │   └── 5-analyze.md
│   │   └── 6-implement.md
│   │
│   ├── 002-database-foundation/       ← Sprint 0
│   │   ├── 1-specify.md
│   │   ├── 2-clarify.md
│   │   ├── 3-plan.md
│   │   └── 4-tasks.md
│   │   └── 5-analyze.md
│   │   └── 6-implement.md
│   │
│   ├── 003-auth-registration/         ← Sprint 1-2
│   │   ├── 1-specify.md
│   │   ├── 2-clarify.md
│   │   ├── 3-plan.md
│   │   └── 4-tasks.md
│   │   └── 5-analyze.md
│   │   └── 6-implement.md
│   │
│   ├── 004-auth-login-jwt/            ← Sprint 1-2
│   │   ├── 1-specify.md
│   │   ├── 2-clarify.md
│   │   ├── 3-plan.md
│   │   └── 4-tasks.md
│   │   └── 5-analyze.md
│   │   └── 6-implement.md
│   │
│   ├── 005-otp-verification/          ← Sprint 1-2
│   │   ├── 1-specify.md
│   │   ├── 2-clarify.md
│   │   ├── 3-plan.md
│   │   └── 4-tasks.md
│   │   └── 5-analyze.md
│   │   └── 6-implement.md
│   │
│   ├── ...                            ← Continue for all features
│   │
│   └── 032-deployment-launch/         ← Sprint 9-10
│       ├── 1-specify.md
│       ├── 2-clarify.md
│       ├── 3-plan.md
│       └── 4-tasks.md
│       └── 5-analyze.md
│       └── 6-implement.md
│
├── src/
│   ├── backend/                       ← ASP.NET Core 8
│   └── frontend/                      ← Next.js 15
│
├── AGENTS.md
├── IMPLEMENTATION_PLAN.md
└── README.md
```

---

## Phase 0: Project Constitution (One-Time Setup)

### Step 1: Initialize Spec-Kit

```bash
# Initialize spec-kit in your project
specify init

# This creates .speckit/ directory with configuration
```

### Step 2: Run `/speckit.constitution`

> This maps directly to your AGENTS.md. Run this ONCE to establish
> all project rules that every subsequent feature must follow.

**Prompt to use with `/speckit.constitution`:**

```
Create the constitution for the Mojaz (مُجاز) platform — a government digital
platform for managing driving license lifecycle.

PROJECT IDENTITY:
- Name: Mojaz (مُجاز) meaning "Licensed/Authorized" in Arabic
- Type: Full-Stack Web Application
- Domain: Government / GovTech / Driving License Management
- Primary Color: #006C35 (Royal Green)
- Design System: Absher-Inspired, government official style

TECH STACK:
Backend:
- ASP.NET Core 8 Web API
- Clean Architecture (5 layers: Domain → Shared → Application → Infrastructure → API)
- Entity Framework Core 8 + SQL Server 2022
- JWT + Refresh Token authentication
- FluentValidation, AutoMapper, Hangfire, Serilog, QuestPDF
- SendGrid (email), Twilio (SMS), Firebase Admin SDK (push notifications)

Frontend:
- Next.js 15 (App Router) + TypeScript 5
- Tailwind CSS 4 + shadcn/ui (Mojaz-themed)
- React Query 5 (server state) + Zustand 5 (client state)
- React Hook Form 7 + Zod 3 (forms/validation)
- next-intl 3 (i18n) + next-themes (dark/light)
- Recharts 2 (charts) + TanStack Table 8 (tables)
- Firebase JS SDK 10 (push client)

ARCHITECTURE RULES:
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

NAMING CONVENTIONS:
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

INTERNATIONALIZATION:
- Arabic (RTL) is DEFAULT language
- English (LTR) fully supported
- NEVER hardcode text strings — always use translation keys
- Use CSS logical properties (ms-/me-/ps-/pe-) NOT physical (ml-/mr-)
- Sidebar: RIGHT in Arabic, LEFT in English
- Direction-sensitive icons MUST flip in RTL
- Arabic font: IBM Plex Sans Arabic or Cairo
- English font: Inter or IBM Plex Sans

SECURITY (NON-NEGOTIABLE):
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

NOTIFICATION RULES:
- 4 channels: In-App (sync), Push/Email/SMS (async via Hangfire)
- NEVER block main request for external notifications
- Respect user notification preferences
- In-App cannot be disabled by user
- All notifications bilingual (AR/EN based on user preference)

TESTING:
- Backend: xUnit + Moq + FluentAssertions
- Frontend: Jest + React Testing Library
- E2E: Playwright
- Test naming: MethodName_Scenario_ExpectedResult (backend)
- Test naming: "should [behavior] when [condition]" (frontend)
- Minimum 80% coverage for business logic

GIT:
- Branches: feature/MOJAZ-XXX-description, bugfix/, hotfix/, release/
- Commits: feat(scope):, fix(scope):, docs():, test():, refactor():
- PR required for main and develop branches
```

---

## Sprint 0 — Project Scaffold & Planning (Week 1-2)

> **Goal:** Everything ready to start coding. Solution scaffold, database,
> Docker, CI/CD skeleton.

### Feature 001: Backend Solution Scaffold

```bash
# Create feature branch
git checkout -b feature/001-project-scaffold

# Set feature context (if not using git branches)
export SPECIFY_FEATURE=001-project-scaffold
```

#### `/speckit.specify`

```
Feature: Backend Solution Scaffold for Mojaz Platform

WHAT WE'RE BUILDING:
A .NET 8 solution following Clean Architecture with 5 projects that serves as
the foundation for all backend development.

REQUIREMENTS:
 
1. Solution Structure:
   - Mojaz.Domain: Entities, Enums, Value Objects, Domain Interfaces
     - NO external NuGet packages (zero dependencies)
     - Base entity classes: BaseEntity (Id, CreatedAt, UpdatedAt),
       AuditableEntity (CreatedBy, UpdatedBy), SoftDeletableEntity (IsDeleted)
     - All 21 entity classes defined per database schema
     - Enums: ApplicationStatus, LicenseCategoryCode, FeeType,
       AppointmentType, DocumentType, NotificationEventType,
       PaymentStatus, TestResult, MedicalFitnessResult,
       UserRole, RegistrationMethod

   - Mojaz.Shared: Cross-cutting shared types
     - ApiResponse<T> with Success, Message, Data, Errors, StatusCode
     - PagedResult<T> with Items, TotalCount, Page, PageSize,
       TotalPages, HasPreviousPage, HasNextPage
     - Result<T> for internal operation results
     - Custom exceptions: NotFoundException, ValidationException,
       UnauthorizedException, ForbiddenException, ConflictException
     - Constants: Roles, Policies, CacheKeys
     - Extension methods

   - Mojaz.Application: Business logic layer
     - References: Domain, Shared only
     - Services interfaces and implementations
     - DTOs (Request/Response/Dto suffix)
     - FluentValidation validators
     - AutoMapper profiles
     - Service registration extension method

   - Mojaz.Infrastructure: External concerns
     - References: Domain, Shared, Application
     - EF Core DbContext (MojazDbContext)
     - Repository<T> implementation
     - UnitOfWork implementation
     - External service implementations (Email, SMS, Push)
     - EF Core entity configurations
     - Migrations
     - Infrastructure registration extension method

   - Mojaz.API: Composition root
     - References: All layers
     - Controllers (thin, delegate to services)
     - Middleware: GlobalExceptionHandler, RequestLogging, AuditLog
     - Filters: ValidationFilter
     - Program.cs with DI registration
     - Swagger/OpenAPI configuration with JWT auth support
     - CORS configuration
     - Rate limiting configuration
     - Serilog configuration (Console + File sinks)

2. NuGet Packages:
   - Domain: NONE
   - Shared: NONE
   - Application: AutoMapper 13, FluentValidation 11
   - Infrastructure: EF Core 8 (SqlServer), BCrypt.Net, SendGrid,
     Twilio, FirebaseAdmin, Hangfire, QuestPDF, Serilog
   - API: JwtBearer, Swashbuckle, AspNetCoreRateLimit

3. Test Projects (4):
   - Mojaz.Domain.Tests, Mojaz.Application.Tests,
     Mojaz.Infrastructure.Tests, Mojaz.API.Tests
   - Using: xUnit, Moq, FluentAssertions

4. Global Exception Handler:
   - Catch all unhandled exceptions
   - Return ApiResponse<object> with appropriate status code
   - Log exception details via Serilog
   - NEVER expose stack traces in production

5. Swagger Configuration:
   - JWT Bearer authentication button
   - API versioning support (v1)
   - XML documentation comments
   - Grouped by controller

6. appsettings.json structure:
   - ConnectionStrings.DefaultConnection
   - JwtSettings (Secret, Issuer, Audience, AccessTokenMinutes,
     RefreshTokenDays)
   - SendGridSettings (ApiKey, SenderEmail, SenderName)
   - TwilioSettings (AccountSid, AuthToken, FromNumber)
   - FirebaseSettings (ProjectId, CredentialPath)
   - HangfireSettings
   - RateLimitSettings

USER STORIES:
- As a developer, I want a clean architecture solution so that code is
  organized and maintainable
- As a developer, I want base classes and shared types so I don't
  repeat boilerplate code
- As a developer, I want Swagger documentation so I can test API endpoints

ACCEPTANCE CRITERIA:
- [ ] Solution builds with zero errors and zero warnings
- [ ] All 5 projects have correct references (no circular dependencies)
- [ ] Domain project has zero NuGet packages
- [ ] Application project does NOT reference Infrastructure
- [ ] All 21 entity classes created in Domain
- [ ] All enums created in Domain
- [ ] ApiResponse<T> and PagedResult<T> created in Shared
- [ ] Global exception handler returns ApiResponse format
- [ ] Swagger loads at /swagger with JWT auth button
- [ ] Serilog writes to console and file
- [ ] All 4 test projects build and run (even if empty)
- [ ] docker-compose.yml starts SQL Server container
- [ ] API starts and responds to health check endpoint
```

#### `/speckit.clarify`

```
Clarify the following areas for the backend solution scaffold:

1. Should we use MediatR/CQRS pattern or direct service injection?
   Decision: Direct service injection for MVP simplicity.

2. Should entities use data annotations or fluent API for EF Core?
   Decision: Fluent API only (in Infrastructure/Configurations/).

3. Should we use global query filters for soft delete?
   Decision: Yes, HasQueryFilter(x => !x.IsDeleted) on all entities.

4. What's the connection string format for Docker SQL Server?
   Format: Server=localhost,1433;Database=MojazDB;User Id=sa;
   Password=MojazDev@2025!;TrustServerCertificate=True

5. Should IRepository be generic or entity-specific?
   Decision: Generic IRepository<T> with option for entity-specific
   interfaces when custom methods needed.
```

#### `/speckit.plan`

```
Create the technical implementation plan for the backend solution scaffold.

Tech stack: ASP.NET Core 8, Clean Architecture, EF Core 8, SQL Server 2022

Focus on:
1. Exact file structure for each project
2. Base class implementations
3. DI registration pattern
4. Middleware pipeline order in Program.cs
5. Docker configuration for development
```

#### `/speckit.tasks`

```
Generate the task list for building the backend solution scaffold.
Break into atomic, implementable tasks.
Each task should result in a compilable state.
Order tasks by dependency — what must exist before what.
```

#### `/speckit.analyze`

```
Analyze the spec, plan, and tasks for the backend solution scaffold.
Check for:
1. Missing entity classes (should be 21 total)
2. Missing project references
3. Consistency between entity properties and database schema
4. Any circular dependencies
5. Missing middleware registrations
```

#### `/speckit.implement`

```
Implement all tasks for the backend solution scaffold.
Follow Clean Architecture strictly.
Ensure solution builds after each major task group.
```

---

### Feature 002: Frontend Foundation

```bash
git checkout -b feature/002-frontend-foundation
export SPECIFY_FEATURE=002-frontend-foundation
```

#### `/speckit.specify`

```
Feature: Frontend Foundation for Mojaz Platform

WHAT WE'RE BUILDING:
A Next.js 15 application with App Router that serves as the foundation
for all frontend development, including theming, i18n, layouts, and
API client configuration.

REQUIREMENTS:

1. Next.js 15 Project with App Router:
   - TypeScript 5 strict mode
   - src/ directory structure
   - @/* import alias

2. Tailwind CSS 4 + shadcn/ui:
   - Custom Mojaz theme colors:
     Primary: #006C35 (Royal Green) with full shade scale (50-900)
     Secondary: #D4A017 (Government Gold) with full scale
     Status: success=#10B981, warning=#F59E0B, error=#EF4444, info=#3B82F6
     Neutral: standard gray scale
   - shadcn/ui initialized with Mojaz theme
   - Components installed: Button, Card, Input, Label, Select, Textarea,
     Checkbox, Dialog, Sheet, DropdownMenu, Table, Badge, Avatar,
     Toast/Sonner, Alert, Form, Calendar, Accordion, Progress,
     Skeleton, Breadcrumb, Pagination, NavigationMenu, Sidebar,
     Tabs, RadioGroup, Switch, Popover, Tooltip, ScrollArea,
     Separator, Command, AlertDialog, DatePicker

3. Internationalization (next-intl 3):
   - Locale-based routing: /ar/... and /en/...
   - Arabic (RTL) is default locale
   - Middleware for locale detection and redirect
   - Translation file structure:
     public/locales/ar/common.json (shared translations)
     public/locales/ar/auth.json
     public/locales/ar/application.json
     public/locales/ar/dashboard.json
     public/locales/ar/navigation.json
     public/locales/en/... (same structure)
   - Initial translations for: navigation items, common actions
     (save, cancel, submit, edit, delete, search, filter, loading,
     error, success), auth labels, footer content

4. Theme Support (next-themes):
   - Dark mode and Light mode
   - System preference detection
   - Theme persisted in localStorage
   - Smooth transition between themes
   - All shadcn components support both themes

5. Layout System:
   - RootLayout: sets html lang, dir (rtl/ltr), font class
   - PublicLayout: for landing page and auth pages
     - Simple header with logo, language switch, theme switch, login/register
     - Minimal footer
   - ApplicantLayout: for applicant portal (authenticated)
     - Sidebar (right in RTL, left in LTR) with navigation
     - Header with: breadcrumb, notification bell, user avatar dropdown,
       language switch, theme switch
     - Main content area
     - Sidebar menu items:
       Dashboard, My Applications, New Application, Appointments,
       Payments, Notifications, My License, Profile
   - EmployeeLayout: for employee portal (authenticated)
     - Similar structure to ApplicantLayout
     - Sidebar items vary by role (Receptionist, Doctor, Examiner, etc.)
   - AdminLayout: for admin portal (authenticated)
     - Sidebar items: Dashboard, Users, Settings, Fees, Audit Logs

6. API Client (Axios):
   - Base instance with configurable baseURL
   - Request interceptor: inject JWT from auth store
   - Request interceptor: set Accept-Language header
   - Response interceptor: handle 401 → refresh token → retry
   - Response interceptor: handle errors → show toast
   - Type-safe wrapper functions

7. React Query Provider:
   - QueryClient with default options
   - Stale time: 5 minutes
   - Retry: 1 time
   - DevTools in development

8. Zustand Auth Store:
   - State: user, accessToken, refreshToken, isAuthenticated
   - Actions: login, logout, setTokens, clearAuth
   - Persist to localStorage (tokens only)
   - Hydration handling for SSR

9. TypeScript Types:
   - ApiResponse<T> matching backend contract
   - PaginatedResult<T> matching backend contract
   - User types (UserDto, LoginRequest, LoginResponse, etc.)
   - Common types (SelectOption, TableColumn, etc.)

10. Utility Functions (lib/utils.ts):
    - cn() for conditional Tailwind classes (clsx + tailwind-merge)
    - formatDate(date, locale) — respects AR/EN
    - formatCurrency(amount) — SAR with Arabic/English formatting
    - calculateAge(dateOfBirth)
    - getStatusColor(status)
    - getInitials(fullName)

11. Empty/Loading/Error States:
    - LoadingSkeleton component
    - EmptyState component (icon + message + optional action)
    - ErrorState component (icon + message + retry button)
    - PageLoading component (full page spinner)

12. 404 Page:
    - Bilingual not-found page
    - Link back to home

ACCEPTANCE CRITERIA:
- [ ] App loads at localhost:3000 with Arabic RTL layout
- [ ] Language switches instantly between AR and EN
- [ ] Layout direction flips correctly (sidebar, text alignment)
- [ ] Dark/Light mode toggles correctly
- [ ] All shadcn components render in Mojaz theme colors
- [ ] Public layout renders for unauthenticated pages
- [ ] Applicant layout renders with sidebar and header
- [ ] Employee layout renders with role-appropriate sidebar
- [ ] Admin layout renders with admin sidebar
- [ ] API client configured with interceptors
- [ ] Auth store persists between page refreshes
- [ ] TypeScript types match backend API contracts
- [ ] 404 page works in both languages
- [ ] Responsive on mobile, tablet, desktop
- [ ] Arabic font (IBM Plex Sans Arabic) loads correctly
- [ ] English font (Inter) loads correctly
```

#### `/speckit.plan` → `/speckit.tasks` → `/speckit.analyze` → `/speckit.implement`

---

### Feature 003: Database Foundation & Seed Data

```bash
git checkout -b feature/003-database-foundation
export SPECIFY_FEATURE=003-database-foundation
```

#### `/speckit.specify`

```
Feature: Database Foundation with 21 Tables and Seed Data

WHAT WE'RE BUILDING:
Complete database schema for the Mojaz platform with EF Core configurations,
migrations, indexes, constraints, and seed data.

REQUIREMENTS:

1. Entity Framework Core Configuration:
   - MojazDbContext with all 21 DbSets
   - Fluent API configurations (one file per entity in
     Infrastructure/Persistence/Configurations/)
   - Global query filter for soft delete on applicable entities
   - UTC date convention
   - Cascade delete behavior: Restrict (never cascade)

2. All 21 Tables (exact schema from PRD):

   Table 1: Users
   - Id (UNIQUEIDENTIFIER PK), FullName, Email (unique nullable),
     Phone (unique nullable), PasswordHash, Role, RegistrationMethod,
     IsEmailVerified, IsPhoneVerified, EmailVerifiedAt, PhoneVerifiedAt,
     LastLoginAt, FailedLoginAttempts, LockedUntil, IsActive,
     PreferredLanguage (default 'ar'), CreatedAt, UpdatedAt, IsDeleted
   - CHECK: Email IS NOT NULL OR Phone IS NOT NULL
   - Indexes: IX_Users_Email (filtered), IX_Users_Phone (filtered)

   Table 2: Applicants
   - Id, UserId (FK→Users 1:1), NationalId (unique), DateOfBirth,
     Gender, Nationality, BloodType, Address, City, Region,
     ApplicantType (Citizen|Resident), CreatedAt

   Table 3: Applications
   - Id, ApplicationNumber (unique, format MOJ-YYYY-XXXXXXXX),
     ApplicantId (FK→Applicants), ServiceType, LicenseCategoryId
     (FK→LicenseCategories), BranchId, Status (default 'Draft'),
     CurrentStage, PreferredLanguage, SpecialNeeds,
     DataAccuracyConfirmed, ExpiresAt, CancelledAt,
     CancellationReason, CreatedAt, UpdatedAt, IsDeleted

   Table 4: LicenseCategories
   - Id, Code (unique A|B|C|D|E|F), NameAr, NameEn, MinimumAge,
     RequiresTraining (default true), IsActive
   - NO soft delete (reference data)

   Table 5: Documents
   - Id, ApplicationId (FK→Applications), DocumentType, FileName,
     FilePath, FileSize, MimeType, IsRequired, Status (default 'Uploaded'),
     ReviewedBy (FK→Users), ReviewedAt, RejectionReason, UploadedAt

   Table 6: Appointments
   - Id, ApplicationId (FK→Applications), AppointmentType
     (Medical|Theory|Practical), ScheduledDate, TimeSlot, BranchId,
     Status (default 'Scheduled'), CancelledAt, CancellationReason,
     CreatedAt, UpdatedAt

   Table 7: MedicalExams
   - Id, ApplicationId (FK→Applications), ExamDate, DoctorId (FK→Users),
     FitnessResult (Fit|Unfit|ConditionalFit|RequiresReexam),
     BloodType, Notes, ReportReference, ValidUntil, CreatedAt

   Table 8: TrainingRecords
   - Id, ApplicationId (FK→Applications), SchoolName,
     CertificateNumber, CompletedHours, RequiredHours, IsExempt,
     ExemptionReason, ExemptionApprovedBy (FK→Users), Status,
     CompletedAt, CreatedAt

   Table 9: TheoryTests
   - Id, ApplicationId (FK→Applications), AttemptNumber, TestDate,
     ExaminerId (FK→Users), Score, PassingScore, Result
     (Pass|Fail|Absent), Notes, CreatedAt

   Table 10: PracticalTests
   - Id, ApplicationId (FK→Applications), AttemptNumber, TestDate,
     ExaminerId (FK→Users), Result (Pass|Fail|Absent), Notes,
     RequiresAdditionalTraining, AdditionalHoursRequired, CreatedAt

   Table 11: Payments
   - Id, ApplicationId (FK→Applications), FeeType, Amount,
     Currency (default 'SAR'), Status (default 'Pending'),
     PaymentMethod, TransactionReference, PaidAt, FailedAt,
     FailureReason, CreatedAt

   Table 12: FeeStructures
   - Id, FeeType, LicenseCategoryId (FK→LicenseCategories nullable),
     Amount, Currency, IsActive, EffectiveFrom, EffectiveTo,
     UpdatedBy (FK→Users), UpdatedAt

   Table 13: Licenses
   - Id, LicenseNumber (unique MOJ-YYYY-XXXXXXXX), ApplicationId
     (FK→Applications), ApplicantId (FK→Applicants), CategoryId
     (FK→LicenseCategories), IssueDate, ExpiryDate, Status
     (default 'Active'), IssuedBy (FK→Users), PrintedAt,
     DownloadedAt, CreatedAt

   Table 14: Notifications
   - Id, UserId (FK→Users), ApplicationId (FK→Applications nullable),
     TitleAr, TitleEn, MessageAr, MessageEn, EventType, IsRead,
     ReadAt, CreatedAt

   Table 15: PushTokens
   - Id, UserId (FK→Users), Token, DeviceType, IsActive, CreatedAt,
     LastUsedAt

   Table 16: AuditLogs
   - Id, UserId (nullable), Action, EntityType, EntityId,
     OldValues (JSON), NewValues (JSON), IpAddress, UserAgent,
     Timestamp
   - NO soft delete, NO foreign key constraint on UserId

   Table 17: SystemSettings
   - Id, SettingKey (unique), SettingValue, Category, Description,
     UpdatedBy (FK→Users), UpdatedAt

   Table 18: OtpCodes
   - Id, UserId (FK→Users nullable), Destination, DestinationType
     (Email|Phone), CodeHash, Purpose (Registration|Login|PasswordReset),
     ExpiresAt, IsUsed, UsedAt, AttemptCount, MaxAttempts, CreatedAt,
     IpAddress

   Table 19: RefreshTokens
   - Id, UserId (FK→Users), Token (unique), ExpiresAt, IsRevoked,
     RevokedAt, ReplacedByToken, CreatedAt, CreatedByIp

   Table 20: EmailLogs
   - Id, UserId (FK→Users nullable), ToEmail, Subject, TemplateName,
     Status (Sent|Failed|Bounced), ProviderMessageId, FailureReason,
     SentAt, CreatedAt

   Table 21: SmsLogs
   - Id, UserId (FK→Users nullable), ToPhone, MessageType
     (OTP|Notification|Reminder), Status, ProviderMessageId,
     FailureReason, Cost, SentAt, CreatedAt

3. Relationships:
   - Users 1:1 Applicants
   - Users 1:N AuditLogs, Notifications, OtpCodes, PushTokens,
     EmailLogs, SmsLogs, RefreshTokens
   - Applicants 1:N Applications, Licenses
   - Applications 1:N Documents, Appointments, MedicalExams,
     TrainingRecords, TheoryTests, PracticalTests, Payments,
     Notifications
   - Applications N:1 LicenseCategories
   - Applications 1:1 Licenses
   - LicenseCategories 1:N FeeStructures, Licenses

4. Seed Data:
   a) Default Admin User:
      - FullName: "مدير النظام" / "System Admin"
      - Email: admin@mojaz.gov.sa
      - Password: Admin@Mojaz2025 (BCrypt hashed)
      - Role: Admin
      - IsEmailVerified: true, IsActive: true

   b) Sample Users (one per role for testing):
      - Applicant: applicant@test.com / Test@1234
      - Receptionist: receptionist@mojaz.gov.sa / Test@1234
      - Doctor: doctor@mojaz.gov.sa / Test@1234
      - Examiner: examiner@mojaz.gov.sa / Test@1234
      - Manager: manager@mojaz.gov.sa / Test@1234
      - Security: security@mojaz.gov.sa / Test@1234

   c) 6 License Categories:
      - A: Motorcycle, دراجة نارية, MinAge=16
      - B: Private Car, سيارة خاصة, MinAge=18
      - C: Commercial/Taxi, تجاري/أجرة, MinAge=21
      - D: Bus/Transport, حافلة/نقل ركاب, MinAge=21
      - E: Heavy Vehicles, مركبات ثقيلة, MinAge=21
      - F: Agricultural, مركبات زراعية, MinAge=18

   d) System Settings (all configurable values):
      - MIN_AGE_CATEGORY_A = 16
      - MIN_AGE_CATEGORY_B = 18
      - MIN_AGE_CATEGORY_C = 21
      - MIN_AGE_CATEGORY_D = 21
      - MIN_AGE_CATEGORY_E = 21
      - MIN_AGE_CATEGORY_F = 18
      - MAX_THEORY_ATTEMPTS = 3
      - MAX_PRACTICAL_ATTEMPTS = 3
      - COOLING_PERIOD_DAYS = 7
      - MEDICAL_VALIDITY_DAYS = 90
      - APPLICATION_VALIDITY_MONTHS = 6
      - OTP_VALIDITY_MINUTES_SMS = 5
      - OTP_VALIDITY_MINUTES_EMAIL = 15
      - OTP_MAX_ATTEMPTS = 3
      - OTP_RESEND_COOLDOWN_SECONDS = 60
      - OTP_MAX_RESEND_PER_HOUR = 3
      - PASSWORD_MIN_LENGTH = 8
      - ACCOUNT_LOCKOUT_ATTEMPTS = 5
      - ACCOUNT_LOCKOUT_MINUTES = 15
      - JWT_ACCESS_TOKEN_MINUTES = 60
      - JWT_REFRESH_TOKEN_DAYS = 7
      - MAX_FILE_SIZE_MB = 5
      - TRAINING_HOURS_A = 20
      - TRAINING_HOURS_B = 30
      - TRAINING_HOURS_C = 40
      - TRAINING_HOURS_D = 50
      - TRAINING_HOURS_E = 50
      - TRAINING_HOURS_F = 20
      - THEORY_QUESTIONS_A = 30
      - THEORY_QUESTIONS_B = 30
      - THEORY_QUESTIONS_C = 40
      - THEORY_QUESTIONS_D = 40
      - THEORY_QUESTIONS_E = 40
      - THEORY_QUESTIONS_F = 20
      - LICENSE_VALIDITY_YEARS_A = 10
      - LICENSE_VALIDITY_YEARS_B = 10
      - LICENSE_VALIDITY_YEARS_C = 5
      - LICENSE_VALIDITY_YEARS_D = 5
      - LICENSE_VALIDITY_YEARS_E = 5
      - LICENSE_VALIDITY_YEARS_F = 10

   e) Default Fee Structures:
      - ApplicationFee: 100 SAR (all categories)
      - MedicalExamFee: 200 SAR
      - TheoryTestFee: 50 SAR
      - PracticalTestFee: 100 SAR
      - RetakeTestFee: 75 SAR
      - IssuanceFee_A: 200 SAR
      - IssuanceFee_B: 400 SAR
      - IssuanceFee_C: 500 SAR
      - IssuanceFee_D: 600 SAR
      - IssuanceFee_E: 700 SAR
      - IssuanceFee_F: 300 SAR

ACCEPTANCE CRITERIA:
- [ ] All 21 tables created via EF Core migration
- [ ] All indexes created
- [ ] All constraints (check, unique, FK) enforced
- [ ] Soft delete query filter active on applicable entities
- [ ] Seed data inserted on first migration
- [ ] Migration can be rolled back cleanly
- [ ] No cascade delete (all Restrict)
- [ ] All relationships navigable in both directions
```

---

## Sprint 1-2 — Infrastructure, Auth & Integrations (Week 3-6)

> **Goal:** Complete authentication system + real notification integrations

### Feature 004: User Registration System

```bash
git checkout -b feature/004-auth-registration
export SPECIFY_FEATURE=004-auth-registration
```

#### `/speckit.specify`

```
Feature: User Registration via Email and Phone with Real OTP

WHAT WE'RE BUILDING:
Complete user registration system supporting two methods (email and phone)
with real OTP verification via SendGrid (email) and Twilio (SMS).

REQUIREMENTS:

1. Registration via Email:
   Flow: User enters data → System sends real email with 6-digit OTP →
         User enters OTP → Account activated

   Endpoint: POST /api/v1/auth/register
   Request body:
   {
     "fullName": "string, required, 2-200 chars",
     "email": "string, required when method=Email, valid format, unique",
     "password": "string, required, 8+ chars, upper+lower+number+special",
     "confirmPassword": "string, must match password",
     "registrationMethod": "Email",
     "preferredLanguage": "ar|en, default ar",
     "termsAccepted": "boolean, must be true"
   }

   Response (201):
   {
     "success": true,
     "message": "Account created. Please verify your email.",
     "data": {
       "userId": "guid",
       "email": "user@example.com",
       "requiresVerification": true
     },
     "statusCode": 201
   }

   Business Logic:
   - Check email not already registered (case-insensitive)
   - Hash password with BCrypt (cost factor 12)
   - Create User record with IsEmailVerified=false
   - Generate 6-digit random OTP
   - Hash OTP with BCrypt before storing in OtpCodes table
   - Set OTP expiry: 15 minutes (from SystemSettings)
   - Send real email via SendGrid with HTML template
   - Log email attempt in EmailLogs table
   - Create audit log entry for registration
   - Return 201 with userId

2. Registration via Phone:
   Same flow but:
   - Phone field required instead of email (E.164 format: +966XXXXXXXXX)
   - OTP sent via real SMS (Twilio)
   - OTP expiry: 5 minutes (from SystemSettings)
   - SMS logged in SmsLogs table

3. Validation Rules (FluentValidation):
   - FullName: NotEmpty, MaxLength(200), MinLength(2)
   - Email: NotEmpty (when Email method), valid email format,
     must not exist in Users table
   - Phone: NotEmpty (when Phone method), matches E.164 regex,
     must not exist in Users table
   - Password: NotEmpty, MinLength(8 from SystemSettings),
     must contain uppercase, lowercase, number, special character
   - ConfirmPassword: must equal Password
   - RegistrationMethod: must be "Email" or "Phone"
   - TermsAccepted: must be true

4. Error Responses:
   - 400: Validation errors (field-level)
   - 409: Email/Phone already registered
   - 429: Rate limit exceeded (5 registrations per minute per IP)
   - 500: Internal error (email/SMS send failure → still create account,
     log error, allow OTP resend)

5. OTP Record (OtpCodes table):
   - UserId: the new user's ID
   - Destination: email or phone
   - DestinationType: "Email" or "Phone"
   - CodeHash: BCrypt hash of 6-digit OTP
   - Purpose: "Registration"
   - ExpiresAt: now + 15min (email) or now + 5min (SMS)
   - IsUsed: false
   - AttemptCount: 0
   - MaxAttempts: 3 (from SystemSettings)
   - IpAddress: captured from request

6. Email Template (Registration OTP):
   - Professional government design
   - Bilingual (Arabic section + English section)
   - Contains: Logo, greeting with name, OTP code (large font),
     expiry notice, "Do not share" warning, footer
   - Subject AR: "مُجاز — رمز التحقق من حسابك"
   - Subject EN: "Mojaz — Your Verification Code"

7. SMS Template:
   - Max 160 characters
   - Bilingual: "Mojaz verification code: 123456 — Valid 5 min.
     رمز التحقق: 123456 — صالح 5 دقائق"

ACCEPTANCE CRITERIA:
- [ ] User can register with valid email → receives real email with OTP
- [ ] User can register with valid phone → receives real SMS with OTP
- [ ] Duplicate email returns 409
- [ ] Duplicate phone returns 409
- [ ] Weak password returns 400 with specific requirement message
- [ ] Missing required fields return 400 with field-level errors
- [ ] Terms not accepted returns 400
- [ ] OTP stored as hash (not plain text)
- [ ] Password stored as hash (not plain text)
- [ ] User created with IsEmailVerified=false / IsPhoneVerified=false
- [ ] Audit log entry created
- [ ] Email logged in EmailLogs
- [ ] SMS logged in SmsLogs
- [ ] Rate limiting works (429 after 5 attempts/minute)
- [ ] All responses follow ApiResponse<T> format
- [ ] Swagger documentation complete
```

---

### Feature 005: OTP Verification System

```bash
git checkout -b feature/005-otp-verification
export SPECIFY_FEATURE=005-otp-verification
```

#### `/speckit.specify`

```
Feature: OTP Verification and Resend System

WHAT WE'RE BUILDING:
OTP verification endpoint that activates user accounts, and OTP resend
endpoint with rate limiting and cooldown.

REQUIREMENTS:

1. Verify OTP Endpoint:
   POST /api/v1/auth/verify-otp
   Request:
   {
     "destination": "email or phone",
     "code": "123456",
     "purpose": "Registration"
   }

   Logic:
   - Find most recent unused OTP for this destination + purpose
   - Check OTP not expired
   - Check attempt count < maxAttempts (3)
   - Compare code against stored hash (BCrypt verify)
   - On SUCCESS:
     - Mark OTP as used (IsUsed=true, UsedAt=now)
     - Activate user account:
       If email: IsEmailVerified=true, EmailVerifiedAt=now
       If phone: IsPhoneVerified=true, PhoneVerifiedAt=now
     - Return success message
     - Create audit log
   - On FAILURE (wrong code):
     - Increment AttemptCount
     - If AttemptCount >= MaxAttempts: invalidate this OTP
     - Return error with remaining attempts
   - On EXPIRED:
     - Return error suggesting resend

   Response (200 success):
   {
     "success": true,
     "message": "Account verified successfully",
     "data": { "verified": true }
   }

   Response (400 wrong code):
   {
     "success": false,
     "message": "Invalid verification code",
     "data": { "remainingAttempts": 2 }
   }

2. Resend OTP Endpoint:
   POST /api/v1/auth/resend-otp
   Request:
   {
     "destination": "email or phone",
     "destinationType": "Email|Phone",
     "purpose": "Registration"
   }

   Logic:
   - Check cooldown: last OTP sent < 60 seconds ago → reject
   - Check hourly limit: OTPs sent in last hour < 3 → reject
   - Invalidate all previous unused OTPs for this destination+purpose
   - Generate new 6-digit OTP
   - Hash and store new OTP
   - Send via appropriate channel (email/SMS)
   - Log delivery attempt

   Response (200):
   {
     "success": true,
     "message": "Verification code sent",
     "data": {
       "destination": "a***@example.com",
       "expiresInMinutes": 15,
       "nextResendAvailableIn": 60
     }
   }

   Response (429):
   {
     "success": false,
     "message": "Please wait before requesting another code",
     "data": { "retryAfterSeconds": 45 }
   }

ACCEPTANCE CRITERIA:
- [ ] Correct OTP within time limit → account activated
- [ ] Wrong OTP → attempt count incremented, remaining shown
- [ ] Expired OTP → clear error message
- [ ] 3 wrong attempts → OTP invalidated, must resend
- [ ] Resend within 60s cooldown → 429 error
- [ ] Resend more than 3 times per hour → 429 error
- [ ] Old OTPs invalidated when new one sent
- [ ] Destination masked in response (a***@example.com)
- [ ] Audit log for successful verification
- [ ] Works for both Email and Phone
```

---

### Feature 006: Login and JWT Authentication

```bash
git checkout -b feature/006-auth-login-jwt
export SPECIFY_FEATURE=006-auth-login-jwt
```

#### `/speckit.specify`

```
Feature: User Login with JWT Access Token and Refresh Token Rotation

WHAT WE'RE BUILDING:
Login system that authenticates users via email or phone + password,
issues JWT access tokens and refresh tokens with secure rotation.

REQUIREMENTS:

1. Login Endpoint:
   POST /api/v1/auth/login
   Request:
   {
     "identifier": "email or phone number",
     "password": "user password",
     "method": "Email|Phone"
   }

   Logic:
   - Find user by email (if method=Email) or phone (if method=Phone)
   - User not found → 401 "Invalid credentials" (don't reveal which)
   - User not verified → 401 "Account not verified"
   - User locked (LockedUntil > now) → 401 "Account locked, try after X"
   - User not active → 401 "Account is deactivated"
   - Verify password hash (BCrypt)
   - Wrong password:
     - Increment FailedLoginAttempts
     - If FailedLoginAttempts >= 5 (from SystemSettings):
       Set LockedUntil = now + 15 minutes (from SystemSettings)
     - Create audit log (failed login with IP)
     - Return 401
   - Correct password:
     - Reset FailedLoginAttempts to 0
     - Clear LockedUntil
     - Update LastLoginAt
     - Generate JWT access token (claims: UserId, Email/Phone, Role,
       FullName, PreferredLanguage)
     - Generate refresh token (random 64-byte base64 string)
     - Store refresh token in RefreshTokens table
     - Create audit log (successful login with IP)
     - Return tokens + user info

   Response (200):
   {
     "success": true,
     "data": {
       "accessToken": "eyJ...",
       "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4=",
       "expiresAt": "2025-07-15T11:00:00Z",
       "user": {
         "id": "guid",
         "fullName": "أحمد محمد",
         "email": "ahmed@example.com",
         "role": "Applicant",
         "preferredLanguage": "ar"
       }
     }
   }

2. JWT Configuration:
   - Algorithm: HMAC-SHA256
   - Access token expiry: 60 minutes (from SystemSettings)
   - Claims: sub (UserId), email, phone, role, fullName, language, jti
   - Issuer: "MojazAPI"
   - Audience: "MojazClient"
   - Secret: from configuration (min 32 chars)

3. Refresh Token Endpoint:
   POST /api/v1/auth/refresh-token
   Request:
   {
     "accessToken": "expired JWT",
     "refreshToken": "valid refresh token"
   }

   Logic:
   - Extract claims from expired access token (without validating expiry)
   - Find refresh token in database
   - Validate: not expired, not revoked
   - Generate new access token
   - Generate new refresh token
   - Revoke old refresh token (IsRevoked=true, RevokedAt=now)
   - Store new refresh token (ReplacedByToken links old→new)
   - Return new tokens

   Response (200): same as login response

4. Logout Endpoint:
   POST /api/v1/auth/logout
   [Authorize] required
   Request:
   {
     "refreshToken": "current refresh token"
   }

   Logic:
   - Revoke the refresh token
   - Create audit log
   - Return success

5. Password Recovery:
   POST /api/v1/auth/forgot-password
   Request: { "identifier": "email or phone", "method": "Email|Phone" }
   Logic: Send OTP to email/phone (same OTP system, purpose=PasswordReset)

   POST /api/v1/auth/reset-password
   Request:
   {
     "destination": "email or phone",
     "code": "123456",
     "newPassword": "NewSecureP@ss1",
     "confirmPassword": "NewSecureP@ss1"
   }
   Logic: Verify OTP → update password hash → invalidate all refresh tokens

ACCEPTANCE CRITERIA:
- [ ] Valid credentials → returns JWT + refresh token
- [ ] Invalid email/phone → 401 generic message (no user enumeration)
- [ ] Wrong password → 401, increment failed attempts
- [ ] 5 wrong attempts → account locked 15 minutes
- [ ] Locked account → 401 with unlock time
- [ ] Unverified account → 401 with message
- [ ] Deactivated account → 401 with message
- [ ] JWT contains correct claims (userId, role, etc.)
- [ ] Protected endpoint rejects expired token → 401
- [ ] Refresh token generates new access token
- [ ] Old refresh token revoked after rotation
- [ ] Logout revokes refresh token
- [ ] Password recovery sends OTP
- [ ] Password reset with valid OTP updates password
- [ ] All auth events logged in AuditLog
- [ ] All responses follow ApiResponse<T> format
```

---

### Feature 007: Real Email Integration (SendGrid)

```bash
git checkout -b feature/007-email-sendgrid
export SPECIFY_FEATURE=007-email-sendgrid
```

#### `/speckit.specify`

```
Feature: Real Email Delivery via SendGrid with 10 HTML Templates

WHAT WE'RE BUILDING:
Production email service using SendGrid API with professional bilingual
HTML email templates for all 10 notification types.

REQUIREMENTS:

1. IEmailService Interface (Application layer):
   - SendAsync(EmailMessage message) → Task<bool>
   - SendTemplatedAsync(string templateName, Dictionary<string,string> data,
     string toEmail, string toName, string language) → Task<bool>

2. SendGridEmailService Implementation (Infrastructure layer):
   - Configure from appsettings: ApiKey, SenderEmail, SenderName
   - Build email using SendGrid SDK
   - Handle errors with 3 retries (exponential backoff)
   - Log every attempt to EmailLogs table
     (Status: Sent|Failed|Bounced, ProviderMessageId, FailureReason)
   - Support attachments (for license PDF in future)

3. 10 HTML Email Templates:
   Each template must:
   - Have professional government design (green header with logo)
   - Support both Arabic and English (single template, dual sections)
   - Be responsive (mobile-friendly)
   - Include: header with logo, body content, footer with disclaimer
   - Use inline CSS (for email client compatibility)

   Templates:
   01. account-verification: OTP code (large, centered), expiry notice
   02. password-recovery: OTP code, security warning
   03. application-received: App number, service type, next steps
   04. documents-missing: List of missing documents, deadline
   05. appointment-confirmed: Type, date, time, location, preparation tips
   06. medical-result: Result (fit/unfit), doctor name, next steps
   07. test-result: Test type, result (pass/fail), score, next steps
   08. application-decision: Approved/Rejected, reason if rejected
   09. license-issued: License number, download link, validity
   10. payment-confirmed: Amount, reference, fee type, receipt link

4. Sender Configuration:
   - From: no-reply@mojaz.gov.sa
   - From Name AR: "منصة مُجاز"
   - From Name EN: "Mojaz Platform"

ACCEPTANCE CRITERIA:
- [ ] Email sent successfully via SendGrid API
- [ ] All 10 templates render correctly in Gmail, Outlook, Apple Mail
- [ ] Templates display Arabic text correctly (RTL)
- [ ] Templates display English text correctly (LTR)
- [ ] Failed sends logged with error reason
- [ ] Retry logic works (3 attempts)
- [ ] EmailLogs table populated for every send attempt
- [ ] Template data substitution works ({{name}}, {{otp}}, etc.)
- [ ] Attachments can be added (for future license PDF)
```

---

### Feature 008: Real SMS Integration (Twilio)

```bash
git checkout -b feature/008-sms-twilio
export SPECIFY_FEATURE=008-sms-twilio
```

#### `/speckit.specify`

```
Feature: Real SMS Delivery via Twilio with 6 Message Templates

WHAT WE'RE BUILDING:
Production SMS service using Twilio API with bilingual message templates.

REQUIREMENTS:

1. ISmsService Interface (Application layer):
   - SendAsync(SmsMessage message) → Task<bool>
   - SendOtpAsync(string phone, string otp, string language) → Task<bool>

2. TwilioSmsService Implementation (Infrastructure layer):
   - Configure from appsettings: AccountSid, AuthToken, FromNumber
   - Send via Twilio REST API
   - Handle errors with 2 retries
   - Log every attempt to SmsLogs table
     (Status, ProviderMessageId, FailureReason, Cost)
   - Message max 160 characters (or handle multi-part)

3. 6 SMS Templates (bilingual, max 160 chars):
   01. registration-otp:
       "Mojaz code: {code} - Valid {min} min. رمز مُجاز: {code} - صالح {min} د"
   02. recovery-otp:
       "Mojaz reset: {code} - Valid {min} min. إعادة تعيين: {code} - صالح {min} د"
   03. appointment-confirmed:
       "Mojaz: Appointment {date} {time}. مُجاز: موعدك {date} {time}"
   04. appointment-reminder:
       "Mojaz: Reminder tomorrow {time}. مُجاز: تذكير غداً {time}"
   05. test-result:
       "Mojaz: Your {type} result is ready. مُجاز: نتيجة {type} جاهزة"
   06. license-ready:
       "Mojaz: License ready! Download now. مُجاز: رخصتك جاهزة! حمّلها الآن"

ACCEPTANCE CRITERIA:
- [ ] SMS sent successfully via Twilio API
- [ ] All 6 templates fit within 160 characters
- [ ] Messages contain both Arabic and English text
- [ ] Failed sends logged with error reason
- [ ] SmsLogs table populated for every attempt
- [ ] Cost tracked per message
- [ ] Phone number validated (E.164 format)
```

---

### Feature 009: Push Notifications (Firebase FCM)

```bash
git checkout -b feature/009-push-firebase
export SPECIFY_FEATURE=009-push-firebase
```

#### `/speckit.specify`

```
Feature: Real Push Notifications via Firebase Cloud Messaging

WHAT WE'RE BUILDING:
Web push notification system using Firebase Cloud Messaging (FCM),
including backend sending service and frontend permission/token management.

REQUIREMENTS:

BACKEND:
1. IPushNotificationService Interface:
   - SendToUserAsync(Guid userId, PushMessage message) → Task<bool>
   - SendToUsersAsync(List<Guid> userIds, PushMessage message) → Task
   - RegisterTokenAsync(Guid userId, string token, string deviceType)
   - UnregisterTokenAsync(string token)

2. FirebasePushService Implementation:
   - Configure Firebase Admin SDK from service account JSON
   - Send via FCM HTTP v1 API
   - Handle invalid tokens (remove from PushTokens table)
   - Support bilingual notifications
   - Send to ALL user's registered tokens

3. API Endpoints:
   POST /api/v1/notifications/push/register-token
   [Authorize]
   { "token": "fcm_token", "deviceType": "WebChrome|WebFirefox|WebSafari" }

   DELETE /api/v1/notifications/push/unregister-token
   [Authorize]
   { "token": "fcm_token" }

FRONTEND:
4. Firebase JS SDK Configuration:
   - firebase.ts config file with project credentials
   - Service worker: public/firebase-messaging-sw.js

5. usePushNotifications Hook:
   - requestPermission() → asks browser permission
   - registerToken() → gets FCM token, sends to backend
   - unregisterToken() → on logout
   - Handle foreground messages → show toast notification
   - Handle notification click → navigate to relevant page

6. Permission Flow:
   - Request AFTER login (not on page load)
   - Show friendly prompt explaining benefits before browser prompt
   - If denied → gracefully degrade to other channels
   - If granted → register token immediately

7. 10 Push Event Types:
   (title shown in user's preferred language)
   01. APPLICATION_CREATED: "Your application received"
   02. DOCUMENTS_MISSING: "Please complete documents"
   03. PAYMENT_STATUS: "Payment confirmed" / "Payment failed"
   04. APPOINTMENT_BOOKED: "Appointment booked"
   05. APPOINTMENT_REMINDER: "Appointment tomorrow"
   06. MEDICAL_RESULT: "Medical exam result ready"
   07. TEST_RESULT: "Test result issued"
   08. APPLICATION_APPROVED: "Application approved!"
   09. LICENSE_ISSUED: "License ready for download!"
   10. APPLICATION_CANCELLED: "Application cancelled"

ACCEPTANCE CRITERIA:
- [ ] Push permission requested after login (not before)
- [ ] Token registered in PushTokens table on approval
- [ ] Push notification appears in browser
- [ ] Notification appears even when not on Mojaz site
- [ ] Clicking notification navigates to correct page
- [ ] Token cleaned up on logout
- [ ] Invalid tokens removed on FCM error response
- [ ] Works on Chrome, Firefox, Edge
- [ ] Graceful fallback when permission denied
- [ ] Bilingual titles based on user language preference
```

---

### Feature 010: Unified Notification Service

```bash
git checkout -b feature/010-unified-notifications
export SPECIFY_FEATURE=010-unified-notifications
```

#### `/speckit.specify`

```
Feature: Unified Notification Service with 4 Channels

WHAT WE'RE BUILDING:
A single notification service that dispatches to all applicable channels
(In-App, Push, Email, SMS) based on event type and user preferences.

REQUIREMENTS:

1. INotificationService Interface:
   SendAsync(NotificationRequest request) → Task

2. NotificationRequest Model:
   {
     userId: Guid,
     applicationId: Guid? (optional),
     eventType: NotificationEventType enum,
     titleAr: string,
     titleEn: string,
     messageAr: string,
     messageEn: string,
     channels: NotificationChannel[] (InApp, Push, Email, SMS),
     data: Dictionary<string,string> (template variables),
     priority: Normal|High
   }

3. Dispatch Logic:
   For each channel in request.channels:
   a) InApp → SYNCHRONOUS
      - Create Notification record in database immediately
      - Always sent (cannot be disabled by user)

   b) Push → ASYNC via Hangfire
      - Check: user has registered push tokens
      - Check: user hasn't disabled push in preferences
      - Queue background job to send via FCM

   c) Email → ASYNC via Hangfire
      - Check: user has email address
      - Check: user hasn't disabled email notifications
      - Queue background job to send via SendGrid

   d) SMS → ASYNC via Hangfire
      - Check: user has phone number
      - Check: user hasn't disabled SMS notifications
      - Queue background job to send via Twilio

4. User Notification Preferences:
   Stored in Users table or separate preferences:
   - EnableEmailNotifications: bool (default true)
   - EnableSmsNotifications: bool (default true)
   - EnablePushNotifications: bool (default true)
   - InApp: ALWAYS ON (no toggle)

5. In-App Notification Endpoints:
   GET /api/v1/notifications
   [Authorize] — returns user's notifications (paginated, newest first)
   Query: ?isRead=false&page=1&pageSize=20

   PATCH /api/v1/notifications/{id}/read
   [Authorize] — mark single notification as read

   PATCH /api/v1/notifications/read-all
   [Authorize] — mark all as read

   GET /api/v1/notifications/unread-count
   [Authorize] — returns count for badge

6. Notification Bell Component (Frontend):
   - Bell icon in header
   - Unread count badge (red circle with number)
   - Click → dropdown with latest 5 notifications
   - Each: title, message preview, time ago, read/unread indicator
   - Click notification → navigate to related page + mark as read
   - "View all" link → full notifications page
   - Real-time update via polling (every 30 seconds) or WebSocket

7. Hangfire Configuration:
   - Dashboard at /hangfire (admin only)
   - SQL Server storage
   - Retry policy: 3 attempts with exponential backoff
   - Dead letter queue for failed notifications

ACCEPTANCE CRITERIA:
- [ ] Single SendAsync call dispatches to all applicable channels
- [ ] In-App notification created synchronously
- [ ] Push/Email/SMS dispatched via background jobs
- [ ] User preferences respected (disabled channel = skipped)
- [ ] In-App notifications cannot be disabled
- [ ] Notification bell shows unread count
- [ ] Dropdown shows latest notifications
- [ ] Mark as read works (single and bulk)
- [ ] Hangfire dashboard accessible to admin
- [ ] Failed notifications retried 3 times
- [ ] Bilingual notifications (AR/EN based on user language)
```

---

### Feature 011: RBAC + User Management + Settings

```bash
git checkout -b feature/011-rbac-user-settings
export SPECIFY_FEATURE=011-rbac-user-settings
```

#### `/speckit.specify`

```
Feature: Role-Based Access Control, User Management, and System Settings

WHAT WE'RE BUILDING:
RBAC authorization system with 7 roles, admin user management CRUD,
and admin system settings management.

REQUIREMENTS:

1. RBAC Authorization:
   7 Roles: Applicant, Receptionist, Doctor, Examiner, Manager,
            Security, Admin

   Authorization Policies:
   - ApplicantOnly: Role == Applicant
   - EmployeeOnly: Role in (Receptionist, Doctor, Examiner, Manager, Security)
   - MedicalStaff: Role == Doctor
   - TestingStaff: Role == Examiner
   - ApprovalAuthority: Role in (Manager, Security)
   - ManagementOnly: Role == Manager
   - AdminOnly: Role == Admin
   - ManagementOrAdmin: Role in (Manager, Admin)

   Resource Ownership:
   - Applicant can ONLY access own applications, documents, payments
   - Doctor can ONLY see applications assigned/referred to them
   - Examiner can ONLY see applications in testing stage
   - Implement IResourceAuthorizationService to check ownership

2. User Management Endpoints (Admin only):
   GET    /api/v1/users                  — List all users (paginated, filterable)
   POST   /api/v1/users                  — Create new user (admin creates employee accounts)
   GET    /api/v1/users/{id}             — Get user details
   PUT    /api/v1/users/{id}             — Update user info
   PATCH  /api/v1/users/{id}/role        — Change user role
   PATCH  /api/v1/users/{id}/toggle-active — Activate/deactivate user

   Filters: role, isActive, search (name/email/phone), dateRange
   Sort: name, createdAt, lastLoginAt, role

3. System Settings Endpoints (Admin only):
   GET /api/v1/settings/policies         — All system settings grouped by category
   PUT /api/v1/settings/policies         — Update settings (batch)
   GET /api/v1/settings/fees             — All fee structures
   PUT /api/v1/settings/fees             — Update fee structures

   On update: audit log with old + new values, updatedBy, timestamp

4. Frontend — User Management Page:
   - Data table with all users
   - Columns: Name, Email/Phone, Role (badge), Status, Last Login, Actions
   - Create user dialog/modal
   - Edit user dialog/modal
   - Role change dropdown with confirmation
   - Activate/deactivate toggle with confirmation
   - Search and filter controls

5. Frontend — Settings Pages:
   - System Policies page: grouped settings with edit capability
   - Fee Management page: fee table with edit capability
   - Show old vs new value on change
   - Save with confirmation dialog

6. Frontend — Auth Pages:
   - Registration page with Email/Phone tabs
   - Login page with Email/Phone tabs
   - OTP verification page (6-digit input)
   - Password recovery flow (3 steps)
   - All pages: RTL/LTR, Dark/Light, responsive

ACCEPTANCE CRITERIA:
- [ ] Each role can only access permitted endpoints (401/403)
- [ ] Applicant cannot see other applicants' data
- [ ] Admin can create/edit/deactivate users
- [ ] Admin can change user roles
- [ ] Admin can view and edit system settings
- [ ] Admin can view and edit fee structures
- [ ] Setting changes logged in audit trail
- [ ] User management page with full CRUD
- [ ] Settings page with grouped policies
- [ ] Fee management page with category-based fees
- [ ] Auth pages complete with all flows
```

---

## Sprint 3-4 — Applications & Documents (Week 7-10)

### Feature 012: Application CRUD Backend

```bash
git checkout -b feature/012-application-crud
export SPECIFY_FEATURE=012-application-crud
```

#### `/speckit.specify`

```
Feature: Application Creation, Management, and Status Tracking Backend

WHAT WE'RE BUILDING:
Complete backend for application lifecycle: create, read, update,
submit, cancel, and status tracking with Gate 1 validation.

REQUIREMENTS:

1. Application Service (IApplicationService):
   - CreateAsync(CreateApplicationRequest, userId) → ApplicationDto
   - GetByIdAsync(applicationId, userId) → ApplicationDto
   - GetListAsync(filters, pagination, userId, userRole) → PagedResult
   - UpdateDraftAsync(applicationId, UpdateApplicationRequest) → ApplicationDto
   - SubmitAsync(applicationId) → ApplicationDto
   - CancelAsync(applicationId, reason, userId) → ApplicationDto
   - GetTimelineAsync(applicationId) → ApplicationTimelineDto
   - CheckEligibilityAsync(applicantId, categoryCode) → EligibilityResult

2. Gate 1 — Pre-Creation Validation:
   Called before creating application:
   a) Valid applicant profile exists
   b) Age >= minimum for requested category (from SystemSettings)
   c) No other active application exists for this applicant
      (active = Status NOT IN Draft, Cancelled, Rejected, Complete)
   d) No security/judicial block (simulated: always clean in MVP)

   Return specific error messages for each failed check:
   - "You must be at least {age} years old for category {code}"
   - "You already have an active application (#{appNumber})"

3. Application Number Generation:
   Format: MOJ-{YEAR}-{8 random digits}
   Must be unique (check before saving, retry if collision)

4. Draft vs Submit:
   - Draft: partial data allowed, status = "Draft"
   - Submit: ALL required fields validated, status = "Submitted"
   - Auto-save: frontend sends PUT every 30 seconds for drafts

5. Application Expiry:
   - Set ExpiresAt = CreatedAt + APPLICATION_VALIDITY_MONTHS (from settings)
   - Background job (Hangfire): daily check for expired applications
   - Expired → Status = "Expired", notification sent

6. Ownership Rules:
   - Applicant role: sees only own applications
   - Receptionist: sees applications in DocumentReview stage
   - Doctor: sees applications in MedicalExam stage
   - Examiner: sees applications in TheoryTest or PracticalTest stage
   - Manager: sees ALL applications
   - Admin: sees ALL applications

7. API Endpoints:
   POST   /api/v1/applications                    [Applicant, Receptionist]
   GET    /api/v1/applications                    [All authenticated]
   GET    /api/v1/applications/{id}               [Owner or Employee+]
   PUT    /api/v1/applications/{id}               [Owner, status=Draft only]
   PATCH  /api/v1/applications/{id}/status        [Role-based per stage]
   PATCH  /api/v1/applications/{id}/cancel        [Owner or Manager]
   GET    /api/v1/applications/{id}/timeline      [Owner or Employee+]

8. Filters for GET /applications:
   - status (multi-select)
   - currentStage (multi-select)
   - serviceType
   - licenseCategoryCode
   - branchId
   - search (applicationNumber or applicant name)
   - dateFrom, dateTo
   - sortBy (createdAt, updatedAt, applicationNumber)
   - sortDir (asc, desc)
   - page, pageSize

9. Notifications on:
   - Application submitted → Applicant + relevant employee queue
   - Application cancelled → Applicant

10. Audit Logging for:
    - Application created
    - Application submitted
    - Application cancelled
    - Status change

ACCEPTANCE CRITERIA:
- [ ] Applicant can create application (Draft)
- [ ] Gate 1 blocks underage applicants
- [ ] Gate 1 blocks applicants with active application
- [ ] Application number generated in correct format
- [ ] Draft can be updated multiple times
- [ ] Submit validates all required fields
- [ ] Applicant sees only own applications
- [ ] Employee sees applications in their stage
- [ ] Manager sees all applications
- [ ] Cancel works with reason
- [ ] Timeline returns all stage history
- [ ] Pagination, filtering, sorting work
- [ ] Notifications sent on submit and cancel
- [ ] Audit log created for all operations
- [ ] Expired applications auto-closed by background job
```

---

### Feature 013: Application Wizard Frontend

```bash
git checkout -b feature/013-application-wizard
export SPECIFY_FEATURE=013-application-wizard
```

#### `/speckit.specify`

```
Feature: Multi-Step Application Wizard (5 Steps) — Frontend

WHAT WE'RE BUILDING:
A 5-step wizard for creating new license applications with real-time
validation, draft auto-save, and bilingual support.

REQUIREMENTS:

1. Wizard Steps:
   Step 1: Service Selection (8 service cards)
   Step 2: License Category Selection (6 category cards with age validation)
   Step 3: Personal Information Form (9 fields)
   Step 4: Application Details (6 fields)
   Step 5: Review & Submit (summary + declaration)

2. Step 1 — Service Selection:
   - Grid of 8 cards: icon (Lucide), title (AR/EN), short description
   - Services: New License, Renewal, Replacement, Category Upgrade,
     Test Retake, Appointment Booking, Cancellation, Document Download
   - Only "New License" active for this wizard (others navigate to own flows)
   - Selected state: primary color border + checkmark

3. Step 2 — License Category:
   - 6 cards: code letter, icon, name (AR/EN), minimum age badge
   - On selection: API call to check eligibility (age + active application)
   - If underage: show error inline, disable next button
   - Category details panel: training hours, test requirements, validity
   - Category upgrade paths shown if relevant

4. Step 3 — Personal Information Form:
   Fields with React Hook Form + Zod validation:
   - National ID / Residence No. (required, 10 digits)
   - Date of Birth (required, date picker, age calculated and displayed)
   - Nationality (required, select dropdown)
   - Gender (required, radio: Male/Female)
   - Mobile (pre-filled from account, editable)
   - Email (pre-filled if available)
   - Address (required, text input)
   - City (required, select dropdown)
   - Region (required, select dropdown)

5. Step 4 — Application Details:
   - Applicant Type (required, radio: Citizen/Resident)
     - Conditional documents shown based on selection
   - Preferred Center (required, select dropdown)
   - Test Language (optional, select: Arabic/English)
   - Appointment Preference (optional, select: Morning/Afternoon)
   - Special Needs (optional, textarea, max 500 chars)

6. Step 5 — Review & Submit:
   - Summary cards for each section
   - Edit button per section (returns to that step)
   - Data Accuracy Declaration checkbox (required)
   - Submit button → confirmation dialog:
     "Are you sure? This action cannot be undone."
   - On submit: loading state with spinner
   - On success: success page with application number, next steps
   - On error: error toast with retry button

7. Wizard State Management (Zustand store):
   - Current step
   - Form data for all steps
   - Selected service
   - Selected category
   - Draft saved status
   - Auto-save timer (every 30 seconds if data changed)

8. Progress Indicator:
   - Horizontal step bar at top
   - Step number + label for each step
   - Completed steps: green checkmark
   - Current step: primary color, active
   - Future steps: gray
   - Completion percentage text

9. Navigation:
   - Back button (returns to previous step, data preserved)
   - Next button (validates current step before advancing)
   - Steps clickable for completed steps (can go back)
   - Cannot skip ahead to uncompleted steps

ACCEPTANCE CRITERIA:
- [ ] 5-step wizard renders correctly
- [ ] Progress indicator updates correctly
- [ ] Step 1: service cards display and select correctly
- [ ] Step 2: category cards with age validation
- [ ] Step 2: eligibility API call blocks underage users
- [ ] Step 3: all form fields validate correctly
- [ ] Step 3: date of birth shows calculated age
- [ ] Step 4: conditional document info based on applicant type
- [ ] Step 5: all data displayed in summary
- [ ] Step 5: edit buttons return to correct step
- [ ] Step 5: declaration checkbox required
- [ ] Submit creates application via API
- [ ] Success page shows application number
- [ ] Auto-save works every 30 seconds
- [ ] Draft preserved on page refresh
- [ ] Back/Next navigation preserves data
- [ ] Full Arabic RTL layout
- [ ] Full English LTR layout
- [ ] Dark mode support
- [ ] Light mode support
- [ ] Responsive on mobile
```

---

### Feature 014: Document Upload & Review

```bash
git checkout -b feature/014-document-management
export SPECIFY_FEATURE=014-document-management
```

#### `/speckit.specify`

```
Feature: Document Upload (Applicant) and Document Review (Employee)

WHAT WE'RE BUILDING:
File upload system for 8 document types with server-side validation,
and a review interface for employees to approve/reject documents.

REQUIREMENTS:

BACKEND:
1. Document Upload:
   POST /api/v1/applications/{id}/documents [Applicant, Receptionist]
   - Multipart form data: file + documentType
   - Validation:
     - File types: PDF, JPG, JPEG, PNG only
     - Max size: 5MB (from SystemSettings)
     - Verify MIME type from file headers (not just extension)
     - Application must be in appropriate stage
   - Storage: local file system (configurable path)
   - Record in Documents table

2. Document List:
   GET /api/v1/applications/{id}/documents [Owner, Employee+]
   - Returns all documents for application
   - Include status, review info

3. Document Delete:
   DELETE /api/v1/applications/{id}/documents/{docId} [Owner, status=Uploaded only]
   - Soft delete + remove file from storage
   - Only if document not yet reviewed

4. Document Review:
   PATCH /api/v1/documents/{id}/review [Receptionist, Manager]
   { "status": "Approved|Rejected", "rejectionReason": "..." }
   - On rejection: notification to applicant with reason

5. 8 Document Types:
   Mandatory (4): IdCopy, PersonalPhoto, MedicalReport, TrainingCertificate
   Conditional (4): AddressProof, GuardianConsent, PreviousLicense,
                     AccessibilityDocuments

FRONTEND — Applicant:
6. Document Upload Page:
   - 8 document type cards showing:
     - Document name (AR/EN)
     - Required/Optional badge
     - Upload zone (drag & drop + click)
     - File preview (image thumbnail or PDF icon)
     - Upload progress bar
     - Status badge (Uploaded/Approved/Rejected)
     - Delete button (if Uploaded status)
     - Rejection reason (if rejected)
   - Conditional documents shown/hidden based on application data

FRONTEND — Employee:
7. Document Review Panel (in application detail page):
   - Document list with previews
   - Click to view full size (modal/lightbox)
   - Approve button (with confirmation)
   - Reject button (with reason input modal)
   - Bulk approve option

ACCEPTANCE CRITERIA:
- [ ] Upload accepts PDF, JPG, JPEG, PNG only
- [ ] Upload rejects files > 5MB
- [ ] Upload rejects invalid MIME types
- [ ] File stored on server with unique name
- [ ] Document record created in database
- [ ] Drag & drop upload works
- [ ] File preview shows thumbnail/icon
- [ ] Upload progress displayed
- [ ] Delete works for unreviewed documents
- [ ] Employee can approve documents
- [ ] Employee can reject with reason
- [ ] Rejection triggers notification to applicant
- [ ] Conditional documents shown based on applicant type
- [ ] Responsive layout for document grid
```

---

### Feature 015: Status Tracking & Dashboards

```bash
git checkout -b feature/015-status-dashboards
export SPECIFY_FEATURE=015-status-dashboards
```

#### `/speckit.specify`

```
Feature: Application Timeline, Status Tracking, and Role-Based Dashboards

WHAT WE'RE BUILDING:
Visual timeline for application progress, status badges, applicant dashboard,
and employee application queue.

REQUIREMENTS:

1. Application Timeline (10 stages):
   - Vertical timeline component
   - Each stage shows: number, name (AR/EN), status icon, timestamp
   - Completed: green checkmark + completion date
   - Current: highlighted primary color + pulsing dot
   - Failed: red X + failure reason
   - Future: gray circle + grayed text
   - Expandable: click stage for details (notes, assigned to, duration)

2. Status Badge Component:
   Colors by status:
   - Draft: gray
   - Submitted: blue
   - InReview: yellow
   - Approved: green
   - Rejected: red
   - Cancelled: gray (strikethrough)
   - Expired: orange
   - Pending: yellow
   - Complete: green (with checkmark)

3. Applicant Dashboard:
   - Welcome card: "مرحباً {name}" with user avatar
   - Quick actions: New Application, My Applications, Book Appointment
   - Active applications list (ApplicationCard components)
   - Upcoming appointments (next 7 days)
   - Recent notifications (last 5)
   - Quick stats: total applications, active, completed

4. Employee Dashboard (role-based content):
   - Receptionist: pending document reviews count, queue
   - Doctor: pending medical exams, today's schedule
   - Examiner: pending tests, today's schedule
   - Manager: KPI cards, application volume, bottleneck alerts
   - All: quick access to relevant queue

5. Employee Application Queue:
   - TanStack Table with columns:
     Application #, Applicant Name, Category (badge), Status (badge),
     Stage, Submitted Date, Last Updated, Priority, Actions
   - Filters: status, stage, category, date range, search
   - Sortable columns
   - Pagination (20/50/100 per page)
   - Row click → application detail page
   - Bulk actions for manager (reassign, escalate)

6. Application Detail Page (Employee view):
   - Application header: number, status, stage, dates
   - Applicant info card
   - Document review section
   - Stage history timeline
   - Action buttons (based on role + current stage)
   - Notes section

ACCEPTANCE CRITERIA:
- [ ] Timeline displays all 10 stages correctly
- [ ] Current stage highlighted with animation
- [ ] Failed stages show reason
- [ ] Status badges show correct colors
- [ ] Applicant dashboard shows relevant data
- [ ] Employee dashboard shows role-specific content
- [ ] Application table supports filter/sort/search/pagination
- [ ] Application detail shows comprehensive info
- [ ] All components support RTL/LTR + Dark/Light
```

---

## Sprint 5-6 — Medical, Training & Tests (Week 11-14)

### Feature 016: Appointment System

```bash
export SPECIFY_FEATURE=016-appointment-system
```

#### `/speckit.specify` (abbreviated — follow same pattern)

```
Feature: Appointment Booking, Rescheduling, and Reminder System

Requirements: Available slots generation, booking with conflict check,
reschedule within limits, cancel with reason, 24h reminder via Hangfire,
calendar UI with time slot picker, Gate 2 validation before booking.

Endpoints: POST /appointments, GET /appointments/available-slots,
PATCH /appointments/{id}/reschedule, PATCH /appointments/{id}/cancel
```

### Feature 017: Medical Examination

```bash
export SPECIFY_FEATURE=017-medical-examination
```

```
Feature: Medical Exam Recording by Doctor with Result Notification

Requirements: Doctor records fitness result (Fit/Unfit/ConditionalFit/
RequiresReexam), blood type, notes, validity period from settings,
notification on result, audit log, Gate validation for medical expiry.

Endpoints: POST /medical-exams, GET /medical-exams/{appId},
PATCH /medical-exams/{id}/result
```

### Feature 018: Training Records

```bash
export SPECIFY_FEATURE=018-training-records
```

```
Feature: Training Completion Recording and Exemption Management

Requirements: Manual training data entry by employee, hours tracking
per category, exemption with approval workflow, gate check before tests.
```

### Feature 019: Theory Test

```bash
export SPECIFY_FEATURE=019-theory-test
```

```
Feature: Theory Test Recording with Attempt Tracking and Retake Logic

Requirements: Examiner records score + result, attempt counting,
max attempts from settings (default 3), cooling period between
attempts (default 7 days), Gate 3 validation, notifications.

Endpoint: POST /theory-tests/{appId}/result
```

### Feature 020: Practical Test

```bash
export SPECIFY_FEATURE=020-practical-test
```

```
Feature: Practical Test Recording with Additional Training Flag

Requirements: Same as theory but with additional training requirement
on failure, additional hours tracking. Includes test history endpoint.

Endpoints: POST /practical-tests/{appId}/result,
GET /tests/{appId}/history
```

### Feature 021: Category F Agricultural Specifics

```bash
export SPECIFY_FEATURE=021-category-f-agricultural
```

```
Feature: Agricultural Vehicle Category (F) Complete Support

Requirements: Verify all F-specific settings, specialized UI descriptions,
upgrade path F→B, agricultural equipment icons and terminology.
```

---

## Sprint 7-8 — Approval, Payment & License (Week 15-18)

### Feature 022: Final Approval Stage

```bash
export SPECIFY_FEATURE=022-final-approval
```

```
Feature: Final Approval with Gate 4 Comprehensive Validation

Requirements: Gate 4 checks (theory passed, practical passed, security
clean, no blocks, ID valid, medical valid, payments current), approve/
reject/return actions by Manager, checklist UI, notifications.
```

### Feature 023: Payment Simulation

```bash
export SPECIFY_FEATURE=023-payment-system
```

```
Feature: Multi-Point Payment Simulation with Fee Management

Requirements: 6 payment points in workflow, fees from FeeStructures
table, simulated processing (2s delay), configurable failure rate,
transaction reference generation, receipt PDF, payment history.

Endpoints: POST /payments/initiate, POST /payments/{id}/confirm,
GET /payments/{appId}, GET /payments/{id}/receipt
```

### Feature 024: License Issuance & PDF

```bash
export SPECIFY_FEATURE=024-license-issuance
```

```
Feature: License Generation with PDF Download

Requirements: Generate license number, calculate expiry by category
(A,B,F=10yr; C,D,E=5yr), QuestPDF generation with government design,
bilingual PDF, QR code, photo, download endpoint, notifications.

Endpoints: POST /licenses/{appId}/issue, GET /licenses/{id},
GET /licenses/{id}/download
```

### Feature 025: Renewal Service

```bash
export SPECIFY_FEATURE=025-license-renewal
```

```
Feature: License Renewal Simplified Workflow

Requirements: Verify existing license, simplified stages (skip training
if not expired long), renewal fee, new license with updated dates,
deactivate old license.
```

### Feature 026: Replacement Service

```bash
export SPECIFY_FEATURE=026-license-replacement
```

```
Feature: Lost/Damaged License Replacement

Requirements: Verify active license exists, reason documentation,
replacement fee, new license number same details, deactivate old.
```

### Feature 027: Category Upgrade Service

```bash
export SPECIFY_FEATURE=027-category-upgrade
```

```
Feature: License Category Upgrade with Path Validation

Requirements: Validate upgrade paths (B→C→D→E, F→B), holding period
check (12 months from settings), full workflow for new category.
```

---

## Sprint 9-10 — Reports, Polish & Launch (Week 19-20)

### Feature 028: Reports System (7 Reports)

```bash
export SPECIFY_FEATURE=028-reports-system
```

```
Feature: 7 Operational Reports with Charts and Data Tables

Requirements: All 7 reports with filters, Recharts visualizations,
TanStack Table data display, CSV/PDF export, Manager/Admin access.

Reports: Applications by Status, Applications by Service,
Test Pass/Fail Rates, Delayed Applications, Branch Performance,
Examiner/Doctor Performance, Daily/Monthly Issuance.

Endpoints: 6 GET /reports/* endpoints
```

### Feature 029: Landing Page

```bash
export SPECIFY_FEATURE=029-landing-page
```

```
Feature: Professional Government Landing Page (9 Sections)

Requirements: Hero with CTA, 8 service cards, 6-step timeline,
6 category cards, feature highlights, statistics counters (animated),
FAQ accordion, header + footer. Framer Motion animations.
Full responsive, RTL/LTR, Dark/Light, high performance.
```

### Feature 030: Security Audit & Hardening

```bash
export SPECIFY_FEATURE=030-security-hardening
```

```
Feature: Security Review and Production Hardening

Requirements: OWASP top 10 verification, security headers,
rate limiting verification, input sanitization audit, file upload
security, error message sanitization, JWT security review,
CORS configuration, HTTPS enforcement.
```

### Feature 031: Comprehensive Testing

```bash
export SPECIFY_FEATURE=031-comprehensive-testing
```

```
Feature: E2E Testing Suite and Cross-Browser Verification

Requirements: Playwright E2E tests for all major flows,
cross-browser (Chrome, Firefox, Safari, Edge), RTL/LTR visual
regression, Dark/Light verification, mobile responsive testing,
performance benchmarks (API < 2s, page load < 3s).
Target: 500+ total tests.
```

### Feature 032: Deployment & Launch

```bash
export SPECIFY_FEATURE=032-deployment-launch
```

```
Feature: Production Deployment and Launch Preparation

Requirements: Production Docker Compose, database migration,
environment configuration, SSL setup, DNS configuration,
monitoring setup, backup configuration, demo data creation,
health check endpoints, documentation, runbook.
```

---

## Complete Feature Map

```
SPRINT 0 — FOUNDATION
├── 001-project-scaffold          Backend .NET solution
├── 002-frontend-foundation       Next.js app with theme + i18n
└── 003-database-foundation       21 tables + seed data

SPRINT 1-2 — AUTH & INTEGRATIONS
├── 004-auth-registration         Email + Phone registration
├── 005-otp-verification          OTP verify + resend
├── 006-auth-login-jwt            Login + JWT + refresh + recovery
├── 007-email-sendgrid            Real email with 10 templates
├── 008-sms-twilio                Real SMS with 6 templates
├── 009-push-firebase             Real push with 10 events
├── 010-unified-notifications     4-channel notification service
└── 011-rbac-user-settings        Roles + user mgmt + settings

SPRINT 3-4 — APPLICATIONS
├── 012-application-crud          Application backend + Gate 1
├── 013-application-wizard        5-step wizard frontend
├── 014-document-management       Upload + review system
└── 015-status-dashboards         Timeline + dashboards + queue

SPRINT 5-6 — EXAMS & TESTS
├── 016-appointment-system        Booking + slots + reminders
├── 017-medical-examination       Doctor exam recording
├── 018-training-records          Training + exemptions
├── 019-theory-test               Theory test + attempts
├── 020-practical-test            Practical test + history
└── 021-category-f-agricultural   Category F specifics

SPRINT 7-8 — APPROVAL & LICENSE
├── 022-final-approval            Gate 4 + approve/reject
├── 023-payment-system            Multi-point payment simulation
├── 024-license-issuance          License generation + PDF
├── 025-license-renewal           Renewal service
├── 026-license-replacement       Replacement service
└── 027-category-upgrade          Upgrade service

SPRINT 9-10 — REPORTS & LAUNCH
├── 028-reports-system            7 operational reports
├── 029-landing-page              9-section landing page
├── 030-security-hardening        Security audit
├── 031-comprehensive-testing     E2E + cross-browser
└── 032-deployment-launch         Production deployment
```

---

## Workflow Cheatsheet for Every Feature

```bash
# ═══════════════════════════════════════════════════
# REPEAT THIS FOR EVERY FEATURE (001 through 032)
# ═══════════════════════════════════════════════════

# 1. Create branch
git checkout develop
git checkout -b feature/{NNN}-{feature-name}

# 2. Set feature context
export SPECIFY_FEATURE={NNN}-{feature-name}

# 3. Define WHAT to build
/speckit.specify
# → Paste the full requirements for this feature
# → Creates: features/{NNN}/spec.md

# 4. Clarify ambiguities (optional but recommended)
/speckit.clarify
# → Agent asks questions about unclear areas
# → You answer → spec gets refined

# 5. Create technical plan
/speckit.plan
# → Agent creates implementation plan with file paths,
#    patterns, dependencies
# → Creates: features/{NNN}/plan.md

# 6. Generate task list
/speckit.tasks
# → Agent creates ordered, atomic task checklist
# → Creates: features/{NNN}/tasks.md

# 7. Verify consistency (recommended)
/speckit.analyze
# → Agent checks spec ↔ plan ↔ tasks alignment
# → Reports gaps or inconsistencies

# 8. Build it
/speckit.implement
# → Agent executes all tasks sequentially
# → Creates actual code files

# 9. Commit and merge
git add .
git commit -m "feat({scope}): {description}"
git push origin feature/{NNN}-{feature-name}
# → Create PR → Review → Merge to develop

# 10. Tag if sprint boundary
git tag v{X.Y.Z}
```

---

## Quality Gates Per Sprint

```
AFTER SPRINT 0:
  □ Solution builds
  □ Database migrated
  □ Frontend loads
  □ Docker Compose works

AFTER SPRINT 1-2:
  □ Registration + Login works
  □ Real OTP via email and SMS
  □ Push notifications in browser
  □ 150+ tests passing
  □ Tag: v0.2.0

AFTER SPRINT 3-4:
  □ Application wizard creates applications
  □ Documents uploaded and reviewed
  □ Status timeline displays
  □ 300+ tests passing
  □ Tag: v0.4.0 

AFTER SPRINT 5-6:
  □ Medical exam recorded
  □ Tests recorded with retry logic
  □ Appointments with reminders
  □ 400+ tests passing
  □ Tag: v0.6.0

AFTER SPRINT 7-8:
  □ Full 10-stage workflow completes
  □ Payment simulation works
  □ License PDF generated
  □ 450+ tests passing
  □ Tag: v0.8.0

AFTER SPRINT 9-10:
  □ 7 reports with charts
  □ Landing page complete
  □ All E2E tests pass
  □ Security review passed
  □ 500+ tests passing
  □ Deployed to production
  □ Tag: v1.0.0
```