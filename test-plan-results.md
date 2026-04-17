# Mojaz API Local Test Plan & Results

## Test Environment Setup
- **Database**: SQL Server Local (`Server=.;Database=MojazDb;Trusted_Connection=True`)
- **API URL**: http://localhost:5013
- **Test Date**: 2026-04-17

## Test Results Summary

### ✅ Working Endpoints

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| Health | GET /api/v1/health | ✅ 200 OK | Returns healthy status |
| Testing Ping | GET /api/v1/testing/ping | ✅ 200 OK | Environment: Development |
| Testing Seed | POST /api/v1/testing/seed | ✅ 200 OK | Test data seeded |
| Registration | POST /api/v1/auth/register | ✅ 201 Created | Works perfectly |
| Swagger UI | GET /swagger/index.html | ✅ 200 OK | All endpoints documented |

### ⚠️ Endpoints Needing Investigation

| Endpoint | Method | Status | Issue |
|----------|--------|--------|-------|
| Login | POST /api/v1/auth/login | ❌ 401 | Password verification failing |

### Database Tests

✅ Database Connection: Working
- All 28 tables created successfully
- Data being saved correctly
- Users table has data

## Detailed Test Findings

### 1. Registration Test
**Request:**
```json
{
  "nationalId": "1234567890",
  "fullName": "Test Applicant",
  "email": "test@example.com",
  "phone": "+967445792217",
  "password": "TestPassword123!",
  "preferredLanguage": "ar"
}
```
**Response:** 200 OK - User created successfully

### 2. Health API Test
**Request:** GET /api/v1/health
**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "status": "Healthy",
    "timestamp": "2026-04-17T06:54:32.7378689Z",
    "version": "1.0.0",
    "environment": "Development"
  }
}
```

### 3. Testing Ping Test  
**Request:** GET /api/v1/testing/ping
**Response:**
```json
{
  "message": "Pong",
  "environment": "Development"
}
```

## Next Steps

1. Investigate why Login fails with correct password (BCrypt verification issue)
2. Test Application CRUD endpoints
3. Test Appointments
4. Test Payments
5. Test License Categories

## Test Files

- `get-users.ps1` - Query users from database
- `verify-user.ps1` - Verify user in database  
- `create-test-user.ps1` - Create test users
- `get-tables.ps1` - List database tables
- `start-api-fresh.ps1` - Start API for testing