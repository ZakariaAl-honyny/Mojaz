# Research: Security Review and Production Hardening

## Decision: Middleware & Policy Stack for Hardening

After researching the best practices for ASP.NET Core 8 production hardening, the following technical stack and patterns are selected:

### 1. Security Headers & HSTS
- **Decision**: Custom Middleware for Security Headers; Built-in `UseHsts()` for transport security.
- **Rationale**: Custom middleware provides absolute control over the header set without external dependencies. `NetEscapades` was considered but deemed overkill for the limited set of headers (nosniff, DENY, CSP).
- **Alternatives considered**: `NetEscapades.AspNetCore.SecurityHeaders` (Rejected for Mojaz to minimize package bloat).

### 2. Dynamic Rate Limiting
- **Decision**: `Microsoft.AspNetCore.RateLimiting` with `PartitionedRateLimiter` using `RateLimitPartition.GetFixedWindowLimiter`.
- **Rationale**: This natively supports .NET 8. Settings will be resolved via a scoped service that reads from `IMemoryCache` (populated from `SystemSettings` table).
- **Alternatives considered**: `AspNetCoreRateLimit` NuGet package (Legacy, built-in is preferred in .NET 8).

### 3. File Signature Validation (Magic Numbers)
- **Decision**: `FileSignatures` NuGet package.
- **Rationale**: Minimalist and highly performant for the core set of government document types (PDF, JPG, PNG). It uses stream-based inspection to avoid memory issues.
- **Alternatives considered**: `Mime-Detective` (Powerful but larger definitions file than needed for Mojaz).

### 4. Production Exception Handling
- **Decision**: `IExceptionHandler` implementation.
- **Rationale**: The new .NET 8 interface is the official replacement for custom error middleware, allowing better integration with `AddProblemDetails`.
- **Alternatives considered**: Custom `UseExceptionHandler` with lambda (Less structured).

### 5. Audit Logging Performance
- **Decision**: Action Filter combined with `IBackgroundJobClient` (Hangfire).
- **Rationale**: Logging security events MUST NOT delay the main API response. Dispatching the persistence to Hangfire ensures the user request completes immediately.
- **Alternatives considered**: Synchronous DB writes (Rejected due to performance impact).

## Summary Table

| Requirement | Implementation Detail | Tool/Library |
|-------------|------------------------|--------------|
| Security Headers | Global Middleware | Custom Code |
| Rate Limiting | Partitioned Policy | .NET 8 Native |
| File Validation | `FileFormatInspector` | `FileSignatures` |
| Error Sanitization | `IExceptionHandler` | .NET 8 Native |
| Audit Logging | Async Action Filter | Hangfire |
| Secrets | `AddEnvironmentVariables()` | .NET 8 Native |
