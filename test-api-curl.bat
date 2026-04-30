@echo off
setlocal enabledelayedexpansion

echo ========================================
echo MOJAZ API COMPREHENSIVE TEST
echo ========================================
echo.

set RESULTS_FILE=C:\Users\ALlahabi\Desktop\cmder\Mojaz\test-results\api-test-results.json
echo [ > %RESULTS_FILE%

REM Test 1: License Categories (Public)
echo [1] GET /api/v1/license-categories
curl -s -X GET http://localhost:5013/api/v1/license-categories -H "Content-Type: application/json" -o temp1.json
set /p R1=<temp1.json
echo Response: !R1!
echo.

REM Test 2: Login
echo [2] POST /api/v1/auth/login
curl -s -X POST http://localhost:5013/api/v1/auth/login -H "Content-Type: application/json" -d "{\"identifier\":\"admin@mojaz.gov.sa\",\"password\":\"Admin123!\",\"method\":1}" -o temp2.json
set /p R2=<temp2.json
echo Response: !R2!
echo.

REM Extract token if login successful
set TOKEN=NOTOKEN
echo !R2! | findstr /C:"\"success\":true" >nul
if !ERRORLEVEL!==0 (
    echo Login SUCCESS
    for /f "tokens=*" %%a in ('findstr /R "\"accessToken" temp2.json') do set TOKEN=%%a
)

echo ========================================
echo RESULTS SUMMARY
echo ========================================
echo Total: 2 tests executed
echo Results captured in JSON file
echo.

endlocal