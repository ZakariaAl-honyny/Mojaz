# Feature Specification: Multi-Point Payment Simulation

**Feature Branch**: `024-payment-simulation`  
**Created**: 2026-04-10  
**Status**: Draft  
**Input**: User description: "Payment simulation with 6 payment points, fees from FeeStructures, simulated processing, transaction reference, receipt PDF, payment history, and endpoints."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Initiate and Complete Payment Successfully (Priority: P1)

As an Applicant, I want to initiate a payment at various stages of my application and see a successful confirmation after a brief processing delay, so that I can proceed to the next stage of the workflow.

**Why this priority**: Required for applicants to advance through each of the gated stages in the system.

**Independent Test**: Can be tested by initiating a payment from any gate, waiting for the 2-second processing simulation, and verifying that the payment status is updated to Paid.

**Acceptance Scenarios**:

1. **Given** I am an applicant at a payment gate (e.g., Application Submission), **When** I initiate the payment, **Then** the system calculates the fee from `FeeStructures` and displays a loading spinner for 2 seconds.
2. **Given** the simulated processing is complete, **When** no forced failure is configured, **Then** the payment is marked as "Paid" and a transaction reference is generated.

---

### User Story 2 - Handle Payment Failure Simulation (Priority: P1)

As an Applicant, I want to be notified if my payment fails during the simulated processing, so that I can retry or use a different payment method.

**Why this priority**: It is crucial for error handling and testing the system's robustness against payment gateway failures.

**Independent Test**: Can be tested by setting the configurable failure rate to 100% and attempting a payment.

**Acceptance Scenarios**:

1. **Given** a simulated payment process is underway, **When** the random failure check hits the configured failure rate, **Then** the payment is marked as "Failed".
2. **Given** a failed payment, **When** I am returned to the payment screen, **Then** I see an error message and have the option to retry the payment.

---

### User Story 3 - Download Payment Receipt (Priority: P2)

As an Applicant, I want to download a PDF receipt for any successful payment, so that I have a record of my transaction.

**Why this priority**: Provides proof of payment which is a standard requirement for government services.

**Independent Test**: Can be tested by navigating to payment history and downloading the PDF for a paid transaction.

**Acceptance Scenarios**:

1. **Given** I have a successful payment, **When** I click "Download Receipt", **Then** the system generates and downloads a branded PDF containing the transaction reference, fee type, amount, date, applicant details, and a QR code.

---

### User Story 4 - View Application Payment History (Priority: P3)

As an Applicant or Administrator, I want to view a list of all payments associated with an application, so that I can track the financial status of the application.

**Why this priority**: Necessary for auditing and transparency.

**Independent Test**: Can be tested by viewing an applicant's dashboard and checking the payment history section.

**Acceptance Scenarios**:

1. **Given** an application with multiple payment attempts, **When** I view the payment history, **Then** I see a chronologically ordered list of all attempted, failed, and successful payments with their amounts and transaction references.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support 6 distinct payment points in the workflow:
    1. File Opening Fee (at Application Submission)
    2. Medical Exam Fee (before Medical Exam booking)
    3. Theory Test Fee (before Theory Test booking)
    4. Practical Test Fee (before Practical Test booking)
    5. Retake Fee (before booking a retake test)
    6. Issuance Fee (before License Issuance)
- **FR-002**: System MUST retrieve all fee amounts dynamically from the `FeeStructures` table based on the requested fee type and license category. Fees MUST NEVER be hardcoded.
- **FR-003**: System MUST simulate payment processing by introducing a 2-second delay during execution.
- **FR-004**: System MUST support a configurable failure rate for testing purposes (e.g., via `appsettings.json` or query parameters).
- **FR-005**: System MUST log all payment attempts representing transactions, generating a unique transaction reference number, recording amount, date, and status (Pending, Paid, Failed).
- **FR-006**: System MUST generate a downloadable receipt as a PDF (using QuestPDF) for successful transactions, including branding, transaction details, and a QR code.
- **FR-007**: System MUST provide an endpoint to list the payment history for a specific application.
- **FR-008**: System MUST send notifications (e.g., email/SMS/Push) upon successful payment or failure.

### Key Entities

- **PaymentTransaction**: Represents a specific payment attempt. It includes fields for `ApplicationId`, `FeeType`, `Amount`, `Status` (Pending, Paid, Failed), `TransactionReference`, and `CreatedAt`/`UpdatedAt`.
- **FeeStructure**: Represents the configurable fee amounts. Contains fields for `FeeType`, `LicenseCategory`, `Amount`, `EffectiveFrom`, and `EffectiveTo`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 6 required payment points successfully block and unblock their respective workflow stages.
- **SC-002**: 100% of fee amounts are fetched from the database, with 0 hardcoded values in the codebase.
- **SC-003**: Payment simulation reliably completes within 2 to 2.5 seconds.
- **SC-004**: System successfully generates a valid, branded PDF receipt for any successful transaction.
- **SC-005**: Payment history accurately lists all transactions for an application, displaying correct statuses and amounts.

## Assumptions

- "Simulation" means that the system does not integrate with a real banking or payment gateway (e.g., Sadad, Moyasar). Any payment attempt acts as a mock transaction.
- The failure rate is solely for testing the application's failure handling and will be set to 0% in a production-like environment for normal operations unless explicitly testing edge cases.
- Valid License categories include A, B, C, D, E, F as defined in the PRD.
- QuestPDF is the established library for PDF generation in this project.
