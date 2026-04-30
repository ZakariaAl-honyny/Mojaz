$body = @{
    identifier = "applicant@mojaz.gov.sa"
    password = "Password123!"
    method = "Email"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/auth/login" -Method Post -ContentType "application/json" -Body $body -ErrorAction Stop
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Status Code:" $_.Exception.Response.StatusCode
    Write-Host "Status Description:" $_.Exception.Response.StatusDescription
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $reader.BaseStream.Position = 0
    $reader.DiscardBufferedData()
    $respText = $reader.ReadToEnd()
    Write-Host "Response:" $respText
}
