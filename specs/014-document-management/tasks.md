# Tasks: Document Upload & Review (014-document-management)

**Input**: Design documents from `/specs/014-document-management/`
**Prerequisites**: plan.md ✅ · spec.md ✅ · data-model.md ✅ · contracts/ ✅ · research.md ✅ · quickstart.md ✅

## Phase 1: Setup
**Purpose**: Initialize structure, configs, and dependencies

- [x] T001 Update `DocumentType` enum — rename existing values and add 3 conditional types in `Mojaz.Domain/Enums/DocumentType.cs`
- [x] T002 Normalize `DocumentStatus` enum — keep `Pending(0)/Approved(1)/Rejected(2)` in `Mojaz.Domain/Enums/AdditionalEnums.cs`
- [x] T003 Update `ApplicationDocument` entity — add `OriginalFileName`, `StoredFileName`, `FileSizeBytes` fields in `Mojaz.Domain/Entities/ApplicationDocument.cs`
- [x] T004 Create `IFileStorageService` interface with `SaveAsync`, `ReadAsync`, `DeleteAsync` in `Mojaz.Application/Interfaces/Infrastructure/IFileStorageService.cs`
- [x] T005 [P] Update `IDocumentService` interface — add `GetRequirementsAsync` and `BulkApproveAsync` in `Mojaz.Application/Interfaces/Services/IDocumentService.cs`
- [x] T006 [P] Add `DocumentRequirementDto` and `BulkApproveResponse` DTOs to `Mojaz.Application/DTOs/Document/DocumentDtos.cs`
- [x] T007 Create `ApplicationDocumentConfiguration.cs` EF Core config — soft-delete filter and unique index in `Mojaz.Infrastructure/Data/Configurations/ApplicationDocumentConfiguration.cs`
- [x] T008 Add EF Core migration `UpdateDocumentTypes` in `Mojaz.Infrastructure/Migrations/`
- [x] T009 Add EF Core migration `NormalizeDocumentStatus` in `Mojaz.Infrastructure/Migrations/`
- [x] T010 Create `LocalFileStorageService` implementing `IFileStorageService` in `Mojaz.Infrastructure/Services/LocalFileStorageService.cs`
- [x] T011 Register `IFileStorageService → LocalFileStorageService` in `Mojaz.Infrastructure/InfrastructureServiceRegistration.cs`

---

## Phase 2: Tests
**Purpose**: TDD - write tests for entities, services, and API

- [X] T012 [P] Write `DocumentServiceTests` (13 test cases) in `Mojaz.Application.Tests/Services/DocumentServiceTests.cs`
- [X] T013 [P] Write `UploadDocumentValidatorTests` (28 test cases) in `Mojaz.Application.Tests/Validators/UploadDocumentValidatorTests.cs`
- [X] T014 [P] Verify rejection notification path end-to-end (In-App + Hangfire job)
- [X] T015 [P] Verify RTL layout of all document components (`UploadCard`, `DocumentUploadGrid`, `DocumentReviewPanel`, `DocumentLightbox`)
- [X] T016 [P] Verify dark mode respect for all document components

---

## Phase 3: Core
**Purpose**: Implement Domain, Application, Infrastructure, API, and UI

