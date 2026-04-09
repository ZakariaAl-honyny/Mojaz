# Research: 014-Document Management

**Branch**: `014-document-management` | **Date**: 2026-04-09

---

## Decision 1: File Storage Strategy (MVP)

**Decision**: Local filesystem storage at `uploads/` inside the backend server, abstracted behind `IFileStorageService`.

**Rationale**:
- The PRD explicitly defers cloud storage (Azure Blob, S3) to Phase 2. MVP must ship quickly.
- An interface (`IFileStorageService`) decouples the `DocumentService` from storage mechanics — swapping to Azure Blob later requires only a new implementation, not a service rewrite.
- The stored path in `ApplicationDocument.FilePath` holds a relative path (e.g., `uploads/2025/48291037-abc.pdf`) — never an absolute OS path.
- Files must be served exclusively via `GET /api/v1/applications/{id}/documents/{docId}/download` — direct disk paths are never exposed.

**Alternatives considered**:
- **Azure Blob Storage now**: Adds unnecessary infra dependency for MVP. Rejected.
- **Database BLOB storage**: Bloats the DB, makes backups painful. Rejected.

---

## Decision 2: MIME Type Verification — Magic Bytes Approach

**Decision**: Read the first 16 bytes (magic bytes) of the uploaded stream at the `DocumentService` level before persisting. Compare against an allowlist:

| Extension | Magic Bytes (hex) |
|-----------|-------------------|
| PDF       | `25 50 44 46` (`%PDF`) |
| JPEG      | `FF D8 FF` |
| PNG       | `89 50 4E 47 0D 0A 1A 0A` |

**Rationale**:
- The Constitution (Principle II) mandates MIME-header inspection, not trust of client-declared `Content-Type`.
- Magic bytes are the most reliable indicator — a `.pdf` file with a PNG header is caught.
- This is done inside the Application layer's `DocumentService` to keep the validation logic within business rules, not as middleware.

**Alternatives considered**:
- **Using only file extension**: Trivially bypassed. Rejected.
- **Third-party file scanning libraries**: Out of scope for MVP. Rejected.

---

## Decision 3: DocumentType Enum — Canonical Set Aligned to Spec

**Decision**: Expand the existing `DocumentType` enum from 5 values to the 8 specified in the PRD:

```csharp
public enum DocumentType
{
    IdCopy,                  // Previously: NationalId
    PersonalPhoto,           // Previously: Photo
    MedicalReport,           // Previously: MedicalCertificate
    TrainingCertificate,     // Unchanged
    AddressProof,            // New — conditional
    GuardianConsent,         // New — conditional (age < 18)
    PreviousLicense,         // New — conditional (declared previous license / renewal / upgrade)
    AccessibilityDocuments   // New — conditional (declared support needs)
}
```

**Rationale**:
- The current enum (`NationalId`, `Photo`, `MedicalCertificate`, `DrivingRecord`, `TrainingCertificate`) doesn't match spec names, has one extra value (`DrivingRecord`) not in PRD, and is missing 3 conditional types.
- A DB migration is needed to update any existing `DocumentType` column values.
- `DrivingRecord` has no PRD equivalent and is removed.

**Alternatives considered**:
- **Keep old names as aliases**: Creates confusion and inconsistency. Rejected.

---

## Decision 4: DocumentStatus Enum — Normalized Lifecycle

**Decision**: Use three canonical statuses matching the spec workflow:

```csharp
public enum DocumentStatus
{
    Pending,    // Uploaded, awaiting employee review
    Approved,
    Rejected
}
```

**Rationale**:
- The current `AdditionalEnums.cs` has `Pending, Uploaded, Approved, Rejected` — two "unreviewed" states cause ambiguity.
- The spec defines the lifecycle as: file arrives → always `Pending` → employee sets to `Approved` or `Rejected`.
- `Uploaded` is merged into `Pending`. No data loss: any currently-`Uploaded` record should be treated as `Pending`.

---

## Decision 5: Document Requirements Endpoint — Computed, Not Persisted

**Decision**: Implement `GET /api/v1/applications/{id}/documents/requirements` as a fully computed response built from the application's profile data (applicant type, date of birth, declared support needs, service type). No `DocumentRequirement` table is created.

**Rationale**:
- Conditional display rules are deterministic — given the same input, they always produce the same output. No need to persist them.
- Caching at the Redis/HTTP level (future concern) is simpler on a computed endpoint.
- Avoids DB table proliferation.

