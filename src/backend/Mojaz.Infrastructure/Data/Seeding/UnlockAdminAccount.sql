-- ================================================
-- Mojaz Authentication Fix Script
-- Run this in SQL Server to unlock the admin account
-- ================================================

-- Option 1: Unlock specific user by email (recommended)
UPDATE [dbo].[Users] 
SET 
    [IsLocked] = 0,
    [LockoutEnd] = NULL,
    [FailedLoginAttempts] = 0
WHERE [Email] = 'admin@mojaz.gov.sa';

-- Option 2: Unlock all locked users (use with caution)
-- UPDATE [dbo].[Users] 
-- SET 
--     [IsLocked] = 0,
--     [LockoutEnd] = NULL,
--     [FailedLoginAttempts] = 0
-- WHERE [IsLocked] = 1;

-- Verify the unlock
SELECT Id, FullNameEn, Email, IsLocked, LockoutEnd, FailedLoginAttempts, IsActive, IsEmailVerified
FROM [dbo].[Users]
WHERE Email = 'admin@mojaz.gov.sa';