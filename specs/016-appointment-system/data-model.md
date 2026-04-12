# Data Model: 016-appointment-system

## Entities

### `Appointment`
The core entity representing a scheduled visit by an applicant.
- **Id**: `Guid` (Primary Key)
- **ApplicationId**: `Guid` (Foreign Key -> Applications)
- **ApplicantId**: `Guid` (Foreign Key -> Users)
- **Type**: `AppointmentType` enum (WrittenTest, PracticalTest, MedicalTest, etc.)
- **ScheduledAt**: `DateTime` (UTC)
- **DurationMinutes**: `int` (From System Settings)
- **LocationBranchId**: `Guid` (Foreign Key -> Branches)
- **Status**: `AppointmentStatus` (Scheduled, Confirmed, Completed, Cancelled, NoShow)
- **AssignedEmployeeId**: `Guid?` (Nullable Foreign Key -> Users/Employees)
- **Notes**: `string?` (Optional details)
- **CancelledReason**: `string?` (Populated if cancelled)
- **ReminderSent**: `bool` (Flags if the 24h reminder was successfully dispatched)
- **RowVersion**: `byte[]` (Concurrency token to prevent double-booking)
- **IsDeleted**: `bool` (Soft delete flag)
- **CreatedAt**, **UpdatedAt**: `DateTime`

### `AppointmentSlotCapacity` (Virtual/Helper Entity or Materialized View)
Tracks capacity limits for specific slots dynamically based on `SystemSettings` to avoid full table locks when asserting capacity.
- **LocationBranchId**: `Guid`
- **SlotStart**: `DateTime`
- **MaxCapacity**: `int`
- **CurrentBooked**: `int` (Calculated field)

## State Transitions
1. **Scheduled**: Initial state upon successful generation and Gate 2 validation.
2. **Confirmed**: Manually triggered by receptionist or automatically triggered 24h prior.
3. **Completed**: Marked by Examiner/Employee upon completion of the test/service.
4. **Cancelled**: Applicant or Employee cancels. Requires `CancelledReason`. Frees up capacity.
5. **NoShow**: Automatically or manually set if applicant misses the time slot.

## Validation Rules
- **Rescheduling**: Cannot reschedule more than the setting `MAX_RESCHEDULE_COUNT`.
- **Concurrency**: Booking must assert `CurrentBooked < MaxCapacity` within a transaction scope validating the `RowVersion`.
- **Dates**: `ScheduledAt` must be in the future.
