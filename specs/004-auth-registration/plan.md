# Implementation Plan: User Registration via Email and Phone with OTP Verification

**Branch**: `004-auth-registration` | **Date**: 2026-04-06 | **Spec**: specs/004-auth-registration/spec.md
**Input**: Feature specification from `/specs/004-auth-registration/spec.md`

## Summary

Implement a full user registration system supporting both email and phone methods with real OTP verification. The system should properly handle user creation, OTP generation and validation, resend cooldowns, account activation, duplicate prevention, and rate-limiting to prevent abuse.

## Technical Context

**Language/Version**: C# 12 / ASP.NET Core 8 (Backend), TypeScript 5 / Next.js 15 (Frontend)
**Primary Dependencies**: EF Core 8, FluentValidation, BCrypt.Net-Next, SendGrid, Twilio
**Storage**: SQL Server 2022
**Testing**: xUnit, Moq, FluentAssertions
**Target Platform**: Web application (Desktop/Mobile Web)
**Project Type**: Full-stack web application
**Performance Goals**: Registration completion in < 2 minutes; fast API responses (< 200ms)
**Constraints**: Clean Architecture layered access, strict security handling (Bcrypt hashing for passwords and OTPs), strictly defined roles.
**Scale/Scope**: Supports the entire citizen/resident user base for the licensing platform.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Architecture compliance**: Adheres strictly to the 5 layers (Domain → Shared → Application → Infrastructure → API).
- [x] **Security audit**: Passwords and OTPs must be hashed. `SystemSettings` to be used for validation constraints. Rate Limiting enforced.
- [x] **i18n compliance**: Frontend components must use `next-intl` and logical CSS properties.
- [x] **API consistency**: Use `ApiResponse<T>` wrapper for endpoints.
- [x] **Test coverage**: Requires 80%+ coverage using xUnit & Moq.

## Project Structure

### Documentation (this feature)

```text
specs/004-auth-registration/
├── plan.md              # This file
├── research.md          # Output for architecture decisions
├── data-model.md        # DB Entity modeling and contracts definition
├── quickstart.md        # Overview for getting started
└── tasks.md             # Implementation steps
```

### Source Code (repository root)

```text
src/
├── backend/
│   ├── Mojaz.Domain/
│   ├── Mojaz.Shared/
│   ├── Mojaz.Application/
│   ├── Mojaz.Infrastructure/
│   └── Mojaz.API/
└── frontend/
    └── src/
```

**Structure Decision**: Option 2: Web application with separated backend and frontend codebases. Using Next.js (App Router) for frontend and ASP.NET Core for backend.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| None      | N/A        | N/A                                  |
