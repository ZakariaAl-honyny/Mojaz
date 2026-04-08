---
description: "Task list for Feature 012 — Application CRUD & Status Tracking"
---

# Tasks: Application Creation, Management & Status Tracking (Feature 012)

**Input**: Design documents from `/specs/012-application-crud/`  
**Branch**: `012-application-crud`  
**Tech Stack**: C# 12 / .NET 8 · ASP.NET Core 8 · EF Core 8 · FluentValidation 11 · AutoMapper 13 · Hangfire 1.8 · xUnit + Moq + FluentAssertions

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency conflicts)
- **[Story]**: Which user story this task belongs to ([US1]–[US6])
- Paths relative to `src/backend/` unless stated otherwise

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Domain enum additions and entity fixes that every subsequent task depends on. Must be done atomically before any user story begins.

- [x] T001 Add `DocumentReview`, `Training`, and `Expired` to `ApplicationStatus` enum in `Mojaz.Domain/Enums/ApplicationStatus.cs`
- [x] T002 Fix `Application` entity: set default `Status = ApplicationStatus.Draft`, add `StatusHistory` navigation property `ICollection<ApplicationStatusHistory>` in `Mojaz.Domain/Entities/Application.cs`
- [x] T003 Add stage-name constants for role-scoped filtering in `Mojaz.Shared/Constants/ApplicationStages.cs` (e.g., `DocumentReview = "DocumentReview"`, `MedicalExam = "MedicalExam"`, `Testing = "Testing"`)

**Checkpoint**: Enum values compile; `Application.Status` defaults to `Draft`; stage constants accessible from Application layer.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: New DTOs, updated interface, and AutoMapper profile that ALL user story implementations depend on.

⚠️ **CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Add `ApplicationFilterRequest` DTO class in `Mojaz.Application/DTOs/Application/ApplicationFilterRequest.cs` with properties: `Status?`, `CurrentStage?`, `ServiceType?`, `LicenseCategoryId?`, `BranchId?`, `Search?`, `From?`, `To?`, `SortBy` (default `"createdAt"`), `SortDir` (default `"desc"`), `Page` (default 1), `PageSize` (default 20)
- [x] T005 [P] Add `EligibilityCheckRequest` and `EligibilityCheckResult` classes in `Mojaz.Application/DTOs/Application/EligibilityDtos.cs` — `EligibilityCheckResult` has `bool IsEligible` and `List<string> Reasons`
- [x] T006 [P] Add `UpdateDraftRequest` class in `Mojaz.Application/DTOs/Application/ApplicationDtos.cs` — all nullable fields (`ServiceType?`, `LicenseCategoryId?`, `BranchId?`, `PreferredLanguage?`, `SpecialNeeds?`) for partial draft updates
- [x] T007 [P] Add `SubmitApplicationRequest` class in `Mojaz.Application/DTOs/Application/ApplicationDtos.cs` — single field `bool DataAccuracyConfirmed`
- [x] T008 Update `ApplicationDto` in `Mojaz.Application/DTOs/Application/ApplicationDtos.cs` — add missing fields: `SubmittedAt`, `CancelledAt`, `CancellationReason`, `RejectionReason`, `ApplicantId`, `ApplicantName`, `LicenseCategoryCode`, `UpdatedAt`
- [x] T009 Update `ApplicationTimelineDto` in `Mojaz.Application/DTOs/Application/ApplicationDtos.cs` — replace current shape with: `Id`, `FromStatus`, `ToStatus`, `Notes`, `ChangedByUserId`, `ChangedByName`, `ChangedAt`
- [x] T010 Update `IApplicationService` interface in `Mojaz.Application/Interfaces/Services/IApplicationService.cs` — add `SubmitAsync`, `UpdateDraftAsync`, `GetTimelineAsync`, `CheckEligibilityAsync`; update `GetListAsync` signature to accept `ApplicationFilterRequest`
- [x] T011 Update `ApplicationProfile` AutoMapper mapping in `Mojaz.Application/Mappings/ApplicationProfile.cs` — map all new `ApplicationDto` fields including navigation properties (`Applicant.FullName → ApplicantName`, `LicenseCategory.Code → LicenseCategoryCode`)

