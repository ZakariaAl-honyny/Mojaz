# Mojaz API Test - Resilient Test Script
# Captures all responses including errors

$baseUrl = "http://localhost:5013"
$results = @()

function Test-Api {
    param([string]$Name, [string]$Method, [string]$Endpoint, [hashtable]$Headers=@{}, [object]$Body=$null)
    
    try {
        $params = @{Uri="$baseUrl$Endpoint";Method=$Method;Headers=$Headers;ContentType="application/json";TimeoutSec=30}
        if ($Body) { $params.Body = ($Body | ConvertTo-Json) }
        $r = Invoke-RestMethod @params -ErrorAction Stop
        return @{Name=$Name;Method=$Method;Endpoint=$Endpoint;StatusCode=200;Data=$r;Success=$r.success}
    } catch {
        $sc = 0
        try { $sc = [int]$_.Exception.Response.StatusCode } catch {}
        $msg = $_.Exception.Message
        if ($_.Exception.Response) {
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetErrorResponseStream())
                $reader.BaseStream.Position = 0
                $errBody = $reader.ReadToEnd()
                $msg = $errBody
            } catch {}
        }
        return @{Name=$Name;Method=$Method;Endpoint=$Endpoint;StatusCode=$sc;Data=$msg;Success=$false}
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MOJAZ API COMPREHENSIVE TEST" -ForegroundColor Cyan
Write-Host "  Testing all endpoints" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Test 1: Public Endpoint
Write-Host "`n[1] GET /api/v1/license-categories" -ForegroundColor Yellow
$r1 = Test-Api -Name "License Categories" -Method "GET" -Endpoint "/api/v1/license-categories"
$results += $r1
Write-Host "    Status: $($r1.StatusCode) | Success: $($r1.Success)" -ForegroundColor $(if($r1.Success){"Green"}else{"Red"})

# Test 2: Login
Write-Host "`n[2] POST /api/v1/auth/login" -ForegroundColor Yellow
$body = @{identifier="admin@mojaz.gov.sa";password="Admin123!";method=1}
$r2 = Test-Api -Name "Login" -Method "POST" -Endpoint "/api/v1/auth/login" -Body $body
$results += $r2
Write-Host "    Status: $($r2.StatusCode) | Success: $($r2.Success)" -ForegroundColor $(if($r2.Success){"Green"}else{"Red"})

$token = $null
if ($r2.Success -and $r2.Data.success) { $token = $r2.Data.data.accessToken }

if ($token) {
    $hdr = @{"Authorization"="Bearer $token";"Content-Type"="application/json"}
    
    Write-Host "`n[3] GET /api/v1/users" -ForegroundColor Yellow
    $r3 = Test-Api -Name "Users List" -Method "GET" -Endpoint "/api/v1/users?page=1&pageSize=20" -Headers $hdr
    $results += $r3
    Write-Host "    Status: $($r3.StatusCode) | Success: $($r3.Success)" -ForegroundColor $(if($r3.Success){"Green"}else{"Red"})
    
    Write-Host "`n[4] GET /api/v1/dashboards/applicant" -ForegroundColor Yellow
    $r4 = Test-Api -Name "Applicant Dashboard" -Method "GET" -Endpoint "/api/v1/dashboards/applicant" -Headers $hdr
    $results += $r4
    Write-Host "    Status: $($r4.StatusCode) | Success: $($r4.Success)" -ForegroundColor $(if($r4.Success){"Green"}else{"Red"})
    
    Write-Host "`n[5] GET /api/v1/dashboards/admin" -ForegroundColor Yellow
    $r5 = Test-Api -Name "Admin Dashboard" -Method "GET" -Endpoint "/api/v1/dashboards/admin" -Headers $hdr
    $results += $r5
    Write-Host "    Status: $($r5.StatusCode) | Success: $($r5.Success)" -ForegroundColor $(if($r5.Success){"Green"}else{"Red"})
    
    Write-Host "`n[6] GET /api/v1/audit-logs" -ForegroundColor Yellow
    $r6 = Test-Api -Name "Audit Logs" -Method "GET" -Endpoint "/api/v1/audit-logs?page=1&pageSize=20" -Headers $hdr
    $results += $r6
    Write-Host "    Status: $($r6.StatusCode) | Success: $($r6.Success)" -ForegroundColor $(if($r6.Success){"Green"}else{"Red"})
    
    Write-Host "`n[7] GET /api/v1/settings" -ForegroundColor Yellow
    $r7 = Test-Api -Name "Settings" -Method "GET" -Endpoint "/api/v1/settings?page=1&pageSize=20" -Headers $hdr
    $results += $r7
    Write-Host "    Status: $($r7.StatusCode) | Success: $($r7.Success)" -ForegroundColor $(if($r7.Success){"Green"}else{"Red"})
    
    Write-Host "`n[8] GET /api/v1/settings/MIN_AGE_CATEGORY_A" -ForegroundColor Yellow
    $r8 = Test-Api -Name "Setting by Key" -Method "GET" -Endpoint "/api/v1/settings/MIN_AGE_CATEGORY_A" -Headers $hdr
    $results += $r8
    Write-Host "    Status: $($r8.StatusCode) | Success: $($r8.Success)" -ForegroundColor $(if($r8.Success){"Green"}else{"Red"})
    
    # If users returned, test get by ID
    if ($r3.Success -and $r3.Data.data.items.Count -gt 0) {
        $uid = $r3.Data.data.items[0].id
        Write-Host "`n[9] GET /api/v1/users/$($uid.ToString().Substring(0,8))" -ForegroundColor Yellow
        $r9 = Test-Api -Name "User by ID" -Method "GET" -Endpoint "/api/v1/users/$uid" -Headers $hdr
        $results += $r9
        Write-Host "    Status: $($r9.StatusCode) | Success: $($r9.Success)" -ForegroundColor $(if($r9.Success){"Green"}else{"Red"})
    }
}

# SUMMARY
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "            RESULTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$passed = ($results | ? {$_.Success}).Count
$failed = ($results | ? {-not $_.Success}).Count
Write-Host "`nTotal: $($results.Count) | Passed: $passed | Failed: $failed" -ForegroundColor White

Write-Host "`nResults:"
foreach ($r in $results) {
    $s = if($r.Success){"✅"}else{"❌"}
    $c = if($r.Success){"Green"}else{"Red"}
    Write-Host "$s $($r.Method) $($r.Name) - $($r.StatusCode)" -ForegroundColor $c
}

# Save JSON results
$results | ConvertTo-Json -Depth 5 | Out-File "C:\Users\ALlahabi\Desktop\cmder\Mojaz\test-results\api-test-results.json" -Encoding UTF8