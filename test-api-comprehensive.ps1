# Mojaz API Test Script - Comprehensive Test Suite
# Tests all Users, Dashboards, Audit Logs, Settings, and License Categories endpoints

$baseUrl = "http://localhost:5013"
$results = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [hashtable]$Headers = @{},
        [object]$Body = $null,
        [string]$Description = ""
    )
    
    $url = "$baseUrl$Endpoint"
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
        
        $response = Invoke-RestMethod @params -ErrorAction Stop
        
        return @{
            Name = $Name
            Method = $Method
            Endpoint = $Endpoint
            StatusCode = 200
            Success = $true
            Data = $response
            Description = $Description
        }
    } catch [System.Net.WebException] {
        $statusCode = [int]$_.Exception.Response.StatusCode
        return @{
            Name = $Name
            Method = $Method
            Endpoint = $Endpoint
            StatusCode = $statusCode
            Success = $false
            Error = $_.Exception.Message
            Description = $Description
        }
    } catch {
        return @{
            Name = $Name
            Method = $Method
            Endpoint = $Endpoint
            StatusCode = 0
            Success = $false
            Error = $_.Exception.Message
            Description = $Description
        }
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   MOJAZ API COMPREHENSIVE TEST" -ForegroundColor Cyan
Write-Host "   Users, Admin & Settings Endpoints" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# TEST 1: Public Endpoints (No Auth Required)
# ============================================================================

Write-Host "[TEST 1] GET /api/v1/license-categories (Public)" -ForegroundColor Yellow
$result = Test-Endpoint -Name "Get License Categories" -Method "GET" -Endpoint "/api/v1/license-categories" `
    -Description "Get all license categories - public endpoint"
$results += $result
if ($result.Success) {
    Write-Host "    ✅ Status: $($result.StatusCode) | Categories: $($result.Data.data.Count)" -ForegroundColor Green
} else {
    Write-Host "    ❌ Status: $($result.StatusCode) | Error: $($result.Error)" -ForegroundColor Red
}

Write-Host "[TEST 2] GET /api/v1/settings (Public)" -ForegroundColor Yellow
$result = Test-Endpoint -Name "Get Settings" -Method "GET" -Endpoint "/api/v1/settings" `
    -Description "Get all settings - public endpoint"
$results += $result
if ($result.Success) {
    Write-Host "    ✅ Status: $($result.StatusCode) | Settings: $($result.Data.data.Count)" -ForegroundColor Green
} else {
    Write-Host "    ❌ Status: $($result.StatusCode) | Error: $($result.Error)" -ForegroundColor Red
}

Write-Host "[TEST 3] GET /api/v1/settings/MIN_AGE_CATEGORY_A (Public)" -ForegroundColor Yellow
$result = Test-Endpoint -Name "Get Setting by Key" -Method "GET" -Endpoint "/api/v1/settings/MIN_AGE_CATEGORY_A" `
    -Description "Get specific setting by key"
$results += $result
if ($result.Success) {
    Write-Host "    ✅ Status: $($result.StatusCode) | Value: $($result.Data.data.value)" -ForegroundColor Green
} else {
    Write-Host "    ❌ Status: $($result.StatusCode) | Error: $($result.Error)" -ForegroundColor Red
}

# ============================================================================
# TEST 4: Login (Get Token for Auth Tests)
# ============================================================================

Write-Host "`n[TEST 4] POST /api/v1/auth/login - Get Token" -ForegroundColor Yellow
$loginBody = @{
    identifier = "admin@mojaz.gov.sa"
    password = "Admin123!"
    method = 1
}
$result = Test-Endpoint -Name "Admin Login" -Method "POST" -Endpoint "/api/v1/auth/login" `
    -Body $loginBody -Description "Login as admin to get access token"
$results += $result

$adminToken = $null
if ($result.Success -and $result.Data.success) {
    $adminToken = $result.Data.data.accessToken
    Write-Host "    ✅ Status: $($result.StatusCode) | Token: $($adminToken.Substring(0, [Math]::Min(30, $adminToken.Length)))..." -ForegroundColor Green
} else {
    Write-Host "    ❌ Status: $($result.StatusCode) | Message: $($result.Data.message)" -ForegroundColor Red
}

# ============================================================================
# TEST 5-9: Authenticated Endpoints (Admin Token)
# ============================================================================

if ($adminToken) {
    $authHeaders = @{
        "Authorization" = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }
    
    Write-Host "`n[TEST 5] GET /api/v1/users (Admin Only)" -ForegroundColor Yellow
    $result = Test-Endpoint -Name "Get Users List" -Method "GET" -Endpoint "/api/v1/users?page=1&pageSize=20" `
        -Headers $authHeaders -Description "List all users - paginated"
    $results += $result
    if ($result.Success) {
        Write-Host "    ✅ Status: $($result.StatusCode) | Total: $($result.Data.data.totalCount)" -ForegroundColor Green
    } else {
        Write-Host "    ❌ Status: $($result.StatusCode) | Error: $($result.Error)" -ForegroundColor Red
    }
    
    Write-Host "[TEST 6] GET /api/v1/users/{userId} (Admin Only)" -ForegroundColor Yellow
    # First get a user ID from the list
    $usersResult = Test-Endpoint -Name "Get Users List Temp" -Method "GET" -Endpoint "/api/v1/users?page=1&pageSize=1" `
        -Headers $authHeaders
    if ($usersResult.Success -and $usersResult.Data.data.items.Count -gt 0) {
        $userId = $usersResult.Data.data.items[0].id
        $result = Test-Endpoint -Name "Get User by ID" -Method "GET" -Endpoint "/api/v1/users/$userId" `
            -Headers $authHeaders -Description "Get specific user by ID"
        $results += $result
        if ($result.Success) {
            Write-Host "    ✅ Status: $($result.StatusCode) | User: $($result.Data.data.fullName)" -ForegroundColor Green
        } else {
            Write-Host "    ❌ Status: $($result.StatusCode) | Error: $($result.Error)" -ForegroundColor Red
        }
    } else {
        Write-Host "    ⚠️  Skipped - No users found" -ForegroundColor Yellow
    }
    
    Write-Host "[TEST 7] POST /api/v1/users (Admin Only)" -ForegroundColor Yellow
    $newUserBody = @{
        email = "newuser$([System.Guid]::NewGuid().ToString('N').Substring(0,8))@example.com"
        phone = "+967711111111"
        password = "NewUser@123456"
        fullName = "مستخدم جديد"
        nationalId = "1111111111"
        role = 6
    }
    $result = Test-Endpoint -Name "Create User" -Method "POST" -Endpoint "/api/v1/users" `
        -Headers $authHeaders -Body $newUserBody -Description "Create new user"
    $results += $result
    if ($result.Success) {
        Write-Host "    ✅ Status: $($result.StatusCode) | User ID: $($result.Data.data.id)" -ForegroundColor Green
    } else {
        Write-Host "    ❌ Status: $($result.StatusCode) | Message: $($result.Data.message)" -ForegroundColor Red
    }
    
    Write-Host "[TEST 8] GET /api/v1/dashboards/Applicant" -ForegroundColor Yellow
    $result = Test-Endpoint -Name "Get Applicant Dashboard" -Method "GET" -Endpoint "/api/v1/dashboards/Applicant" `
        -Headers $authHeaders -Description "Get dashboard for Applicant role"
    $results += $result
    if ($result.Success) {
        Write-Host "    ✅ Status: $($result.StatusCode) | Stats: $($result.Data.data.totalApplications)" -ForegroundColor Green
    } else {
        Write-Host "    ❌ Status: $($result.StatusCode) | Error: $($result.Error)" -ForegroundColor Red
    }
    
    Write-Host "[TEST 9] GET /api/v1/dashboards/Admin" -ForegroundColor Yellow
    $result = Test-Endpoint -Name "Get Admin Dashboard" -Method "GET" -Endpoint "/api/v1/dashboards/Admin" `
        -Headers $authHeaders -Description "Get dashboard for Admin role"
    $results += $result
    if ($result.Success) {
        Write-Host "    ✅ Status: $($result.StatusCode) | Stats: $($result.Data.data.totalUsers)" -ForegroundColor Green
    } else {
        Write-Host "    ❌ Status: $($result.StatusCode) | Error: $($result.Error)" -ForegroundColor Red
    }
    
    Write-Host "[TEST 10] GET /api/v1/audit-logs (Admin Only)" -ForegroundColor Yellow
    $result = Test-Endpoint -Name "Get Audit Logs" -Method "GET" -Endpoint "/api/v1/audit-logs?page=1&pageSize=20" `
        -Headers $authHeaders -Description "Get audit logs"
    $results += $result
    if ($result.Success) {
        Write-Host "    ✅ Status: $($result.StatusCode) | Total: $($result.Data.data.totalCount)" -ForegroundColor Green
    } else {
        Write-Host "    ❌ Status: $($result.StatusCode) | Error: $($result.Error)" -ForegroundColor Red
    }
} else {
    Write-Host "`n⚠️  Skipping auth tests - no token obtained" -ForegroundColor Yellow
}

# ============================================================================
# Summary
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "          TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$passed = ($results | Where-Object { $_.Success }).Count
$failed = ($results | Where-Object { -not $_.Success }).Count
$total = $results.Count

Write-Host "`nTotal Tests: $total" -ForegroundColor White
Write-Host "Passed:     $passed" -ForegroundColor Green
Write-Host "Failed:     $failed" -ForegroundColor Red
Write-Host ""

Write-Host "Detailed Results:"
Write-Host "-----------------"
foreach ($r in $results) {
    $status = if ($r.Success) { "✅ PASS" } else { "❌ FAIL" }
    $color = if ($r.Success) { "Green" } else { "Red" }
    Write-Host "$status | $($r.Method) $($r.Name) | Status: $($r.StatusCode)" -ForegroundColor $color
}

# Output JSON for reporting
$results | ConvertTo-Json -Depth 5