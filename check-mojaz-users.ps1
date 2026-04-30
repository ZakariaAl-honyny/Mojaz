$conn = New-Object System.Data.SqlClient.SqlConnection("Server=.;Database=MojazDB;Trusted_Connection=True;TrustServerCertificate=True")
$conn.Open()
$cmd = $conn.CreateCommand()
$cmd.CommandText = "SELECT Email, NationalId, Role FROM Users WHERE Email LIKE '%@mojaz.gov.sa'"
$reader = $cmd.ExecuteReader()
Write-Host "=== Users with @mojaz.gov.sa ==="
while ($reader.Read()) {
    $email = $reader["Email"]
    $nationalId = $reader["NationalId"]
    $role = $reader["Role"]
    Write-Host "$email | $nationalId | $role"
}
if (-not $reader.HasRows) {
    Write-Host "No @mojaz.gov.sa users found"
}
$reader.Close()
$conn.Close()