# API Contracts: Medical Examination

## `POST /api/v1/medical-exams`
Records a new medical examination result.

### Request Body (CreateMedicalResultRequest)
```json
{
  "applicationId": "guid",
  "appointmentId": "guid",
  "result": 1, 
  "bloodType": "O+",
  "visionTestResult": "20/20",
  "colorBlindTestResult": "Pass",
  "bloodPressureNormal": true,
  "notes": "Healthy individual."
}
```

### Success Response (ApiResponse<MedicalResultDto>) - 201 Created
```json
{
  "success": true,
  "message": "Medical examination recorded successfully.",
  "data": {
    "id": "guid",
    "applicationId": "guid",
    "result": 1,
    "validUntil": "2026-07-08T00:00:00Z"
  },
  "errors": null,
  "statusCode": 201
}
```

## `GET /api/v1/medical-exams/{applicationId}`
Retrieves the active medical record for an application.

### Success Response (ApiResponse<MedicalResultDto>) - 200 OK
```json
{
  "success": true,
  "data": {
    "id": "guid",
    "result": 1,
    "bloodType": "O+",
    "examinedAt": "2026-04-09T10:00:00Z",
    "validUntil": "2026-07-08T00:00:00Z",
    "clinicName": "Riyadh Central Auth Hospital",
    "doctorName": "Dr. Ahmed"
  },
  "statusCode": 200
}
```
