$conn = New-Object System.Data.SqlClient.SqlConnection("Server=.;Database=MojazDb;Trusted_Connection=True;TrustServerCertificate=True")
$conn.Open()
$cmd = $conn.CreateCommand()

Write-Host "=== Database Verification ==="

$cmd.CommandText = "SELECT COUNT(*) FROM Users"
$userCount = $cmd.ExecuteScalar()
Write-Host "Users: $userCount"

$cmd.CommandText = "SELECT COUNT(*) FROM Applications"
$appCount = $cmd.ExecuteScalar()
Write-Host "Applications: $appCount"

$cmd.CommandText = "SELECT COUNT(*) FROM Licenses"
$licCount = $cmd.ExecuteScalar()
Write-Host "Licenses: $licCount"

$cmd.CommandText = "SELECT COUNT(*) FROM LicenseCategories"
$catCount = $cmd.ExecuteScalar()
Write-Host "License Categories: $catCount"

$cmd.CommandText = "SELECT COUNT(*) FROM OtpCodes"
$otpCount = $cmd.ExecuteScalar()
Write-Host "OTP Codes: $otpCount"

$cmd.CommandText = "SELECT COUNT(*) FROM Notifications"
$notifCount = $cmd.ExecuteScalar()
Write-Host "Notifications: $notifCount"

$cmd.CommandText = "SELECT COUNT(*) FROM SystemSettings"
$setCount = $cmd.ExecuteScalar()
Write-Host "System Settings: $setCount"

Write-Host "`n=== Recent Users ==="
$cmd.CommandText = "SELECT TOP 3 FullNameAr, Email, NationalId FROM Users ORDER BY CreatedAt DESC"
$reader = $cmd.ExecuteReader()
while ($reader.Read()) {
    Write-Host "  - $($reader['FullNameAr']) ($($reader['Email']))"
}
$reader.Close()

$conn.Close()
Write-Host "`n✅ Database verification complete!"