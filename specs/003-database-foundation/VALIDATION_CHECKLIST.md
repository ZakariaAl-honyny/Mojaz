# Database Foundation - Validation Checklist

## Pre-Migration Verification

### Code Compilation
- [ ] Project builds without errors: `dotnet build src/backend/Mojaz.sln`
- [ ] No warnings in build output
- [ ] All entity files compile: `src/Mojaz.Domain/Entities/**/*.cs`
- [ ] All configuration files compile: `src/Mojaz.Infrastructure/Data/Configurations/**/*.cs`

### Entity Structure
- [ ] All 20 entities created in correct directories
- [ ] `User` and `Application` implement `IAuditable` and `ISoftDeletable`
- [ ] All other entities inherit from `BaseEntity`
- [ ] Navigation properties match foreign key relationships

### Configuration Completeness
- [ ] 20 configuration classes exist
- [ ] Each configuration file contains proper using statements
- [ ] All configurations applied in `ApplicationDbContext.OnModelCreating()`
- [ ] `HasData()` calls for users, categories, fees, settings

---

## Post-Migration Verification

### Database Creation
- [ ] Database `Mojaz` created successfully
- [ ] All 20 tables exist in SQL Server
- [ ] Table names match configuration: `Users`, `LicenseCategories`, `FeeStructures`, etc.
- [ ] All columns present with correct data types

### Schema Constraints
- [ ] Primary keys properly configured
- [ ] Unique indexes exist:
  - [ ] `Users.Email` (with soft delete filter)
  - [ ] `LicenseCategories.Code`
  - [ ] `FeeStructures.Code`
  - [ ] `SystemSettings.Key`
  - [ ] `Applications.ApplicationNumber` (with soft delete filter)
  - [ ] `Licenses.LicenseNumber`
  - [ ] `Payments.PaymentReference`
- [ ] Foreign key indexes created for lookups
- [ ] Collation set to `Arabic_CI_AS`

### Seed Data Verification

**System Settings** (10 records)
```sql
SELECT COUNT(*) as Total FROM SystemSettings
-- Expected: 10
```

**License Categories** (7 records)
```sql
SELECT Code, NameEn, ValidityYears FROM LicenseCategories ORDER BY Code
-- Expected: A, B, C, D, BE, C1, AM
```

**Fee Structures** (10 records)
```sql
SELECT Code, Amount, Category FROM FeeStructures ORDER BY Code
-- Expected: 10 fee entries across categories
```

**Users** (10 records)
```sql
SELECT 
    COUNT(*) as Total,
    SUM(CASE WHEN Email LIKE '%@mojaz.local' THEN 1 ELSE 0 END) as Employees,
    SUM(CASE WHEN Email LIKE '%@example.com' THEN 1 ELSE 0 END) as Applicants
FROM Users
WHERE IsDeleted = 0
-- Expected: 10 total (1 admin + 4 employees + 5 applicants)
```

---

## Functional Testing

### T013: Initial Schema Migration
- [ ] `dotnet ef migrations add InitialCreate` completes successfully
- [ ] Migration file created: `Migrations/[timestamp]_InitialCreate.cs`
- [ ] Migration contains `CreateTable` operations for all 20 entities
- [ ] Migration includes `InsertData` operations for seed records

### T017: Seed Data in Migration
- [ ] Migration includes seeding:
  - [ ] 10 System Settings
  - [ ] 7 License Categories
  - [ ] 10 Fee Structures
  - [ ] 10 Users
- [ ] `dotnet ef database update` applies migration successfully
- [ ] No errors during `InsertData` operations

### T018: Database Functionality
- [ ] Connect to database with SQL Server Management Studio
- [ ] Query each table and verify row counts
- [ ] Verify soft delete queries work:
  ```sql
  SELECT * FROM Users WHERE IsDeleted = 0 AND Email = 'admin@mojaz.local'
  ```
- [ ] Test unique constraints work (cannot insert duplicate email)
- [ ] Test foreign key constraints work

