# Quick Test Reference for Mojaz API

## Start API
cd C:\Users\ALlahabi\Desktop\cmder\Mojaz\src\backend\Mojaz.API
dotnet run

## Access Points
- Swagger UI: http://localhost:5013/swagger/index.html
- Health: http://localhost:5013/api/v1/health

## Quick Tests
Invoke-RestMethod -Uri "http://localhost:5013/api/v1/health" -Method Get
Invoke-RestMethod -Uri "http://localhost:5013/api/v1/testing/ping" -Method Get

## Database Query
$conn = New-Object System.Data.SqlClient.SqlConnection("Server=.;Database=MojazDb;Trusted_Connection=True;TrustServerCertificate=True")
$conn.Open()
$cmd = $conn.CreateCommand()
$cmd.CommandText = "SELECT COUNT(*) FROM Users"
$cmd.ExecuteScalar()
$conn.Close()

## Test Scripts Available
- get-users.ps1 - List users
- verify-db-data.ps1 - Verify database has data
- start-api-fresh.ps1 - Start API fresh
- get-tables.ps1 - List database tables