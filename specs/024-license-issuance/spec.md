# Feature Specification: 024-license-issuance

**Feature Branch**: `024-license-issuance`  
**Created**: 2026-04-10  
**Status**: Draft  
**Input**: User description: "read c:\Users\ALlahabi\Desktop\cmder\Mojaz\CustomCommands\features\024-license-issuance\1-specify.md and c:\Users\ALlahabi\Desktop\cmder\Mojaz\specs\024-license-issuance\spec.md and docs/PRD.md"

## Summary
License generation and issuance system (Workflow Stage 10). Following final approval and fee payment, this feature generates a unique license number, calculates expiry based on category, generates a high-quality bilingual PDF using QuestPDF, and provides a download endpoint for the applicant.

## Clarifications

### Session 2026-04-10
- Q: PDF Storage & Generation Strategy → A: Generate once during POST issuance step, store in Blob Storage, Download endpoint serves the file.
- Q: Multiple Issuance Triggers (Idempotency) → A: Return an error (e.g., 400 Bad Request or 409 Conflict) stating the license is already issued.
- Q: Missing Applicant Photo Handling → A: Fail PDF generation returning an error, halting the issuance process entirely.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - License Generation & Expiry (Priority: P1)
As an approved applicant with issuance fees paid, I want my license to be officially generated with the correct expiry date, so that I can legally drive.

**Why this priority**: Without official generation, the workflow cannot be completed and the license is technically not issued.

**Independent Test**: Can be tested by invoking the issuance endpoint and validating the resulting license database record for number format and expiry calculation.

**Acceptance Scenarios**:
1. **Given** an application in 'Pending Issuance' state with issuance fee paid, **When** the issuance process runs, **Then** a license is created with a unique number (MOJ-YYYY-XXXXXXXX) and status 'Issued'.
2. **Given** a Category B application, **When** measuring expiry, **Then** the expiry date is exactly 10 years from the issue date.
3. **Given** a Category C application, **When** measuring expiry, **Then** the expiry date is exactly 5 years from the issue date.

---

### User Story 2 - License PDF Document Download (Priority: P1)
As a licensed driver, I want to download a digital, printable copy of my newly issued license, so that I have a physical reference of my license and QR verification.

**Why this priority**: A physical or printable proof of license is a core output of the system.

**Independent Test**: By calling the download endpoint, retrieving the PDF bytes, and visually inspecting that all fields (Arabic/English), photo, and QR code exist.

**Acceptance Scenarios**:
1. **Given** an issued license, **When** requesting the download endpoint, **Then** a PDF is returned styled with government branding.
2. **Given** the generated PDF, **When** checking content, **Then** it must include the applicant's photo, bilingual fields, and a valid QR code for verification.

---

### User Story 3 - Notification of Issuance (Priority: P2)
As an applicant, I want to be notified SMS/Email when my license is issued and ready to download, so that I am immediately aware the process is complete.

**Why this priority**: Important for user experience, but secondary to the actual generation of the legal document.

**Independent Test**: Can be tested by verifying notification queue/logs after the issuance action is completed.

**Acceptance Scenarios**:
1. **Given** a successful generation of the license, **When** the process completes, **Then** an explicit "License Ready" notification is sent to the user's registered contact methods.

### Edge Cases

- What happens if the license number generation encounters a very rare collision? (Should retry).
- **Resolved**: If the system encounters a missing photo during PDF generation, it will fail the process with an error, halting issuance entirely.
- **Resolved**: If the issuance endpoint is triggered multiple times for the same application, the system will return a 409 Conflict error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support POST `/api/v1/licenses/{appId}/issue` to finalize issuance after approval and payment. If the application is already issued, it MUST return a 409 Conflict error.
- **FR-002**: System MUST generate a unique License Number using format: `MOJ-{YEAR}-{8 random digits}`.
- **FR-003**: System MUST calculate Expiry Date based on Category (A, B, F = 10 years; C, D, E = 5 years, pulled from `LicenseCategories` config if possible).
- **FR-004**: System MUST generate a bilingual (Arabic/English) PDF using QuestPDF with government-grade design, dynamic data (Name, DOB, NationalID, Category, IssueDate, ExpiryDate, LicenseNumber, ApplicantPhoto), and a secure QR Code for verification. The generated PDF must be persisted to Blob Storage during generation to guarantee immutability.
- **FR-005**: System MUST provide GET `/api/v1/licenses/{id}/download` to securely deliver the generated PDF directly from Blob Storage.
- **FR-006**: System MUST send an email/SMS/Push notification to the applicant immediately after successful issuance.
- **FR-007**: System MUST store license metadata in the `Licenses` table, tied to the Application and User, and update application status to completed.

### Key Entities 

- **License**: Contains Id, LicenseNumber, IssueDate, ExpiryDate, CategoryId, UserId, ApplicationId, BlobUrl (reference to generated PDF), IsActive flag.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of newly issued licenses have unique numbers in the specified MOJ format.
- **SC-002**: Expiry calculation accurately matches rules for all 6 categories.
- **SC-003**: PDF generation completes in under 2 seconds per request.
- **SC-004**: Application status shifts to `Completed` and notifications are triggered successfully within seconds of issuance.
- **SC-005**: Download endpoint correctly serves the valid PDF file.

## Assumptions

- Applicant photo is already uploaded, approved, and securely accessible during PDF generation.
- QuestPDF layout engine supports Arabic text rendering (may require Harfbuzz integration for proper RTL shaping).
- QR code logic contains a secure verification URL or signed data string.
- This is Stage 10, meaning all preconditions (medical, training, tests, approval, final payment) are strictly validated by gating mechanisms before calling generation logic.
