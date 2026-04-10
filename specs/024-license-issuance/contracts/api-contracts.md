# API Contracts: License Issuance

### 1. Issue License
- **URL**: `/api/v1/licenses/{appId}/issue`
- **Method**: POST
- **Authorization**: Required (Applicant, Receptionist, Admin)
- **Responses**:
  - `201 Created`: `ApiResponse<LicenseDto>`
  - `400 Bad Request`: Returns error if conditions (fee, status, medical, tests) are not met.
  - `409 Conflict`: Returns error if the application already has a license issued (Idempotency).

### 2. Download License PDF
- **URL**: `/api/v1/licenses/{id}/download`
- **Method**: GET
- **Authorization**: Required (Applicant [owner only], Admin)
- **Responses**:
  - `200 OK`: `application/pdf` binary stream.
  - `404 Not Found`: If invalid ID.
  - `403 Forbidden`: If attempting to download someone else's license without Admin rights.
