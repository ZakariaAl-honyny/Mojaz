# Feature Specification: 017-medical-examination

**Feature Branch**: `017-medical-examination`  
**Created**: 2026-04-06  
**Updated**: 2026-04-09  
**Status**: Draft  
**Input**: User description: "read 1-specify.md and spec.md and PRD.md and use skills frontend-design and vercel-react-best-practices"

## Summary

Medical examination recording system where a Doctor records fitness results (Fit/Unfit/ConditionalFit/RequiresReexam) with validity tracking, automatic timeline advancement, and result notifications. The system features a distinctively designed Doctor interface utilizing a premium government aesthetic, prioritizing optimistic UI updates and zero-waterfall data fetching for instantaneous responsiveness.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Doctor Records Medical Result (Priority: P1)

As a Doctor, I want to record the medical examination result for an applicant through an instantly responsive interface so that the workflow can advance to the next stage without delays.

**Why this priority**: Core workflow blockage if medical exams cannot be recorded.

**Independent Test**: Can be fully tested by creating a mock application in the PendingMedicalTest stage, authenticating as a Doctor, and submitting the result to observe immediate UI feedback and backend status transition.

**Acceptance Scenarios:**
1. **Given** an applicant with a `PendingMedicalTest` appointment, **When** Doctor records Fit result, **Then** application status advances to next stage and applicant notified immediately (optimistic update on the frontend).
2. **Given** Doctor records Unfit, **When** saved, **Then** application status set to `Rejected` with reason, applicant notified.
3. **Given** Doctor records ConditionalFit, **When** saved, **Then** application flagged for re-examination with new appointment required.

### User Story 2 — Medical Validity Tracking (Priority: P2)

As an employee, I want the system to enforce medical certificate validity gracefully so that expired certificates are not accepted during the final approval stage.

**Why this priority**: Regulatory requirement to prevent issuing licenses on expired exams.

**Independent Test**: Can be tested by forcing an expired medical result on an application and verifying Gate 4 rejection.

**Acceptance Scenarios:**
1. **Given** a medical result older than `MEDICAL_VALIDITY_DAYS` (from SystemSettings), **When** referenced in final approval Gate 4, **Then** gate fails with "medical certificate expired", providing clear contextual UI feedback.

### Edge Cases

- What if the Doctor submits medical result for an application not in `PendingMedicalTest` status? → 400 validation error handled elegantly in UI without breaking the component.
- What if `MEDICAL_VALIDITY_DAYS` setting is missing? → Use default of 90 days (logged as warning).
- What if network is slow during submission? → UI utilizes `useTransition` and optimistic UI states to keep the application feeling instantly responsive, preventing double submissions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: POST /api/v1/medical-exams — Doctor submits result for a given ApplicationId.
- **FR-002**: GET /api/v1/medical-exams/{applicationId} — retrieve current medical result for an application.
- **FR-003**: PATCH /api/v1/medical-exams/{id}/result — allow Doctor to update result before application moves forward.
- **FR-004**: Fitness result enum: Pending (0), Fit (1), Unfit (2), ConditionalFit (3), RequiresReexam (4).
- **FR-005**: Store: BloodType, VisionTestResult, ColorBlindTestResult, BloodPressureNormal, Notes, DoctorName, ClinicName, ExaminedAt.
- **FR-006**: Validity period = ExaminedAt + MEDICAL_VALIDITY_DAYS (from SystemSettings); stored as `ValidUntil`.
- **FR-007**: On Fit result: advance application status; fire notification (in-app + push + email + SMS).
- **FR-008**: On Unfit: set application to Rejected; record reason; fire notification.
- **FR-009**: On ConditionalFit/RequiresReexam: remain in medical stage, schedule re-examination.
- **FR-010**: Gate 4 reads `ValidUntil` and rejects if expired.
- **FR-011**: AuditLog entry on every medical exam creation or update.
- **FR-012**: Only Doctor role can POST/PATCH; Applicant and Manager can GET.

### Frontend Aesthetics & Performance Requirements

- **FR-013**: The Doctor's user interface MUST exhibit a distinctive, premium professional aesthetic (Royal Green #006C35), utilizing sharp typography (IBM Plex Sans Arabic/Inter), and contextual effects like subtle shadowing and glassmorphism, avoiding generic form layouts.
- **FR-014**: The frontend MUST eliminate rendering waterfalls by executing parallel data fetching and leveraging server components (`React.cache`, `next/dynamic`) where heavy rendering is necessary.
- **FR-015**: The interface MUST use optimistic updates and `useTransition` for the result submission process to ensure the UI feels completely instantaneous without flicker.
- **FR-016**: Visual status distinction MUST be extreme but professional (e.g., intense green for Fit, sharp red for Unfit) with CSS-only micro-animations confirming selection to the doctor.

### Key Entities

- **MedicalResult**: ApplicationId, AppointmentId, Result (enum), BloodType, VisionTestResult, ColorBlindTestResult, BloodPressureNormal, Notes, DoctorName, ClinicName, ExaminedAt, ValidUntil, CreatedAt, UpdatedAt.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Doctors can complete the medical result entry form in under 30 seconds due to intuitive layout and distinct typography.
- **SC-002**: The frontend components for the medical dashboard achieve an initial load time of under 1 second (Largest Contentful Paint) using optimal bundle-splitting and parallel data fetching.
- **SC-003**: 100% of expired medical certificates are successfully rejected at Gate 4.
- **SC-004**: Notifications are triggered within 5 seconds of the medical result being saved.
- **SC-005**: The UI delivers immediate perceived responsiveness upon save via React transitions.

## Assumptions

- Medical examination is conducted in person; this feature only records the outcome.
- `MEDICAL_VALIDITY_DAYS` defaults to 90 if not present in SystemSettings.
- Doctor is assigned to appointment beforehand (via AssignedEmployeeId on Appointment).
- The client-side will actively leverage SWR or TanStack Query for data deduplication per Vercel React Best Practices.
