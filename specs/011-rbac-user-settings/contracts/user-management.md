# API Contracts: User Management

## Create User (Employees)
`POST /api/v1/users`
**Headers:** `Authorization: Bearer <Admin_JWT>`
**Request Body:**
```json
{
  "fullName": "Test Examiner",
  "email": "examiner@mojaz.gov.sa",
  "phoneNumber": "966500000000",
  "appRole": "Examiner"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": "guid",
    "temporaryPassword": "SecureRandomString123!"
  },
  "statusCode": 201
}
```

## Update User Status
`PATCH /api/v1/users/{userId}/status`
**Headers:** `Authorization: Bearer <Admin_JWT>`
**Request Body:**
```json
{
  "isActive": false
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "User status updated",
  "data": null,
  "statusCode": 200
}
```

## Update User Role
`PATCH /api/v1/users/{userId}/role`
**Headers:** `Authorization: Bearer <Admin_JWT>`
**Request Body:**
```json
{
  "appRole": "Manager"
}
```
