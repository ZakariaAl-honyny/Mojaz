# Phase 0: Research & Technical Decisions (011-rbac-user-settings)

## Topic 1: Role-Based Access Control Implementation
- **Decision:** Implement Policy-Based Authorization in ASP.NET Core (`[Authorize(Policy = "PolicyName")]`).
- **Rationale:** Aligns with standard ASP.NET Core security patterns. Policies like `EmployeeOnly` can cleanly compose multiple roles (Manager, Receptionist, etc.) avoiding bloated controller attributes.
- **Alternatives considered:** Role-Based `[Authorize(Roles = "...")]` (rejected for composite policies due to code duplication); Custom Middleware (rejected as over-engineering).

## Topic 2: System Settings Caching 
- **Decision:** Use `Microsoft.Extensions.Caching.Memory.IMemoryCache` injected directly into the `SystemSettingsService`. 
- **Rationale:** Settings are queried on nearly every request. A distributed cache (Redis) adds unnecessary network latency for simple KV settings, whereas an in-memory cache guarantees microsecond reads. In a scaled environment, standard expiration/staleness mechanisms or pub/sub can be added later if needed. For now, on update, we manually invalidate the cache key.
- **Alternatives considered:** Redis `IDistributedCache` (rejected due to network latency overhead for small configurations); EF Core caching via global queries (insufficient control).

## Topic 3: Employee Onboarding & Temporary Passwords
- **Decision:** Extend the `User` Domain Entity with a boolean `RequiresPasswordReset`. When an Admin creates a user, generating a secure temporary password via a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG).
- **Rationale:** Adheres securely to the spec. When `RequiresPasswordReset` is true, the Auth controller will issue a restricted token, or intercept requests to force the reset flow.
- **Alternatives considered:** Email magic links (rejected as PRD mandates immediate onboard without external dependency).

## Topic 4: AuditLog Pattern
- **Decision:** Create a centralized `AuditLog` domain entity featuring a `Payload` property (stored as `NVARCHAR(MAX)` for JSON) to capture before/after object states.
- **Rationale:** Easy to implement within the `IUnitOfWork` interceptor or explicitly in the Application Services. JSON serialization prevents structural migrations when entities change.
- **Alternatives considered:** Temporal Tables in SQL Server 2022 (rejected because we need application-level context like `UserId` and `ActionType` associated easily out-of-the-box).
