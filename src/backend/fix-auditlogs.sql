-- Fix AuditLogs table - drop and recreate with correct schema
IF OBJECT_ID('AuditLogs', 'U') IS NOT NULL 
    DROP TABLE AuditLogs;
GO

CREATE TABLE AuditLogs (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NULL,
    Action NVARCHAR(64) NOT NULL,
    EntityType NVARCHAR(64) NOT NULL,
    EntityId UNIQUEIDENTIFIER NOT NULL,
    OldValues NVARCHAR(MAX) NULL,
    NewValues NVARCHAR(MAX) NULL,
    IpAddress NVARCHAR(64) NULL,
    UserAgent NVARCHAR(256) NULL,
    Timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

PRINT 'AuditLogs table recreated with correct schema';
GO