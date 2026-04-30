$ErrorActionPreference = "Stop"
$connectionString = "Server=localhost;Database=MojazDB;Trusted_Connection=True;TrustServerCertificate=True"

$connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
$connection.Open()

# Check all users and their roles
$sql = "SELECT Id, Email, Role FROM Users"
$cmd = New-Object System.Data.SqlClient.SqlCommand($sql, $connection)
$reader = $cmd.ExecuteReader()

Write-Host "Users in database:"
while ($reader.Read()) {
    Write-Host "  Id: $($reader["Id"]) | Email: $($reader["Email"]) | Role: $($reader["Role"]) (type: $($reader["Role"].GetType().Name)"
}

$reader.Close()
$connection.Close()