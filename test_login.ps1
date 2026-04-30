$body = @{
    identifier = "applicant@mojaz.gov.sa"
    password = "Password123!"
    method = "Email"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/auth/login" -Method Post -ContentType "application/json" -Body $body
$response | ConvertTo-Json -Depth 5
