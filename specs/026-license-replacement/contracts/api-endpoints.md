# API Contracts: License Replacement

## Base Path: `/api/v1/applications`

### 1. Initiate Replacement Application
`POST /api/v1/applications/replacement`

**Request Body:**
```json
{
  "reason": "Stolen", 
  "licenseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "applicationId": "guid",
    "applicationNumber": "MOJ-2025-XXXXXXXX",
    "requiredFee": 100.00
  }
}
```

### 2. Upload Replacement Document
`POST /api/v1/applications/{id}/documents`
*(Standard document upload endpoint, but with logic to validate type based on reason)*

**Logic:**
- Reason `Stolen` -> Requires `DocumentType.PoliceReport`
- Reason `Damaged` -> Requires `DocumentType.DamagedLicensePhoto`

---

## Base Path: `/api/v1/licenses`

### 3. Verify Replacement Eligibility
`GET /api/v1/licenses/mine/replacement-eligibility`

**Response:**
```json
{
  "success": true,
  "data": {
    "isEligible": true,
    "currentLicenseId": "guid",
    "message": null
  }
}
```

---

## Base Path: `/api/v1/administrative`

### 4. Review Stolen License Report
`PATCH /api/v1/administrative/applications/{id}/verify-stolen-report`

**Request Body:**
```json
{
  "isApproved": true,
  "comments": "Report matches police station records."
}
```
