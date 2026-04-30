$ErrorActionPreference = "Stop"
$connectionString = "Server=localhost;Database=MojazDB;Trusted_Connection=True;TrustServerCertificate=True"

$connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
$connection.Open()

# Check Role column type
$sql = "SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'Role'"
$cmd = New-Object System.Data.SqlClient.SqlCommand($sql, $connection)
$roleType = $cmd.ExecuteScalar()

Write-Host "Current Role type: $roleType"
Write-Host "Changing Role to tinyint..."

# Change Role column type to tinyint
$alterSql = @"
ALTER TABLE Users ALTER COLUMN Role tinyint NOT NULL;
"@

$altCmd = New-Object System.Data.SqlClient.SqlCommand($alterSql, $connection)
$altCmd.ExecuteNonQuery() | Out-Null

Write-Host "Done!"
$connection.Close()