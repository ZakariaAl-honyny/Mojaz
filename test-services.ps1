Start-Sleep -Seconds 10
Write-Host "Testing Email and SMS Services..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/dev/test-services" -Method Get -TimeoutSec 30
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}