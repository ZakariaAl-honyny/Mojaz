# Tasks: License Issuance (Feature 024)

**Input**: Design documents from `/specs/024-license-issuance/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/api-contracts.md ✅

## Format: `[ID] [P?] [Story] Description — file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Path Conventions: `src/backend/Mojaz.Domain/`, `src/backend/Mojaz.Application/`, `src/backend/Mojaz.Infrastructure/`, `src/backend/Mojaz.API/`, `tests/Mojaz.Application.Tests/`

---

## Phase 1: Setup (Initialize structure, configs, dependencies)

**Purpose**: Project initialization and base interface declarations.

- [x] T001 Define `IBlobStorageService` interface in `src/backend/Mojaz.Application/Interfaces/IBlobStorageService.cs`
- [x] T002 Define `ILicensePdfGenerator` interface in `src/backend/Mojaz.Application/Interfaces/Infrastructure/ILicensePdfGenerator.cs`

---

## Phase 2: Tests (TDD: write tests for entities, services, API)

**Purpose**: Establish validity logic before core implementation.

- [ ] T000 [US1] Write unit tests for license number generation format and expiry date calculation based on category in `tests/Mojaz.Application.Tests/Services/LicenseIssuanceServiceTests.cs`
- [ ] T000 [US2] Write unit tests for PDF generation triggers and blob storage upload success in `tests/Mojaz.Application.Tests/Services/LicenseIssuanceServiceTests.cs`
- [ ] T000 [US4] Write unit tests for issuance idempotency (expect 409 Conflict on second attempt) in `tests/Mojaz.Application.Tests/Services/LicenseIssuanceServiceTests.cs`
- [ ] T000 [US6] Write unit tests for secure download authorization (Applicant vs Other) in `tests/Mojaz.Application.Tests/Services/LicenseIssuanceServiceTests.cs`

---

## Phase 3: Core (Implement Domain, Application, Infrastructure, API, and UI)

**Purpose**: Implement the generation logic, PDF rendering, and API endpoints.

### Foundational (Blocking)
- [x] T003 Update `License` entity to include `BlobUrl` field in `src/backend/Mojaz.Domain/Entities/License.cs`
- [x] T004 Create database migration for the updated License entity format
- [x] T005 Implement `BlobStorageService` (local fallback for MVP) in `src/backend/Mojaz.Infrastructure/Services/BlobStorageService.cs`
- [x] T006 Register `BlobStorageService` in DI in `src/backend/Mojaz.Infrastructure/InfrastructureServiceRegistration.cs`

### User Story 1 - License Generation & Expiry (P1)
- [x] T007 [US1] Create unit tests for metadata generation logic in `tests/Mojaz.Application.Tests/Services/LicenseIssuanceServiceTests.cs`
- [x] T008 [US1] Create `LicenseDto` response model in `src/backend/Mojaz.Application/DTOs/License/LicenseDto.cs`
- [x] T009 [US1] Implement base metadata generation functionality in `src/backend/Mojaz.Application/Services/LicenseService.cs`

### User Story 2 & 3 - Bilingual PDF Generation (P2)
- [x] T010 [US2] Implement `QuestPdfLicenseGenerator` in `src/backend/Mojaz.Infrastructure/Documents/QuestPdfLicenseGenerator.cs`
- [x] T011 [US2] Register QuestPDF and configure bilingual layout logic
- [x] T012 [US2] Register `QuestPdfLicenseGenerator` into the infrastructure DI container

### User Story 4 & 5 - Issue License API & Idempotency (P3)
- [x] T013 [US4] Configure QuestPDF license in `Program.cs`
- [x] T014 [US4] Integrate PDF generation, local storage, and DB persistence in `src/backend/Mojaz.Application/Services/LicenseService.cs`
- [x] T015 [US4] Create `POST /api/v1/licenses/issue/{appId}` endpoint in `src/backend/Mojaz.API/Controllers/LicensesController.cs`
- [x] T016 [US4] Implement idempotency check (409 Conflict) for issuance in `src/backend/Mojaz.Application/Services/LicenseService.cs`

### User Story 6 - Provide Secure PDF Download API (P4)
- [x] T017 [US6] Create `GET /api/v1/licenses/{id}/download` endpoint in `src/backend/Mojaz.API/Controllers/LicensesController.cs`
- [x] T018 [US6] Enforce authorization check for secure downloading in `src/backend/Mojaz.API/Controllers/LicensesController.cs`

---

## Phase 4: Integration (Wire everything together, handle errors, logging)

**Purpose**: Connect notifications and verify the end-to-end issuance flow.

- [x] T019 Implement asynchronous hangfire notification dispatch (Push/Email/SMS) inside `LicenseService` in `src/backend/Mojaz.Application/Services/LicenseService.cs`

---

## Phase 5: Polish (i18n translations, RTL support, Dark Mode, Final Validation)

**Purpose**: Final review and layout validation.

- [x] T020 Run final review and add layout preview endpoint
