# Mojaz API Complete Test Script
# Tests all API endpoints for Users, Dashboards, Audit Logs, Settings, License Categories

$baseUrl = "http://localhost:5013"
$results = @()

function Test-ApiEndpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [hashtable]$Headers = @{},
        [object]$Body = $null
    )
    
    $url = "$baseUrl$Endpoint"
    $webResponse = $null
    $statusCode = 0
    
    try {
        $params = @{
            Uri = $url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
            TimeoutSec = 30
        }
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 5)
        }
        
        $webResponse = Invoke-RestMethod @params -ErrorAction Stop
        $statusCode = 200
        $success = $true
    } catch {
        $statusCode = [int]$_.Exception.Response.StatusCode
        $success = $false
    }
    
    return @{
        Name = $Name
        Method = $Method
        Endpoint = $Endpoint
        StatusCode = $statusCode
        Success = $success
        Data = $webResponse
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MOJAZ API COMPREHENSIVE TEST" -ForegroundColor Cyan
Write-Host "  Users, Admin & Settings" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# ============================================================================
# TEST 1: Public Endpoints (Should work without auth)
# ============================================================================

Write-Host "`n--- PUBLIC ENDPOINTS ---" -ForegroundColor Yellow

$r = Test-ApiEndpoint -Name "License Categories" -Method "GET" -Endpoint "/api/v1/license-categories"
$results += $r
if ($r.Success) {
    Write-Host "✅ PASS | GET /api/v1/license-categories | Status: $($r.StatusCode)" -ForegroundColor Green
} else {
    Write-Host "❌ FAIL | GET /api/v1/license-categories | Status: $($r.StatusCode) - $($r.Data.message)" -ForegroundColor Red
}

# ============================================================================
# TEST 2: Login (Get Token)
# ============================================================================

Write-Host "`n--- AUTHENTICATION ---" -ForegroundColor Yellow

$loginBody = @{
    identifier = "admin@mojaz.gov.sa"
    password = "Admin123!"
    method = 1
}

$loginResult = Test-ApiEndpoint -Name "Admin Login" -Method "POST" -Endpoint "/api/v1/auth/login" -Body $loginBody
$results += $loginResult

$adminToken = $null
if ($loginResult.Success -and $loginResult.Data.success) {
    $adminToken = $loginResult.Data.data.accessToken
    Write-Host "✅ PASS | POST /api/v1/auth/login | Status: $($loginResult.StatusCode)" -ForegroundColor Green
} else {
    Write-Host "❌ FAIL | POST /api/v1/auth/login | Status: $($loginResult.StatusCode) - $($loginResult.Data.message)" -ForegroundColor Red
}

# ============================================================================
# TEST 3-7: Authenticated Endpoints
# ============================================================================

if ($adminToken) {
    $authHeaders = @{
        "Authorization" = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }
    
    Write-Host "`n--- ADMIN ENDPOINTS ---" -ForegroundColor Yellow
    
    # Test: GET Users List
    $r = Test-ApiEndpoint -Name "Get Users List" -Method "GET" -Endpoint "/api/v1/users?page=1&pageSize=20" -Headers $authHeaders
    $results += $r
    if ($r.Success) {
        Write-Host "✅ PASS | GET /api/v1/users | Status: $($r.StatusCode) | Total: $($r.Data.data.totalCount)" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL | GET /api/v1/users | Status: $($r.StatusCode)" -ForegroundColor Red
    }
    
    # Test: GET User by ID (try first user from list if exists)
    if ($r.Success -and $r.Data.data.items.Count -gt 0) {
        $userId = $r.Data.data.items[0].id
        $r2 = Test-ApiEndpoint -Name "Get User by ID" -Method "GET" -Endpoint "/api/v1/users/$userId" -Headers $authHeaders
        $results += $r2
        if ($r2.Success) {
            Write-Host "✅ PASS | GET /api/v1/users/$($userId.ToString().Substring(0,8)) | Status: $($r2.StatusCode)" -ForegroundColor Green
        } else {
            Write-Host "❌ FAIL | GET /api/v1/users/{id} | Status: $($r2.StatusCode)" -ForegroundColor Red
        }
    }
    
    # Test: POST Create User
    $newUserBody = @{
        email = "testuser$([System.Guid]::NewGuid().ToString('N').Substring(0,8))@example.com"
        phone = "+967711111111"
        password = "TestPass@123456"
        fullName = "مستخدم جديد"
        nationalId = "1111111111"
        role = 6
    }
    $r3 = Test-ApiEndpoint -Name "Create User" -Method "POST" -Endpoint "/api/v1/users" -Headers $authHeaders -Body $newUserBody
    $results += $r3
    if ($r3.Success) {
        Write-Host "✅ PASS | POST /api/v1/users | Status: $($r3.StatusCode)" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL | POST /api/v1/users | Status: $($r3.StatusCode)" -ForegroundColor Red
    }
    
    # Test: GET Audit Logs
    $r4 = Test-ApiEndpoint -Name "Get Audit Logs" -Method "GET" -Endpoint "/api/v1/audit-logs?page=1&pageSize=20" -Headers $authHeaders
    $results += $r4
    if ($r4.Success) {
        Write-Host "✅ PASS | GET /api/v1/audit-logs | Status: $($r4.StatusCode) | Total: $($r4.Data.data.totalCount)" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL | GET /api/v1/audit-logs | Status: $($r4.StatusCode)" -ForegroundColor Red
    }
    
    # Test: GET Settings
    $r5 = Test-ApiEndpoint -Name "Get Settings" -Method "GET" -Endpoint "/api/v1/settings?page=1&pageSize=20" -Headers $authHeaders
    $results += $r5
    if ($r5.Success) {
        Write-Host "✅ PASS | GET /api/v1/settings | Status: $($r5.StatusCode)" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL | GET /api/v1/settings | Status: $($r5.StatusCode)" -ForegroundColor Red
    }
    
    # Test: GET Settings by Key
    $r6 = Test-ApiEndpoint -Name "Get Setting by Key" -Method "GET" -Endpoint "/api/v1/settings/MIN_AGE_CATEGORY_A" -Headers $authHeaders
    $results += $r6
    if ($r6.Success) {
        Write-Host "✅ PASS | GET /api/v1/settings/MIN_AGE_CATEGORY_A | Status: $($r6.StatusCode) | Value: $($r6.Data.data.value)" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL | GET /api/v1/settings/{key} | Status: $($r6.StatusCode)" -ForegroundColor Red
    }
    
    Write-Host "`n--- DASHBOARD ENDPOINTS ---" -ForegroundColor Yellow
    
    # Test: GET Applicant Dashboard
    $r7 = Test-ApiEndpoint -Name "Get Applicant Dashboard" -Method "GET" -Endpoint "/api/v1/dashboards/applicant" -Headers $authHeaders
    $results += $r7
    if ($r7.Success) {
        Write-Host "✅ PASS | GET /api/v1/dashboards/applicant | Status: $($r7.StatusCode)" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL | GET /api/v1/dashboards/applicant | Status: $($r7.StatusCode)" -ForegroundColor Red
    }
    
    # Test: GET Admin Dashboard
    $r8 = Test-ApiEndpoint -Name "Get Admin Dashboard" -Method "GET" -Endpoint "/api/v1/dashboards/admin" -Headers $authHeaders
    $results += $r8
    if ($r8.Success) {
        Write-Host "✅ PASS | GET /api/v1/dashboards/admin | Status: $($r8.StatusCode)" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL | GET /api/v1/dashboards/admin | Status: $($r8.StatusCode)" -ForegroundColor Red
    }
    
} else {
    Write-Host "`n⚠️ Skipping authenticated tests - no token" -ForegroundColor Yellow
}

# ============================================================================
# SUMMARY
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "            RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$passed = ($results | Where-Object { $_.Success }).Count
$failed = ($results | Where-Object { -not $_.Success }).Count
$total = $results.Count

Write-Host ""
Write-Host "Total Tests: $total" -ForegroundColor White
Write-Host "Passed:     $passed" -ForegroundColor Green
Write-Host "Failed:    $failed" -ForegroundColor Red
Write-Host ""

Write-Host "Detailed Results:"
Write-Host "-----------------"
foreach ($r in $results) {
    $status = if ($r.Success) { "✅ PASS" } else { "❌ FAIL" }
    $color = if ($r.Success) { "Green" } else { "Red" }
    Write-Host "$status | $($r.Method) $($r.Name) | $($r.StatusCode)" -ForegroundColor $color
}

# Export to JSON
$results | ConvertTo-Json -Depth 5 | Out-File -FilePath "C:\Users\ALlahabi\Desktop\cmder\Mojaz\test-results\api-test-results.json" -Encoding UTF8