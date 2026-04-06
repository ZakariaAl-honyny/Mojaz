# Specification Analysis Report — Backend Solution Scaffold (003)

**Feature**: `003-backend-scaffold`  
**Artifacts Analyzed**: spec.md, plan.md, tasks.md, constitution.md, PRD.md (database schema §21)  
**Date**: 2026-04-04  
**Analysis Mode**: Read-only — no files modified

---

## Findings

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| A1 | Coverage Gap | **CRITICAL** | PRD §21.2 vs plan.md entities | **PRD defines 22 tables — plan.md only lists 21 entities**. The `Applicants` table (PRD §21.2) is a separate entity with `NationalId`, `DateOfBirth`, `Gender`, `Nationality`, `BloodType`, `Address`, `City`, `Region`, `ApplicantType` — one-to-one with `User`. Plan.md folds these fields into `User.cs`, but the PRD explicitly separates them. | Either add an `Applicant.cs` entity (22nd) or document why the PRD `Applicants` table is intentionally merged into `User`. The current "21 entities" claim is inconsistent with PRD §21 which lists 21 + Users = 22 sections. |
| A2 | Coverage Gap | **CRITICAL** | PRD §21.15 vs plan.md/tasks.md | **`PushTokens` table (PRD §21.15) has NO corresponding domain entity**. The PRD defines a `PushTokens` table (UserId, Token, DeviceType, IsActive), but plan.md does not list `PushToken.cs` in the 21 entities, nor does tasks.md include it. | Add `PushToken.cs` entity to Domain or explicitly exclude with documented rationale. |
| A3 | Coverage Gap | **CRITICAL** | PRD §21.20–21.21 vs plan.md/tasks.md | **`EmailLogs` and `SmsLogs` tables (PRD §21.20, §21.21) have NO corresponding domain entities**. These tables track delivery status and provider responses. | Add `EmailLog.cs` and `SmsLog.cs` entities or explicitly exclude with rationale. |
| B1 | Inconsistency | **HIGH** | plan.md:L76–78 vs tasks.md:L24–28, Mojaz.sln | **Path mismatch between plan.md and actual project structure**. Plan.md says `src/Mojaz.Domain/`, but the user has moved everything to `src/backend/src/Mojaz.Domain/`. Tasks.md Phase 1 was partially updated (T002–T006), but Phase 2/3 entity and infrastructure paths still use the old `src/Mojaz.Domain/` convention (T022–T102). | Update ALL paths in tasks.md Phase 2–6 to use `src/backend/src/` prefix. Also update plan.md project structure section. |
| B2 | Inconsistency | **HIGH** | tasks.md:T036 vs PRD §21.1 | **User entity property drift**. Task T036 lists `FullNameAr, FullNameEn` (bilingual split), but PRD §21.1 defines a single `FullName NVARCHAR(200)`. PRD also includes `FailedLoginAttempts`, `IsActive`, `EmailVerifiedAt`, `PhoneVerifiedAt` which are absent from T036. Conversely, T036 includes `Gender`, `Address`, `DateOfBirth` which in the PRD belong to the `Applicants` table (§21.2), not `Users`. | Reconcile: decide whether to split User/Applicant per PRD or merge. If merged, document deviation from PRD schema and add missing PRD columns. |
| B3 | Inconsistency | **HIGH** | tasks.md:T040 vs PRD §21.3 | **Application entity missing PRD-only fields**. PRD §21.3 includes `BranchId`, `CurrentStage`, `PreferredLanguage`, `SpecialNeeds`, `DataAccuracyConfirmed`, `ExpiresAt`, `CancelledAt`, `CancellationReason` — none appear in task T040. Conversely, T040 includes `ReviewedBy`, `ReviewedAt`, `Notes`, `RejectionReason` which aren't in PRD §21.3. | Harmonize Application entity with PRD. If plan intentionally departs from PRD, document deviations in plan.md. |
| B4 | Inconsistency | **HIGH** | tasks.md:T041 vs PRD §21.5 | **ApplicationDocument entity property mismatch**. PRD §21.5 (Documents) includes `IsRequired`, `Status` (Uploaded/Reviewed/Rejected), `RejectionReason`, `UploadedAt`, `ReviewedBy`, `ReviewedAt` but uses column name `ReviewedBy`. Task T041 uses `IsVerified`, `VerifiedBy`, `VerifiedAt` instead — different naming for the same concept. PRD also lacks `FileSize`, `MimeType` that T041 adds. | Align naming. One entity shouldn't use "Verified" while PRD uses "Reviewed". Pick one convention. The additional security fields (FileSize, MimeType) in T041 are good security hardening — keep them. |
| B5 | Inconsistency | **HIGH** | tasks.md:T043 vs PRD §21.6 | **Appointment entity gaps**. PRD §21.6 has `ScheduledDate`, `TimeSlot`, `BranchId`, `CancelledAt`, `CancellationReason` — T043 uses `ScheduledAt` (DateTime not Date+TimeSlot), lacks `BranchId`, `CancelledAt`, `CancellationReason`. | Decide: single `ScheduledAt DateTime` (simpler) or `ScheduledDate Date + TimeSlot NVARCHAR` (PRD). Document decision. |
| B6 | Inconsistency | **HIGH** | tasks.md:T044 vs PRD §21.7 | **MedicalExamination entity differences**. PRD §21.7 has `BloodType`, `ReportReference`, `FitnessResult` — T044 uses `Result` (enum `MedicalFitnessResult`) instead of `FitnessResult`, and doesn't include `BloodType`, `ReportReference`. PRD also lacks `CertificatePath` that T044 adds. | Standardize property names. Add `BloodType` and `ReportReference` to entity. Keep `CertificatePath` as a plan improvement. |
| B7 | Inconsistency | **HIGH** | tasks.md:T045 vs PRD §21.8 | **TrainingRecord entity gaps**. PRD §21.8 includes `SchoolName`, `RequiredHours`, `IsExempt`, `ExemptionReason`, `ExemptionApprovedBy`, `Status` — T045 only has `TrainingCenter`, `HoursCompleted`, `CompletedAt`, `CertificateNumber`. Missing exemption workflow fields. | Add `RequiredHours`, `IsExempt`, `ExemptionReason`, `ExemptionApprovedBy`, `Status`. Rename `TrainingCenter` → `SchoolName` for PRD consistency. |
| B8 | Inconsistency | **MEDIUM** | tasks.md:T047 vs PRD §21.10 | **PracticalTest entity differences**. PRD §21.10 includes `RequiresAdditionalTraining`, `AdditionalHoursRequired` — T047 uses `VehicleUsed` instead. | Add PRD fields. Keep `VehicleUsed` as improvement. |
| B9 | Inconsistency | **MEDIUM** | tasks.md:T048 vs PRD §21.11 | **Payment entity differences**. PRD §21.11 has `PaymentMethod`, `TransactionReference`, `FailedAt`, `FailureReason` — T048 uses `TransactionId`, `Gateway` (renamed), lacks `FailedAt`, `FailureReason`. | Align naming: `TransactionReference` → `TransactionId` or vice versa. Add missing failure-tracking fields. |
| B10 | Inconsistency | **MEDIUM** | tasks.md:T049 vs PRD §21.13 | **License entity differences**. PRD §21.13 has `ApplicationId`, `ApplicantId`, `PrintedAt`, `DownloadedAt` — T049 uses `HolderId` (instead of `ApplicantId`), has `QrCode` (not in PRD), lacks `ApplicationId`, `PrintedAt`, `DownloadedAt`. | Add missing PRD fields. Keep `QrCode` as improvement. |
| B11 | Inconsistency | **MEDIUM** | tasks.md:T053 vs PRD §21.14 | **Notification entity differences**. PRD §21.14 has `ApplicationId`, `MessageAr`, `MessageEn` — T053 uses `BodyAr`, `BodyEn` instead and has `RelatedEntityId`, `RelatedEntityType` (more generic). PRD lacks the generic entity ref. | Pick consistent naming. The generic entity reference (`RelatedEntityId/Type`) is architecturally better than PRD's `ApplicationId` FK. Document as intentional improvement. |
| B12 | Inconsistency | **MEDIUM** | tasks.md:T054 vs PRD §21.16 | **AuditLog entity near-match**. Minor naming: PRD uses `Timestamp` while constitution and AGENTS.md reference `CreatedAt`. T054 lists both `Timestamp` and inherits `CreatedAt` from `BaseEntity` — potential double column. | AuditLog extends `BaseEntity` (which has `CreatedAt`). Remove explicit `Timestamp` and rely on inherited `CreatedAt`, or skip `BaseEntity` inheritance for AuditLog. |
| B13 | Inconsistency | **MEDIUM** | tasks.md:T055 vs PRD §21.17 | **SystemSetting entity differences**. PRD §21.17 has `SettingKey`, `SettingValue`, `Category` — T055 uses `Key`, `Value` and has `IsEncrypted` (not in PRD). PRD lacks `IsEncrypted` but includes `Category`. | Add `Category`. Keep `IsEncrypted` as security improvement. Rename to `SettingKey`/`SettingValue` for PRD alignment. |
| C1 | Path Error | **HIGH** | tasks.md:T102 | **EF migration command uses old paths**. `dotnet ef migrations add InitialCreate -p src/Mojaz.Infrastructure -s src/Mojaz.API` — should be `src/backend/src/Mojaz.Infrastructure` and `src/backend/src/Mojaz.API`. | Update T102 with correct paths. |
| C2 | Path Error | **HIGH** | tasks.md:T103–T107 | **Phase 4 validation paths use old `src/Mojaz.Domain/`** — should be `src/backend/src/Mojaz.Domain/`. | Update all Phase 4 paths. |
| D1 | Constitution | **MEDIUM** | tasks.md T113 vs Constitution §VI | **Placeholder tests insufficient for constitution**. Constitution mandates 80% coverage on Application services. Phase 6 only creates "placeholder" tests. No actual test coverage plan. | Acceptable for scaffold — note that real test coverage is a follow-up feature. Add explicit comment in tasks.md. |
| D2 | Constitution | **LOW** | tasks.md general vs Constitution §VII | **Hangfire notification dispatch architecture not tested**. Constitution §VII mandates async notifications via Hangfire. T101 configures Hangfire but no task validates notification dispatch. | Acceptable for scaffold scope — notification features are separate. |
| E1 | Underspecification | **MEDIUM** | spec.md FR-004 | **"etc." in FR-004** — `ApplicationStatus, LicenseCategoryCode, FeeType, AppointmentType, DocumentType, etc.` Using "etc." in a requirement makes it untestable. | List all 11 enums explicitly or reference plan.md enum list. |
| E2 | Underspecification | **MEDIUM** | tasks.md T081 | **"remaining 19 entity configuration files" is vague**. A single task creating 19 files is not atomic enough for an implementation agent. | Split T081 into explicit entity groups (at minimum, list entity names) or accept as batch task with clear entity list reference to plan.md. |
| F1 | Duplication | **LOW** | tasks.md T098–T101 vs T097 | **T098–T101 are described as "part of T097"** in the dependency section but listed as separate tasks. Either merge or keep separate — current state is ambiguous. | Clarify: if they are all in `Program.cs`, merge into T097. If each creates a helper extension method, keep separate and remove the "part of T097" note. |
| F2 | Duplication | **LOW** | spec.md FR-008 + FR-013 | **FR-008 and FR-013 both describe `IRepository<T>`**. FR-008: "implement generic IRepository<T> and UnitOfWork", FR-013: "provide a generic IRepository<T>, allowing entity-specific interfaces". | Consolidate into one FR with both aspects. |

