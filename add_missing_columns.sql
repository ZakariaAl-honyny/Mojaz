-- Add missing columns to Applications table
ALTER TABLE [Applications] ADD [AssignedToId] uniqueidentifier NULL;
ALTER TABLE [Applications] ADD [AssignedAt] datetime2 NULL;
ALTER TABLE [Applications] ADD [AssignmentNotes] nvarchar(max) NULL;

-- Add missing columns to Appointments table (if they don't exist)
ALTER TABLE [Appointments] ADD [AssignedToId] uniqueidentifier NULL;
ALTER TABLE [Appointments] ADD [AssignedAt] datetime2 NULL;
ALTER TABLE [Appointments] ADD [Notes] nvarchar(max) NULL;

PRINT 'Missing columns added successfully';
GO
