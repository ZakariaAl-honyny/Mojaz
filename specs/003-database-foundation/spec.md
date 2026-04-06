# Feature Specification: Database Foundation & Seed Data

**Feature Branch**: `003-database-foundation`
**Created**: 2026-04-06
**Status**: Draft
**Input**: User description: "The complete SQL Server database schema for the Mojaz platform with all 21 tables, relationships, constraints, indexes, and seed data for development and testing."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Apply DB Schema and Constraints (Priority: P1)

As a backend developer, I need a complete SQL Server database schema with all 21 core tables, foreign keys, constraints, and indexes, so that the application can correctly store and enforce the integrity of Mojez data.

**Why this priority**: Without the correct DB schema, no other feature or API can function properly in the application.

**Independent Test**: Can be fully tested by applying migrations to an empty SQL Server database and verifying the resulting schema programmatically.

**Acceptance Scenarios**:

1. **Given** an empty database, **When** migrations are applied, **Then** 21 tables are created successfully.
2. **Given** the generated schema, **When** inspecting foreign keys, **Then** all relationships are present.

---

### User Story 2 - Automated Seed Data (Priority: P2)

As a developer or tester, I need the database to automatically seed essential lookup data (LicenseCategories, FeeStructures, SystemSettings) and test data (Users, Applicants, Applications, Documents), so that I can immediately start testing the application features without manual setup.

**Why this priority**: Testing features requires pre-existing data (lookups, users, categories), greatly reducing setup time.

**Independent Test**: Can be tested by checking table counts (e.g. 5 categories, 7 fee types, 6 users) after the initial DB launch.

**Acceptance Scenarios**:

1. **Given** the seed migration is run, **When** querying `LicenseCategories`, **Then** 6 categories are retrievable.
2. **Given** the seed migration, **When** checking `Users`, **Then** Admin, Applicants, and Employees exist with the right Roles.

### Edge Cases

- What happens if a duplicate email or national ID is inserted? (Schema should enforce UNIQUE constraint and fail).
- What happens if soft deletion is used? (Deleted entities have `IsDeleted=1` and shouldn't appear in default EF queries, but remain in the database).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST create 21 specific tables (Users, Applicants, Applications, LicenseCategories, Documents, Appointments, MedicalExams, TrainingRecords, TheoryTests, PracticalTests, Payments, FeeStructures, Licenses, Notifications, PushTokens, AuditLogs, SystemSettings, OtpCodes, RefreshTokens, EmailLogs, SmsLogs).
- **FR-002**: System MUST enforce appropriate Data Types, Primary Keys, Foreign Keys, and Constraints defined in the data model.
- **FR-003**: System MUST provide indexes to optimize common lookups (e.g., Email, NationalId, Status, UserId).
- **FR-004**: System MUST apply `Arabic_CI_AS` collation for language-aware operations.
- **FR-005**: System MUST seed comprehensive test data across all tables to facilitate immediate testing and development.
- **FR-006**: System MUST utilize Entity Framework Core Migrations to apply schema and data changes reliably.

### Key Entities

- **Users**: Authentication, Authorization, and communications tracking (OtpCodes, PushTokens, EmailLogs, SmsLogs).
- **LicenseCategories/FeeStructures**: The business dictionary for license variations and costs.
- **Applicants/Applications/Licenses/Appointments/Documents/Payments**: Core workflow entities of the system.
- **Medical/Test Records**: MedicalExams, TrainingRecords, TheoryTests, PracticalTests.
- **SystemSettings**: Systemic configuration lookup table.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 21 tables instantiate via code-first migrations with zero errors.
- **SC-002**: Verification script returns non-zero counts for all seeded tables matching exactly the specified seed data requirements.
- **SC-003**: Unique Constraints on specified columns (Email, NationalId, etc) successfully reject duplicate inserts.
- **SC-004**: Database supports soft deletes and audit properties accurately by persisting `CreatedAt`, `UpdatedAt`, and `IsDeleted` appropriately.

## Assumptions

- Database engine target is SQL Server 2022.
- The default schema will be used unless modified.
- EF Core is being used to handle database migrations and mapping.
