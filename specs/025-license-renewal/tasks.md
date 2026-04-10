# Tasks: License Renewal (Feature 025)

**Input**: Design documents from `/specs/025-license-renewal/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Create .NET solution and project structure per implementation plan (`c:/Users/ALlahabi/Desktop/cmder/Mojaz/src/Mojaz.sln`)
- [X] T002 Initialize ASP.NET Core 8 Web API project (`c:/Users/ALlahabi/Desktop/cmder/Mojaz/src/Mojaz.API/Mojaz.API.csproj`)
- [X] T003 [P] Add Tailwind and shadcn/ui to frontend (if needed) (`c:/Users/ALlahabi/Desktop/cmder/Mojaz/frontend/`)
- [X] T004 [P] Configure Git repository and branch `025-license-renewal` (`c:/Users/ALlahabi/Desktop/cmder/Mojaz/`)
- [X] T005 [P] Setup CI pipeline (GitHub Actions) (`c:/Users/ALlahabi/Desktop/cmder/Mojaz/.github/workflows/ci.yml`)

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T006 Setup database schema and migrations framework (`c:/Users/ALlahabi/Desktop/cmder/Mojaz/src/Mojaz.Infrastructure/`)
- [X] T007 [P] Implement authentication/authorization framework (JWT, role checks) (`c:/Users/ALlahabi/Desktop/cmder/Mojaz/src/Mojaz.API/Authentication/`)
- [X] T008 [P] Setup API routing and middleware structure (`c:/Users/ALlahabi/Desktop/cmder/Mojaz/src/Mojaz.API/`)
- [X] T009 Create base entities (`License`, `Application`, `User`) (`c:/Users/ALlahabi/Desktop/cmder/Mojaz/src/Mojaz.Domain/Entities/`)
- [X] T010 Configure error handling and logging infrastructure (`c:/Users/ALlahabi/Desktop/cmder/Mojaz/src/Mojaz.Shared/Logging/`)
- [X] T011 Configure environment configuration management (`c:/Users/ALlahabi/Desktop/cmder/Mojaz/src/Mojaz.Shared/Configuration/`)

---

## Phase 3: User Story 1 - Renew Active or Recently Expired License (Priority: P1) 🎯 MVP

**Goal**: Allow eligible applicants to renew their license with a simplified workflow that skips training and testing, requires a medical exam, and charges the renewal fee.

**Independent Test**: Submit a renewal application for a user with a valid license, verify that training/testing stages are omitted, payment is processed, and a new license PDF is generated.

### Tests for User Story 1 (OPTIONAL)
- [ ] T012 [P] [US1] Contract test for `/api/v1/licenses/renewal/eligibility` in `tests/contract/RenewalEligibilityTest.cs`
- [ ] T013 [P] [US1] Integration test for full renewal flow in `tests/integration/RenewalFlowTest.cs`

### Implementation for User Story 1
- [X] T014 [P] [US1] Create `RenewalApplication` entity in `src/Mojaz.Domain/Entities/RenewalApplication.cs`
- [X] T015 [P] [US1] Add `Status` enum to `License` (`src/Mojaz.Domain/Enums/LicenseStatus.cs`)
- [X] T016 [P] [US1] Implement `IRenewalService` interface in Application layer (`src/Mojaz.Application/Services/IRenewalService.cs`)
- [X] T017 [P] [US1] Implement `RenewalService` with eligibility, creation, medical result, payment, issuance (`src/Mojaz.Application/Services/RenewalService.cs`)
- [X] T018 [P] [US1] Add DTOs: `CreateRenewalRequest`, `EligibilityResponse`, `PaymentRequest`, `IssueLicenseResponse` (`src/Mojaz.Application/DTOs/`)
- [X] T019 [P] [US1] Add FluentValidation validators for DTOs (`src/Mojaz.Application/Validators/`)
- [X] T020 [P] [US1] Implement `RenewalController` with endpoints (eligibility, create, medical-result, pay, issue) (`src/Mojaz.API/Controllers/RenewalController.cs`)
- [X] T021 [P] [US1] Extend `QuestPdfLicenseGenerator` to generate renewal PDF (`src/Mojaz.Infrastructure/Services/QuestPdfLicenseGenerator.cs`)
- [X] T022 [P] [US1] Store generated PDF in Blob storage (`src/Mojaz.Infrastructure/Services/BlobStorageService.cs`)
- [X] T023 [P] [US1] Trigger notification events on issuance (`src/Mojaz.Application/Services/NotificationService.cs`)
- [X] T024 [P] [US1] Add unit tests for `RenewalService` (`tests/unit/RenewalServiceTests.cs`)

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Deactivate Old License on Renewal (Priority: P2)

**Goal**: Ensure the old license is marked as inactive and the new license is created with correct dates.

**Independent Test**: After a successful renewal, query the database to confirm the old license `Status` is `Renewed/Inactive` and the new license has correct `IssueDate` and `ExpiryDate`.

### Tests for User Story 2 (OPTIONAL)
- [ ] T025 [P] [US2] Contract test for license status change in `tests/contract/LicenseDeactivationTest.cs`
- [ ] T026 [P] [US2] Integration test verifying old license deactivation (`tests/integration/LicenseDeactivationFlowTest.cs`)

### Implementation for User Story 2
- [X] T027 [P] [US2] Update `RenewalService.IssueLicenseAsync` to set old license `Status = LicenseStatus.Renewed` (`src/Mojaz.Application/Services/RenewalService.cs`)
- [X] T028 [P] [US2] Add repository method `MarkLicenseInactiveAsync` in `ILicenseRepository` (`src/Mojaz.Application/Repositories/ILicenseRepository.cs`)
- [X] T029 [P] [US2] Implement repository method in Infrastructure (`src/Mojaz.Infrastructure/Repositories/LicenseRepository.cs`)
- [X] T030 [P] [US2] Add unit test for deactivation logic (`tests/unit/LicenseDeactivationTests.cs`)

**Checkpoint**: Old license is correctly deactivated when new license is issued.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T031 [P] Update API documentation (Swagger) with renewal endpoints (`src/Mojaz.API/Swagger/`)
- [X] T032 [P] Add OpenAPI spec entries for renewal (`src/Mojaz.API/Swagger/renewal.yaml`)
- [X] T033 [P] Write user guide for renewal process in docs (`docs/renewal_guide.md`)
- [X] T034 [P] Code cleanup and refactoring (`src/`)
- [X] T035 [P] Performance optimization for PDF generation (`src/Mojaz.Infrastructure/Services/QuestPdfLicenseGenerator.cs`)
- [X] T036 [P] Security hardening: ensure only owner can renew (`src/Mojaz.API/Filters/OwnershipFilter.cs`)
- [X] T037 [P] Run quickstart validation (`.specify/scripts/powershell/quickstart.ps1`)
- [X] T038 [P] Add integration tests for end‑to‑end renewal flow (`tests/integration/FullRenewalE2ETest.cs`)

---

## Dependencies & Execution Order

- **Setup (Phase 1)** has no dependencies and can start immediately.
- **Foundational (Phase 2)** depends on completion of Setup.
- **User Stories (Phases 3 & 4)** depend on Foundational.
- **Polish (Phase 5)** depends on completion of all user stories.

Parallel opportunities are marked with `[P]` where tasks operate on different files or layers.

*Generated by speckit‑tasks workflow.*
