# Tasks: Feature 011 - RBAC, User Management, and System Settings

**Input**: Design documents from `/specs/011-rbac-user-settings/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup
**Purpose**: Initialize structure, configs, and dependencies

- [X] T001 Ensure `Microsoft.Extensions.Caching.Memory` is referenced in `Mojaz.Application`

---

## Phase 2: Tests
**Purpose**: TDD - write tests for entities, services, and API

- [ ] T002 [P] Unit test for `UserService.CreateUserAsync` in `tests/Mojaz.Application.Tests/Services/UserServiceTests.cs`
- [ ] T003 [P] Unit test for Settings Cache Invalidation in `tests/Mojaz.Application.Tests/Services/SystemSettingsServiceTests.cs`
- [ ] T004 [P] Write unit tests for Audit Log interception logic in `tests/Mojaz.Infrastructure.Tests`
- [ ] T005 [P] Write integration tests for UsersController, SettingsController, and AuditLogsController in `tests/Mojaz.API.Tests`
- [ ] T006 [P] Write unit tests for User Management and Settings UI components in `frontend/tests`

---

## Phase 3: Core
**Purpose**: Implement Domain, Application, Infrastructure, API, and UI

- [X] T007 Implement baseline `MojazDbContext` modifications for new tables in `src/Mojaz.Infrastructure/Persistence/MojazDbContext.cs`
- [X] T008 Create `AuditLog` domain entity (JSON payload) in `src/Mojaz.Domain/Entities/AuditLog.cs`
- [X] T009 Implement an EF Core Interceptor to intercept generic admin changes and write to `AuditLogs` in `src/Mojaz.Infrastructure/Persistence/Interceptors/AuditInterceptor.cs`
- [X] T010 [P] [US1] Create `AppRole` Enum in `src/Mojaz.Domain/Enums/AppRole.cs`
- [X] T011 [P] [US1] Create Role Policy Constants in `src/Mojaz.Shared/Constants/RolePolicies.cs`
- [X] T012 [US1] Update Token Generation to include `role` claims in `src/Mojaz.Infrastructure/Identity/JwtService.cs`
- [X] T013 [US1] Register custom ASP.NET Core Authorization Policies evaluating claims in `src/Mojaz.API/Extensions/AuthorizationExtensions.cs`
- [X] T014 [P] [US2] Update `User` entity adding `RequiresPasswordReset` & `AppRole` properties in `src/Mojaz.Domain/Entities/User.cs`
- [X] T015 [P] [US2] Create User Contracts/DTOs in `src/Mojaz.Application/DTOs/User/UserDtos.cs`
- [X] T016 [P] [US2] Create FluentValidation profiles for DTOs in `src/Mojaz.Application/Validators/User/CreateUserValidator.cs`
- [X] T017 [P] [US2] Implement secure `PasswordGenerator` in `src/Mojaz.Shared/Utilities/PasswordGenerator.cs`
- [X] T018 [US2] Implement `IUserService` and `UserService` in `src/Mojaz.Application/Services/UserService.cs`
- [X] T019 [US2] Implement `UsersController` matching User Management contract in `src/Mojaz.API/Controllers/UsersController.cs`
- [X] T020 [P] [US2] Create Employee List API integration in `frontend/src/services/user.service.ts`
- [X] T021 [US2] Implement Employee List Next.js Page in `frontend/src/app/[locale]/(admin)/users/page.tsx`
- [X] T022 [P] [US3] Create `SystemSetting` and `FeeStructure` entities in `src/Mojaz.Domain/Entities/SystemSetting.cs` and `FeeStructure.cs`
- [X] T023 [P] [US3] Create update DTOs matching System Settings contract in `src/Mojaz.Application/DTOs/SystemSettings/SystemSettingDtos.cs`
- [X] T024 [US3] Implement `ISystemSettingsService` using `IMemoryCache` in `src/Mojaz.Infrastructure/Services/SystemSettingsService.cs`
- [X] T025 [US3] Implement `SettingsController` in `src/Mojaz.API/Controllers/SettingsController.cs`
- [X] T026 [P] [US3] Create Settings Admin UI in `frontend/src/app/[locale]/(admin)/settings/page.tsx`
- [X] T027 [P] [US4] Create Audit Retrieval DTOs in `src/Mojaz.Application/DTOs/Audit/AuditLogResponse.cs`
- [X] T028 [US4] Implement `IAuditLogService` in `src/Mojaz.Application/Services/AuditLogService.cs`
- [X] T029 [US4] Implement `AuditLogsController` in `src/Mojaz.API/Controllers/AuditLogsController.cs`
- [X] T030 [P] [US4] Create Audit Trial Next.js Page in `frontend/src/app/[locale]/(admin)/audit-logs/page.tsx`
- [X] T031 [P] [US5] Implement `ForcePasswordResetMiddleware` in `src/Mojaz.API/Middleware/ForcePasswordResetMiddleware.cs`
- [X] T032 [US5] Add `ChangePasswordAsync` command to `IAuthService` in `src/Mojaz.Application/Services/AuthService.cs`
- [X] T033 [US5] Expose `POST /api/v1/auth/change-password` in `src/Mojaz.API/Controllers/AuthController.cs`
- [X] T034 [P] [US5] Create Password Recovery / First-time reset UI in `frontend/src/app/[locale]/(public)/reset-password/page.tsx`

---

## Phase 4: Integration
**Purpose**: Wire everything together, handle errors, and logging

- [ ] T035 [P] Verify RBAC policy enforcement across all controllers via integration tests
- [ ] T036 [P] Verify AuditLog interception is correctly capturing admin mutations
- [X] T037 Run Postman / Swagger tests for all new `/api/v1/` routes

---

## Phase 5: Polish
**Purpose**: i18n translations, RTL support, Dark Mode, and Final Validation

- [X] T038 Configure translations for Admin UI components (Arabic/English) in `frontend/public/locales/ar/admin.json`
- [ ] T039 Verify RTL support for all Admin pages (Users, Settings, Audit Logs)
- [ ] T040 Verify Dark Mode support for all Admin pages
- [ ] T041 Final end-to-end validation of user onboarding and password reset flow