**Checkpoint**: Project compiles; `IApplicationService` interface is complete; all DTOs are defined; AutoMapper profile maps without runtime errors.

---

## Phase 3: User Story 1 — Applicant Creates a Draft Application (Priority: P1) 🎯 MVP

**Goal**: Gate 1 validation + Draft creation flow. Applicant POSTs to create an application that starts in `Draft` status. Gate 1 blocks ineligible applicants before any record is written.

**Independent Test**: POST `/api/v1/applications` with a valid payload → response is `201` with `status: "Draft"` and `applicationNumber` matching `MOJ-{YEAR}-{8digits}`. POST again → Gate 1 blocks with `400`. POST with age < minimum → Gate 1 blocks.

### Implementation for User Story 1

- [x] T012 [US1] Extract Gate 1 validation into `CheckEligibilityAsync(Guid userId, EligibilityCheckRequest request)` in `Mojaz.Application/Services/ApplicationService.cs` — check: (1) applicant profile has `NationalId` + `DateOfBirth`, (2) age ≥ `MIN_AGE_CATEGORY_{code}` from `SystemSettings`, (3) no non-terminal active application exists, (4) no security block (`User.IsSecurityBlocked` flag)
- [x] T013 [US1] Add retry loop (max 5 attempts) to `GenerateApplicationNumber()` in `Mojaz.Application/Services/ApplicationService.cs` — query DB for uniqueness on each attempt; throw `InvalidOperationException` with Serilog `LogError` after 5 failures
- [x] T014 [US1] Fix `CreateAsync` in `Mojaz.Application/Services/ApplicationService.cs` — change initial `Status` from `Submitted` to `Draft`; call `CheckEligibilityAsync` at the top; load `APPLICATION_VALIDITY_MONTHS` setting key (current code uses wrong key `APPLICATION_VALIDITY_MONTH_COUNT`); write `ApplicationStatusHistory` record for Draft creation
- [x] T015 [US1] Add `GET /api/v1/applications/eligibility` endpoint to `Mojaz.API/Controllers/ApplicationsController.cs` — `[HttpGet("eligibility")]`, `[Authorize(Roles = "Applicant")]`, calls `CheckEligibilityAsync`, returns `ApiResponse<EligibilityCheckResult>` with `[ProducesResponseType]` for 200
- [x] T016 [US1] Add `CreateApplicationValidator` in `Mojaz.Application/Validators/Application/CreateApplicationValidator.cs` — validate `ServiceType` is valid enum, `LicenseCategoryId` is non-empty Guid, `NationalId` non-empty string, `DateOfBirth` not default, `Gender` non-empty, `Nationality` non-empty

**Checkpoint**: Gate 1 blocks underage, duplicate-application, and security-blocked applicants. Successful POST returns `201` with `status: "Draft"` and a correctly-formatted `applicationNumber`. Eligibility endpoint returns meaningful `reasons` when ineligible.

---

## Phase 4: User Story 2 — Applicant Updates Draft and Submits (Priority: P1)

**Goal**: Draft update (partial, no validation) + Submit (full FluentValidation + second Gate 1 check + `Submitted` status + notification + AuditLog).

**Independent Test**: PUT draft with partial data → 200, status stays `Draft`. PATCH submit with all required fields → 200, `status: "Submitted"`, AuditLog entry written, in-app notification created. PATCH submit with missing field → 400 with field-level errors.

### Implementation for User Story 2

