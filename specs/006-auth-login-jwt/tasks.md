---
description: "Task list template for feature implementation"
---

# Tasks: User Login with JWT Access Token and Refresh Token Rotation

**Input**: Design documents from `/specs/006-auth-login-jwt/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure updating entities

- [x] T001 Update `User` model with locking and attempts fields in `src/Mojaz.Domain/Entities/User.cs`
- [x] T002 Generate entity `RefreshToken` in `src/Mojaz.Domain/Entities/RefreshToken.cs`
- [x] T003 Generate entity `OtpCode` in `src/Mojaz.Domain/Entities/OtpCode.cs`
- [x] T004 [P] Update `src/Mojaz.Infrastructure/Persistence/ApplicationDbContext.cs` to include `RefreshTokens` and `OtpCodes` DbSets and mapping configurations.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Setup database migration for the new Auth tables in `src/Mojaz.Infrastructure`
- [x] T006 [P] Configure JWT extension methods and settings models in `src/Mojaz.Infrastructure/Authentication/JwtAuthenticationExtensions.cs`
- [x] T007 Register JWT policies and configuration in `src/Mojaz.API/Program.cs`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure Login (Priority: P1) 🎯 MVP

**Goal**: As a registered user, I want to securely log in to the Mojaz platform using my email or phone number and password so that I can access my personalized dashboard and services.

**Independent Test**: Can be fully tested by submitting valid and invalid credentials via the API and verifying the correct generation of access tokens, error responses, and audit logging.

### Implementation for User Story 1

- [x] T008 [P] [US1] Create `LoginRequest` DTO in `src/Mojaz.Application/DTOs/Auth/LoginRequest.cs`
- [x] T009 [P] [US1] Create `LoginRequestValidator` in `src/Mojaz.Application/Validators/Auth/LoginRequestValidator.cs`
- [x] T010 [P] [US1] Create `TokenResponse` DTO in `src/Mojaz.Application/DTOs/Auth/TokenResponse.cs`
- [x] T011 [P] [US1] Define `IAuthService` interface in `src/Mojaz.Application/Interfaces/IAuthService.cs`
- [x] T012 [US1] Implement `AuthService` login logic in `src/Mojaz.Infrastructure/Services/AuthService.cs`
- [x] T013 [US1] Add `/api/v1/auth/login` endpoint logic in `src/Mojaz.API/Controllers/AuthController.cs`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Token Refresh & Session Continuation (Priority: P1)

**Goal**: As an active user, I want my session to be extended seamlessly before it expires so that I don't have to log in repeatedly.

**Independent Test**: Can be tested by submitting a valid unexpired refresh token to the refresh endpoint and receiving a new JWT and refresh token pair while the old refresh token is revoked.

### Implementation for User Story 2

- [x] T014 [US2] Create `RefreshTokenRequest` DTO in `src/Mojaz.Application/DTOs/Auth/RefreshTokenRequest.cs`
- [x] T015 [US2] Extend `IAuthService` to include RefreshToken rotation logic
- [x] T016 [US2] Implement RefreshToken logic in `src/Mojaz.Infrastructure/Services/AuthService.cs`
- [x] T017 [US2] Add `/api/v1/auth/refresh-token` endpoint logic in `src/Mojaz.API/Controllers/AuthController.cs`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Password Recovery (Priority: P2)

**Goal**: As a user who forgot their password, I want to securely reset my password using OTP sent to my registered email or phone so that I can regain access.

**Independent Test**: Can be tested by initiating a password reset, generating an OTP, and successfully resetting the password with that OTP, validating the old tokens become revoked.

### Implementation for User Story 3

- [x] T018 [P] [US3] Create `ForgotPasswordRequest` and `ResetPasswordRequest` DTOs in `src/Mojaz.Application/DTOs/Auth`
- [x] T019 [US3] Extend `IAuthService` to include forgot and reset password logic
- [x] T020 [US3] Implement Forgot/Reset logic inside `src/Mojaz.Infrastructure/Services/AuthService.cs`, invalidating tokens as required.
- [x] T021 [US3] Add `/api/v1/auth/forgot-password` and `/api/v1/auth/reset-password` endpoints in `src/Mojaz.API/Controllers/AuthController.cs`

**Checkpoint**: All user stories up to 3 should now be functional

---

## Phase 6: User Story 4 - Secure Logout (Priority: P2)

**Goal**: As an authenticated user, I want to securely log out of my session from all devices.

**Independent Test**: Can be tested by calling the logout endpoint with an active token and ensuring the token is invalidated.

### Implementation for User Story 4

- [x] T022 [P] [US4] Create `LogoutRequest` DTO in `src/Mojaz.Application/DTOs/Auth/LogoutRequest.cs`
- [x] T023 [US4] Extend `IAuthService` and `src/Mojaz.Infrastructure/Services/AuthService.cs` to handle logout.
- [x] T024 [US4] Add `/api/v1/auth/logout` endpoint logic in `src/Mojaz.API/Controllers/AuthController.cs`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T025 [P] Audit logic verification across login, logout, password resets.
- [x] T026 Unit tests for `AuthService` scenarios in `tests/Mojaz.Application.Tests/Services/AuthServiceTests.cs`
- [x] T027 Code cleanup, configuration alignment with SystemSettings, and documentation updates.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Phase 2 completion. Can proceed sequentially.
- **Polish (Final Phase)**: Depends on all user stories completion.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational (Phase 2).
- **User Story 2 (P1)**: Starts after US1 is completed or concurrent.
- **User Story 3 (P2)**: Starts after Foundational.
- **User Story 4 (P2)**: Starts after Foundational.

### Parallel Opportunities

- DTO creation and definitions in US1, US3, US4 can be done in parallel.
- US1, US2, US3, US4 endpoints can be parallelized if services are interfaced in advance.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready
