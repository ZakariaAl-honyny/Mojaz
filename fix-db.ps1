$ErrorActionPreference = "Stop"

# SQL script to add missing columns
$sqlScript = @"
-- Add missing columns to Users table
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'AppRole')
BEGIN
    ALTER TABLE Users ADD AppRole tinyint NULL;
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'AppointmentPreference')
BEGIN
    ALTER TABLE Users ADD AppointmentPreference nvarchar(10) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'EnableEmail')
BEGIN
    ALTER TABLE Users ADD EnableEmail bit NULL;
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'EnablePush')
BEGIN
    ALTER TABLE Users ADD EnablePush bit NULL;
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'EnableSms')
BEGIN
    ALTER TABLE Users ADD EnableSms bit NULL;
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'IsSecurityBlocked')
BEGIN
    ALTER TABLE Users ADD IsSecurityBlocked bit NULL;
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'RequiresPasswordReset')
BEGIN
    ALTER TABLE Users ADD RequiresPasswordReset bit NULL;
END
GO
"@

# Save SQL script
$sqlScript | Out-File -FilePath ".\add_missing_columns.sql" -Encoding UTF8

Write-Host "SQL script saved to add_missing_columns.sql"
Write-Host "Running the script..."

# Run using sqlcmd
$connectionString = "Server=localhost;Database=MojazDB;Trusted_Connection=True;TrustServerCertificate=True"

# Try to add columns using .NET SqlClient
Add-Type -AssemblyName "System.Data"

$connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
$connection.Open()

Write-Host "Connected to database"

# Check and add each column
$columnsToAdd = @{
    "AppRole" = "tinyint NULL"
    "AppointmentPreference" = "nvarchar(10) NULL"
    "EnableEmail" = "bit NULL"
    "EnablePush" = "bit NULL"
    "EnableSms" = "bit NULL"
    "IsSecurityBlocked" = "bit NULL"
    "RequiresPasswordReset" = "bit NULL"
}

foreach ($col in $columnsToAdd.Keys) {
    $checkSql = "SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = '$col'"
    $cmd = New-Object System.Data.SqlClient.SqlCommand($checkSql, $connection)
    $result = $cmd.ExecuteScalar()
    
    if ($null -eq $result) {
        $alterSql = "ALTER TABLE Users ADD $($col) $($columnsToAdd[$col])"
        Write-Host "Adding column: $col"
        
        try {
            $altCmd = New-Object System.Data.SqlClient.SqlCommand($alterSql, $connection)
            $altCmd.ExecuteNonQuery() | Out-Null
            Write-Host "  Added: $col"
        } catch {
            Write-Host "  Error adding $col : $_"
        }
    } else {
        Write-Host "Column $col already exists"
    }
}

$connection.Close()

Write-Host "Done!"