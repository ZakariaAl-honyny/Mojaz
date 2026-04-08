# Quickstart: Email Delivery via SendGrid — Feature 007

**Branch**: `007-email-sendgrid`  
**Date**: 2026-04-07

---

## Prerequisites

- SendGrid account with a verified sender domain (`mojaz.gov.sa`)
- API key with `Mail Send` permission scoped to the sender identity
- .NET 8 SDK
- SQL Server running (for `EmailLogs` migration)

---

## Environment Setup

Add to `appsettings.Development.json` (never commit real values — use User Secrets in dev):

```json
{
  "SendGridSettings": {
    "ApiKey": "SG.xxxx",
    "SenderEmail": "no-reply@mojaz.gov.sa",
    "SenderName": "مُجاز - Mojaz"
  }
}
```

Or via User Secrets:

```bash
dotnet user-secrets set "SendGridSettings:ApiKey" "SG.xxxx" --project src/backend/Mojaz.API
dotnet user-secrets set "SendGridSettings:SenderEmail" "no-reply@mojaz.gov.sa" --project src/backend/Mojaz.API
dotnet user-secrets set "SendGridSettings:SenderName" "مُجاز - Mojaz" --project src/backend/Mojaz.API
```

---

## Run the Migration

```bash
cd src/backend
dotnet ef migrations add AddEmailLogs \
  --project Mojaz.Infrastructure/Mojaz.Infrastructure.csproj \
  --startup-project Mojaz.API/Mojaz.API.csproj

dotnet ef database update \
  --project Mojaz.Infrastructure/Mojaz.Infrastructure.csproj \
  --startup-project Mojaz.API/Mojaz.API.csproj
```

---

## Verify Email Delivery (Dev)

After running the app, trigger an OTP registration. Check:

1. `EmailLogs` table — a new row should appear with `Status = Sent`
2. Recipient inbox — a bilingual HTML email should arrive from `no-reply@mojaz.gov.sa`
3. Hangfire dashboard at `/hangfire` — job should appear as `Succeeded`

---

## Run Tests

```bash
dotnet test tests/Mojaz.Infrastructure.Tests --filter "SendGridEmailService"
```

---

## Template Preview (Dev)

To preview a rendered template without sending:

```http
GET /api/v1/dev/email-preview/{templateName}?lang=ar
```

> ⚠️ This endpoint is only available in `Development` environment — guarded by `IWebHostEnvironment.IsDevelopment()`.

---

## Key Files

| File | Purpose |
|------|---------|
| `Mojaz.Infrastructure/Services/SendGridEmailService.cs` | Core email service implementation |
| `Mojaz.Infrastructure/EmailTemplates/*.cshtml` | Bilingual HTML templates |
| `Mojaz.Application/Interfaces/Services/IEmailService.cs` | Interface contract |
| `Mojaz.Domain/Entities/EmailLog.cs` | Persistence entity |
| `Mojaz.Infrastructure/Extensions/EmailServiceExtensions.cs` | DI registration |
