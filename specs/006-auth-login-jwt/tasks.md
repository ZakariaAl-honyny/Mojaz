# Tasks: User Login with JWT Access Token and Refresh Token Rotation

**Input**: Design documents from `/specs/006-auth-login-jwt/`
**Prerequisites**: plan.md ✅ | spec.md ✅
**Branch**: `006-auth-login-jwt`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (independent files, no dependency on incomplete task)
- **[US#]**: Which user story this task belongs to
- All paths are relative to repository root

---

## Phase 1: Setup
**Purpose**: Initialize identity models and database structure.

- [x] T001 Update `User` model with locking and attempts fields in `src/backend/src/Mojaz.Domain/Entities/User.cs`
- [x] T002 Generate entity `RefreshToken` in `src/backend/src/Mojaz.Domain/Entities/RefreshToken.cs`
- [x] T003 Generate entity `OtpCode` in `src/backend/src/Mojaz.Domain/Entities/OtpCode.cs`
- [x] T004 [P] Update `src/backend/src/Mojaz.Infrastructure/Persistence/MojazDbContext.cs` to include `RefreshTokens` and `OtpCodes` DbSets and mapping configurations.

---

## Phase 2: Tests
**Purpose**: TDD and verification of auth services.

- [x] T026 [P] Write comprehensive unit tests for `AuthService` scenarios (lockouts, refreshes, forgot password) in `tests/Mojaz.Application.Tests/Services/AuthServiceTests.cs`.

---

## Phase 3: Core
**Purpose**: Implement JWT auth, token rotation, password recovery, and logout.

### Foundational
- [x] T005 Setup database migration for the new Auth tables in `src/backend/src/Mojaz.Infrastructure/Persistence/`
- [x] T006 [P] Configure JWT extension methods and settings models in `src/backend/src/Mojaz.Infrastructure/Authentication/JwtAuthenticationExtensions.cs`
- [x] T007 Register JWT policies and configuration in `src/backend/src/Mojaz.API/Program.cs`

### US1 — Secure Login
- [x] T008 [P] [US1] Create `LoginRequest` DTO in `src/backend/src/Mojaz.Application/DTOs/Auth/LoginRequest.cs`
- [x] T009 [P] [US1] Create `LoginRequestValidator` in `src/backend/src/Mojaz.Application/Validators/Auth/LoginRequestValidator.cs`
- [x] T010 [P] [US1] Create `TokenResponse` DTO in `src/backend/src/Mojaz.Application/DTOs/Auth/TokenResponse.cs`
- [x] T011 [P] [US1] Define `IAuthService` interface in `src/backend/src/Mojaz.Application/Interfaces/IAuthService.cs`
- [x] T012 [US1] Implement `AuthService` login logic in `src/backend/src/Mojaz.Infrastructure/Services/AuthService.cs`
- [x] T013 [US1] Add `/api/v1/auth/login` endpoint logic in `src/backend/src/Mojaz.API/Controllers/AuthController.cs`

### US2 — Token Refresh & Session Continuation
- [x] T014 [US2] Create `RefreshTokenRequest` DTO in `src/backend/src/Mojaz.Application/DTOs/Auth/RefreshTokenRequest.cs`
- [x] T015 [US2] Extend `IAuthService` to include RefreshToken rotation logic
- [x] T016 [US2] Implement RefreshToken logic in `src/backend/src/Mojaz.Infrastructure/Services/AuthService.cs`
- [x] T017 [US2] Add `/api/v1/auth/refresh-token` endpoint logic in `src/backend/src/Mojaz.API/Controllers/AuthController.cs`

### US3 — Password Recovery
- [x] T018 [P] [US3] Create `ForgotPasswordRequest` and `ResetPasswordRequest` DTOs in `src/backend/src/Mojaz.Application/DTOs/Auth/`
- [x] T019 [US3] Extend `IAuthService` to include forgot and reset password logic
- [x] T020 [US3] Implement Forgot/Reset logic inside `src/backend/src/Mojaz.Infrastructure/Services/AuthService.cs`, invalidating tokens as required.
- [x] T021 [US3] Add `/api/v1/auth/forgot-password` and `/api/v1/auth/reset-password` endpoints in `src/backend/src/Mojaz.API/Controllers/AuthController.cs`

### US4 — Secure Logout
- [x] T022 [P] [US4] Create `LogoutRequest` DTO in `src/backend/src/Mojaz.Application/DTOs/Auth/LogoutRequest.cs`
- [x] T023 [US4] Extend `IAuthService` and `src/backend/src/Mojaz.Infrastructure/Services/AuthService.cs` to handle logout.
- [x] T024 [US4] Add `/api/v1/auth/logout` endpoint logic in `src/backend/src/Mojaz.API/Controllers/AuthController.cs`

---

## Phase 4: Integration
**Purpose**: End-to-end verification of the authentication lifecycle.

- [ ] T028 Verify full auth flow: Login → Access protected resource → Token expiry → Token Refresh → Logout.
- [ ] T029 Verify account lockout after 5 failed attempts and subsequent 15-minute block.
- [ ] T030 Verify password reset flow: Forgot Password → OTP Delivery → Reset Password → Token Invalidation.

---

## Phase 5: Polish
**Purpose**: Final audits and cleanup.

- [x] T025 [P] Audit logic verification across login, logout, and password resets in `AuditLog`.
- [x] T027 Code cleanup, configuration alignment with `SystemSettings`, and documentation updates.
