-- SQL script to initialize the EF Core migrations history table
USE MojazDB;
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '__EFMigrationsHistory')
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END
GO

-- Insert migrations that we consider "done"
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
SELECT '20260424104609_InitialCreate', '8.0.0' WHERE NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20260424104609_InitialCreate');
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
SELECT '20260424153549_UpdateEnumsToTinyInt', '8.0.0' WHERE NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20260424153549_UpdateEnumsToTinyInt');
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
SELECT '20260424175619_UpdateGenderAndBloodTypeToTinyInt', '8.0.0' WHERE NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20260424175619_UpdateGenderAndBloodTypeToTinyInt');
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
SELECT '20260425072932_FixEnumColumnTypes', '8.0.0' WHERE NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20260425072932_FixEnumColumnTypes');
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
SELECT '20260425075720_FixUsersAndOtpCodesColumns', '8.0.0' WHERE NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20260425075720_FixUsersAndOtpCodesColumns');
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
SELECT '20260425100000_IncreaseAuditLogActionType', '8.0.0' WHERE NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20260425100000_IncreaseAuditLogActionType');
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
SELECT '20260425120000_AddMissingApplicationAndAppointmentColumns', '8.0.0' WHERE NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20260425120000_AddMissingApplicationAndAppointmentColumns');
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
SELECT '20260426120000_IncreaseAuditLogActionTypeTo500', '8.0.0' WHERE NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20260426120000_IncreaseAuditLogActionTypeTo500');
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
SELECT '20260427000000_FixUserEnumStringValues', '8.0.0' WHERE NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20260427000000_FixUserEnumStringValues');
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
SELECT '20260427000001_FixUsersEnumNulls', '8.0.0' WHERE NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20260427000001_FixUsersEnumNulls');
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
SELECT '20260428000001_AddMissingLicenseFields', '8.0.0' WHERE NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20260428000001_AddMissingLicenseFields');
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
SELECT '20260428023218_AddSecurityVerificationFields', '8.0.0' WHERE NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20260428023218_AddSecurityVerificationFields');
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
SELECT '20260428024248_AddSecurityVerificationFields2', '8.0.0' WHERE NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20260428024248_AddSecurityVerificationFields2');
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
SELECT '20260428030000_AddFeeStructuresSoftDelete', '8.0.0' WHERE NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20260428030000_AddFeeStructuresSoftDelete');
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
SELECT '20260429032209_AddAssignmentFields', '8.0.0' WHERE NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20260429032209_AddAssignmentFields');

GO
PRINT 'Migration history initialized successfully';
