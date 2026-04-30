# Test admin login
$body = @{
    identifier = "admin@mojaz.com"
    password = "Password123!"
    method = 1
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/auth/login" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 30
    Write-Host "ADMIN Result: $($login | ConvertTo-Json -Depth 5)"
} catch {
    Write-Host "ADMIN Error Status: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "ADMIN Error: $($_.Exception.Message)"
}