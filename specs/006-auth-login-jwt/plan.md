# Implementation Plan: 006-auth-login-jwt

**Branch**: `006-auth-login-jwt` | **Date**: 2026-04-06 | **Spec**: [specs/006-auth-login-jwt/spec.md](spec.md)
**Input**: Feature specification from `/specs/006-auth-login-jwt/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

The feature introduces a complete authentication login system for the Mojaz platform. It includes JWT access token generation, secure refresh token family rotation, password recovery via OTP, secure logout, and tracking of failed login attempts to prevent brute force attacks by locking out users for 15 minutes. Auth events will be recorded securely in the system's AuditLog.

## Technical Context

**Language/Version**: C# 12 / .NET 8 (Backend), TypeScript 5 / Next.js 15 (Frontend)
**Primary Dependencies**: ASP.NET Core, EF Core 8, JWT Bearer, FluentValidation (Backend), React Query, Zustand (Frontend)
**Storage**: SQL Server 2022
**Testing**: xUnit, Moq, FluentAssertions, Playwright
**Target Platform**: Web (Server/Client)
**Project Type**: Full-Stack Web Application (API + Frontend)
**Performance Goals**: Token refresh logic must perform quickly to ensure seamless UX (e.g. under 200ms p95).
**Constraints**: Clean Architecture layers must be strictly maintained; configuration settings like expiration and tokens must use `SystemSettings`; security guidelines for Bcrypt and JWT are absolute.
**Scale/Scope**: Auth core, impacting all 7 roles of the platform.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Clean Architecture**: Yes. DTOs and Logic will reside in Application layer; Controllers will be thin; Context rules will remain in Infrastructure.
- **Security First**: Yes. Passwords hashed using Bcrypt; refresh tokens rotated securely; all attempts audited in AuditLogs; no sensitive secrets hardcoded.
- **Config over Hardcoding**: Yes. JWT expiries and attempt thresholds will be evaluated against SystemSettings or appsettings constants.
- **Internationalization**: Yes. Returns `ApiResponse<T>` with English/Arabic generic messages depending on active headers/preferences.
- **Test Discipline**: Yes. Application layer features must achieve 80% coverage with xUnit.
- **Async Notifications**: Yes. Password reset OTP sending uses async notification jobs via Hangfire.
- All gates passed perfectly.

## Project Structure

### Documentation (this feature)

```text
specs/006-auth-login-jwt/
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
├── Mojaz.Domain/
│   └── Entities/        # Add RefreshToken, update User model, OtpCode definition.
├── Mojaz.Application/
│   ├── DTOs/Auth/       # LoginRequest, TokenResponse, ForgotPasswordRequest, ResetPasswordRequest
│   └── Services/        # IAuthService, AuthService updates for business logic
├── Mojaz.Infrastructure/
│   ├── Persistence/     # EF Core configs, Migrations for RefreshTokens
│   └── BackgroundJobs/  # Adjustments for password recovery OTP dispatch
└── Mojaz.API/
    └── Controllers/     # AuthController endpoints implementation

tests/
├── Mojaz.Domain.Tests/
├── Mojaz.Application.Tests/ # Mock Auth cases (lockouts, refreshes)
└── Mojaz.API.Tests/
```

**Structure Decision**: The project adopts the established Clean Architecture structure of the Mojaz platform. Domain entity changes, business logic application services, EF core infrastructure persistence integrations, and API controller presentation are neatly aligned.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*(No violations. Core mechanics like token rotation conform to rigorous security architectures).*
