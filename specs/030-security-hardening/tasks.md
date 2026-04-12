# Tasks: Security Review and Production Hardening

## Phase 1: Setup

- [x] T001 Install security NuGet packages (`FileSignatures`, `Microsoft.AspNetCore.RateLimiting`) in `src/backend/Mojaz.Infrastructure`
- [x] T002 Create infrastructure folder for security logic at `src/backend/Mojaz.Infrastructure/Security`

## Phase 2: Foundational

- [x] T003 [P] Add security configuration keys to `SystemSetting` seed data in `src/backend/Mojaz.Infrastructure/Persistence/Seed/SystemSettingSeed.cs`
- [x] T004 [P] Extend `AuditLog` entity with `IpAddress`, `UserAgent`, and `ActionCategory` in `src/backend/Mojaz.Domain/Entities/AuditLog.cs`
- [x] T005 Update `MojazDbContext` to include the new `AuditLog` columns in `src/backend/Mojaz.Infrastructure/Persistence/MojazDbContext.cs`
- [x] T006 [P] Create `SecurityConstants` for common header values and rate limit keys in `src/backend/Mojaz.Shared/Constants/SecurityConstants.cs`

## Phase 3: [US1] API Security Audit (P1)

- [x] T007 [US1] Implement `SecurityHeadersMiddleware` to inject nosniff, DENY, and HSTS headers in `src/backend/Mojaz.Infrastructure/Security/Middleware/SecurityHeadersMiddleware.cs`
- [x] T008 [US1] Register `SecurityHeadersMiddleware` in `src/backend/Mojaz.API/Program.cs`
- [x] T009 [US1] Configure CORS policy to restrict origins in `src/backend/Mojaz.API/Program.cs`
- [x] T010 [US1] Implement `PartitionedRateLimiter` policy that reads from `SystemSettings` in `src/backend/Mojaz.Infrastructure/Security/RateLimiting/RateLimitingSetup.cs`
- [x] T011 [US1] Apply `[EnableRateLimiting]` to Auth and Data controllers in `src/backend/Mojaz.API/Controllers/`

## Phase 4: [US2] Secure Document Upload (P1)

- [x] T012 [P] [US2] Create `IFileValidationService` for MIME signature checking in `src/backend/Mojaz.Application/Interfaces/Security/IFileValidationService.cs`
- [x] T013 [US2] Implement `FileValidationService` using `FileSignatures` library in `src/backend/Mojaz.Infrastructure/Security/Services/FileValidationService.cs`
- [x] T014 [US2] Integrate `IFileValidationService` into the existing document upload service in `src/backend/Mojaz.Application/Services/DocumentService.cs`
- [x] T015 [US2] Enforce 5MB request size limit globally in `src/backend/Mojaz.API/Program.cs`

## Phase 5: [US3] Production Error Sanitization (P2)

- [x] T016 [US3] Implement `GlobalExceptionHandler` to return sanitized `ApiResponse<T>` in `src/backend/Mojaz.Infrastructure/Security/Middleware/GlobalExceptionHandler.cs`
- [x] T017 [US3] Register `AddExceptionHandler` and `UseExceptionHandler` in `src/backend/Mojaz.API/Program.cs`
- [x] T018 [US3] Implement `Serilog` log masking for PII (National ID, Phone) in `src/backend/Mojaz.Infrastructure/Logging/LogMaskingEnricher.cs`

## Phase 6: [US4] High-Risk Alerting (P2)

- [x] T019 [US4] Create `ISecurityAlertService` for threshold-based email alerts in `src/backend/Mojaz.Application/Interfaces/Security/ISecurityAlertService.cs`
- [x] T020 [US4] Implement `SecurityAlertService` with Hangfire dispatch in `src/backend/Mojaz.Infrastructure/Security/Services/SecurityAlertService.cs`
- [x] T021 [US4] Create bilingual security alert email template in `src/backend/Mojaz.Infrastructure/Notifications/Templates/SecurityAlert.html`
- [x] T022 [US4] Integrate alerting check into `AuthService` failed login path in `src/backend/Mojaz.Application/Services/AuthService.cs`

## Phase 7: Polish & Cross-Cutting

- [x] T023 Implement `AuditLogCleanupJob` for 90-day retention policy in `src/backend/Mojaz.Infrastructure/Security/Jobs/AuditLogCleanupJob.cs`
- [x] [x] T024 Register Hangfire recurring job for log cleanup in `src/backend/Mojaz.API/Program.cs`
- [x] T025 [P] Implement secure secret loading from Environment Variables in `src/backend/Mojaz.API/Program.cs`

## Dependencies

- Phase 2 (Foundational) must complete before Phase 3-6.
- US1 (Headers/RateLimit) is the highest implementation priority.
- US2 (File Validation) is critical for document-heavy flows.

## Parallel Execution Opportunities

- T003, T004, T006 can be done in parallel (Foundational).
- T012, T013 (US2) can be done in parallel with T007, T010 (US1).
- T018 (Logging) can be done independently of other US phases.

## Implementation Strategy

- **Increment 1 (MVP)**: Phase 1-3. Focus on protecting the API surface with headers and rate limiting.
- **Increment 2**: Phase 4-5. Harden data ingestion (files) and error responses.
- **Increment 3**: Phase 6-7. Implement observability, alerting, and automated cleanup.