---

## Coverage Summary

### Requirements → Tasks Mapping

| Requirement | Has Task? | Task IDs | Notes |
|-------------|:---------:|----------|-------|
| FR-001 Solution structure | ✅ | T001–T021 | Fully covered |
| FR-002 Base classes | ✅ | T022–T024 | 3 classes, correct hierarchy |
| FR-003 21 entities | ⚠️ | T036–T056 | 21 listed, but PRD has 22+ tables (Applicants, PushTokens, EmailLogs, SmsLogs missing) |
| FR-004 Enums | ✅ | T025–T035 | 11 enums present |
| FR-005 Shared types | ✅ | T059–T070 | ApiResponse, PagedResult, Result, Exceptions, Constants |
| FR-006 FluentValidation + AutoMapper | ✅ | T074–T075 | Registered in ApplicationServices DI |
| FR-007 EF Core DbContext | ✅ | T076, T079–T082 | Fluent API configs, ApplyConfigurationsFromAssembly |
| FR-008 Repository + UoW | ✅ | T057–T058, T077–T078 | Interfaces in Domain, implementations in Infrastructure |
| FR-009 Middleware | ✅ | T092–T094 | GlobalExceptionHandler, RequestLogging, AuditLog |
| FR-010 Swagger + JWT | ✅ | T089, T099 | SwaggerExtensions + JWT bearer config |
| FR-011 Serilog | ✅ | T098 | Console + File sinks |
| FR-012 Test projects | ✅ | T007–T010 | 4 test projects created |
| FR-013 Generic repo | ✅ | T057 | Merged with FR-008 |
| SC-001 Build < 30s, 0 warn | ✅ | T021, T117 | Two verification checkpoints |
| SC-002 Clean arch compliance | ✅ | T103–T104 | Explicit validation tasks |
| SC-003 100% entities/enums | ⚠️ | T105–T106 | Only validates 21 — see A1/A2/A3 |
| SC-004 Swagger loads | ✅ | T119 | Smoke test |
| SC-005 Docker SQL Server | ✅ | T108 | docker-compose.yml |
| SC-006 Health check 200 | ✅ | T096, T119 | Controller + smoke test |

