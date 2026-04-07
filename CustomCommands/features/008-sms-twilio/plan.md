# Implementation Plan: 008-sms-twilio

**Feature Branch**: `008-sms-twilio`
**Status**: Draft

## Architecture Overview

Implementation of the SMS service using the Twilio REST API. This service resides in the Application and Infrastructure layers.

### Tech Stack
- **Backend**: .NET 8, Twilio C# SDK.
- **Persistence**: `SmsLogs` table.

## Functional Breakdown

### 1. `ISmsService` (Application Layer)
- **Methods**:
    - `SendAsync(toPhone, message)`: Sends a plain text SMS.
    - `SendTemplatedAsync(templateName, data, toPhone, language)`: Renders a message from a predefined small template and sends it.

### 2. `TwilioSmsService` (Infrastructure Layer)
- Interacts with Twilio's Messaging API.
- Reads configuration from `TwilioSettings` in `appsettings.json`.
- Implements 2-attempt retry logic.
- Logs every request, response status, and estimated cost in `SmsLogs`.

### 3. SMS Templates
- **Max length**: 160 characters (Standard SMS).
- **Location**: `src/Mojaz.Infrastructure/Templates/Sms/`.
- **Templates**:
    1. Registration OTP (6 digits)
    2. Recovery OTP (6 digits)
    3. Appointment Confirmed (Time & Date)
    4. Appointment Reminder
    5. Test Result (Pass/Fail)
    6. License Ready (MOJ-#)

## Phases of Implementation

### Phase 1: Application Layer
1. Add `ISmsService` interface.
2. Define `SmsTemplateNames` constants.

### Phase 2: Infrastructure Layer
1. Create `TwilioSmsService` and register it in DI.
2. Setup `TwilioSettings` in `appsettings.json`.
3. Implement `SmsLogs` logger within the service.

### Phase 3: Templates & Verification
1. Create and test each of the 6 short SMS templates (Bilingual).
2. Measure character length for both Arabic and English versions to ensure they are <= 160. Note: Arabic characters (UCS-2) reduce standard SMS capacity to 70 characters. We must keep this in mind.

### Phase 4: Verification
1. Integration test with a real Twilio test account.
2. Verify `SmsLogs` persistence and cost tracking.

## Risks & Mitigations
- **SMS Costs**: Use 2-attempt retry only (instead of 3).
- **Character Encoding**: Arabic uses UCS-2 encoding which limits a single SMS segment to 70 characters. Ensure templates are extremely concise.
- **Privacy**: Mask the phone number in logs except for the last 4 digits.
