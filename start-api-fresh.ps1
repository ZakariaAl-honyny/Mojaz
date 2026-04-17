$ErrorActionPreference = "Stop"
$workingDir = "C:\Users\ALlahabi\Desktop\cmder\Mojaz"
$projectPath = "$workingDir\src\backend\Mojaz.API\Mojaz.API.csproj"

# Kill any existing dotnet processes for this project
Get-Process dotnet -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# Start the API fresh
Write-Host "Starting API..."
$p = Start-Process -FilePath "dotnet" -ArgumentList "run", "--project", $projectPath, "--no-build" -PassThru -WindowStyle Normal

# Wait for API to start
Write-Host "Waiting for API to start..."
Start-Sleep -Seconds 15

# Check if still running
if (-not $p.HasExited) {
    Write-Host "SUCCESS: API started with PID: $($p.Id)"
    
    # Try to connect to swagger
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5013/swagger/index.html" -TimeoutSec 10 -ErrorAction Stop
        Write-Host "API is responding. Status: $($response.StatusCode)"
    } catch {
        Write-Host "Checking health endpoint instead..."
        $response2 = Invoke-WebRequest -Uri "http://localhost:5013/api/v1/health" -TimeoutSec 10 -ErrorAction Stop
        Write-Host "Health response: $($response2.StatusCode)"
    }
} else {
    Write-Host "ERROR: API exited with code: $($p.ExitCode)"
    exit 1
}