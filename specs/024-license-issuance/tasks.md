---
description: "Task list for License Issuance feature implementation"
---

# Tasks: License Issuance (Feature 024)

**Input**: Design documents from `/specs/024-license-issuance/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-contracts.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story where applicable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Path Conventions: `src/Mojaz.Domain/`, `src/Mojaz.Application/`, `src/Mojaz.Infrastructure/`, `src/Mojaz.API/`, `tests/Mojaz.Application.Tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base interface declarations.

- [x] T001 Define `IBlobStorageService` interface in `src/Mojaz.Application/Interfaces/IBlobStorageService.cs` (Used existing `IFileStorageService`)
- [x] T002 Define `ILicensePdfGenerator` interface in `src/Mojaz.Application/Interfaces/Infrastructure/ILicensePdfGenerator.cs`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [x] T003 Update `License` entity in `src/backend/Mojaz.Domain/Entities/License.cs` to include `BlobUrl` field.
- [x] T004 Create database migration for the updated License entity format using EF Core CLI.
- [x] T005 Implement `BlobStorageService` (using local app data directory fallback for MVP) in `src/backend/Mojaz.Infrastructure/Services/BlobStorageService.cs` (Using existing `LocalFileStorageService`)
- [x] T006 Register `BlobStorageService` in the dependency injection container inside `src/backend/Mojaz.Infrastructure/InfrastructureServiceRegistration.cs`.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Generate License Metadata & Expiry (Priority: P1)

**Goal**: Implement the core application service logic for generating the `MOJ-YYYY-XXXXXXXX` license number, determining the expiry based on `LicenseCategories` config, and enforcing business validations (fees paid, medical validation).

**Independent Test**: Unit tests for `LicenseIssuanceService` ensuring business rules and date generation logic hold.

### Implementation for User Story 1
- [x] T007 [US1] Create unit tests for metadata generation logic in `tests/Mojaz.Application.Tests/Services/LicenseIssuanceServiceTests.cs`.
- [x] T008 [US1] Create `LicenseDto` response model in `src/backend/Mojaz.Application/DTOs/License/LicenseDto.cs`.
- [x] T009 [US1] Implement base metadata generation functionality inside `src/backend/Mojaz.Application/Services/LicenseService.cs`.

**Checkpoint**: At this point, User Story 1 metadata generation logic should be tested independently without the actual PDF or Database persistence.

---

## Phase 4: User Story 2 & 3 - Bilingual PDF Generation (Priority: P2)

**Goal**: To implement the actual `QuestPDF` layout rendering a high-quality Arabic/English license card document safely, integrated seamlessly without blocking on IO.

**Independent Test**: Execute generator isolated test that outputs a fake PDF locally and verifies standard layout does not throw formatting errors.

### Implementation for User Story 2 & 3
- [x] T010 [US2] Implement `QuestPdfLicenseGenerator` in `src/backend/Mojaz.Infrastructure/Documents/QuestPdfLicenseGenerator.cs`.
- [x] T011 [US2] Register QuestPDF and configure bilingual layout logic.
- [x] T012 [US2] Register `QuestPdfLicenseGenerator` into the infrastructure DI container.

**Checkpoint**: At this point, the backend can produce compliant PDF binaries for licenses.

---

## Phase 5: User Story 4 & 5 - Issue License API & Idempotency (Priority: P3)

**Goal**: Expose the `/api/v1/licenses/{appId}/issue` endpoint implementing the API Contract perfectly, saving to Blob, and returning the `ApiResponse<LicenseDto>`. Enforce idempotency.

**Independent Test**: Make API requests. Ensure the second request with the same Application ID returns `409 Conflict`. Validate the response body conforms to `ApiResponse<T>`.

### Implementation for User Story 4 & 5
- [x] T013 [US4] Configure QuestPDF license in `Program.cs`.
- [x] T014 [US4] Integrate PDF generation, local storage, and DB persistence.
- [x] T015 [US4] Create `POST /api/v1/licenses/issue/{appId}` endpoint in `LicensesController.cs`.
- [x] T016 [US4] Implement idempotency check (409 Conflict) for issuance.

**Checkpoint**: At this point, the primary license issuance capability is 100% operational.

---

## Phase 6: User Story 6 - Provide Secure PDF Download API (Priority: P4)

**Goal**: Implement the secure file proxy endpoint to download the generated license PDF.

**Independent Test**: Download the endpoint as the authenticated Applicant (200 OK), then attempt as an unauthorized user (403 Forbidden).

### Implementation for User Story 6
- [x] T017 [US6] Create `GET /api/v1/licenses/{id}/download` endpoint in `LicensesController.cs`.
- [x] T018 [US6] Enforce authorization check for secure downloading.

**Checkpoint**: The PDF is accessible for downloading in compliance with security guidelines.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Connect notification integrations to finalize the user story lifecycle and align with the constitution.

- [x] T019 Implement asynchronous hangfire notification dispatch (Push/Email/SMS) inside `LicenseService`.
- [x] T020 Run final review and add layout preview endpoint.

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Must run first.
- **Foundational (Phase 2)**: Runs next; blocks functional user stories.
- **User Stories (Phase 3 - 6)**: Generally sequential per story (US1 -> US2/3 -> US4/5 -> US6) considering the controller relies on the service, and the service relies on the PDF infrastructure.
- **Polish (Phase 7)**: Final integrations.

### Parallel Opportunities

- Due to clean architecture interfaces, `QuestPdfGenerator` (Phase 4) can be developed strictly in parallel with `LicenseIssuanceService` metadata (Phase 3). Interface decoupling permits separate implementation lanes.
- PDF Download Endpoint (Phase 6) can be built independently mock-fetching the `BlobStorageService` stream.
