$conn = New-Object System.Data.SqlClient.SqlConnection("Server=.;Database=MojazDb;Trusted_Connection=True;TrustServerCertificate=True")
$conn.Open()
$cmd = $conn.CreateCommand()

Write-Host "=== Hangfire Recurring Jobs ===" -ForegroundColor Cyan

$cmd.CommandText = "SELECT TOP 10 Id, Name, Cron, LastExecution, NextExecution, LastState FROM [HangFire].Job"
$reader = $cmd.ExecuteReader()
while ($reader.Read()) {
    Write-Host "`nJob Name: $($reader['Name'])" -ForegroundColor Yellow
    Write-Host "  Cron: $($reader['Cron'])"
    Write-Host "  Last: $($reader['LastExecution'])"
    Write-Host "  Next: $($reader['NextExecution'])"
}
$reader.Close()

$conn.Close()