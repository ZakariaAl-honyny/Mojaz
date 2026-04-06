<!-- Migration and Database Setup Instructions -->

# Database Foundation - Migration & Deployment Guide

## Overview

This guide explains how to create and apply the database migrations for the Mojaz platform. The implementation uses Entity Framework Core with SQL Server as the target database.

## Prerequisites

- .NET 8 SDK or later
- SQL Server 2019 or later
- Entity Framework Core Tools (`dotnet ef` CLI)

## Installation

Install EF Core CLI if not already installed:

```powershell
dotnet tool install --global dotnet-ef
```

Or update if already installed:

```powershell
dotnet tool update --global dotnet-ef
```

## Step 1: Generate InitialCreate Migration

Navigate to the Infrastructure project and create the initial migration:

```powershell
cd src/backend

dotnet ef migrations add InitialCreate `
  -p Mojaz.Infrastructure/Mojaz.Infrastructure.csproj `
  -s Mojaz.API/Mojaz.API.csproj `
  -c ApplicationDbContext `
  -o Migrations
```

**What this creates:**
- `Migrations/[timestamp]_InitialCreate.cs` - Forward migration
- `Migrations/[timestamp]_InitialCreate.Designer.cs` - Migration metadata
- `Migrations/ApplicationDbContextModelSnapshot.cs` - Current model snapshot

**Migration includes:**
- 20 database tables
- All constraints, indexes, and collation settings
- 37 seed data records (users, licenses, fees, settings)

## Step 2: Create the Database

Apply the migration to create the database:

```powershell
dotnet ef database update `
  -p Mojaz.Infrastructure/Mojaz.Infrastructure.csproj `
  -s Mojaz.API/Mojaz.API.csproj `
  -c ApplicationDbContext
```

**What this does:**
1. Creates the database (if it doesn't exist)
2. Applies all pending migrations
3. Seeds all lookup data (categories, fees, settings)
4. Populates test users (admin, employees, applicants)

## Step 3: Verify Database Creation

### Option A: Using SQL Server Management Studio (SSMS)

1. Open SSMS
2. Connect to your SQL Server instance
3. Expand Databases
4. Look for `Mojaz` database (or configured database name)
5. Expand Tables to see all 20 tables

### Option B: Using SQL Query

```sql
-- List all tables
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'dbo'
ORDER BY TABLE_NAME;

-- Check row counts
SELECT 
    TABLE_NAME,
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES t2 
     WHERE t2.TABLE_NAME = t1.TABLE_NAME) as RowCount
FROM INFORMATION_SCHEMA.TABLES t1
WHERE TABLE_SCHEMA = 'dbo'
ORDER BY TABLE_NAME;

-- Verify seed data
SELECT COUNT(*) as UserCount FROM Users;
SELECT COUNT(*) as CategoryCount FROM LicenseCategories;
SELECT COUNT(*) as FeeCount FROM FeeStructures;
SELECT COUNT(*) as SettingCount FROM SystemSettings;
```

## Connection String Configuration

Update `appsettings.json` in the API project:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=Mojaz;Integrated Security=true;TrustServerCertificate=true;Encrypt=false;"
  }
}
```

