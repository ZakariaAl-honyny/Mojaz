# Data Model: Real Email Delivery via SendGrid — Feature 007

**Phase**: 1 — Design  
**Branch**: `007-email-sendgrid`  
**Date**: 2026-04-07

---

## New Entities

### EmailLog

Tracks every email send attempt — persisted before the send and updated after.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `Id` | `Guid` | ✅ | Primary key |
| `RecipientEmail` | `string(320)` | ✅ | Masked in logs: `***@domain.com` |
| `RecipientName` | `string(200)` | ❌ | Display name |
| `TemplateName` | `string(100)` | ✅ | e.g., `account-verification` |
| `Subject` | `string(998)` | ✅ | Email subject line (bilingual) |
| `Status` | `EmailStatus` (enum) | ✅ | `Pending`, `Sent`, `Failed`, `Retrying` |
| `AttemptCount` | `int` | ✅ | Default `0`; incremented per retry |
| `ErrorMessage` | `string(2000)` | ❌ | Last error detail; null if success |
| `ReferenceId` | `string(50)` | ❌ | Application/Payment/User ID for dedup |
| `SentAt` | `DateTime?` | ❌ | UTC timestamp of successful delivery |
| `CreatedAt` | `DateTime` | ✅ | UTC; set at log creation (pre-send) |
| `IsDeleted` | `bool` | ✅ | Always `false`; append-only, no soft delete needed but field required by global filter |

**Indexes**:
- `IX_EmailLogs_RecipientEmail`
- `IX_EmailLogs_TemplateName`
- `IX_EmailLogs_Status`
- `IX_EmailLogs_CreatedAt`
- `IX_EmailLogs_RecipientEmail_TemplateName_ReferenceId` (composite — used for dedup query)

---

## New Enums

### EmailStatus

```csharp
// Mojaz.Domain/Enums/EmailStatus.cs
public enum EmailStatus
{
    Pending  = 0,   // Logged before send attempt
    Sent     = 1,   // Successfully delivered to SendGrid
    Failed   = 2,   // All retries exhausted
    Retrying = 3    // Transient failure; retry pending
}
```

---

## New DTOs (Application Layer)

### EmailMessage

Raw email (for non-templated sends, e.g., attachments):

```
EmailMessage
├── To: string (recipient email)
├── ToName: string (display name)
├── Subject: string
├── HtmlBody: string (pre-rendered HTML)
├── PlainTextBody: string? (fallback)
└── Attachments: List<EmailAttachment>?

EmailAttachment
├── Filename: string
├── Content: byte[] (file bytes)
└── MimeType: string
```

### TemplatedEmailRequest

Template-based send (used for all 10 application templates):

```
TemplatedEmailRequest
├── TemplateName: string          (e.g., "account-verification")
├── To: string                    (recipient email)
├── ToName: string                (recipient display name)
├── Language: PreferredLanguage   (AR/EN — defaults to AR)
├── ReferenceId: string?          (for dedup; e.g., ApplicationId)
└── Data: object                  (strongly-typed per template — see below)
```

### Per-Template Data Models

| Template | Data Model Fields |
|----------|-----------------|
| `account-verification` | `FullNameAr`, `FullNameEn`, `OtpCode`, `ExpiryMinutes` |
| `password-recovery` | `FullNameAr`, `FullNameEn`, `OtpCode`, `ExpiryMinutes` |
| `application-received` | `FullNameAr`, `FullNameEn`, `ApplicationNumber`, `ServiceTypeAr`, `ServiceTypeEn`, `NextStepsAr`, `NextStepsEn` |
| `documents-missing` | `FullNameAr`, `FullNameEn`, `ApplicationNumber`, `MissingDocumentsAr`, `MissingDocumentsEn` (List), `DeadlineDate` |
| `appointment-confirmed` | `FullNameAr`, `FullNameEn`, `AppointmentTypeAr`, `AppointmentTypeEn`, `AppointmentDate`, `AppointmentTime`, `LocationAr`, `LocationEn` |
| `medical-result` | `FullNameAr`, `FullNameEn`, `ResultAr`, `ResultEn`, `DoctorNameAr`, `DoctorNameEn`, `NextStepsAr`, `NextStepsEn` |
| `test-result` | `FullNameAr`, `FullNameEn`, `TestTypeAr`, `TestTypeEn`, `ResultAr`, `ResultEn`, `Score` |
| `application-decision` | `FullNameAr`, `FullNameEn`, `ApplicationNumber`, `DecisionAr`, `DecisionEn`, `ReasonAr?`, `ReasonEn?` |
| `license-issued` | `FullNameAr`, `FullNameEn`, `LicenseNumber`, `DownloadUrl` |
| `payment-confirmed` | `FullNameAr`, `FullNameEn`, `Amount`, `Currency`, `ReferenceNumber`, `FeeTypeAr`, `FeeTypeEn`, `PaymentDate` |

