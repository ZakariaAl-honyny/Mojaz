# Feature 008: Real SMS Delivery via Twilio with 6 Message Templates

## WHAT WE'RE BUILDING:
Production SMS service using Twilio API with bilingual message templates.

## REQUIREMENTS:

### 1. ISmsService Interface: SendAsync(), SendOtpAsync()
### 2. TwilioSmsService: Twilio REST API, 2 retries, log to SmsLogs, max 160 chars
### 3. 6 SMS Templates (bilingual):
01. registration-otp, 02. recovery-otp, 03. appointment-confirmed, 04. appointment-reminder, 05. test-result, 06. license-ready

## ACCEPTANCE CRITERIA:
- [ ] SMS sent via Twilio API
- [ ] All 6 templates fit 160 chars
- [ ] Bilingual AR/EN
- [ ] SmsLogs populated
- [ ] Cost tracked
