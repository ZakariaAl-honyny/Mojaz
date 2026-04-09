# API Contracts: 016-appointment-system

All endpoints return wrapped in the standard `ApiResponse<T>` / `ApiResponse<PagedResult<T>>` format.

## `GET /api/v1/appointments/available-slots`
Finds open slots respecting capacity and schedule templates.

**Request Query**
- `type`: enum (Required, e.g. PracticalTest)
- `branchId`: guid (Required)
- `date`: string (YYYY-MM-DD)

**Response `Data`**
```json
[
  {
    "date": "2026-04-10",
    "slots": [
      {
        "time": "09:00:00",
        "durationMinutes": 30,
        "availableCapacity": 2,
        "isAvailable": true
      }
    ]
  }
]
```

## `POST /api/v1/appointments`
Books an appointment. Enforces Gate 2 validations and Concurrency checks.

**Request Body**
```json
{
  "applicationId": "guid",
  "type": "PracticalTest",
  "branchId": "guid",
  "scheduledAt": "2026-04-10T09:00:00Z"
}
```

**Response `Data` (201 Created)**
```json
{
  "id": "guid",
  "scheduledAt": "2026-04-10T09:00:00Z",
  "status": "Scheduled"
}
```

## `PATCH /api/v1/appointments/{id}/reschedule`
Reschedules an appointment. Bumps the reschedule counter.

**Request Body**
```json
{
  "newScheduledAt": "2026-04-15T11:00:00Z",
  "newBranchId": "guid"
}
```

## `PATCH /api/v1/appointments/{id}/cancel`
Soft cancels an appointment requiring a reason.

**Request Body**
```json
{
  "reason": "Family emergency, unable to attend."
}
```