### Constitution Alignment

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Architecture | ✅ PASS | Layers correct, Domain zero deps, Application no Infra ref |
| II. Security First | ✅ PASS | GlobalExceptionHandler, security headers, rate limiting, BCrypt |
| III. Config over Hardcode | ✅ PASS | SystemSettings entity, FeeStructure entity present |
| IV. i18n by Default | N/A | Backend scaffold — no UI components |
| V. API Contract | ✅ PASS | ApiResponse<T>, PagedResult<T> in tasks |
| VI. Test Discipline | ⚠️ PARTIAL | Test projects exist but only placeholder tests — acceptable for scaffold |
| VII. Async Notifications | ⚠️ PARTIAL | Hangfire configured, but notification dispatch is a later feature |

### Unmapped Tasks

All tasks map to at least one FR or SC. No orphan tasks found.

---

## Metrics

| Metric | Value |
|--------|-------|
| Total Functional Requirements (spec.md) | 13 |
| Total Success Criteria (spec.md) | 6 |
| Total Tasks (tasks.md) | 119 |
| Coverage % (FRs with ≥1 task) | **100%** (13/13) |
| Coverage % (SCs with ≥1 task) | **100%** (6/6) |
| Critical Issues | **3** (A1, A2, A3 — missing PRD entities) |
| High Issues | **9** (B1–B7, C1, C2 — property/path drift) |
| Medium Issues | **8** (B8–B13, D1, E1–E2) |
| Low Issues | **3** (D2, F1, F2) |
| **Total Findings** | **23** |

