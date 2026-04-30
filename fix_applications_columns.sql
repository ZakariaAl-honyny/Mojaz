-- Add missing columns to Applications table
-- Based on ApplicationEntity: AdditionalTrainingRequired, FinalDecision, FinalDecisionAt, 
-- FinalDecisionBy, FinalDecisionReason, ManagerNotes, PracticalAttemptCount, ReturnToStage, TheoryAttemptCount

-- AdditionalTrainingRequired (bool → bit)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'AdditionalTrainingRequired')
BEGIN
    ALTER TABLE Applications ADD AdditionalTrainingRequired bit NULL;
END
GO

-- TheoryAttemptCount (int)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'TheoryAttemptCount')
BEGIN
    ALTER TABLE Applications ADD TheoryAttemptCount int NULL;
END
GO

-- PracticalAttemptCount (int)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'PracticalAttemptCount')
BEGIN
    ALTER TABLE Applications ADD PracticalAttemptCount int NULL;
END
GO

-- FinalDecision (FinalDecisionType enum: tinyint)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'FinalDecision')
BEGIN
    ALTER TABLE Applications ADD FinalDecision tinyint NULL;
END
GO

-- FinalDecisionAt (DateTime → datetime2)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'FinalDecisionAt')
BEGIN
    ALTER TABLE Applications ADD FinalDecisionAt datetime2 NULL;
END
GO

-- FinalDecisionBy (Guid → uniqueidentifier)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'FinalDecisionBy')
BEGIN
    ALTER TABLE Applications ADD FinalDecisionBy uniqueidentifier NULL;
END
GO

-- FinalDecisionReason (string → nvarchar)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'FinalDecisionReason')
BEGIN
    ALTER TABLE Applications ADD FinalDecisionReason nvarchar(max) NULL;
END
GO

-- ReturnToStage (string → nvarchar)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'ReturnToStage')
BEGIN
    ALTER TABLE Applications ADD ReturnToStage nvarchar(50) NULL;
END
GO

-- ManagerNotes (string → nvarchar)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = 'ManagerNotes')
BEGIN
    ALTER TABLE Applications ADD ManagerNotes nvarchar(max) NULL;
END
GO

-- Verify columns were added
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Applications' 
AND COLUMN_NAME IN (
    'AdditionalTrainingRequired', 'TheoryAttemptCount', 'PracticalAttemptCount',
    'FinalDecision', 'FinalDecisionAt', 'FinalDecisionBy', 
    'FinalDecisionReason', 'ReturnToStage', 'ManagerNotes'
)
ORDER BY COLUMN_NAME;
GO