- [x] T017 Create `DocumentMappingProfile` in `Mojaz.Application/Mappings/DocumentMappingProfile.cs`
- [x] T018 [P] Create `UploadDocumentValidator` in `Mojaz.Application/Validators/UploadDocumentValidator.cs`
- [x] T019 [P] Create `DocumentReviewValidator` in `Mojaz.Application/Validators/DocumentReviewValidator.cs`
- [x] T020 Create `DocumentService` skeleton in `Mojaz.Application/Services/DocumentService.cs`
- [x] T021 Implement `UploadAsync` in `DocumentService` — validation, storage, and persistence in `Mojaz.Application/Services/DocumentService.cs`
- [x] T022 Implement `GetByApplicationIdAsync` in `DocumentService` in `Mojaz.Application/Services/DocumentService.cs`
- [x] T023 Implement `DeleteAsync` in `DocumentService` (soft delete) in `Mojaz.Application/Services/DocumentService.cs`
- [x] T024 Implement `DownloadAsync` in `DocumentService` in `Mojaz.Application/Services/DocumentService.cs`
- [x] T025 Register `IDocumentService → DocumentService` in `Mojaz.Application/ApplicationServiceRegistration.cs`
- [x] T026 [US1] Update `DocumentsController` upload endpoint in `Mojaz.API/Controllers/DocumentsController.cs`
- [x] T027 [US1] Add `GET /` and `GET /{documentId}/download` endpoints in `Mojaz.API/Controllers/DocumentsController.cs`
- [x] T028 [US1] Verify `appsettings.json` file path and `uploads/` directory creation in `Mojaz.API/Program.cs`
- [x] T029 [P] [US1] Create `document.types.ts` in `src/frontend/src/types/document.types.ts`
- [x] T030 [P] [US1] Create `document.service.ts` in `src/frontend/src/services/document.service.ts`
- [x] T031 [US1] Create `useDocuments.ts` hook in `src/frontend/src/hooks/useDocuments.ts`
- [x] T032 [US1] Create `DocumentStatusBadge.tsx` in `src/frontend/src/components/domain/document/DocumentStatusBadge.tsx`
- [x] T033 [US1] Create `UploadCard.tsx` (drag & drop, progress, preview) in `src/frontend/src/components/domain/document/UploadCard.tsx`
- [x] T034 [US1] Create `DocumentUploadGrid.tsx` in `src/frontend/src/components/domain/document/DocumentUploadGrid.tsx`
- [x] T035 [US1] Create applicant documents page in `src/frontend/src/app/[locale]/(applicant)/applications/[id]/documents/page.tsx`
- [x] T036 [P] [US1] Create Arabic translation file in `src/frontend/public/locales/ar/document.json`
- [x] T037 [P] [US1] Create English translation file in `src/frontend/public/locales/en/document.json`
- [x] T038 [US2] Implement `GetRequirementsAsync` in `DocumentService` in `Mojaz.Application/Services/DocumentService.cs`
- [x] T039 [US2] Add `GET /requirements` endpoint to `DocumentsController` in `Mojaz.API/Controllers/DocumentsController.cs`
- [x] T040 [US2] Extend `UploadAsync` for re-upload flow in `Mojaz.Application/Services/DocumentService.cs`
- [x] T041 [US2] Add `DocumentRequirementDto` type and `getRequirements` function to `src/frontend/src/types/document.types.ts` and `src/frontend/src/services/document.service.ts`
- [x] T042 [US2] Add `useGetRequirements` hook to `src/frontend/src/hooks/useDocuments.ts`
- [x] T043 [US2] Update `DocumentUploadGrid.tsx` for conditional rules in `src/frontend/src/components/domain/document/DocumentUploadGrid.tsx`
- [x] T044 [US2] Update `UploadCard.tsx` for rejected state and re-upload in `src/frontend/src/components/domain/document/UploadCard.tsx`
- [x] T045 [US2] Update applicant documents page to use `useGetRequirements` in `src/frontend/src/app/[locale]/(applicant)/applications/[id]/documents/page.tsx`
- [x] T046 [P] [US2] Add conditional document translation keys to locale files
- [x] T047 [US3] Implement `ReviewAsync` in `DocumentService` (with notifications) in `Mojaz.Application/Services/DocumentService.cs`
- [x] T048 [US3] Implement `BulkApproveAsync` in `DocumentService` in `Mojaz.Application/Services/DocumentService.cs`
- [x] T049 [US3] Add `PATCH /{documentId}/review` endpoint in `Mojaz.API/Controllers/DocumentsController.cs`
- [x] T050 [US3] Add `PATCH /bulk-approve` endpoint in `Mojaz.API/Controllers/DocumentsController.cs`
- [x] T051 [P] [US3] Add `DocumentReviewRequest`, `BulkApproveResponse` types and review services to `src/frontend/src/types/document.types.ts` and `src/frontend/src/services/document.service.ts`
- [x] T052 [US3] Add `useReviewDocument()` and `useBulkApprove()` mutations to `src/frontend/src/hooks/useDocuments.ts`
- [x] T053 [US3] Create `DocumentLightbox.tsx` (viewer + actions) in `src/frontend/src/components/domain/document/DocumentLightbox.tsx`
- [x] T054 [US3] Create `DocumentReviewPanel.tsx` in `src/frontend/src/components/domain/document/DocumentReviewPanel.tsx`
- [x] T055 [US3] Create employee documents page in `src/frontend/src/app/[locale]/(protected)/applications/[id]/documents/page.tsx`
- [x] T056 [P] [US3] Add review-specific translation keys to locale files
- [x] T057 [US4] Verify `DeleteAsync` logic and ownership enforcement in `Mojaz.Application/Services/DocumentService.cs`
- [x] T058 [US4] Verify `DELETE /{documentId}` endpoint auth in `Mojaz.API/Controllers/DocumentsController.cs`
- [x] T059 [US4] Update `UploadCard.tsx` to show/hide Remove button in `src/frontend/src/components/domain/document/UploadCard.tsx`
- [x] T060 [US4] Update `DocumentUploadGrid.tsx` to pass `canDelete` in `src/frontend/src/components/domain/document/DocumentUploadGrid.tsx`
- [x] T061 [US4] Update applicant documents page to pass application status in `src/frontend/src/app/[locale]/(protected)/applications/[id]/documents/page.tsx`
- [x] T062 [P] [US4] Add delete translation keys to locale files

---

## Phase 4: Integration
**Purpose**: Wire everything together, handle errors, and logging

- [x] T063 [P] Add Swagger XML comments to all 7 `DocumentsController` endpoints in `Mojaz.API/Controllers/DocumentsController.cs`
- [x] T064 Add "Documents" navigation tab links in detail pages
- [x] T065 Run quickstart.md validation smoke tests

---

## Phase 5: Polish
**Purpose**: i18n translations, RTL support, Dark Mode, and Final Validation

- [x] T066 Responsive audit
- [x] T067 Accessibility audit
- [x] T068 Dark mode audit
- [x] T069 Final E2E validation
