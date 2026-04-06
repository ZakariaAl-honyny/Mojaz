# Tasks: User Registration via Email and Phone with OTP Verification

## Phase 1: Setup

- [X] T001 Verify project structure matches the documented design in `src/backend/Mojaz.API/Program.cs` and `frontend/src/app/layout.tsx`.
- [X] T002 Update `src/backend/Mojaz.Infrastructure/Configurations/SystemSettingsSeed.cs` to ensure all OTP settings are seeded (`OTP_VALIDITY_MINUTES_SMS`, `OTP_VALIDITY_MINUTES_EMAIL`, `OTP_MAX_ATTEMPTS`, `OTP_RESEND_COOLDOWN_SECONDS`, `OTP_MAX_RESEND_PER_HOUR`).

## Phase 2: Foundational

- [X] T003 Update `User` and `OtpCode` entity configurations (if needed) in `src/backend/Mojaz.Infrastructure/Configurations/UserConfiguration.cs` and `OtpCodeConfiguration.cs`.
- [X] T004 Create `RegistrationRequestDto` and `RegistrationResponseDto` records in `src/backend/Mojaz.Application/DTOs/Auth/RegistrationRequestDto.cs`.
- [X] T005 Create `VerificationRequestDto` and `ResendOtpRequestDto` in `src/backend/Mojaz.Application/DTOs/Auth/VerificationRequestDto.cs`.
- [X] T006 Implement FluentValidation rules for `RegistrationRequestDto` in `src/backend/Mojaz.Application/Validators/Auth/RegistrationRequestValidator.cs`.
- [X] T007 Define `IOtpService` interface to handle OTP generation and hashing in `src/backend/Mojaz.Application/Interfaces/Services/IOtpService.cs`.
- [X] T008 Implement `OtpService` logic (generating code, hashing, storing) in `src/backend/Mojaz.Infrastructure/Services/OtpService.cs`.

## Phase 3: [US1] Registration via Email (Priority: P1)

**Goal:** Allow users to register via Email, sending them a verification OTP via SendGrid.

- [X] T009 [US1] Implement `RegisterWithEmailAsync` in `src/backend/Mojaz.Application/Services/AuthService.cs` ensuring account creation with `IsActive=false`.
- [X] T010 [P] [US1] Create the POST endpoint `/api/v1/auth/register/email` in `src/backend/Mojaz.API/Controllers/AuthController.cs`.
- [X] T011 [US1] Implement OTP verification logic via `VerifyOtpAsync` in `src/backend/Mojaz.Application/Services/AuthService.cs` mapping to email addresses.
- [X] T012 [P] [US1] Create POST endpoint `/api/v1/auth/verify-otp` in `src/backend/Mojaz.API/Controllers/AuthController.cs`.
- [X] T013 [P] [US1] Develop frontend Email Registration Form component in `frontend/src/components/domain/auth/EmailRegistrationForm.tsx`.
- [X] T014 [US1] Integrate API call to `/auth/register/email` and `/auth/verify-otp` in `frontend/src/services/auth.service.ts`.
- [X] T015 [P] [US1] Write unit tests for Email Registration logic in `tests/Mojaz.Application.Tests/Services/AuthService_RegisterEmail_Tests.cs`.

## Phase 4: [US2] Registration via Phone Number (Priority: P2)

**Goal:** Allow users to register using their phone number, delivering SMS OTPs via Twilio.

- [X] T016 [US2] Implement `RegisterWithPhoneAsync` in `src/backend/Mojaz.Application/Services/AuthService.cs` triggering SMS dispatcher.
- [X] T017 [P] [US2] Create POST endpoint `/api/v1/auth/register/phone` in `src/backend/Mojaz.API/Controllers/AuthController.cs`.
- [X] T018 [US2] Update `VerifyOtpAsync` in `AuthService.cs` to gracefully support checking destinations typed as phone numbers.
- [X] T019 [P] [US2] Develop frontend Phone Registration Form component in `frontend/src/components/domain/auth/PhoneRegistrationForm.tsx`.
- [X] T020 [US2] Map phone API calls inside `frontend/src/services/auth.service.ts`.
- [X] T021 [P] [US2] Write unit tests for Phone Registration in `tests/Mojaz.Application.Tests/Services/AuthService_RegisterPhone_Tests.cs`.

## Phase 5: [US3] OTP Resend (Priority: P2)

**Goal:** Allow users to resend OTPs respecting cooldown limits.

- [X] T022 [US3] Implement `ResendOtpAsync` checking cooldown rules and max attempts in `src/backend/Mojaz.Application/Services/AuthService.cs`.
- [X] T023 [P] [US3] Create POST endpoint `/api/v1/auth/resend-otp` in `src/backend/Mojaz.API/Controllers/AuthController.cs`.
- [X] T024 [P] [US3] Add Resend OTP button logic in the frontend verification screen inside `frontend/src/app/[locale]/(public)/register/verify/page.tsx`.
- [X] T025 [P] [US3] Write unit tests for OTP Cooldown rules in `tests/Mojaz.Application.Tests/Services/AuthService_ResendOtp_Tests.cs`.

## Phase 6: [US4] Duplicate Account Prevention (Priority: P1)

**Goal:** Disallow registrations matching an existing email or phone.

- [X] T026 [US4] Update `RegisterWithEmailAsync` and `RegisterWithPhoneAsync` to check if `Email` or `PhoneNumber` already exists across all users in `src/backend/Mojaz.Application/Services/AuthService.cs`.
- [X] T027 [US4] Make sure soft-deleted accounts behave appropriately according to business rules when checking logic.
- [X] T028 [P] [US4] Write unit tests for Duplicate checking in `tests/Mojaz.Application.Tests/Services/AuthService_DuplicateChecks_Tests.cs`.

## Phase 7: [US5] Rate Limiting and Abuse Prevention (Priority: P2)

**Goal:** Ensure registration API resists automated scanning.

- [X] T029 [US5] Add `AddRateLimiter` configuration for `/auth/register` endpoints (Max 5/min) in `src/backend/Mojaz.API/Program.cs` or a specialized extension.
- [X] T030 [P] [US5] Write integration tests targeting rate limiter behavior in `tests/Mojaz.API.Tests/Auth/Registration_RateLimit_Tests.cs`.

## Phase 8: Polish

- [X] T031 Review frontend UI for all registration scenarios ensuring error states and Arabic/English layouts translate gracefully.
- [X] T032 Validate all background job enqueue mechanisms (Hangfire) don't delay the main API response thread.
- [X] T033 Fix code review issues (RTL support PS/Start classes, fetch OTP validity from SystemSettings, add registration audit logs). <!-- id: 33 -->

## Dependencies

- **US1** requires **Foundational**.
- **US2** requires **US1 Verify logic**.
- **US3** requires **US1 & US2**.
- **US4** logically updates base implementations of **US1/US2**.
- **US5** applies cross-cutting API policies usable at the end.

## Parallel Execution Opportunities

- T010, T012, T017, T023 (Controllers) can run in parallel while frontend tasks (T013, T019, T024) are being implemented by another AI/dev.
- Unit Testing tasks (T015, T021, T025, T028) can run independently alongside respective implementation tickets.
