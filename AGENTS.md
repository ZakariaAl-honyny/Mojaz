# AGENTS.md — Mojaz (مُجاز) Platform

> This file defines instructions, rules, and conventions for AI coding agents
> (Cursor, Copilot, Claude, etc.) working on the Mojaz platform.
> Every agent MUST read and follow these rules before generating any code.

---

## 🏗️ PROJECT IDENTITY

```yaml
Project: Mojaz (مُجاز) — Government Driving License Platform
Type: Full-Stack Web Application
Domain: Government / GovTech / Driving License Lifecycle
Languages: Arabic (RTL, default) + English (LTR)
Design System: Absher-Inspired, Royal Green (#006C35)
MVP Scope: 8 services, 6 license categories, 7 roles, 10 workflow stages
```

---

## 📐 ARCHITECTURE RULES

### Backend — ASP.NET Core 8 (Clean Architecture)

```
Mojaz.sln
├── src/
│   ├── Mojaz.Domain/           → Entities, Enums, Value Objects, Interfaces
│   │                             NO external dependencies. NO NuGet packages.
│   │                             This is the innermost layer.
│   │
│   ├── Mojaz.Shared/           → ApiResponse<T>, PagedResult<T>, Constants,
│   │                             Exceptions, Extensions
│   │                             Shared across all layers. Minimal dependencies.
│   │
│   ├── Mojaz.Application/      → Services, DTOs, Validators, Interfaces,
│   │                             AutoMapper Profiles, Commands/Queries
│   │                             Depends on: Domain, Shared
│   │                             NO direct reference to Infrastructure.
│   │
│   ├── Mojaz.Infrastructure/   → EF Core DbContext, Repositories, External
│   │                             Service Implementations (Email, SMS, Push),
│   │                             Migrations, Configurations
│   │                             Depends on: Domain, Shared, Application
│   │
│   └── Mojaz.API/              → Controllers, Middleware, Filters, Program.cs,
│                                  Swagger Config, DI Registration
│                                  Depends on: All layers (composition root)
│
├── tests/
│   ├── Mojaz.Domain.Tests/
│   ├── Mojaz.Application.Tests/
│   ├── Mojaz.Infrastructure.Tests/
│   └── Mojaz.API.Tests/
```

**STRICT RULES:**
- Domain layer has ZERO external dependencies
- Application layer NEVER references Infrastructure directly
- Use interfaces in Application, implement in Infrastructure
- All database access goes through Repository + Unit of Work pattern
- Controllers are THIN — delegate all logic to Application services
- Never put business logic in controllers
- Never put business logic in repositories

### Frontend — Next.js 15 (App Router)