- [x] T017 [US2] Implement `UpdateDraftAsync(Guid id, UpdateDraftRequest request, Guid userId)` in `Mojaz.Application/Services/ApplicationService.cs` — verify application is in `Draft` status and `ApplicantId == userId`; update only non-null fields; write AuditLog entry; return updated `ApplicationDto`
- [x] T018 [US2] Add `UpdateDraftValidator` in `Mojaz.Application/Validators/Application/UpdateDraftValidator.cs` — lenient validation: all fields optional, but `LicenseCategoryId` must be valid Guid when provided, `PageSize` capped at 100
- [x] T019 [US2] Implement `SubmitAsync(Guid id, SubmitApplicationRequest request, Guid userId)` in `Mojaz.Application/Services/ApplicationService.cs` — (1) verify ownership and Draft status, (2) re-run `CheckEligibilityAsync`, (3) run `SubmitApplicationValidator`, (4) set `Status = Submitted`, `SubmittedAt = DateTime.UtcNow`, (5) write `ApplicationStatusHistory` record, (6) write AuditLog entry, (7) create in-app notification synchronously, (8) enqueue Hangfire job for email dispatch
- [x] T020 [US2] Add `SubmitApplicationValidator` in `Mojaz.Application/Validators/Application/SubmitApplicationValidator.cs` — enforce: `ServiceType` non-default, `LicenseCategoryId` non-empty Guid, user's `NationalId` non-empty (query user), user's `DateOfBirth` non-default, user's `Gender` non-empty, user's `Nationality` non-empty, `DataAccuracyConfirmed == true`
- [x] T021 [US2] Add `PUT /api/v1/applications/{id}/draft` endpoint to `Mojaz.API/Controllers/ApplicationsController.cs` — `[HttpPut("{id}/draft")]`, `[Authorize(Roles = "Applicant")]`, calls `UpdateDraftAsync`, returns `ApiResponse<ApplicationDto>` with `[ProducesResponseType]` for 200, 400, 403
- [x] T022 [US2] Add `PATCH /api/v1/applications/{id}/submit` endpoint to `Mojaz.API/Controllers/ApplicationsController.cs` — `[HttpPatch("{id}/submit")]`, `[Authorize(Roles = "Applicant,Receptionist")]`, calls `SubmitAsync`, returns `ApiResponse<ApplicationDto>` with `[ProducesResponseType]` for 200, 400, 403
- [x] T023 [US2] Remove or update existing `PUT /api/v1/applications/{id}` endpoint in `Mojaz.API/Controllers/ApplicationsController.cs` — route `{id}` now conflicts with `{id}/draft`; update route attribute or remove the generic PUT in favour of the new draft-specific route

**Checkpoint**: Full Draft → Submitted transition works end-to-end. Submission with missing `DataAccuracyConfirmed = false` returns 400. `ApplicationStatusHistory` has records for both creation and submission events. In-app notification row exists in DB after submit.

---

## Phase 5: User Story 3 — Employee Views Role-Scoped Applications (Priority: P1)

**Goal**: `GET /api/v1/applications` returns the correct role-filtered, paginated, and sorted subset for all 6 applicable roles (Applicant, Receptionist, Doctor, Examiner, Manager, Admin).

**Independent Test**: Authenticate as Receptionist → GET /applications → returns only `DocumentReview`-stage apps. Authenticate as Doctor → returns only `MedicalExam`-stage apps. Authenticate as Manager → returns all apps. Filter `?status=Submitted&sortBy=createdAt&sortDir=asc&page=1&pageSize=5` applied on top of role scope.

### Implementation for User Story 3

