# Tasks: OTP Verification and Resend System

**Input**: Design documents from `/specs/005-otp-verification/`
**Prerequisites**: plan.md ✅ | spec.md ✅
**Branch**: `005-otp-verification`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (independent files, no dependency on incomplete task)
- **[US#]**: Which user story this task belongs to
- All paths are relative to repository root

---

## Phase 1: Setup
**Purpose**: Prepare database tracking and configuration.

- [x] T001 Define `OtpCodes` DB table and ensure migration exists in `src/backend/src/Mojaz.Infrastructure`
- [x] T002 Verify `SystemSettings` contains OTP thresholds (Cooldown, Validity, Max Attempts)
- [x] T003 [P] Create initial migration for `OtpCodes` table using EF Core.
- [x] T004 [P] Seed default values for OTP System Settings into `SystemSettings` table.

---

## Phase 2: Tests
**Purpose**: TDD and verification of OTP logic.

- [x] T013 [P] [US1] Add Unit tests `AuthService_VerifyOtp_Tests` covering success, invalid hashes, expired codes, and max limits.
- [x] T022 [P] [US2] Add Unit tests `AuthService_ResendOtp_Tests` covering cooldown exceptions, hourly limit exceptions, and successful invalidation/generation.

---

## Phase 3: Core
**Purpose**: Implement verification and resend mechanisms.

### Foundational
- [x] T005 [P] Implement/Update `OtpCode` entity in `src/backend/src/Mojaz.Domain/Entities/`
- [x] T006 [P] Ensure `IOtpRepository` and its implementation exists in `src/backend/src/Mojaz.Infrastructure/Persistence/Repositories/`

### US1 — Verify OTP to Activate Account
- [x] T007 [US1] Create `VerifyOtpRequest`, `VerifyOtpRequestValidator`, and `OtpResponseDto` in `src/backend/src/Mojaz.Application/DTOs/Auth/`
- [x] T008 [US1] Implement `IAuthService.VerifyOtpAsync` method signature.
- [x] T009 [US1] Inject `IOtpRepository` into `AuthService`.
- [x] T010 [US1] Add logic to fetch latest `OtpCode` by destination and purpose, check expiration and attempt limits.
- [x] T011 [US1] Implement BCrypt verification against stored hash.
- [x] T012 [US1] Add SUCCESS logic: activate user, update `OtpCode.IsUsed`, and call `IAuditService` to log event.
- [x] T013 [US1] Add FAILURE logic: increment attempt count and optionally invalidate if limit reached.
- [x] T014 [US1] Implement `POST /api/v1/auth/verify-otp` in `src/backend/src/Mojaz.API/Controllers/AuthController.cs` with Swagger XML docs.

### US2 — Resend OTP Code
- [x] T015 [P] [US2] Create `ResendOtpRequest` and validator in `src/backend/src/Mojaz.Application/DTOs/Auth/`
- [x] T016 [US2] Implement `IAuthService.ResendOtpAsync` method signature.
- [x] T017 [US2] Implement cooldown check (last OTP < 60s) using values from `ISystemSettingsService`.
- [x] T018 [US2] Implement hourly max limit check (e.g. 3) by querying `IOtpRepository`.
- [x] T019 [US2] Add logic to invalidate previous unused OTPs for the destination/purpose.
- [x] T020 [US2] Generate, hash (BCrypt), and persist the new `OtpCode`.
- [x] T021 [US2] Enqueue Notification (Email/SMS) dispatch using Hangfire background job.
- [x] T022 [US2] Implement `POST /api/v1/auth/resend-otp` in `src/backend/src/Mojaz.API/Controllers/AuthController.cs` returning masked destination.

---

## Phase 4: Integration
**Purpose**: Wire components and verify end-to-end flows.

- [x] T025 Execute end-to-end testing of registration + verification over localized UI forms.

---

## Phase 5: Polish
**Purpose**: Security audit and documentation.

- [x] T023 [P] Verify `OtpCodes` table does NOT store plain-text values in the database.
- [x] T024 [P] Review `AuthController.cs` to ensure `[ProducesResponseType]` and summaries are complete.
- [x] T026 Update `walkthrough.md` with demonstration of verification rate limits protecting against brute force.
