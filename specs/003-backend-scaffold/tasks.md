# Tasks: Backend Solution Scaffold

**Input**: Design documents from `/specs/003-backend-scaffold/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅
**Branch**: `003-backend-scaffold`
**Generated**: 2026-04-04 | **Remediated**: 2026-04-12

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (independent files, no dependency on incomplete task)
- **[US#]**: Which user story this task belongs to
- All paths are relative to repository root (`c:\Users\ALlahabi\Desktop\Mojaz\Mojaz\`)
- Backend source lives under `src/backend/` (not `src/backend/src/`)

> **PRD Deviations (documented):**
> - **Applicants table** (PRD §21.2): Merged into `User.cs` — single entity for all user/applicant data. Rationale: avoids an unnecessary 1:1 join for every query.
> - **PushTokens table** (PRD §21.15): Deferred to notification feature (004). Push token management is not needed for the scaffold.
> - **EmailLogs / SmsLogs tables** (PRD §21.20–21.21): Deferred to notification feature (004). Delivery logs belong with the notification infrastructure.
> - Entity properties intentionally diverge from PRD where plan.md improves on the design (bilingual name split, generic entity refs in notifications, etc.). See plan.md addendum.

---

## Phase 1: Setup — Solution & Project Skeleton

**Purpose**: Create the compilable solution skeleton with all projects, references, and NuGet
packages. Every subsequent task depends on this phase being complete first.

**⚠️ CRITICAL**: This phase must complete before any entity, service, or middleware code is written.

- [X] T001 Create .NET 8 solution file at `src/backend/src/Mojaz.sln` (already exists — verify structure)
- [X] T002 Create `src/backend/src/Mojaz.Domain` class library: `dotnet new classlib -n Mojaz.Domain -o src/backend/src/Mojaz.Domain`
- [X] T003 [P] Create `src/backend/src/Mojaz.Shared` class library: `dotnet new classlib -n Mojaz.Shared -o src/backend/src/Mojaz.Shared`
- [X] T004 [P] Create `src/backend/src/Mojaz.Application` class library: `dotnet new classlib -n Mojaz.Application -o src/backend/src/Mojaz.Application`
- [X] T005 [P] Create `src/backend/src/Mojaz.Infrastructure` class library: `dotnet new classlib -n Mojaz.Infrastructure -o src/backend/src/Mojaz.Infrastructure`
- [X] T006 [P] Create `src/backend/src/Mojaz.API` web API project: `dotnet new webapi -n Mojaz.API -o src/backend/src/Mojaz.API --no-openapi`
- [X] T007 [P] Create `tests/Mojaz.Domain.Tests` xUnit project: `dotnet new xunit -n Mojaz.Domain.Tests -o tests/Mojaz.Domain.Tests`
- [X] T008 [P] Create `tests/Mojaz.Application.Tests` xUnit project: `dotnet new xunit -n Mojaz.Application.Tests -o tests/Mojaz.Application.Tests`
- [X] T009 [P] Create `tests/Mojaz.Infrastructure.Tests` xUnit project: `dotnet new xunit -n Mojaz.Infrastructure.Tests -o tests/Mojaz.Infrastructure.Tests`
- [X] T010 [P] Create `tests/Mojaz.API.Tests` xUnit project: `dotnet new xunit -n Mojaz.API.Tests -o tests/Mojaz.API.Tests`
- [X] T011 Add all projects to solution (`dotnet sln add` for all 9 projects)
- [X] T012 Add project references: Application → Domain, Application → Shared
- [X] T013 [P] Add project references: Infrastructure → Domain, Infrastructure → Shared, Infrastructure → Application
- [X] T014 [P] Add project references: API → Domain, API → Shared, API → Application, API → Infrastructure
- [X] T015 [P] Add test project references: Domain.Tests → Domain; Application.Tests → Application, Domain; Infrastructure.Tests → Infrastructure; API.Tests → API
- [X] T016 Add NuGet packages to `Mojaz.Application`: `AutoMapper 13`, `AutoMapper.Extensions.Microsoft.DependencyInjection`, `FluentValidation 11`, `FluentValidation.DependencyInjectionExtensions`
- [X] T017 [P] Add NuGet packages to `Mojaz.Infrastructure`: `Microsoft.EntityFrameworkCore.SqlServer 8`, `Microsoft.EntityFrameworkCore.Tools 8`, `BCrypt.Net-Next`, `SendGrid`, `Twilio`, `FirebaseAdmin`, `Hangfire.Core`, `Hangfire.SqlServer`, `Hangfire.AspNetCore`, `QuestPDF`, `Serilog.AspNetCore`, `Serilog.Sinks.Console`, `Serilog.Sinks.File`
- [X] T018 [P] Add NuGet packages to `Mojaz.API`: `Microsoft.AspNetCore.Authentication.JwtBearer 8`, `Swashbuckle.AspNetCore 6`, `AspNetCoreRateLimit`, `Microsoft.Extensions.Diagnostics.HealthChecks`
- [X] T019 [P] Add NuGet packages to test projects: xUnit, Moq 4, FluentAssertions 6, `Microsoft.EntityFrameworkCore.InMemory` (Infrastructure.Tests only)
- [X] T020 Remove auto-generated `Class1.cs` from Domain, Shared, Application, Infrastructure, and `WeatherForecast.cs` / sample controllers from API
- [X] T021 Verify `dotnet build src/backend/src/Mojaz.sln` compiles with 0 errors

**Checkpoint ✅**: `dotnet build` passes. No circular dependencies. All 9 projects present in solution.

---

## Phase 2: Foundational — Base Types, Interfaces & Domain Layer

**Purpose**: Lay the shared primitive types and domain contracts that ALL later layers depend on.
Must be complete before Application, Infrastructure, or API implementation begins.

**⚠️ CRITICAL**: No service, repository, or controller code can be written until this phase completes.

### Domain — Base Classes

- [X] T022 Create `src/backend/src/Mojaz.Domain/Common/BaseEntity.cs` with `Id (Guid)`, `CreatedAt (DateTime UTC)`, `UpdatedAt (DateTime UTC)`
- [X] T023 Create `src/backend/src/Mojaz.Domain/Common/AuditableEntity.cs` extending `BaseEntity` with `CreatedBy (Guid?)`, `UpdatedBy (Guid?)`
- [X] T024 Create `src/backend/src/Mojaz.Domain/Common/SoftDeletableEntity.cs` extending `AuditableEntity` with `IsDeleted (bool)`, `DeletedAt (DateTime? UTC)`, `DeletedBy (Guid?)`

### Domain — Enums (11 total)

- [X] T025 [P] Create `src/backend/src/Mojaz.Domain/Enums/ApplicationStatus.cs`: Draft, Submitted, UnderReview, MedicalExam, TheoryTest, PracticalTest, Approved, Payment, Issuance, Active, Rejected, Cancelled
- [X] T026 [P] Create `src/backend/src/Mojaz.Domain/Enums/LicenseCategoryCode.cs`: A, B, C, D, E, F
- [X] T027 [P] Create `src/backend/src/Mojaz.Domain/Enums/FeeType.cs`: ApplicationFee, MedicalExamFee, TheoryTestFee, PracticalTestFee, IssuanceFee, RetakeFee, RenewalFee, ReplacementFee
- [X] T028 [P] Create `src/backend/src/Mojaz.Domain/Enums/AppointmentType.cs`: MedicalExam, TheoryTest, PracticalTest
- [X] T029 [P] Create `src/backend/src/Mojaz.Domain/Enums/DocumentType.cs`: NationalId, MedicalCertificate, Photo, DrivingRecord, TrainingCertificate
- [X] T030 [P] Create `src/backend/src/Mojaz.Domain/Enums/NotificationEventType.cs`: ApplicationSubmitted, StatusChanged, AppointmentBooked, AppointmentReminder, TestResultReady, PaymentDue, PaymentConfirmed, LicenseIssued
- [X] T031 [P] Create `src/backend/src/Mojaz.Domain/Enums/PaymentStatus.cs`: Pending, Completed, Failed, Refunded
- [X] T032 [P] Create `src/backend/src/Mojaz.Domain/Enums/TestResult.cs`: Pass, Fail, Absent
- [X] T033 [P] Create `src/backend/src/Mojaz.Domain/Enums/MedicalFitnessResult.cs`: Fit, Unfit, ConditionallyFit
- [X] T034 [P] Create `src/backend/src/Mojaz.Domain/Enums/UserRole.cs`: Applicant, Receptionist, Doctor, Examiner, Manager, Security, Admin
- [X] T035 [P] Create `src/backend/src/Mojaz.Domain/Enums/RegistrationMethod.cs`: NationalId, Email, Phone
  
### Domain — Entities (21 total — see PRD Deviations note above)
  
- [X] T036 [P] Create `src/backend/src/Mojaz.Domain/Entities/User.cs` (extends `SoftDeletableEntity`): FullNameAr, FullNameEn, NationalId, Email, PhoneNumber, PasswordHash, Role (UserRole enum), DateOfBirth, Gender, Nationality, BloodType, Address, City, Region, ApplicantType, PreferredLanguage, NotificationPreferences, RegistrationMethod, IsEmailVerified, IsPhoneVerified, EmailVerifiedAt, PhoneVerifiedAt, IsActive, IsLocked, FailedLoginAttempts, LockoutEnd, LastLoginAt — *merges PRD Users §21.1 + Applicants §21.2*
- [X] T037 [P] Create `src/backend/src/Mojaz.Domain/Entities/OtpCode.cs` (extends `BaseEntity`): UserId, Destination, DestinationType (Email|Phone), CodeHash, Purpose (Registration|Login|PasswordReset), ExpiresAt, IsUsed, UsedAt, AttemptCount, MaxAttempts, IpAddress — *aligned with PRD §21.18*
- [X] T038 [P] Create `src/backend/src/Mojaz.Domain/Entities/RefreshToken.cs` (extends `BaseEntity`): UserId, Token, ExpiresAt, IsRevoked, RevokedAt, ReplacedByToken, CreatedByIp — *aligned with PRD §21.19*
- [X] T039 [P] Create `src/backend/src/Mojaz.Domain/Entities/LicenseCategory.cs` (extends `AuditableEntity`): Code (LicenseCategoryCode enum), NameAr, NameEn, MinimumAge, RequiresTraining, IsActive — *aligned with PRD §21.4, added RequiresTraining*
- [X] T040 [P] Create `src/backend/src/Mojaz.Domain/Entities/Application.cs` (extends `SoftDeletableEntity`): ApplicationNumber, ApplicantId (FK→User), ServiceType, LicenseCategoryId (FK→LicenseCategory), BranchId, Status (ApplicationStatus enum), CurrentStage, PreferredLanguage, SpecialNeeds, DataAccuracyConfirmed, SubmittedAt, ReviewedBy, ReviewedAt, Notes, RejectionReason, ExpiresAt, CancelledAt, CancellationReason — *merged PRD §21.3 + plan.md additions*
- [X] T041 [P] Create `src/backend/src/Mojaz.Domain/Entities/ApplicationDocument.cs` (extends `AuditableEntity`): ApplicationId, DocumentType (DocumentType enum), FileName, FilePath, FileSize, MimeType, IsRequired, Status (Uploaded|Reviewed|Rejected), ReviewedBy, ReviewedAt, RejectionReason, UploadedAt — *aligned with PRD §21.5, kept FileSize/MimeType for security*
- [X] T042 [P] Create `src/backend/src/Mojaz.Domain/Entities/ApplicationStatusHistory.cs` (extends `BaseEntity`): ApplicationId, FromStatus, ToStatus, ChangedBy, Notes, ChangedAt
- [X] T043 [P] Create `src/backend/src/Mojaz.Domain/Entities/Appointment.cs` (extends `SoftDeletableEntity`): ApplicationId, AppointmentType (AppointmentType enum), ScheduledDate (DateOnly), TimeSlot, BranchId, AssignedStaffId, Status, Notes, CancelledAt, CancellationReason — *aligned with PRD §21.6 (Date+TimeSlot instead of single DateTime)*
- [X] T044 [P] Create `src/backend/src/Mojaz.Domain/Entities/MedicalExamination.cs` (extends `AuditableEntity`): ApplicationId, DoctorId, ExaminedAt, FitnessResult (MedicalFitnessResult enum), BloodType, Notes, ReportReference, ValidUntil, CertificatePath — *aligned with PRD §21.7, added CertificatePath as improvement*
- [X] T045 [P] Create `src/backend/src/Mojaz.Domain/Entities/TrainingRecord.cs` (extends `AuditableEntity`): ApplicationId, SchoolName, CertificateNumber, CompletedHours, RequiredHours, IsExempt, ExemptionReason, ExemptionApprovedBy, Status, CompletedAt — *aligned with PRD §21.8, includes exemption workflow fields*
- [X] T046 [P] Create `src/backend/src/Mojaz.Domain/Entities/TheoryTest.cs` (extends `AuditableEntity`): ApplicationId, ExaminerId, AttemptNumber, TestDate, Score, PassingScore, Result (TestResult enum), Notes — *aligned with PRD §21.9, added PassingScore*
- [X] T047 [P] Create `src/backend/src/Mojaz.Domain/Entities/PracticalTest.cs` (extends `AuditableEntity`): ApplicationId, ExaminerId, AttemptNumber, TestDate, Result (TestResult enum), Notes, VehicleUsed, RequiresAdditionalTraining, AdditionalHoursRequired — *merged PRD §21.10 + plan.md VehicleUsed improvement*
- [X] T048 [P] Create `src/backend/src/Mojaz.Domain/Entities/Payment.cs` (extends `AuditableEntity`): ApplicationId, FeeType (FeeType enum), Amount, Currency, Status (PaymentStatus enum), PaymentMethod, TransactionReference, PaidAt, FailedAt, FailureReason, ReceiptPath — *aligned with PRD §21.11, added ReceiptPath as improvement*
- [X] T049 [P] Create `src/backend/src/Mojaz.Domain/Entities/License.cs` (extends `SoftDeletableEntity`): LicenseNumber, ApplicationId, HolderId (FK→User), LicenseCategoryId (FK→LicenseCategory), IssuedAt, ExpiresAt, IssuedBy, Status, QrCode, PrintedAt, DownloadedAt — *merged PRD §21.13 + plan.md QrCode improvement*
- [X] T050 [P] Create `src/backend/src/Mojaz.Domain/Entities/LicenseRenewal.cs` (extends `AuditableEntity`): LicenseId, ApplicationId, RenewedAt, NewExpiresAt, ProcessedBy
- [X] T051 [P] Create `src/backend/src/Mojaz.Domain/Entities/LicenseReplacement.cs` (extends `AuditableEntity`): LicenseId, ApplicationId, Reason, ProcessedAt, ProcessedBy
- [X] T052 [P] Create `src/backend/src/Mojaz.Domain/Entities/CategoryUpgrade.cs` (extends `AuditableEntity`): LicenseId, ApplicationId, FromCategory, ToCategory, UpgradedAt, ProcessedBy
- [X] T053 [P] Create `src/backend/src/Mojaz.Domain/Entities/Notification.cs` (extends `BaseEntity`): UserId, ApplicationId, EventType (NotificationEventType enum), TitleAr, TitleEn, MessageAr, MessageEn, IsRead, ReadAt, RelatedEntityId, RelatedEntityType — *merged PRD §21.14 MessageAr/En naming + plan.md generic entity reference improvement*
- [X] T054 [P] Create `src/backend/src/Mojaz.Domain/Entities/AuditLog.cs` (does NOT extend BaseEntity — standalone with own Id and Timestamp): Id (Guid), UserId, Action, EntityType, EntityId, OldValues (JSON string), NewValues (JSON string), IpAddress, UserAgent, Timestamp (DateTime UTC) — *aligned with PRD §21.16; standalone to avoid inheriting CreatedAt/UpdatedAt which are redundant for append-only audit logs*
- [X] T055 [P] Create `src/backend/src/Mojaz.Domain/Entities/SystemSetting.cs` (extends `AuditableEntity`): SettingKey, SettingValue, Category, Description, IsEncrypted — *merged PRD §21.17 naming (SettingKey/SettingValue/Category) + plan.md IsEncrypted improvement*
- [X] T056 [P] Create `src/backend/src/Mojaz.Domain/Entities/FeeStructure.cs` (extends `AuditableEntity`): FeeType (FeeType enum), LicenseCategoryId, Amount, Currency, EffectiveFrom, EffectiveTo, IsActive — *aligned with PRD §21.12*

### Domain — Interfaces

- [X] T057 Create `src/backend/src/Mojaz.Domain/Interfaces/IRepository.cs` with full generic interface as defined in plan.md (GetByIdAsync, GetAllAsync, FindAsync, AddAsync, Update, Remove, CountAsync, ExistsAsync)
- [X] T058 Create `src/backend/src/Mojaz.Domain/Interfaces/IUnitOfWork.cs` with Repository\<T\>(), SaveChangesAsync, BeginTransactionAsync, CommitTransactionAsync, RollbackTransactionAsync

### Shared — Response Models

- [X] T059 Create `src/backend/src/Mojaz.Shared/Models/ApiResponse.cs` with `Success`, `Message`, `Data`, `Errors`, `StatusCode` and static factory methods: `Ok()`, `Created()`, `Fail()`
- [X] T060 [P] Create `src/backend/src/Mojaz.Shared/Models/PagedResult.cs` with `Items`, `TotalCount`, `Page`, `PageSize`, `TotalPages`, `HasPreviousPage`, `HasNextPage`
- [X] T061 [P] Create `src/backend/src/Mojaz.Shared/Models/Result.cs` generic internal operation result with `IsSuccess`, `Error`, `Value`

### Shared — Exceptions

- [X] T062 [P] Create `src/backend/src/Mojaz.Shared/Exceptions/NotFoundException.cs` (extends `Exception`, receives entityName + id)
- [X] T063 [P] Create `src/backend/src/Mojaz.Shared/Exceptions/ValidationException.cs` (extends `Exception`, receives `IEnumerable<string>` errors)
- [X] T064 [P] Create `src/backend/src/Mojaz.Shared/Exceptions/UnauthorizedException.cs`
- [X] T065 [P] Create `src/backend/src/Mojaz.Shared/Exceptions/ForbiddenException.cs`
- [X] T066 [P] Create `src/backend/src/Mojaz.Shared/Exceptions/ConflictException.cs`

### Shared — Constants & Extensions

- [X] T067 [P] Create `src/backend/src/Mojaz.Shared/Constants/Roles.cs` with string constants matching `UserRole` enum values
- [X] T068 [P] Create `src/backend/src/Mojaz.Shared/Constants/Policies.cs` with policy name constants
- [X] T069 [P] Create `src/backend/src/Mojaz.Shared/Constants/CacheKeys.cs` with prefix constants for distributed cache
- [X] T070 [P] Create `src/backend/src/Mojaz.Shared/Extensions/StringExtensions.cs` with utility methods (Mask, TruncateForLog)

**Checkpoint ✅**: `dotnet build` still passes. Domain has 0 NuGet packages. All 21 entities, 11 enums, 2 interfaces present.

---

## Phase 3: User Story 1 — Clean Architecture Foundation (Priority: P1) 🎯 MVP

**Goal**: A fully compilable, runnable API with clean architecture wired end-to-end —
repository + UoW, AutoMapper, FluentValidation, JWT auth plumbing, and a working
health check endpoint.

**Independent Test**: `dotnet run` starts the API → `GET /health` returns `200 OK` →
`GET /swagger` shows UI with JWT auth button → `dotnet build` across all 9 projects
shows 0 errors and 0 warnings.

### Implementation — Application Layer

- [X] T071 [US1] Create `src/backend/src/Mojaz.Application/Interfaces/Infrastructure/IEmailService.cs` with `SendAsync(to, subject, body, isHtml)` signature
- [X] T072 [P] [US1] Create `src/backend/src/Mojaz.Application/Interfaces/Infrastructure/ISmsService.cs` with `SendAsync(to, message)` signature
- [X] T073 [P] [US1] Create `src/backend/src/Mojaz.Application/Interfaces/Infrastructure/IPushNotificationService.cs` with `SendAsync(deviceToken, title, body, data)` signature
- [X] T074 [US1] Create `src/backend/src/Mojaz.Application/Mappings/MappingProfile.cs` as empty AutoMapper profile (base for future feature profiles)
- [X] T075 [US1] Create `src/backend/src/Mojaz.Application/Extensions/ServiceCollectionExtensions.cs` with `AddApplicationServices()` — registers AutoMapper, FluentValidation assembly scan

### Implementation — Infrastructure Layer (Persistence)

- [X] T076 [US1] Create `src/backend/src/Mojaz.Infrastructure/Persistence/MojazDbContext.cs` with `DbSet<T>` for all 21 entities; override `SaveChangesAsync` to auto-set `UpdatedAt = DateTime.UtcNow`
- [X] T077 [US1] Create `src/backend/src/Mojaz.Infrastructure/Persistence/Repositories/Repository.cs` implementing `IRepository<T>` using `MojazDbContext`; `Remove()` sets `IsDeleted=true` (soft-delete) instead of physical delete for SoftDeletableEntity subtypes
- [X] T078 [US1] Create `src/backend/src/Mojaz.Infrastructure/Persistence/UnitOfWork/UnitOfWork.cs` implementing `IUnitOfWork` using `MojazDbContext`

### Implementation — Infrastructure Layer (Entity Configurations — Fluent API, one file per entity)

- [X] T079 [US1] Create `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/UserConfiguration.cs` — table Users, PK, IX_Users_Email (unique), IX_Users_NationalId (unique), IX_Users_PhoneNumber (unique), CK_Users_Contact, field lengths, HasQueryFilter(IsDeleted)
- [X] T080 [P] [US1] Create `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/ApplicationConfiguration.cs` — table Applications, PK, FK→Users(ApplicantId), FK→LicenseCategories(LicenseCategoryId), IX_Applications_ApplicantId, IX_Applications_ApplicationNumber (unique), HasQueryFilter(IsDeleted)
- [X] T081a [P] [US1] Create entity configurations for auth/security entities: `OtpCodeConfiguration.cs`, `RefreshTokenConfiguration.cs`, `AuditLogConfiguration.cs` in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T081b [P] [US1] Create entity configurations for reference data: `LicenseCategoryConfiguration.cs`, `SystemSettingConfiguration.cs`, `FeeStructureConfiguration.cs` in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T081c [P] [US1] Create entity configurations for documents/appointments: `ApplicationDocumentConfiguration.cs`, `ApplicationStatusHistoryConfiguration.cs`, `AppointmentConfiguration.cs` in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T081d [P] [US1] Create entity configurations for medical/training: `MedicalExaminationConfiguration.cs`, `TrainingRecordConfiguration.cs` in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T081e [P] [US1] Create entity configurations for tests/payments: `TheoryTestConfiguration.cs`, `PracticalTestConfiguration.cs`, `PaymentConfiguration.cs` in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T081f [P] [US1] Create entity configurations for license lifecycle: `LicenseConfiguration.cs`, `LicenseRenewalConfiguration.cs`, `LicenseReplacementConfiguration.cs`, `CategoryUpgradeConfiguration.cs` in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T081g [P] [US1] Create entity configuration for notifications: `NotificationConfiguration.cs` in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T082 [US1] Register all `IEntityTypeConfiguration<T>` classes in `MojazDbContext.OnModelCreating` via `modelBuilder.ApplyConfigurationsFromAssembly()`

### Implementation — Infrastructure Layer (Services)

- [X] T083 [P] [US1] Create `src/backend/src/Mojaz.Infrastructure/Services/EmailService.cs` implementing `IEmailService` (SendGrid skeleton — logs "not configured" if ApiKey empty)
- [X] T084 [P] [US1] Create `src/backend/src/Mojaz.Infrastructure/Services/SmsService.cs` implementing `ISmsService` (Twilio skeleton)
- [X] T085 [P] [US1] Create `src/backend/src/Mojaz.Infrastructure/Services/PushNotificationService.cs` implementing `IPushNotificationService` (FirebaseAdmin skeleton)
- [X] T086 [US1] Create `src/backend/src/Mojaz.Infrastructure/Extensions/ServiceCollectionExtensions.cs` with `AddInfrastructureServices(IConfiguration)` — registers DbContext, Repository<>, UnitOfWork, Hangfire, Email/SMS/Push services, Serilog
Result
### Implementation — API Layer (Configuration & Extensions)

- [X] T087 [US1] Create `src/backend/src/Mojaz.API/appsettings.json` with full config structure from research.md (ConnectionStrings, JwtSettings, SendGridSettings, TwilioSettings, FirebaseSettings, HangfireSettings, RateLimitSettings, Serilog) — no secret values, only structure
- [X] T088 [US1] Create `src/backend/src/Mojaz.API/appsettings.Development.json` with Docker SQL Server connection string: `Server=localhost,1433;Database=MojazDB;User Id=sa;Password=as123456;TrustServerCertificate=True`
- [X] T089 [US1] Create `src/backend/src/Mojaz.API/Extensions/SwaggerExtensions.cs` with `AddMojazSwagger()` and `UseMojazSwagger()` — JWT bearer button, API v1 grouping, XML docs enabled
- [X] T090 [P] [US1] Create `src/backend/src/Mojaz.API/Extensions/SecurityHeadersExtensions.cs` with `UseSecurityHeaders()` middleware — sets X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Content-Security-Policy, Strict-Transport-Security
- [X] T091 [P] [US1] Create `src/backend/src/Mojaz.API/Extensions/CorsExtensions.cs` with `AddMojazCors()` — allows frontend origins from configuration; defaults to `localhost:3000` in development

### Implementation — API Layer (Middleware & Filters)

- [X] T092 [US1] Create `src/backend/src/Mojaz.API/Middleware/GlobalExceptionHandlerMiddleware.cs` — catches all unhandled exceptions, maps to `ApiResponse<object>` with correct HTTP status code (NotFoundException→404, ValidationException→400, UnauthorizedException→401, ForbiddenException→403, ConflictException→409, default→500), logs via Serilog; NEVER exposes stack trace when `!IsDevelopment()`
- [X] T093 [P] [US1] Create `src/backend/src/Mojaz.API/Middleware/RequestLoggingMiddleware.cs` — logs method, path, status code, duration; masks sensitive headers (Authorization)
- [X] T094 [P] [US1] Create `src/backend/src/Mojaz.API/Middleware/AuditLogMiddleware.cs` — captures authenticated user identity and writes skeleton `AuditLog` entry for mutating requests (POST/PUT/PATCH/DELETE)
- [X] T095 [P] [US1] Create `src/backend/src/Mojaz.API/Filters/ValidationFilter.cs` implementing `IAsyncActionFilter` — intercepts `ModelState.IsValid == false` and returns `ApiResponse<object>` 400 with validation errors
- [X] T096 [US1] Create `src/backend/src/Mojaz.API/Controllers/HealthController.cs` — `[AllowAnonymous]` `GET /health` returning `ApiResponse<object>` with status, timestamp, version

### Implementation — API Layer (Program.cs — master wiring)

- [X] T097 [US1] Write full `src/backend/src/Mojaz.API/Program.cs` with:
  - Serilog bootstrap via `UseSerilog()` — Console (CompactJsonFormatter) + File (rolling daily), enriched with MachineName, ThreadId, RequestId
  - DI: `AddApplicationServices()` + `AddInfrastructureServices(config)`
  - JWT Bearer authentication — reads `JwtSettings` from config; validates issuer, audience, lifetime, signing key
  - Rate limiting — reads `RateLimitSettings`, IP-based: login 10/min, register 5/min, OTP 3/min
  - Hangfire — `UseSqlServerStorage`, `UseHangfireDashboard("/hangfire")` (admin-only in prod)
  - Swagger (dev only) via `AddMojazSwagger()` / `UseMojazSwagger()`
  - CORS via `AddMojazCors()`
  - Health checks
  - **Middleware pipeline order**: SecurityHeaders → HTTPS → GlobalExceptionHandler → RequestLogging → CORS → RateLimiter → Authentication → Authorization → AuditLog → Swagger (dev) → MapControllers → MapHealthChecks

- [X] T098 [US1] Generate initial EF Core migration: `dotnet ef migrations add InitialCreate -p src/backend/src/Mojaz.Infrastructure -s src/backend/src/Mojaz.API`

**Checkpoint ✅**: `dotnet run` starts. `GET /health` → 200. `GET /swagger` → Swagger UI with JWT button. All 9 projects build with 0 warnings and Errors.

---

## Phase 4: User Story 2 — Boilerplate & Shared Types Complete (Priority: P1)

**Goal**: Verify all base classes, enums, `ApiResponse<T>`, `PagedResult<T>`, custom exceptions,
and constants are fully complete, consistent, and accessible to downstream features.

**Independent Test**: Run `dotnet build`; reference each type from a test project to confirm
accessibility. Check Domain.csproj has zero `<PackageReference>` entries.

### Validation Tasks

- [X] T099 [US2] Verify `src/backend/src/Mojaz.Domain/Mojaz.Domain.csproj` has ZERO `<PackageReference>` entries — fail build if any found
- [X] T100 [P] [US2] Verify `src/backend/src/Mojaz.Application/Mojaz.Application.csproj` has NO reference to `Mojaz.Infrastructure`
- [X] T101 [P] [US2] Verify all 21 entities exist in `src/backend/src/Mojaz.Domain/Entities/` and inherit from appropriate base class
- [X] T102 [P] [US2] Verify all 11 enums exist in `src/backend/src/Mojaz.Domain/Enums/`
- [X] T103 [US2] Add `ApplicationNumberGenerator.cs` to `src/backend/src/Mojaz.Domain/Common/` — format: `MOJ-{YEAR}-{8_RANDOM_DIGITS}` (e.g., `MOJ-2025-48291037`)

---

## Phase 5: User Story 3 — Developer Documentation & Docker Setup (Priority: P2)

**Goal**: Any developer can clone the repo and have a working local environment in under
10 minutes using Docker and the quickstart guide.

**Independent Test**: Clone repo on a fresh machine → `docker compose up -d` → `dotnet run`
→ `GET /health` returns 200. API connects to SQL Server container successfully.

### Docker Configuration

- [X] T104 [US3] Create `docker-compose.yml` at repo root with SQL Server 2022 service: image `mcr.microsoft.com/mssql/server:2022-latest`, port `1433:1433`, env `ACCEPT_EULA=Y`, `MSSQL_SA_PASSWORD=as123456`, health check
- [X] T105 [US3] Create `docker-compose.override.yml` — developer-specific overrides: named volume for data persistence, environment variable for connection string override
- [X] T106 [US3] Create `.env.development` with non-secret dev defaults (referenced by docker-compose.override.yml); add `.env.*.local` pattern to `.gitignore`
- [X] T107 [US3] Create `specs/003-backend-scaffold/quickstart.md` — step-by-step: Prerequisites, `docker compose up -d`, `dotnet user-secrets set`, `dotnet ef database update`, `dotnet run`, verify `/health` and `/swagger`
- [X] T108 [US3] Add `.gitignore` entries for: `appsettings.*.local.json`, `*.user`, secrets, docker data volumes, `Logs/` directory

**Checkpoint ✅**: Developer onboarding is fully documented and Docker-based local setup is validated.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final build verification, test project validation, and architecture compliance.

- [X] T109 [P] Verify all 4 test projects build and at least one placeholder unit test exists in each (`dotnet test` passes with 0 failures)
- [X] T110 [P] Add `Directory.Build.props` at `src/backend/src/` with shared build settings: `LangVersion = latest`, `Nullable = enable`, `ImplicitUsings = enable`, `TreatWarningsAsErrors = true`
- [X] T111 [P] Add `Directory.Packages.props` at `src/backend/src/` for Central Package Management — pin all NuGet versions centrally
- [X] T112 [P] Configure XML documentation generation in `Mojaz.API.csproj` (`GenerateDocumentationFile = true`) for Swagger XML comments
- [X] T113 Run `dotnet build src/backend/src/Mojaz.sln --configuration Release` and confirm 0 errors, 0 warnings
- [X] T114 Run `dotnet test` across all test projects and confirm all placeholder tests pass
- [X] T115 Smoke test: `docker compose up -d` → `dotnet ef database update` → `dotnet run` → `GET /health` → `GET /swagger` — capture screenshot as evidence

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Requires Phase 1 complete — BLOCKS all user stories
- **Phase 3 (US1 — Architecture Foundation)**: Requires Phase 2 — highest priority
- **Phase 4 (US2 — Shared Types Validation)**: Can run alongside Phase 3 after Phase 2
- **Phase 5 (US3 — Docker & Docs)**: Can run alongside Phase 3/4 after Phase 2
- **Phase 6 (Polish)**: Requires Phases 3, 4, 5 complete

### Within Phase 2 (Foundational)

```
T022 → T023 → T024   (base class chain: BaseEntity → Auditable → SoftDeletable)
T025–T035            [P] All enums — fully parallel (independent files)
T022 done → T036–T056  [P] All entities — parallel (each inherits from a base class)
T036–T056 done → T057–T058  (interfaces depend on BaseEntity being defined)
T059–T061            [P] Shared response models — parallel
T062–T070            [P] Shared exceptions and constants — parallel
```

### Within Phase 3 (US1)

```
T057–T058 done → T071–T075  (Application interfaces depend on Domain interfaces)
T076 depends on T022–T056 (DbContext needs all entities)
T077–T078 depend on T076 (Repository/UoW need DbContext)
T079–T081g depend on T076 (Fluent configs need DbContext)
T082 depends on T079–T081g
T083–T085 depend on T071–T073 (services implement Application interfaces)
T086 depends on T077–T085 (DI registration needs all implementations)
T087–T091 [P] — parallel (configuration and extensions, independent files)
T092–T095 [P] — parallel (middleware files, independent)
T096 depends on T059 (HealthController returns ApiResponse<T>)
T097 depends on T086, T089–T095 (Program.cs wires everything together)
T098 depends on T076, T082 (migration needs full DbContext + all configs)
```

### Parallel Opportunities Summary

| Phase | Parallel group |
|-------|---------------|
| 1 | T002–T010 (project creation), T016–T019 (NuGet), T012–T015 (refs) |
| 2 | T025–T035 (enums), T036–T056 (entities), T059–T070 (Shared types) |
| 3 | T071–T073 (interfaces), T079–T081g (configs), T083–T085 (services), T089–T095 (API extensions/middleware) |
| 4 | T099–T102 (validations) |
| 5 | T104–T108 (Docker files) |
| 6 | T109–T112 (build config) |

---

## Implementation Strategy

### MVP First (User Story 1 — Architecture Foundation)

1. ✅ Complete **Phase 1** (Setup) — solution compiles
2. ✅ Complete **Phase 2** (Foundational) — all 21 entities, enums, base types present
3. ✅ Complete **Phase 3** (US1) — API runs, health endpoint responds, Swagger loads
4. **STOP & VALIDATE**: `dotnet run` → `GET /health` = 200, `GET /swagger` = UI with JWT button
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Compilable solution with all domain types
2. US1 → Running API with clean architecture wired end-to-end **(MVP!)**
3. US2 → Architecture compliance verified, all boilerplate locked down
4. US3 → Developer onboarding automated with Docker
5. Polish → Production-ready build with no warnings

### Parallel Team Strategy

With 2–3 developers after Phase 2 completes:

- **Dev A**: Phase 3 — Application/Infrastructure layers (T071–T086)
- **Dev B**: Phase 3 — API layer and middleware (T087–T098)
- **Dev C**: Phase 4 + Phase 5 — Validation and Docker setup

---

## Notes

- **[P]** = different file, no dependency on any incomplete task in same phase — run in parallel
- **[US#]** = maps to user story in `spec.md` for traceability
- Every entity Fluent API configuration MUST use `HasQueryFilter(x => !x.IsDeleted)` for `SoftDeletableEntity` subclasses
- `DateTime.UtcNow` MUST be used everywhere — `DateTime.Now` is forbidden
- `appsettings.Development.json` MUST be git-ignored in production; Docker password is dev-only
- All middleware MUST use `ApiResponse<object>` format for error responses
- Commit after each phase checkpoint to maintain clean git history
- Verify `dotnet build` passes with 0 warnings after EVERY phase before moving to the next
- **Future features will add**: PushToken.cs, EmailLog.cs, SmsLog.cs entities (PRD §21.15, §21.20, §21.21)
- **Scaffold test tasks are placeholders only** — real 80% coverage target applies when Application services are implemented in feature 004+

---

## Remediation Notes (2026-04-12)

### Issues Fixed During Review

| Date | Issue | Fix |
|------|-------|-----|
| 2026-04-12 | ValidationFilter not registered in Program.cs | Added `options.Filters.Add<ValidationFilter>()` to AddControllers configuration |
| 2026-04-12 | Entity configurations incorrectly using soft-delete | Removed `HasQueryFilter(x => !x.IsDeleted)` from: PaymentConfiguration, TheoryTestConfiguration, PracticalTestConfiguration, MedicalExaminationConfiguration (these entities inherit from AuditableEntity, not SoftDeletableEntity) |

### Build Verification

```
dotnet build Mojaz.sln --no-restore

Build succeeded.
    2 Warning(s)
    0 Error(s)
Time Elapsed 00:00:21.92
```