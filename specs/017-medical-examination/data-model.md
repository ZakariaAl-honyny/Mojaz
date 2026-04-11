# Data Model: Medical Examination

## Entities

### `MedicalResult` (Domain Layer - SQL Server Table)
Tracks the results of the medical fitness examination.

**Attributes:**
- `Id` (GUID) - Primary Key
- `ApplicationId` (GUID) - FK to `Applications`
- `AppointmentId` (GUID) - FK to `Appointments`
- `Result` (enum `FitnessResult`) - The enumerated outcome (Pending=0, Fit=1, Unfit=2, ConditionalFit=3, RequiresReexam=4)
- `BloodType` (string) - Validated against ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
- `VisionTestResult` (string) - Medical text
- `ColorBlindTestResult` (string) - Medical text
- `BloodPressureNormal` (bool) - True if within acceptable medical parameters
- `Notes` (string) - Free-form diagnostic notes
- `DoctorName` (string) - Recorded from examining employee's user context
- `ClinicName` (string) - Recorded from examining location context
- `ExaminedAt` (DateTime UTC) - Actual examination timestamp
- `ValidUntil` (DateTime UTC) - Calculated: `ExaminedAt` + `SystemSettings["MEDICAL_VALIDITY_DAYS"]`
- `IsDeleted` (bool) - Soft Delete flag
- `CreatedAt`, `UpdatedAt` (DateTime UTC) - Standard audit fields

**Validations (FluentValidation):**
- ApplicationId must not be empty.
- DoctorName and ClinicName are required.
- Result cannot be cast to an invalid integer.

**State Transitions Triggered:**
- If `Result == Fit` -> Trigger Domain Event `MedicalExamPassedEvent` -> Updates Application Status via Event Handler.
- If `Result == Unfit` -> Trigger Domain Event `MedicalExamFailedEvent` -> Sets Application Status to Rejected.
