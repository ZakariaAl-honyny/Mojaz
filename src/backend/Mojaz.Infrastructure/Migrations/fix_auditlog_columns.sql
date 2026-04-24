-- Fix AuditLogs ActionType column truncation
-- Run this against the MojazDB database

USE MojazDB;
GO

-- Check current column sizes
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'AuditLogs' AND COLUMN_NAME IN ('ActionType', 'ActionCategory', 'EntityName');
GO

-- Apply the fix (run in SQL Server Management Studio or sqlcmd)
ALTER TABLE AuditLogs ALTER COLUMN ActionType NVARCHAR(128) NOT NULL;
ALTER TABLE AuditLogs ALTER COLUMN ActionCategory NVARCHAR(128) NOT NULL;
ALTER TABLE AuditLogs ALTER COLUMN EntityName NVARCHAR(128) NOT NULL;
GO

PRINT 'AuditLog columns updated successfully';
GO