### T019: Namespace Validation
- [ ] All entities in correct namespaces:
  - [ ] `Mojaz.Domain.Entities.Base` - BaseEntity, interfaces
  - [ ] `Mojaz.Domain.Entities.Identity` - User, OtpCode, RefreshToken, etc.
  - [ ] `Mojaz.Domain.Entities.Config` - LicenseCategory, FeeStructure, SystemSetting
  - [ ] `Mojaz.Domain.Entities.Core` - Application, License, Appointment, Document, Payment
  - [ ] `Mojaz.Domain.Entities.Tracking` - StatusHistory, MedicalExam, Tests, Notification, AuditLog
- [ ] All configurations in `Mojaz.Infrastructure.Data.Configurations`
- [ ] All seeders in `Mojaz.Infrastructure.Data.Seeders`
- [ ] DbContext in `Mojaz.Infrastructure.Data`

---

## Quick Start Validation

### 1. Build Project
```powershell
cd C:\Users\ALlahabi\Desktop\cmder\Mojaz
dotnet build src/backend/Mojaz.sln -c Release
```
**Expected**: Build succeeds with no errors

### 2. Generate Migration
```powershell
cd src/backend
dotnet ef migrations add InitialCreate `
  -p Mojaz.Infrastructure/Mojaz.Infrastructure.csproj `
  -s Mojaz.API/Mojaz.API.csproj `
  -c ApplicationDbContext
```
**Expected**: Migration file created successfully

### 3. Create Database
```powershell
dotnet ef database update `
  -p Mojaz.Infrastructure/Mojaz.Infrastructure.csproj `
  -s Mojaz.API/Mojaz.API.csproj `
  -c ApplicationDbContext
```
**Expected**: Database created, migrations applied, seed data inserted

### 4. Verify with SQL Query
```sql
-- Run in SQL Server Management Studio
USE Mojaz;

-- Check tables
SELECT COUNT(*) as TableCount 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'dbo';
-- Expected: 20

-- Check seed data
SELECT 'Users' as TableName, COUNT(*) as Count FROM Users
UNION ALL
SELECT 'LicenseCategories', COUNT(*) FROM LicenseCategories
UNION ALL
SELECT 'FeeStructures', COUNT(*) FROM FeeStructures
UNION ALL
SELECT 'SystemSettings', COUNT(*) FROM SystemSettings;
-- Expected: Users=10, LicenseCategories=7, FeeStructures=10, SystemSettings=10
```

---

## Common Issues & Solutions

### Issue: Build fails with namespace errors
**Solution**: Verify entity files use correct namespaces:
```csharp
namespace Mojaz.Domain.Entities.Identity;  // Correct
namespace Mojaz.Domain.Entities.Config;    // Correct
namespace Mojaz.Infrastructure.Data.Configurations;  // Correct
```

### Issue: Migration generation fails
**Solution**: 
1. Ensure `ApplicationDbContext` can be instantiated
2. Check all `IEntityTypeConfiguration` classes are properly implemented
3. Verify `OnModelCreating()` calls `ApplyConfiguration()` correctly

### Issue: Seed data not inserted
**Solution**: 
1. Verify `HasData()` calls in configuration classes
2. Check seed methods return proper data (matching entity types)
3. Ensure entities have explicit ID values

### Issue: Soft delete unique constraint error
**Solution**: The constraint filter `[IsDeleted] = 0` is applied:
```sql
CREATE UNIQUE INDEX IX_Users_Email ON Users(Email) 
WHERE IsDeleted = 0;
```
This allows multiple soft-deleted records with same email.

---

## Sign-Off Criteria

Phase 3 (User Story 1) is complete when:
- ? All 20 entities created
- ? All 20 configurations applied
- ? Initial migration generated (T013)
- ? Database created with zero errors
- ? Schema verified in SQL Server

Phase 4 (User Story 2) is complete when:
- ? Seed migration includes all 37 records
- ? All seed data rows inserted successfully
- ? Test users can be queried
- ? Test data queries return expected counts

---

## Documentation

| Document | Purpose |
|----------|---------|
| `MIGRATION_GUIDE.md` | Step-by-step migration setup |
| `data-model.md` | Entity structure and properties |
| `plan.md` | Technical architecture and decisions |
| `spec.md` | Feature specification |
| `research.md` | Technology research and justification |

---

**Last Updated**: 2024-04-06
**Validation Version**: 1.0
