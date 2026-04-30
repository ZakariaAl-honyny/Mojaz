$ErrorActionPreference = "Stop"
$connectionString = "Server=localhost;Database=MojazDB;Trusted_Connection=True;TrustServerCertificate=True"

$connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
$connection.Open()

# Fix the security user data
$sql = "UPDATE Users SET FullNameAr = N'زكريا الحنيني (أمن)', FullNameEn = 'Zakaria Alhonyny (Security)', Role = 5, AppRole = 5 WHERE Email = 'zkryaalhnyny5@gmail.com'"
$cmd = New-Object System.Data.SqlClient.SqlCommand($sql, $connection)
$rows = $cmd.ExecuteNonQuery()

Write-Host "Updated $rows user(s)."

$connection.Close()
