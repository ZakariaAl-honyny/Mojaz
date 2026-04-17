$conn = New-Object System.Data.SqlClient.SqlConnection("Server=.;Database=MojazDb;Trusted_Connection=True;TrustServerCertificate=True")
$conn.Open()
$cmd = $conn.CreateCommand()
$cmd.CommandText = "SELECT TOP 10 Id, NationalId, Email, PasswordHash, FailedLoginAttempts, LockoutEnd FROM Users WHERE Email = 'applicant@mojaz.gov.sa'"
$reader = $cmd.ExecuteReader()
while ($reader.Read()) {
    Write-Host "Id: $($reader['Id'])"
    Write-Host "NationalId: $($reader['NationalId'])"
    Write-Host "Email: $($reader['Email'])"
    Write-Host "PasswordHash: $($reader['PasswordHash'].ToString().Substring(0, 20))..."
    Write-Host "FailedLoginAttempts: $($reader['FailedLoginAttempts'])"
    Write-Host "LockoutEnd: $($reader['LockoutEnd'])"
}
$reader.Close()
$conn.Close()