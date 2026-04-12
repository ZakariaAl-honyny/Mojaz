# Phase 1: Contracts (Feature 005 - OTP Verification)

## 1. Verify OTP Endpoint

**Route:** `POST /api/v1/auth/verify-otp`
**Description:** Verifies an OTP code to activate a newly registered user account.

**Request Body (`VerifyOtpRequest`)**:
```json
{
  "destination": "user@example.com",
  "code": "123456",
  "purpose": "Registration"
}
```

**Responses**:
- `200 OK`: 
  ```json
  {
    "success": true,
    "message": "account_activated_successfully",
    "data": null,
    "errors": null,
    "statusCode": 200
  }
  ```
- `400 Bad Request` (Invalid or Expired OTP):
  ```json
  {
    "success": false,
    "message": "invalid_otp",
    "data": null,
    "errors": ["invalid_or_expired_code", "2_attempts_remaining"],
    "statusCode": 400
  }
  ```

## 2. Resend OTP Endpoint

**Route:** `POST /api/v1/auth/resend-otp`
**Description:** Resends an OTP verification code, applying rate limiting and invalidating any prior unused codes.

**Request Body (`ResendOtpRequest`)**:
```json
{
  "destination": "user@example.com",
  "purpose": "Registration"
}
```

**Responses**:
- `200 OK`:
  ```json
  {
    "success": true,
    "message": "otp_sent_successfully",
    "data": {
       "destinationMasked": "us**@example.com"
    },
    "errors": null,
    "statusCode": 200
  }
  ```
- `429 Too Many Requests` (Rate limit exceeded):
  ```json
  {
    "success": false,
    "message": "rate_limit_exceeded",
    "data": null,
    "errors": ["please_wait_60_seconds_before_resending"],
    "statusCode": 429
  }
  ```
