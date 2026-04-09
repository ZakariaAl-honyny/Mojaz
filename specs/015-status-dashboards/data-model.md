# Phase 1: Data Model & Entities

## Extracted DTOs for Dashboards & Timeline

These DTOs reflect the read-optimized shapes needed by the UI, conforming to Clean Architecture boundaries (from the `Application` layer).

### 1. ApplicationSummaryDto
Used in active application cards (Applicant) and Employee Queue rows.
- `Id`: int
- `ApplicationNumber`: string
- `ApplicantName`: string
- `LicenseCategoryCode`: string (enum: A, B, C, D, E, F)
- `ServiceType`: string
- `CurrentStage`: string
- `Status`: ApplicationStatus enum (string mapped)
- `SubmittedDate`: DateTime
- `UpdatedAt`: DateTime

### 2. DashboardSummaryDto (Applicant)
Used to populate the Applicant Dashboard.
- `ActiveApplicationsCount`: int
- `PendingActionsCount`: int
- `Applications`: ApplicationSummaryDto[] (list of up to 5)
- `UpcomingAppointments`: AppointmentSummaryDto[] (future appointments within 14 days)
- `RecentNotifications`: NotificationDto[] (latest 5)
- `Stats`: Object `{ TotalSubmitted: int, TestsPassed: int }`

### 3. EmployeeDashboardSummaryDto
Polymorphic response based on the employee's role.
- `Role`: string
- `EmployeeName`: string
- `ItemsNeedingActionCount`: int
- `SummaryData`: Object (Role-specific data chunk, e.g., missing documents count for Receptionists or pending tests for Examiners)

### 4. ManagerKpiDto
For the Manager Dashboard overview.
- `TotalApplicationsToday`: int
- `ReceptionistQueueSize`: int
- `DoctorQueueSize`: int
- `ExaminerQueueSize`: int
- `ApplicationsByStatusChart`: Array of `{ Status: string, Count: int }`
- `TheoryTestPassRate`: float
- `PracticalTestPassRate`: float
- `StalledApplications`: ApplicationSummaryDto[] (where `UpdatedAt` > threshold defined by `SystemSettings.STALL_ALERT_DAYS`)

### 5. ApplicationTimelineDto & TimelineStageDto
For rendering the vertical timeline tracker.
- `ApplicationTimelineDto`
  - `ApplicationId`: int
  - `CurrentStageNumber`: int
  - `Stages`: TimelineStageDto[] (Exactly 10 stages representing the lifecycle)
- `TimelineStageDto`
  - `StageNumber`: int
  - `NameAr`: string
  - `NameEn`: string
  - `State`: enum (`completed` | `current` | `failed` | `future`)
  - `CompletedAt`: DateTime? nullable
  - `ActorName`: string? nullable
  - `ActorRole`: string? nullable
  - `OutcomeNote`: string? nullable (e.g., "Medically Fit", "Failed theory test")

## Enums

### ApplicationStatus
- `Draft`
- `Submitted`
- `InReview`
- `PendingPayment`
- `DocumentsIncomplete`
- `Approved`
- `Rejected`
- `Cancelled`
- `Expired`