For SQL Server Authentication:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=Mojaz;User Id=YOUR_USER;Password=YOUR_PASSWORD;TrustServerCertificate=true;"
  }
}
```

## Test Data Access

### Default Users for Testing

**Administrator:**
- Email: `admin@mojaz.local`
- Password: `Admin@123`

**Employees:**
- Email: `ahmed.mansouri@mojaz.local` (Operations Manager)
- Email: `fatima.dosari@mojaz.local` (Theory Test Examiner)
- Email: `mohammed.otaibi@mojaz.local` (Practical Test Examiner)
- Email: `noor.shammari@mojaz.local` (Medical Examiner)
- Password: `Employee@123`

**Applicants:**
- Email: `ali.qahtani@example.com`
- Email: `layla.rashid@example.com`
- Email: `omar.harbi@example.com`
- Email: `yasmin.fuhaidi@example.com`
- Email: `ibrahim.matani@example.com`
- Password: `Applicant@123`

## Troubleshooting

### Error: "The type initializer for 'Npgsql.PluginInitialization' threw an exception"

**Solution:** Ensure correct database provider is installed:

```powershell
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
```

### Error: "Cannot open database 'Mojaz' requested by the login"

**Solution:** 
1. Verify connection string in `appsettings.json`
2. Ensure SQL Server is running
3. Check authentication (Windows or SQL Server Auth)
4. Verify database user has CREATE DATABASE permissions

### Error: "An error occurred while updating the database"

**Solution:**
1. Check migration file syntax
2. Verify entity configurations
3. Run `dotnet build` to ensure project compiles
4. Drop database and re-run migration:

```powershell
dotnet ef database drop -f `
  -p Mojaz.Infrastructure/Mojaz.Infrastructure.csproj `
  -s Mojaz.API/Mojaz.API.csproj `
  -c ApplicationDbContext

dotnet ef database update `
  -p Mojaz.Infrastructure/Mojaz.Infrastructure.csproj `
  -s Mojaz.API/Mojaz.API.csproj `
  -c ApplicationDbContext
```

## Rolling Back Migrations

To rollback to a previous migration:

```powershell
# Rollback to a specific migration
dotnet ef database update PreviousMigrationName `
  -p Mojaz.Infrastructure/Mojaz.Infrastructure.csproj `
  -s Mojaz.API/Mojaz.API.csproj `
  -c ApplicationDbContext

# Rollback all migrations
dotnet ef database update 0 `
  -p Mojaz.Infrastructure/Mojaz.Infrastructure.csproj `
  -s Mojaz.API/Mojaz.API.csproj `
  -c ApplicationDbContext
```

## Database Schema Overview

### Core Tables (20 total)

**Authentication & Identity (7)**
- `Users` - User accounts and credentials
- `OtpCodes` - One-time password tokens
- `RefreshTokens` - JWT refresh tokens
- `PasswordResets` - Password recovery tokens
- `EmailLogs` - Email delivery tracking
- `SmsLogs` - SMS delivery tracking
- `PushTokens` - Mobile push notification tokens

**Configuration (3)**
- `LicenseCategories` - License types (A, B, C, etc.)
- `FeeStructures` - Service and category fees
- `SystemSettings` - Global configuration parameters

**Core Workflow (5)**
- `Applications` - License applications
- `Licenses` - Issued driving licenses
- `Appointments` - Test and exam appointments
- `Documents` - Uploaded application documents
- `Payments` - Payment transactions

**Operational Tracking (5)**
- `ApplicationStatusHistories` - Status change audit trail
- `MedicalExams` - Medical examination results
- `TrainingRecords` - Driver training records
- `TheoryTests` - Theory test results
- `PracticalTests` - Practical test results
- `Notifications` - User notifications
- `AuditLogs` - System audit logging

## Performance Considerations

### Indexes Created

All tables include appropriate indexes for:
- Primary keys
- Foreign key lookups
- Unique constraints (Email, ApplicationNumber, LicenseNumber, etc.)
- Soft delete filtering
- Common query patterns (status, dates, user lookups)

### Collation

All string columns use `Arabic_CI_AS` collation for proper Arabic language support.

## Next Steps

1. **Run Migrations**: Execute the migration steps above
2. **Verify Schema**: Confirm all tables and seed data exist
3. **Run Tests**: Execute database integration tests
4. **Deploy**: Use continuous deployment pipeline to apply migrations

## References

- [EF Core Migrations Documentation](https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/)
- [EF Core SQL Server Provider](https://docs.microsoft.com/en-us/ef/core/providers/sql-server/)
- [HasData Seeding](https://docs.microsoft.com/en-us/ef/core/modeling/data-seeding)

---

**Last Updated**: 2024-04-06
**Version**: 1.0 - Initial Database Foundation
