# API Contracts: Training Records (018)

All endpoints return `ApiResponse<T>`. All are under `/api/v1/training-records`.

---

## `POST /api/v1/training-records`

Records training hours for an application. **Role**: Receptionist, Employee.

### Request Body (`CreateTrainingRecordRequest`)
```json
{
  "applicationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "schoolName": "Riyadh Elite Driving Academy",
  "certificateNumber": "CERT-2025-00123",
  "hoursCompleted": 15,
  "trainingDate": "2026-04-08T00:00:00Z",
  "trainerName": "محمد العلي",
  "centerName": "مركز الرياض للقيادة",
  "notes": "Applicant completed first phase of training"
}
```

### Success Response (`ApiResponse<TrainingRecordDto>`) — 201 Created
```json
{
  "success": true,
  "message": "Training record created successfully.",
  "data": {
    "id": "guid",
    "applicationId": "guid",
    "schoolName": "Riyadh Elite Driving Academy",
    "completedHours": 15,
    "totalHoursRequired": 30,
    "progressPercentage": 50,
    "status": "InProgress",
    "isExempted": false,
    "createdAt": "2026-04-09T14:00:00Z"
  },
  "errors": null,
  "statusCode": 201
}
```

### Error — Application Not in Training Stage — 400 Bad Request
```json
{
  "success": false,
  "message": "Application is not in a training-eligible stage.",
  "data": null,
  "errors": ["Application current status does not allow training entry."],
  "statusCode": 400
}
```

---

## `GET /api/v1/training-records/{applicationId}`

Retrieves the full training record. **Roles**: Employee, Manager, Applicant (own only).

### Success Response (`ApiResponse<TrainingRecordDto>`) — 200 OK
```json
{
  "success": true,
  "data": {
    "id": "guid",
    "applicationId": "guid",
    "schoolName": "Riyadh Elite Driving Academy",
    "certificateNumber": "CERT-2025-00123",
    "completedHours": 30,
    "totalHoursRequired": 30,
    "progressPercentage": 100,
    "trainingDate": "2026-04-08T00:00:00Z",
    "trainerName": "محمد العلي",
    "centerName": "مركز الرياض للقيادة",
    "status": "Completed",
    "isExempted": false,
    "exemptionReason": null,
    "exemptionApprovedByName": null,
    "exemptionApprovedAt": null,
    "exemptionRejectionReason": null,
    "createdAt": "2026-04-07T10:00:00Z",
    "updatedAt": "2026-04-09T09:30:00Z"
  },
  "statusCode": 200
}
```

---

## `PATCH /api/v1/training-records/{id}/hours`

Adds more hours to an existing record (additive). **Role**: Receptionist, Employee.

### Request Body (`UpdateTrainingHoursRequest`)
```json
{
  "additionalHours": 10,
  "notes": "Completed second training batch"
}
```

### Success Response — 200 OK
```json
{
  "success": true,
  "message": "Training hours updated. Status: Completed.",
  "data": {
    "id": "guid",
    "completedHours": 30,
    "totalHoursRequired": 30,
    "progressPercentage": 100,
    "status": "Completed"
  },
  "statusCode": 200
}
```

---

## `POST /api/v1/training-records/exemption`

Submits an exemption request. **Role**: Receptionist, Employee.

### Request Body (`CreateExemptionRequest`)
```json
{
  "applicationId": "guid",
  "exemptionReason": "Applicant holds a valid international driving license from Germany, equivalent to Category B.",
  "exemptionDocumentId": "guid"
}
```

### Success Response — 201 Created
```json
{
  "success": true,
  "message": "Exemption request submitted. Pending manager review.",
  "data": {
    "id": "guid",
    "applicationId": "guid",
    "status": "Required",
    "isExempted": false,
    "exemptionReason": "Applicant holds a valid international driving license from Germany...",
    "exemptionApprovedByName": null
  },
  "statusCode": 201
}
```

### Error — Duplicate Exemption — 409 Conflict
```json
{
  "success": false,
  "message": "An active exemption request already exists for this application.",
  "errors": ["Duplicate exemption"],
  "statusCode": 409
}
```

---

## `PATCH /api/v1/training-records/exemption/{id}/approve`

Manager approves the exemption. **Role**: Manager only.

### Request Body (empty or `{}`)
```json
{}
```

### Success Response — 200 OK
```json
{
  "success": true,
  "message": "Training exemption approved. Applicant may proceed to testing.",
  "data": {
    "id": "guid",
    "status": "Exempted",
    "isExempted": true,
    "exemptionApprovedByName": "Manager Ali",
    "exemptionApprovedAt": "2026-04-09T14:15:00Z"
  },
  "statusCode": 200
}
```

### Error — Forbidden — 403
```json
{
  "success": false,
  "message": "Only Manager role can approve training exemptions.",
  "statusCode": 403
}
```

---

## `PATCH /api/v1/training-records/exemption/{id}/reject`

Manager rejects the exemption. **Role**: Manager only.

### Request Body (`ExemptionActionRequest`)
```json
{
  "rejectionReason": "Supporting document does not meet regulatory requirements for exemption."
}
```

### Success Response — 200 OK
```json
{
  "success": true,
  "message": "Exemption rejected. Applicant must complete training hours.",
  "data": {
    "id": "guid",
    "status": "Required",
    "isExempted": false,
    "exemptionRejectionReason": "Supporting document does not meet regulatory requirements..."
  },
  "statusCode": 200
}
```

---

## Gate 3 Validation (Internal — called by AppointmentBookingValidator)

Not a public endpoint. Service method signature:

```csharp
Task<bool> IsTrainingCompleteAsync(Guid applicationId);
// Returns true if TrainingStatus == Completed OR Exempted
// Used internally by AppointmentBookingValidator before Theory/Practical booking
```

When Gate 3 fails, the appointment POST returns:
```json
{
  "success": false,
  "message": "Training requirement not fulfilled (Gate 3).",
  "errors": ["Training status must be Completed or Exempted before booking tests."],
  "statusCode": 400
}
```
