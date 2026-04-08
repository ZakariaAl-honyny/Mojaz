# API Contracts: System Settings & Fees

## Get All System Settings
`GET /api/v1/settings`
**Headers:** `Authorization: Bearer <Admin_JWT>`
**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "key": "MIN_AGE_CATEGORY_A",
      "value": "16",
      "dataType": "Integer",
      "description": "Minimum age for motorcycle license",
      "updatedAt": "2026-04-08T00:00:00Z"
    }
  ],
  "statusCode": 200
}
```

## Update System Setting
`PUT /api/v1/settings/{key}`
**Headers:** `Authorization: Bearer <Admin_JWT>`
**Request Body:**
```json
{
  "value": "18"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Setting updated successfully",
  "data": null,
  "statusCode": 200
}
```
