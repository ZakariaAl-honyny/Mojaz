-- Fix NULL values in Users table first
UPDATE [Users] SET [Gender] = 0 WHERE [Gender] IS NULL OR [Gender] = '';
UPDATE [Users] SET [BloodType] = 0 WHERE [BloodType] IS NULL OR [BloodType] = '';
UPDATE [Users] SET [ApplicantType] = 0 WHERE [ApplicantType] IS NULL OR [ApplicantType] = '';

-- Convert string values to byte values
UPDATE [Users] SET [Gender] = 1 WHERE LOWER([Gender]) = 'male';
UPDATE [Users] SET [Gender] = 2 WHERE LOWER([Gender]) = 'female';

-- Check current state
SELECT TOP 5 Id, Gender, BloodType, ApplicantType FROM Users;
GO