```
frontend/
├── public/
│   ├── locales/
│   │   ├── ar/              → Arabic translation JSON files
│   │   └── en/              → English translation JSON files
│   ├── images/
│   └── firebase-messaging-sw.js
│
├── src/
│   ├── app/
│   │   ├── [locale]/        → Locale-based routing
│   │   │   ├── (public)/    → Landing page, auth pages (no auth required)
│   │   │   │   ├── page.tsx              → Landing page
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   │
│   │   │   ├── (applicant)/  → Applicant portal (auth required, role: Applicant)
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── applications/
│   │   │   │   │   ├── page.tsx          → List
│   │   │   │   │   ├── new/page.tsx      → Wizard
│   │   │   │   │   └── [id]/page.tsx     → Detail/Timeline
│   │   │   │   ├── appointments/page.tsx
│   │   │   │   ├── payments/page.tsx
│   │   │   │   ├── notifications/page.tsx
│   │   │   │   └── license/[id]/page.tsx
│   │   │   │
│   │   │   ├── (employee)/   → Employee portal (auth required, roles: Receptionist, Doctor, Examiner, Manager, Security)
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── applications/
│   │   │   │   ├── appointments/
│   │   │   │   ├── results/
│   │   │   │   └── reports/
│   │   │   │
│   │   │   └── (admin)/      → Admin portal (auth required, role: Admin)
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── users/
│   │   │       ├── settings/
│   │   │       └── audit-logs/
│   │   │
│   │   ├── api/              → Next.js API routes (if needed for BFF)
│   │   ├── layout.tsx        → Root layout
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/               → shadcn/ui components (Button, Card, Input, etc.)
│   │   ├── layout/           → Header, Sidebar, Footer, NavigationMenu
│   │   ├── forms/            → Reusable form components
│   │   ├── data-display/     → Tables, Charts, Cards, Timeline
│   │   ├── feedback/         → Toast, Alert, Modal, Loading
│   │   └── domain/           → Business-specific components
│   │       ├── application/  → ApplicationCard, ApplicationWizard, StatusBadge
│   │       ├── appointment/  → AppointmentCalendar, TimeSlotPicker
│   │       ├── license/      → LicenseCard, LicensePreview
│   │       └── notification/ → NotificationBell, NotificationList
│   │
│   ├── hooks/                → Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useApplications.ts
│   │   ├── useNotifications.ts
│   │   └── usePushNotifications.ts
│   │
│   ├── lib/                  → Utility libraries
│   │   ├── api-client.ts     → Axios instance with interceptors
│   │   ├── auth.ts           → JWT token management
│   │   ├── validations/      → Zod schemas
│   │   ├── utils.ts          → General utilities (cn, formatDate, etc.)
│   │   └── constants.ts      → App constants
│   │
│   ├── stores/               → Zustand stores
│   │   ├── auth-store.ts
│   │   ├── application-store.ts
│   │   └── notification-store.ts
│   │
│   ├── services/             → API service functions (used by React Query)
│   │   ├── auth.service.ts
│   │   ├── application.service.ts
│   │   ├── appointment.service.ts
│   │   ├── payment.service.ts
│   │   └── notification.service.ts
│   │
│   ├── types/                → TypeScript type definitions
│   │   ├── api.types.ts      → ApiResponse<T>, PaginatedResult<T>
│   │   ├── auth.types.ts
│   │   ├── application.types.ts
│   │   ├── user.types.ts
│   │   └── notification.types.ts
│   │
│   ├── providers/            → React context providers
│   │   ├── query-provider.tsx
│   │   ├── theme-provider.tsx
│   │   └── locale-provider.tsx
│   │
│   └── styles/
│       └── globals.css       → Tailwind directives + custom CSS
│
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎨 DESIGN SYSTEM & THEMING

### Color Palette

```typescript
// ALL agents MUST use these exact colors. NEVER invent new colors.

const mojazColors = {
  // Primary — Royal Green (Government)
  primary: {
    50:  '#E6F2EC',
    100: '#B3D9C4',
    200: '#80C09C',
    300: '#4DA674',
    400: '#1A8D4C',
    500: '#006C35',  // ← Main primary. Use this as DEFAULT.
    600: '#005C2D',
    700: '#004C25',
    800: '#003C1D',
    900: '#002C15',
  },

  // Secondary — Government Gold
  secondary: {
    50:  '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#D4A017',  // ← Main secondary
    600: '#C49000',
    700: '#A67C00',
    800: '#8D6A00',
    900: '#6D5200',
  },

  // Status Colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error:   '#EF4444',
    info:    '#3B82F6',
  },

  // Neutral
  neutral: {
    50:  '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },
};
```

### Typography

```css
/* Arabic: ALWAYS use this font */
font-family: 'IBM Plex Sans Arabic', 'Cairo', sans-serif;

/* English: ALWAYS use this font */
font-family: 'Inter', 'IBM Plex Sans', sans-serif;
```

### Tailwind Config Extension

```typescript
// tailwind.config.ts — agents MUST extend, never override
{
  theme: {
    extend: {
      colors: {
        primary: mojazColors.primary,
        secondary: mojazColors.secondary,
        // Map shadcn variables
      },
      fontFamily: {
        arabic: ['IBM Plex Sans Arabic', 'Cairo', 'sans-serif'],
        english: ['Inter', 'IBM Plex Sans', 'sans-serif'],
      },
      borderRadius: {
        'gov': '8px',  // Government-style rounded corners
      },
    },
  },
}
```

### Component Styling Rules

```
1. ALWAYS use Tailwind CSS utility classes
2. NEVER use inline styles
3. NEVER create separate CSS files per component (only globals.css)
4. Use cn() utility for conditional classes (from lib/utils.ts)
5. Use shadcn/ui as base — customize with Mojaz theme
6. Every component MUST support RTL and LTR
7. Every component MUST support Dark and Light mode
8. Use CSS logical properties: ms-4 (margin-inline-start) not ml-4
9. Use start/end instead of left/right for RTL compatibility
```

---

## 📝 NAMING CONVENTIONS

### Backend (C#)

```csharp
// Files & Classes: PascalCase
ApplicationService.cs
CreateApplicationDto.cs
ApplicationValidator.cs

// Interfaces: I + PascalCase
IApplicationService.cs
IApplicationRepository.cs

