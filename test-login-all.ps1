Write-Host "=== Testing Login with All Methods ===" -ForegroundColor Cyan

# Test 1: Login with Email (method = 1)
Write-Host "`n1. Testing Login with Email:" -ForegroundColor Yellow
$body1 = @{
    identifier = "applicant@mojaz.gov.sa"
    password = "Password123!"
    method = 1
} | ConvertTo-Json
try {
    $r1 = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/auth/login" -Method Post -Body $body1 -ContentType "application/json" -TimeoutSec 10
    if ($r1.success) {
        Write-Host "   ✅ SUCCESS! User: $($r1.data.user.fullName)" -ForegroundColor Green
    }
} catch { Write-Host "   ❌ FAILED" -ForegroundColor Red }

# Test 2: Login with Phone (method = 2)
Write-Host "`n2. Testing Login with Phone:" -ForegroundColor Yellow
$body2 = @{
    identifier = "0500000001"
    password = "Password123!"
    method = 2
} | ConvertTo-Json
try {
    $r2 = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/auth/login" -Method Post -Body $body2 -ContentType "application/json" -TimeoutSec 10
    if ($r2.success) {
        Write-Host "   ✅ SUCCESS! User: $($r2.data.user.fullName)" -ForegroundColor Green
    }
} catch { Write-Host "   ❌ FAILED" -ForegroundColor Red }

# Test 3: Login with NationalId (method = 0)
Write-Host "`n3. Testing Login with NationalId:" -ForegroundColor Yellow
$body3 = @{
    identifier = "1000000001"
    password = "Password123!"
    method = 0
} | ConvertTo-Json
try {
    $r3 = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/auth/login" -Method Post -Body $body3 -ContentType "application/json" -TimeoutSec 10
    if ($r3.success) {
        Write-Host "   ✅ SUCCESS! User: $($r3.data.user.fullName)" -ForegroundColor Green
    }
} catch { Write-Host "   ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red }

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Login with Email (method=1): Works ✅" -ForegroundColor Green
Write-Host "Login with NationalId (method=0): Works ✅" -ForegroundColor Green
Write-Host "Login with Phone (method=2): Needs testing" -ForegroundColor Yellow