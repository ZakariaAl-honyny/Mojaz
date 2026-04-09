# API Contracts: 019 — Theory Test Recording

**Base URL**: `/api/v1/theory-tests`
**Authentication**: JWT Bearer (all endpoints)
**Response envelope**: `ApiResponse<T>` (all endpoints)

---

## POST `/api/v1/theory-tests/{appId}/result`

**Authorization**: `Examiner` role only

### Request

```http
POST /api/v1/theory-tests/{appId}/result
Authorization: Bearer {token}
Content-Type: application/json

{
  "score": 85,
  "isAbsent": false,
  "notes": "Clear lane changes, good signal usage. Passed comfortably."
}
```

### Request Schema

| Field | Type | Required | Constraints |
|-------|------|:--------:|-------------|
| `score` | `integer` | Conditional | Required when `isAbsent = false`; integer in [0, 100] |
| `isAbsent` | `boolean` | ✅ | Must be present |
| `notes` | `string` | ❌ | Max 500 characters |

### Absent applicant variant

```json
{
  "isAbsent": true,
  "notes": "Applicant did not show up for scheduled session."
}
```

### Success Response — `201 Created`

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Theory test result recorded successfully.",
  "data": {
    "id": "3f7b9e21-4c2a-4b1d-82f7-1a9d3e5c7f11",
    "applicationId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "attemptNumber": 1,
    "score": 85,
    "passingScore": 80,
    "result": "Pass",
    "isAbsent": false,
    "conductedAt": "2026-04-09T17:00:00Z",
    "examinerId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "notes": "Clear lane changes, good signal usage.",
    "retakeEligibleAfter": null,
    "applicationStatus": "PracticalTest"
  },
  "errors": null
}
```

### Fail Response variant (non-terminal)

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Theory test result recorded successfully.",
  "data": {
    "attemptNumber": 1,
    "score": 60,
    "passingScore": 80,
    "result": "Fail",
    "isAbsent": false,
    "conductedAt": "2026-04-09T17:00:00Z",
    "retakeEligibleAfter": "2026-04-16T17:00:00Z",
    "applicationStatus": "TheoryTest"
  },
  "errors": null
}
```

### Error Responses

| HTTP Status | Condition | Error Message |
|-------------|-----------|---------------|
| `400` | Application not in Theory stage | `"Application is not in the Theory Test stage."` |
| `400` | Already at max attempts | `"Maximum theory test attempts have already been reached."` |
| `400` | Score missing when not absent | `"Score is required when applicant is present."` |
| `400` | Score out of range | `"Score must be between 0 and 100."` |
| `400` | Notes too long | `"Notes cannot exceed 500 characters."` |
| `403` | Non-Examiner role | Standard 403 |
| `404` | Application not found | `"Application not found."` |
| `409` | Concurrent submission | `"A result has already been recorded for this test session."` |

---

## GET `/api/v1/theory-tests/{appId}/history`

**Authorization**: Applicant (own applications only), Examiner, Manager, Admin

### Request

```http
GET /api/v1/theory-tests/{appId}/history?page=1&pageSize=20&sortDir=asc
Authorization: Bearer {token}
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | `integer` | `1` | Page number (1-indexed) |
| `pageSize` | `integer` | `20` | Items per page (max 100) |
| `sortDir` | `string` | `asc` | `asc` or `desc` by `ConductedAt` |

### Success Response — `200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "3f7b9e21-4c2a-4b1d-82f7-1a9d3e5c7f11",
        "applicationId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "attemptNumber": 1,
        "score": 60,
        "passingScore": 80,
        "result": "Fail",
        "isAbsent": false,
        "conductedAt": "2026-04-01T10:00:00Z",
        "examinerId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "examinerName": "Ahmed Al-Rashidi",
        "notes": "Insufficient knowledge of road signs.",
        "retakeEligibleAfter": "2026-04-08T10:00:00Z",
        "applicationStatus": "TheoryTest"
      }
    ],
    "totalCount": 1,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  },
  "errors": null
}
```

### Error Responses

| HTTP Status | Condition | Error Message |
|-------------|-----------|---------------|
| `403` | Applicant accessing another applicant's history | `"You do not have permission to view this application's test history."` |
| `404` | Application not found | `"Application not found."` |

---

## Internal Service Contracts (used by AppointmentBookingValidator)

### `ITheoryService.IsInCoolingPeriodAsync(Guid appId)`

Returns `true` if the last failed/absent theory test was conducted less than `COOLING_PERIOD_DAYS` ago.
Returns `false` if no failed tests exist (first attempt) or cooling period has elapsed.

### `ITheoryService.HasReachedMaxAttemptsAsync(Guid appId)`

Returns `true` if `Application.TheoryAttemptCount >= MAX_THEORY_ATTEMPTS`.
Returns `false` otherwise.

---

## Notification Payloads

### Theory Test Passed

| Channel | Content |
|---------|---------|
| Title (AR) | اجتزت الاختبار النظري بنجاح 🎉 |
| Title (EN) | Theory Test Passed 🎉 |
| Body (AR) | مبروك! حصلت على {score}% وتجاوزت حد النجاح. يمكنك الآن حجز موعد الاختبار العملي. |
| Body (EN) | Congratulations! You scored {score}% and passed the minimum threshold. You may now book your practical test. |
| Channels | In-App + Push + Email + SMS |

### Theory Test Failed (Retake Available)

| Channel | Content |
|---------|---------|
| Title (AR) | لم تجتز الاختبار النظري |
| Title (EN) | Theory Test Not Passed |
| Body (AR) | حصلت على {score}%. يمكنك إعادة الاختبار بعد {retakeDate}. المحاولة {current} من {max}. |
| Body (EN) | You scored {score}%. You may retake after {retakeDate}. Attempt {current} of {max}. |
| Channels | In-App + Push + Email + SMS |

### Theory Test — Final Rejection (Max Attempts)

| Channel | Content |
|---------|---------|
| Title (AR) | تم إغلاق الطلب — استُنفدت جميع المحاولات |
| Title (EN) | Application Closed — All Attempts Exhausted |
| Body (AR) | لقد استنفدت جميع محاولات الاختبار النظري ({max} محاولات). يرجى تقديم طلب جديد. |
| Body (EN) | You have exhausted all theory test attempts ({max} attempts). Please submit a new application. |
| Channels | In-App + Push + Email + SMS |