// Methods: PascalCase (async methods end with Async)
public async Task<ApiResponse<ApplicationDto>> CreateApplicationAsync(...)
public async Task<PagedResult<ApplicationDto>> GetApplicationsAsync(...)

// Properties: PascalCase
public string FullName { get; set; }
public DateTime CreatedAt { get; set; }

// Private fields: _camelCase
private readonly IApplicationRepository _applicationRepository;
private readonly IUnitOfWork _unitOfWork;

// Constants: UPPER_SNAKE_CASE
public const string MIN_AGE_CATEGORY_A = "MIN_AGE_CATEGORY_A";

// Enums: PascalCase (singular)
public enum ApplicationStatus { Draft, Submitted, InReview, Approved, Rejected }
public enum LicenseCategoryCode { A, B, C, D, E, F }
public enum FeeType { ApplicationFee, MedicalExamFee, TheoryTestFee, PracticalTestFee, IssuanceFee, RetakeFee }

// DTOs: End with Dto, Request, Response
CreateApplicationRequest.cs
ApplicationDto.cs
ApplicationListResponse.cs
LoginRequest.cs
LoginResponse.cs

// Validators: End with Validator
CreateApplicationValidator.cs
LoginRequestValidator.cs
```

### Frontend (TypeScript/React)

```typescript
// Components: PascalCase.tsx
ApplicationWizard.tsx
StatusBadge.tsx
NotificationBell.tsx

// Hooks: camelCase starting with "use"
useAuth.ts
useApplications.ts
usePushNotifications.ts

// Services: camelCase ending with ".service.ts"
auth.service.ts
application.service.ts

// Types: PascalCase ending with relevant suffix
ApplicationDto, CreateApplicationRequest, LoginResponse
ApiResponse<T>, PaginatedResult<T>

// Stores: camelCase ending with "-store.ts"
auth-store.ts
application-store.ts

// Schemas (Zod): camelCase ending with "Schema"
loginSchema, createApplicationSchema, personalInfoSchema

// Constants: UPPER_SNAKE_CASE
export const API_BASE_URL = '...'
export const MAX_FILE_SIZE = 5 * 1024 * 1024

// Page files: page.tsx (Next.js App Router convention)
// Layout files: layout.tsx
// Loading files: loading.tsx
// Error files: error.tsx

// Translation keys: dot.separated.lowercase
"application.create.title"
"auth.login.submit"
"common.save"
```

### Database

```sql
-- Tables: PascalCase (plural)
Users, Applications, Payments, LicenseCategories

-- Columns: PascalCase
Id, FullName, CreatedAt, ApplicationNumber

-- Primary Keys: always "Id"
-- Foreign Keys: RelatedTableSingular + "Id"
ApplicantId → Applicants(Id)
LicenseCategoryId → LicenseCategories(Id)
ReviewedBy → Users(Id)   -- Exception: when FK name would be ambiguous

-- Indexes: IX_TableName_ColumnName
IX_Users_Email
IX_Applications_ApplicantId

-- Constraints: CK_TableName_Description
CK_Users_Contact
```

---

## 🔌 API CONVENTIONS

### URL Structure

```
Base: /api/v1/{resource}

GET    /api/v1/applications              → List (paginated)
GET    /api/v1/applications/{id}         → Single
POST   /api/v1/applications              → Create
PUT    /api/v1/applications/{id}         → Full update
PATCH  /api/v1/applications/{id}/status  → Partial update (specific action)
DELETE /api/v1/applications/{id}         → Soft delete

Nested resources:
POST   /api/v1/applications/{id}/documents
GET    /api/v1/applications/{id}/documents

Actions (not CRUD):
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/payments/initiate
PATCH  /api/v1/applications/{id}/cancel
```

### Standard Response — MANDATORY for ALL endpoints

```csharp
// Mojaz.Shared/ApiResponse.cs
// EVERY endpoint returns this wrapper. No exceptions.

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }
    public int StatusCode { get; set; }
}

// Paginated lists use:
public class PagedResult<T>
{
    public List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public bool HasPreviousPage { get; set; }
    public bool HasNextPage { get; set; }
}

