# Feature Specification: 024-license-issuance

**Feature Branch**: `024-license-issuance`
**Created**: 2026-04-06
**Status**: Draft

## Summary

License generation and issuance system. Following final approval, this feature generates a unique license number, calculates expiry based on category, generates a high-quality bilingual PDF using QuestPDF, and provides a download endpoint for the applicant.

## Requirements

### Functional Requirements

- **FR-001**: POST /api/v1/licenses/{appId}/issue — Finalize issuance after approval.
- **FR-002**: Generate a unique License Number using format: `MOJ-{YEAR}-{8 random digits}`.
- **FR-003**: Calculate Expiry Date based on Category:
    - Categories A, B, F: 10 years.
    - Categories C, D, E: 5 years.
    - (Values should be retrieved from `LicenseCategories` config).
- **FR-004**: PDF Generation (QuestPDF):
    - Government-grade design with branding.
    - Bilingual (Arabic and English) layout.
    - Dynamic data: Name, DOB, NationalID, Category, IssueDate, ExpiryDate, LicenseNumber, ApplicantPhoto.
    - Secure QR Code for verification.
- **FR-005**: GET /api/v1/licenses/{id}/download — Securely download the generated PDF.
- **FR-006**: Notification: Notify applicant immediately that their license is ready for download.
- **FR-007**: Store license metadata in the `Licenses` table (tied to the Application and User).

## Success Criteria

- **SC-001**: Unique license number generated in the correct format.
- **SC-002**: Expiry date calculated correctly for all 6 categories.
- **SC-003**: PDF is professional, bilingual, and contains all required data including photo and QR code.
- **SC-004**: Download endpoint works and correctly serves the PDF file.
- **SC-005**: Applicant receives notification upon issuance.
- **SC-006**: Application status updated to `Issued/Completed`.

## Assumptions

- Applicant photo is already uploaded and approved in the Document stage.
- QuestPDF is used for high-performance PDF generation.
- QR code contains a secure verification URL or signed data.
