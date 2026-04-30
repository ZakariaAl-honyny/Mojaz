$ErrorActionPreference = "Stop"
$connectionString = "Server=localhost;Database=MojazDB;Trusted_Connection=True;TrustServerCertificate=True"

$connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
$connection.Open()

# Find users with '99' in name or special role
$sql = "SELECT Id, Email, Role, FullNameAr, NationalId FROM Users WHERE FullNameAr LIKE '%99%' OR FullNameEn LIKE '%99%' OR NationalId LIKE '%99%'"
$cmd = New-Object System.Data.SqlClient.SqlCommand($sql, $connection)
$reader = $cmd.ExecuteReader()

Write-Host "Searching for '99' users:"
while ($reader.Read()) {
    Write-Host "  Id: $($reader["Id"]) | Name: $($reader["FullNameAr"]) | ID: $($reader["NationalId"]) | Email: $($reader["Email"]) | Role: $($reader["Role"])"
}

$reader.Close()
$connection.Close()
