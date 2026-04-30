$conn = New-Object System.Data.SqlClient.SqlConnection("Server=.;Database=MojazDB;Trusted_Connection=True;TrustServerCertificate=True")
$conn.Open()
$cmd = $conn.CreateCommand()
$cmd.CommandText = "SELECT Email, NationalId, Role FROM Users"
$reader = $cmd.ExecuteReader()
Write-Host "=== All Users ==="
while ($reader.Read()) {
    $email = $reader["Email"]
    $nationalId = $reader["NationalId"]
    $role = $reader["Role"]
    Write-Host "$email | $nationalId | $role"
}
$reader.Close()
$conn.Close()