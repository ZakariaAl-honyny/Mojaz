# Feature Specification: Document Upload & Review

**Feature Branch**: `014-document-management`
**Created**: 2026-04-09
**Status**: Draft
**Input**: User description: "File upload for 8 document types with validation, and employee review interface. (Backend: multipart upload, PDF/JPG/PNG, max 5MB, MIME verification, list, soft delete, review approve/reject. 8 types: IdCopy, PersonalPhoto, MedicalReport, TrainingCertificate mandatory; AddressProof, GuardianConsent, PreviousLicense, AccessibilityDocuments conditional. Frontend Applicant: upload cards with drag & drop, preview, progress, status badge. Frontend Employee: review panel with lightbox, approve/reject buttons, bulk approve.)"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Applicant Uploads Mandatory Documents (Priority: P1)

An applicant whose application has been created navigates to the Documents section of their application. They see four mandatory upload cards: National ID Copy, Personal Photo, Medical Report, and Training Completion Certificate. They drag-and-drop a PDF on the ID card and see an upload progress bar. Once complete, a thumbnail (or file-type icon for PDFs) appears alongside a "Pending Review" status badge. They repeat for the remaining mandatory documents.

**Why this priority**: Document upload is Stage 02 of the core 10-stage licensing workflow. No other stage — initial payment, medical exam, tests — can proceed until documents are submitted. It is the highest-traffic applicant action after application creation.

**Independent Test**: Can be fully tested by an authenticated Applicant uploading a valid PDF to the ID Copy card; upload succeeds, the file is persisted, a "Pending Review" badge appears, and the document is listable via `GET /api/v1/applications/{id}/documents`.

**Acceptance Scenarios**:

1. **Given** an authenticated Applicant with an active application in "Pending Document Upload" status, **When** they drag & drop a valid PDF file (≤ 5MB) onto the "National ID Copy" upload card, **Then** an upload progress bar is displayed, the file is saved server-side, and the card shows a "Pending Review" badge with a file preview icon.
2. **Given** the same user, **When** they drag & drop a PNG image (≤ 5MB), **Then** a thumbnail preview of the image is displayed on the card after upload completes.
3. **Given** the same user, **When** they attempt to upload a file larger than 5MB or of type `.docx`, **Then** an inline error message tells them the file is invalid (size/type) and no upload is initiated.
4. **Given** a PDF that has a `.pdf` extension but a mismatched MIME header, **When** the applicant submits it, **Then** the server rejects it with a descriptive error and the card reverts to its empty state.

---

### User Story 2 — Applicant Sees & Manages Conditional Documents (Priority: P2)

Based on the applicant's profile (age, applicant type, declared support needs, service type), certain conditional document cards appear or remain hidden. A minor applicant (under 18) sees a "Guardian Consent" card. An applicant who declared a previous license sees a "Previous License" card. An applicant with declared accessibility needs sees an "Accessibility Documents" card. Residents see an "Address Proof" card. A previously approved document that has been rejected by an employee is displayed with a "Rejected" badge and the rejection reason; the applicant can re-upload to resolve it.

**Why this priority**: Conditional document logic prevents applicants from being confused by irrelevant upload requirements and ensures completeness for reviewers. Rejection & re-upload is essential to the back-and-forth review cycle.

**Independent Test**: Can be tested by creating two separate test applicants — one under 18 and one over 18 — and confirming that the Guardian Consent card appears only for the minor while remaining hidden for the adult.

**Acceptance Scenarios**:

1. **Given** an authenticated Applicant who is **under 18 years old**, **When** they view their document upload page, **Then** the "Guardian Consent" card is visible and marked as required.
2. **Given** an authenticated Applicant who is **18 or older**, **When** they view their document upload page, **Then** the "Guardian Consent" card is **not** displayed.
3. **Given** an applicant whose document was **rejected** by an employee with a reason, **When** they view the upload page, **Then** the card shows a "Rejected" badge, the rejection reason is displayed, and a re-upload button is available.
4. **Given** a rejected document card, **When** the applicant uploads a new valid file to replace it, **Then** the document status resets to "Pending Review" and the old rejection reason is cleared.

---

### User Story 3 — Employee Reviews and Approves/Rejects Documents (Priority: P2)

