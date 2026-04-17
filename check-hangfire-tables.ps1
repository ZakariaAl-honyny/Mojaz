$conn = New-Object System.Data.SqlClient.SqlConnection("Server=.;Database=MojazDb;Trusted_Connection=True;TrustServerCertificate=True")
$conn.Open()
$cmd = $conn.CreateCommand()

Write-Host "=== Hangfire Tables ===" -ForegroundColor Cyan

$cmd.CommandText = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE '%Hangfire%' OR TABLE_NAME LIKE '%Job%' OR TABLE_NAME LIKE '%State%' OR TABLE_NAME LIKE '%Queue%'"
$reader = $cmd.ExecuteReader()
while ($reader.Read()) {
    Write-Host "  $($reader['TABLE_NAME'])"
}
$reader.Close()

Write-Host "`n=== Recurring Jobs ===" -ForegroundColor Cyan
$cmd.CommandText = "SELECT * FROM [Set] WHERE [Key] LIKE '%recurring-job%'"
$reader = $cmd.ExecuteReader()
while ($reader.Read()) {
    Write-Host "  $($reader['Key']) = $($reader['Value'])"
}
$reader.Close()

$conn.Close()