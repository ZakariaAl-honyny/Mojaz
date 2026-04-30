$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZTRiNDFiOS1lZWYzLTQ1YTUtNjNhNS0wOGRlYTIzYmNkMTEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImJlNGI0MWI5LWVlZjMtNDVhNS02M2E1LTA4ZGVhMjNiY2QxMSIsIm5hbWUiOiJUZXN0IEFwcGxpY2FudCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFwcGxpY2FudCIsImp0aSI6IjNkMjJjMzcxLWMzYWMtNDJmOC04YzIwLWI5ZWI1YjNkZmFjMiIsImV4cCI6MTc3NzQzNjExMiwiaXNzIjoiTW9qYXoiLCJhdWQiOiJNb2phekNsaWVudHMifQ.hnap3MoUkr6wM43Pi60PsZMT3RY6owzzshlBcVtJJKg"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5013/api/v1/dashboards/applicant" -Method Get -ContentType "application/json" -Headers @{Authorization="Bearer $token"} -ErrorAction Stop
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Status Code:" $_.Exception.Response.StatusCode
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $reader.BaseStream.Position = 0
    $reader.DiscardBufferedData()
    $respText = $reader.ReadToEnd()
    Write-Host "Response:" $respText
}
