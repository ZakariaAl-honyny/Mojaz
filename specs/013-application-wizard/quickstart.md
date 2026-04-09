# Quickstart: Multi-Step Application Wizard

**Feature**: `013-application-wizard` | **Date**: 2026-04-08

---

## Prerequisites

Before implementing this feature, ensure the following are complete and merged:

| Feature | Requirement |
|---------|-------------|
| Feature 002 — Frontend Foundation | Next.js 15 + Tailwind CSS 4 + shadcn/ui scaffold, `globals.css`, `lib/utils.ts` (`cn()`), locale layout with `dir`/`lang` |
| Feature 006 — Auth (JWT) | Axios instance with JWT Bearer interceptor, `useAuth` hook, auth-guard middleware |
| Feature 011 — RBAC | `Applicant` role enforced on `/(applicant)/` route group |
| Feature 012 — Application CRUD | `POST /api/v1/applications`, `PATCH /api/v1/applications/{id}`, `POST /api/v1/applications/{id}/submit`, `GET /api/v1/applications`, `GET /api/v1/license-categories` |

---

## Development Setup

1. **Switch to the feature branch**:
   ```bash
   git checkout 013-application-wizard
   ```

2. **Install no new dependencies** — all libraries (Zustand, React Hook Form, Zod, Framer Motion, next-intl) are already in `package.json` from Feature 002.

3. **Start the dev server**:
   ```bash
   cd frontend && npm run dev
   ```

4. **Navigate to the wizard**:
   ```
   http://localhost:3000/ar/applicant/applications/new
   ```
   (Requires a valid Applicant JWT in the auth store — log in as an Applicant-role test user first.)

---

## Implementation Order

Follow this sequence to build incrementally testable slices:

### Slice 1 — Wizard Shell & Progress Bar *(P1)*
Build `WizardShell.tsx` and `WizardProgressBar.tsx` with static step data and `wizard-store.ts`. Verify the progress bar renders all 5 steps in both `dir="rtl"` and `dir="ltr"`.

### Slice 2 — Step 1: Service Selection *(P1)*
Build `Step1ServiceSelection.tsx` with 8 `ServiceCard.tsx` components. Wire to `step1Schema.ts` and Zustand `setStep1`. Verify selection highlights the card and enables "Next".

### Slice 3 — Step 2: License Category + Age Validation *(P1)*
Build `Step2LicenseCategory.tsx` with 6 `CategoryCard.tsx` components. Fetch `GET /api/v1/license-categories` via React Query. Wire `createStep2Schema` with age check. Test with a user DOB that makes them 17 (should block B–F).

### Slice 4 — Step 3: Personal Info *(P1)*
Build `Step3PersonalInfo.tsx` with 9 RHF fields. Fetch Region and Nationality dropdown data. Wire `step3Schema.ts`. Verify per-field inline error messages on blur.

### Slice 5 — Step 4: Application Details *(P1)*
Build `Step4ApplicationDetails.tsx` with 5 RHF fields. Fetch ExamCenter dropdown. Wire `step4Schema.ts`.

### Slice 6 — Auto-Save *(P2)*
Implement `useWizardAutoSave.ts` with `setInterval(30_000)`. On first "Next" from Step 1: call `POST /api/v1/applications` → store `applicationId`. On subsequent saves: call `PATCH /api/v1/applications/{id}`. Build `AutoSaveIndicator.tsx`. Verify via Network DevTools.

### Slice 7 — Step 5: Review & Submit *(P1)*
Build `Step5ReviewSubmit.tsx`. Render read-only summary via `StepSection.tsx` for each step. "Edit" links should call `goTo(step)`. Declaration checkbox wired to `step5Schema.ts`. Submit button → `POST /api/v1/applications/{id}/submit` mutation → redirect.

### Slice 8 — Existing Application Guard *(P2)*
Add React Query `GET /api/v1/applications?status=Active,Submitted,InReview` check in `page.tsx`. Render `ExistingApplicationBanner` when an active application exists.