- [x] T024 [US3] Update `GetListAsync(Guid userId, string role, ApplicationFilterRequest filters)` in `Mojaz.Application/Services/ApplicationService.cs` — build role-scoped predicate: `Applicant → ApplicantId == userId`; `Receptionist → CurrentStage == ApplicationStages.DocumentReview`; `Doctor → CurrentStage == ApplicationStages.MedicalExam`; `Examiner → CurrentStage == ApplicationStages.Testing`; `Manager/Admin → no stage filter`
- [x] T025 [US3] Add filter composition to `GetListAsync` in `Mojaz.Application/Services/ApplicationService.cs` — chain predicates for all `ApplicationFilterRequest` fields: `Status`, `CurrentStage`, `ServiceType`, `LicenseCategoryId`, `BranchId`, date range (`From`/`To` on `CreatedAt`), full-text `Search` (matches `ApplicationNumber` OR `Applicant.FullName` via `User.FullName` join)
- [x] T026 [US3] Add dynamic sorting to `GetListAsync` in `Mojaz.Application/Services/ApplicationService.cs` — switch on `filters.SortBy` to apply `OrderBy`/`OrderByDescending` on `CreatedAt`, `ApplicationNumber`, `Status`; default to `CreatedAt desc`; apply `Skip`/`Take` for pagination; populate full `PagedResult<ApplicationDto>` with `TotalPages`, `HasPreviousPage`, `HasNextPage`
- [x] T027 [US3] Update `GET /api/v1/applications` controller action in `Mojaz.API/Controllers/ApplicationsController.cs` — change `GetListAsync([FromQuery] int page, [FromQuery] int pageSize)` to `GetListAsync([FromQuery] ApplicationFilterRequest filters)` — pass full filter object to service; return `ApiResponse<PagedResult<ApplicationDto>>`

**Checkpoint**: All 5 employee role scopes return the correct subset. All 8 filter parameters work individually and in combination. `totalPages`, `hasPreviousPage`, `hasNextPage` fields are correct in the response. Applicant can only see own applications.

---

## Phase 6: User Story 4 — Applicant Cancels an Application (Priority: P2)

**Goal**: `PATCH /applications/{id}/cancel` records reason, transitions to `Cancelled`, writes history and audit, and fires notification. Terminal-state guard prevents cancelling already-cancelled/expired/issued apps.

**Independent Test**: PATCH cancel with reason → 200, `Status: "Cancelled"`, `CancelledAt` non-null, `CancellationReason` matches input. PATCH cancel again → 400 ("terminal state"). Applicant cancelling another applicant's app → 403.

### Implementation for User Story 4

- [x] T028 [US4] Update `CancelAsync(Guid id, string reason, Guid userId)` in `Mojaz.Application/Services/ApplicationService.cs` — add terminal-state guard (block if status is `Cancelled`, `Expired`, `Issued`, `Active`, or `Rejected`); also allow Manager/Admin role to cancel regardless of ownership (pass `role` param); write `ApplicationStatusHistory` record with reason in `Notes`; write AuditLog entry; create in-app notification synchronously; enqueue Hangfire Push notification job
- [x] T029 [US4] Update `PATCH /api/v1/applications/{id}/cancel` controller action in `Mojaz.API/Controllers/ApplicationsController.cs` — change `[FromQuery] string reason` to `[FromBody] CancelApplicationRequest request` where `CancelApplicationRequest` has `string Reason`; add `[Authorize(Roles = "Applicant,Receptionist,Manager")]`; pass `userId` and `role` claim to service; return `ApiResponse<bool>`
- [x] T030 [US4] Add `CancelApplicationRequest` class in `Mojaz.Application/DTOs/Application/ApplicationDtos.cs` — single required property `string Reason` with FluentValidation `NotEmpty` rule; add `CancelApplicationValidator` in `Mojaz.Application/Validators/Application/CancelApplicationValidator.cs`

**Checkpoint**: Cancellation with valid reason writes 3 records: Application update, `ApplicationStatusHistory`, and `AuditLog`. In-app notification row exists. Attempting to cancel a `Cancelled` application returns `400`. Applicant cancelling another person's app returns `403`.

---

## Phase 7: User Story 5 — Application Timeline Tracking (Priority: P2)

**Goal**: `GET /api/v1/applications/{id}/timeline` returns all `ApplicationStatusHistory` records in chronological order with actor name resolved.

