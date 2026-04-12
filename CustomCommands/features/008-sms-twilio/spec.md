# Feature Specification: 008-sms-twilio

**Feature Branch**: `008-sms-twilio`
**Created**: 2026-04-03
**Status**: Draft

## Summary

Production SMS service using Twilio API with 6 bilingual message templates (max 160 chars each).

## Requirements

### Functional Requirements

- **FR-001**: ISmsService (Application layer): SendAsync() and SendOtpAsync().
- **FR-002**: TwilioSmsService (Infrastructure): Twilio REST API, 2 retries, max 160 chars per message.
- **FR-003**: Log every send attempt in SmsLogs table.
- **FR-004**: 6 bilingual SMS templates (AR/EN): registration-otp, recovery-otp, appointment-confirmed, appointment-reminder, test-result, license-ready.
- **FR-005**: Track estimated cost per SMS in SmsLogs.

## Success Criteria

- **SC-001**: SMS sent via Twilio API.
- **SC-002**: All 6 templates fit within 160 characters.
- **SC-003**: Bilingual AR/EN templates both correct.
- **SC-004**: SmsLogs populated for every attempt.
- **SC-005**: Cost tracked per message.