A Receptionist assigned to review an application navigates to the Documents tab on the employee portal. They see a list of uploaded documents with their status (Pending, Approved, Rejected). They click on a document to open a lightbox viewer (inline for images; embedded PDF viewer for PDFs). After review, they click "Approve" or "Reject". If rejecting, they must provide a reason. The status badge updates immediately. They can also click "Bulk Approve All" to approve all pending documents in one action.

**Why this priority**: Employees reviewing documents is the other half of Stage 02. Without this capability, the workflow cannot progress. Bulk approval dramatically reduces review time for straightforward cases.

**Independent Test**: Can be fully tested by an authenticated employee navigating to a test application's review panel, viewing a document in the lightbox, clicking Approve, and confirming the document's status changes to "Approved" in the list.

**Acceptance Scenarios**:

1. **Given** a Receptionist viewing an application, **When** they open the Documents tab, **Then** they see all uploaded documents grouped by type, each with a status badge (Pending, Approved, Rejected).
2. **Given** a document in "Pending" state, **When** the Receptionist clicks on it, **Then** a lightbox viewer opens showing the image or PDF inline.
3. **Given** the lightbox is open, **When** the Receptionist clicks "Approve", **Then** the document status changes to "Approved", the change is persisted, and an audit log entry is created.
4. **Given** the lightbox is open, **When** the Receptionist clicks "Reject" without entering a reason, **Then** the rejection is blocked and a validation message prompts them to enter a reason.
5. **Given** a reason is entered and "Reject" is confirmed, **When** the action is submitted, **Then** the document status changes to "Rejected", the reason is stored, and the applicant receives a notification (in-app, email, SMS, push) containing the rejection reason.
6. **Given** multiple documents in "Pending" state, **When** the Receptionist clicks "Bulk Approve All", **Then** all pending documents are approved in one operation, each updating to "Approved" status, and the applicant receives a single summary notification.

---

### User Story 4 — Applicant Deletes a Document Before Submission (Priority: P3)

An applicant who has uploaded a wrong file to an upload card wants to remove it and replace it. Before the application is formally submitted for review, they can delete an uploaded document from the card. The card returns to its empty "upload" state and they can upload a new file.

**Why this priority**: This is a UX quality-of-life feature important for error correction but does not block the core workflow.

**Independent Test**: Can be tested by an applicant uploading a file, then deleting it via the "Remove" button on the card, and confirming the document is soft-deleted and the card resets to empty.

**Acceptance Scenarios**:

1. **Given** an applicant who has uploaded a file to a card **before submission**, **When** they click the "Remove" button on the card, **Then** the document is soft-deleted server-side, the card reverts to empty, and the file is no longer listed via `GET /api/v1/applications/{id}/documents`.
2. **Given** an applicant whose application has been **submitted for review** (status ≥ Submitted), **When** they view the document cards, **Then** the "Remove" button is not displayed and deletion is not permitted.
3. **Given** an applicant attempts to delete another applicant's document via a direct API call, **When** the request is processed, **Then** the server rejects it with a 403 Forbidden response.

---

### Edge Cases

- What happens when the applicant uploads a file with a valid extension (`.jpg`) but the MIME header indicates a different type (e.g., `application/pdf`)? → Server rejects with "Invalid file format" error; file is not saved.
- What if the file system or storage layer fails to save the file after validation passes? → Server returns a 500 error, no database record is created, and the card shows an upload failure state.
- What happens when an employee tries to approve a document that has already been approved? → The operation is idempotent; the endpoint returns 200 with the current state but does not create a duplicate audit log.
- What if an applicant re-uploads a file to a card that was previously approved by an employee? → The new upload resets the status to "Pending Review" and the employee must re-review.
- What happens when an application has no uploaded documents at all and an employee opens the review panel? → The panel shows empty state cards for each expected document type, with guidance that no files have been uploaded yet.
- What if the applicant's age cannot be determined from their profile (missing date of birth)? → Conditional documents (Guardian Consent) default to **shown** to prevent missing required documents.
- What happens when a bulk approve is performed and one document approval fails mid-batch? → The operation fails atomically; no partial approvals are committed and the employee sees an error indicating the failure.

---

## Requirements *(mandatory)*

### Functional Requirements

#### Backend

