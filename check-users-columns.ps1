$ErrorActionPreference = "Stop"
$connectionString = "Server=localhost;Database=MojazDB;Trusted_Connection=True;TrustServerCertificate=True"

$connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
$connection.Open()

# Get all columns in Users table
$sql = "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users'"
$cmd = New-Object System.Data.SqlClient.SqlCommand($sql, $connection)
$reader = $cmd.ExecuteReader()

Write-Host "Current columns in Users table:"
while ($reader.Read()) {
    Write-Host "  $($reader["COLUMN_NAME"]): $($reader["DATA_TYPE"]) ($($reader["IS_NULLABLE"]))"
}

$reader.Close()
$connection.Close()