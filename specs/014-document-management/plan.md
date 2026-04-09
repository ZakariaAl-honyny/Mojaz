# Implementation Plan: Document Upload & Review

**Branch**: `014-document-management` | **Date**: 2026-04-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-document-management/spec.md`

---

## Summary

Implement the complete document lifecycle for Stage 02 of the Mojaz licensing workflow: applicants upload 8 document types (4 mandatory, 4 conditional) with drag-and-drop, MIME verification, and real-time progress feedback; employees review via a lightbox panel with approve/reject/bulk-approve actions; rejections trigger multi-channel async notifications. The implementation updates existing `DocumentType`/`DocumentStatus` enums (with DB migrations), introduces a `IFileStorageService` abstraction for local-disk MVP storage, adds 2 new API endpoints, and delivers full applicant + employee frontend UI with bilingual RTL/LTR support.

---

## Technical Context

**Language/Version**: C# / .NET 8 (backend) · TypeScript 5 / Next.js 15 App Router (frontend)
**Primary Dependencies**: EF Core 8, FluentValidation, AutoMapper, Hangfire, INotificationService (Feature 010), ISystemSettingsService (Feature 011)
**Storage**: Local filesystem `uploads/` (MVP) abstracted via `IFileStorageService`; SQL Server 2022 for `ApplicationDocuments` table metadata
**Testing**: xUnit + Moq + FluentAssertions (backend) · Jest + React Testing Library (frontend)
**Target Platform**: Web (Chrome, Firefox, Edge, Safari last 2 versions) · Fully responsive · RTL/LTR
**Performance Goals**: Upload of 5MB file < 5s on standard connection · Requirements endpoint < 500ms · Bulk approve (8 docs) < 5s
**Constraints**: Files never served from raw disk path · MIME-header verification mandatory · Max 5MB from SystemSettings · Soft delete only
**Scale/Scope**: Per application: max 8 documents · MVP concurrent users: 100–500

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Compliance | Notes |
|-----------|:----------:|-------|
| **I. Clean Architecture** | ✅ | `IFileStorageService` defined in Application layer, implemented in Infrastructure. `DocumentService` in Application. Controllers thin. |
| **II. Security First** | ✅ | MIME magic-byte validation. Extension whitelist. Ownership check in service layer. Files served via controller (no raw paths). Audit log on all review actions. |
| **III. Configuration over Hardcoding** | ✅ | `MAX_FILE_SIZE_MB` read from SystemSettings. Age thresholds (`MIN_AGE_GUARDIAN_CONSENT`) from SystemSettings. No literals. |
| **IV. i18n by Default** | ✅ | All frontend text via `useTranslations('document')`. Logical CSS classes. RTL-aware layout. |
| **V. API Contract Consistency** | ✅ | All endpoints return `ApiResponse<T>`. RESTful URL conventions. `[ProducesResponseType]` on all actions. |
| **VI. Test Discipline** | ✅ | `DocumentService` tests cover: upload validation, MIME check, ownership, review, bulk approve, soft delete. Min 80% coverage target. |
| **VII. Async-First Notifications** | ✅ | In-App sync. Push/Email/SMS via Hangfire background job. Primary request never blocked by notification failure. |

**GATE RESULT**: ✅ All 7 principles satisfied. No violations.

---

## Project Structure

### Documentation (this feature)

```text
specs/014-document-management/
├── plan.md              ← This file
├── spec.md              ← Feature specification
├── research.md          ← Phase 0: decisions and gaps
├── data-model.md        ← Phase 1: entities, DTOs, interfaces
├── quickstart.md        ← Phase 1: developer onboarding guide
├── contracts/
│   └── api-contracts.md ← Phase 1: full API contract
├── checklists/
│   └── requirements.md  ← Spec quality checklist
└── tasks.md             ← Phase 2 output (/speckit.tasks)
```

### Backend Source Changes

```text
src/backend/

Mojaz.Domain/
  Enums/
    DocumentType.cs              ← UPDATE (rename + add 3 types)
    AdditionalEnums.cs           ← UPDATE (normalize DocumentStatus)
  Entities/
    ApplicationDocument.cs       ← UPDATE (add OriginalFileName, StoredFileName, FileSizeBytes)

