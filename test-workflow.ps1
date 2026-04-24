# Test Mojaz Workflow Script
$baseUrl = "http://localhost:5000/api/v1"
$results = @()

function Test-Step {
    param($name, $method, $endpoint, $body, $token)
    
    $headers = @{"Content-Type" = "application/json"}
    if ($token) { $headers["Authorization"] = "Bearer $token" }
    
    try {
        $params = @{
            Uri = "$baseUrl$endpoint"
            Method = $method
            Headers = $headers
        }
        if ($body) { $params["Body"] = $body }
        
        $response = Invoke-RestMethod @params -ErrorAction Stop
        return @{
            Success = $true
            Data = $response
            StatusCode = 200
        }
    }
    catch {
        $statusCode = 0
        try { $statusCode = [int]$_.Exception.Response.StatusCode } catch {}
        return @{
            Success = $false
            Error = $_.Exception.Message
            StatusCode = $statusCode
        }
    }
}

Write-Host "=== Mojaz Workflow Test ===" -ForegroundColor Cyan

# Step 1: Login
Write-Host "`n[Step 1] Login as Applicant..." -ForegroundColor Yellow
$loginBody = @{
    email = "applicant@mojaz.gov.sa"
    password = "Password123!"
} | ConvertTo-Json

$loginResult = Test-Step "Login" "POST" "/auth/login" $loginBody $null

if ($loginResult.Success) {
    Write-Host "  SUCCESS: Logged in" -ForegroundColor Green
    $token = $loginResult.Data.data.accessToken
    $results += @{Step = 1; Name = "Login"; Status = "PASS"; Data = $loginResult.Data }
    
    # Step 2: Create Application
    Write-Host "`n[Step 2] Create Application..." -ForegroundColor Yellow
    $createBody = @{
        serviceType = "NewLicense"
        licenseCategoryId = "B"
        notes = "Test application"
    } | ConvertTo-Json
    
    $createResult = Test-Step "CreateApplication" "POST" "/applications" $createBody $token
    
    if ($createResult.Success) {
        Write-Host "  SUCCESS: Application created" -ForegroundColor Green
        $appId = $createResult.Data.data.id
        $results += @{Step = 2; Name = "Create Application"; Status = "PASS"; Data = $createResult.Data }
        
        # Step 3: Submit Application
        Write-Host "`n[Step 3] Submit Application..." -ForegroundColor Yellow
        $submitBody = '{"status": "Submitted"}' | ConvertTo-Json
        $submitResult = Test-Step "SubmitApplication" "PATCH" "/applications/$appId/status" $submitBody $token
        
        if ($submitResult.Success) {
            Write-Host "  SUCCESS: Application submitted" -ForegroundColor Green
            $results += @{Step = 3; Name = "Submit Application"; Status = "PASS"; Data = $submitResult.Data }
            
            # Step 4: Book Appointment
            Write-Host "`n[Step 4] Book Appointment..." -ForegroundColor Yellow
            $apptBody = @{
                applicationId = $appId
                appointmentType = "Medical"
                preferredDate = "2026-04-25"
            } | ConvertTo-Json
            
            $apptResult = Test-Step "BookAppointment" "POST" "/appointments" $apptBody $token
            
            if ($apptResult.Success) {
                Write-Host "  SUCCESS: Appointment booked" -ForegroundColor Green
                $apptId = $apptResult.Data.data.id
                $results += @{Step = 4; Name = "Book Appointment"; Status = "PASS"; Data = $apptResult.Data }
                
                # Step 5: Record Medical Exam
                Write-Host "`n[Step 5] Record Medical Exam..." -ForegroundColor Yellow
                $medicalBody = @{
                    applicationId = $appId
                    appointmentId = $apptId
                    bloodPressure = "120/80"
                    visionTest = "Pass"
                    overallResult = "Pass"
                } | ConvertTo-Json
                
                $medicalResult = Test-Step "RecordMedical" "POST" "/medical-exams" $medicalBody $token
                
                if ($medicalResult.Success) {
                    Write-Host "  SUCCESS: Medical exam recorded" -ForegroundColor Green
                    $results += @{Step = 5; Name = "Record Medical Exam"; Status = "PASS"; Data = $medicalResult.Data }
                } else {
                    Write-Host "  FAILED: Medical exam error" -ForegroundColor Red
                    $results += @{Step = 5; Name = "Record Medical Exam"; Status = "FAIL"; Error = $medicalResult.Error }
                }
            } else {
                Write-Host "  FAILED: Appointment booking error" -ForegroundColor Red
                $results += @{Step = 4; Name = "Book Appointment"; Status = "FAIL"; Error = $apptResult.Error }
            }
        } else {
            Write-Host "  FAILED: Submit application error" -ForegroundColor Red
            $results += @{Step = 3; Name = "Submit Application"; Status = "FAIL"; Error = $submitResult.Error }
        }
    } else {
        Write-Host "  FAILED: Create application error" -ForegroundColor Red
        $results += @{Step = 2; Name = "Create Application"; Status = "FAIL"; Error = $createResult.Error }
    }
} else {
    Write-Host "  FAILED: Login error" -ForegroundColor Red
    $results += @{Step = 1; Name = "Login"; Status = "FAIL"; Error = $loginResult.Error }
}

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
$results | ForEach-Object {
    $color = if ($_.Status -eq "PASS") { "Green" } else { "Red" }
    Write-Host "[Step $($_.Step)] $($_.Name): $($_.Status)" -ForegroundColor $color
}

Write-Host "`nScript completed"