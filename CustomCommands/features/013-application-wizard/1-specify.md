# Feature 013: Multi-Step Application Wizard (5 Steps) — Frontend

## WHAT WE'RE BUILDING:
5-step wizard for creating license applications with validation, auto-save, and bilingual support.

## REQUIREMENTS:
### Step 1: Service Selection (8 cards)
### Step 2: License Category (6 cards with age validation)
### Step 3: Personal Info (9 fields: National ID, DOB, Nationality, Gender, Mobile, Email, Address, City, Region)
### Step 4: Application Details (Applicant Type, Preferred Center, Test Language, Appointment Pref, Special Needs)
### Step 5: Review & Submit (summary, edit buttons, declaration checkbox)

### State: Zustand store, auto-save every 30s
### Progress: horizontal step bar, completed/current/future states
### Navigation: Back/Next, clickable completed steps

## ACCEPTANCE CRITERIA:
- [ ] 5 steps render correctly
- [ ] Progress indicator updates
- [ ] Age validation on category selection
- [ ] Form validation with React Hook Form + Zod
- [ ] Auto-save works
- [ ] Submit creates application
- [ ] RTL/LTR + Dark/Light + Responsive
