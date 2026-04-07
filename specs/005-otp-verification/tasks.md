---
description: "Task list for OTP Verification and Resend System"
---

# Tasks: OTP Verification and Resend System

**Input**: Design documents from `/specs/005-otp-verification/`

## Phase 1: Setup
**Purpose**: Prepare database tracking and configuration.
- [x] T001 Define `OtpCodes` DB table and ensure migration exists in `Mojaz.Infrastructure`
- [x] T002 Verify `SystemSettings` contains OTP thresholds (Cooldown, Validity, Max Attempts)
- [x] T002.1 Create initial migration for `OtpCodes` table using EF Core:
    ```bash
    dotnet ef migrations add AddOtpCodesTable --project src/backend/Mojaz.Infrastructure --startup-project src/backend/Mojaz.API
    ```
    > **Note**: Ensure the database is updated with `dotnet ef database update` after migration creation.
- [x] T002.2 Seed default values for OTP System Settings (Cooldown, Validity, Max Attempts) into `SystemSettings` table.
    ```bash
    dotnet ef migrations add SeedOtpSystemSettings --project src/backend/Mojaz.Infrastructure --startup-project src/backend/Mojaz.API
    dotnet ef database update --project src/backend/Mojaz.Infrastructure --startup-project src/backend/Mojaz.API
    ```

## Phase 2: Foundational (Blocking Prerequisites)
**Purpose**: Core mechanisms needed by all OTP flows.
- [x] T003 [P] Implement/Update `OtpCode` entity in `Mojaz.Domain/Entities`
- [x] T004 [P] Ensure `IOtpRepository` and its implementation exists in `Mojaz.Infrastructure/Repositories`

---

## Phase 3: User Story 1 - Verify OTP (Priority: P1) 🎯 MVP

**Goal**: Enable users to verify their account by submitting destination and code.

**Independent Test**: Can be tested via POST `/api/v1/auth/verify-otp` to activate a newly registered account.

### Implementation for User Story 1

- [x] T005 [US1] Create `VerifyOtpRequest`, `VerifyOtpRequestValidator`, and `OtpResponseDto` in `Mojaz.Application/DTOs/Auth`
- [x] T006 [US1] Implement `IAuthService.VerifyOtpAsync` method signature.
- [x] T007 [US1] Inject `IOtpRepository` into `AuthService` (if not already present).
- [x] T008 [US1] Add logic to fetch latest `OtpCode` by destination and purpose, check expiration and attempt limits.
- [x] T009 [US1] Implement BCrypt verification against stored hash.
- [x] T010 [US1] Add SUCCESS logic: activate user, update `OtpCode.IsUsed`, and call `IAuditService` to log event.
- [x] T011 [US1] Add FAILURE logic: increment attempt count and optionally invalidate if limit reached.
- [x] T012 [US1] Implement `POST /api/v1/auth/verify-otp` in `AuthController.cs` with Swagger XML docs.
- [x] T013 [P] [US1] Add Unit tests `AuthService_VerifyOtp_Tests` covering success, invalid hashes, expired codes, and max limits.

---

## Phase 4: User Story 2 - Resend OTP (Priority: P2)

**Goal**: Allow users to request new OTP codes while adhering to rate limits (hourly and cooldown).

**Independent Test**: Can be tested via POST `/api/v1/auth/resend-otp` and observing cooldown/limit restrictions on subsequent requests.

### Implementation for User Story 2

- [x] T014 [P] [US2] Create `ResendOtpRequest` and validator in `Mojaz.Application/DTOs/Auth`.
- [x] T015 [US2] Implement `IAuthService.ResendOtpAsync` method signature.
- [x] T016 [US2] Implement cooldown check (last OTP < 60s) using values from `ISystemSettingsService`.
- [x] T017 [US2] Implement hourly max limit check (e.g. 3) by querying `IOtpRepository`.
- [x] T018 [US2] Add logic to invalidate previous unused OTPs for the destination/purpose.
- [x] T019 [US2] Generate, hash (BCrypt), and persist the new `OtpCode`.
- [x] T020 [US2] Enqueue Notification (Email/SMS) dispatch using Hangfire background job.
- [x] T021 [US2] Implement `POST /api/v1/auth/resend-otp` in `AuthController.cs` returning masked destination.
- [x] T022 [P] [US2] Add Unit tests `AuthService_ResendOtp_Tests` covering cooldown exceptions, hourly limit exceptions, and successful invalidation/generation.

---

## Phase 5: Polish & Security Audit

**Purpose**: Improvements that affect the overarching workflow.

- [x] T023 [P] Verify `OtpCodes` table does NOT store plain-text values in the database.
- [x] T024 [P] Review `AuthController.cs` to ensure `[ProducesResponseType]` and summaries are complete for both endpoints.
- [x] T025 Execute end-to-end testing of registration + verification over localized UI forms.
- [x] T026 Update `walkthrough.md` with demonstration of verification rate limits protecting against brute force.

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 & 2** block all User Stories.
- **Phase 3 (Verify)** and **Phase 4 (Resend)** can theoretically run in parallel once the Foundation is ready.

### Parallel Opportunities
- Entity and DTO creations (`T003`, `T005`, `T014`) can be built simultaneously by different agents.
- Tests (`T013`, `T022`) should be written concurrently with their respective service methods.
