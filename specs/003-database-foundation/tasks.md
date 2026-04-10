# Tasks: Database Foundation & Seed Data

**Input**: Design documents from `/specs/003-database-foundation/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅
**Branch**: `003-database-foundation`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (independent files, no dependency on incomplete task)
- **[US#]**: Which user story this task belongs to
- All paths are relative to repository root

---

## Phase 1: Setup
**Purpose**: Project initialization and basic structure.

- [x] T001 Create `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations` and `src/backend/src/Mojaz.Infrastructure/Persistence/Seeders` directories

---

## Phase 2: Tests
**Purpose**: TDD and schema verification.

- [ ] T002 Implement a schema verification script to programmatically verify that all 21 tables, FKs, and constraints are created.
- [x] T018 Run `quickstart.md` validation to ensure database creation and data seeding works end-to-end.

---

## Phase 3: Core
**Purpose**: Implement Domain entities, EF Core configurations, and seeding logic.

### Foundational
- [x] T003 Implement `BaseEntity`, `IAuditable`, and `ISoftDeletable` interfaces in `src/backend/src/Mojaz.Domain/Common/`
- [x] T004 Set up `MojazDbContext.cs` skeleton in `src/backend/src/Mojaz.Infrastructure/Persistence/` with DbSets for the 21 tables
- [x] T005 Configure default collation `Arabic_CI_AS` in `MojazDbContext.cs`

### User Story 1 — DB Schema and Constraints
- [x] T006 [P] [US1] Create Identity & Auth Models (`User`, `OtpCode`, `RefreshToken`) and Comm Logs (`EmailLog`, `SmsLog`, `PushToken`) in `src/backend/src/Mojaz.Domain/Entities/`
- [x] T007 [P] [US1] Create Configuration Models (`LicenseCategory`, `FeeStructure`, `SystemSettings`) in `src/backend/src/Mojaz.Domain/Entities/`
- [x] T008 [P] [US1] Create Core Workflow Models (`Applicant`, `Application`, `Document`, `Appointment`, `Payment`, `License`) in `src/backend/src/Mojaz.Domain/Entities/`
- [x] T009 [P] [US1] Create Tracking & Exam Models (`MedicalExam`, `TrainingRecord`, `TheoryTest`, `PracticalTest`, `Notification`, `AuditLog`) in `src/backend/src/Mojaz.Domain/Entities/`
- [x] T010 [P] [US1] Implement EF Core Configuration for Identity/Comm entities in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [x] T011 [P] [US1] Implement EF Core Configuration for Config entities in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [x] T012 [P] [US1] Implement EF Core Configuration for Core Workflow entities in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [x] T013 [P] [US1] Implement EF Core Configuration for Tracking/Exam entities in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/`
- [x] T014 [US1] Apply all configurations to `MojazDbContext.OnModelCreating`

### User Story 2 — Automated Seed Data
- [x] T015 [P] [US2] Implement `LookupSeeder` for `SystemSettings`, `LicenseCategories`, and `FeeStructures` in `src/backend/src/Mojaz.Infrastructure/Persistence/Seeders/LookupSeeder.cs`
- [x] T016 [P] [US2] Implement `UserSeeder` for test Admin, Applicants, and Employees in `src/backend/src/Mojaz.Infrastructure/Persistence/Seeders/UserSeeder.cs`
- [x] T017 [US2] Intercept application startup to execute seeders or add to `HasData` in Configurations

---

## Phase 4: Integration
**Purpose**: Wire the schema to the actual database and execute seeding.

- [ ] T018 [US1] Generate initial EF Core Migration `InitialCreate` using `dotnet ef migrations add InitialCreate`
- [ ] T019 [US2] Generate Seed Database Migration or verify runtime seeding scripts execute successfully on first launch.

---

## Phase 5: Polish
**Purpose**: Final cleanup and validation.

- [x] T020 Code cleanup and namespace validation according to AGENTS.md conventions.
