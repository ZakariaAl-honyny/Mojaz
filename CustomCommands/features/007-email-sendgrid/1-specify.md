# Feature 007: Real Email Delivery via SendGrid with 10 HTML Templates

> **Status:** To be generated via `/speckit.clarify`

## WHAT WE'RE BUILDING:
Production email service using SendGrid API with professional bilingual HTML email templates.

## REQUIREMENTS:

### 1. IEmailService Interface (Application layer):
- SendAsync(EmailMessage message) → Task<bool>
- SendTemplatedAsync(templateName, data, toEmail, toName, language) → Task<bool>

### 2. SendGridEmailService Implementation (Infrastructure layer):
- Configure from appsettings: ApiKey, SenderEmail, SenderName
- 3 retries with exponential backoff
- Log every attempt to EmailLogs table
- Support attachments

### 3. 10 HTML Email Templates:
Each: professional government design (green header), bilingual AR/EN, responsive, inline CSS
01. account-verification — OTP code, expiry notice
02. password-recovery — OTP code, security warning
03. application-received — App number, service type, next steps
04. documents-missing — Missing documents list, deadline
05. appointment-confirmed — Type, date, time, location
06. medical-result — Result, doctor name, next steps
07. test-result — Test type, result, score
08. application-decision — Approved/Rejected
09. license-issued — License number, download link
10. payment-confirmed — Amount, reference, fee type

### 4. Sender: no-reply@mojaz.gov.sa

## ACCEPTANCE CRITERIA:
- [ ] Email sent via SendGrid API
- [ ] All 10 templates render in Gmail, Outlook, Apple Mail
- [ ] Arabic RTL + English LTR correct
- [ ] Failed sends logged
- [ ] Retry logic works (3 attempts)
- [ ] EmailLogs populated for every attempt