- **FR-001**: The system MUST accept multipart file uploads at `POST /api/v1/applications/{id}/documents` for authenticated Applicants and Receptionists, enforcing ownership — applicants may only upload to their own applications.
- **FR-002**: The system MUST validate each uploaded file for: (a) allowed extension (PDF, JPG, PNG only), (b) file size ≤ `MAX_FILE_SIZE_MB` as read from SystemSettings, and (c) MIME header signature verification — the actual file header must match the declared type.
- **FR-003**: The system MUST store the uploaded file in the configured server-side storage location (local `uploads/` for MVP) with a unique name (GUID-based) so that the original filename is never used as the path.
- **FR-004**: The system MUST persist an `ApplicationDocument` record with fields: `Id`, `ApplicationId`, `DocumentType` (enum), `OriginalFileName`, `StoredFileName`, `ContentType`, `FileSizeBytes`, `Status` (Pending/Approved/Rejected), `ReviewedBy`, `ReviewedAt`, `RejectionReason`, `IsDeleted`, `CreatedAt`, `UpdatedAt`.
- **FR-005**: The system MUST support listing documents via `GET /api/v1/applications/{id}/documents`, returning all non-deleted documents for the application with their current status.
- **FR-006**: The system MUST allow soft-deletion of a document via `DELETE /api/v1/applications/{id}/documents/{docId}` available only to the owning applicant and only while the application status is `Draft` or `PendingDocumentUpload`.
- **FR-007**: The system MUST allow employee roles (Receptionist, Manager) to review documents via `PATCH /api/v1/applications/{id}/documents/{docId}/review` accepting an action (`Approve` or `Reject`) and, when rejecting, a mandatory non-empty `RejectionReason` string.
- **FR-008**: The system MUST support a bulk approve action via `PATCH /api/v1/applications/{id}/documents/bulk-approve` that atomically approves all documents in `Pending` status for the application. If any individual approval fails, the entire batch is rolled back.
- **FR-009**: The system MUST serve uploaded files securely via `GET /api/v1/files/{documentId}` — streaming the file only to users who are authorized (the owning applicant or an employee with document review permission). Direct disk paths must never be exposed.
- **FR-010**: The system MUST enforce document type uniqueness per application — only one non-deleted document of each `DocumentType` is allowed per application. Uploading a new document for an existing type replaces the old record (soft-deletes the previous one and creates a new `Pending` record).
- **FR-011**: When a document is rejected, the system MUST trigger notifications to the applicant across all applicable channels (in-app, push, email, SMS) including the rejection reason.
- **FR-012**: All document upload, review, approval, rejection, and deletion actions MUST be recorded in the `AuditLog` table.

#### Document Type Visibility Rules

- **FR-013 (Conditional)**: The system MUST expose which document types are required and which are conditional for a given application via `GET /api/v1/applications/{id}/documents/requirements`. The response MUST include: `documentType`, `isRequired`, `isConditional`, `conditionDescription`, and `hasUpload`.
- **FR-014 (Conditional Rules)**:
  - `IdCopy`, `PersonalPhoto`, `MedicalReport`, `TrainingCertificate` → **Always required** for all new license issuance applications.
  - `AddressProof` → Required when the applicant type is `Resident` or when authority policy requires it.
  - `GuardianConsent` → Required when the applicant's age is less than 18 years (threshold read from SystemSettings: `MIN_AGE_GUARDIAN_CONSENT`, default 18).
  - `PreviousLicense` → Required when the applicant has declared holding a previous or foreign license, or when the service type is `Renewal` or `CategoryUpgrade`.
  - `AccessibilityDocuments` → Required when the applicant declared accommodation/support needs in their application form.

#### Frontend — Applicant Portal

- **FR-015**: The applicant document upload page MUST display one upload card per document type (mandatory + applicable conditional documents), each showing: document type name (bilingual AR/EN), required/optional label, current status badge (Empty, Pending Review, Approved, Rejected), and upload target area.
- **FR-016**: Each upload card MUST support drag-and-drop file selection in addition to click-to-browse.
- **FR-017**: During upload, the card MUST display a progress bar reflecting real upload progress.
- **FR-018**: After a successful upload, the card MUST display: a thumbnail preview for images (JPG/PNG) or a file-type icon for PDFs, the original file name, and the file size.
- **FR-019**: A rejected document card MUST display the "Rejected" badge, the rejection reason text provided by the employee, and a re-upload button.
- **FR-020**: The "Remove" button on a card MUST only be visible and functional before the application is submitted for review.

#### Frontend — Employee Portal

