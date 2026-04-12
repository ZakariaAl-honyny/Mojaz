-- Drop all tables if exist (in correct order due to foreign keys)
IF OBJECT_ID('Applications', 'U') IS NOT NULL DROP TABLE Applications;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
IF OBJECT_ID('OtpCodes', 'U') IS NOT NULL DROP TABLE OtpCodes;
IF OBJECT_ID('RefreshTokens', 'U') IS NOT NULL DROP TABLE RefreshTokens;
IF OBJECT_ID('AuditLogs', 'U') IS NOT NULL DROP TABLE AuditLogs;
IF OBJECT_ID('Notifications', 'U') IS NOT NULL DROP TABLE Notifications;
GO

-- Recreate Users table
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    FullNameAr NVARCHAR(100) NOT NULL,
    FullNameEn NVARCHAR(100) NOT NULL,
    NationalId NVARCHAR(20) NULL,
    Email NVARCHAR(100) NULL,
    PhoneNumber NVARCHAR(20) NULL,
    PasswordHash NVARCHAR(256) NOT NULL,
    Role INT NOT NULL,
    DateOfBirth DATETIME2 NULL,
    Gender NVARCHAR(10) NULL,
    Nationality NVARCHAR(50) NULL,
    BloodType NVARCHAR(5) NULL,
    Address NVARCHAR(200) NULL,
    City NVARCHAR(50) NULL,
    Region NVARCHAR(50) NULL,
    ApplicantType NVARCHAR(30) NULL,
    PreferredLanguage NVARCHAR(10) NOT NULL DEFAULT 'ar',
    NotificationPreferences NVARCHAR(200) NULL,
    RegistrationMethod NVARCHAR(20) NOT NULL,
    IsEmailVerified BIT NOT NULL DEFAULT 0,
    IsPhoneVerified BIT NOT NULL DEFAULT 0,
    EmailVerifiedAt DATETIME2 NULL,
    PhoneVerifiedAt DATETIME2 NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    IsLocked BIT NOT NULL DEFAULT 0,
    FailedLoginAttempts INT NOT NULL DEFAULT 0,
    LockoutEnd DATETIME2 NULL,
    LastLoginAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedAt DATETIME2 NULL,
    DeletedBy UNIQUEIDENTIFIER NULL
);
GO

PRINT 'Users table recreated';
GO