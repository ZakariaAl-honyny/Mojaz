# API Contract: POST /api/v1/practical-tests/{appId}/result

**Feature**: 020 — Practical Test Recording
**Controller**: `PracticalTestsController`
**Action**: `SubmitResult`

---

## Endpoint

```
POST /api/v1/practical-tests/{appId}/result
```

## Authentication & Authorization

- **Required**: JWT Bearer token
- **Roles**: `Examiner` only
- **Scope**: Any application in `PracticalTest` stage (examiner does NOT need to be assigned to that application in MVP)

---

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `appId` | `Guid` | Yes | ID of the application to record the result for |

---

## Request Body

**Content-Type**: `application/json`

```json
{
  "score": 85,
  "isAbsent": false,
  "requiresAdditionalTraining": false,
  "additionalHoursRequired": null,
  "vehicleUsed": "Toyota Corolla 2023",
  "notes": "Applicant demonstrated confident lane-changing."
}
```

| Field | Type | Required | Validation Rules |
|-------|------|----------|-----------------|
| `score` | `int?` | Conditional | Required when `isAbsent = false`; range 0–100 |
| `isAbsent` | `bool` | No | Defaults to `false`; when `true`, score must be null |
| `requiresAdditionalTraining` | `bool` | No | Defaults to `false`; only meaningful when result is Fail |
| `additionalHoursRequired` | `int?` | Conditional | Required when `requiresAdditionalTraining = true`; must be > 0 |
| `vehicleUsed` | `string?` | No | Max 200 chars; free-text in v1 |
| `notes` | `string?` | No | Max 1000 chars |

---

## Responses

### 201 Created — Pass

```json
{
  "success": true,
  "message": "Practical test result recorded successfully.",
  "statusCode": 201,
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "applicationId": "...",
    "attemptNumber": 1,
    "score": 85,
    "passingScore": 80,
    "result": "Pass",
    "isPassed": true,
    "isAbsent": false,
    "requiresAdditionalTraining": false,
    "additionalHoursRequired": null,
    "vehicleUsed": "Toyota Corolla 2023",
    "conductedAt": "2026-04-09T19:00:00Z",
    "examinerId": "...",
    "examinerName": "Ahmed Al-Harbi",
    "notes": "Applicant demonstrated confident lane-changing.",
    "retakeEligibleAfter": null,
    "applicationStatus": "Approved"
  },
  "errors": null
}
```

### 201 Created — Fail (non-terminal, with additional training)

```json
{
  "success": true,
  "message": "Practical test result recorded successfully.",
  "statusCode": 201,
  "data": {
    "result": "Fail",
    "isPassed": false,
    "requiresAdditionalTraining": true,
    "additionalHoursRequired": 5,
    "retakeEligibleAfter": "2026-04-16T19:00:00Z",
    "applicationStatus": "PracticalTest"
  }
}
```

### 201 Created — Final Rejection

```json
{
  "success": true,
  "message": "Practical test result recorded successfully.",
  "statusCode": 201,
  "data": {
    "result": "Fail",
    "isPassed": false,
    "retakeEligibleAfter": null,
    "applicationStatus": "Rejected"
  }
}
```

### 400 Bad Request — Validation Failure

```json
{
  "success": false,
  "message": "Validation failed.",
  "statusCode": 400,
  "data": null,
  "errors": [
    "Score is required when the applicant is not absent.",
    "AdditionalHoursRequired must be greater than 0 when RequiresAdditionalTraining is true."
  ]
}
```

### 400 Bad Request — Wrong Stage

```json
{
  "success": false,
  "message": "Application is not in the Practical Test stage.",
  "statusCode": 400,
  "data": null,
  "errors": null
}
```

### 400 Bad Request — Max Attempts Already Reached

```json
{
  "success": false,
  "message": "Maximum practical test attempts have already been reached.",
  "statusCode": 400,
  "data": null,
  "errors": null
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized.",
  "statusCode": 401,
  "data": null,
  "errors": null
}
```

### 403 Forbidden — Wrong Role

```json
{
  "success": false,
  "message": "Access denied. Examiner role required.",
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
2. Check `CurrentStage == "07: Practical"` → 400 if not
3. Check `PracticalAttemptCount < MAX_PRACTICAL_ATTEMPTS` → 400 if at limit
4. Read `MIN_PASS_SCORE_PRACTICAL` from SystemSettings
5. Determine `TestResult`: Absent → `Absent`; Score ≥ passing → `Pass`; else → `Fail`
6. Increment `Application.PracticalAttemptCount`
7. If `requiresAdditionalTraining = true` → set `Application.AdditionalTrainingRequired = true`
8. Create `PracticalTest` record
9. Transition application status:
   - Pass → `Status = Approved`, `CurrentStage = "08: FinalApproval"`
   - Fail terminal → `Status = Rejected`, `RejectionReason = "MaxPracticalAttemptsReached"`, clear `AdditionalTrainingRequired`
   - Fail non-terminal → status unchanged
10. Save via Unit of Work
11. Write AuditLog
12. Dispatch notifications (In-App sync; Push/Email/SMS async via Hangfire)
13. Return 201 with `PracticalTestDto`
