# Quickstart: Security Testing

To verify the security hardening implementation, use the following procedures:

## 1. Verify Security Headers
Run the following PowerShell command against the API:
```powershell
$resp = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/health"
$resp.Headers["X-Content-Type-Options"] # Should be 'nosniff'
$resp.Headers["X-Frame-Options"]        # Should be 'DENY'
$resp.Headers["Content-Security-Policy"] # Should match defined policy
```

## 2. Test Rate Limiting
Execute multiple rapid requests to an auth endpoint:
```powershell
for($i=1; $i -le 15; $i++) { 
    Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/v1/auth/login" -Body @{ email="test@mojaz.sa"; password="pwd" } 
}
# Expect 429 Too Many Requests after 10th attempt
```

## 3. Verify File Validation
Attempt to upload a renamed text file as a PDF:
```powershell
# Create fake PDF (actually text)
"malicious content" | Out-File -FilePath "fake.pdf"
# Upload via API (multipart/form-data)
# Expect 400 Bad Request with "Invalid file content signature" message
```

## 4. Check Audit Logs
```sql
SELECT TOP 10 * FROM AuditLogs ORDER BY Timestamp DESC
-- Look for IpAddress, UserAgent, and ActionCategory fields
```