---

## Interface Contracts (Application Layer)

```csharp
// Mojaz.Application/Interfaces/Services/IEmailService.cs
public interface IEmailService
{
    Task<bool> SendAsync(EmailMessage message, CancellationToken ct = default);
    Task<bool> SendTemplatedAsync(TemplatedEmailRequest request, CancellationToken ct = default);
}

// Mojaz.Application/Interfaces/Repositories/IEmailLogRepository.cs
public interface IEmailLogRepository : IRepository<EmailLog>
{
    Task<EmailLog?> FindDuplicateAsync(
        string recipientEmail,
        string templateName,
        string? referenceId,
        int dedupWindowSeconds,
        CancellationToken ct = default);
}
```

---

## SystemSettings Keys (New)

| Key | Default | Purpose |
|-----|---------|---------|
| `EMAIL_DEDUP_WINDOW_SECONDS` | `60` | Suppress duplicate sends within this window |
| `EMAIL_MAX_RETRIES` | `3` | Maximum retry attempts per send |
| `EMAIL_RETRY_BASE_DELAY_SECONDS` | `1` | Base delay for exponential backoff |

---

## EF Core Migration

**Migration name**: `AddEmailLogs`

New table: `EmailLogs` (fields as above)

No changes to existing tables required.

---

## File Structure

```text
src/backend/
├── Mojaz.Domain/
│   ├── Entities/
│   │   └── EmailLog.cs                              ← NEW
│   └── Enums/
│       └── EmailStatus.cs                           ← NEW
│
├── Mojaz.Application/
│   ├── DTOs/Email/
│   │   ├── EmailMessage.cs                          ← NEW
│   │   ├── EmailAttachment.cs                       ← NEW
│   │   ├── TemplatedEmailRequest.cs                 ← NEW
│   │   └── Templates/                               ← NEW (per-template data models)
│   │       ├── AccountVerificationEmailData.cs
│   │       ├── PasswordRecoveryEmailData.cs
│   │       ├── ApplicationReceivedEmailData.cs
│   │       ├── DocumentsMissingEmailData.cs
│   │       ├── AppointmentConfirmedEmailData.cs
│   │       ├── MedicalResultEmailData.cs
│   │       ├── TestResultEmailData.cs
│   │       ├── ApplicationDecisionEmailData.cs
│   │       ├── LicenseIssuedEmailData.cs
│   │       └── PaymentConfirmedEmailData.cs
│   └── Interfaces/
│       ├── Services/
│       │   └── IEmailService.cs                     ← NEW
│       └── Repositories/
│           └── IEmailLogRepository.cs               ← NEW
│
├── Mojaz.Infrastructure/
│   ├── Services/
│   │   └── SendGridEmailService.cs                  ← NEW
│   ├── Repositories/
│   │   └── EmailLogRepository.cs                    ← NEW
│   ├── EmailTemplates/                              ← NEW
│   │   ├── _BaseLayout.cshtml
│   │   ├── account-verification.cshtml
│   │   ├── password-recovery.cshtml
│   │   ├── application-received.cshtml
│   │   ├── documents-missing.cshtml
│   │   ├── appointment-confirmed.cshtml
│   │   ├── medical-result.cshtml
│   │   ├── test-result.cshtml
│   │   ├── application-decision.cshtml
│   │   ├── license-issued.cshtml
│   │   └── payment-confirmed.cshtml
│   ├── Configurations/
│   │   └── EmailLogConfiguration.cs                 ← NEW
│   └── Extensions/
│       └── EmailServiceExtensions.cs                ← NEW (DI registration)
│
└── Mojaz.API/
    └── (no new files; DI registered via EmailServiceExtensions)

tests/
└── Mojaz.Infrastructure.Tests/
    └── Services/
        └── SendGridEmailService_Tests.cs            ← NEW
```