// So paginated endpoint returns: ApiResponse<PagedResult<ApplicationDto>>
```

### Controller Pattern

```csharp
// EVERY controller follows this exact pattern:

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;

    public ApplicationsController(IApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    /// <summary>
    /// Create a new application
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Applicant,Receptionist")]
    [ProducesResponseType(typeof(ApiResponse<ApplicationDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync(
        [FromBody] CreateApplicationRequest request)
    {
        var result = await _applicationService.CreateApplicationAsync(request);
        return StatusCode(result.StatusCode, result);
    }
}
```

### Pagination Query Parameters

```
?page=1              → Page number (default: 1)
&pageSize=20         → Items per page (default: 20, max: 100)
&sortBy=createdAt    → Sort field
&sortDir=desc        → Sort direction (asc/desc)
&search=keyword      → Full-text search
&status=Submitted    → Filter by status
&from=2025-01-01     → Date range start
&to=2025-12-31       → Date range end
```

---

## 🔐 SECURITY RULES — NON-NEGOTIABLE

```
1. NEVER hardcode secrets, API keys, connection strings, or credentials
   → Use appsettings.json + User Secrets + Environment Variables

2. NEVER log sensitive data (passwords, tokens, OTPs, national IDs)
   → Mask in logs: NationalId: ****7890

3. NEVER return password hashes in API responses
   → DTOs must EXCLUDE PasswordHash field

4. NEVER trust client input — validate EVERYTHING server-side
   → Use FluentValidation for all request DTOs

5. ALWAYS hash passwords with BCrypt (cost factor 12+)
   → NEVER store plain text passwords

6. ALWAYS hash OTP codes before storing in OtpCodes table
   → Compare using hash, not plain text

7. ALWAYS use parameterized queries (EF Core handles this)
   → NEVER concatenate SQL strings

8. ALWAYS validate JWT token on every protected endpoint
   → Use [Authorize] attribute with role specification

9. ALWAYS implement rate limiting on auth endpoints
   → Login: 10/min, Register: 5/min, OTP: 3/min

10. ALWAYS use HTTPS in production
    → Redirect HTTP to HTTPS

11. ALWAYS implement Soft Delete (IsDeleted flag)
    → NEVER physically delete records

12. ALWAYS log security events in AuditLog
    → Login, logout, failed attempts, permission changes, data modifications

13. ALWAYS validate file uploads
    → Check MIME type, file size (max 5MB), extension whitelist
    → Scan file headers, not just extensions

14. NEVER expose stack traces in production error responses
    → Use global exception handler middleware

15. ALWAYS set security headers
    → X-Content-Type-Options: nosniff
    → X-Frame-Options: DENY
    → X-XSS-Protection: 1; mode=block
    → Content-Security-Policy: appropriate policy
    → Strict-Transport-Security: max-age=31536000

16. ALWAYS validate authorization (not just authentication)
    → Applicant can only see OWN applications
    → Doctor can only see applications assigned to them
    → Check ownership in service layer, not just controller
```

---

## 🌍 INTERNATIONALIZATION (i18n) RULES

### MANDATORY for every UI component:

```typescript
// ✅ CORRECT — Always use translation keys
const t = useTranslations('application');
<h1>{t('create.title')}</h1>
<Button>{t('create.submit')}</Button>

// ❌ WRONG — Never hardcode text
<h1>Create New Application</h1>
<Button>Submit</Button>

// ❌ WRONG — Never hardcode Arabic text
<h1>إنشاء طلب جديد</h1>
```

### Translation File Structure

```json
// public/locales/ar/application.json
{
  "create": {
    "title": "إنشاء طلب جديد",
    "submit": "تقديم الطلب",
    "saveDraft": "حفظ كمسودة",
    "steps": {
      "service": "اختيار الخدمة",
      "category": "فئة الرخصة",
      "personal": "البيانات الشخصية",
      "details": "تفاصيل الطلب",
      "review": "المراجعة والتقديم"
    }
  },
  "status": {
    "draft": "مسودة",
    "submitted": "مُقدَّم",
    "inReview": "قيد المراجعة",
    "approved": "مقبول",
    "rejected": "مرفوض"
  }
}

// public/locales/en/application.json
{
  "create": {
    "title": "Create New Application",
    "submit": "Submit Application",
    "saveDraft": "Save as Draft",
    "steps": {
      "service": "Select Service",
      "category": "License Category",
      "personal": "Personal Information",
      "details": "Application Details",
      "review": "Review & Submit"
    }
  },
  "status": {
    "draft": "Draft",
    "submitted": "Submitted",
    "inReview": "In Review",
    "approved": "Approved",
    "rejected": "Rejected"
  }
}
```

### RTL/LTR Rules

```typescript
// ✅ CORRECT — Use logical CSS properties
<div className="ms-4 me-2 ps-3 pe-1">  // margin-inline-start, margin-inline-end
<div className="text-start">            // text-align: start (right in RTL, left in LTR)
<div className="flex-row">              // Tailwind auto-reverses in RTL with dir="rtl"

// ❌ WRONG — Never use physical direction properties
<div className="ml-4 mr-2 pl-3 pr-1">  // These don't flip in RTL
<div className="text-left">             // This stays left even in RTL

// Icons that indicate direction MUST flip:
<ChevronLeft className="rtl:rotate-180" />   // Arrow flips in RTL
<ArrowRight className="rtl:rotate-180" />

// Icons that are universal do NOT flip:
<Search />     // Same in both directions
<Settings />   // Same in both directions
<User />       // Same in both directions
```

### Layout Direction

```typescript
// Root layout MUST set direction based on locale
// src/app/[locale]/layout.tsx
export default function LocaleLayout({ children, params: { locale } }) {
  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  const fontClass = locale === 'ar' ? 'font-arabic' : 'font-english';

  return (
    <html lang={locale} dir={direction}>
      <body className={fontClass}>
        {children}
      </body>
    </html>
  );
}
```

---

## 🗃️ DATABASE & DATA RULES

### NEVER Hardcode Values

```csharp
// ❌ WRONG — Hardcoded age
if (applicant.Age < 18) return Error("Too young");

// ✅ CORRECT — Read from SystemSettings
var minAge = await _settingsService.GetAsync($"MIN_AGE_CATEGORY_{category}");
if (applicant.Age < int.Parse(minAge)) return Error("Too young");

// ❌ WRONG — Hardcoded fee
payment.Amount = 100.00m;

// ✅ CORRECT — Read from FeeStructures
var fee = await _feeService.GetActiveFeeAsync(FeeType.ApplicationFee, categoryId);
payment.Amount = fee.Amount;
```

### Configurable Settings (SystemSettings table)

```
These values MUST be in SystemSettings, NEVER in code:
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
```

### Soft Delete — ALWAYS

```csharp
// ✅ CORRECT
entity.IsDeleted = true;
entity.UpdatedAt = DateTime.UtcNow;
await _unitOfWork.SaveChangesAsync();

// ❌ WRONG
_context.Applications.Remove(entity);

// Global query filter in EF Core:
builder.HasQueryFilter(x => !x.IsDeleted);
```

### Application Number Format

```csharp
// Format: MOJ-{YEAR}-{8_RANDOM_DIGITS}
// Example: MOJ-2025-48291037

public string GenerateApplicationNumber()
{
    var year = DateTime.UtcNow.Year;
    var random = Random.Shared.Next(10000000, 99999999);
    return $"MOJ-{year}-{random:D8}";
}

// License Number: Same format
// MOJ-2025-XXXXXXXX
```

### DateTime — ALWAYS UTC

```csharp
// ✅ CORRECT
entity.CreatedAt = DateTime.UtcNow;

// ❌ WRONG
entity.CreatedAt = DateTime.Now;  // Local time — NEVER use this

// Frontend converts to user's local timezone for display only
```

---

## 🔔 NOTIFICATION RULES

### Every notification event MUST send through ALL applicable channels:

```csharp
// When recording a test result, ALL these must fire:
await _notificationService.SendAsync(new NotificationRequest
{
    UserId = applicantUserId,
    ApplicationId = applicationId,
    EventType = NotificationEventType.TestResult,
    TitleAr = "تم صدور نتيجة اختبارك",
    TitleEn = "Your test result has been issued",
    MessageAr = "...",
    MessageEn = "...",
    Channels = new[]
    {
        NotificationChannel.InApp,    // Always
        NotificationChannel.Push,     // If user has token
        NotificationChannel.Email,    // If user has email + enabled
        NotificationChannel.SMS,      // If user has phone + enabled
    }
});
```

### Notification Service Design

```csharp
// Use a unified NotificationService that dispatches to all channels
// Use background job (Hangfire) for external channels
// In-App notification is synchronous (save to Notifications table)
// Push/Email/SMS are asynchronous (enqueue to Hangfire)

// NEVER block the main request waiting for email/SMS delivery
```

---

## 🧪 TESTING RULES

### Backend Tests

```csharp
// Unit test naming: MethodName_Scenario_ExpectedResult
[Fact]
public async Task CreateApplicationAsync_ValidRequest_ReturnsCreatedApplication()

[Fact]
public async Task CreateApplicationAsync_UnderageApplicant_ReturnsValidationError()

[Fact]
public async Task CreateApplicationAsync_ExistingActiveApplication_ReturnsConflict()

// Use xUnit + Moq/NSubstitute + FluentAssertions
// Test Services (Application layer) — mock repositories
// Test Validators — test all rules
// Test Controllers — integration tests with WebApplicationFactory
```

### Frontend Tests

```typescript
// Component test naming: "should [expected behavior] when [condition]"
describe('ApplicationWizard', () => {
  it('should display validation error when age is below minimum', () => {});
  it('should enable submit button when all required fields are filled', () => {});
  it('should save draft automatically every 30 seconds', () => {});
  it('should display in RTL layout when language is Arabic', () => {});
});

// Use Jest + React Testing Library for unit/component tests
// Use Playwright for E2E tests
```

---

## 🔄 GIT CONVENTIONS

### Branch Naming

```
main                          → Production
develop                       → Development
feature/MOJAZ-101-email-reg   → Feature branch
bugfix/MOJAZ-205-role-check   → Bug fix
hotfix/auth-token-expiry      → Production hotfix
release/v1.0.0                → Release branch
```

### Commit Messages

```
feat(auth): implement email registration with OTP
fix(applications): correct age validation for category F
docs(specs): add sprint 1-2 spec details
refactor(api): extract notification service interface
test(auth): add login endpoint integration tests
chore(deps): update EF Core to 8.0.8
style(ui): fix RTL alignment in application wizard
perf(api): add database index for application queries

Format: type(scope): description

Types: feat, fix, docs, refactor, test, chore, style, perf, ci
Scope: auth, applications, workflow, payments, notifications, ui, api, db
```

---

## ⚠️ COMMON MISTAKES — AGENTS MUST AVOID

```
❌ DO NOT create a monolithic controller with all logic
❌ DO NOT skip validation (both client-side and server-side)
❌ DO NOT return raw entity objects from API (always use DTOs)
❌ DO NOT use string concatenation for SQL queries
❌ DO NOT hardcode any business rule value (age, fees, limits)
❌ DO NOT forget audit logging for sensitive operations
❌ DO NOT ignore error handling (always wrap in try-catch at service level)
❌ DO NOT create components without i18n support
❌ DO NOT use physical CSS properties (left/right/ml/mr) — use logical
❌ DO NOT forget dark mode support in new components
❌ DO NOT commit without writing at least basic tests
❌ DO NOT create new database columns without migration
❌ DO NOT use DateTime.Now — always DateTime.UtcNow
❌ DO NOT return plain strings from API — always ApiResponse<T>
❌ DO NOT skip Swagger documentation on endpoints
❌ DO NOT create multiple active applications for same applicant
❌ DO NOT allow stage progression without gate validation
❌ DO NOT process payment without checking fee from FeeStructures table
❌ DO NOT send notifications synchronously (except In-App)
❌ DO NOT store files in database — use file system or blob storage
❌ DO NOT expose internal error details in production responses
```

---

## 📋 CHECKLIST — Before Completing Any Task

```
□ Code compiles without errors
□ All existing tests still pass
□ New tests written for new functionality
□ API endpoint documented in Swagger
□ DTOs used (no raw entities in responses)
□ Input validation added (FluentValidation)
□ Audit log entries created for sensitive operations
□ Error handling implemented
□ i18n translations added (AR + EN)
□ RTL/LTR tested
□ Dark/Light mode tested
□ Responsive design verified
□ No hardcoded business values
□ Security rules followed
□ Notifications triggered where required
□ Git commit message follows convention
□ Spec status updated (if using spec-kit)
```

---

## 🏛️ DOMAIN ENTITIES QUICK REFERENCE

```
User         → System account (all roles)
Applicant    → Extended profile for license applicants (1:1 with User)
Application  → License application (the core entity)
LicenseCategory → A, B, C, D, E, F
Document     → Uploaded file attached to application
Appointment  → Medical/Theory/Practical appointment
MedicalExam  → Medical examination record
TrainingRecord → Training completion record
TheoryTest   → Theory test attempt + result
PracticalTest → Practical test attempt + result
Payment      → Individual payment transaction
FeeStructure → Fee configuration (admin-managed)
License      → Issued driving license
Notification → In-app notification
PushToken    → FCM device token
AuditLog     → System audit trail
SystemSetting → Configurable system parameter
OtpCode      → Verification code record
RefreshToken → JWT refresh token
EmailLog     → Email send history
SmsLog       → SMS send history
```

---

> **This file is the source of truth for all AI agents working on this project.**
> **When in doubt, follow the rules in this file. When rules conflict with**
> **external suggestions, THIS FILE WINS.**