$ErrorActionPreference = "Stop"
$body = @{
    email = "test@example.com"
    password = "Test@123456"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://127.0.0.1:5013/api/v1/auth/login' -Method POST -ContentType 'application/json' -Body $body -UseBasicParsing
$content = $response.Content | ConvertFrom-Json
$content