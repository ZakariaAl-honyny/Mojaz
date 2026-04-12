# Data Model: 011-rbac-user-settings

## Entities

### `User` (Extended for Feature 011)
- `Id` (Guid, PK)
- `FullName` (string)
- `Email` (string)
- `PhoneNumber` (string)
- `PasswordHash` (string)
- `AppRole` (Enum: Applicant, Receptionist, Doctor, Examiner, Manager, Security, Admin)
- `IsActive` (boolean) - *Used for toggle user active status*
- `RequiresPasswordReset` (boolean) - *Used for employee onboarding forced reset*
- `CreatedAt`, `UpdatedAt` (DateTime)

### `SystemSetting`
- `Id` (Guid, PK)
- `Key` (string, Unique Index) - Ex: `MIN_AGE_CATEGORY_A`
- `Value` (string)
- `DataType` (Enum: Integer, String, Boolean, Decimal)
- `Description` (string)
- `LastUpdatedBy` (Guid, FK to User)
- `UpdatedAt` (DateTime)

### `FeeStructure`
- `Id` (Guid, PK)
- `FeeType` (Enum: ApplicationFee, MedicalExamFee, TheoryTestFee, PracticalTestFee, IssuanceFee, RetakeFee)
- `CategoryId` (Nullable Guid, FK to LicenseCategory) - *Needed for category-specific fees*
- `Amount` (decimal)
- `EffectiveFrom` (DateTime)
- `EffectiveTo` (Nullable DateTime)
- `IsActive` (boolean)

### `AuditLog`
- `Id` (Guid, PK)
- `UserId` (Guid, FK to User)
- `ActionType` (string) - Ex: `UPDATE_SETTING`, `CREATE_USER`
- `EntityName` (string)
- `EntityId` (string)
- `Payload` (string) - *Stores serialized JSON of old/new values*
- `Timestamp` (DateTime)

## Relationships & Validations
- `SystemSetting.Key` must be strictly unique.
- `AuditLog` is immutable (append-only); no updates or soft deletes apply.
- `FeeStructure` active items logic: only one active fee per `FeeType` (and `CategoryId`) for the current date.
- Cache invalidation triggers automatically when `SystemSetting` or `FeeStructure` is modified.
