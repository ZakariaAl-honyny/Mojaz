$ErrorActionPreference = "Stop"
$connectionString = "Server=localhost;Database=MojazDB;Trusted_Connection=True;TrustServerCertificate=True"

$connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
$connection.Open()

# Check all users with full details
$sql = "SELECT Id, Email, Role, FullNameAr, NationalId FROM Users"
$cmd = New-Object System.Data.SqlClient.SqlCommand($sql, $connection)
$reader = $cmd.ExecuteReader()

Write-Host "Detailed user list:"
while ($reader.Read()) {
    Write-Host "  Id: $($reader["Id"]) | Name: $($reader["FullNameAr"]) | ID: $($reader["NationalId"]) | Email: $($reader["Email"]) | Role: $($reader["Role"])"
}

$reader.Close()
$connection.Close()
