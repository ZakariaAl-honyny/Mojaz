# Test Appointments Endpoints with better error handling
$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   MOJAZ APPOINTMENTS ENDPOINTS TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Login first
Write-Host "`n[1] Login to get access token..." -ForegroundColor Yellow
$body = @{
    identifier = "admin@mojaz.gov.sa"
    password = "Admin123!"
    method = 1
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/auth/login" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 30 -ErrorAction Stop
    if ($login.success) {
        $token = $login.data.accessToken
        Write-Host "    ✅ Login successful! Token obtained" -ForegroundColor Green
    } else {
        Write-Host "    ❌ Login failed: $($login.message)" -ForegroundColor Red
        Write-Host "    Full response: $($login | ConvertTo-Json)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "    ❌ Login Exception: $($_.Exception.Message)" -ForegroundColor Red
    $resp = $_.Exception.Response
    if ($resp) {
        Write-Host "    Status Code: $($resp.StatusCode)" -ForegroundColor Yellow
        $stream = $resp.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $content = $reader.ReadToEnd()
        Write-Host "    Response: $content" -ForegroundColor Yellow
    }
}

if (-not $token) {
    Write-Host "`n❌ Cannot proceed without token. Exiting." -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test 1: Get Available Slots
Write-Host "`n[2] GET /api/v1/appointments/available-slots..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/appointments/available-slots?type=0&date=2026-05-01" -Method Get -Headers $headers -TimeoutSec 10
    Write-Host "    ✅ Status: Success=$($r.success), StatusCode=$($r.statusCode)" -ForegroundColor Green
    Write-Host "    Message: $($r.message)" -ForegroundColor Cyan
    if ($r.data) { Write-Host "    Data: $($r.data | ConvertTo-Json -Depth 2)" -ForegroundColor Gray }
} catch { 
    Write-Host "    ❌ Error: $($_.Exception.Message)" -ForegroundColor Red 
}

# Test 2: Get My Appointments
Write-Host "`n[3] GET /api/v1/appointments/my-appointments..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/appointments/my-appointments" -Method Get -Headers $headers -TimeoutSec 10
    Write-Host "    ✅ Status: Success=$($r.success), StatusCode=$($r.statusCode)" -ForegroundColor Green
    Write-Host "    Message: $($r.message)" -ForegroundColor Cyan
    if ($r.data) { Write-Host "    Total: $($r.data.totalCount)" -ForegroundColor Gray }
} catch { 
    Write-Host "    ❌ Error: $($_.Exception.Message)" -ForegroundColor Red 
}

# Test 3: Validate Booking (POST)
Write-Host "`n[4] POST /api/v1/appointments/validate..." -ForegroundColor Yellow
$validateBody = @{
    applicationId = "00000000-0000-0000-0000-000000000001"
    appointmentType = 0
    branchId = "00000000-0000-0000-0000-000000000001"
    slotId = "00000000-0000-0000-0000-000000000001"
    scheduledDate = "2026-05-01"
} | ConvertTo-Json
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/appointments/validate" -Method Post -Headers $headers -Body $validateBody -TimeoutSec 10
    Write-Host "    ✅ Status: Success=$($r.success), StatusCode=$($r.statusCode)" -ForegroundColor Green
    Write-Host "    Message: $($r.message)" -ForegroundColor Cyan
} catch { 
    Write-Host "    ❌ Error: $($_.Exception.Message)" -ForegroundColor Red 
}

# Test 4: Get Appointments by Application
Write-Host "`n[5] GET /api/v1/appointments/application/{id}..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/appointments/application/00000000-0000-0000-0000-000000000001" -Method Get -Headers $headers -TimeoutSec 10
    Write-Host "    ✅ Status: Success=$($r.success), StatusCode=$($r.statusCode)" -ForegroundColor Green
    Write-Host "    Message: $($r.message)" -ForegroundColor Cyan
} catch { 
    Write-Host "    ❌ Error: $($_.Exception.Message)" -ForegroundColor Red 
}

