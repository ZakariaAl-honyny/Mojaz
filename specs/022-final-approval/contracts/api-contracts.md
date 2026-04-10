# API Contracts: 022 — Final Approval with Gate 4 Validation

**Branch**: `022-final-approval` | **Phase**: 1 — Design | **Date**: 2026-04-10

All endpoints return `ApiResponse<T>`. Authentication via `Bearer {JWT}` is required on every endpoint.

---

## Endpoint 1: Get Gate 4 Validation Status

**GET** `/api/v1/applications/{id}/gate4`

**Authorization**: `[Authorize(Roles = "Manager,Admin")]`

**Purpose**: Returns the live Gate 4 checklist status for an application. No side effects — read-only.

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `id` | `GUID` | ✅ | Application ID |

### Responses

#### 200 OK — All conditions evaluated

```json
{
  "success": true,
  "message": "Gate 4 validation status retrieved.",
  "statusCode": 200,
  "data": {
    "applicationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "isFullyPassed": false,
    "conditions": [
      {
        "key": "TheoryTestPassed",
        "labelAr": "اختبار النظري",
        "labelEn": "Theory Test",
        "isPassed": true,
        "failureMessageAr": null,
        "failureMessageEn": null
      },
      {
        "key": "PracticalTestPassed",
        "labelAr": "الاختبار العملي",
        "labelEn": "Practical Test",
        "isPassed": true,
        "failureMessageAr": null,
        "failureMessageEn": null
      },
      {
        "key": "SecurityStatusClean",
        "labelAr": "الوضع الأمني",
        "labelEn": "Security Status",
        "isPassed": true,
        "failureMessageAr": null,
        "failureMessageEn": null
      },
      {
        "key": "IdentityDocumentValid",
        "labelAr": "صلاحية وثيقة الهوية",
        "labelEn": "Identity Document Validity",
        "isPassed": false,
        "failureMessageAr": "وثيقة الهوية منتهية الصلاحية أو مفقودة.",
        "failureMessageEn": "Identity document is expired or missing."
      },
      {
        "key": "MedicalCertificateValid",
        "labelAr": "صلاحية الشهادة الطبية",
        "labelEn": "Medical Certificate Validity",
        "isPassed": true,
        "failureMessageAr": null,
        "failureMessageEn": null
      },
      {
        "key": "AllPaymentsCleared",
        "labelAr": "سداد جميع الرسوم",
        "labelEn": "All Payments Cleared",
        "isPassed": true,
        "failureMessageAr": null,
        "failureMessageEn": null
      }
    ]
  },
  "errors": null
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Application not found.",
  "statusCode": 404,
  "data": null,
  "errors": null
}
```

#### 403 Forbidden

```json
{
  "success": false,
  "message": "Access denied. Manager role required.",
  "statusCode": 403,
  "data": null,
  "errors": null
}
```

---

## Endpoint 2: Record Final Decision

**POST** `/api/v1/applications/{id}/finalize`

**Authorization**: `[Authorize(Roles = "Manager")]`

**Purpose**: Records the Manager's final approval decision (Approve, Reject, or Return). Enforces Gate 4 server-side before accepting an Approve decision.

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `id` | `GUID` | ✅ | Application ID |

### Request Body

```json
{
  "decision": "Approve",
  "reason": null,
  "returnToStage": null,
  "managerNotes": "All documentation verified. Approved for license issuance."
}
```

| Field | Type | Required | Constraints |
|-------|------|:--------:|------------|
| `decision` | `string` | ✅ | One of: `"Approve"`, `"Reject"`, `"Return"` |
| `reason` | `string?` | Conditional | Required when decision = `"Reject"` or `"Return"`. Max 1000 chars. |
| `returnToStage` | `string?` | Conditional | Required when decision = `"Return"`. One of: `"02-Documents"`, `"04-Medical"`, `"06-Theory"`, `"07-Practical"` |
| `managerNotes` | `string?` | ❌ | Optional. Max 1000 chars. |

**Example — Reject request**:

```json
{
  "decision": "Reject",
  "reason": "Applicant has an active security block preventing license issuance.",
  "returnToStage": null,
  "managerNotes": null
}
```

**Example — Return request**:

```json
{
  "decision": "Return",
  "reason": "Medical certificate has expired. Please provide a new examination.",
  "returnToStage": "04-Medical",
  "managerNotes": null
}
```

### Responses

#### 200 OK — Decision recorded successfully

```json
{
  "success": true,
  "message": "Application approved successfully.",
  "statusCode": 200,
  "data": {
    "applicationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "applicationNumber": "MOJ-2026-48291037",
    "newStatus": "Payment",
    "decision": "Approved",
    "decisionAt": "2026-04-10T07:15:30Z",
    "decisionBy": "أحمد المدير",
    "gate4Result": {
      "applicationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "isFullyPassed": true,
      "conditions": [ /* ... all 6 conditions with isPassed: true */ ]
    }
  },
  "errors": null
}
```

#### 400 Bad Request — Gate 4 failed (Approve attempted with failing conditions)

```json
{
  "success": false,
  "message": "Gate 4 validation failed. Application cannot be approved.",
  "statusCode": 400,
  "data": null,
  "errors": [
    "Theory Test has not been passed.",
    "Medical certificate has expired."
  ]
}
```

#### 400 Bad Request — Validation error (missing reason / invalid return stage)

```json
{
  "success": false,
  "message": "Validation failed.",
  "statusCode": 400,
  "data": null,
  "errors": [
    "A reason is required when rejecting an application.",
    "Return stage must be one of: 02-Documents, 04-Medical, 06-Theory, 07-Practical."
  ]
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Application not found.",
  "statusCode": 404,
  "data": null,
  "errors": null
}
```

#### 403 Forbidden

```json
{
  "success": false,
  "message": "Access denied. Manager role required.",
  "statusCode": 403,
  "data": null,
  "errors": null
}
```

#### 409 Conflict — Application already finalized

```json
{
  "success": false,
  "message": "This application has already been finalized.",
  "statusCode": 409,
  "data": null,
  "errors": null
}
```

---

## FluentValidation Rules

### `FinalizeApplicationRequestValidator`

| Rule | Condition |
|------|-----------|
| `Decision` must be a valid `FinalDecisionType` | Always |
| `Reason` must not be empty, max 1000 chars | When `Decision == Rejected \|\| Decision == Returned` |
| `ReturnToStage` must not be empty | When `Decision == Returned` |
| `ReturnToStage` must be one of the 4 allowed stage keys | When `Decision == Returned` |
| `ManagerNotes` max 1000 chars | When provided |
