# API Contracts: License Renewal

## Endpoints

### 1. Check Eligibility
`GET /api/v1/licenses/renewal/eligibility`

**Query Params**:
- `categoryId`: Guid

**Response** (`ApiResponse<EligibilityResponse>`):
```json
{
  "success": true,
  "data": {
    "isEligible": true,
    "currentLicense": {
      "id": "...",
      "licenseNumber": "MOJ-2020-12345678",
      "expiresAt": "2025-10-10"
    },
    "renewalFee": 100.00,
    "requiresMedical": true,
    "message": "Eligible for simplified renewal."
  }
}
```

### 2. Create Renewal Application
`POST /api/v1/licenses/renewal`

**Request Body** (`CreateRenewalRequest`):
```json
{
  "oldLicenseId": "Guid",
  "licenseCategoryId": "Guid",
  "branchId": "Guid?"
}
```

**Response** (`ApiResponse<Guid>`): Returns the new `ApplicationId`.

### 3. Issue Renewed License
`POST /api/v1/licenses/renewal/{applicationId}/issue`

**Response** (`ApiResponse<IssueLicenseResponse>`):
```json
{
  "success": true,
  "data": {
    "licenseId": "...",
    "licenseNumber": "MOJ-2025-88887777",
    "issuedAt": "2026-04-10T15:00:00Z",
    "expiresAt": "2036-04-10T15:00:00Z",
    "downloadUrl": "..."
  }
}
```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | `RENEWAL_TOO_EARLY` | License is more than 1 year from expiry and renewal not forced. |
| 400 | `EXPIRED_BEYOND_GRACE` | License expired > 365 days ago. Full reset required. |
| 409 | `ACTIVE_RENEWAL_EXISTS` | User already has a pending renewal for this category. |
