# Tasks: Backend Solution Scaffold

**Input**: Design documents from `/specs/001-project-scaffold/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅
**Branch**: `001-project-scaffold`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (independent files, no dependency on incomplete task)
- **[US#]**: Which user story this task belongs to
- All paths are relative to repository root

> **PRD Deviations (documented):**
> - **Applicants table** (PRD §21.2): Merged into `User.cs` — single entity for all user/applicant data. Rationale: avoids an unnecessary 1:1 join for every query.
> - **PushTokens table** (PRD §21.15): Deferred to notification feature (004). Push token management is not needed for the scaffold.
> - **EmailLogs / SmsLogs tables** (PRD §21.20–21.21): Deferred to notification feature (004). Delivery logs belong with the notification infrastructure.
> - Entity properties intentionally diverge from PRD where plan.md improves on the design (bilingual name split, generic entity refs in notifications, etc.). See plan.md addendum.

---

## Phase 1: Setup
**Purpose**: Initialize solution structure, configurations, and dependencies.

- [X] T001 Create .NET 8 solution file at `src/backend/src/Mojaz.sln`
- [X] T002 Create `src/backend/src/Mojaz.Domain` class library: `dotnet new classlib -n Mojaz.Domain -o src/backend/src/Mojaz.Domain`
- [X] T003 [P] Create `src/backend/src/Mojaz.Shared` class library: `dotnet new classlib -n Mojaz.Shared -o src/backend/src/Mojaz.Shared`
- [X] T004 [P] Create `src/backend/src/Mojaz.Application` class library: `dotnet new classlib -n Mojaz.Application -o src/backend/src/Mojaz.Application`
- [X] T005 [P] Create `src/backend/src/Mojaz.Infrastructure` class library: `dotnet new classlib -n Mojaz.Infrastructure -o src/backend/src/Mojaz.Infrastructure`
- [X] T006 [P] Create `src/backend/src/Mojaz.API` web API project: `dotnet new webapi -n Mojaz.API -o src/backend/src/Mojaz.API --no-openapi`
- [X] T011 Add all projects to solution (`dotnet sln add` for all 9 projects)
- [X] T012 Add project references: Application → Domain, Application → Shared
- [X] T013 [P] Add project references: Infrastructure → Domain, Infrastructure → Shared, Infrastructure → Application
- [X] T014 [P] Add project references: API → Domain, API → Shared, API → Application, API → Infrastructure
- [X] T016 Add NuGet packages to `Mojaz.Application`: `AutoMapper 13`, `AutoMapper.Extensions.Microsoft.DependencyInjection`, `FluentValidation 11`, `FluentValidation.DependencyInjectionExtensions`
- [X] T017 [P] Add NuGet packages to `Mojaz.Infrastructure`: `Microsoft.EntityFrameworkCore.SqlServer 8`, `Microsoft.EntityFrameworkCore.Tools 8`, `BCrypt.Net-Next`, `SendGrid`, `Twilio`, `FirebaseAdmin`, `Hangfire.Core`, `Hangfire.SqlServer`, `Hangfire.AspNetCore`, `QuestPDF`, `Serilog.AspNetCore`, `Serilog.Sinks.Console`, `Serilog.Sinks.File`
- [X] T018 [P] Add NuGet packages to `Mojaz.API`: `Microsoft.AspNetCore.Authentication.JwtBearer 8`, `Swashbuckle.AspNetCore 6`, `AspNetCoreRateLimit`, `Microsoft.Extensions.Diagnostics.HealthChecks`
- [X] T020 Remove auto-generated `Class1.cs` from Domain, Shared, Application, Infrastructure, and `WeatherForecast.cs` / sample controllers from API
- [X] T021 Verify `dotnet build src/backend/src/Mojaz.sln` compiles with 0 errors

---

## Phase 2: Tests
**Purpose**: Initialize test projects and TDD foundation.

- [X] T007 [P] Create `tests/Mojaz.Domain.Tests` xUnit project: `dotnet new xunit -n Mojaz.Domain.Tests -o tests/Mojaz.Domain.Tests`
- [X] T008 [P] Create `tests/Mojaz.Application.Tests` xUnit project: `dotnet new xunit -n Mojaz.Application.Tests -o tests/Mojaz.Application.Tests`
- [X] T009 [P] Create `tests/Mojaz.Infrastructure.Tests` xUnit project: `dotnet new xunit -n Mojaz.Infrastructure.Tests -o tests/Mojaz.Infrastructure.Tests`
- [X] T010 [P] Create `tests/Mojaz.API.Tests` xUnit project: `dotnet new xunit -n Mojaz.API.Tests -o tests/Mojaz.API.Tests`
- [X] T015 [P] Add test project references: Domain.Tests → Domain; Application.Tests → Application, Domain; Infrastructure.Tests → Infrastructure; API.Tests → API
- [X] T019 [P] Add NuGet packages to test projects: xUnit, Moq 4, FluentAssertions 6, `Microsoft.EntityFrameworkCore.InMemory` (Infrastructure.Tests only)
- [X] T109 [P] Verify all 4 test projects build and at least one placeholder unit test exists in each
- [X] T114 Run `dotnet test` across all test projects and confirm all placeholder tests pass

---

## Phase 3: Core
**Purpose**: Implement Domain, Application, Infrastructure, and API components.

### Domain Layer
- [X] T022 Create `src/backend/src/Mojaz.Domain/Common/BaseEntity.cs` with `Id (Guid)`, `CreatedAt (DateTime UTC)`, `UpdatedAt (DateTime UTC)`
- [X] T023 Create `src/backend/src/Mojaz.Domain/Common/AuditableEntity.cs` extending `BaseEntity` with `CreatedBy (Guid?)`, `UpdatedBy (Guid?)`
- [X] T024 Create `src/backend/src/Mojaz.Domain/Common/SoftDeletableEntity.cs` extending `AuditableEntity` with `IsDeleted (bool)`, `DeletedAt (DateTime? UTC)`, `DeletedBy (Guid?)`
- [X] T025 [P] Create `src/backend/src/Mojaz.Domain/Enums/ApplicationStatus.cs`
- [X] T026 [P] Create `src/backend/src/Mojaz.Domain/Enums/LicenseCategoryCode.cs`
- [X] T027 [P] Create `src/backend/src/Mojaz.Domain/Enums/FeeType.cs`
- [X] T028 [P] Create `src/backend/src/Mojaz.Domain/Enums/AppointmentType.cs`
- [X] T029 [P] Create `src/backend/src/Mojaz.Domain/Enums/DocumentType.cs`
- [X] T030 [P] Create `src/backend/src/Mojaz.Domain/Enums/NotificationEventType.cs`
- [X] T031 [P] Create `src/backend/src/Mojaz.Domain/Enums/PaymentStatus.cs`
- [X] T032 [P] Create `src/backend/src/Mojaz.Domain/Enums/TestResult.cs`
- [X] T033 [P] Create `src/backend/src/Mojaz.Domain/Enums/MedicalFitnessResult.cs`
- [X] T034 [P] Create `src/backend/src/Mojaz.Domain/Enums/UserRole.cs`
- [X] T035 [P] Create `src/backend/src/Mojaz.Domain/Enums/RegistrationMethod.cs`
- [X] T036 [P] Create `src/backend/src/Mojaz.Domain/Entities/User.cs` (extends `SoftDeletableEntity`)
- [X] T037 [P] Create `src/backend/src/Mojaz.Domain/Entities/OtpCode.cs` (extends `BaseEntity`)
- [X] T038 [P] Create `src/backend/src/Mojaz.Domain/Entities/RefreshToken.cs` (extends `BaseEntity`)
- [X] T039 [P] Create `src/backend/src/Mojaz.Domain/Entities/LicenseCategory.cs` (extends `AuditableEntity`)
- [X] T040 [P] Create `src/backend/src/Mojaz.Domain/Entities/Application.cs` (extends `SoftDeletableEntity`)
- [X] T041 [P] Create `src/backend/src/Mojaz.Domain/Entities/ApplicationDocument.cs` (extends `AuditableEntity`)
- [X] T042 [P] Create `src/backend/src/Mojaz.Domain/Entities/ApplicationStatusHistory.cs` (extends `BaseEntity`)
- [X] T043 [P] Create `src/backend/src/Mojaz.Domain/Entities/Appointment.cs` (extends `SoftDeletableEntity`)
- [X] T044 [P] Create `src/backend/src/Mojaz.Domain/Entities/MedicalExamination.cs` (extends `AuditableEntity`)
- [X] T045 [P] Create `src/backend/src/Mojaz.Domain/Entities/TrainingRecord.cs` (extends `AuditableEntity`)
- [X] T046 [P] Create `src/backend/src/Mojaz.Domain/Entities/TheoryTest.cs` (extends `AuditableEntity`)
- [X] T047 [P] Create `src/backend/src/Mojaz.Domain/Entities/PracticalTest.cs` (extends `AuditableEntity`)
- [X] T048 [P] Create `src/backend/src/Mojaz.Domain/Entities/Payment.cs` (extends `AuditableEntity`)
- [X] T049 [P] Create `src/backend/src/Mojaz.Domain/Entities/License.cs` (extends `SoftDeletableEntity`)
- [X] T050 [P] Create `src/backend/src/Mojaz.Domain/Entities/LicenseRenewal.cs` (extends `AuditableEntity`)
- [X] T051 [P] Create `src/backend/src/Mojaz.Domain/Entities/LicenseReplacement.cs` (extends `AuditableEntity`)
- [X] T052 [P] Create `src/backend/src/Mojaz.Domain/Entities/CategoryUpgrade.cs` (extends `AuditableEntity`)
- [X] T053 [P] Create `src/backend/src/Mojaz.Domain/Entities/Notification.cs` (extends `BaseEntity`)
- [X] T054 [P] Create `src/backend/src/Mojaz.Domain/Entities/AuditLog.cs` (standalone)
- [X] T055 [P] Create `src/backend/src/Mojaz.Domain/Entities/SystemSetting.cs` (extends `AuditableEntity`)
- [X] T056 [P] Create `src/backend/src/Mojaz.Domain/Entities/FeeStructure.cs` (extends `AuditableEntity`)
- [X] T057 Create `src/backend/src/Mojaz.Domain/Interfaces/IRepository.cs`
- [X] T058 Create `src/backend/src/Mojaz.Domain/Interfaces/IUnitOfWork.cs`

### Shared Layer
- [X] T059 Create `src/backend/src/Mojaz.Shared/Models/ApiResponse.cs`
- [X] T060 [P] Create `src/backend/src/Mojaz.Shared/Models/PagedResult.cs`
- [X] T061 [P] Create `src/backend/src/Mojaz.Shared/Models/Result.cs`
- [X] T062 [P] Create `src/backend/src/Mojaz.Shared/Exceptions/NotFoundException.cs`
- [X] T063 [P] Create `src/backend/src/Mojaz.Shared/Exceptions/ValidationException.cs`
- [X] T064 [P] Create `src/backend/src/Mojaz.Shared/Exceptions/UnauthorizedException.cs`
- [X] T065 [P] Create `src/backend/src/Mojaz.Shared/Exceptions/ForbiddenException.cs`
- [X] T066 [P] Create `src/backend/src/Mojaz.Shared/Exceptions/ConflictException.cs`
- [X] T067 [P] Create `src/backend/src/Mojaz.Shared/Constants/Roles.cs`
- [X] T068 [P] Create `src/backend/src/Mojaz.Shared/Constants/Policies.cs`
- [X] T069 [P] Create `src/backend/src/Mojaz.Shared/Constants/CacheKeys.cs`
- [X] T070 [P] Create `src/backend/src/Mojaz.Shared/Extensions/StringExtensions.cs`

### Application Layer
- [X] T071 [US1] Create `src/backend/src/Mojaz.Application/Interfaces/Infrastructure/IEmailService.cs`
- [X] T072 [P] [US1] Create `src/backend/src/Mojaz.Application/Interfaces/Infrastructure/ISmsService.cs`
- [X] T073 [P] [US1] Create `src/backend/src/Mojaz.Application/Interfaces/Infrastructure/IPushNotificationService.cs`
- [X] T074 [US1] Create `src/backend/src/Mojaz.Application/Mappings/MappingProfile.cs`
- [X] T075 [US1] Create `src/backend/src/Mojaz.Application/Extensions/ServiceCollectionExtensions.cs` with `AddApplicationServices()`

### Infrastructure Layer
- [X] T076 [US1] Create `src/backend/src/Mojaz.Infrastructure/Persistence/MojazDbContext.cs`
- [X] T077 [US1] Create `src/backend/src/Mojaz.Infrastructure/Persistence/Repositories/Repository.cs`
- [X] T078 [US1] Create `src/backend/src/Mojaz.Infrastructure/Persistence/UnitOfWork/UnitOfWork.cs`
- [X] T079 [US1] Create `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/UserConfiguration.cs`
- [X] T080 [P] [US1] Create `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/ApplicationConfiguration.cs`
- [X] T081a [P] [US1] Create entity configurations for auth/security entities in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T081b [P] [US1] Create entity configurations for reference data in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T081c [P] [US1] Create entity configurations for documents/appointments in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T081d [P] [US1] Create entity configurations for medical/training in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T081e [P] [US1] Create entity configurations for tests/payments in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T081f [P] [US1] Create entity configurations for license lifecycle in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T081g [P] [US1] Create entity configuration for notifications in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [X] T082 [US1] Register all `IEntityTypeConfiguration<T>` classes in `MojazDbContext.OnModelCreating`
- [X] T083 [P] [US1] Create `src/backend/src/Mojaz.Infrastructure/Services/EmailService.cs`
- [X] T084 [P] [US1] Create `src/backend/src/Mojaz.Infrastructure/Services/SmsService.cs`
- [X] T085 [P] [US1] Create `src/backend/src/Mojaz.Infrastructure/Services/PushNotificationService.cs`
- [X] T086 [US1] Create `src/backend/src/Mojaz.Infrastructure/Extensions/ServiceCollectionExtensions.cs` with `AddInfrastructureServices(IConfiguration)`

### API Layer
- [X] T087 [US1] Create `src/backend/src/Mojaz.API/appsettings.json`
- [X] T088 [US1] Create `src/backend/src/Mojaz.API/appsettings.Development.json`
- [X] T089 [US1] Create `src/backend/src/Mojaz.API/Extensions/SwaggerExtensions.cs`
- [X] T090 [P] [US1] Create `src/backend/src/Mojaz.API/Extensions/SecurityHeadersExtensions.cs`
- [X] T091 [P] [US1] Create `src/backend/src/Mojaz.API/Extensions/CorsExtensions.cs`
- [X] T092 [US1] Create `src/backend/src/Mojaz.API/Middleware/GlobalExceptionHandlerMiddleware.cs`
- [X] T093 [P] [US1] Create `src/backend/src/Mojaz.API/Middleware/RequestLoggingMiddleware.cs`
- [X] T094 [P] [US1] Create `src/backend/src/Mojaz.API/Middleware/AuditLogMiddleware.cs`
- [X] T095 [P] [US1] Create `src/backend/src/Mojaz.API/Filters/ValidationFilter.cs`

---

## Phase 4: Integration
**Purpose**: Wire components together, handle errors, logging, and environment setup.

- [X] T096 [US1] Create `src/backend/src/Mojaz.API/Controllers/HealthController.cs`
- [X] T097 [US1] Write full `src/backend/src/Mojaz.API/Program.cs` (wiring DI, middleware pipeline, auth, rate limiting, etc.)
- [X] T098 [US1] Generate initial EF Core migration: `dotnet ef migrations add InitialCreate`
- [X] T104 [US3] Create `docker-compose.yml` at repo root
- [X] T105 [US3] Create `docker-compose.override.yml`
- [X] T106 [US3] Create `.env.development`

---

## Phase 5: Polish
**Purpose**: Final validation, build optimization, and developer documentation.

- [X] T099 [US2] Verify `src/backend/src/Mojaz.Domain/Mojaz.Domain.csproj` has ZERO `<PackageReference>` entries
- [X] T100 [P] [US2] Verify `src/backend/src/Mojaz.Application/Mojaz.Application.csproj` has NO reference to `Mojaz.Infrastructure`
- [X] T101 [P] [US2] Verify all 21 entities exist and inherit from appropriate base class
- [X] T102 [P] [US2] Verify all 11 enums exist
- [X] T103 [US2] Add `ApplicationNumberGenerator.cs` to `src/backend/src/Mojaz.Domain/Common/`
- [X] T107 [US3] Create `specs/001-project-scaffold/quickstart.md`
- [X] T108 [US3] Add `.gitignore` entries for secrets and local config
- [X] T110 [P] Add `Directory.Build.props` at `src/backend/src/`
- [X] T111 [P] Add `Directory.Packages.props` at `src/backend/src/` (Central Package Management)
- [X] T112 [P] Configure XML documentation generation in `Mojaz.API.csproj`
- [X] T113 Run `dotnet build src/backend/src/Mojaz.sln --configuration Release` and confirm 0 errors, 0 warnings
- [X] T115 Smoke test: `docker compose up -d` → `dotnet ef database update` → `dotnet run` → `GET /health` → `GET /swagger`
