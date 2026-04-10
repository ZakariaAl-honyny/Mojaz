# Tasks: Multi-Point Payment Simulation

**Input**: Design documents from `/specs/023-payment-simulation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create missing packages or configurations specifically for QuestPDF (e.g., QuestPDF.Settings.License) in `src/Mojaz.API/Program.cs` if not yet configured

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Create `FeeType` and `PaymentStatus` Enums in `src/Mojaz.Domain/Enums/PaymentEnums.cs`
- [x] T003 [P] Create `FeeStructure` entity in `src/Mojaz.Domain/Entities/FeeStructure.cs`
- [x] T004 [P] Create `PaymentTransaction` entity in `src/Mojaz.Domain/Entities/PaymentTransaction.cs`
- [x] T005 [P] Create `IPaymentRepository` and `IFeeStructureRepository` in `src/Mojaz.Application/Interfaces/Repositories/`
- [x] T006 Implement EF Core Configurations mapping these entities and add DbSets to `src/Mojaz.Infrastructure/Data/ApplicationDbContext.cs`
- [x] T007 Create EF Core Database Migration for Payment module entities
- [x] T008 Implement `PaymentRepository` and `FeeStructureRepository` in `src/Mojaz.Infrastructure/Repositories/`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Initiate and Complete Payment Successfully (Priority: P1) 🎯 MVP

**Goal**: As an Applicant, I want to initiate a payment at various stages of my application and see a successful confirmation after a brief processing delay, so that I can proceed to the next stage of the workflow.

**Independent Test**: Can be tested by initiating a payment from any gate, waiting for the 2-second processing simulation, and verifying that the payment status is updated to Paid.

### Implementation for User Story 1

- [x] T009 [P] [US1] Create `PaymentInitiateRequest`, `PaymentConfirmRequest`, and `PaymentDto` DTOs in `src/Mojaz.Application/DTOs/Payments/`
- [x] T010 [P] [US1] Create FluentValidators for payment requests in `src/Mojaz.Application/Validators/Payments/`
- [x] T011 [US1] Create `IPaymentService` interface and `PaymentService` class in `src/Mojaz.Application/Services/Payments/` (Interface & Implementation finalized)
- [x] T012 [US1] Implement `InitiatePaymentAsync` in `PaymentService` to fetch fee via `IFeeStructureRepository`, calculate amounts, and create `Pending` `PaymentTransaction`
- [x] T013 [US1] Implement `ConfirmPaymentAsync` in `PaymentService` to update the transaction's `Status` to `Paid` on success
- [x] T014 [US1] Create `PaymentsController` with `[HttpPost("initiate")]` and `[HttpPost("{id}/confirm")]` endpoints mapped to standard `ApiResponse<T>`
- [x] T015 [P] [US1] Implement `frontend/src/services/payment.service.ts` connecting to `/api/v1/payments/initiate` and `confirm`
- [x] T016 [US1] Create `PaymentSimModal.tsx` in `frontend/src/components/domain/payment/` to show pending status, trigger the 2-second delay, and call `confirm` based on UX click

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Handle Payment Failure Simulation (Priority: P1)

**Goal**: As an Applicant, I want to be notified if my payment fails during the simulated processing, so that I can retry or use a different payment method.

**Independent Test**: Can be tested by setting the configurable failure rate to 100% and attempting a payment.

### Implementation for User Story 2

- [x] T017 [US2] Update `ConfirmPaymentAsync` in `PaymentService` to handle `isSuccessful == false` flags, marking transaction as `Failed`
- [x] T018 [US2] Update `PaymentSimModal.tsx` to read simulation config (or simulate random JS-side failure) to pass `isSuccessful: false` to the confirm endpoint
- [x] T019 [US2] Add failure UI state to `PaymentSimModal.tsx` featuring an error alert and a "Retry" button

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Download Payment Receipt (Priority: P2)

**Goal**: As an Applicant, I want to download a PDF receipt for any successful payment, so that I have a record of my transaction.

**Independent Test**: Can be tested by navigating to payment history and downloading the PDF for a paid transaction.

### Implementation for User Story 3

- [x] T020 [P] [US3] Create `IPaymentReceiptGenerator` interface in `src/Mojaz.Application/Interfaces/Infrastructure/`
- [x] T021 [US3] Implement `QuestPdfPaymentReceiptGenerator` in `src/Mojaz.Infrastructure/Documents/` to build branded PDF documents
- [x] T022 [US3] Add `DownloadReceiptAsync` method to `PaymentService` resolving the PDF document byte array
- [x] T023 [US3] Add `[HttpGet("{id}/receipt")]` endpoint to `PaymentsController` returning `FileContentResult` (application/pdf)
- [x] T024 [P] [US3] Add `downloadReceipt` function to `frontend/src/services/payment.service.ts`
- [x] T025 [US3] Create `ReceiptDownloadButton.tsx` component in `frontend/src/components/domain/payment/`
- [x] T026 [US3] Integrate `ReceiptDownloadButton` into the success view of `PaymentSimModal` and within the transaction history list

**Checkpoint**: All core payment functionality including receipts should now work

---

## Phase 6: User Story 4 - View Application Payment History (Priority: P3)

**Goal**: As an Applicant or Administrator, I want to view a list of all payments associated with an application.

**Independent Test**: Can be tested by viewing an applicant's dashboard and checking the payment history section.

### Implementation for User Story 4

- [x] T026 [P] [US4] Create `PaymentHistoryDto` in `src/Mojaz.Application/DTOs/Payments/`
- [x] T027 [US4] Add `GetApplicationPaymentsAsync` in `PaymentService` retrieving transactions chronologically mapped to DTOs
- [x] T028 [US4] Add `[HttpGet("application/{appId}")]` endpoint to `PaymentsController`
- [x] T029 [P] [US4] Add `getPaymentHistory` function to `frontend/src/services/payment.service.ts`
- [x] T030 [US4] Create `PaymentHistoryList.tsx` displaying timeline or table of previous payments in `frontend/src/components/domain/payment/`
- [x] T031 [US4] Integrate `PaymentHistoryList` into the main application detail page in `src/frontend/src/app/[locale]/(protected)/applications/[id]/page.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T032 Enhance `PaymentService` to emit Hangfire background notification upon payment success/failure (Integration with `INotificationService`)
- [x] T033 Verify proper RTL styling with `ms-` / `me-` and right-to-left layout orientations in all Payment components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (US1, US3, US4 can be parallelized if desired, but US1 usually establishes base context for others)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Example: User Story 1

```bash
# Launch models for User Story 1 together:
Task: "Create PaymentInitiateRequest, PaymentConfirmRequest, and PaymentDto DTOs"
Task: "Create FluentValidators for payment requests"
Task: "Implement frontend payment.service.ts connecting to /initiate and confirm endpoints"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Foundation ready
2. Add User Story 1 (Initiate/Confirm UX)
3. Add User Story 2 (Failures logic)
4. Add User Story 3 (Receipts)
5. Add User Story 4 (History View)
