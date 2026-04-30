$ErrorActionPreference = "Stop"
$connectionString = "Server=localhost;Database=MojazDB;Trusted_Connection=True;TrustServerCertificate=True"

$connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
$connection.Open()

# Check specific user role columns
$sql = "SELECT Id, FullNameAr, Role, AppRole FROM Users WHERE Email = 'zkryaalhnyny5@gmail.com'"
$cmd = New-Object System.Data.SqlClient.SqlCommand($sql, $connection)
$reader = $cmd.ExecuteReader()

while ($reader.Read()) {
    Write-Host "User: $($reader["FullNameAr"])"
    Write-Host "Role: $($reader["Role"])"
    Write-Host "AppRole: $($reader["AppRole"])"
}

$reader.Close()
$connection.Close()
