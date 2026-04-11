# API Contracts: 020-practical-test

## Endpoints

### 1. POST /api/v1/practical-tests/{appId}/result

**Description**: Submit a practical test result for an application.

**Authorization**: Examiner role required

**Path Parameters**:
- `appId` (Guid): Application ID

**Request Body**:
```json
{
  "score": 85,
  "isAbsent": false,
  "vehicleUsed": "Toyota Camry 2023",
  "notes": "Excellent driving skills, minor hesitation on lane change"
}
```

**Validation Rules**:
- `score`: integer, 0-100 (required if not isAbsent)
- `isAbsent`: boolean, default false
- `vehicleUsed`: string, max 100 characters (optional)
- `notes`: string, max 500 characters (optional)

**Success Response** (201):
```json
{
  "success": true,
  "message": "Practical test result recorded successfully.",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "applicationId": "550e8400-e29b-41d4-a716-446655440001",
    "attemptNumber": 1,
    "score": 85,
    "passingScore": 80,
    "result": "Pass",
    "isPassed": true,
    "isAbsent": false,
    "conductedAt": "2026-04-09T10:30:00Z",
    "examinerId": "550e8400-e29b-41d4-a716-446655440099",
    "examinerName": "أحمد examiner",
    "vehicleUsed": "Toyota Camry 2023",
    "notes": "Excellent driving skills",
    "retakeEligibleAfter": null,
    "applicationStatus": "Approved"
  },
  "statusCode": 201
}
```

**Error Responses**:
- 400: Application not in PracticalTest stage
- 400: Maximum attempts reached
- 400: Validation error (invalid score, missing required fields)
- 403: User not authorized (not Examiner)
- 404: Application not found

---

### 2. GET /api/v1/practical-tests/{appId}/history

**Description**: Retrieve paginated history of practical test attempts for an application.

**Authorization**: Applicant (owner), Examiner, Manager

**Path Parameters**:
- `appId` (Guid): Application ID

**Query Parameters**:
- `page` (int, default: 1)
- `pageSize` (int, default: 20, max: 100)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "applicationId": "550e8400-e29b-41d4-a716-446655440001",
        "attemptNumber": 1,
        "score": 65,
        "passingScore": 80,
        "result": "Fail",
        "isPassed": false,
        "isAbsent": false,
        "conductedAt": "2026-04-02T10:00:00Z",
        "examinerId": "550e8400-e29b-41d4-a716-446655440099",
        "examinerName": "أحمد examiner",
        "vehicleUsed": "Toyota Camry 2023",
        "notes": "Needs improvement on parallel parking",
        "retakeEligibleAfter": "2026-04-09T10:00:00Z",
        "applicationStatus": "PracticalTest"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "applicationId": "550e8400-e29b-41d4-a716-446655440001",
        "attemptNumber": 2,
        "score": 85,
        "passingScore": 80,
        "result": "Pass",
        "isPassed": true,
        "isAbsent": false,
        "conductedAt": "2026-04-09T10:00:00Z",
        "examinerId": "550e8400-e29b-41d4-a716-446655440098",
        "examinerName": "سارة examiner",
        "vehicleUsed": "Honda Civic 2022",
        "notes": "Great control and awareness",
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
  "statusCode": 200
}
```

**Error Responses**:
- 403: Forbidden (Applicant trying to view another applicant's history)
- 404: Application not found

---

## Integration with Booking System

The practical test recording system integrates with the appointment booking system:

### Booking Validation Request
When applicant tries to book `AppointmentType.PracticalTest`:

```
AppointmentBookingValidator.ValidateBookingAsync():
  1. Check MAX_PRACTICAL_ATTEMPTS - if reached, block with "Maximum attempts reached"
  2. Check cooling period - if within COOLING_PERIOD_DAYS_PRACTICAL, block with eligible date
  3. If both pass, allow booking
```

---

## Notification Events

| Event | Recipient | Channels | Message |
|-------|-----------|----------|---------|
| PracticalTest Passed | Applicant | InApp, Push, Email, SMS | Congratulations! You passed the practical test. Your application is now pending license issuance. |
| PracticalTest Failed (retake available) | Applicant | InApp, Push, Email, SMS | You did not pass the practical test. You may retake after {eligibleDate}. Attempts: {count}/{max} |
| PracticalTest Failed (final) | Applicant | InApp, Push, Email, SMS | Unfortunately, you have exhausted all practical test attempts. Your application has been rejected. Please submit a new application if you wish to try again. |