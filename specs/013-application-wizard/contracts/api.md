# API Contracts: Multi-Step Application Wizard

**Feature**: `013-application-wizard` | **Phase**: 1 | **Date**: 2026-04-08

> **Note**: Feature 013 is a frontend-only feature. It **consumes** the API established in Feature 012. No new backend endpoints are created. This document describes the exact API surface the wizard interacts with.

---

## Endpoints Consumed

### 1. Check for Existing Draft

**Purpose**: On wizard page load, check if the applicant already has an active or draft application. Used to show the existing-application guard banner or hydrate the wizard store.

```
GET /api/v1/applications?status=Draft&pageSize=1&page=1
Authorization: Bearer {accessToken}
```

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Applications retrieved",
  "data": {
    "items": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "applicationNumber": "MOJ-2025-48291037",
        "status": "Draft",
        "serviceType": "NewLicense",
        "licenseCategoryCode": "B",
        "createdAt": "2025-06-01T10:00:00Z",
        "updatedAt": "2025-06-01T10:05:00Z"
      }
    ],
    "totalCount": 1,
    "page": 1,
    "pageSize": 1,
    "totalPages": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  },
  "errors": null,
  "statusCode": 200
}
```

**Wizard behavior**:
- If `totalCount > 0` → hydrate wizard store from the draft item and offer "Resume" OR show guard banner (if status is not Draft).
- If `totalCount == 0` → proceed to Step 1 with empty wizard.

---

### 2. Create New Draft Application

**Purpose**: Called once, when the applicant completes Step 1 and clicks "Next" for the first time. Creates the Draft record and returns the `applicationId` which is stored in `WizardState.applicationId`.

```
POST /api/v1/applications
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "serviceType": "NewLicense"
}
```

**Success Response** (`201 Created`):
```json
{
  "success": true,
  "message": "Application created",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "applicationNumber": "MOJ-2025-48291037",
    "status": "Draft",
    "serviceType": "NewLicense",
    "createdAt": "2025-06-01T10:00:00Z"
  },
  "errors": null,
  "statusCode": 201
}
```

**Wizard behavior**: Store `data.id` in `WizardState.applicationId`. All subsequent auto-saves use this ID.

---

### 3. Auto-Save Draft (Step 2–4 Data)

**Purpose**: Fired every 30 seconds by `useWizardAutoSave`, and also fired explicitly when the user clicks "Next" on any step (to guarantee data is saved before advancing). Sends the accumulated step data.

```
PATCH /api/v1/applications/{id}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "licenseCategoryCode": "B",
  "nationalId": "1234567890",
  "dateOfBirth": "1995-06-15",
  "nationality": "SA",
  "gender": "Male",
  "mobileNumber": "+966501234567",
  "email": "applicant@example.com",
  "address": "123 Al Olaya Street",
  "city": "Riyadh",
  "region": "Riyadh Region",
  "applicantType": "Citizen",
  "preferredCenterId": "aff9bc12-3456-7890-abcd-ef1234567890",
  "testLanguage": "ar",
  "appointmentPreference": "Morning",
  "specialNeedsDeclaration": false
}
```

> All fields are optional in the PATCH body — only send fields that have changed or been collected so far.

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Application updated",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "status": "Draft",
    "updatedAt": "2025-06-01T10:05:00Z"
  },
  "errors": null,
  "statusCode": 200
}
```

**Wizard behavior**: Update `WizardState.lastSavedAt` with the response timestamp. Reset `consecutiveSaveFailures` to 0.

**Error handling**:
- `4xx`/`5xx` → increment `consecutiveSaveFailures`. If `>= 3`, show non-blocking warning banner.
- Never show a modal or block UI on auto-save failure.

---

### 4. Submit Application

**Purpose**: Called on Step 5 when user checks declaration and clicks "Submit Application". Transitions the application from Draft → Submitted.

```
POST /api/v1/applications/{id}/submit
Authorization: Bearer {accessToken}
Content-Type: application/json

{}
```

> Empty body — all data has already been saved via PATCH auto-saves. The backend validates completeness and transitions status.

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "applicationNumber": "MOJ-2025-48291037",
    "status": "Submitted"
  },
  "errors": null,
  "statusCode": 200
}
```

**Wizard behavior**: Clear `sessionStorage` wizard state, show success toast, redirect to `/[locale]/applicant/applications/{id}` (the application detail/tracking page).

**Error handling**:
- `400 BadRequest` (validation failed) → display errors on the Review step and highlight which step(s) have incomplete data.
- `409 Conflict` (duplicate active application) → show error alert with link to existing application.

---

### 5. Lookup — License Categories with Min Ages

**Purpose**: Fetched once on wizard mount to populate Step 2 category cards and enable client-side age validation. Data includes `minAge` sourced from `SystemSettings` on the backend.

```
GET /api/v1/license-categories
Authorization: Bearer {accessToken}
```

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "License categories retrieved",
  "data": [
    { "code": "A", "nameAr": "دراجة نارية", "nameEn": "Motorcycle", "minAge": 16, "validityYears": 10 },
    { "code": "B", "nameAr": "سيارة خاصة", "nameEn": "Private Car", "minAge": 18, "validityYears": 10 },
    { "code": "C", "nameAr": "تجاري/أجرة", "nameEn": "Commercial", "minAge": 21, "validityYears": 5 },
    { "code": "D", "nameAr": "حافلة", "nameEn": "Bus", "minAge": 21, "validityYears": 5 },
    { "code": "E", "nameAr": "مركبات ثقيلة", "nameEn": "Heavy Vehicles", "minAge": 21, "validityYears": 5 },
    { "code": "F", "nameAr": "مركبات زراعية", "nameEn": "Agricultural", "minAge": 18, "validityYears": 10 }
  ],
  "errors": null,
  "statusCode": 200
}
```

**Caching**: React Query `staleTime: 5 * 60 * 1000` (5 min), `gcTime: 10 * 60 * 1000`.

---

### 6. Lookup — Exam Centers

**Purpose**: Populates the "Preferred Execution Center" dropdown in Step 4.

```
GET /api/v1/exam-centers?isActive=true
Authorization: Bearer {accessToken}
```

**Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Exam centers retrieved",
  "data": [
    { "id": "uuid-1", "nameAr": "مركز الرياض الشمالي", "nameEn": "North Riyadh Center", "city": "Riyadh", "region": "Riyadh Region" },
    { "id": "uuid-2", "nameAr": "مركز جدة", "nameEn": "Jeddah Center", "city": "Jeddah", "region": "Makkah Region" }
  ],
  "errors": null,
  "statusCode": 200
}
```

---

### 7. Lookup — Nationalities / Regions

**Purpose**: Populates the "Nationality" and "Region" dropdowns in Step 3.

```
GET /api/v1/lookups/nationalities
GET /api/v1/lookups/regions
Authorization: Bearer {accessToken}
```

**Both return `200 OK` with** `data: Array<{ code: string; nameAr: string; nameEn: string }>`.

---

## Error Response Shape (All Endpoints)

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    "LicenseCategoryCode: Age too young for selected category",
    "NationalId: Required field"
  ],
  "statusCode": 400
}
```

---

## React Query Key Conventions

```typescript
// Consistent query keys for the wizard
export const wizardQueryKeys = {
  existingDraft:    ['applications', 'draft', 'check'],
  licenseCategories:['license-categories'],
  examCenters:      ['exam-centers'],
  nationalities:    ['lookups', 'nationalities'],
  regions:          ['lookups', 'regions'],
} as const;
```
