# Tasks: 008-sms-twilio

**Input**: Design documents from `specs/008-sms-twilio/`
**Prerequisites**: plan.md ✅ | spec.md ✅
**Branch**: `008-sms-twilio`
**Created**: 2026-04-06

## Phase 1: Application Layer (Priority: P1)

- [ ] **T801**: Create `ISmsService` in `src/backend/src/Mojaz.Application/Interfaces/Infrastructure/`.
- [ ] **T802**: Define `SmsTemplateNames` constants for the 6 required types.
- [ ] **T803**: Setup `TwilioSettings` POCO class.

## Phase 2: Infrastructure Layer (Priority: P1)

- [ ] **T804**: Install `Twilio` NuGet package in `Mojaz.Infrastructure`.
- [ ] **T805**: Implement `TwilioSmsService` (SendAsync, SendTemplatedAsync).
- [ ] **T806**: Map `SmsLog` table persistence inside the service.
- [ ] **T807**: Configure `TwilioSettings` in `appsettings.json` and `Program.cs`.

## Phase 3: Templates (Priority: P2)

- [ ] **T808**: Create `registration-otp.sms` (Bilingual AR/EN).
- [ ] **T809**: Create `recovery-otp.sms` (Bilingual AR/EN).
- [ ] **T810**: Create `appointment-confirmed.sms`, `appointment-reminder.sms`.
- [ ] **T811**: Create `test-result.sms` and `license-ready.sms`.
- [ ] **T812**: Verify all templates are <= 70 chars for Arabic (UCS-2) and <= 160 for English.

## Phase 4: Verification (Priority: P2)

- [ ] **T813**: Write integration tests for `SendTemplatedAsync` with mock Twilio API response.
- [ ] **T814**: Verify `SmsLogs` are correctly populated with status and cost.
- [ ] **T815**: E2E test: Trigger registration with phone and verify Twilio call.

## Success Criteria Checklist

- [ ] SMS sent successfully via Twilio API.
- [ ] All 6 bilingual templates render correctly and are within length limits.
- [ ] Arabic SMS characters (UCS-2) handled correctly.
- [ ] Failed sends logged in `SmsLogs` with status.
- [ ] Cost tracked per message.
- [ ] Build completes without errors.