**Independent Test**: After a Draft → Submit → Cancel flow, GET timeline returns exactly 3 records in `changedAt` ascending order. Each record has `fromStatus`, `toStatus`, `changedAt`, `changedByName` (not empty). Applicant accessing another applicant's timeline → 403.

### Implementation for User Story 5

- [x] T031 [US5] Verify `ApplicationStatusHistory` DbSet and EF configuration exist in `Mojaz.Infrastructure/Persistence/MojazDbContext.cs` — if missing, add `DbSet<ApplicationStatusHistory> ApplicationStatusHistories` and configure relationship in `OnModelCreating` (FK to `Applications`, no cascade delete)
- [x] T032 [US5] Add `IRepository<ApplicationStatusHistory>` injection to `ApplicationService` constructor in `Mojaz.Application/Services/ApplicationService.cs` and update DI registration in `Mojaz.Application/ApplicationServiceRegistration.cs`
- [x] T033 [US5] Implement `GetTimelineAsync(Guid id, Guid userId, string role)` in `Mojaz.Application/Services/ApplicationService.cs` — verify application exists; enforce ownership (Applicant → must own; others → role-scoped as per FR-007); query `ApplicationStatusHistory` where `ApplicationId == id` ordered by `ChangedAt ASC`; resolve `ChangedBy` (UserId) to `FullName` via user repository lookup; map to `List<ApplicationTimelineDto>`; return in `ApiResponse<List<ApplicationTimelineDto>>`
- [x] T034 [US5] Add `GET /api/v1/applications/{id}/timeline` endpoint to `Mojaz.API/Controllers/ApplicationsController.cs` — `[HttpGet("{id}/timeline")]`, `[Authorize]`, passes `userId` + `role` claims to service, returns `ApiResponse<List<ApplicationTimelineDto>>` with `[ProducesResponseType]` for 200, 403, 404

**Checkpoint**: After the Draft→Submit→Cancel test sequence, GET timeline returns 3 entries ordered by `changedAt`. `changedByName` is not empty/null. Applicant cannot access another applicant's timeline (403).

---

## Phase 8: User Story 6 — Expired Applications Auto-Closed by Background Job (Priority: P3)

**Goal**: Hangfire recurring job (daily 02:00 UTC) finds all non-terminal apps past `ExpiresAt` and transitions them to `Expired`, writing history and audit per app.

**Independent Test**: Seed an application with `ExpiresAt = DateTime.UtcNow.AddDays(-1)` and non-terminal status. Trigger the job manually via Hangfire dashboard or test invoke. Application status becomes `Expired`. `ApplicationStatusHistory` has a new entry. `AuditLog` has a new entry. Job runs again → idempotent, no double-processing.

### Implementation for User Story 6

- [x] T035 [US6] Create `ProcessExpiredApplicationsJob` class in `Mojaz.Infrastructure/Jobs/ProcessExpiredApplicationsJob.cs` — inject `IRepository<Application>`, `IRepository<ApplicationStatusHistory>`, `IAuditService`, `IUnitOfWork`; implement `ExecuteAsync()`: query applications where `ExpiresAt < DateTime.UtcNow` AND `Status NOT IN (Cancelled, Rejected, Expired, Issued, Active)`; for each: set `Status = Expired`, add `ApplicationStatusHistory` record (`FromStatus`, `ToStatus = Expired`, `ChangedBy = Guid.Empty` system actor, `Notes = "Auto-expired by system"`), call `IAuditService.LogAsync`; call `SaveChangesAsync` per batch or per record; log count via Serilog `LogInformation`
- [x] T036 [US6] Register `ProcessExpiredApplicationsJob` in `Mojaz.Infrastructure/InfrastructureServiceRegistration.cs` — add `services.AddScoped<ProcessExpiredApplicationsJob>()`; after `app.UseHangfireDashboard()` in `Program.cs` or in a startup extension, call `RecurringJob.AddOrUpdate<ProcessExpiredApplicationsJob>("expire-applications", j => j.ExecuteAsync(), Cron.Daily(2))` (2 AM UTC)
- [x] T037 [US6] Add `IRecurringJobSetup` abstraction or inline Hangfire registration call in `Mojaz.API/Extensions/HangfireExtensions.cs` (create if not exists) to isolate job registration from `Program.cs` — call `HangfireExtensions.RegisterRecurringJobs(app)` from `Program.cs`

