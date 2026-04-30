$ErrorActionPreference = "Stop"

Write-Host "Adding missing columns to Applications table..."

# Database connection
$connectionString = "Server=localhost;Database=MojazDB;Trusted_Connection=True;TrustServerCertificate=True"

Add-Type -AssemblyName "System.Data"

try {
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $connection.Open()
    Write-Host "Connected to database"
} catch {
    Write-Host "Trying with localhost,1433..."
    $connectionString = "Server=localhost,1433;Database=MojazDB;Trusted_Connection=True;TrustServerCertificate=True"
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $connection.Open()
}

# Columns to add to Applications table
$columnsToAdd = @{
    "AdditionalTrainingRequired" = "bit NULL"
    "TheoryAttemptCount" = "int NULL"
    "PracticalAttemptCount" = "int NULL"
    "FinalDecision" = "tinyint NULL"
    "FinalDecisionAt" = "datetime2 NULL"
    "FinalDecisionBy" = "uniqueidentifier NULL"
    "FinalDecisionReason" = "nvarchar(max) NULL"
    "ReturnToStage" = "nvarchar(50) NULL"
    "ManagerNotes" = "nvarchar(max) NULL"
}

$added = 0
$skipped = 0

foreach ($col in $columnsToAdd.Keys) {
    $checkSql = "SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Applications' AND COLUMN_NAME = '$col'"
    $cmd = New-Object System.Data.SqlClient.SqlCommand($checkSql, $connection)
    $result = $cmd.ExecuteScalar()
    
    if ($null -eq $result) {
        $alterSql = "ALTER TABLE Applications ADD $($col) $($columnsToAdd[$col])"
        Write-Host "Adding column: $col ($($columnsToAdd[$col]))"
        
        try {
            $altCmd = New-Object System.Data.SqlClient.SqlCommand($alterSql, $connection)
            $altCmd.ExecuteNonQuery() | Out-Null
            Write-Host "  Added: $col"
            $added++
        } catch {
            Write-Host "  Error adding $col : $_"
        }
    } else {
        Write-Host "  Column '$col' already exists"
        $skipped++
    }
}

$connection.Close()

Write-Host ""
Write-Host "Summary:"
Write-Host "  Columns added: $added"
Write-Host "  Columns skipped (already exist): $skipped"