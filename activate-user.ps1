$conn = New-Object System.Data.SqlClient.SqlConnection("Server=.;Database=MojazDb;Trusted_Connection=True;TrustServerCertificate=True")
$conn.Open()
$cmd = $conn.CreateCommand()
$cmd.CommandText = "UPDATE Users SET IsEmailVerified = 1 WHERE Email = 'testuser2024@example.com'"
$result = $cmd.ExecuteNonQuery()
Write-Host "Updated rows: $result"
$conn.Close()
