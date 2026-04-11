# Implementation Plan: Security Review and Production Hardening

**Branch**: `030-security-hardening` | **Date**: 2026-04-11 | **Spec**: [spec.md](file:///C:/Users/ALlahabi/Desktop/cmder/Mojaz/specs/030-security-hardening/spec.md)
**Input**: Feature specification from `/specs/030-security-hardening/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

This feature involves a comprehensive security audit and production hardening of the Mojaz platform. The technical approach focuses on implementing defensive middleware for security headers, rate limiting, and global exception handling, while ensuring strict data validation (MIME/Magic numbers) and secure secret management via environment variables.

## Technical Context

**Language/Version**: C# / ASP.NET Core 8; TypeScript / Next.js 15
**Primary Dependencies**: `Microsoft.AspNetCore.RateLimiting`, `SendGrid`, `Twilio`, `FluentValidation`, `Zod`, `MimeDetective` (or similar for Magic Numbers) [NEEDS CLARIFICATION]
**Storage**: SQL Server 2022 (`AuditLog`, `OtpCodes`, `SystemSettings`, `RefreshTokens` tables)
**Testing**: xUnit, Moq, FluentAssertions; Playwright (E2E)
**Target Platform**: Windows / Cloud Hosting
**Project Type**: Full-Stack Web Application (Clean Architecture)
**Performance Goals**: <50ms added latency from security middleware/interceptors
**Constraints**: Zero plain-text secrets; OWASP Top 10 mitigation; 90-day log retention
**Scale/Scope**: 52+ API Endpoints; 21+ Database Tables

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Clean Architecture Supremacy**: All security middleware and data validation logic will be implemented in `Infrastructure` or `Application` layers. API controllers remain thin.
- **II. Security First (NON-NEGOTIABLE)**: This feature implements Principle II. 100% compliance required for all sub-rules (headers, rate limiting, hashing, etc.).
- **III. Configuration over Hardcoding**: Rate limits (Threshold/Window), retention (90 days), and file size (5MB) will be read from `SystemSettings`.
- **IV. Internationalization by Default**: All security-related error messages will be bilingual using the existing translation system.
- **V. API Contract Consistency**: All security-related errors (401, 403, 429, 500) will be returned in the `ApiResponse<T>` format.
- **VI. Test Discipline**: Unit tests will cover sanitization and validation logic. Playwright will verify security headers and rate limiting.
- **VII. Async-First Notifications**: Security alerts (Email) will be delivered asynchronously via Hangfire.

## Project Structure

### Documentation (this feature)

```text
specs/030-security-hardening/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── Mojaz.Domain/        # (Entities: AuditLog, OtpCodes)
├── Mojaz.Shared/        # (Security Constants, ApiResponse)
├── Mojaz.Application/   # (Validators, Security Services)
├── Mojaz.Infrastructure/# (Middleware, Repositories, Providers)
└── Mojaz.API/           # (Controllers, Program.cs Configuration)

frontend/
├── src/
│   ├── app/             # (Global headers, Secure routes)
│   ├── components/      # (No specific security logic here)
│   ├── lib/             # (api-client interceptors)
│   └── services/        # (auth.service tokens)
```

**Structure Decision**: Selected Option 2 (Web application) as Mojaz is a full-stack Next.js + ASP.NET Core project.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