**Checkpoint**: Job is visible in Hangfire dashboard. Manually triggering the job transitions all expired non-terminal applications to `Expired` status. Re-running the job does not double-process (status is already `Expired`, which is in the exclusion list). `AuditLog` has one entry per processed application.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Unit tests, Swagger documentation, EF config verification, and final integration smoke test.

- [X] T038 [P] Write unit tests for `CreateAsync` and `CheckEligibilityAsync` (Gate 1 branches) in `tests/Mojaz.Application.Tests/Services/ApplicationServiceTests.cs` — cover: valid create → Draft; underage → returns 400; active app exists → returns 400; security block → returns 400; app number retry logic (mock unique check)
- [X] T039 [P] Write unit tests for `SubmitAsync` in `tests/Mojaz.Application.Tests/Services/ApplicationServiceTests.cs` — cover: happy path → Submitted; not-owner → 403; not-Draft → 400; missing required field → 400 validation error
- [X] T040 [P] Write unit tests for `GetListAsync` role-scoped filtering in `tests/Mojaz.Application.Tests/Services/ApplicationServiceTests.cs` — cover each role returning correct predicate: Applicant own-only, Receptionist DocumentReview, Doctor MedicalExam, Examiner Testing, Manager all
- [X] T041 [P] Write unit tests for `CancelAsync` in `tests/Mojaz.Application.Tests/Services/ApplicationServiceTests.cs` — cover: valid cancel → Cancelled + history record; terminal state guard → 400; wrong owner → 403
- [x] T042 [P] Write unit tests for `ProcessExpiredApplicationsJob.ExecuteAsync` in `tests/Mojaz.Infrastructure.Tests/Jobs/ProcessExpiredApplicationsJobTests.cs` — cover: 0 expired → no writes; 3 expired → 3 status updates; already-expired → skipped (idempotency)
- [X] T043 Verify EF Core relationship configuration for `ApplicationStatusHistory` in `Mojaz.Infrastructure/Data/Configurations/ApplicationConfiguration.cs` — ensure `HasMany(a => a.StatusHistory).WithOne(h => h.Application).HasForeignKey(h => h.ApplicationId).OnDelete(DeleteBehavior.Cascade)` is defined; run `dotnet ef migrations add AddApplicationStatusHistoryRelation` if not already migrated
- [X] T044 Update Swagger XML documentation comments on all new and modified controller actions in `Mojaz.API/Controllers/ApplicationsController.cs` — ensure each `[HttpGet]`/`[HttpPatch]`/`[HttpPut]` action has `<summary>` and `<param>` doc comments
- [ ] T045 Run manual smoke test via Swagger UI against local environment — verify all 8 endpoints return correct `ApiResponse<T>` shape; verify `eligibility` endpoint returns `isEligible: false` with reason for underage scenario; verify `timeline` returns chronological entries

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)        → No dependencies — start immediately
Phase 2 (Foundational) → Requires Phase 1 complete (enum values used in DTOs)
Phase 3–8 (US1–US6)   → ALL require Phase 2 complete (interface + DTOs)
Phase 9 (Polish)       → Requires Phase 3–8 complete (tests cover all implementations)
```

### User Story Dependencies

| Story | Phase | Depends On | Can Parallel With |
|-------|-------|------------|-------------------|
| US1 — Draft Creation | 3 | Phase 1 + 2 | US3 (different methods) |
| US2 — Submit | 4 | Phase 3 (US1 must exist to submit) | — |
| US3 — Role-Scoped List | 5 | Phase 1 + 2 | US1 (different methods) |
| US4 — Cancellation | 6 | Phase 2 | US3 (different methods) |
| US5 — Timeline | 7 | Phase 3 (needs history records from US1) | US4 |
| US6 — Expiry Job | 8 | Phase 1 (enum `Expired` needed) | US4, US5 |

### Within Each User Story

- Entity/DTO changes before service implementation
- Service implementation before controller endpoint
- All service methods before writing unit tests (Phase 9)

### Parallel Opportunities

- **Phase 2**: T004, T005, T006, T007 can all run in parallel (different files)
- **Phase 3 + Phase 5**: T012–T016 and T024–T027 can run in parallel (different `ApplicationService` methods, no shared state)
- **Phase 4 + Phase 6**: T028–T030 and T031–T034 can run in parallel (cancel vs timeline)
- **Phase 9 tests**: T038–T042 are all independent test files — fully parallel

---

## Parallel Execution Example: Phase 2

```
Parallel batch — all targeting different files:
  T004  → ApplicationFilterRequest.cs         (new file)
  T005  → EligibilityDtos.cs                  (new file)
  T006  → ApplicationDtos.cs (UpdateDraftRequest)
  T007  → ApplicationDtos.cs (SubmitApplicationRequest)  ← coordinate with T006
