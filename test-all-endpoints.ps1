Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   MOJAZ API COMPREHENSIVE TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Login first
Write-Host "`n[1/10] Login to get access token..." -ForegroundColor Yellow
$body = @{
    identifier = "applicant@mojaz.gov.sa"
    password = "Password123!"
    method = 1
} | ConvertTo-Json
$login = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/auth/login" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 30

if ($login.success) {
    $token = $login.data.accessToken
    Write-Host "    ✅ Login successful!" -ForegroundColor Green
} else {
    Write-Host "    ❌ Login failed: $($login.message)" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test each endpoint
Write-Host "`n[2/10] GET /api/v1/Health..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/Health" -Method Get -TimeoutSec 10
    Write-Host "    ✅ Status: $($r.data.status) | Environment: $($r.data.environment)" -ForegroundColor Green
} catch { Write-Host "    ❌ Error" -ForegroundColor Red }

Write-Host "`n[3/10] GET /api/v1/Health/database..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/Health/database" -Method Get -TimeoutSec 10
    Write-Host "    ✅ $($r.data.connectionStatus)" -ForegroundColor Green
} catch { Write-Host "    ❌ Error" -ForegroundColor Red }

Write-Host "`n[4/10] GET /api/v1/LicenseCategories..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/LicenseCategories" -Method Get -TimeoutSec 10
    $count = $r.data.Count
    Write-Host "    ✅ Found $count categories" -ForegroundColor Green
} catch { Write-Host "    ❌ Error" -ForegroundColor Red }

Write-Host "`n[5/10] GET /api/v1/Applications (List - with auth)..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/Applications" -Method Get -Headers $headers -TimeoutSec 10
    Write-Host "    ✅ TotalApplications: $($r.data.totalCount)" -ForegroundColor Green
} catch { Write-Host "    ❌ Error" -ForegroundColor Red }

Write-Host "`n[6/10] GET /api/v1/Applications/eligibility..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/Applications/eligibility?categoryId=00000000-0000-0000-0000-000000000002" -Method Get -Headers $headers -TimeoutSec 10
    if ($r.success) {
        Write-Host "    ✅ Eligible: $($r.data.isEligible)" -ForegroundColor Green
    } else {
        Write-Host "    ⚠️  $($r.message)" -ForegroundColor Yellow
    }
} catch { Write-Host "    ❌ Error" -ForegroundColor Red }

Write-Host "`n[7/10] GET /api/v1/Appointments..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/Appointments" -Method Get -Headers $headers -TimeoutSec 10
    Write-Host "    ✅ Appointments: $($r.data.totalCount)" -ForegroundColor Green
} catch { Write-Host "    ❌ Error" -ForegroundColor Red }

Write-Host "`n[8/10] GET /api/v1/Payments..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/Payments" -Method Get -Headers $headers -TimeoutSec 10
    Write-Host "    ✅ Payments: $($r.data.totalCount)" -ForegroundColor Green
} catch { Write-Host "    ❌ Error" -ForegroundColor Red }

Write-Host "`n[9/10] GET /api/v1/Licenses/mine..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/Licenses/mine" -Method Get -Headers $headers -TimeoutSec 10
    Write-Host "    ✅ Licenses: $($r.data.totalCount)" -ForegroundColor Green
} catch { Write-Host "    ❌ Error" -ForegroundColor Red }

Write-Host "`n[10/10] GET /api/v1/notifications..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/notifications" -Method Get -Headers $headers -TimeoutSec 10
    Write-Host "    ✅ Notifications: $($r.data.totalCount)" -ForegroundColor Green
} catch { Write-Host "    ❌ Error" -ForegroundColor Red }

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   TEST COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan