# Feature 001: Backend Solution Scaffold 

## WHAT WE'RE BUILDING:
A .NET 8 solution following Clean Architecture with 5 projects that serves as the foundation for all backend development.

## REQUIREMENTS:

### 1. Solution Structure:
- **Mojaz.Domain:** Entities, Enums, Value Objects, Domain Interfaces
  - NO external NuGet packages (zero dependencies)
  - Base entity classes: BaseEntity (Id, CreatedAt, UpdatedAt), AuditableEntity (CreatedBy, UpdatedBy), SoftDeletableEntity (IsDeleted)
  - All 21 entity classes defined per database schema
  - Enums: ApplicationStatus, LicenseCategoryCode, FeeType, AppointmentType, DocumentType, NotificationEventType, PaymentStatus, TestResult, MedicalFitnessResult, UserRole, RegistrationMethod

- **Mojaz.Shared:** Cross-cutting shared types
  - ApiResponse<T> with Success, Message, Data, Errors, StatusCode
  - PagedResult<T> with Items, TotalCount, Page, PageSize, TotalPages, HasPreviousPage, HasNextPage
  - Result<T> for internal operation results
  - Custom exceptions: NotFoundException, ValidationException, UnauthorizedException, ForbiddenException, ConflictException
  - Constants: Roles, Policies, CacheKeys
  - Extension methods

- **Mojaz.Application:** Business logic layer
  - References: Domain, Shared only
  - Services interfaces and implementations
  - DTOs (Request/Response/Dto suffix)
  - FluentValidation validators
  - AutoMapper profiles
  - Service registration extension method

- **Mojaz.Infrastructure:** External concerns
  - References: Domain, Shared, Application
  - EF Core DbContext (MojazDbContext)
  - Repository<T> implementation
  - UnitOfWork implementation
  - External service implementations (Email, SMS, Push)
  - EF Core entity configurations
  - Migrations
  - Infrastructure registration extension method

- **Mojaz.API:** Composition root
  - References: All layers
  - Controllers (thin, delegate to services)
  - Middleware: GlobalExceptionHandler, RequestLogging, AuditLog
  - Filters: ValidationFilter
  - Program.cs with DI registration
  - Swagger/OpenAPI configuration with JWT auth support
  - CORS configuration
  - Rate limiting configuration
  - Serilog configuration (Console + File sinks)

### 2. NuGet Packages:
- Domain: NONE
- Shared: NONE
- Application: AutoMapper 13, FluentValidation 11
- Infrastructure: EF Core 8 (SqlServer), BCrypt.Net, SendGrid, Twilio, FirebaseAdmin, Hangfire, QuestPDF, Serilog
- API: JwtBearer, Swashbuckle, AspNetCoreRateLimit

### 3. Test Projects (4):
- Mojaz.Domain.Tests, Mojaz.Application.Tests, Mojaz.Infrastructure.Tests, Mojaz.API.Tests
- Using: xUnit, Moq, FluentAssertions

### 4. Global Exception Handler:
- Catch all unhandled exceptions
- Return ApiResponse<object> with appropriate status code
- Log exception details via Serilog
- NEVER expose stack traces in production

### 5. Swagger Configuration:
- JWT Bearer authentication button
- API versioning support (v1)
- XML documentation comments
- Grouped by controller

### 6. appsettings.json structure:
- ConnectionStrings.DefaultConnection
- JwtSettings (Secret, Issuer, Audience, AccessTokenMinutes, RefreshTokenDays)
- SendGridSettings (ApiKey, SenderEmail, SenderName)
- TwilioSettings (AccountSid, AuthToken, FromNumber)
- FirebaseSettings (ProjectId, CredentialPath)
- HangfireSettings
- RateLimitSettings

## USER STORIES:
- As a developer, I want a clean architecture solution so that code is organized and maintainable
- As a developer, I want base classes and shared types so I don't repeat boilerplate code
- As a developer, I want Swagger documentation so I can test API endpoints

## ACCEPTANCE CRITERIA:
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