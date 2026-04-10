# Data Model

## Entities

### `PaymentTransaction`
- `Id` (Guid, PK)
- `ApplicationId` (Guid, FK to Applications)
- `FeeType` (Enum: ApplicationFee, MedicalExamFee, TheoryTestFee, PracticalTestFee, RetakeFee, IssuanceFee)
- `Amount` (Decimal)
- `Status` (Enum: Pending, Paid, Failed)
- `TransactionReference` (String, e.g., "MOJ-PAY-2025-XXXXXXXX")
- `CreatedAt` (DateTime UTC)
- `UpdatedAt` (DateTime UTC, nullable)

### `FeeStructure`
Ensure this already exists or create it:
- `Id` (Guid, PK)
- `FeeType` (Enum)
- `LicenseCategoryId` (Guid, FK, nullable - for fees that differ by category)
- `Amount` (Decimal)
- `EffectiveFrom` (DateTime UTC)
- `EffectiveTo` (DateTime UTC, nullable)

## State Transitions (PaymentTransaction)
1. `Pending` -> `Paid` (When simulated processing succeeds)
2. `Pending` -> `Failed` (When simulated processing fails)
