$connectionString = "Server=localhost;Database=MojazDB;Trusted_Connection=True;TrustServerCertificate=True"
Add-Type -AssemblyName "System.Data"
$connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
$connection.Open()

$checkSql = @"
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Applications' 
AND COLUMN_NAME IN (
    'AdditionalTrainingRequired', 'TheoryAttemptCount', 'PracticalAttemptCount',
    'FinalDecision', 'FinalDecisionAt', 'FinalDecisionBy', 
    'FinalDecisionReason', 'ReturnToStage', 'ManagerNotes'
)
ORDER BY COLUMN_NAME
"@

$cmd = New-Object System.Data.SqlClient.SqlCommand($checkSql, $connection)
$reader = $cmd.ExecuteReader()

Write-Host "Verified columns in Applications table:"
Write-Host "---------------------------------------"
while ($reader.Read()) {
    $colName = $reader["COLUMN_NAME"]
    $dataType = $reader["DATA_TYPE"]
    $nullable = if ($reader["IS_NULLABLE"] -eq "YES") { "NULL" } else { "NOT NULL" }
    Write-Host "$colName : $dataType $nullable"
}

$connection.Close()