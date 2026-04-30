$results = @()
$baseUrl = 'http://localhost:5013'

# Test 1: GET /api/v1/health
try {
    $r = Invoke-RestMethod -Uri "$baseUrl/api/v1/health" -Method GET -TimeoutSec 10
    $results += @{endpoint='/api/v1/health';method='GET';status=200;success=$true}
    Write-Host "OK: GET /api/v1/health - 200"
} catch {
    $status = [int]($_.Exception.Response.StatusCode)
    $results += @{endpoint='/api/v1/health';method='GET';status=$status;success=$false}
    Write-Host "FAIL: GET /api/v1/health - $status"
}

# Test 2: GET /api/v1/health/database
try {
    $r = Invoke-RestMethod -Uri "$baseUrl/api/v1/health/database" -Method GET -TimeoutSec 10
    $results += @{endpoint='/api/v1/health/database';method='GET';status=200;success=$true}
    Write-Host "OK: GET /api/v1/health/database - 200"
} catch {
    $status = [int]($_.Exception.Response.StatusCode)
    $results += @{endpoint='/api/v1/health/database';method='GET';status=$status;success=$false}
    Write-Host "FAIL: GET /api/v1/health/database - $status"
}

# Test 3: GET /api/v1/lookups/exam-centers
try {
    $r = Invoke-RestMethod -Uri "$baseUrl/api/v1/lookups/exam-centers" -Method GET -TimeoutSec 10
    $results += @{endpoint='/api/v1/lookups/exam-centers';method='GET';status=200;success=$true}
    Write-Host "OK: GET /api/v1/lookups/exam-centers - 200"
} catch {
    $status = [int]($_.Exception.Response.StatusCode)
    $results += @{endpoint='/api/v1/lookups/exam-centers';method='GET';status=$status;success=$false}
    Write-Host "FAIL: GET /api/v1/lookups/exam-centers - $status"
}

# Test 4: GET /api/v1/lookups/nationalities
try {
    $r = Invoke-RestMethod -Uri "$baseUrl/api/v1/lookups/nationalities" -Method GET -TimeoutSec 10
    $results += @{endpoint='/api/v1/lookups/nationalities';method='GET';status=200;success=$true}
    Write-Host "OK: GET /api/v1/lookups/nationalities - 200"
} catch {
    $status = [int]($_.Exception.Response.StatusCode)
    $results += @{endpoint='/api/v1/lookups/nationalities';method='GET';status=$status;success=$false}
    Write-Host "FAIL: GET /api/v1/lookups/nationalities - $status"
}

# Test 5: GET /api/v1/lookups/regions
try {
    $r = Invoke-RestMethod -Uri "$baseUrl/api/v1/lookups/regions" -Method GET -TimeoutSec 10
    $results += @{endpoint='/api/v1/lookups/regions';method='GET';status=200;success=$true}
    Write-Host "OK: GET /api/v1/lookups/regions - 200"
} catch {
    $status = [int]($_.Exception.Response.StatusCode)
    $results += @{endpoint='/api/v1/lookups/regions';method='GET';status=$status;success=$false}
    Write-Host "FAIL: GET /api/v1/lookups/regions - $status"
}

# Test 6: GET /api/v1/license-categories
try {
    $r = Invoke-RestMethod -Uri "$baseUrl/api/v1/license-categories" -Method GET -TimeoutSec 10
    $results += @{endpoint='/api/v1/license-categories';method='GET';status=200;success=$true}
    Write-Host "OK: GET /api/v1/license-categories - 200"
} catch {
    $status = [int]($_.Exception.Response.StatusCode)
    $results += @{endpoint='/api/v1/license-categories';method='GET';status=$status;success=$false}
    Write-Host "FAIL: GET /api/v1/license-categories - $status"
}

# Test 7: POST /api/v1/auth/forgot-password (invalid email - expect 404)
$body = '{"email":"nonexistent@test.com"}'
try {
    $r = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/forgot-password" -Method POST -Body $body -ContentType 'application/json' -TimeoutSec 10
    $results += @{endpoint='/api/v1/auth/forgot-password';method='POST';status=200;success=$true}
    Write-Host "OK: POST /api/v1/auth/forgot-password - 200"
} catch {
    $status = [int]($_.Exception.Response.StatusCode)
    if ($status -eq 404) {
        $results += @{endpoint='/api/v1/auth/forgot-password';method='POST';status=404;success=$true}
        Write-Host "OK: POST /api/v1/auth/forgot-password - 404 (expected)"
    } else {
        $results += @{endpoint='/api/v1/auth/forgot-password';method='POST';status=$status;success=$false}
        Write-Host "FAIL: POST /api/v1/auth/forgot-password - $status"
    }
}

$results | ConvertTo-Json -Depth 10