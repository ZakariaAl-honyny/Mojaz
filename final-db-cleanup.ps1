$ErrorActionPreference = "Stop"
$connectionString = "Server=localhost;Database=MojazDB;Trusted_Connection=True;TrustServerCertificate=True"

$connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
$connection.Open()

# Fix the specific user with conflicting roles and bad name
$sql = "UPDATE Users SET FullNameAr = N'زكريا الحنيني', FullNameEn = 'Zakaria Al-Honyny', Role = 5, AppRole = 5 WHERE Email = 'zkryaalhnyny5@gmail.com'"
$cmd = New-Object System.Data.SqlClient.SqlCommand($sql, $connection)
$rows = $cmd.ExecuteNonQuery()
Write-Host "Updated $rows user(s) for zkryaalhnyny5@gmail.com"

# Check for other '99' users and fix them if they are supposed to be Security
$sql = "UPDATE Users SET FullNameAr = N'موظف أمن', FullNameEn = 'Security Officer', Role = 5, AppRole = 5 WHERE FullNameAr LIKE '%99%' OR NationalId LIKE '%99%'"
$cmd = New-Object System.Data.SqlClient.SqlCommand($sql, $connection)
$rows = $cmd.ExecuteNonQuery()
Write-Host "Updated $rows other '99' user(s)"

$connection.Close()
