# Tasks: Multi-Point Payment Simulation

**Input**: Design documents from `/specs/023-payment-simulation/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

## Format: `[ID] [P?] [Story?] Description — file path`

- **[P]**: Parallelizable (different files, no in-flight dependencies)
- **[US#]**: User story ownership
- All paths relative to repo root

---

## Phase 1: Setup (Initialize structure, configs, dependencies)

**Purpose**: Project initialization and base configuration.

- [x] T001 Create missing packages or configurations specifically for QuestPDF in `src/Mojaz.API/Program.cs`

---

## Phase 2: Tests (TDD: write tests for entities, services, API)

**Purpose**: Define payment outcomes and simulation boundaries.

- [ ] T000 [US1] Write unit tests for `PaymentService.InitiatePaymentAsync` verifying fee retrieval from `FeeStructures` in `tests/backend/Mojaz.Application.Tests/Services/PaymentServiceTests.cs`
- [ ] T000 [US2] Write unit tests for `PaymentService.ConfirmPaymentAsync` simulating failure based on failure rate in `tests/backend/Mojaz.Application.Tests/Services/PaymentServiceTests.cs`
- [ ] T000 [US3] Write unit tests for `PaymentReceiptGenerator` verifying PDF byte generation in `tests/backend/Mojaz.Infrastructure.Tests/Documents/PaymentReceiptGeneratorTests.cs`
- [ ] T000 [US4] Write unit tests for `GetApplicationPaymentsAsync` verifying chronological order in `tests/backend/Mojaz.Application.Tests/Services/PaymentServiceTests.cs`

---

## Phase 3: Core (Implement Domain, Application, Infrastructure, API, and UI)

**Purpose**: Implement the payment simulation logic, PDF generation, and history views.

### Foundational (Blocking)
- [x] T002 [P] Create `FeeType` and `PaymentStatus` Enums in `src/Mojaz.Domain/Enums/PaymentEnums.cs`
- [x] T003 [P] Create `FeeStructure` entity in `src/Mojaz.Domain/Entities/FeeStructure.cs`
- [x] T004 [P] Create `PaymentTransaction` entity in `src/Mojaz.Domain/Entities/PaymentTransaction.cs`
- [x] T005 [P] Create `IPaymentRepository` and `IFeeStructureRepository` in `src/Mojaz.Application/Interfaces/Repositories/`
- [x] T006 Implement EF Core Configurations and add DbSets to `src/Mojaz.Infrastructure/Data/ApplicationDbContext.cs`
- [x] T007 Create EF Core Database Migration for Payment module entities
- [x] T008 Implement `PaymentRepository` and `FeeStructureRepository` in `src/Mojaz.Infrastructure/Repositories/`

### User Story 1 — Initiate and Complete Payment (P1)
- [x] T009 [P] [US1] Create `PaymentInitiateRequest`, `PaymentConfirmRequest`, and `PaymentDto` DTOs in `src/Mojaz.Application/DTOs/Payments/`
- [x] T010 [P] [US1] Create FluentValidators for payment requests in `src/Mojaz.Application/Validators/Payments/`
- [x] T011 [US1] Create `IPaymentService` interface and `PaymentService` class in `src/Mojaz.Application/Services/Payments/`
- [x] T012 [US1] Implement `InitiatePaymentAsync` (fee fetch from `FeeStructures`) in `src/Mojaz.Application/Services/Payments/PaymentService.cs`
- [x] T013 [US1] Implement `ConfirmPaymentAsync` in `src/Mojaz.Application/Services/Payments/PaymentService.cs`
- [x] T014 [US1] Create `PaymentsController` with `initiate` and `confirm` endpoints in `src/Mojaz.API/Controllers/PaymentsController.cs`
- [x] T015 [P] [US1] Implement `frontend/src/services/payment.service.ts`
- [x] T016 [US1] Create `PaymentSimModal.tsx` for processing delay and confirmation in `frontend/src/components/domain/payment/PaymentSimModal.tsx`

### User Story 2 — Handle Payment Failure Simulation (P1)
- [x] T017 [US2] Update `ConfirmPaymentAsync` to handle `isSuccessful == false` flags in `src/Mojaz.Application/Services/Payments/PaymentService.cs`
- [x] T018 [US2] Update `PaymentSimModal.tsx` to simulate random JS-side failure in `frontend/src/components/domain/payment/PaymentSimModal.tsx`
- [x] T019 [US2] Add failure UI state and "Retry" button to `PaymentSimModal.tsx` in `frontend/src/components/domain/payment/PaymentSimModal.tsx`

### User Story 3 — Download Payment Receipt (P2)
- [x] T020 [P] [US3] Create `IPaymentReceiptGenerator` interface in `src/Mojaz.Application/Interfaces/Infrastructure/`
- [x] T021 [US3] Implement `QuestPdfPaymentReceiptGenerator` in `src/Mojaz.Infrastructure/Documents/`
- [x] T022 [US3] Add `DownloadReceiptAsync` method to `PaymentService` in `src/Mojaz.Application/Services/Payments/PaymentService.cs`
- [x] T023 [US3] Add `[HttpGet("{id}/receipt")]` endpoint to `PaymentsController` in `src/Mojaz.API/Controllers/PaymentsController.cs`
- [x] T024 [P] [US3] Add `downloadReceipt` function to `frontend/src/services/payment.service.ts`
- [x] T025 [US3] Create `ReceiptDownloadButton.tsx` in `frontend/src/components/domain/payment/ReceiptDownloadButton.tsx`
- [x] T026 [US3] Integrate `ReceiptDownloadButton` into success view and history list in `frontend/src/components/domain/payment/PaymentSimModal.tsx`

### User Story 4 — View Application Payment History (P3)
- [x] T026 [P] [US4] Create `PaymentHistoryDto` in `src/Mojaz.Application/DTOs/Payments/`
- [x] T027 [US4] Add `GetApplicationPaymentsAsync` in `PaymentService` in `src/Mojaz.Application/Services/Payments/PaymentService.cs`
- [x] T028 [US4] Add `[HttpGet("application/{appId}")]` endpoint to `PaymentsController` in `src/Mojaz.API/Controllers/PaymentsController.cs`
- [x] T029 [P] [US4] Add `getPaymentHistory` function to `frontend/src/services/payment.service.ts`
- [x] T030 [US4] Create `PaymentHistoryList.tsx` in `frontend/src/components/domain/payment/PaymentHistoryList.tsx`
- [x] T031 [US4] Integrate `PaymentHistoryList` into application detail page in `src/frontend/src/app/[locale]/(protected)/applications/[id]/page.tsx`

---

## Phase 4: Integration (Wire everything together, handle errors, logging)

**Purpose**: Integration with notifications and final workflow wiring.

- [x] T032 Enhance `PaymentService` to emit Hangfire background notifications upon success/failure via `INotificationService` in `src/Mojaz.Application/Services/Payments/PaymentService.cs`

---

## Phase 5: Polish (i18n translations, RTL support, Dark Mode, Final Validation)

**Purpose**: Visual and linguistic refinement.

- [x] T033 Verify proper RTL styling and right-to-left layout in all Payment components in `frontend/src/components/domain/payment/`
