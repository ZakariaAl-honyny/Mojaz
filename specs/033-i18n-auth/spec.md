# [i18n] Translate Auth Module

## Overview

Translate all hardcoded text in authentication components (login, register, OTP, forgot password, reset password) to use next-intl useTranslations() hooks.

## CRITICAL RULE

> **You are ONLY allowed to modify these files:**
> - `src/frontend/src/locales/ar/auth.json`
> - `src/frontend/src/locales/en/auth.json`
> 
> **Do NOT touch any other JSON files. Do NOT modify any TSX/TS files.**

## Hardcoded Text Found

### LoginForm.tsx (1 string)
| Line | Text | Suggested Key |
|------|------|---------------|
| 50 | `"Login failed. Please check your credentials."` | `auth.login.errorInvalidCredentials` |

### RegisterForm.tsx (3 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 23 | `"Passwords don't match"` | `auth.register.errors.passwordMismatch` |
| 63 | `"Registration failed. Please try again."` | `auth.register.errorFailed` |
| 87 | `"محمد أحمد"` (placeholder) | `auth.register.fullNamePlaceholder` |
| 119 | `"user@example.com"` (placeholder) | `auth.register.emailPlaceholder` |
| 119 | `"+9665..."` (placeholder) | `auth.register.phonePlaceholder` |

### OTPForm.tsx (2 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 73 | `"User ID missing"` | `auth.verify.errorMissingUserId` |
| 103 | `"User ID missing"` | `auth.verify.errorMissingUserId` |

### ForgotPasswordForm.tsx (1 string)
| Line | Text | Suggested Key |
|------|------|---------------|
| 45 | `"Failed to send recovery code. Please try again."` | `auth.forgotPassword.errorSendFailed` |

### ResetPasswordForm.tsx (5 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 16 | `"Code must be 6 digits"` | `auth.resetPassword.validation.otpLength` |
| 17 | `"Password must be at least 8 characters"` | `auth.resetPassword.validation.passwordMin` |
| 20 | `"Passwords don't match"` | `auth.resetPassword.validation.passwordMismatch` |
| 55 | `"Failed to reset password. Please verify the code."` | `auth.resetPassword.errorFailed` |
| 95 | `"000000"` (placeholder) | `auth.resetPassword.otpPlaceholder` |

### EmailRegistrationForm.tsx (8 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 21 | `'Full name must be at least 3 characters'` | `auth.register.errors.fullNameMin` |
| 22 | `'Invalid email address'` | `auth.register.errors.emailInvalid` |
| 23 | `'Password must be at least 8 characters'` | `auth.register.errors.passwordMin` |
| 25 | `'You must accept the terms'` | `auth.register.errors.termsRequired` |
| 27 | `"Passwords don't match"` | `auth.register.errors.passwordMismatch` |
| 117 | `"name@mojaz.gov.sa"` (placeholder) | `auth.register.emailPlaceholder` |
| 136 | `"••••••••"` (placeholder) | `auth.register.passwordPlaceholder` |
| 152 | `"••••••••"` (placeholder) | `auth.register.confirmPasswordPlaceholder` |

### PhoneRegistrationForm.tsx (8 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 20 | `'Full name must be at least 3 characters'` | `auth.register.errors.fullNameMin` |
| 21 | `'Enter a valid Saudi phone number (+9665xxxxxxxx)'` | `auth.register.errors.phoneInvalid` |
| 22 | `'Password must be at least 8 characters'` | `auth.register.errors.passwordMin` |
| 24 | `'You must accept the terms'` | `auth.register.errors.termsRequired` |
| 26 | `"Passwords don't match"` | `auth.register.errors.passwordMismatch` |
| 115 | `"+9665xxxxxxxx"` (placeholder) | `auth.register.phonePlaceholder` |
| 134 | `"••••••••"` (placeholder) | `auth.register.passwordPlaceholder` |
| 151 | `"••••••••"` (placeholder) | `auth.register.confirmPasswordPlaceholder` |

## Translation Structure Required

Add these keys to both `ar/auth.json` and `en/auth.json`:

```json
{
  "login": {
    "errorInvalidCredentials": "فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد."
  },
  "register": {
    "errorFailed": "فشل التسجيل. يرجى المحاولة مرة أخرى.",
    "fullNamePlaceholder": "محمد أحمد",
    "emailPlaceholder": "user@example.com",
    "phonePlaceholder": "+9665xxxxxxxx",
    "passwordPlaceholder": "••••••••",
    "confirmPasswordPlaceholder": "••••••••",
    "errors": {
      "fullNameMin": "الاسم الكامل يجب أن يكون 3 أحرف على الأقل",
      "emailInvalid": "البريد الإلكتروني غير صالح",
      "phoneInvalid": "أدخل رقم هاتف سعودي صحيح (+9665xxxxxxxx)",
      "passwordMin": "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
      "passwordMismatch": "كلمات المرور غير متطابقة",
      "termsRequired": "يجب الموافقة على الشروط والأحكام"
    }
  },
  "verify": {
    "errorMissingUserId": "معرف المستخدم مفقود"
  },
  "forgotPassword": {
    "errorSendFailed": "فشل إرسال رمز التحقق. يرجى المحاولة مرة أخرى."
  },
  "resetPassword": {
    "otpPlaceholder": "000000",
    "errorFailed": "فشل تغيير كلمة المرور. يرجى التحقق من الرمز.",
    "validation": {
      "otpLength": "الرمز يجب أن يكون 6 أرقام",
      "passwordMin": "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
      "passwordMismatch": "كلمات المرور غير متطابقة"
    }
  }
}
```

## Verification

After completing translations:
1. Run `npm run build` to verify no errors
2. Check that all auth forms render correctly in both Arabic and English
