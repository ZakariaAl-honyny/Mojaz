# API Contracts: Application CRUD & Status Tracking (Feature 012)

**Base URL**: `/api/v1/applications`  
**Auth**: All endpoints require `Authorization: Bearer <token>` unless noted.  
**Response format**: All responses wrapped in `ApiResponse<T>`.

---

## POST /api/v1/applications
**Create a new application (starts as Draft if using wizard; can go directly to Submitted if all fields provided)**

**Roles**: `Applicant`, `Receptionist`

**Request Body**:
```json
{
  "serviceType": "NewLicenseIssuance",
  "licenseCategoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nationalId": "1234567890",
  "dateOfBirth": "1998-05-15",
  "gender": "Male",
  "nationality": "Saudi",
  "address": "King Fahd Road",
  "city": "Riyadh",
  "region": "Riyadh Region",
  "applicantType": "Citizen",
  "branchId": null,
  "preferredLanguage": "ar",
  "specialNeeds": false,
  "dataAccuracyConfirmed": false
}
```

**Success Response** `201 Created`:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Application created successfully.",
  "data": {
    "id": "uuid",
    "applicationNumber": "MOJ-2026-48291037",
    "status": "Draft",
    "serviceType": "NewLicenseIssuance",
    "licenseCategoryId": "uuid",
    "licenseCategoryCode": "B",
    "licenseCategoryNameAr": "سيارة خاصة",
    "licenseCategoryNameEn": "Private Car",
    "expiresAt": "2026-10-08T11:00:00Z",
    "createdAt": "2026-04-08T11:00:00Z"
  }
}
```

**Error Responses**:
- `400` — Gate 1 violation (underage, active application exists, security block)
- `401` — Not authenticated
- `403` — Not an Applicant or Receptionist

---

## GET /api/v1/applications
**List applications (role-scoped and filterable)**

**Roles**: All authenticated roles

**Query Parameters**:
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `status` | string | Filter by `ApplicationStatus` | — |
| `currentStage` | string | Filter by stage name | — |
| `serviceType` | string | Filter by service type | — |
| `licenseCategoryId` | guid | Filter by category | — |
| `branchId` | guid | Filter by branch | — |
| `search` | string | Search by application number or applicant name | — |
| `from` | datetime | Created date range start | — |
| `to` | datetime | Created date range end | — |
| `sortBy` | string | Sort field | `createdAt` |
| `sortDir` | string | `asc` or `desc` | `desc` |
| `page` | int | Page number | `1` |
| `pageSize` | int | Results per page (max 100) | `20` |

**Success Response** `200 OK`:
```json
{
  "success": true,
  "statusCode": 200,
  "message": null,
  "data": {
    "items": [
      {
        "id": "uuid",
        "applicationNumber": "MOJ-2026-48291037",
        "serviceType": "NewLicenseIssuance",
        "licenseCategoryNameAr": "سيارة خاصة",
        "licenseCategoryNameEn": "Private Car",
        "status": "Submitted",
        "currentStage": "DocumentReview",
        "applicantName": "Ahmed Al-Harbi",
        "createdAt": "2026-04-08T11:00:00Z"
      }
    ],
    "totalCount": 45,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3,
    "hasPreviousPage": false,
    "hasNextPage": true
  }
}
```

---

## GET /api/v1/applications/{id}
**Get a single application with full details**

**Roles**: All authenticated roles (Applicant: own only; others: per stage scope)

**Success Response** `200 OK`: Full `ApplicationDto`

**Error Responses**:
- `403` — Applicant accessing another applicant's record
- `404` — Not found

---

## PUT /api/v1/applications/{id}/draft
**Update a draft application (partial update allowed; all fields optional)**

**Roles**: `Applicant`

**Request Body**:
```json
{
  "serviceType": "NewLicenseIssuance",
  "licenseCategoryId": "uuid",
  "branchId": null,
  "preferredLanguage": "ar",
  "specialNeeds": false
}
```

**Success Response** `200 OK`:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Draft updated.",
  "data": { /* full ApplicationDto */ }
}
```

**Error Responses**:
- `400` — Application not in Draft status
- `403` — Not the owner

---

## PATCH /api/v1/applications/{id}/submit
**Submit a draft application — triggers Gate 1 + full FluentValidation**

**Roles**: `Applicant`, `Receptionist`

**Request Body**:
```json
{
  "dataAccuracyConfirmed": true
}
```

**Success Response** `200 OK`:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Application submitted successfully.",
  "data": { /* full ApplicationDto with Status=Submitted */ }
}
```

**Error Responses**:
- `400` — Validation failure (list of missing required fields)
- `400` — Gate 1 violation
- `403` — Not authorized to submit this application

---

## PATCH /api/v1/applications/{id}/cancel
**Cancel an application with a mandatory reason**

**Roles**: `Applicant` (own only), `Receptionist`, `Manager`

**Request Body**:
```json
{
  "reason": "Changed my mind / تغير رأيي"
}
```

**Success Response** `200 OK`:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Application cancelled.",
  "data": true
}
```

**Error Responses**:
- `400` — Application already in terminal state (Cancelled, Expired, Issued, Active, Rejected)
- `403` — Applicant trying to cancel another applicant's application

---

## PATCH /api/v1/applications/{id}/status
**Update application status in the workflow (employee action)**

**Roles**: `Receptionist`, `Doctor`, `Examiner`, `Manager`, `Admin`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | ApplicationStatus | ✅ | New status |
| `reason` | string | ❌ | Required when rejecting |

**Success Response** `200 OK`:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Status updated.",
  "data": true
}
```

---

## GET /api/v1/applications/{id}/timeline
**Retrieve the full status history of an application in chronological order**

**Roles**: All authenticated roles (Applicant: own only)

**Success Response** `200 OK`:
```json
{
  "success": true,
  "statusCode": 200,
  "message": null,
  "data": [
    {
      "id": "uuid",
      "fromStatus": "Draft",
      "toStatus": "Submitted",
      "notes": null,
      "changedByUserId": "uuid",
      "changedByName": "Ahmed Al-Harbi",
      "changedAt": "2026-04-08T09:15:00Z"
    },
    {
      "id": "uuid",
      "fromStatus": "Submitted",
      "toStatus": "DocumentReview",
      "notes": "Documents verified",
      "changedByUserId": "uuid",
      "changedByName": "Sara Al-Qahtani (Receptionist)",
      "changedAt": "2026-04-08T10:30:00Z"
    }
  ]
}
```

---

## GET /api/v1/applications/eligibility
**Pre-creation Gate 1 eligibility check**

**Roles**: `Applicant`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `licenseCategoryId` | guid | ✅ | Category to check eligibility for |

**Success Response** `200 OK`:
```json
{
  "success": true,
  "statusCode": 200,
  "message": null,
  "data": {
    "isEligible": false,
    "reasons": [
      "Minimum age for Category B is 18. Your age is 16.",
      "You already have an active application (MOJ-2026-12345678)."
    ]
  }
}
```

---

## Common Error Shapes

```json
// 400 Bad Request — Validation failure
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed.",
  "errors": [
    "National ID is required.",
    "Data accuracy declaration must be confirmed."
  ]
}

// 403 Forbidden — Ownership violation
{
  "success": false,
  "statusCode": 403,
  "message": "Unauthorized access.",
  "errors": null
}

// 404 Not Found
{
  "success": false,
  "statusCode": 404,
  "message": "Application not found.",
  "errors": null
}
```