# Test 5: Get Single Appointment
Write-Host "`n[6] GET /api/v1/appointments/{id}..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/appointments/00000000-0000-0000-0000-000000000001" -Method Get -Headers $headers -TimeoutSec 10
    Write-Host "    ✅ Status: Success=$($r.success), StatusCode=$($r.statusCode)" -ForegroundColor Green
    Write-Host "    Message: $($r.message)" -ForegroundColor Cyan
} catch { 
    Write-Host "    ❌ Error: $($_.Exception.Message)" -ForegroundColor Red 
}

# Test 6: Get Attendance (Employee)
Write-Host "`n[7] GET /api/v1/appointments/attendance..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/appointments/attendance" -Method Get -Headers $headers -TimeoutSec 10
    Write-Host "    ✅ Status: Success=$($r.success), StatusCode=$($r.statusCode)" -ForegroundColor Green
    Write-Host "    Message: $($r.message)" -ForegroundColor Cyan
} catch { 
    Write-Host "    ❌ Error: $($_.Exception.Message)" -ForegroundColor Red 
}

# Test 7: Create Appointment
Write-Host "`n[8] POST /api/v1/appointments..." -ForegroundColor Yellow
$createBody = @{
    applicationId = "00000000-0000-0000-0000-000000000001"
    appointmentType = 0
    branchId = "00000000-0000-0000-0000-000000000001"
    slotId = "00000000-0000-0000-0000-000000000001"
    scheduledDate = "2026-05-01"
} | ConvertTo-Json
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/appointments" -Method Post -Headers $headers -Body $createBody -TimeoutSec 10
    Write-Host "    ✅ Status: Success=$($r.success), StatusCode=$($r.statusCode)" -ForegroundColor Green
    Write-Host "    Message: $($r.message)" -ForegroundColor Cyan
} catch { 
    Write-Host "    ❌ Error: $($_.Exception.Message)" -ForegroundColor Red 
}

# Test 8: Reschedule Appointment
Write-Host "`n[9] PATCH /api/v1/appointments/{id}/reschedule..." -ForegroundColor Yellow
$rescheduleBody = @{
    newSlotId = "00000000-0000-0000-0000-000000000001"
    newScheduledDate = "2026-05-05"
} | ConvertTo-Json
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/appointments/00000000-0000-0000-0000-000000000001/reschedule" -Method Patch -Headers $headers -Body $rescheduleBody -TimeoutSec 10
    Write-Host "    ✅ Status: Success=$($r.success), StatusCode=$($r.statusCode)" -ForegroundColor Green
    Write-Host "    Message: $($r.message)" -ForegroundColor Cyan
} catch { 
    Write-Host "    ❌ Error: $($_.Exception.Message)" -ForegroundColor Red 
}

# Test 9: Cancel Appointment
Write-Host "`n[10] PATCH /api/v1/appointments/{id}/cancel..." -ForegroundColor Yellow
$cancelBody = @{
    reason = "Test cancellation reason"
} | ConvertTo-Json
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/appointments/00000000-0000-0000-0000-000000000001/cancel" -Method Patch -Headers $headers -Body $cancelBody -TimeoutSec 10
    Write-Host "    ✅ Status: Success=$($r.success), StatusCode=$($r.statusCode)" -ForegroundColor Green
    Write-Host "    Message: $($r.message)" -ForegroundColor Cyan
} catch { 
    Write-Host "    ❌ Error: $($_.Exception.Message)" -ForegroundColor Red 
}

# Test 10: Check-in Appointment
Write-Host "`n[11] PATCH /api/v1/appointments/{id}/check-in..." -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/appointments/00000000-0000-0000-0000-000000000001/check-in" -Method Patch -Headers $headers -TimeoutSec 10
    Write-Host "    ✅ Status: Success=$($r.success), StatusCode=$($r.statusCode)" -ForegroundColor Green
    Write-Host "    Message: $($r.message)" -ForegroundColor Cyan
} catch { 
    Write-Host "    ❌ Error: $($_.Exception.Message)" -ForegroundColor Red 
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   TEST COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan