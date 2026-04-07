---
description: "Task list for Feature 007 — Real Email Delivery via SendGrid"
---

# Tasks: Real Email Delivery via SendGrid with 10 HTML Templates

**Input**: Design documents from `/specs/007-email-sendgrid/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Domain entities, enums, and Infrastructure foundation that all stories depend on.

- [x] T001 Create `EmailLog` entity in `src/backend/Mojaz.Domain/Entities/EmailLog.cs` with all fields from data-model.md
- [x] T002 [P] Create `EmailStatus` enum in `src/backend/Mojaz.Domain/Enums/EmailStatus.cs` (Pending, Sent, Failed, Retrying)
- [x] T003 [P] Create `EmailMessage` DTO in `src/backend/Mojaz.Application/DTOs/Email/EmailMessage.cs`
- [x] T004 [P] Create `EmailAttachment` DTO in `src/backend/Mojaz.Application/DTOs/Email/EmailAttachment.cs`
- [x] T005 [P] Create `TemplatedEmailRequest` DTO in `src/backend/Mojaz.Application/DTOs/Email/TemplatedEmailRequest.cs`
- [x] T006 [P] Create all 10 per-template data models in `src/backend/Mojaz.Application/DTOs/Email/Templates/` (AccountVerificationEmailData.cs, PasswordRecoveryEmailData.cs, ApplicationReceivedEmailData.cs, DocumentsMissingEmailData.cs, AppointmentConfirmedEmailData.cs, MedicalResultEmailData.cs, TestResultEmailData.cs, ApplicationDecisionEmailData.cs, LicenseIssuedEmailData.cs, PaymentConfirmedEmailData.cs)
- [x] T007 Create `IEmailService` interface in `src/backend/Mojaz.Application/Interfaces/Services/IEmailService.cs` with `SendAsync` and `SendTemplatedAsync` methods
- [x] T008 [P] Create `IEmailLogRepository` interface in `src/backend/Mojaz.Application/Interfaces/Repositories/IEmailLogRepository.cs` with `FindDuplicateAsync` method
- [x] T009 Create EF Core configuration in `src/backend/Mojaz.Infrastructure/Configurations/EmailLogConfiguration.cs` with all indexes from data-model.md and global query filter
- [x] T010 Register `EmailLogs` DbSet in `src/backend/Mojaz.Infrastructure/Persistence/ApplicationDbContext.cs`
- [x] T011 Add `SendGrid`, `RazorLight`, and `PreMailer.Net` NuGet packages to `src/backend/Mojaz.Infrastructure/Mojaz.Infrastructure.csproj`
- [x] T012 Add `EMAIL_DEDUP_WINDOW_SECONDS`, `EMAIL_MAX_RETRIES`, and `EMAIL_RETRY_BASE_DELAY_SECONDS` keys to the system settings seed in `src/backend/Mojaz.Infrastructure/Configurations/SystemSettingsSeed.cs`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core email infrastructure that ALL user stories depend on — must be complete before any template work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T013 Generate EF Core migration `AddEmailLogs` using `dotnet ef migrations add AddEmailLogs --project src/backend/Mojaz.Infrastructure --startup-project src/backend/Mojaz.API`
- [x] T014 Create `EmailLogRepository` implementing `IEmailLogRepository` in `src/backend/Mojaz.Infrastructure/Repositories/EmailLogRepository.cs` with `FindDuplicateAsync` (queries by recipient + template + referenceId within dedup window)
- [x] T015 Create `SendGridSettings` configuration model in `src/backend/Mojaz.Infrastructure/Authentication/SendGridSettings.cs` (ApiKey, SenderEmail, SenderName)
- [x] T016 Create bilingual base layout template in `src/backend/Mojaz.Infrastructure/EmailTemplates/_BaseLayout.cshtml` — green header `#006C35`, Mojaz branding, two-block AR (RTL) + EN (LTR) structure, all CSS inlined
- [x] T017 Implement `SendGridEmailService` in `src/backend/Mojaz.Infrastructure/Services/SendGridEmailService.cs`:
  - Implements `IEmailService`
  - Uses `SendGrid` HTTP API v3
  - Polly retry: 3 attempts, exponential backoff (1s → 2s → 4s), only on 5xx/network errors
  - Pre-send: create `EmailLog` with `Status = Pending`; post-send: update to `Sent` or `Failed`
  - Pre-send dedup check via `IEmailLogRepository.FindDuplicateAsync`
  - Uses `RazorLight` to render `.cshtml` templates; uses `PreMailer.Net` to inline CSS
