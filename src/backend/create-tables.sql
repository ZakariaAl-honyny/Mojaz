-- Create all missing tables for Mojaz

-- AuditLogs table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AuditLogs')
CREATE TABLE AuditLogs (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NULL,
    Action NVARCHAR(64) NOT NULL,
    EntityType NVARCHAR(64) NOT NULL,
    EntityId NVARCHAR(64) NOT NULL,
    OldValues NVARCHAR(MAX) NULL,
    NewValues NVARCHAR(MAX) NULL,
    IpAddress NVARCHAR(64) NULL,
    UserAgent NVARCHAR(256) NULL,
    Timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

-- OtpCodes table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OtpCodes')
CREATE TABLE OtpCodes (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    CodeHash NVARCHAR(256) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    Purpose INT NOT NULL,
    Destination NVARCHAR(100) NOT NULL,
    DestinationType INT NOT NULL,
    IsUsed BIT NOT NULL DEFAULT 0,
    UsedAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

-- RefreshTokens table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'RefreshTokens')
CREATE TABLE RefreshTokens (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    Token NVARCHAR(256) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    IsRevoked BIT NOT NULL DEFAULT 0,
    RevokedAt DATETIME2 NULL,
    ReplacedByToken NVARCHAR(256) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

-- Notifications table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Notifications')
CREATE TABLE Notifications (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    ApplicationId UNIQUEIDENTIFIER NULL,
    EventType INT NOT NULL,
    TitleAr NVARCHAR(200) NOT NULL,
    TitleEn NVARCHAR(200) NOT NULL,
    MessageAr NVARCHAR(500) NOT NULL,
    MessageEn NVARCHAR(500) NOT NULL,
    IsRead BIT NOT NULL DEFAULT 0,
    ReadAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

-- DrivingCenters table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DrivingCenters')
CREATE TABLE DrivingCenters (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    NameAr NVARCHAR(100) NOT NULL,
    NameEn NVARCHAR(100) NOT NULL,
    Address NVARCHAR(200) NOT NULL,
    City NVARCHAR(50) NOT NULL,
    PhoneNumber NVARCHAR(20) NULL,
    Email NVARCHAR(100) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

-- LicenseCategories table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LicenseCategories')
CREATE TABLE LicenseCategories (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Code NVARCHAR(10) NOT NULL,
    NameAr NVARCHAR(100) NOT NULL,
    NameEn NVARCHAR(100) NOT NULL,
    Description NVARCHAR(200) NULL,
    MinAge INT NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

-- Insert default categories if not exist
IF NOT EXISTS (SELECT * FROM LicenseCategories)
BEGIN
    INSERT INTO LicenseCategories (Id, Code, NameAr, NameEn, Description, MinAge) VALUES
    (NEWID(), 'A', 'دراجة نارية', 'Motorcycle', 'رخصة قيادة دراجة نارية', 16),
    (NEWID(), 'B', 'خصوصي', 'Private Car', 'رخصة قيادة سيارة خصوصية', 18),
    (NEWID(), 'C', 'أجرة عامة', 'Public Taxi', 'رخصة قيادة سيارة أجرة', 20),
    (NEWID(), 'D', 'نقل ثقيل', 'Heavy Vehicle', 'رخصة قيادة مركبة نقل ثقيل', 21),
    (NEWID(), 'E', 'حافلة', 'Bus', 'رخصة قيادة حافلة', 21),
    (NEWID(), 'F', 'زراعي', 'Agricultural', 'رخصة قيادة مركبة زراعية', 18);
END
GO

PRINT 'All missing tables created successfully';
GO