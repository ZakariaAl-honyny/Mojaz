# Feature Specification: 001-project-scaffold

**Feature Branch**: `001-project-scaffold`  
**Created**: 2026-04-04  
**Status**: Clarified  
**Input**: User description: "Backend Solution Scaffold - .NET 8 Clean Architecture solution with 5 projects serving as foundation for all backend development"

## Clarifications
### Session 2026-04-04
- Q: Do we use MediatR/CQRS or direct service injection? → A: Direct service injection for MVP simplicity.
- Q: Do we use Data Annotations or Fluent API for EF Core? → A: Fluent API only (in Infrastructure/Configurations/).
- Q: Do we use Global Query Filters for Soft Delete? → A: Yes, HasQueryFilter(x => !x.IsDeleted) on all entities with soft delete.
- Q: What is the Docker SQL Server Connection String format? → A: Server=localhost,1433;Database=MojazDB;User Id=sa;Password=as123456;TrustServerCertificate=True
- Q: Do we use Generic vs Entity-Specific IRepository? → A: Generic IRepository<T> with option for entity-specific interfaces when custom methods needed.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create backend foundation (Priority: P1)

As a developer, I want a clean architecture solution so that code is organized and maintainable.

**Why this priority**: The backend structure is the foundational prerequisite for all other backend features.

**Independent Test**: Can be fully tested by building the solution, ensuring no circular dependencies, and running the API to reach a health check endpoint.

**Acceptance Scenarios**:
1. **Given** the new solution, **When** it is built, **Then** it compiles with zero errors and zero warnings.
2. **Given** the project references, **When** checked, **Then** all 5 projects have correct references with no circular dependencies.
3. **Given** the Domain project, **When** checked, **Then** it has zero NuGet packages.
4. **Given** the Application project, **When** checked, **Then** it does NOT reference Infrastructure.

### User Story 2 - Provide boilerplate and shared types (Priority: P1)

As a developer, I want base classes and shared types so I don't repeat boilerplate code.

**Why this priority**: Minimizes duplication across entities, APIs, and business logic.

**Independent Test**: Can be fully tested by verifying the existence of `BaseEntity`, `ApiResponse<T>`, and `PagedResult<T>`.

**Acceptance Scenarios**:
1. **Given** the Domain project, **When** checked, **Then** it contains all 21 entity classes and required enums.
2. **Given** the Shared project, **When** checked, **Then** `ApiResponse<T>` and `PagedResult<T>` exist.

### User Story 3 - Testing and Documentation setup (Priority: P2)

As a developer, I want Swagger documentation so I can test API endpoints, and a global exception handler to gracefully surface errors.

**Why this priority**: Crucial for testing and integration with the frontend.

**Independent Test**: Can be fully tested by sending a request to the API and checking Swagger or inducing an error to verify the response format.

**Acceptance Scenarios**:
1. **Given** an unhandled error, **When** it occurs, **Then** the global exception handler returns ApiResponse format.
2. **Given** the API is running, **When** accessing `/swagger`, **Then** Swagger loads with a JWT auth button.
3. **Given** logging setup, **When** the application runs, **Then** Serilog writes to console and file.

### Edge Cases

- What happens when a request triggers a domain or database exception? (Caught by GlobalExceptionHandler and mapped to a 400 or 500 level ApiResponse<T>).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a solution structure with Mojaz.Domain, Mojaz.Shared, Mojaz.Application, Mojaz.Infrastructure, and Mojaz.API.
- **FR-002**: System MUST include base classes: BaseEntity, AuditableEntity, SoftDeletableEntity.
- **FR-003**: System MUST define the 21 entity classes per database schema within Mojaz.Domain.
- **FR-004**: System MUST define all 11 enums within Mojaz.Domain: ApplicationStatus, LicenseCategoryCode, FeeType, AppointmentType, DocumentType, NotificationEventType, PaymentStatus, TestResult, MedicalFitnessResult, UserRole, RegistrationMethod.
- **FR-005**: System MUST provide cross-cutting types like `ApiResponse<T>`, `PagedResult<T>`, `Result<T>`, and custom exceptions within Mojaz.Shared.
- **FR-006**: System MUST configure FluentValidation and AutoMapper within Mojaz.Application.
- **FR-007**: System MUST configure EF Core DbContext with Fluent API entity configurations within Mojaz.Infrastructure.
- **FR-008**: System MUST implement generic `IRepository<T>` and UnitOfWork within Mojaz.Infrastructure, with entity-specific repository interfaces allowed only when custom query methods are needed.
- **FR-009**: System MUST apply a Global Exception Handler, Request Logging, and Audit Logging middleware within Mojaz.API.
- **FR-010**: System MUST configure Swagger/OpenAPI with JWT bearer support and API versioning.
- **FR-011**: System MUST configure Serilog for console and file sinks.
- **FR-012**: System MUST include 4 test projects corresponding to the main application layers (xUnit, Moq, FluentAssertions).

### Key Entities 

- **BaseEntity**: Base attributes (Id, CreatedAt, UpdatedAt).
- **AuditableEntity**: Standardizes user tracking (CreatedBy, UpdatedBy).
- **SoftDeletableEntity**: Standardizes soft-delete functionality (IsDeleted).
- **All 21 Domain Entities**: Defined per schema.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Solution builds in under 30 seconds with 0 warnings and 0 errors.
- **SC-002**: 100% of the 5 projects adhere to clean architecture dependency rules (checked via project references).
- **SC-003**: 100% of domain entities and enums are created.
- **SC-004**: Swagger loads at `/swagger` on API start.
- **SC-005**: The `docker-compose.yml` successfully starts a SQL Server container.
- **SC-006**: The API responds with HTTP 200 OK to a root health check endpoint.

## Assumptions

- No complex CQRS pattern is required; direct service injection is sufficient for MVP simplicity.
- Infrastructure and Application projects have necessary package references (EF Core, AutoMapper, FluentValidation, Serilog).
- All entity configurations will use Fluent API, avoiding Data Annotations entirely.
- Soft-delete queries are globally filtered via EF Core.
- The `appsettings.json` outlines required configurations like JwtSettings, SendGrid, Twilio, Firebase, and Hangfire.
