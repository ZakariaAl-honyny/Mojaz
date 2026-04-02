---
description: Database and Entity Framework rules
globs: ["**/*Entity*.cs", "**/*Configuration*.cs", "**/*Migration*.cs", "**/*Repository*.cs"]
alwaysApply: false
---

# Database Rules

## Entity Framework Core 8
- Fluent API ONLY (no data annotations on entities)
- One configuration file per entity in Infrastructure/Configurations/
- Global query filter: HasQueryFilter(x => !x.IsDeleted)
- Cascade delete: NEVER (use DeleteBehavior.Restrict)
- DateTime: always DateTime2 in SQL, DateTimeOffset in C# when timezone matters

## Naming
- Tables: PascalCase plural (Users, Applications, Payments)
- Columns: PascalCase (FullName, CreatedAt)
- PKs: always "Id" (UNIQUEIDENTIFIER)
- FKs: {RelatedTable}Id (ApplicantId, LicenseCategoryId)
- Indexes: IX_{Table}_{Column}

## Configurable Values
NEVER hardcode these — read from SystemSettings:
- MIN_AGE_CATEGORY_{A-F}
- MAX_THEORY_ATTEMPTS, MAX_PRACTICAL_ATTEMPTS
- COOLING_PERIOD_DAYS, MEDICAL_VALIDITY_DAYS
- OTP_VALIDITY_*, PASSWORD_MIN_LENGTH
- JWT_*, ACCOUNT_LOCKOUT_*

NEVER hardcode fees — read from FeeStructures table.

## Migrations
- Always use named migrations: Add-Migration DescriptiveName
- NEVER edit existing migrations
- ALWAYS test rollback (Down method)