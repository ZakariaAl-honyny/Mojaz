# Research: Real Email Delivery via SendGrid — Feature 007

**Phase**: 0 — Research & Unknowns Resolution  
**Branch**: `007-email-sendgrid`  
**Date**: 2026-04-07

---

## Decision 1: Email Provider Selection

**Decision**: SendGrid (Twilio SendGrid) via HTTP API (not SMTP)  
**Rationale**: SendGrid is explicitly named in the PRD (`12.2 Email Integration`). The HTTP API is preferred over SMTP for reliability, retry control, detailed delivery status webhooks, and structured logging. The `SendGrid` NuGet package (`SendGrid` v9.x) wraps the v3 API cleanly.  
**Alternatives Considered**:
- Amazon SES — cheaper at scale, but requires AWS account setup and is listed as alternative only
- Mailgun — solid alternative, but SendGrid has better Saudi delivery reputation and is PRD-primary
- SMTP relay — rejected; offers no programmatic retry control or delivery receipts

---

## Decision 2: Template Rendering Strategy

**Decision**: Server-side Razor HTML template rendering using `RazorLight` (infrastructure layer), compiled to inline-CSS HTML strings before sending  
**Rationale**: Razor templates colocate with .NET code, support strong-typed models, and allow reuse of C# formatting utilities (dates, numbers). Templates are stored as `.cshtml` files in `Mojaz.Infrastructure/EmailTemplates/`. Inline CSS is mandatory for email client compatibility.  
**Alternatives Considered**:
- Handlebars/Mustache — language-agnostic but weaker typing, harder to validate at compile time
- SendGrid Dynamic Templates (remote) — rejected; couples template content to SendGrid's platform, making offline testing and RTL/LTR bilingual layout harder to control
- Static string interpolation — rejected; unmaintainable for complex bilingual HTML

---

## Decision 3: RTL/LTR Bilingual Layout in Email

**Decision**: Single bilingual HTML document with two `<div>` sections — Arabic section (`dir="rtl"`, `lang="ar"`) and English section (`dir="ltr"`, `lang="en"`) separated by a horizontal rule  
**Rationale**: Most email clients (including Outlook) have limited `dir` attribute support at the `<body>` level. Explicit per-block `dir` attributes with `text-align: right` on the Arabic block and `text-align: left` on the English block is the most reliable cross-client approach. This matches Saudi government email patterns (e.g., Absher, Nafath).  
**Alternatives Considered**:
- Separate AR and EN emails — doubles volume, less cohesive communication
- Single `<html dir="rtl">` — breaks English sections in Outlook
- Conditional comments for Outlook — overly complex; inline approach is simpler and testable

---

## Decision 4: Retry Strategy

**Decision**: Polly-based retry policy with 3 attempts and exponential backoff (1s → 2s → 4s), configured on the `HttpClient` used by the SendGrid client  
**Rationale**: Polly is already a transitive dependency of ASP.NET Core. Exponential backoff avoids thundering-herd on transient SendGrid outages. Only `5xx` responses and network exceptions trigger retries; `4xx` (permanent failures) do not.  
**Alternatives Considered**:
- Manual retry loop — verbose, harder to test
- Hangfire retry — suitable for job-level retries but adds ~100ms overhead per attempt; Polly retries at the HTTP level are faster for transient blips

---

## Decision 5: Background Dispatch via Hangfire

**Decision**: Email sends are enqueued as Hangfire background jobs from within the Application service layer via `IBackgroundJobClient`. The Hangfire job calls `IEmailService.SendAsync` or `IEmailService.SendTemplatedAsync`.  
**Rationale**: Constitution Principle VII mandates async notification delivery without blocking the primary API request. Hangfire is already in the stack and provides job persistence, retry on failure, and a monitoring dashboard.  
**Alternatives Considered**:
- `Task.Run` fire-and-forget — no persistence; lost on app restart or crash
- Azure Service Bus / RabbitMQ — over-engineered for MVP; Hangfire sufficient for current scale

---

## Decision 6: EmailLogs Persistence

**Decision**: `EmailLog` entity persisted directly to SQL Server via EF Core in the Infrastructure layer. `IEmailLogRepository` defined in Application, implemented in Infrastructure. Logged before the send attempt, updated after.  
**Rationale**: Pre-send logging ensures every attempted email is tracked even if the process crashes during send. Post-send update records final status and error.  
**Alternatives Considered**:
- Serilog sink to structured log file — not queryable by admins in the portal
- Separate audit log — EmailLogs has a distinct schema and access pattern; sharing AuditLogs would pollute that table

---

## Decision 7: Deduplication Window

**Decision**: Before sending any templated email, query `EmailLogs` for a record matching `(RecipientEmail, TemplateName, ReferenceId)` created within the last `EMAIL_DEDUP_WINDOW_SECONDS` (default: 60s, stored in `SystemSettings`).  
**Rationale**: Race conditions during concurrent application status updates can trigger duplicate notifications. A configurable dedup window prevents double-sends without complex distributed locking.  
**Alternatives Considered**:
- Unique constraint in DB — too rigid; prevents legitimate resends after the window
- Redis distributed cache for dedup keys — over-engineered for MVP; SQL query is fast enough at this scale

---

## Resolved Unknowns

| Unknown | Resolution |
|---------|-----------|
| Which HTML template engine? | RazorLight (`.cshtml` files in Infrastructure) |
| Inline CSS approach | All styles inlined using `PreMailer.Net` before dispatch |
| RTL/LTR strategy | Two-block bilingual HTML with per-block `dir` attributes |
| Retry mechanism | Polly on HttpClient (3 retries, exponential backoff) |
| Async dispatch | Hangfire background jobs |
| Dedup strategy | DB query on EmailLogs with configurable window |
| Provider | SendGrid HTTP API v3 via `SendGrid` NuGet package |
