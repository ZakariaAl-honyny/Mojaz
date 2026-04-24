$conn = New-Object System.Data.SqlClient.SqlConnection("Server=.;Database=MojazDb;Trusted_Connection=True;TrustServerCertificate=True")
$conn.Open()
$cmd = $conn.CreateCommand()
$cmd.CommandText = "SELECT * FROM SystemSettings WHERE SettingKey LIKE 'MIN_AGE%'"
$reader = $cmd.ExecuteReader()
$table = $reader.GetSchemaTable()
foreach ($row in $table) {
    Write-Host $row["ColumnName"]
}
$reader.Close()
$conn.Close()
