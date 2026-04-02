---
description: Security requirements — NON-NEGOTIABLE
globs: ["**/*"]
alwaysApply: true
---

# Security Rules — NON-NEGOTIABLE

1. NEVER hardcode secrets → use appsettings + User Secrets + env vars
2. NEVER log sensitive data → mask: NationalId: ****7890
3. NEVER return PasswordHash in API responses → exclude from DTOs
4. ALWAYS validate ALL input server-side → FluentValidation
5. ALWAYS hash passwords → BCrypt cost 12+
6. ALWAYS hash OTPs → BCrypt before storing in OtpCodes
7. ALWAYS use [Authorize] → with specific roles
8. ALWAYS check resource ownership → applicant sees only own data
9. ALWAYS audit sensitive operations → AuditLog table
10. ALWAYS validate file uploads → MIME type + size + extension
11. Rate limit auth endpoints → login: 10/min, register: 5/min
12. Set security headers → X-Content-Type-Options, X-Frame-Options, etc.
13. HTTPS in production → redirect HTTP
14. No stack traces in production responses → global exception handler