- **FR-021**: The employee review panel MUST display all uploaded documents for an application in a list/grid, each showing: document type, file name, upload date, and status badge.
- **FR-022**: Clicking a document MUST open a lightbox viewer — displaying images inline and PDF documents in an embedded PDF viewer (or in a new browser tab as fallback).
- **FR-023**: The lightbox MUST contain "Approve" and "Reject" action buttons accessible without closing the viewer.
- **FR-024**: Clicking "Reject" MUST require entry of a non-empty rejection reason in a text field before the action can be confirmed.
- **FR-025**: A "Bulk Approve All Pending" button MUST be present at the top of the review panel and MUST be disabled when no documents are in "Pending" status.
- **FR-026**: All status changes made in the review panel MUST be reflected immediately in the UI without a full page reload.

### Key Entities

- **ApplicationDocument**: Represents a single uploaded file linked to an application. Tracks document type, stored file path, upload status lifecycle (Pending → Approved/Rejected), reviewer identity, and rejection reason. Subject to soft delete.
- **DocumentType (Enum)**: `IdCopy | PersonalPhoto | MedicalReport | TrainingCertificate | AddressProof | GuardianConsent | PreviousLicense | AccessibilityDocuments`. Determines document category and conditional display logic.
- **DocumentStatus (Enum)**: `Pending | Approved | Rejected`. Tracks the review lifecycle of each document.
- **DocumentRequirement**: A computed view (not persisted) returned by the requirements endpoint — describes which document types apply to a specific application, whether they are required or conditional, and whether a file has been uploaded.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An applicant can complete uploading all four mandatory documents (drag-and-drop, progress, preview) in under 3 minutes on a standard connection.
- **SC-002**: File type and size validation errors are displayed to the applicant within 1 second of selecting an invalid file — before the file reaches the server.
- **SC-003**: An employee can complete reviewing (view + approve or reject) a single document in under 30 seconds using the lightbox interface.
- **SC-004**: Bulk approve of all pending documents for an application completes in under 5 seconds regardless of document count (within the 8-document limit per application).
- **SC-005**: A rejection notification (in-app) reaches the applicant's notification center within 30 seconds of the employee clicking "Reject".
- **SC-006**: Conditional documents are correctly shown or hidden based on applicant profile for 100% of cases — zero false positives (non-applicable documents shown as required) or false negatives (applicable documents hidden).
- **SC-007**: File serving is access-controlled — 100% of attempts to access another applicant's documents via direct API calls are rejected with a 403 response.
- **SC-008**: MIME type verification catches 100% of files where the header signature does not match the declared extension (prevents MIME spoofing attacks).
- **SC-009**: 90% of applicants can upload their first document successfully without needing help, as measured by task completion rate.

---

## Assumptions

- The authentication and authorization system (Feature 011 — RBAC) is already implemented and provides role resolution for Applicant, Receptionist, Doctor, Examiner, and Manager roles.
- The Application entity (Feature 012) is already in place and provides `ApplicationStatus`, `ApplicantId`, `ServiceType`, and applicant profile data (date of birth, applicant type, declared support needs) needed for conditional document rules.
- File storage in the MVP uses the local server filesystem (`uploads/` directory). No cloud storage (Azure Blob, S3) is required for MVP but the abstraction is behind an `IFileStorageService` interface to allow future migration.
- The Notification Service (Feature 010) is implemented and its `INotificationService.SendAsync()` interface is available for triggering rejection notifications.
- The bulk approve operation processes up to 8 documents (the total number of document types); no pagination is required for the bulk action.
- The maximum file size limit is read from SystemSettings key `MAX_FILE_SIZE_MB` (default: 5 MB) and is not hardcoded.
- MIME type verification is performed by reading the first bytes (magic bytes) of the uploaded stream server-side — client-provided `Content-Type` headers are not trusted.
- PDF preview in the lightbox uses the browser's native PDF viewer via an `<iframe>` or `<embed>`; no third-party PDF rendering library is required for MVP.
- Thumbnail generation for image previews happens on the client side using `FileReader` API — no server-side thumbnail generation is required.
- The `GuardianConsent` conditional threshold (age < 18) defaults to 18 but is stored in SystemSettings as `MIN_AGE_GUARDIAN_CONSENT` for future configurability.
- Document replacement (re-upload to an already-uploaded card) soft-deletes the previous record and creates a new Pending record atomically within a single transaction.
- The Accessibility Documents card appears only when `SupportNeeds` field on the application is explicitly set to `true`. If the field is null or missing, the card is hidden.