- [x] T018 Create DI registration extension in `src/backend/Mojaz.Infrastructure/Extensions/EmailServiceExtensions.cs` — registers `IEmailService → SendGridEmailService`, `IEmailLogRepository → EmailLogRepository`, configures `SendGridSettings` from `IConfiguration`
- [x] T019 Register email services in `src/backend/Mojaz.API/Program.cs` via `services.AddMojazEmail(configuration)`

**Checkpoint**: Foundation ready — all 10 template stories can now be implemented.

---

## Phase 3: User Story 1 — Account Verification & Password Recovery Emails (Priority: P1) 🎯 MVP

**Goal**: Send bilingual OTP emails for account activation and password recovery — the two most critical email flows that unblock user access.

**Independent Test**: Register a new account → verify a bilingual `account-verification` email arrives with OTP code and expiry. Send a forgot-password request → verify a `password-recovery` email arrives with reset OTP and security warning. Inspect `EmailLogs` table — both attempts must have `Status = Sent`.

### Implementation for User Story 1

- [X] T020 [P] [US1] Create `account-verification.cshtml` template in `src/backend/Mojaz.Infrastructure/EmailTemplates/account-verification.cshtml` — extends `_BaseLayout`, renders OTP code prominently, shows expiry time, bilingual AR/EN blocks, responsive table layout, all CSS inline
- [X] T021 [P] [US1] Create `password-recovery.cshtml` template in `src/backend/Mojaz.Infrastructure/EmailTemplates/password-recovery.cshtml` — same structure as account-verification + prominent security warning block ("If you did not request this…") in both AR and EN
- [X] T022 [US1] Wire `account-verification` email dispatch into `AuthService.RegisterAsync` in `src/backend/Mojaz.Application/Services/AuthService.cs` — enqueue via Hangfire `IBackgroundJobClient.Enqueue(() => _emailService.SendTemplatedAsync(...))`
- [X] T023 [US1] Wire `password-recovery` email dispatch into `AuthService.ForgotPasswordAsync` in `src/backend/Mojaz.Application/Services/AuthService.cs` — same Hangfire enqueue pattern

**Checkpoint**: US1 fully functional — registration and password recovery emails deliver end-to-end.

---

## Phase 4: User Story 2 — Password Recovery Email (Priority: P1)

> **Note**: US2 is implemented as part of Phase 3 (T021 + T023) since Password Recovery (`password-recovery` template) shares the same OTP infrastructure as Account Verification and is also P1 priority. No additional phase needed.

---

## Phase 5: User Story 3 — Application & Appointment Lifecycle Emails (Priority: P2)

**Goal**: Deliver transactional emails at every application milestone — received, appointment, medical result, test result, and final decision — so applicants are informed without logging in.

**Independent Test**: Simulate each lifecycle event via the employee portal → verify the correct bilingual email template is dispatched and `EmailLogs` shows `Status = Sent` for each. Check rendering in Gmail and Outlook.

### Implementation for User Story 3

