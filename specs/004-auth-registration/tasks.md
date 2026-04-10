# Tasks: User Registration via Email and Phone with OTP Verification

**Input**: Design documents from `/specs/004-auth-registration/`
**Prerequisites**: plan.md ✅ | spec.md ✅
**Branch**: `004-auth-registration`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (independent files, no dependency on incomplete task)
- **[US#]**: Which user story this task belongs to
- All paths are relative to repository root

---

## Phase 1: Setup
**Purpose**: Initialize structure and configurations.

- [X] T001 Verify project structure matches the documented design in `src/backend/src/Mojaz.API/Program.cs` and `src/frontend/src/app/layout.tsx`.
- [X] T002 Update `src/backend/src/Mojaz.Infrastructure/Persistence/Seeders/SystemSettingsSeed.cs` to ensure all OTP settings are seeded (`OTP_VALIDITY_MINUTES_SMS`, `OTP_VALIDITY_MINUTES_EMAIL`, `OTP_MAX_ATTEMPTS`, `OTP_RESEND_COOLDOWN_SECONDS`, `OTP_MAX_RESEND_PER_HOUR`).

---

## Phase 2: Tests
**Purpose**: TDD and verification of auth logic.

- [X] T015 [P] [US1] Write unit tests for Email Registration logic in `tests/Mojaz.Application.Tests/Services/AuthService_RegisterEmail_Tests.cs`.
- [X] T021 [P] [US2] Write unit tests for Phone Registration in `tests/Mojaz.Application.Tests/Services/AuthService_RegisterPhone_Tests.cs`.
- [X] T025 [P] [US3] Write unit tests for OTP Cooldown rules in `tests/Mojaz.Application.Tests/Services/AuthService_ResendOtp_Tests.cs`.
- [X] T028 [P] [US4] Write unit tests for Duplicate checking in `tests/Mojaz.Application.Tests/Services/AuthService_DuplicateChecks_Tests.cs`.
- [X] T030 [P] [US5] Write integration tests targeting rate limiter behavior in `tests/Mojaz.API.Tests/Auth/Registration_RateLimit_Tests.cs`.

---

## Phase 3: Core
**Purpose**: Implement the registration, verification, and OTP logic.

### Foundational
- [X] T003 Update `User` and `OtpCode` entity configurations in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/UserConfiguration.cs` and `OtpCodeConfiguration.cs`.
- [X] T004 Create `RegistrationRequestDto` and `RegistrationResponseDto` records in `src/backend/src/Mojaz.Application/DTOs/Auth/RegistrationRequestDto.cs`.
- [X] T005 Create `VerificationRequestDto` and `ResendOtpRequestDto` in `src/backend/src/Mojaz.Application/DTOs/Auth/VerificationRequestDto.cs`.
- [X] T006 Implement FluentValidation rules for `RegistrationRequestDto` in `src/backend/src/Mojaz.Application/Validators/Auth/RegistrationRequestValidator.cs`.
- [X] T007 Define `IOtpService` interface in `src/backend/src/Mojaz.Application/Interfaces/Services/IOtpService.cs`.
- [X] T008 Implement `OtpService` logic (generating code, hashing, storing) in `src/backend/src/Mojaz.Infrastructure/Services/OtpService.cs`.

### US1 — Registration via Email
- [X] T009 [US1] Implement `RegisterWithEmailAsync` in `src/backend/src/Mojaz.Application/Services/AuthService.cs` ensuring account creation with `IsActive=false`.
- [X] T010 [P] [US1] Create the POST endpoint `/api/v1/auth/register/email` in `src/backend/src/Mojaz.API/Controllers/AuthController.cs`.
- [X] T011 [US1] Implement OTP verification logic via `VerifyOtpAsync` in `src/backend/src/Mojaz.Application/Services/AuthService.cs` mapping to email addresses.
- [X] T012 [P] [US1] Create POST endpoint `/api/v1/auth/verify-otp` in `src/backend/src/Mojaz.API/Controllers/AuthController.cs`.
- [X] T013 [P] [US1] Develop frontend Email Registration Form component in `src/frontend/src/components/domain/auth/EmailRegistrationForm.tsx`.
- [X] T014 [US1] Integrate API call to `/auth/register/email` and `/auth/verify-otp` in `src/frontend/src/services/auth.service.ts`.

### US2 — Registration via Phone Number
- [X] T016 [US2] Implement `RegisterWithPhoneAsync` in `src/backend/src/Mojaz.Application/Services/AuthService.cs` triggering SMS dispatcher.
- [X] T017 [P] [US2] Create POST endpoint `/api/v1/auth/register/phone` in `src/backend/src/Mojaz.API/Controllers/AuthController.cs`.
- [X] T018 [US2] Update `VerifyOtpAsync` in `AuthService.cs` to support phone numbers.
- [X] T019 [P] [US2] Develop frontend Phone Registration Form component in `src/frontend/src/components/domain/auth/PhoneRegistrationForm.tsx`.
- [X] T020 [US2] Map phone API calls inside `src/frontend/src/services/auth.service.ts`.

### US3 — OTP Resend
- [X] T022 [US3] Implement `ResendOtpAsync` checking cooldown rules and max attempts in `src/backend/src/Mojaz.Application/Services/AuthService.cs`.
- [X] T023 [P] [US3] Create POST endpoint `/api/v1/auth/resend-otp` in `src/backend/src/Mojaz.API/Controllers/AuthController.cs`.
- [X] T024 [P] [US3] Add Resend OTP button logic in the frontend verification screen inside `src/frontend/src/app/[locale]/(public)/register/verify/page.tsx`.

### US4 — Duplicate Account Prevention
- [X] T026 [US4] Update registration methods to check if `Email` or `PhoneNumber` already exists in `src/backend/src/Mojaz.Application/Services/AuthService.cs`.
- [X] T027 [US4] Implement soft-deleted account handling for duplicate checks.

### US5 — Rate Limiting
- [X] T029 [US5] Add `AddRateLimiter` configuration for `/auth/register` endpoints (Max 5/min) in `src/backend/src/Mojaz.API/Program.cs`.

---

## Phase 4: Integration
**Purpose**: Wire frontend to backend and verify asynchronous operations.

- [X] T030 Integrate frontend registration and verification flows end-to-end.
- [X] T032 Validate all background job enqueue mechanisms (Hangfire) for OTP delivery don't block the main API response thread.

---

## Phase 5: Polish
**Purpose**: UI/UX review and security hardening.

- [X] T031 Review frontend UI for all registration scenarios ensuring error states and Arabic/English layouts translate gracefully.
- [X] T033 Fix code review issues (RTL support, fetch OTP validity from SystemSettings, add registration audit logs).