Mojaz.Application/
  Interfaces/
    Infrastructure/
      IFileStorageService.cs     ← NEW
    Services/
      IDocumentService.cs        ← UPDATE (add 2 methods)
  DTOs/
    Document/
      DocumentDtos.cs            ← UPDATE (add 2 new DTOs)
  Services/
    DocumentService.cs           ← NEW (full implementation, replaces skeleton if exists)
  Validators/
    UploadDocumentValidator.cs   ← NEW
    DocumentReviewValidator.cs   ← NEW
  Mappings/
    DocumentMappingProfile.cs    ← NEW (AutoMapper: ApplicationDocument → DocumentDto)

Mojaz.Infrastructure/
  Data/
    Configurations/
      ApplicationDocumentConfiguration.cs  ← NEW
  Services/
    LocalFileStorageService.cs   ← NEW
  Migrations/
    <ts>_UpdateDocumentTypes.cs           ← NEW
    <ts>_NormalizeDocumentStatus.cs       ← NEW

Mojaz.API/
  Controllers/
    DocumentsController.cs       ← UPDATE (add 2 endpoints: Requirements + BulkApprove)
```

### Frontend Source Changes

```text
src/frontend/src/

types/
  document.types.ts              ← NEW

services/
  document.service.ts            ← NEW

hooks/
  useDocuments.ts                ← NEW (React Query: upload, list, review, delete)

components/
  domain/
    document/
      DocumentUploadGrid.tsx     ← NEW (applicant portal upload layout)
      UploadCard.tsx             ← NEW (per-type card: drag & drop, progress, preview, badge)
      DocumentReviewPanel.tsx    ← NEW (employee portal review layout)
      DocumentLightbox.tsx       ← NEW (image/PDF lightbox viewer with approve/reject)
      DocumentStatusBadge.tsx    ← NEW (status pill: Pending/Approved/Rejected)

app/[locale]/
  (applicant)/
    applications/[id]/
      documents/
        page.tsx                 ← NEW (applicant document upload page)
  (employee)/
    applications/[id]/
      documents/
        page.tsx                 ← NEW (employee review page)

public/locales/
  ar/
    document.json                ← NEW
  en/
    document.json                ← NEW
