$conn = New-Object System.Data.SqlClient.SqlConnection("Server=.;Database=MojazDb;Trusted_Connection=True;TrustServerCertificate=True")
$conn.Open()
$cmd = $conn.CreateCommand()

Write-Host "=== Hangfire Jobs ===" -ForegroundColor Cyan

$cmd.CommandText = "SELECT TOP 20 Id, JobType, StateName, CreatedAt FROM Hangfire.Job ORDER BY CreatedAt DESC"
$reader = $cmd.ExecuteReader()
$count = 0
while ($reader.Read() -and $count -lt 10) {
    Write-Host "Job $($reader['Id']): $($reader['JobType']) - $($reader['StateName']) - $($reader['CreatedAt'])"
    $count++
}
$reader.Close()

if ($count -eq 0) {
    Write-Host "No jobs found in database"
}

$conn.Close()