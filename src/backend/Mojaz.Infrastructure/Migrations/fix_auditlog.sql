-- Fix AuditLog ActionType column truncation
-- Increase from 64 to 128 characters

ALTER TABLE AuditLogs ALTER COLUMN ActionType NVARCHAR(128) NOT NULL;
ALTER TABLE AuditLogs ALTER COLUMN ActionCategory NVARCHAR(128) NOT NULL;
ALTER TABLE AuditLogs ALTER COLUMN EntityName NVARCHAR(128) NOT NULL;