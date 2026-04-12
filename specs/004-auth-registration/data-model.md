# Data Model & Interfaces

## Data Model

The following existing entities are utilized. 

### 1. `User` (Mojaz.Domain.Entities.User)
- **Modifications/Checks**: 
   - Uses `Email` and `PhoneNumber`.
   - `RegistrationMethod` tracks how the user signed up.
   - `IsActive`, `IsEmailVerified`, `IsPhoneVerified`.
   - `PasswordHash` handles the storage of the hashed password.
- **Validation**:
   - `FullName` required.
   - Either `Email` or `PhoneNumber` must be present depending on `RegistrationMethod`.
   - `Password` must have specific complexity.

### 2. `OtpCode` (Mojaz.Domain.Entities.OtpCode)
- **Modifications/Checks**:
   - Link to `UserId`.
   - `Destination` handles email or phone string.
   - `CodeHash` stores the hashed OTP string.
   - `AttemptCount` checked against `MaxAttempts` before validating.
   - `ExpiresAt` must be > `UtcNow`.

### 3. `SystemSetting` (Mojaz.Domain.Entities.SystemSetting)
- Needed keys: `OTP_VALIDITY_MINUTES_SMS`, `OTP_VALIDITY_MINUTES_EMAIL`, `OTP_MAX_ATTEMPTS`, `OTP_RESEND_COOLDOWN_SECONDS`, `OTP_MAX_RESEND_PER_HOUR`.

## Expected Contracts

### API Endpoints

1. **POST** `/api/v1/auth/register/email`
   - **Request**: `{ "fullName": "string", "email": "string", "password": "pass", "language": "ar|en" }`
   - **Response**: `ApiResponse<RegistrationResponseDto>`

2. **POST** `/api/v1/auth/register/phone`
   - **Request**: `{ "fullName": "string", "phoneNumber": "+966...", "password": "pass", "language": "ar|en" }`
   - **Response**: `ApiResponse<RegistrationResponseDto>`

3. **POST** `/api/v1/auth/verify-otp`
   - **Request**: `{ "userId": "guid", "otpCode": "string" }`
   - **Response**: `ApiResponse<AuthResponseDto>` (includes tokens upon success)

4. **POST** `/api/v1/auth/resend-otp`
   - **Request**: `{ "userId": "guid", "method": "Email|Phone" }`
   - **Response**: `ApiResponse<bool>`
