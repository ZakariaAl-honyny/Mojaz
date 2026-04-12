# Data Model: SMS Delivery

## Entities

### `SmsLog`
Represents an outbound SMS transmission attempt.

**Fields**:
- `Id` (uniqueidentifier, Primary Key)
- `ApplicationId` (uniqueidentifier, nullable, Foreign Key) - Associated application if any
- `UserId` (uniqueidentifier, Foreign Key) - The user receiving the SMS
- `RecipientNumber` (string) - Masked phone number (e.g. `+96650XXXX123`)
- `TemplateType` (string) - The identifier for the template used (e.g., `reg-otp`)
- `Status` (enum/string) - `Pending`, `Sent`, `Failed`
- `TwilioMessageId` (string, nullable) - Provider ID for checking delivery status
- `Cost` (decimal/string, nullable) - The cost/segments returned by Twilio
- `ErrorMessage` (string, nullable) - Failure context if `Status` is `Failed`
- `CreatedAt` (DateTime UTC) - Send timestamp

**Relationships**:
- Belongs to one `User`
- Belongs optionally to one `Application`

**Validation Rules**:
- `RecipientNumber` MUST be appropriately masked. It MUST NOT contain the full number except maybe in a secure, encrypted column if strictly necessary for support, otherwise only mask should be logged. Since the actual delivery requires the plain number, it is passed to Twilio directly but logged structurally masked to comply with Security First principles.
- Plain text OTPs MUST NEVER be saved to this log.