---

## Next Actions

> [!CAUTION]
> **3 CRITICAL issues** must be resolved before running `/speckit.implement`.

### Immediate (before implementation)

1. **Resolve entity count discrepancy (A1, A2, A3)** — Decide whether to:
   - **(a)** Add `Applicant.cs`, `PushToken.cs`, `EmailLog.cs`, `SmsLog.cs` (PRD-faithful, 25 entities)
   - **(b)** Merge Applicant into User, exclude PushToken/EmailLog/SmsLog from scaffold scope (document as future)
   - **Recommendation**: Option (b) with explicit documentation — keep 21 entities for scaffold, add 4 more in notification/auth features

2. **Fix all path references (B1, C1, C2)** — Update tasks.md Phases 2–6 to use `src/backend/src/` prefix, matching the actual project structure in the solution file

3. **Reconcile entity properties with PRD (B2–B13)** — For each HIGH finding, either:
   - Update the entity task description to include missing PRD fields
   - Or document the intentional deviation in plan.md with rationale

### Recommended (can proceed, but address early)

4. **Tighten FR-004** (E1) — Replace "etc." with full enum list
5. **Consolidate FR-008 + FR-013** (F2) — Merge duplicate requirements
6. **Clarify T097–T101 relationship** (F1) — Merge or separate cleanly

### Can defer to later features

7. **Real test coverage** (D1) — Scaffold only needs buildable projects
8. **Notification dispatch validation** (D2) — Separate notification feature

---

## Remediation Offer

Would you like me to suggest concrete remediation edits for the top issues? Specifically:

1. **Updated entity property lists** for T036–T056 aligned with PRD §21
2. **Fixed file paths** throughout tasks.md for `src/backend/src/`
3. **Plan.md addendum** documenting PRD deviations and rationale

I will NOT apply any changes until you explicitly approve.
