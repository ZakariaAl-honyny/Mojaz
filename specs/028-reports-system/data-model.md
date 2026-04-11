# Data Model: Reports & Analytics System

## Aggregate DTOs

### ReportSummaryDto
Main wrapper for the reports dashboard overview.
- `TotalApplications`: int
- `StatusCounts`: `List<StatusDistributionDto>`
- `ServiceDistribution`: `List<ServiceStatsDto>`
- `LateApplicationsCount`: int

### StatusDistributionDto
- `Status`: string (Enum name)
- `Count`: int
- `Percentage`: double
- `Color`: string (mapped from UI constants)

### ServiceStatsDto
- `ServiceType`: string
- `Count`: int
- `GrowthRate`: double (Optional: comparison to previous period)

### TestPerformanceDto
- `TestType`: string ("Theory" | "Practical")
- `TotalTaken`: int
- `PassedCount`: int
- `FailedCount`: int
- `PassRate`: double (Percentage)

### DelayedApplicationEntry
- `ApplicationId`: Guid
- `ApplicationNumber`: string
- `CurrentStatus`: string
- `DaysInStage`: int
- `ApplicantName`: string
- `BranchName`: string

### BranchThroughputDto
- `BranchId`: Guid
- `BranchName`: string
- `DailyCounts`: `List<DailyLoadDto>`
- `TotalIssued`: int

### EmployeeActivityDto
- `EmployeeId`: Guid
- `FullName`: string
- `Role`: string ("Doctor" | "Examiner")
- `TotalAssessments`: int

## Filter Entities

### ReportingFilter
Standard parameters used across all GET endpoints.
- `StartDate`: DateTime? (UTC)
- `EndDate`: DateTime? (UTC)
- `BranchId`: Guid?
- `LicenseCategoryId`: Guid?
- `Role`: string?
