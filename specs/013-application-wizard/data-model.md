# Data Model: Multi-Step Application Wizard

**Feature**: `013-application-wizard` | **Phase**: 1 | **Date**: 2026-04-08

---

## Overview

Feature 013 is a **pure frontend feature**. It introduces no new database tables. All backend persistence is handled by the `Applications` table (established in Feature 012). This document describes the **TypeScript data model** — types, Zod schemas, and Zustand store shape — used throughout the wizard.

---

## 1. Wizard Store Shape (`wizard-store.ts`)

```typescript
// stores/wizard-store.ts
export type StepId = 1 | 2 | 3 | 4 | 5;

export interface Step1Data {
  serviceType: ServiceType | null;           // Which of 8 services was selected
}

export interface Step2Data {
  categoryCode: LicenseCategoryCode | null;  // A | B | C | D | E | F
}

export interface Step3Data {
  nationalId: string;           // National ID or Residence Number
  dateOfBirth: string;          // ISO date string (YYYY-MM-DD)
  nationality: string;          // Nationality code or label
  gender: 'Male' | 'Female';
  mobileNumber: string;         // E.164 format preferred
  email: string;                // Optional per PRD but required for wizard for reliability
  address: string;
  city: string;
  region: string;
}

export interface Step4Data {
  applicantType: 'Citizen' | 'Resident';
  preferredCenterId: string;    // UUID from ExamCenter lookup
  testLanguage: 'ar' | 'en';
  appointmentPreference: 'Morning' | 'Afternoon' | 'Evening' | 'NoPreference';
  specialNeedsDeclaration: boolean;
  specialNeedsNote?: string;    // Present only when specialNeedsDeclaration = true
}

export interface WizardState {
  // Application identity
  applicationId: string | null;   // Set after first save to backend (POST /api/v1/applications)
  currentStep: StepId;
  completedSteps: StepId[];
  lastSavedAt: Date | null;
  consecutiveSaveFailures: number;

  // Step data
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;

  // Declaration (Step 5 — not persisted to backend, only submitted)
  declarationAccepted: boolean;

  // Actions
  setStep1: (data: Step1Data) => void;
  setStep2: (data: Step2Data) => void;
  setStep3: (data: Step3Data) => void;
  setStep4: (data: Step4Data) => void;
  setDeclaration: (accepted: boolean) => void;
  goTo: (step: StepId) => void;
  markCompleted: (step: StepId) => void;
  setApplicationId: (id: string) => void;
  setLastSavedAt: (date: Date) => void;
  incrementSaveFailures: () => void;
  resetSaveFailures: () => void;
  resetWizard: () => void;
}
```

**Persistence**: The slice `{ applicationId, currentStep, completedSteps, step1, step2, step3, step4 }` is persisted to `sessionStorage` via Zustand `persist` middleware with key `mojaz-wizard-draft`. `declarationAccepted` and action functions are NOT persisted.

---

## 2. Enum Types (`wizard.types.ts`)

```typescript
// types/wizard.types.ts

export enum ServiceType {
  NewLicense        = 'NewLicense',
  Renewal           = 'Renewal',
  Replacement       = 'Replacement',
  CategoryUpgrade   = 'CategoryUpgrade',
  TestRetake        = 'TestRetake',
  AppointmentBooking= 'AppointmentBooking',
  Cancellation      = 'Cancellation',
  DocumentDownload  = 'DocumentDownload',
}

export enum LicenseCategoryCode {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
}

export interface LicenseCategoryOption {
  code: LicenseCategoryCode;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  minAge: number;              // Sourced from backend SystemSettings
  icon: string;                // Lucide icon name
  validityYears: number;
  upgradeFrom?: LicenseCategoryCode;
}

export interface ExamCenter {
  id: string;
  nameAr: string;
  nameEn: string;
  city: string;
  region: string;
}

export interface ServiceCardConfig {
  type: ServiceType;
  titleKey: string;           // next-intl key, e.g. "wizard.step1.newLicense.title"
  descriptionKey: string;
  icon: string;               // Lucide icon name
  availableInMvp: boolean;
  href?: string;              // For non-wizard services (e.g., DocumentDownload → /downloads)
}
```

---

## 3. Zod Validation Schemas

### Step 1 — Service Selection

```typescript
// lib/validations/step1Schema.ts
export const step1Schema = z.object({
  serviceType: z.nativeEnum(ServiceType, {
    required_error: 'wizard.validation.step1.serviceRequired',
  }),
});
export type Step1FormValues = z.infer<typeof step1Schema>;
```

