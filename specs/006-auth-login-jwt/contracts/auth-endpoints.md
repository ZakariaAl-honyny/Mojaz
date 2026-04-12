# Auth Endpoints API Contract

All endpoints follow the Clean Architecture design and return a standardized `ApiResponse<T>`.

## 1. Login
`POST /api/v1/auth/login`

**Request:**
```json
{
  "identifier": "user@example.com",
  "password": "SecurePassword123!",
  "method": "Email" // "Email" or "Phone"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "secure_random_string",
    "expiresIn": 3600
  },
  "errors": null,
  "statusCode": 200
}
```

## 2. Refresh Token
`POST /api/v1/auth/refresh-token`

**Request:**
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "secure_random_string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "new_secure_random_string",
    "expiresIn": 3600
  },
  "errors": null,
  "statusCode": 200
}
```

## 3. Logout
`POST /api/v1/auth/logout`

**Header:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "refreshToken": "secure_random_string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null,
  "errors": null,
  "statusCode": 200
}
```

## 4. Forgot Password
`POST /api/v1/auth/forgot-password`

**Request:**
```json
{
  "identifier": "user@example.com",
  "method": "Email"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "If the account exists, an OTP has been sent.",
  "data": null,
  "errors": null,
  "statusCode": 200
}
```

## 5. Reset Password
`POST /api/v1/auth/reset-password`

**Request:**
```json
{
  "identifier": "user@example.com",
  "method": "Email",
  "otp": "123456",
  "newPassword": "NewSecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": null,
  "errors": null,
  "statusCode": 200
}
```
