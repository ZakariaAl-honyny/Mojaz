# API Contracts: 014-Document Management

**Branch**: `014-document-management` | **Date**: 2026-04-09
**Base URL**: `/api/v1/applications/{applicationId}/documents`

All responses are wrapped in `ApiResponse<T>`. All endpoints require `Authorization: Bearer {jwt}`.

---

## Endpoint 1: Upload Document

```
POST /api/v1/applications/{applicationId}/documents/upload
```

**Auth**: `[Authorize(Roles = "Applicant,Receptionist")]`
**Content-Type**: `multipart/form-data`

### Request (Form fields)

| Field | Type | Required | Constraints |
|-------|------|:--------:|-------------|
| `documentType` | `int` (DocumentType enum) | ✅ | One of: 1–8 |
| `file` | `IFormFile` | ✅ | ≤ 5MB, extension: .pdf/.jpg/.jpeg/.png |

### Response 201 — Success

```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "statusCode": 201,
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "applicationId": "a1b2c3d4-...",
    "documentType": 1,
    "documentTypeName": "IdCopy",
    "originalFileName": "my-id-copy.pdf",
    "fileSizeBytes": 2048000,
    "contentType": "application/pdf",
    "status": 0,
    "statusName": "Pending",
    "rejectionReason": null,
    "reviewedBy": null,
    "reviewedAt": null,
    "createdAt": "2026-04-09T01:00:00Z",
    "downloadUrl": "/api/v1/applications/{id}/documents/{docId}/download"
  },
  "errors": null
}
```

### Response 400 — Validation Failure

```json
{
  "success": false,
  "message": "Validation failed",
  "statusCode": 400,
  "data": null,
  "errors": ["File size exceeds the 5MB limit", "Invalid file type. Only PDF, JPG, PNG allowed."]
}
```

### Response 403 — Ownership Violation

```json
{
  "success": false,
  "message": "You are not authorized to upload documents for this application",
  "statusCode": 403,
  "data": null,
  "errors": null
}
```

### Response 409 — Document Already Exists (Active)

```json
{
  "success": false,
  "message": "An active document of type IdCopy already exists. Delete the existing document first.",
  "statusCode": 409,
  "data": null,
  "errors": null
}
```

> Note: Re-uploading to a rejected card auto-soft-deletes the old record and creates new one (no 409).

---

## Endpoint 2: List Documents

```
GET /api/v1/applications/{applicationId}/documents
```

**Auth**: `[Authorize]` (any authenticated role)

### Response 200

```json
{
  "success": true,
  "message": "Documents retrieved",
  "statusCode": 200,
  "data": [
    {
      "id": "3fa85f64-...",
      "applicationId": "a1b2c3d4-...",
      "documentType": 1,
      "documentTypeName": "IdCopy",
      "originalFileName": "my-id-copy.pdf",
      "fileSizeBytes": 2048000,
      "contentType": "application/pdf",
      "status": 0,
      "statusName": "Pending",
      "rejectionReason": null,
      "reviewedBy": null,
      "reviewedAt": null,
      "createdAt": "2026-04-09T01:00:00Z",
      "downloadUrl": "/api/v1/applications/{id}/documents/{docId}/download"
    }
  ],
  "errors": null
}
```

---

## Endpoint 3: Get Document Requirements

```
GET /api/v1/applications/{applicationId}/documents/requirements
```

**Auth**: `[Authorize]`

### Response 200

```json
{
  "success": true,
  "message": "Document requirements retrieved",
  "statusCode": 200,
  "data": [
    {
      "documentType": 1,
      "documentTypeName": "IdCopy",
      "isRequired": true,
      "isConditional": false,
      "conditionDescription": null,
      "hasUpload": true,
      "status": 0,
      "statusName": "Pending",
      "documentId": "3fa85f64-..."
    },
    {
      "documentType": 6,
      "documentTypeName": "GuardianConsent",
      "isRequired": true,
      "isConditional": true,
      "conditionDescription": "Required because applicant is under 18 years old",
      "hasUpload": false,
      "status": null,
      "statusName": null,
      "documentId": null
    },
    {
      "documentType": 7,
      "documentTypeName": "PreviousLicense",
      "isRequired": false,
      "isConditional": true,
      "conditionDescription": "Not applicable for this application",
      "hasUpload": false,
      "status": null,
      "statusName": null,
      "documentId": null
    }
  ],
  "errors": null
}
```

