$conn = New-Object System.Data.SqlClient.SqlConnection("Server=.;Database=MojazDb;Trusted_Connection=True;TrustServerCertificate=True")
$conn.Open()
$cmd = $conn.CreateCommand()
$cmd.CommandText = "SELECT Email, AppRole FROM Users WHERE Email LIKE '%@mojaz.gov.sa'"
$reader = $cmd.ExecuteReader()
while ($reader.Read()) {
    Write-Host $reader['Email'] "-> AppRole:" $reader['AppRole']
}
$reader.Close()
$conn.Close()