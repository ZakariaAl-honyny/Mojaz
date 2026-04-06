# Research: Backend Solution Scaffold

**Branch**: `003-backend-scaffold` | **Date**: 2026-04-04

---

## Decision 1 — Service Pattern: Direct Injection vs MediatR/CQRS

**Decision**: Direct service injection  
**Rationale**: MediatR adds a messaging bus and handler-per-command overhead that is unnecessary
at MVP stage. The team has explicitly decided to use direct `IXxxService` interfaces injected
into controllers. CQRS can be layered in later without breaking the clean architecture
boundaries — Application service interface boundaries are already the natural seam.  
**Alternatives considered**:
- MediatR CQRS — rejected: overhead, learning curve, no clear benefit at current team size
- Mediator pattern (custom) — rejected: reinventing the wheel

---

## Decision 2 — EF Core Entity Configuration: Fluent API vs Data Annotations

**Decision**: Fluent API only, in `Infrastructure/Persistence/Configurations/`  
**Rationale**: Data Annotations couple domain entities to EF Core attributes, violating the
dependency inversion principle (Domain must have zero external dependencies). Fluent API
configurations live entirely inside the Infrastructure layer, where EF Core is already
a first-class dependency. One `IEntityTypeConfiguration<T>` file per entity allows
easy navigation and diff review.  
**Alternatives considered**:
- Data Annotations — rejected: Domain entities would need EF Core NuGet reference
- Hybrid — rejected: inconsistency defeats the purpose

---

## Decision 3 — Soft Delete: HasQueryFilter vs Manual WHERE Clauses

**Decision**: `HasQueryFilter(x => !x.IsDeleted)` on all entities implementing
`SoftDeletableEntity`  
**Rationale**: Global query filters are applied automatically to every LINQ query for the
entity type, eliminating the risk of forgetting a `WHERE IsDeleted = 0` clause. Can be
bypassed in specific admin/audit queries via `IgnoreQueryFilters()`.  
**Alternatives considered**:
- Manual WHERE clauses — rejected: error-prone; deleted records could leak into responses
- Soft-delete via shadow property — rejected: difficult to express in strongly typed Fluent API

---

## Decision 4 — Repository Shape: Generic vs Entity-Specific

**Decision**: `IRepository<T> where T : BaseEntity` as the primary pattern.
Entity-specific interfaces (e.g., `IUserRepository : IRepository<User>`) ONLY when
custom query methods are needed that cannot be expressed via the generic `FindAsync` predicate.  
**Rationale**: Generic repository avoids copy-paste for trivial CRUD while allowing escape
hatches for complex queries. The rule "add entity-specific only when needed" prevents
premature specialization.  
**Alternatives considered**:
- Fully entity-specific repositories — rejected: boilerplate explosion for 21 entities
- No repository (direct DbContext) — rejected: violates constitution; untestable in Application layer

---

## Decision 5 — Background Jobs: Hangfire vs Other Options

**Decision**: Hangfire with SQL Server storage (`UseHangfireSqlServer`)  
**Rationale**: Hangfire persists jobs in the same SQL Server database, survives API restarts,
supports automatic retries with configurable backoff, and has a built-in dashboard.
No additional infrastructure needed for MVP (no Redis, no RabbitMQ).  
**Alternatives considered**:
- Hosted `IHostedService` with Channel\<T\> — rejected: in-memory; jobs lost on crash
- Azure Service Bus — rejected: cloud dependency; overkill for MVP
- MassTransit — rejected: heavy abstraction; no benefit without distributed systems

---

## Decision 6 — Logging: Serilog vs Microsoft.Extensions.Logging default

**Decision**: Serilog with `WriteTo.Console(formatter: CompactJsonFormatter)` +
`WriteTo.File(rollingInterval: RollingInterval.Day)`  
**Rationale**: Serilog provides structured logging with property enrichment (machine name,
thread id, request id). JSON console output is directly ingestible by centralized logging
platforms (Elastic, Splunk) when deployed. Rolling file provides local audit trail.  
**Alternatives considered**:
- Default MEL (console only) — rejected: no structured properties, no file sink
- NLog — rejected: less idiomatic in .NET 8 ecosystem; Serilog has richer sink ecosystem

---

## Decision 7 — Auth: JWT Bearer + Refresh Token vs Sessions vs OAuth2

**Decision**: JWT Bearer tokens (short-lived, 60 min) + Refresh Tokens (7 days, stored in DB)  
**Rationale**: Stateless JWT scales horizontally without shared session store. Refresh tokens
stored in `RefreshTokens` table allow revocation (logout from all devices). Durations
are configurable via `SystemSettings` per the constitution.  
**Alternatives considered**:
- Cookie sessions — rejected: stateful, harder to support mobile/SPA simultaneously
- OAuth2 Identity Server — rejected: significant infrastructure overhead for MVP

---

## Decision 8 — appsettings.json Structure

All secrets are absent from `appsettings.json`. They are supplied via:
1. `appsettings.Development.json` (local dev, git-ignored)
2. `.NET User Secrets` (`dotnet user-secrets`)
3. Environment variables (CI/CD, Docker, production)

Structure committed to source:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": ""
  },
  "JwtSettings": {
    "Secret": "",
    "Issuer": "Mojaz",
    "Audience": "MojazClients",
    "AccessTokenMinutes": 60,
    "RefreshTokenDays": 7
  },
  "SendGridSettings": {
    "ApiKey": "",
    "SenderEmail": "noreply@mojaz.gov.sa",
    "SenderName": "Mojaz Platform"
  },
  "TwilioSettings": {
    "AccountSid": "",
    "AuthToken": "",
    "FromNumber": ""
  },
  "FirebaseSettings": {
    "ProjectId": "",
    "CredentialPath": ""
  },
  "HangfireSettings": {
    "WorkerCount": 5
  },
  "RateLimitSettings": {
    "LoginPerMinute": 10,
    "RegisterPerMinute": 5,
    "OtpPerMinute": 3
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning"
      }
    }
  }
}
```
