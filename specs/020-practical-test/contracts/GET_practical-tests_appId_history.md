# API Contract: GET /api/v1/practical-tests/{appId}/history

**Feature**: 020 — Practical Test Recording
**Controller**: `PracticalTestsController`
**Action**: `GetHistory`

---

## Endpoint

```
GET /api/v1/practical-tests/{appId}/history
```

## Authentication & Authorization

- **Required**: JWT Bearer token
- **Access rules**:
  - `Applicant` → may only view history for their **own** application (ownership enforced in service)
  - `Examiner` → may view history for any application
  - `Manager` → may view history for any application

---

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `appId` | `Guid` | Yes | ID of the application |

---

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | `int` | `1` | Page number (1-based) |
| `pageSize` | `int` | `20` | Items per page (max 100) |

---

## Responses

### 200 OK

```json
{
  "success": true,
  "message": null,
  "statusCode": 200,
  "data": {
    "items": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "applicationId": "...",
        "attemptNumber": 1,
        "score": 72,
        "passingScore": 80,
        "result": "Fail",
        "isPassed": false,
        "isAbsent": false,
        "requiresAdditionalTraining": true,
        "additionalHoursRequired": 5,
        "vehicleUsed": "Toyota Corolla 2023",
        "conductedAt": "2026-04-02T10:00:00Z",
        "examinerId": "...",
        "examinerName": "Ahmed Al-Harbi",
        "notes": "Struggled with parallel parking.",
        "retakeEligibleAfter": "2026-04-09T10:00:00Z",
        "applicationStatus": "PracticalTest"
      },
      {
        "id": "4fb96g75-...",
        "attemptNumber": 2,
        "score": 88,
        "result": "Pass",
        "isPassed": true,
        "requiresAdditionalTraining": false,
        "additionalHoursRequired": null,
        "retakeEligibleAfter": null,
        "applicationStatus": "Approved"
      }
    ],
    "totalCount": 2,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  },
  "errors": null
}
```

### 200 OK — No Records Yet

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "items": [],
    "totalCount": 0,
    "page": 1,
    "pageSize": 20,
    "totalPages": 0,
    "hasPreviousPage": false,
    "hasNextPage": false
  },
  "errors": null
}
```

### 403 Forbidden — Applicant Accessing Another's Records

```json
{
  "success": false,
  "message": "You do not have permission to view this application's test history.",
  "statusCode": 403,
  "data": null,
  "errors": null
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Application not found.",
  "statusCode": 404,
  "data": null,
  "errors": null
}
```

---

## Business Logic Summary

1. Load application → 404 if missing
2. If `role = Applicant` AND `application.ApplicantId ≠ userId` → 403
3. Query all `PracticalTests` by `ApplicationId` ordered by `ConductedAt ASC`
4. Apply pagination (`page`, `pageSize`)
5. For each failed/absent record, calculate `retakeEligibleAfter = ConductedAt + COOLING_PERIOD_DAYS_PRACTICAL`
6. Return `ApiResponse<PagedResult<PracticalTestDto>>`