→ T008  → ApplicationDtos.cs (ApplicationDto update)    ← after T006+T007
→ T009  → ApplicationDtos.cs (ApplicationTimelineDto)   ← after T008
→ T010  → IApplicationService.cs              (after all DTOs done)
→ T011  → ApplicationProfile.cs               (after T010)
```

## Parallel Execution Example: Phase 3 + Phase 5

```
# These can run simultaneously (different methods in ApplicationService.cs):
Dev A: T012 CheckEligibilityAsync
Dev B: T024 GetListAsync role predicates

# Then:
Dev A: T013 GenerateApplicationNumber retry
Dev B: T025 GetListAsync filter composition

# Then in sequence for each dev:
Dev A: T014 → T015 → T016
Dev B: T026 → T027
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 → Draft/Submit Core)

1. Complete **Phase 1** (Setup — enum + entity fixes)
2. Complete **Phase 2** (Foundational — DTOs + interface)
3. Complete **Phase 3** (US1 — Gate 1 + Draft creation)
4. Complete **Phase 4** (US2 — Update Draft + Submit)
5. **STOP and VALIDATE**: Full Draft → Submit flow working via Swagger
6. Application creation wizard is functional end-to-end

### Incremental Delivery

| Sprint | Phases | Deliverable |
|--------|--------|-------------|
| 1 | 1 + 2 + 3 + 4 | Draft create + submit — wizard works end-to-end |
| 2 | 5 | Employee role-scoped list with full filtering |
| 3 | 6 + 7 | Cancel + Timeline — applicant self-service |
| 4 | 8 + 9 | Expiry job + Polish + Tests |

---

## Notes

- **[P]** tasks target different files with no write conflicts — safe to run in parallel
- **[Story]** label maps each task to its user story for traceability
- Stage name constants (T003) MUST use the same values set in `CurrentStage` by the workflow service — verify with `ApplicationWorkflowService.cs` before writing filter predicates in T024
- The `ApplicationService.cs` constructor must be updated as new injected dependencies are added (T032 injects `IRepository<ApplicationStatusHistory>`)
- `DateTime.UtcNow` is mandatory everywhere — never `DateTime.Now` (Constitution Principle III)
- Soft Delete (`IsDeleted = true`) — never `_repository.Remove()` (Constitution Principle III)
- All API responses MUST use `ApiResponse<T>` — no bare `Ok(data)` returns (Constitution Principle V)
- Commit after each phase checkpoint before starting the next
