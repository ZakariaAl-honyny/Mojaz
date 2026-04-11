# Tasks: License Renewal (Feature 025)

**Input**: Design documents from `/specs/025-license-renewal/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | data-model.md ✅ | contracts/ ✅

## Format: `[ID] [P?] [Story?] Description — file path`

- **[P]**: Parallelizable (different files, no in-flight dependencies)
- **[US#]**: User story ownership
- All paths relative to repo root

---

## Phase 1: Setup (Initialize structure, configs, dependencies)

**Purpose**: Project initialization and basic structure.

- [X] T001 Create .NET solution and project structure in `src/Mojaz.sln`
- [X] T002 Initialize ASP.NET Core 8 Web API project in `src/Mojaz.API/Mojaz.API.csproj`
- [X] T003 [P] Add Tailwind and shadcn/ui to frontend in `frontend/`
- [X] T004 [P] Configure Git repository and branch `025-license-renewal`
- [X] T005 [P] Setup CI pipeline in `.github/workflows/ci.yml`

---

## Phase 2: Tests (TDD: write tests for entities, services, API)

**Purpose**: Define validation rules for eligibility and renewal logic.

- [ ] T000 [US1] Write unit tests for `ValidateEligibilityAsync` verifying grace period logic in `tests/Mojaz.Application.Tests/Services/RenewalServiceTests.cs`
- [ ] T000 [US1] Write unit tests for `PayRenewalFeeAsync` verifying correct fee retrieval from `FeeStructures` in `tests/Mojaz.Application.Tests/Services/RenewalServiceTests.cs`
- [ ] T000 [US2] Write unit tests for `IssueLicenseAsync` verifying old license deactivation in `tests/Mojaz.Application.Tests/Services/RenewalServiceTests.cs`

---

## Phase 3: Core (Implement Domain, Application, Infrastructure, API, and UI)

**Purpose**: Implement the streamlined renewal workflow.

### Foundational (Blocking)
- [X] T006 Setup database schema and migrations framework in `src/Mojaz.Infrastructure/`
- [X] T007 [P] Implement authentication/authorization framework in `src/Mojaz.API/Authentication/`
- [X] T008 [P] Setup API routing and middleware structure in `src/Mojaz.API/`
- [X] T009 Create base entities in `src/Mojaz.Domain/Entities/`
- [X] T010 Configure error handling and logging infrastructure in `src/Mojaz.Shared/Logging/`
- [X] T011 Configure environment configuration management in `src/Mojaz.Shared/Configuration/`

### User Story 1 — Renew Active or Recently Expired License (P1)
- [X] T014 [P] [US1] Create `RenewalApplication` entity in `src/Mojaz.Domain/Entities/RenewalApplication.cs`
- [X] T015 [P] [US1] Add `Status` enum to `License` in `src/Mojaz.Domain/Enums/LicenseStatus.cs`
- [X] T016 [P] [US1] Implement `IRenewalService` interface in `src/Mojaz.Application/Services/IRenewalService.cs`
- [X] T017 [P] [US1] Implement `RenewalService` (eligibility, creation, medical result, payment, issuance) in `src/Mojaz.Application/Services/RenewalService.cs`
- [X] T018 [P] [US1] Add DTOs: `CreateRenewalRequest`, `EligibilityResponse`, `PaymentRequest`, `IssueLicenseResponse` in `src/Mojaz.Application/DTOs/`
- [X] T019 [P] [US1] Add FluentValidation validators for DTOs in `src/Mojaz.Application/Validators/`
- [X] T020 [P] [US1] Implement `RenewalController` in `src/Mojaz.API/Controllers/RenewalController.cs`
- [X] T021 [P] [US1] Extend `QuestPdfLicenseGenerator` for renewal PDFs in `src/Mojaz.Infrastructure/Services/QuestPdfLicenseGenerator.cs`
- [X] T022 [P] [US1] Store generated PDF in Blob storage in `src/Mojaz.Infrastructure/Services/BlobStorageService.cs`
- [X] T023 [P] [US1] Trigger notification events on issuance in `src/Mojaz.Application/Services/NotificationService.cs`
- [X] T024 [P] [US1] Add unit tests for `RenewalService` in `tests/unit/RenewalServiceTests.cs`

### User Story 2 — Deactivate Old License on Renewal (P2)
- [X] T027 [P] [US2] Update `RenewalService.IssueLicenseAsync` to set old license `Status = LicenseStatus.Renewed` in `src/Mojaz.Application/Services/RenewalService.cs`
- [X] T028 [P] [US2] Add repository method `MarkLicenseInactiveAsync` in `src/Mojaz.Application/Repositories/ILicenseRepository.cs`
- [X] T029 [P] [US2] Implement repository method in `src/Mojaz.Infrastructure/Repositories/LicenseRepository.cs`
- [X] T030 [P] [US2] Add unit test for deactivation logic in `tests/unit/LicenseDeactivationTests.cs`

---

## Phase 4: Integration (Wire everything together, handle errors, logging)

**Purpose**: Verify end-to-end renewal flow and state transitions.

- [X] T038 [P] Add integration tests for end‑to‑end renewal flow in `tests/integration/FullRenewalE2ETest.cs`

---

## Phase 5: Polish (i18n translations, RTL support, Dark Mode, Final Validation)

**Purpose**: Final API documentation and performance optimization.

- [X] T031 [P] Update API documentation (Swagger) in `src/Mojaz.API/Swagger/`
- [X] T032 [P] Add OpenAPI spec entries for renewal in `src/Mojaz.API/Swagger/renewal.yaml`
- [X] T033 [P] Write user guide for renewal process in `docs/renewal_guide.md`
- [X] T034 [P] Code cleanup and refactoring in `src/`
- [X] T035 [P] Performance optimization for PDF generation in `src/Mojaz.Infrastructure/Services/QuestPdfLicenseGenerator.cs`
- [X] T036 [P] Security hardening: ensure only owner can renew in `src/Mojaz.API/Filters/OwnershipFilter.cs`
- [X] T037 [P] Run quickstart validation