**Response shape**:
```json
[
  {
    "documentType": "IdCopy",
    "isRequired": true,
    "isConditional": false,
    "conditionDescription": null,
    "hasUpload": true,
    "status": "Pending"
  },
  {
    "documentType": "GuardianConsent",
    "isRequired": true,
    "isConditional": true,
    "conditionDescription": "Required because applicant is under 18",
    "hasUpload": false,
    "status": null
  }
]
```

---

## Decision 6: Bulk Approve — Atomic Transaction

**Decision**: Implement bulk approve via `PATCH /api/v1/applications/{id}/documents/bulk-approve` using a Unit of Work transaction. All pending document records are fetched, updated to `Approved`, and saved in a single `SaveChangesAsync` call. If any step fails, the entire transaction rolls back.

**Rationale**:
- The spec mandates atomic behaviour (FR-008): partial approvals are worse than a clean failure.
- EF Core's `DbContext.SaveChangesAsync()` is inherently transactional for all pending changes within a single Unit of Work scope.
- A single notification (summary) is sent after successful bulk approve — not one per document.

---

## Decision 7: File Upload Progress — Multipart with Axios onUploadProgress

**Decision**: The frontend uses Axios's `onUploadProgress` callback to track real upload progress. Each upload card manages its own `progress` state (0–100). The `IFormFile` multipart submission to the backend is standard.

**Rationale**:
- `react-dropzone` handles file selection (drag & drop + click-to-browse). Axios handles the actual upload and reports progress.
- No third-party upload library (e.g., tus, resumable.js) is required for MVP — files are ≤ 5MB and single-shot uploads are reliable.

---

## Decision 8: Thumbnail Preview — Client-Side FileReader

**Decision**: After a successful upload, the frontend displays a thumbnail for images using the `FileReader.readAsDataURL()` API on the locally-selected `File` object (before or after upload completes). PDFs show a generic PDF icon.

**Rationale**:
- No server-side thumbnail generation avoids infra complexity (ImageSharp, etc.) in MVP.
- File size is bounded at ≤ 5MB — in-memory `FileReader` is safe.
- After a page refresh, image preview falls back to the file type icon since the `dataURL` is not persisted; the actual file is accessible via the download endpoint.

---

## Decision 9: Lightbox Viewer — Conditional Rendering

**Decision**: The employee review panel uses a modal/drawer lightbox:
- **Images** (JPEG, PNG): rendered via `<img src={downloadUrl} />`.
- **PDFs**: rendered via `<iframe src={downloadUrl} />` using the browser's native PDF plugin. If the browser lacks a PDF plugin, a "Download to view" fallback link is shown.
- Download URL = presigned via `GET /api/v1/applications/{id}/documents/{docId}/download` (Bearer-token protected).

**Rationale**:
- No third-party PDF viewer library (pdf.js, react-pdf) required for MVP.
- Native `<iframe>` works in Chrome, Firefox, Edge (last 2 versions) — all in scope per PRD Section 15.2.

---

## Decision 10: Notification on Rejection — Async via Hangfire

**Decision**: When `ReviewAsync` sets a document to `Rejected`, the service immediately creates an in-app `Notification` record (synchronous, same request), then enqueues a Hangfire background job to send Push, Email, and SMS.

**Rationale**:
- Constitution Principle VII: In-App synchronous, external channels asynchronous via Hangfire.
- The existing `INotificationService` already implements this pattern (Feature 010).
- The rejection reason MUST be included in all notification channel messages.

---

## Existing Code Gaps Identified

| Gap | Action Needed |
|-----|--------------|
| `DocumentType` enum missing 3 conditional types, has wrong names | Update enum + EF migration |
| `DocumentStatus` has redundant `Uploaded` variant | Normalize to `Pending` + migration |
| `IDocumentService` lacks: `BulkApproveAsync`, `GetRequirementsAsync` | Extend interface |
| `DocumentsController` lacks: Bulk approve, Requirements endpoints | Add 2 endpoints |
| `DocumentDtos.cs` lacks: `DocumentRequirementDto`, `BulkApproveResponse` | Add DTOs |
| No `IFileStorageService` interface exists | Create interface in Application layer |
| No `FileStorageService` (local disk implementation) exists | Create in Infrastructure |
| No `ApplicationDocument` EF configuration exists | Create in Infrastructure/Data/Configurations |
| Frontend: no `document.service.ts` | Create |
| Frontend: no `DocumentUploadGrid`, `UploadCard` components | Create |
| Frontend: no `DocumentReviewPanel` component | Create |
| Frontend: no `documents/` page under applicant portal | Create |
| Frontend: no translation keys for document management | Create ar/en JSON files |
