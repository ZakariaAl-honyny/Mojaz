# Feature 004: User Registration via Email and Phone with Real OTP

> **Status:** To be generated via `/speckit.clarify`

## WHAT WE'RE BUILDING:
Complete user registration system supporting two methods (email and phone) with real OTP verification via SendGrid (email) and Twilio (SMS).

## REQUIREMENTS:

### 1. Registration via Email:
Flow: User enters data → System sends real email with 6-digit OTP → User enters OTP → Account activated

**Endpoint:** POST /api/v1/auth/register

**Request body:**
{
  "fullName": "string, required, 2-200 chars",
  "email": "string, required when method=Email, valid format, unique",
  "password": "string, required, 8+ chars, upper+lower+number+special",
  "confirmPassword": "string, must match password",
  "registrationMethod": "Email",
  "preferredLanguage": "ar|en, default ar",
  "termsAccepted": "boolean, must be true"
}

**Response (201):**
{
  "success": true,
  "message": "Account created. Please verify your email.",
  "data": { "userId": "guid", "email": "user@example.com", "requiresVerification": true },
  "statusCode": 201
}

**Business Logic:**
- Check email not already registered (case-insensitive)
- Hash password with BCrypt (cost factor 12)
- Create User record with IsEmailVerified=false
- Generate 6-digit random OTP, hash with BCrypt before storing
- Set OTP expiry: 15 minutes (from SystemSettings)
- Send real email via SendGrid with HTML template
- Log email attempt in EmailLogs table
- Create audit log entry

### 2. Registration via Phone:
- Phone field required (E.164 format: +966XXXXXXXXX)
- OTP sent via real SMS (Twilio), expiry: 5 minutes
- SMS logged in SmsLogs table

### 3. Validation Rules (FluentValidation):
- FullName: NotEmpty, MaxLength(200), MinLength(2)
- Email: NotEmpty (when Email method), valid format, must not exist
- Phone: NotEmpty (when Phone method), E.164 regex, must not exist
- Password: NotEmpty, MinLength(8), uppercase+lowercase+number+special
- ConfirmPassword: must equal Password
- TermsAccepted: must be true

### 4. Error Responses:
- 400: Validation errors (field-level)
- 409: Email/Phone already registered
- 429: Rate limit exceeded (5 registrations per minute per IP)
- 500: Internal error (email/SMS send failure → still create account)

## ACCEPTANCE CRITERIA:
- [ ] User can register with valid email → receives real email with OTP
- [ ] User can register with valid phone → receives real SMS with OTP
- [ ] Duplicate email returns 409
- [ ] Duplicate phone returns 409
- [ ] Weak password returns 400 with specific requirement message
- [ ] OTP stored as hash (not plain text)
- [ ] Password stored as hash (not plain text)
- [ ] Audit log entry created
- [ ] Email logged in EmailLogs
- [ ] SMS logged in SmsLogs
- [ ] Rate limiting works (429 after 5 attempts/minute)
- [ ] All responses follow ApiResponse<T> format
