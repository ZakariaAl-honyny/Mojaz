# Tasks: Real Email Delivery via SendGrid with 10 HTML Templates

**Input**: Design documents from `/specs/007-email-sendgrid/`
**Prerequisites**: plan.md ✅ | spec.md ✅
**Branch**: `007-email-sendgrid`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (independent files, no dependency on incomplete task)
- **[US#]**: Which user story this task belongs to
- All paths are relative to repository root

---

## Phase 1: Setup
**Purpose**: Initialize domain entities, DTOs, and basic configuration.

- [x] T001 Create `EmailLog` entity in `src/backend/src/Mojaz.Domain/Entities/EmailLog.cs`
- [x] T002 [P] Create `EmailStatus` enum in `src/backend/src/Mojaz.Domain/Enums/EmailStatus.cs`
- [x] T003 [P] Create `EmailMessage` DTO in `src/backend/src/Mojaz.Application/DTOs/Email/EmailMessage.cs`
- [x] T004 [P] Create `EmailAttachment` DTO in `src/backend/src/Mojaz.Application/DTOs/Email/EmailAttachment.cs`
- [x] T005 [P] Create `TemplatedEmailRequest` DTO in `src/backend/src/Mojaz.Application/DTOs/Email/TemplatedEmailRequest.cs`
- [x] T006 [P] Create all 10 per-template data models in `src/backend/src/Mojaz.Application/DTOs/Email/Templates/`
- [x] T007 Create `IEmailService` interface in `src/backend/src/Mojaz.Application/Interfaces/Services/IEmailService.cs`
- [x] T008 [P] Create `IEmailLogRepository` interface in `src/backend/src/Mojaz.Application/Interfaces/Repositories/IEmailLogRepository.cs`
- [x] T009 Create EF Core configuration in `src/backend/src/Mojaz.Infrastructure/Persistence/Configurations/EmailLogConfiguration.cs`
- [x] T010 Register `EmailLogs` DbSet in `src/backend/src/Mojaz.Infrastructure/Persistence/MojazDbContext.cs`
- [x] T011 Add `SendGrid`, `RazorLight`, and `PreMailer.Net` NuGet packages to `src/backend/src/Mojaz.Infrastructure/Mojaz.Infrastructure.csproj`
- [x] T012 Add `EMAIL_DEDUP_WINDOW_SECONDS`, `EMAIL_MAX_RETRIES`, and `EMAIL_RETRY_BASE_DELAY_SECONDS` keys to `SystemSettingsSeed.cs`

---

## Phase 2: Tests
**Purpose**: Verify delivery reliability and template rendering.

- [ ] T043 Write unit tests for `SendGridEmailService` in `tests/Mojaz.Infrastructure.Tests/Services/SendGridEmailService_Tests.cs` (covering: success, retry on 5xx, no retry on 4xx, dedup window)
- [ ] T044 [P] Validate all 10 templates render without layout breakage in Gmail, Outlook, and Apple Mail.
- [ ] T045 [P] Validate Arabic blocks render RTL and English blocks render LTR across all templates.

---

## Phase 3: Core
**Purpose**: Implement the email engine, base layouts, and all 10 functional templates.

### Foundational Engine
- [x] T013 Generate EF Core migration `AddEmailLogs` using `dotnet ef migrations add AddEmailLogs`
- [x] T014 Create `EmailLogRepository` in `src/backend/src/Mojaz.Infrastructure/Persistence/Repositories/EmailLogRepository.cs`
- [x] T015 Create `SendGridSettings` configuration model in `src/backend/src/Mojaz.Infrastructure/Authentication/SendGridSettings.cs`
- [x] T016 Create bilingual base layout template in `src/backend/src/Mojaz.Infrastructure/EmailTemplates/_BaseLayout.cshtml`
- [x] T017 Implement `SendGridEmailService` in `src/backend/src/Mojaz.Infrastructure/Services/SendGridEmailService.cs` (Polly retry, RazorLight rendering, PreMailer inlining, Log tracking)
- [x] T018 Create DI registration extension in `src/backend/src/Mojaz.Infrastructure/Extensions/EmailServiceExtensions.cs`
- [x] T019 Register email services in `src/backend/src/Mojaz.API/Program.cs`

### US1 — Verification & Recovery Emails (P1)
- [X] T020 [P] [US1] Create `account-verification.cshtml` template in `src/backend/src/Mojaz.Infrastructure/EmailTemplates/account-verification.cshtml`
- [X] T021 [P] [US1] Create `password-recovery.cshtml` template in `src/backend/src/Mojaz.Infrastructure/EmailTemplates/password-recovery.cshtml`
- [X] T022 [US1] Wire `account-verification` dispatch into `AuthService.RegisterAsync` via Hangfire.
- [X] T023 [US1] Wire `password-recovery` dispatch into `AuthService.ForgotPasswordAsync` via Hangfire.

### US3 — Lifecycle Milestone Emails (P2)
- [X] T024 [P] [US3] Create `application-received.cshtml` in `src/backend/src/Mojaz.Infrastructure/EmailTemplates/application-received.cshtml`
- [X] T025 [P] [US3] Create `appointment-confirmed.cshtml` in `src/backend/src/Mojaz.Infrastructure/EmailTemplates/appointment-confirmed.cshtml`
- [ ] T026 [P] [US3] Create `medical-result.cshtml` in `src/backend/src/Mojaz.Infrastructure/EmailTemplates/medical-result.cshtml`
- [ ] T027 [P] [US3] Create `test-result.cshtml` in `src/backend/src/Mojaz.Infrastructure/EmailTemplates/test-result.cshtml`
- [ ] T028 [P] [US3] Create `application-decision.cshtml` in `src/backend/src/Mojaz.Infrastructure/EmailTemplates/application-decision.cshtml`
- [X] T029 [US3] Wire `application-received` dispatch in `ApplicationService.CreateAsync` via Hangfire.
- [X] T030 [US3] Wire `appointment-confirmed` dispatch in appointment service via Hangfire.
- [ ] T031 [US3] Wire `medical-result` dispatch when doctor saves result via Hangfire.
- [ ] T032 [US3] Wire `test-result` dispatch when examiner finalizes result via Hangfire.
- [X] T033 [US3] Wire `application-decision` dispatch when manager saves final decision via Hangfire.

### US4 — Issuance & Payment Emails (P2)
- [X] T034 [P] [US4] Create `license-issued.cshtml` in `src/backend/src/Mojaz.Infrastructure/EmailTemplates/license-issued.cshtml`
- [X] T035 [P] [US4] Create `payment-confirmed.cshtml` in `src/backend/src/Mojaz.Infrastructure/EmailTemplates/payment-confirmed.cshtml`
- [X] T036 [US4] Wire `license-issued` dispatch in license issuance service via Hangfire.
- [X] T037 [US4] Wire `payment-confirmed` dispatch in payment service via Hangfire.

### US5 — Missing Documents Notification (P2)
- [X] T038 [US5] Create `documents-missing.cshtml` in `src/backend/src/Mojaz.Infrastructure/EmailTemplates/documents-missing.cshtml`
- [X] T039 [US5] Wire `documents-missing` dispatch when employee flags missing docs via Hangfire.

---

## Phase 4: Integration
**Purpose**: End-to-end flow verification and reliability testing.

- [ ] T040 Verify that all 10 templates are successfully dispatched and captured in `EmailLogs` across all triggers.
- [ ] T041 Simulate transient SendGrid errors to verify Polly exponential backoff and retry logic.
- [ ] T042 Verify a 60-second deduplication window prevents redundant emails for the same reference.

---

## Phase 5: Polish
**Purpose**: Security hardening and developer tooling.

- [ ] T043 [P] Add email preview dev endpoint `GET /api/v1/dev/email-preview/{templateName}` in `src/backend/src/Mojaz.API/Controllers/DevController.cs`
- [ ] T044 [P] Verify `SendGridSettings:ApiKey` is loaded exclusively from environment variables.
- [ ] T045 [P] Validate recipient email masking in Serilog structured logs.
- [ ] T046 Verify `EmailLogs` composite index `IX_EmailLogs_RecipientEmail_TemplateName_ReferenceId` exists.
- [ ] T047 [P] Update `specs/007-email-sendgrid/quickstart.md` with final setup steps.
