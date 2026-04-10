# Implementation Plan: 024-license-issuance

**Feature Branch**: `024-license-issuance`
**Status**: Draft

## Architecture Overview

Implementation of the license finalization and PDF generation system. This feature follows the final approval and payment of the issuance fee, resulting in a signed digital driving license.

### Tech Stack
- **Backend**: .NET 8, EF Core 8.
- **PDF Generation**: QuestPDF.
- **Persistence**: `Licenses`, `Applications`, `Users`.

## Functional Breakdown

### 1. License metadata & Generation (Backend)
- **Logic**:
    1. Verify current `Application` has `FinalApproved` status and `IssuanceFee` is `Paid`.
    2. Generate License Number: `MOJ-{YEAR}-{8 random digits}`.
    3. Calculate `ExpiryDate` using `ValidityYears` from the `LicenseCategory` record.
    4. Store metadata in the `Licenses` table (tied to `User` and `Application`).
- **Endpoint**: `POST /api/v1/licenses/{appId}/issue`

### 2. Digital License PDF (QuestPDF)
- **Library**: QuestPDF.
- **Design**:
    - **Header**: Mojaz Logo + Ministry Information.
    - **Body**: 
        - Applicant Name (Bilingual).
        - National ID / Date of Birth.
        - License Category (A, B, C, D, E, F).
        - Issue Date & Expiry Date.
        - **Photo**: Embedded from approved document storage.
        - **QR Code**: Verification link with signed payload.
- **Endpoint**: `GET /api/v1/licenses/{id}/download`

### 3. Applicant Notification & Access
- Trigger `INotificationService` (SMS, Email, Push) with the confirmation: "Your license is ready! Download it here."
- **Dashboard**: "My License" card appearing on the main portal for issued applicants.

## Phases of Implementation

### Phase 1: Persistence & Configuration
1. Add `License` entity with format verification logic.
2. Update the `LicenseCategory` settings with correct `ValidityYears`.

### Phase 2: Issuance Logic & API
1. Implement `ILicenseService` and `LicenseService`.
2. Build the "Issue" logic (Auto-status update to `Issued`).
3. Create `POST /licenses/{appId}/issue`.

### Phase 3: PDF Template & Generation
1. Build the QuestPDF template for the bilingual license card.
2. Integrate QR code generation (using a library like `NetBarcode` or `QRCoder`).
3. Add the `GET /download` endpoint with secure stream serving.

### Phase 4: Verification
1. Unit tests for License Number format and Expiry calculation.
2. Integration tests for "Gate" check completion before issuance.
3. Verify PDF visual layout, bilingual support, and photo embedding.

## Risks & Mitigations
- **ID Collisions**: Ensure the 8-digit random part of the license number is checked for uniqueness in the database.
- **Slow PDF Generation**: QuestPDF is highly efficient; if load is extreme, move generation to a background task and store the file in blob storage.
- **Security Bypass**: Ensure only the `User` owner or an `Admin`/`Manager` can download the certificate.