### Slice 9 — RTL/LTR Animations & Responsive Polish *(P2)*
Add Framer Motion `AnimatePresence` step transitions with direction inversion. Test all 5 steps at 320px, 768px, 1024px, and 1440px. Verify RTL at each.

### Slice 10 — Tests *(P2)*
Write Jest tests for all 5 Zod schemas. Write React Testing Library component tests for each step. Write Playwright E2E test for happy path submission.

---

## Key File Locations

| File | Purpose |
|------|---------|
| `frontend/src/stores/wizard-store.ts` | Zustand store — primary state container |
| `frontend/src/lib/validations/step*.ts` | Zod schemas for each step |
| `frontend/src/hooks/useWizardAutoSave.ts` | 30-second auto-save logic |
| `frontend/src/hooks/useApplicationWizard.ts` | Navigation facade (goTo, goNext, goBack, submit) |
| `frontend/src/services/application.service.ts` | API calls (create draft, update draft, submit) |
| `frontend/src/components/domain/application/wizard/` | All wizard UI components |
| `frontend/public/locales/ar/wizard.json` | Arabic strings |
| `frontend/public/locales/en/wizard.json` | English strings |

---

## Critical Rules for Implementers

1. **Never hardcode text** — use `useTranslations('wizard')` from next-intl for every visible string, including error messages.
2. **Never use physical CSS** — use `ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end` everywhere; never `ml-`, `mr-`, `text-left`, `text-right`.
3. **Never hardcode minimum ages** — always derive from the `GET /api/v1/license-categories` response.
4. **Always write to Zustand store on step unmount** — use `useEffect(() => () => { setStepN(formValues); }, [])` (cleanup function).
5. **Never block the UI on auto-save failures** — `consecutiveSaveFailures < 3` → silent; `>= 3` → non-blocking banner only.
6. **Always test both locales** — every component PR must include a screenshot or test for both `ar` (RTL) and `en` (LTR).
7. **Never add `console.log` with form data** — National ID and mobile numbers are sensitive; the constitution prohibits logging them.

---

## Translation Key Convention

```json
// public/locales/en/wizard.json (partial)
{
  "title": "New Application",
  "step1": {
    "title": "Select Service",
    "newLicense": { "title": "New License Issuance", "description": "Apply for your first driving license" }
  },
  "step2": {
    "title": "License Category",
    "categoryA": { "title": "Category A — Motorcycle", "ageNote": "Minimum age: {{minAge}} years" }
  },
  "step3": { "title": "Personal Information" },
  "step4": { "title": "Application Details" },
  "step5": {
    "title": "Review & Submit",
    "declaration": "I confirm that all information provided is accurate and complete.",
    "submit": "Submit Application",
    "edit": "Edit"
  },
  "nav": { "back": "Back", "next": "Next", "saveDraft": "Save Draft" },
  "autoSave": { "saving": "Saving...", "saved": "Saved at {{time}}", "failed": "Could not auto-save" },
  "validation": {
    "step1": { "serviceRequired": "Please select a service to continue." },
    "step2": { "categoryRequired": "Please select a license category.", "ageError": "Minimum age for this category is {{minAge}} years." },
    "step3": {
      "nationalIdFormat": "National ID must be 10 digits.",
      "dobInvalid": "Please enter a valid date of birth.",
      "nationalityRequired": "Please select your nationality.",
      "genderRequired": "Please select your gender.",
      "mobileFormat": "Please enter a valid mobile number.",
      "emailFormat": "Please enter a valid email address.",
      "addressMin": "Address must be at least 5 characters.",
      "cityRequired": "Please select your city.",
      "regionRequired": "Please select your region."
    },
    "step4": { "centerRequired": "Please select a preferred examination center.", "specialNeedsNoteRequired": "Please describe your special needs." },
    "step5": { "declarationRequired": "You must accept the declaration to submit." }
  }
}
```

Mirror all keys in `public/locales/ar/wizard.json` with Arabic equivalents.
