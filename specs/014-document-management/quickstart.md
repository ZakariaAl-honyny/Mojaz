# Quickstart: 014-Document Management

**Branch**: `014-document-management` | **Date**: 2026-04-09

This guide gives an implementer everything needed to start building Feature 014 in under 15 minutes.

---

## Pre-requisites

- Feature 010 (Notification Service) — `INotificationService` must be registered in DI
- Feature 011 (RBAC/Auth) — JWT auth + role claims must be working
- Feature 012 (Application CRUD) — `Application` entity and `ApplicationStatus` must exist
- Backend running on `https://localhost:7001/api/v1`
- Frontend running on `http://localhost:3000`

---

## Where Things Live

### Backend

```
Mojaz.Domain/
  Enums/
    DocumentType.cs              ← UPDATE: rename values + add 3 conditional types
    AdditionalEnums.cs           ← UPDATE: normalize DocumentStatus (remove Uploaded)
  Entities/
    ApplicationDocument.cs       ← UPDATE: add OriginalFileName, StoredFileName, FileSizeBytes fields

Mojaz.Application/
  Interfaces/
    Infrastructure/
      IFileStorageService.cs     ← NEW: storage abstraction
    Services/
      IDocumentService.cs        ← UPDATE: add GetRequirementsAsync, BulkApproveAsync
  DTOs/
    Document/
      DocumentDtos.cs            ← UPDATE: add DocumentRequirementDto, BulkApproveResponse
  Services/
    DocumentService.cs           ← NEW (main service implementation)
  Validators/
    UploadDocumentValidator.cs   ← NEW
    DocumentReviewValidator.cs   ← NEW

Mojaz.Infrastructure/
  Data/
    Configurations/
      ApplicationDocumentConfiguration.cs  ← NEW: EF Core config
  Services/
    LocalFileStorageService.cs   ← NEW: local disk implementation of IFileStorageService
    DocumentService.cs           ← NEW: full implementation (moved from Application if skeleton exists)
  Migrations/
    <timestamp>_UpdateDocumentTypes.cs   ← NEW: enum remap migration
    <timestamp>_NormalizeDocumentStatus.cs ← NEW: status normalization

Mojaz.API/
  Controllers/
    DocumentsController.cs       ← UPDATE: add BulkApprove + Requirements endpoints
```

### Frontend

```
src/
  services/
    document.service.ts                 ← NEW
  types/
    document.types.ts                   ← NEW
  hooks/
    useDocuments.ts                     ← NEW (React Query hooks)
  components/
    domain/
      document/
        DocumentUploadGrid.tsx          ← NEW (applicant upload UI)
        UploadCard.tsx                  ← NEW (per-type card with drag & drop)
        DocumentReviewPanel.tsx         ← NEW (employee review UI)
        DocumentLightbox.tsx            ← NEW (viewer modal)
        DocumentStatusBadge.tsx         ← NEW (Pending/Approved/Rejected badge)
  app/[locale]/
    (applicant)/
      applications/[id]/
        documents/
          page.tsx                      ← NEW (applicant document upload page)
    (employee)/
      applications/[id]/
        documents/
          page.tsx                      ← NEW (employee review page)

public/
  locales/
    ar/
      document.json                     ← NEW
    en/
      document.json                     ← NEW
```

---

## Key Rules to Remember

1. **Never serve raw file paths** — always use `GET /{docId}/download` controller endpoint.
2. **MIME validation is mandatory** — read magic bytes in `DocumentService.UploadAsync` before any file write.
3. **File size from SystemSettings** — `_systemSettingsService.GetAsync("MAX_FILE_SIZE_MB")`, default 5.
4. **Ownership check in service layer** — Applicant can only access their own application's documents.
5. **Rejection requires notification** — always call `INotificationService` after setting status to Rejected.
6. **Notifications are async** — in-app sync, Push/Email/SMS via Hangfire job.
7. **Bulk approve is atomic** — wrap entire batch in a single `IUnitOfWork.SaveChangesAsync` call.
8. **Soft delete only** — `IsDeleted = true`, never `DbSet.Remove()`.
9. **Re-upload to rejected card** — auto soft-deletes old doc + creates new `Pending` doc atomically.
10. **i18n everywhere** — no hardcoded strings; use `useTranslations('document')`.

---

## Running the First Test

### Backend: Test upload via HTTP client

```http
POST https://localhost:7001/api/v1/applications/{applicationId}/documents/upload
Authorization: Bearer {your-jwt}
Content-Type: multipart/form-data

documentType=1
file=@/path/to/id-copy.pdf
```

Expected: `201 Created` with `DocumentDto` containing `status: 0` (Pending).

### Frontend: Navigate to upload page

```
http://localhost:3000/ar/applications/{id}/documents
```

Expected: 4 mandatory document cards visible. Drag & drop a file onto one.

---

## Translation Key Structure

```json
// public/locales/ar/document.json & en/document.json
{
  "upload": {
    "title": "مستندات الطلب / Application Documents",
    "mandatory": "إلزامي / Mandatory",
    "conditional": "مشروط / Conditional",
    "dragDrop": "اسحب وأفلت الملف هنا / Drag & drop file here",
    "browse": "أو انقر للاختيار / or click to browse",
    "uploading": "جاري الرفع... / Uploading...",
    "remove": "حذف / Remove",
    "replace": "إعادة رفع / Re-upload"
  },
  "types": {
    "IdCopy": "صورة الهوية / ID Copy",
    "PersonalPhoto": "الصورة الشخصية / Personal Photo",
    "MedicalReport": "التقرير الطبي / Medical Report",
    "TrainingCertificate": "شهادة إتمام التدريب / Training Certificate",
    "AddressProof": "إثبات العنوان / Address Proof",
    "GuardianConsent": "موافقة ولي الأمر / Guardian Consent",
    "PreviousLicense": "الرخصة السابقة / Previous License",
    "AccessibilityDocuments": "وثائق الاحتياجات الخاصة / Accessibility Documents"
  },
  "status": {
    "Pending": "قيد المراجعة / Pending Review",
    "Approved": "مقبول / Approved",
    "Rejected": "مرفوض / Rejected"
  },
  "review": {
    "title": "مراجعة المستندات / Document Review",
    "approve": "قبول / Approve",
    "reject": "رفض / Reject",
    "bulkApprove": "قبول الكل / Approve All",
    "rejectionReason": "سبب الرفض / Rejection Reason",
    "rejectionPlaceholder": "أدخل سبب رفض المستند... / Enter rejection reason...",
    "confirmReject": "تأكيد الرفض / Confirm Rejection"
  },
  "errors": {
    "fileTooLarge": "حجم الملف يتجاوز 5 ميجابايت / File exceeds 5MB limit",
    "invalidType": "نوع الملف غير مدعوم. يُسمح بـ PDF وJPG وPNG فقط / Only PDF, JPG, PNG allowed",
    "uploadFailed": "فشل رفع الملف. حاول مرة أخرى / Upload failed. Please try again",
    "rejectionReasonRequired": "سبب الرفض مطلوب / Rejection reason is required"
  }
}
```
