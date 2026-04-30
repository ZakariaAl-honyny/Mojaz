-- SQL script to add missing columns to Applications and Licenses tables
USE MojazDB;
GO

-- Security Fields in Applications
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'SecurityStatus')
BEGIN
    ALTER TABLE [Applications] ADD [SecurityStatus] tinyint NOT NULL DEFAULT 0;
END
GO

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'SecurityVerifiedBy')
BEGIN
    ALTER TABLE [Applications] ADD [SecurityVerifiedBy] uniqueidentifier NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'SecurityVerifiedAt')
BEGIN
    ALTER TABLE [Applications] ADD [SecurityVerifiedAt] datetime2 NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'SecurityNotes')
BEGIN
    ALTER TABLE [Applications] ADD [SecurityNotes] nvarchar(500) NULL;
END
GO

-- Assignment Fields in Applications
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'AssignedAt')
BEGIN
    ALTER TABLE [Applications] ADD [AssignedAt] datetime2 NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'AssignedToId')
BEGIN
    ALTER TABLE [Applications] ADD [AssignedToId] uniqueidentifier NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'AssignmentNotes')
BEGIN
    ALTER TABLE [Applications] ADD [AssignmentNotes] nvarchar(500) NULL;
END
GO

-- License Fields in Licenses
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Licenses' AND COLUMN_NAME = 'ReplacementCount')
BEGIN
    ALTER TABLE [Licenses] ADD [ReplacementCount] int NOT NULL DEFAULT 0;
END
GO

PRINT 'Schema update completed successfully';
