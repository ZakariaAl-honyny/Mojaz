# Tasks: Document Upload & Review (014-document-management)

**Input**: Design documents from `/specs/014-document-management/`
**Prerequisites**: plan.md ✅ · spec.md ✅ · data-model.md ✅ · contracts/ ✅ · research.md ✅ · quickstart.md ✅

**Organization**: Tasks grouped by user story — each story is independently implementable and testable.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Parallelizable — different files, no blocking dependency on incomplete tasks
- **[Story]**: User story label (US1–US4), only on story-phase tasks
- All paths relative to `src/backend/` or `src/frontend/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Domain-layer changes and EF schema foundation that all stories depend on. No user story work can begin until this phase is complete.

**⚠️ CRITICAL**: Complete T001–T011 before starting any user story.

- [x] T001 Update `DocumentType` enum — rename existing values and add 3 conditional types with explicit int values in `Mojaz.Domain/Enums/DocumentType.cs`
- [x] T002 Normalize `DocumentStatus` enum — remove `Uploaded` variant, keep `Pending(0)/Approved(1)/Rejected(2)` in `Mojaz.Domain/Enums/AdditionalEnums.cs`
- [x] T003 Update `ApplicationDocument` entity — add `OriginalFileName`, `StoredFileName`, `FileSizeBytes` fields; rename `FileName→OriginalFileName`, `FileSize→FileSizeBytes` in `Mojaz.Domain/Entities/ApplicationDocument.cs`
- [x] T004 Create `IFileStorageService` interface with `SaveAsync`, `ReadAsync`, `DeleteAsync` methods in `Mojaz.Application/Interfaces/Infrastructure/IFileStorageService.cs`
- [x] T005 [P] Update `IDocumentService` interface — add `GetRequirementsAsync(Guid applicationId, Guid userId)` and `BulkApproveAsync(Guid applicationId, Guid reviewerId)` method signatures in `Mojaz.Application/Interfaces/Services/IDocumentService.cs`
- [x] T006 [P] Add `DocumentRequirementDto` and `BulkApproveResponse` DTOs to `Mojaz.Application/DTOs/Document/DocumentDtos.cs`; update `DocumentDto` to include `OriginalFileName`, `DownloadUrl`, `ReviewedBy`, `ReviewedAt`
- [x] T007 Create `ApplicationDocumentConfiguration.cs` EF Core config — soft-delete global filter, unique filtered index on `(ApplicationId, DocumentType)` WHERE `IsDeleted = 0`, max lengths, default value for Status in `Mojaz.Infrastructure/Data/Configurations/ApplicationDocumentConfiguration.cs`
- [x] T008 Add EF Core migration `UpdateDocumentTypes` — data migration remapping old enum int values to new ones, soft-deleting any `DrivingRecord` rows in `Mojaz.Infrastructure/Migrations/`
- [x] T009 Add EF Core migration `NormalizeDocumentStatus` — UPDATE rows with old `Uploaded(3)` → `Pending(0)` in `Mojaz.Infrastructure/Migrations/`; add `IX_ApplicationDocuments_ApplicationId_Type` unique filtered index
- [x] T010 Create `LocalFileStorageService` implementing `IFileStorageService` — saves files to `uploads/{year}/{guid}.{ext}`, reads stream by relative path, logs on delete in `Mojaz.Infrastructure/Services/LocalFileStorageService.cs`
- [x] T011 Register `IFileStorageService → LocalFileStorageService` in `Mojaz.Infrastructure/InfrastructureServiceRegistration.cs`; apply EF Core migrations and verify `dotnet build` passes all projects

**Checkpoint**: Schema updated, storage abstracted, project compiles. User story implementation can now begin.

---

## Phase 2: Foundational (Backend Service Core)

**Purpose**: `DocumentService` implementation — the shared backend engine serving all 4 user stories.

**⚠️ CRITICAL**: All user story phases depend on this service being complete.

- [x] T012 Create `DocumentMappingProfile` — maps `ApplicationDocument → DocumentDto` including `DocumentTypeName` string and `DownloadUrl` template in `Mojaz.Application/Mappings/DocumentMappingProfile.cs`
- [x] T013 [P] Create `UploadDocumentValidator` — validates enum value, file non-null, size ≤ `MAX_FILE_SIZE_MB` × 1048576, extension whitelist (.pdf/.jpg/.jpeg/.png) in `Mojaz.Application/Validators/UploadDocumentValidator.cs`
- [x] T014 [P] Create `DocumentReviewValidator` — validates `RejectionReason` is non-empty and ≤ 1000 chars when `Approved = false` in `Mojaz.Application/Validators/DocumentReviewValidator.cs`
- [x] T015 Create `DocumentService` skeleton with constructor DI: `IUnitOfWork`, `IFileStorageService`, `ISystemSettingsService`, `INotificationService`, `IAuditService`, `IMapper` in `Mojaz.Application/Services/DocumentService.cs`
- [x] T016 Implement `UploadAsync` in `DocumentService` — ownership check → validate (size, extension, MIME magic bytes) → save file via `IFileStorageService` → soft-delete any existing rejected doc of same type → persist new `ApplicationDocument` with `Status = Pending` → audit log in `Mojaz.Application/Services/DocumentService.cs`
- [x] T017 Implement `GetByApplicationIdAsync` in `DocumentService` — role-scoped query: Applicant sees own app only, employees see any; return `IEnumerable<DocumentDto>` in `Mojaz.Application/Services/DocumentService.cs`
- [x] T018 Implement `DeleteAsync` in `DocumentService` — ownership check → verify application status is `Draft` or `PendingDocumentUpload` (403 otherwise) → soft delete → audit log in `Mojaz.Application/Services/DocumentService.cs`
- [x] T019 Implement `DownloadAsync` in `DocumentService` — ownership/role check → read stream via `IFileStorageService` → return `(Stream, contentType, fileName)` in `Mojaz.Application/Services/DocumentService.cs`
- [x] T020 Register `IDocumentService → DocumentService` in `Mojaz.Application/ApplicationServiceRegistration.cs`

**Checkpoint**: Core CRUD operations (upload, list, delete, download) functional. US1 can now be fully built.

---

## Phase 3: User Story 1 — Applicant Uploads Mandatory Documents (Priority: P1) 🎯 MVP

**Goal**: An authenticated applicant can drag & drop files onto 4 mandatory upload cards, see real-time progress, thumbnail previews, and Pending status badges.

**Independent Test**: POST `multipart/form-data documentType=1 file=@id-copy.pdf` to `/api/v1/applications/{id}/documents/upload` as Applicant → expect 201 with `status: 0 (Pending)`. Navigate to `/{locale}/applications/{id}/documents` → four mandatory cards visible, drag & drop a PDF → progress bar appears → card shows PDF icon + "Pending Review" badge.

### Backend — US1

- [x] T021 [US1] Update `DocumentsController` — fix route for Upload endpoint from `POST /upload` to `POST /` (or align with contract), ensure `[Authorize(Roles = "Applicant,Receptionist")]` and `[ProducesResponseType]` in `Mojaz.API/Controllers/DocumentsController.cs`
- [x] T022 [US1] Add `GET /` list endpoint and `GET /{documentId}/download` endpoint with correct auth and `[ProducesResponseType]` in `Mojaz.API/Controllers/DocumentsController.cs`
- [x] T023 [US1] Verify `appsettings.json` has `FileStorage:BasePath` key and `uploads/` directory creation on startup in `Mojaz.API/Program.cs`

### Frontend — US1

- [x] T024 [P] [US1] Create TypeScript types: `DocumentDto`, `DocumentStatus` enum, `DocumentType` enum, `UploadDocumentRequest` in `src/frontend/src/types/document.types.ts`
- [x] T025 [P] [US1] Create `document.service.ts` — `uploadDocument(appId, type, file, onProgress)` using Axios with `onUploadProgress`, `listDocuments(appId)`, `deleteDocument(appId, docId)`, `getDownloadUrl(appId, docId)` in `src/frontend/src/services/document.service.ts`
- [x] T026 [US1] Create `useDocuments.ts` — React Query hooks: `useGetDocuments(appId)`, `useUploadDocument()` mutation with progress state, `useDeleteDocument()` mutation in `src/frontend/src/hooks/useDocuments.ts`
- [x] T027 [US1] Create `DocumentStatusBadge.tsx` — pill badge with color mapping: Pending=amber, Approved=green, Rejected=red; uses `useTranslations('document.status')` in `src/frontend/src/components/domain/document/DocumentStatusBadge.tsx`
- [x] T028 [US1] Create `UploadCard.tsx` — accepts `requirement`, `onUpload`, `onDelete`, `progress` props; integrates `react-dropzone` for drag & drop; renders thumbnail (FileReader) for images or PDF icon; shows progress bar during upload; shows `DocumentStatusBadge` in `src/frontend/src/components/domain/document/UploadCard.tsx`
- [x] T029 [US1] Create `DocumentUploadGrid.tsx` — renders grid of `UploadCard` components filtered to visible requirements; handles upload mutation calls per card in `src/frontend/src/components/domain/document/DocumentUploadGrid.tsx`
- [x] T030 [US1] Create applicant documents page — fetches `useGetRequirements` (4 mandatory types hardcoded as fallback if endpoint not yet implemented), renders `DocumentUploadGrid`, shows page heading with bilingual title in `src/frontend/src/app/[locale]/(applicant)/applications/[id]/documents/page.tsx`
- [x] T031 [P] [US1] Create Arabic translation file for document namespace in `src/frontend/public/locales/ar/document.json` — all keys: upload.*, types.*, status.*, errors.*
- [x] T032 [P] [US1] Create English translation file for document namespace in `src/frontend/public/locales/en/document.json` — matching structure to ar/document.json

**Checkpoint**: Applicant can upload a PDF to an IdCopy card, see progress bar, see "Pending Review" badge, and list the upload via GET. Story 1 independently functional.

---

## Phase 4: User Story 2 — Conditional Documents & Rejection Re-upload (Priority: P2)

**Goal**: Conditional document cards show/hide based on applicant profile; rejected documents display the reason and allow re-upload.

**Independent Test**: Create a test applicant aged < 18 → load requirements → `GuardianConsent` card is visible and required. Create a test applicant aged ≥ 18 → `GuardianConsent` card is absent. Reject a document as employee → applicant sees "Rejected" badge with reason and a re-upload button.

### Backend — US2

- [x] T033 [US2] Implement `GetRequirementsAsync` in `DocumentService` — load application + applicant profile, compute conditional rules (age from DOB, applicant type, SupportNeeds, ServiceType), return `IEnumerable<DocumentRequirementDto>` for all 8 types in `Mojaz.Application/Services/DocumentService.cs`
- [x] T034 [US2] Add `GET /requirements` endpoint to `DocumentsController` — `[Authorize]`, `[ProducesResponseType(typeof(ApiResponse<IEnumerable<DocumentRequirementDto>>), 200)]` in `Mojaz.API/Controllers/DocumentsController.cs`
- [x] T035 [US2] Extend `UploadAsync` in `DocumentService` — when uploading to a type that already has a `Rejected` doc, soft-delete the rejected record and create new `Pending` in a single transaction (re-upload flow) in `Mojaz.Application/Services/DocumentService.cs`

### Frontend — US2

- [x] T036 [US2] Add `DocumentRequirementDto` type and `getRequirements(appId)` service function to `src/frontend/src/types/document.types.ts` and `src/frontend/src/services/document.service.ts`
- [x] T037 [US2] Add `useGetRequirements(appId)` hook to `src/frontend/src/hooks/useDocuments.ts`
- [x] T038 [US2] Update `DocumentUploadGrid.tsx` — replace hardcoded types with `useGetRequirements` data; filter to only render cards where `isRequired = true` or (`isConditional = true` AND condition is met) in `src/frontend/src/components/domain/document/DocumentUploadGrid.tsx`
- [x] T039 [US2] Update `UploadCard.tsx` — when `requirement.status === 'Rejected'`, display rejection reason text below the card, change badge to Rejected (red), and show a "Re-upload" button that triggers the file picker in `src/frontend/src/components/domain/document/UploadCard.tsx`
- [x] T040 [US2] Update applicant documents page to use `useGetRequirements` correctly and refetch after each upload/delete mutation in `src/frontend/src/app/[locale]/(applicant)/applications/[id]/documents/page.tsx`
- [x] T041 [P] [US2] Add conditional document translation keys (`document.conditional.*`, `document.upload.reupload`, `document.upload.rejectionReason`) to both `src/frontend/public/locales/ar/document.json` and `src/frontend/public/locales/en/document.json`

**Checkpoint**: Conditional cards show/hide correctly per applicant profile. Re-upload after rejection resets to Pending. Story 2 independently functional alongside Story 1.

---

## Phase 5: User Story 3 — Employee Review (Approve / Reject / Bulk Approve) (Priority: P2)

**Goal**: An authenticated employee can view all uploaded documents, open a lightbox viewer, approve or reject individual documents (with mandatory rejection reason), and bulk approve all pending documents in one action.

**Independent Test**: As Receptionist, PATCH `{documentId}/review` with `{"approved": true}` → 200, document status becomes Approved. PATCH with `{"approved": false}` and no reason → 400 validation error. PATCH `bulk-approve` → all pending docs approved, `approvedCount` returned. Navigate to `/{locale}/applications/{id}/documents` as employee → lightbox opens on click, approve button updates status badge without page reload.

### Backend — US3

- [x] T042 [US3] Implement `ReviewAsync` in `DocumentService` — run `DocumentReviewValidator` → update status → set `ReviewedBy`, `ReviewedAt` → audit log → if rejected: create in-app notification synchronously + enqueue Hangfire job for Push/Email/SMS with rejection reason in `Mojaz.Application/Services/DocumentService.cs`
- [x] T043 [US3] Implement `BulkApproveAsync` in `DocumentService` — fetch all `Pending` docs for application → approve all in single `UnitOfWork.SaveChangesAsync` call → audit log → enqueue single summary notification job in `Mojaz.Application/Services/DocumentService.cs`
- [x] T044 [US3] Add `PATCH /{documentId}/review` endpoint — update `[Authorize(Roles = "Receptionist,Manager,Admin")]`, `[ProducesResponseType]` in `Mojaz.API/Controllers/DocumentsController.cs`
- [x] T045 [US3] Add `PATCH /bulk-approve` endpoint with `[Authorize(Roles = "Receptionist,Manager,Admin")]` and `[ProducesResponseType(typeof(ApiResponse<BulkApproveResponse>), 200)]` in `Mojaz.API/Controllers/DocumentsController.cs`

### Frontend — US3

- [x] T046 [P] [US3] Add `DocumentReviewRequest`, `BulkApproveResponse` types and `reviewDocument(appId, docId, request)`, `bulkApprove(appId)` service functions to `src/frontend/src/types/document.types.ts` and `src/frontend/src/services/document.service.ts`
- [x] T047 [US3] Add `useReviewDocument()` and `useBulkApprove()` mutations to `src/frontend/src/hooks/useDocuments.ts`
- [x] T048 [US3] Create `DocumentLightbox.tsx` — modal overlay with conditional rendering: `<img>` for JPEG/PNG, `<iframe>` for PDF (with download fallback link); displays `DocumentStatusBadge`; "Approve" button calls `onApprove`; "Reject" button reveals rejection reason `<textarea>` that must be non-empty before "Confirm Rejection" is enabled in `src/frontend/src/components/domain/document/DocumentLightbox.tsx`
- [x] T049 [US3] Create `DocumentReviewPanel.tsx` — list of all documents for application with status badge, upload date, file name; each row opens `DocumentLightbox` on click; "Bulk Approve All Pending" button at top (disabled when no pending docs); invalidates `useGetDocuments` query on success in `src/frontend/src/components/domain/document/DocumentReviewPanel.tsx`
- [x] T050 [US3] Create employee documents page — fetches documents via `useGetDocuments`, renders `DocumentReviewPanel`, page title via `useTranslations('document.review')` in `src/frontend/src/app/[locale]/(protected)/applications/[id]/documents/page.tsx`
- [x] T051 [P] [US3] Add review-specific translation keys (`document.review.*`, `document.lightbox.*`) to both locale files in `src/frontend/public/locales/ar/document.json` and `src/frontend/public/locales/en/document.json`

**Checkpoint**: Employee can approve/reject individual documents and bulk approve. Rejection reason is enforced. Status updates without page reload. Story 3 independently functional.

---

## Phase 6: User Story 4 — Applicant Soft-Deletes Before Submission (Priority: P3)

**Goal**: An applicant who has uploaded the wrong file can remove it (soft delete) before the application is submitted, returning the card to empty state for re-upload.

**Independent Test**: As Applicant, upload a file to PersonalPhoto card. Click "Remove". Card reverts to empty. `GET /documents` no longer lists the deleted document. Attempt DELETE after application is submitted → expect 403.

### Backend — US4

- [x] T052 [US4] Verify `DeleteAsync` in `DocumentService` fully enforces: (a) Applicant owns the application, (b) Application status is `Draft` or `PendingDocumentUpload`, (c) document `IsDeleted` is set to `true` with `UpdatedAt = DateTime.UtcNow`, (d) audit log recorded in `Mojaz.Application/Services/DocumentService.cs`
- [x] T053 [US4] Verify `DELETE /{documentId}` endpoint has correct `[Authorize(Roles = "Applicant,Receptionist")]` and `[ProducesResponseType]` for 200 and 403 in `Mojaz.API/Controllers/DocumentsController.cs`

### Frontend — US4

- [x] T054 [US4] Update `UploadCard.tsx` — show "Remove" button only when `canDelete` prop is `true` (passed from parent based on application status); clicking Remove calls `useDeleteDocument` mutation; on success reset card to empty state and invalidate requirements query in `src/frontend/src/components/domain/document/UploadCard.tsx`
- [x] T055 [US4] Update `DocumentUploadGrid.tsx` — derive `canDelete` from application status (accept `applicationStatus` prop); pass `canDelete` to each `UploadCard` in `src/frontend/src/components/domain/document/DocumentUploadGrid.tsx`
- [x] T056 [US4] Update applicant documents page to pass `applicationStatus` from fetched application to `DocumentUploadGrid` in `src/frontend/src/app/[locale]/(protected)/applications/[id]/documents/page.tsx`
- [x] T057 [P] [US4] Add delete translation keys (`document.upload.remove`, `document.upload.removeConfirm`, `document.errors.cannotDeleteAfterSubmission`) to both locale files in `src/frontend/public/locales/ar/document.json` and `src/frontend/public/locales/en/document.json`

**Checkpoint**: Remove button visible before submission, hidden after. Soft delete works. All 4 user stories independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Tests, notification wiring verification, RTL/dark mode audit, and backend unit tests.

- [x] T058 [P] Write `DocumentServiceTests` — 13 test cases defined in plan.md covering: valid upload, size rejection, extension rejection, MIME mismatch, wrong owner, approve, reject-no-reason, reject-with-notification, bulk-approve-atomic, delete-before-submission, delete-after-submission, requirements-minor, requirements-adult in `Mojaz.Application.Tests/Services/DocumentServiceTests.cs`
- [x] T059 [P] Write `UploadDocumentValidatorTests` — covers size threshold, extension allowlist, MIME magic bytes for PDF/JPEG/PNG in `Mojaz.Application.Tests/Validators/UploadDocumentValidatorTests.cs`
- [x] T060 Verify rejection notification path end-to-end — as Receptionist reject a document, confirm in-app `Notification` record created, Hangfire queues Push/Email/SMS job with rejection reason; verify `INotificationService.SendAsync` called with correct `NotificationEventType` in `Mojaz.Infrastructure/Services/` (integration smoke test)
- [x] T061 [P] Verify RTL layout of all document components — `UploadCard`, `DocumentUploadGrid`, `DocumentReviewPanel`, `DocumentLightbox` render correctly in Arabic locale with `dir="rtl"` (no `ml-`/`mr-` CSS, logical properties only)
- [x] T062 [P] Verify dark mode — all document components respect `dark:` Tailwind variants; no hardcoded color values
- [x] T063 [P] Add Swagger XML comments to all 7 `DocumentsController` endpoints in `Mojaz.API/Controllers/DocumentsController.cs`
- [x] T064 Add "Documents" navigation tab link in applicant application detail page and employee application detail page (exact paths depend on existing routing in `src/frontend/src/app/[locale]/(protected)/applications/[id]/page.tsx` and `(employee)/applications/[id]/page.tsx`)
- [x] T065 Run quickstart.md validation — upload via HTTP client, navigate to upload page, confirm all 4 mandatory cards, drag & drop test, employee review test

---

## Implementation Complete ✅

**Feature 014: Document Upload & Review** is fully implemented.

### Test Results
- **DocumentServiceTests**: 13 tests passing
- **UploadDocumentValidatorTests**: 28 tests passing
- **Total**: 41 tests passing

### Build Status
- Backend (.NET 8): ✅ Build successful
- Frontend (Next.js 15): ✅ Build successful

### Completed Components

**Backend (7 endpoints)**:
- `POST /upload` - Upload document
- `GET /` - List documents
- `GET /requirements` - Get document requirements
- `PATCH /bulk-approve` - Bulk approve pending documents
- `PATCH /{documentId}/review` - Review (approve/reject) document
- `DELETE /{documentId}` - Soft delete document
- `GET /{documentId}/download` - Download document file

**Frontend Components**:
- `UploadCard.tsx` - Drag & drop upload with progress
- `DocumentUploadGrid.tsx` - Grid layout of upload cards
- `DocumentStatusBadge.tsx` - Status indicator pills
- `DocumentLightbox.tsx` - Modal viewer for employee review
- `DocumentReviewPanel.tsx` - Employee review table
- `documents/page.tsx` - Applicant documents page
- `skeleton.tsx` - Loading state component

**Translations**:
- Arabic: `public/locales/ar/document.json`
- English: `public/locales/en/document.json`