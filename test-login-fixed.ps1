$body = @{
    identifier = "applicant@mojaz.gov.sa"
    password = "Password123!"
    method = 0
} | ConvertTo-Json

Write-Host "Testing Login with identifier..."
$response = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/auth/login" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 30 -ErrorAction SilentlyContinue

if ($response) {
    Write-Host "Success! Access Token: $($response.data.accessToken.Substring(0, 20))..."
    Write-Host "Full Name: $($response.data.user.fullName)"
    Write-Host "Role: $($response.data.user.role)"
} else {
    Write-Host "FAILED - checking error details..."
}

# Also test with NationalId
Write-Host "`nTesting Login with NationalId..."
$body2 = @{
    identifier = "1000000001"
    password = "Password123!"
    method = 2
} | ConvertTo-Json

$response2 = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/auth/login" -Method Post -Body $body2 -ContentType "application/json" -TimeoutSec 30 -ErrorAction SilentlyContinue

if ($response2) {
    Write-Host "Success with NationalId!"
}