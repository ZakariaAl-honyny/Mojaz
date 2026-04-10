# Phase 1: Data Model & Transitions

## Entities

1. **SystemSettings** 
   - Add/verify keys for Category F:
     - `MIN_AGE_CATEGORY_F`: 18
     - `TRAINING_HOURS_CATEGORY_F`: 20
     - `THEORY_QUESTIONS_CATEGORY_F`: 20
     - `VALIDITY_YEARS_CATEGORY_F`: 10

2. **LicenseCategories** 
   - Seed data representation:
     - Code: `F`
     - NameAr: `مركبات زراعية`
     - NameEn: `Agricultural`

3. **Applications** 
   - State Machine: Supports Standard 10-stage system.
   - Validations:
     - On creation, restrict `CategoryId == 'F'` if `Applicant.Age < MIN_AGE_CATEGORY_F`.

## Process Upgrades
- Upgrade Rule expansion for `ApplicationValidator.cs`: 
  - Valid upgrade explicitly allowed: F -> B.
  - Invalid upgrades blocked explicitly: F -> C, F -> D, F -> E.