> Returns ALL 8 document types. `isRequired = false` + `isConditional = true` means condition not met (not shown to user).

---

## Endpoint 4: Review Document (Approve / Reject)

```
PATCH /api/v1/applications/{applicationId}/documents/{documentId}/review
```

**Auth**: `[Authorize(Roles = "Receptionist,Manager,Admin")]`
**Content-Type**: `application/json`

### Request Body

```json
{
  "approved": false,
  "rejectionReason": "The ID copy is blurry and unreadable. Please upload a clearer scan."
}
```

| Field | Type | Required | Constraints |
|-------|------|:--------:|-------------|
| `approved` | `bool` | ✅ | — |
| `rejectionReason` | `string?` | Conditional | Required when `approved = false`. Max 1000 chars. |

### Response 200 — Success

```json
{
  "success": true,
  "message": "Document rejected. Applicant has been notified.",
  "statusCode": 200,
  "data": true,
  "errors": null
}
```

### Response 400 — Missing Rejection Reason

```json
{
  "success": false,
  "message": "Validation failed",
  "statusCode": 400,
  "data": null,
  "errors": ["RejectionReason is required when rejecting a document."]
}
```

---

## Endpoint 5: Bulk Approve All Pending Documents

```
PATCH /api/v1/applications/{applicationId}/documents/bulk-approve
```

**Auth**: `[Authorize(Roles = "Receptionist,Manager,Admin")]`
**Content-Type**: `application/json` (empty body)

### Response 200 — Success

```json
{
  "success": true,
  "message": "3 document(s) approved successfully.",
  "statusCode": 200,
  "data": {
    "approvedCount": 3,
    "approvedDocumentIds": [
      "3fa85f64-...",
      "4bb96e75-...",
      "5cc07f86-..."
    ]
  },
  "errors": null
}
```

### Response 200 — Nothing to Approve

```json
{
  "success": true,
  "message": "No pending documents to approve.",
  "statusCode": 200,
  "data": {
    "approvedCount": 0,
    "approvedDocumentIds": []
  },
  "errors": null
}
```

---

## Endpoint 6: Delete Document (Soft Delete)

```
DELETE /api/v1/applications/{applicationId}/documents/{documentId}
```

**Auth**: `[Authorize(Roles = "Applicant,Receptionist")]`

### Response 200 — Success

```json
{
  "success": true,
  "message": "Document deleted successfully",
  "statusCode": 200,
  "data": true,
  "errors": null
}
```

### Response 403 — Cannot Delete After Submission

```json
{
  "success": false,
  "message": "Documents cannot be deleted after the application has been submitted for review.",
  "statusCode": 403,
  "data": null,
  "errors": null
}
```

---

## Endpoint 7: Download (Secure File Streaming)

```
GET /api/v1/applications/{applicationId}/documents/{documentId}/download
```

**Auth**: `[Authorize]` (ownership validated in service layer)

### Response 200 — Binary File

```
Content-Type: application/pdf  (or image/jpeg, image/png)
Content-Disposition: inline; filename="IdCopy.pdf"
[binary content stream]
```

### Response 403 — Not Authorized

```json
{
  "success": false,
  "message": "You are not authorized to access this document.",
  "statusCode": 403,
  "data": null,
  "errors": null
}
```

### Response 404 — Not Found

```json
{
  "success": false,
  "message": "Document not found.",
  "statusCode": 404,
  "data": null,
  "errors": null
}
```

---

## Controller Summary

```
Route prefix: /api/v1/applications/{applicationId}/documents

POST   /upload                           → UploadAsync
GET    /                                 → GetByApplicationIdAsync
GET    /requirements                     → GetRequirementsAsync
PATCH  /{documentId}/review              → ReviewAsync
PATCH  /bulk-approve                     → BulkApproveAsync
DELETE /{documentId}                     → DeleteAsync
GET    /{documentId}/download            → DownloadAsync
```
