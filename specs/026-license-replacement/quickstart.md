# Quickstart: License Replacement (Feature 026)

## Overview
This guide covers how to set up and test the License Replacement feature locally.

## Setup Requirements
1. **Database Migration**:
   - Update `LicenseReplacement` entity in `Mojaz.Domain`.
   - Run `dotnet ef migrations add AddReplacementReasonDetails` in `Mojaz.Infrastructure`.
   - Update database: `dotnet ef database update`.

2. **Fee Configuration**:
   - Seed or manually add a `FeeStructure` record:
     - `ServiceType`: `Replacement`
     - `Amount`: `100.00`
     - `IsActive`: `true`

## Testing Workflow

### Scenario A: Lost License (Automatic Flow)
1. Login as **Applicant**.
2. Navigate to `/dashboard` and click **Replace License** (Ensure you have an active license).
3. Select **Reason: Lost**.
4. Sign the digital declaration.
5. Pay the fee via the simulation.
6. Verify Application state: `Approved` -> `ReadyToIssue`.

### Scenario B: Stolen License (Review Flow)
1. Login as **Applicant**.
2. Select **Reason: Stolen**.
3. Upload a sample PDF for the **Police Report**.
4. Pay the fee.
5. Verify Application state: `UnderReview`.
6. Login as **Receptionist**.
7. Navigate to **Review Queue** and find the application.
8. Approve the report.
9. Verify Application state: `Approved` -> `ReadyToIssue`.

### Scenario C: Damaged License (Verification)
1. Verify that the **Submit** button is disabled until a Photo is uploaded.
