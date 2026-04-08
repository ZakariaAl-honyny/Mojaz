---
description: "Task list template for feature implementation"
---

# Tasks: Feature 011 - RBAC, User Management, and System Settings

**Input**: Design documents from `/specs/011-rbac-user-settings/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story in accordance with Clean Architecture principles.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure bridging. Since it's an existing project, this centers simply on configuring shared infrastructure for this feature.

- [X] T001 Ensure `Microsoft.Extensions.Caching.Memory` is referenced in `Mojaz.Application`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Implement baseline `MojazDbContext` modifications for new tables in `src/Mojaz.Infrastructure/Persistence/MojazDbContext.cs`
- [X] T003 Create `AuditLog` domain entity (JSON payload) in `src/Mojaz.Domain/Entities/AuditLog.cs`
- [X] T004 Implement an EF Core Interceptor to intercept generic admin changes and write to `AuditLogs` in `src/Mojaz.Infrastructure/Persistence/Interceptors/AuditInterceptor.cs`

**Checkpoint**: Database Foundation ready. Entities can now be added to context synchronously.

---

## Phase 3: User Story 1 - Role-Based Authorization Engine (Priority: P1) 🎯 MVP

**Goal**: Implement policy-based routing constraints covering 7 distinct roles across all 8 modules.

**Independent Test**: Can fetch a token containing an `AppRole` claim, and endpoint `[Authorize(Policy = "AdminOnly")]` correctly rejects non-admins with HTTP 403.

### Implementation for User Story 1

- [X] T005 [P] [US1] Create `AppRole` Enum in `src/Mojaz.Domain/Enums/AppRole.cs`
- [X] T006 [P] [US1] Create Role Policy Constants in `src/Mojaz.Shared/Constants/RolePolicies.cs`
- [X] T007 [US1] Update Token Generation to include `role` claims in `src/Mojaz.Infrastructure/Identity/JwtService.cs`
- [X] T008 [US1] Register custom ASP.NET Core Authorization Policies evaluating claims in `src/Mojaz.API/Extensions/AuthorizationExtensions.cs`

**Checkpoint**: At this point, User Story 1 is functional and any endpoint can be protected via `[Authorize(Policy = "...")]`.

---

## Phase 4: User Story 2 - Employee User Management (Priority: P1)

**Goal**: Dedicated admin portal to onboard receptionists, examiners, etc., generate secure temporary passwords, and toggle active states.

**Independent Test**: Admin can create a new 'Manager' profile, and the DB reflects the user with a generated temporary password and `RequiresPasswordReset` = true.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T009 [P] [US2] Unit test for `UserService.CreateUserAsync` in `tests/Mojaz.Application.Tests/Services/UserServiceTests.cs`

### Implementation for User Story 2

- [X] T010 [P] [US2] Update `User` entity adding `RequiresPasswordReset` & `AppRole` properties in `src/Mojaz.Domain/Entities/User.cs`
- [X] T011 [P] [US2] Create User Contracts/DTOs in `src/Mojaz.Application/DTOs/User/UserDtos.cs`
- [X] T012 [P] [US2] Create FluentValidation profiles for DTOs in `src/Mojaz.Application/Validators/User/CreateUserValidator.cs`
- [X] T013 [P] [US2] Implement secure `PasswordGenerator` in `src/Mojaz.Shared/Utilities/PasswordGenerator.cs`
- [X] T014 [US2] Implement `IUserService` and `UserService` in `src/Mojaz.Application/Services/UserService.cs`
- [X] T015 [US2] Implement `UsersController` matching User Management contract in `src/Mojaz.API/Controllers/UsersController.cs`
- [X] T016 [P] [US2] Create Employee List API integration in `frontend/src/services/user.service.ts`
- [X] T017 [US2] Implement Employee List Next.js Page in `frontend/src/app/[locale]/(admin)/users/page.tsx`

**Checkpoint**: User management full stack works independently.

---

## Phase 5: User Story 3 - Business Configuration Interface (Priority: P2)

**Goal**: Admins can dynamically adjust numerical thresholds (e.g., minimum testing ages) and fee structures with instantaneous caching invalidation.

**Independent Test**: Updating `MIN_AGE_CATEGORY_B` immediately invalidates `IMemoryCache` so that the next API call retrieves the updated value.

### Tests for User Story 3

- [ ] T018 [P] [US3] Unit test for Settings Cache Invalidation in `tests/Mojaz.Application.Tests/Services/SystemSettingsServiceTests.cs`

### Implementation for User Story 3

- [X] T019 [P] [US3] Create `SystemSetting` and `FeeStructure` entities in `src/Mojaz.Domain/Entities/SystemSetting.cs` and `FeeStructure.cs`
- [X] T020 [P] [US3] Create update DTOs matching System Settings contract in `src/Mojaz.Application/DTOs/SystemSettings/SystemSettingDtos.cs`
- [X] T021 [US3] Implement `ISystemSettingsService` using `IMemoryCache` in `src/Mojaz.Infrastructure/Services/SystemSettingsService.cs`
- [X] T022 [US3] Implement `SettingsController` in `src/Mojaz.API/Controllers/SettingsController.cs`
- [X] T023 [P] [US3] Create Settings Admin UI in `frontend/src/app/[locale]/(admin)/settings/page.tsx`

**Checkpoint**: Admins can mutate government variables dynamically with cache performance.

---

## Phase 6: User Story 4 - Secure Audit Logging (Priority: P2)

**Goal**: Platform modifications track before/after entity states in flexible JSON schemas transparently.

**Independent Test**: Performing the update from US3 creates a corresponding `AuditLog` row with the JSON difference payload.

### Implementation for User Story 4

- [X] T024 [P] [US4] Create Audit Retrieval DTOs in `src/Mojaz.Application/DTOs/Audit/AuditLogResponse.cs`
- [X] T025 [US4] Implement `IAuditLogService` in `src/Mojaz.Application/Services/AuditLogService.cs`
- [X] T026 [US4] Implement `AuditLogsController` in `src/Mojaz.API/Controllers/AuditLogsController.cs`
- [X] T027 [P] [US4] Create Audit Trial Next.js Page in `frontend/src/app/[locale]/(admin)/audit-logs/page.tsx`
- [X] T028 [P] [US5] Implement `ForcePasswordResetMiddleware` in `src/Mojaz.API/Middleware/ForcePasswordResetMiddleware.cs`
- [X] T029 [US5] Add `ChangePasswordAsync` command to `IAuthService` in `src/Mojaz.Application/Services/AuthService.cs`
- [X] T030 [US5] Expose `POST /api/v1/auth/change-password` in `src/Mojaz.API/Controllers/AuthController.cs`
- [X] T031 [P] [US5] Create Password Recovery / First-time reset UI in `frontend/src/app/[locale]/(public)/reset-password/page.tsx`

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T032 Configure translations for Admin UI components (Arabic/English) in `frontend/public/locales/ar/admin.json`
- [ ] T033 Run Postman / Swagger tests for all new `/api/v1/` routes

---

## Dependencies & Execution Order

- **Setup & Foundation**: T001-T004 must be executed sequentially first.
- **User Story 1 (RBAC Engine)**: T005-T008 can be executed alongside User Story 2.
- **User Story 2 & 3**: Completely independent vertical slices; can be assigned to parallel developers. Backend endpoints must be completed before their respective Next.js components (T017, T023) integrate.
- **User Story 4 & 5**: Need the `AuditLog` mapping from US3 UI and Base Auth from US1/2.
