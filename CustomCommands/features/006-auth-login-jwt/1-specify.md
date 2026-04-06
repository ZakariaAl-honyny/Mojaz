# Feature 006: User Login with JWT Access Token and Refresh Token Rotation

> **Status:** To be generated via `/speckit.clarify`

## WHAT WE'RE BUILDING:
Login system with JWT access tokens and refresh tokens with secure rotation.

## REQUIREMENTS:

### 1. Login Endpoint:
POST /api/v1/auth/login

Request: { "identifier": "email or phone", "password": "user password", "method": "Email|Phone" }

Logic:
- Find user by email or phone
- User not found → 401 "Invalid credentials"
- User not verified → 401 "Account not verified"
- User locked → 401 "Account locked"
- User not active → 401 "Account is deactivated"
- Wrong password: increment FailedLoginAttempts, lock after 5 attempts (15 min)
- Correct password: reset attempts, generate JWT + refresh token, audit log

### 2. JWT Configuration:
- Algorithm: HMAC-SHA256, Expiry: 60 minutes
- Claims: sub, email, phone, role, fullName, language, jti
- Issuer: "MojazAPI", Audience: "MojazClient"

### 3. Refresh Token Endpoint:
POST /api/v1/auth/refresh-token — Extract claims from expired token, validate refresh token, generate new tokens, revoke old

### 4. Logout Endpoint:
POST /api/v1/auth/logout — Revoke refresh token, audit log

### 5. Password Recovery:
POST /api/v1/auth/forgot-password — Send OTP (purpose=PasswordReset)
POST /api/v1/auth/reset-password — Verify OTP → update password → invalidate all refresh tokens

## ACCEPTANCE CRITERIA:
- [ ] Valid credentials → returns JWT + refresh token
- [ ] Invalid credentials → 401 generic message
- [ ] 5 wrong attempts → account locked 15 minutes
- [ ] JWT contains correct claims
- [ ] Refresh token rotation works
- [ ] Logout revokes refresh token
- [ ] Password recovery/reset works
- [ ] All auth events logged in AuditLog