- [X] T024 [P] [US3] Create `application-received.cshtml` in `src/backend/Mojaz.Infrastructure/EmailTemplates/application-received.cshtml` — shows `ApplicationNumber`, service type (AR/EN), and next steps bullet list
- [X] T025 [P] [US3] Create `appointment-confirmed.cshtml` in `src/backend/Mojaz.Infrastructure/EmailTemplates/appointment-confirmed.cshtml` — shows appointment type, date/time formatted in AR and EN, location
- [ ] T026 [P] [US3] Create `medical-result.cshtml` in `src/backend/Mojaz.Infrastructure/EmailTemplates/medical-result.cshtml` — shows result (fit/unfit), doctor name, next steps in both languages
- [ ] T027 [P] [US3] Create `test-result.cshtml` in `src/backend/Mojaz.Infrastructure/EmailTemplates/test-result.cshtml` — shows test type, pass/fail, score in both languages
- [ ] T028 [P] [US3] Create `application-decision.cshtml` in `src/backend/Mojaz.Infrastructure/EmailTemplates/application-decision.cshtml` — shows decision (approved/rejected) with conditional styling (green/red header variant), optional reason block
- [X] T029 [US3] Wire `application-received` dispatch in `ApplicationService.CreateAsync` in `src/backend/Mojaz.Application/Services/ApplicationService.cs` — Hangfire background job
- [X] T030 [US3] Wire `appointment-confirmed` dispatch in appointment service (wherever appointment confirmation is saved) — Hangfire background job
- [ ] T031 [US3] Wire `medical-result` dispatch when doctor saves medical exam result — Hangfire background job
- [ ] T032 [US3] Wire `test-result` dispatch when examiner finalizes theory/practical result — Hangfire background job
- [X] T033 [US3] Wire `application-decision` dispatch when manager saves final approval/rejection — Hangfire background job

**Checkpoint**: US3 fully functional — all 5 lifecycle emails deliver independently.

---

## Phase 6: User Story 4 — License Issuance & Payment Confirmation Emails (Priority: P2)

**Goal**: Deliver the highest-value communication — the license issuance email with download link — and confirm every successful payment with a detailed receipt email.

**Independent Test**: Trigger a license issuance event → verify `license-issued` email arrives with license number and download URL. Trigger a payment confirmation → verify `payment-confirmed` email arrives with amount, reference, and fee type. Both appear in `EmailLogs` as `Sent`.

### Implementation for User Story 4

- [X] T034 [P] [US4] Create `license-issued.cshtml` in `src/backend/Mojaz.Infrastructure/EmailTemplates/license-issued.cshtml` — shows license number prominently, large CTA button linking to `DownloadUrl`, bilingual congratulatory message
- [X] T035 [P] [US4] Create `payment-confirmed.cshtml` in `src/backend/Mojaz.Infrastructure/EmailTemplates/payment-confirmed.cshtml` — receipt-style layout showing amount, currency, reference number, fee type, payment date in AR/EN
- [X] T036 [US4] Wire `license-issued` dispatch in license issuance service — Hangfire background job with `ReferenceId = LicenseId`
- [X] T037 [US4] Wire `payment-confirmed` dispatch in payment service upon successful payment confirmation — Hangfire background job with `ReferenceId = PaymentId`

**Checkpoint**: US4 fully functional — license and payment emails deliver end-to-end.

---

## Phase 7: User Story 5 — Missing Documents Notification (Priority: P2)

**Goal**: Proactively notify applicants when documents are flagged as missing, including a clear list and submission deadline, reducing staff intervention.

**Independent Test**: Flag an application as having missing documents via the employee portal → verify `documents-missing` email arrives with the correct document list and deadline in both AR and EN.

### Implementation for User Story 5

- [X] T038 [US5] Create `documents-missing.cshtml` in `src/backend/Mojaz.Infrastructure/EmailTemplates/documents-missing.cshtml` — renders `MissingDocumentsAr`/`MissingDocumentsEn` lists as `<ul>` items, shows `DeadlineDate` formatted in both locales, warning-colored header block
- [X] T039 [US5] Wire `documents-missing` dispatch when employee flags missing documents — Hangfire background job with `ReferenceId = ApplicationId`

**Checkpoint**: All 5 user stories fully functional — all 10 email templates operational.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Security hardening, observability, dev tooling, and production readiness.

