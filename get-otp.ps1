$conn = New-Object System.Data.SqlClient.SqlConnection("Server=.;Database=MojazDb;Trusted_Connection=True;TrustServerCertificate=True")
$conn.Open()
$cmd = $conn.CreateCommand()
$cmd.CommandText = "SELECT TOP 5 Id, UserId, CodeHash, Destination, Purpose, ExpiresAt FROM OtpCodes ORDER BY CreatedAt DESC"
$reader = $cmd.ExecuteReader()
while ($reader.Read()) {
    Write-Host "-------------------"
    Write-Host "Id:" $reader['Id']
    Write-Host "UserId:" $reader['UserId']
    Write-Host "Destination:" $reader['Destination']
    Write-Host "Purpose:" $reader['Purpose']
    Write-Host "ExpiresAt:" $reader['ExpiresAt']
}
$reader.Close()
$conn.Close()