```

**Structure Decision**: Web application (backend + frontend) — standard Mojaz project layout. No new projects added. All new code placed within existing layer projects.

---

## Complexity Tracking

No constitution violations. No extra projects or patterns introduced beyond what is established. `IFileStorageService` follows the same interface-in-Application, implementation-in-Infrastructure pattern already used by `IEmailService`, `ISmsService`, etc.

---

## Implementation Phases

### Phase 1: Domain & Schema (Backend Foundation)

**Goal**: Update enums and entity, generate migrations, validate schema compiles.

**Tasks**:
1. Update `DocumentType` enum — rename existing values + add 3 conditional types (start explicit int values at 1)
2. Normalize `DocumentStatus` enum — remove `Uploaded`, keep `Pending/Approved/Rejected`
3. Update `ApplicationDocument` entity — add `OriginalFileName`, `StoredFileName`, `FileSizeBytes`; rename `FileName → OriginalFileName`, `FileSize → FileSizeBytes`
4. Create `ApplicationDocumentConfiguration.cs` — soft-delete global filter, unique filtered index on `(ApplicationId, DocumentType)` where `IsDeleted = 0`
5. Add EF Core migration `UpdateDocumentTypes` — data migration script for enum value remapping
6. Add EF Core migration `NormalizeDocumentStatus` — update old `Uploaded (1)` → `Pending (0)` rows
7. Verify `dotnet build` passes across all projects

**Acceptance**: All migrations apply cleanly (`dotnet ef database update`). No compile errors.

---

### Phase 2: Storage Abstraction & File Service (Backend)

**Goal**: Implement file storage and the document service core logic.

**Tasks**:
1. Create `IFileStorageService` in `Mojaz.Application/Interfaces/Infrastructure/`
2. Create `LocalFileStorageService` in `Mojaz.Infrastructure/Services/` — saves files to `uploads/{year}/{guid}.{ext}`, reads stream by path
3. Register `LocalFileStorageService` in `InfrastructureServiceRegistration.cs`
4. Create `DocumentMappingProfile` — maps `ApplicationDocument → DocumentDto` (sets `DownloadUrl` and `DocumentTypeName`)
5. Create `UploadDocumentValidator` — validates extension, size ≤ MAX_FILE_SIZE_MB, MIME magic bytes
6. Create `DocumentReviewValidator` — validates RejectionReason required when Approved=false
7. Create `DocumentService` in `Mojaz.Application/Services/`:
   - `UploadAsync`: ownership check → validate → MIME check → save file → persist record
   - `GetByApplicationIdAsync`: role-scoped query
   - `GetRequirementsAsync`: compute conditional rules from application profile
   - `ReviewAsync`: validate → update status → audit log → trigger notification job
   - `BulkApproveAsync`: fetch pending → approve all → single `SaveChangesAsync` → send summary notification
   - `DeleteAsync`: ownership + status check → soft delete
   - `DownloadAsync`: ownership check → stream file from storage
   - `NotifyMissingDocumentsAsync`: existing method (keep + update)

**Acceptance**: Unit tests for `DocumentService` pass. `UploadAsync` correctly rejects files > 5MB, wrong extension, and MIME mismatch.

---

### Phase 3: API Controller Update (Backend)

**Goal**: Expose all 7 endpoints correctly, matching the API contracts.

**Tasks**:
1. Update `DocumentsController` — change route from `/upload` POST to POST `/` (or keep `/upload` — follow existing convention)
2. Add `GET /requirements` endpoint → `GetRequirementsAsync`
3. Add `PATCH /bulk-approve` endpoint → `BulkApproveAsync`
4. Update `PATCH /{documentId}/review` — add `Manager` to authorized roles
5. Verify all endpoints have `[ProducesResponseType]` for success and error shapes
6. Test all endpoints via Swagger UI or HTTP file

**Acceptance**: Swagger documentation shows all 7 endpoints. Auth returns 401 without token. Ownership violations return 403.

---

### Phase 4: Frontend — Types, Services, Hooks

**Goal**: Establish the TypeScript foundation before building UI components.

**Tasks**:
1. Create `document.types.ts` — `DocumentDto`, `DocumentRequirementDto`, `BulkApproveResponse`, `UploadDocumentRequest`, `DocumentReviewRequest`, `DocumentType` enum, `DocumentStatus` enum
2. Create `document.service.ts` — functions: `uploadDocument`, `listDocuments`, `getRequirements`, `reviewDocument`, `bulkApprove`, `deleteDocument`, `getDownloadUrl`
3. Create `useDocuments.ts` — React Query hooks: `useGetDocuments`, `useGetRequirements`, `useUploadDocument` (with Axios `onUploadProgress`), `useReviewDocument`, `useBulkApprove`, `useDeleteDocument`

**Acceptance**: TypeScript compiles. `useGetDocuments` returns typed `DocumentDto[]`.

---

### Phase 5: Frontend — Shared Components

**Goal**: Build reusable, RTL-ready document UI components.

**Tasks**:
1. Create `DocumentStatusBadge.tsx` — pill badge mapping DocumentStatus to color (Pending=amber, Approved=green, Rejected=red). Supports AR/EN label via `useTranslations('document.status')`.
2. Create `UploadCard.tsx`:
   - Props: `requirement: DocumentRequirementDto`, `onUpload: (file: File) → void`, `onDelete: () → void`, `progress?: number`
   - Uses `react-dropzone` for drag & drop
   - Displays thumbnail (FileReader) for images, generic PDF icon for PDFs
   - Shows upload progress bar (0–100)
   - Shows status badge + rejection reason if rejected
   - Shows "Remove" button only when status allows deletion
3. Create `DocumentLightbox.tsx`:
   - Props: `document: DocumentDto`, `onApprove: () → void`, `onReject: (reason: string) → void`, `onClose: () → void`
   - Renders `<img>` for JPEG/PNG, `<iframe>` for PDF
   - Rejection requires non-empty reason input before confirm
4. Create `DocumentUploadGrid.tsx` — grid of `UploadCard` components, filtered by visible requirements
5. Create `DocumentReviewPanel.tsx` — list of documents with status, lightbox trigger, bulk approve button

**Acceptance**: Components render in both AR/RTL and EN/LTR. Storybook or manual visual review passes.

---

### Phase 6: Frontend — Pages

**Goal**: Integrate components into applicant and employee portal pages.

**Tasks**:
1. Create `(applicant)/applications/[id]/documents/page.tsx`:
   - Fetches requirements via `useGetRequirements`
   - Renders `DocumentUploadGrid`
   - Handles upload mutation with progress tracking
   - Shows success/error toasts after each upload
2. Create `(employee)/applications/[id]/documents/page.tsx`:
   - Fetches document list via `useGetDocuments`
   - Renders `DocumentReviewPanel` with lightbox trigger
   - Bulk approve button with confirmation dialog
3. Create translation files:
   - `public/locales/ar/document.json`
   - `public/locales/en/document.json`
4. Add navigation links for documents tab in applicant application detail page and employee application detail page

**Acceptance**: Pages render without console errors. AR locale shows RTL layout.

---

### Phase 7: Notification Integration

**Goal**: Ensure rejection and bulk-approve events fire correct notifications.

**Tasks**:
1. Verify `INotificationService.SendAsync` is called from `DocumentService.ReviewAsync` when rejecting — message includes applicant name, document type name, rejection reason, and upload page link (both AR + EN)
2. Verify bulk approve fires a single summary notification (not one per document) — message includes approved document count
3. Add Hangfire job registration if a dedicated DocumentNotificationJob class is needed
4. Smoke test: reject a document → verify notification appears in applicant's in-app notification center within 30 seconds

**Acceptance**: Rejection notification appears in-app. Email/SMS/Push dispatched to Hangfire queue.

---

### Phase 8: Testing

**Goal**: Achieve ≥ 80% coverage on DocumentService methods.

**Backend Tests** (`Mojaz.Application.Tests/Services/DocumentServiceTests.cs`):

| Test | Scenario |
|------|----------|
| `UploadAsync_ValidFile_ReturnsPending` | Happy path |
| `UploadAsync_FileTooLarge_ReturnsBadRequest` | Size > MAX_FILE_SIZE_MB |
| `UploadAsync_InvalidExtension_ReturnsBadRequest` | .docx file |
| `UploadAsync_MimeMismatch_ReturnsBadRequest` | .pdf with PNG magic bytes |
| `UploadAsync_WrongOwner_ReturnsForbidden` | Different applicant's app |
| `ReviewAsync_Approve_UpdatesStatus` | Happy path |
| `ReviewAsync_Reject_NoReason_ReturnsBadRequest` | Missing rejection reason |
| `ReviewAsync_Reject_WithReason_TriggersNotification` | Notification enqueued |
| `BulkApproveAsync_MultiplePending_ApprovesAll` | Atomic batch |
| `DeleteAsync_BeforeSubmission_SoftDeletes` | Happy path |
| `DeleteAsync_AfterSubmission_ReturnsForbidden` | Status gate |
| `GetRequirementsAsync_MinorApplicant_ShowsGuardianConsent` | Conditional rule |
| `GetRequirementsAsync_AdultApplicant_HidesGuardianConsent` | Conditional rule |

**Frontend Tests**:
- `UploadCard`: "should show progress bar when uploading", "should show thumbnail for image uploads", "should show rejection reason when status is Rejected"
- `DocumentReviewPanel`: "should disable bulk approve when no pending documents", "should require rejection reason before confirming reject"

---

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| MIME spoofing (rename .exe to .pdf) | Magic-byte check in DocumentService (pre-write validation) |
| Large file blocking the thread | Use `IFormFile.OpenReadStream()` with streaming — never `ReadAllBytes` |
| Storage path traversal attack | StoredFileName is a GUID — no user input in file path |
| Serving files to unauthorized users | Ownership check in `DownloadAsync` service method |
| Duplicate document type conflict | Unique filtered index on `(ApplicationId, DocumentType)` WHERE IsDeleted = 0 |
| Partial bulk approve leaving inconsistent state | EF Core Unit of Work — single `SaveChangesAsync` for entire batch |
| File left on disk after DB failure | Log orphaned files; a cleanup job (Phase 2 future work) reconciles disk vs. DB |
| Enum int value collision in migration | Explicit int values assigned in enum definition (start at 1, not 0) |