- [ ] T040 [P] Add email preview dev endpoint `GET /api/v1/dev/email-preview/{templateName}` in `src/backend/Mojaz.API/Controllers/DevController.cs` — only enabled when `IWebHostEnvironment.IsDevelopment()` is true; renders template to HTML response without sending
- [ ] T041 [P] Verify `SendGridSettings:ApiKey` is loaded exclusively from environment variables / User Secrets — run `dotnet user-secrets list` and confirm no secrets in `appsettings.json` or committed config files
- [ ] T042 [P] Validate recipient email masking in `EmailLogs` — confirm `RecipientEmail` is stored as `***@domain.com` in Serilog structured logs (not in the DB column itself)
- [ ] T043 Write unit tests for `SendGridEmailService` in `tests/Mojaz.Infrastructure.Tests/Services/SendGridEmailService_Tests.cs` — cover: successful send logs `Status = Sent`, 5xx triggers retry up to 3 times, 4xx does NOT retry, dedup suppresses duplicate within window
- [ ] T044 [P] Validate all 10 templates render without broken layout in Gmail (via Litmus or manual test), Outlook 2016+, and Apple Mail — document results in `specs/007-email-sendgrid/checklists/template-qa.md`
- [ ] T045 [P] Validate Arabic blocks render RTL and English blocks render LTR across all 10 templates — screenshot evidence in checklist
- [ ] T046 Verify `EmailLogs` composite index `IX_EmailLogs_RecipientEmail_TemplateName_ReferenceId` is present in the generated migration file
- [ ] T047 [P] Update `specs/007-email-sendgrid/quickstart.md` with final verified setup steps including User Secrets commands and Hangfire dashboard verification path

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately — no dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1 completion — **BLOCKS all user story phases**.
- **User Stories (Phases 3–7)**: All depend on Phase 2 completion. Can proceed in parallel once Phase 2 is done.
- **Polish (Phase 8)**: Depends on all desired user story phases being complete.

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational. No dependency on other stories.
- **US2 (P1)**: Merged into US1 — same phase.
- **US3 (P2)**: Starts after Foundational. Independent of US1/US2.
- **US4 (P2)**: Starts after Foundational. Independent of US1/US2/US3.
- **US5 (P2)**: Starts after Foundational. Independent of all other stories.

### Parallel Opportunities

- T002–T006 (Setup enums/DTOs): All parallelizable.
- T020–T021 (US1 templates): Parallelizable.
- T024–T028 (US3 templates): All 5 parallelizable.
- T034–T035 (US4 templates): Parallelizable.
- T040–T042, T044–T047 (Polish): All parallelizable.
- US3, US4, US5 phases can run in parallel across different developers once Phase 2 is complete.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks everything)
3. Complete Phase 3: User Story 1 (account-verification + password-recovery)
4. **STOP and VALIDATE**: Register an account → check inbox → inspect `EmailLogs`
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → email infrastructure ready
2. US1 → verification and recovery emails ✅ (MVP!)
3. US3 → lifecycle milestone emails ✅
4. US4 → license issuance and payment ✅
5. US5 → missing documents notification ✅
6. Polish → production-ready hardening ✅

### Parallel Team Strategy

With multiple developers (after Phase 2 completes):
- **Dev A**: US1 (account-verification + password-recovery templates + wiring)
- **Dev B**: US3 (5 lifecycle templates + wiring)
- **Dev C**: US4 + US5 (license + payment + documents templates + wiring)

---

## Notes

- `[P]` tasks operate on different files and have no interdependencies within their phase
- All email sends MUST be dispatched via Hangfire — never `await _emailService.SendAsync()` directly in API request handler
- Template `.cshtml` files MUST use inline CSS only — no `<style>` blocks, no external stylesheets
- All 10 templates share the `_BaseLayout.cshtml` — do not duplicate header/footer HTML in individual templates
- `EmailLog.IsDeleted` is always `false` — the table is append-only; do not add soft-delete behavior
- Verify each template renders correctly at 600px width (standard email width) before marking complete
