$results = @()

function Test-Endpoint {
    param([string]$endpoint)
    try {
        $wr = [System.Net.WebRequest]::Create("http://localhost:5013$endpoint")
        $wr.Method = "GET"
        $wr.Timeout = 10000
        $resp = $wr.GetResponse()
        $statusCode = [int]$resp.StatusCode
        $resp.Close()
        Write-Host "SUCCESS: $endpoint - Status: $statusCode"
        return @{ endpoint=$endpoint; method="GET"; status=$statusCode; success=($statusCode -ge 200 -and $statusCode -lt 300) }
    } catch {
        $statusCode = 500
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
        }
        Write-Host "FAIL: $endpoint - Status: $statusCode"
        return @{ endpoint=$endpoint; method="GET"; status=$statusCode; success=($statusCode -ge 200 -and $statusCode -lt 300) }
    }
}

Write-Host "Testing endpoints..."
Write-Host "==================="

$results += Test-Endpoint -endpoint "/api/v1/health"
$results += Test-Endpoint -endpoint "/api/v1/health/database"
$results += Test-Endpoint -endpoint "/api/v1/lookups/exam-centers"
$results += Test-Endpoint -endpoint "/api/v1/lookups/nationalities"
$results += Test-Endpoint -endpoint "/api/v1/lookups/regions"

$passed = ($results | Where-Object { $_.success }).Count
$failed = $results.Count - $passed

$report = @{
    group = "Health & Public"
    total = $results.Count
    passed = $passed
    failed = $failed
    results = $results
}

$report | ConvertTo-Json -Depth 10