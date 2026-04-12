# Implementation Plan: License Renewal Simplified Workflow

**Branch**: `025-license-renewal` | **Date**: 2026-04-10 | **Spec**: [spec.md](file:///c:/Users/ALlahabi/Desktop/cmder/Mojaz/specs/025-license-renewal/spec.md)
**Input**: Feature specification from `/specs/025-license-renewal/spec.md`

## Summary

Implement a simplified renewal workflow for driving licenses that allows applicants with active or recently expired licenses to skip Training and Testing stages. The process focuses on Medical Fitness verification, fee payment (using `RENEWAL_FEE`), and atomic deactivation of the old license in favor of a newly issued record.

## Technical Context

**Language/Version**: C# (ASP.NET Core 8), TypeScript (Next.js 15)  
**Primary Dependencies**: EF Core 8, shadcn/ui, next-intl, Hangfire, FluentValidation  
**Storage**: SQL Server 2022  
**Testing**: xUnit (Backend), Jest (Frontend), Playwright (E2E)  
**Target Platform**: Web Browser (Responsive, RTL/LTR)
**Project Type**: Government Web Service / Portal  
**Performance Goals**: < 2s API Response, < 24h operational processing  
**Constraints**: Zero hardcoding of fees/ages, Soft Delete only, Atomic license transition  
**Scale/Scope**: Core driving license lifecycle service (Service 02 in PRD)

## Constitution Check

| Principle | Check Status | Rationale |
|-----------|--------------|-----------|
| I. Clean Architecture | 🟢 PASS | Logic will reside in `Application` layer services; controllers remain thin. |
| II. Security First | 🟢 PASS | Endpoints will use `[Authorize(Roles = "Applicant")]`; ownership validated. |
| III. Configuration | 🟢 PASS | Fees fetched from `FeeStructures`; Grace period from `SystemSettings`. |
| IV. Internationalization | 🟢 PASS | Full RTL/LTR support via `next-intl` and logical CSS properties. |
| V. API Contract | 🟢 PASS | Response wrapped in `ApiResponse<T>`; consistent pagination. |
| VI. Test Discipline | 🟢 PASS | 80%+ coverage for renewal service; E2E for full renewal flow. |
| VII. Async Notifications | 🟢 PASS | SMS/Email confirmations dispatched via Hangfire. |

## Project Structure

### Documentation (this feature)

```text
specs/025-license-renewal/
├── plan.md              # This file
├── research.md          # Phase 0: Policy & Logic details
├── data-model.md        # Phase 1: Entity & Transitions
├── quickstart.md        # Phase 1: Dev guide
├── contracts/           # Phase 1: API schemas
└── tasks.md             # Phase 2: Action items
```

### Source Code

```text
src/
├── backend/
│   ├── Mojaz.Domain/           # LicenseStatus enum, License entity
│   ├── Mojaz.Application/      # ILicenseService, RenewalCommand
│   ├── Mojaz.Infrastructure/   # LicenseRepository, Migrations
│   └── Mojaz.API/              # LicensesController (Renewal action)
├── frontend/
│   ├── src/app/[locale]/(applicant)/license/renew/page.tsx
│   ├── src/components/domain/license/LicenseRenewalWizard.tsx
│   └── src/services/license.service.ts
└── tests/
    ├── Mojaz.Application.Tests/ # Renewal logic tests
    └── Mojaz.API.Tests/         # Controller validation tests
```

**Structure Decision**: Standard Mojaz Clean Architecture. Backend splits into Domain/Application/Infrastructure/API. Frontend uses Next.js App Router with locale-based routes.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Atomic Transaction | Ensure old license deactivated *only* if new one is successfully issued. | Simple flag updates independently could lead to inconsistent states (no license or two licenses). |

---

## Phase 0: Research (Outline)

1. **Policy Resolution**: Confirm `RENEWAL_GRACE_PERIOD_DAYS` default (Assume 365) and "Beyond Grace" behavior (Assume Full Reset to Stage 01).
2. **Fee Mapping**: Identify `FeeType.Renewal` or similar in existing enum; verify values in `FeeStructures` simulation.
3. **Transition Logic**: Research EF Core transaction patterns for atomic status update + new record creation.

**Next Steps**: Generate `research.md`.
