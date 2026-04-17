$conn = New-Object System.Data.SqlClient.SqlConnection("Server=.;Database=MojazDb;Trusted_Connection=True;TrustServerCertificate=True")
$conn.Open()
$cmd = $conn.CreateCommand()

Write-Host "=== Job Table Columns ===" -ForegroundColor Cyan
$cmd.CommandText = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Job'"
$reader = $cmd.ExecuteReader()
$columns = @()
while ($reader.Read()) {
    $col = $reader['COLUMN_NAME']
    $columns += $col
    Write-Host "  $col"
}
$reader.Close()

Write-Host "`n=== Top 5 Jobs ===" -ForegroundColor Cyan
$colsToSelect = $columns -join ", "
$cmd.CommandText = "SELECT TOP 5 $colsToSelect FROM Hangfire.Job ORDER BY CreatedAt DESC"
$reader = $cmd.ExecuteReader()
$count = 0
while ($reader.Read()) {
    Write-Host "--- Job $($count + 1) ---"
    foreach ($col in $columns) {
        Write-Host "  $col`: $($reader[$col])"
    }
    $count++
    if ($count -ge 5) { break }
}
$reader.Close()

$conn.Close()