### Step 2 — License Category

```typescript
// lib/validations/step2Schema.ts
// minAgeMap is injected at runtime from the backend lookup to avoid hardcoding
export const createStep2Schema = (
  dateOfBirth: string | undefined,
  minAgeMap: Record<LicenseCategoryCode, number>
) =>
  z.object({
    categoryCode: z.nativeEnum(LicenseCategoryCode, {
      required_error: 'wizard.validation.step2.categoryRequired',
    }),
  }).superRefine((data, ctx) => {
    if (!dateOfBirth || !data.categoryCode) return;
    const age = calculateAge(dateOfBirth);               // utility: years between DOB and today
    const minAge = minAgeMap[data.categoryCode] ?? 999;
    if (age < minAge) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['categoryCode'],
        message: `wizard.validation.step2.ageError:${minAge}`,  // parameterized key
      });
    }
  });
```

### Step 3 — Personal Information

```typescript
// lib/validations/step3Schema.ts
export const step3Schema = z.object({
  nationalId:    z.string().min(10).max(20).regex(/^[0-9]+$/, 'wizard.validation.step3.nationalIdFormat'),
  dateOfBirth:   z.string().refine(v => !isNaN(Date.parse(v)), 'wizard.validation.step3.dobInvalid'),
  nationality:   z.string().min(1, 'wizard.validation.step3.nationalityRequired'),
  gender:        z.enum(['Male', 'Female'], { required_error: 'wizard.validation.step3.genderRequired' }),
  mobileNumber:  z.string().regex(/^\+?[0-9]{9,15}$/, 'wizard.validation.step3.mobileFormat'),
  email:         z.string().email('wizard.validation.step3.emailFormat').optional().or(z.literal('')),
  address:       z.string().min(5, 'wizard.validation.step3.addressMin'),
  city:          z.string().min(1, 'wizard.validation.step3.cityRequired'),
  region:        z.string().min(1, 'wizard.validation.step3.regionRequired'),
});
export type Step3FormValues = z.infer<typeof step3Schema>;
```

### Step 4 — Application Details

```typescript
// lib/validations/step4Schema.ts
export const step4Schema = z.object({
  applicantType:           z.enum(['Citizen', 'Resident']),
  preferredCenterId:       z.string().uuid('wizard.validation.step4.centerRequired'),
  testLanguage:            z.enum(['ar', 'en']),
  appointmentPreference:   z.enum(['Morning', 'Afternoon', 'Evening', 'NoPreference']),
  specialNeedsDeclaration: z.boolean(),
  specialNeedsNote:        z.string().max(500).optional(),
}).superRefine((data, ctx) => {
  if (data.specialNeedsDeclaration && !data.specialNeedsNote?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['specialNeedsNote'],
      message: 'wizard.validation.step4.specialNeedsNoteRequired',
    });
  }
});
```

### Step 5 — Declaration

```typescript
// lib/validations/step5Schema.ts
export const step5Schema = z.object({
  declarationAccepted: z.literal(true, {
    errorMap: () => ({ message: 'wizard.validation.step5.declarationRequired' }),
  }),
});
```

---

## 4. State Transitions

```text
Wizard Step Flow:
  Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Submit

Application Status Transitions (driven by backend Feature 012):
  [None]  → Draft       (POST /api/v1/applications on first wizard save)
  Draft   → Draft       (PATCH /api/v1/applications/{id} on every auto-save or Next)
  Draft   → Submitted   (POST /api/v1/applications/{id}/submit on Step 5 Submit)

Wizard UI State per Step:
  upcoming  → user has not yet reached this step (not clickable)
  current   → active step being filled
  completed → user has successfully passed Next on this step (clickable for back-nav)
```

---

## 5. API Response Types Consumed

These types are owned by Feature 012 — documented here for reference by wizard developers:

```typescript
// types/application.types.ts (Feature 012 owned)
export interface ApplicationDraftDto {
  id:                   string;
  applicationNumber:    string;
  status:               ApplicationStatus;
  serviceType:          ServiceType;
  licenseCategoryCode:  LicenseCategoryCode | null;
  // personal info fields...
  createdAt:            string;
  updatedAt:            string;
}

// types/api.types.ts (Feature 012 owned)
export interface ApiResponse<T> {
  success:    boolean;
  message:    string;
  data:       T | null;
  errors:     string[] | null;
  statusCode: number;
}
```
