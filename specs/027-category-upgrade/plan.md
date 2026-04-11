# Implementation Plan: License Category Upgrade

**Branch**: `027-category-upgrade` | **Date**: 2026-04-10 | **Spec**: [spec.md](file:///c:/Users/ALlahabi/Desktop/cmder/Mojaz/specs/027-category-upgrade/spec.md)
**Input**: Feature specification from `/specs/027-category-upgrade/spec.md`

## Summary

Implement the License Category Upgrade feature, enabling active license holders to transition to higher categories (B → C → D → E or F → B) after a 12-month holding period. The technical approach involves extending `ApplicationService.CheckEligibilityAsync` with a new `ICategoryUpgradeService` to enforce progression rules, integrating with `SystemSettings` for configurable durations/credits, and updating the Frontend Wizard to handle path-based stage skipping (e.g., Theory Test waiver for commercial upgrades).

**Language/Version**: C# (.NET 8), TypeScript (Next.js 15)  
**Primary Dependencies**: EF Core 8, FluentValidation, AutoMapper, shadcn/ui, next-intl, TanStack Query v5  
**Storage**: SQL Server 2022 (Existing schema: Licenses, CategoryUpgrades, SystemSettings)  
**Testing**: xUnit + Moq (Backend), Jest + RTL (Frontend), Playwright (E2E)  
**Target Platform**: Web (Bilingual AR/EN, Responsive)  
**Project Type**: Web Application (Clean Architecture)  
**Performance Goals**: Eligibility response < 200ms; 100% path enforcement at API level.  
**Constraints**: 12-month holding period (`MIN_HOLDING_PERIOD_UPGRADE`); Sequential progression for commercial categories.  
**Scale/Scope**: ~100k active licenses; logic affects service selection wizard.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Clean Architecture Compliance**: Logic MUST reside in `Mojaz.Application`; `Mojaz.Infrastructure` only handles persistence of `CategoryUpgrade` entities.
2. **Dependency Direction**: Application layer must NOT reference Infrastructure directly. Use interfaces.
3. **Configuration Supremacy**: `MIN_HOLDING_PERIOD_UPGRADE` and `UPGRADE_TRAINING_REDUCTION_PCNT` MUST be fetched from `SystemSettings`.
4. **Security - Ownership**: Eligibility checks MUST validate that the `LicenseId` belongs to the `CurrentUserId`.
5. **Internationalization**: All new strings for Category Upgrade (success, errors, paths) MUST be in `locales/*.json`.
6. **API Consistency**: All upgrade endpoints MUST return `ApiResponse<T>`.
7. **Soft Delete**: When superseding a license, it MUST be marked as `IsDeleted = true` (Archived) rather than deleted.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
| backend/
  │   ├── Mojaz.Domain/
  │   │   ├── Enums/
  │   │   └── Entities/
  │   ├── Mojaz.Application/
  │   │   ├── Interfaces/
  │   │   ├── Services/
  │   │   └── DTOs/
  │   ├── Mojaz.Infrastructure/
  │   │   └── Persistence/
  │   └── Mojaz.API/
  │       └── Controllers/
  └── frontend/
      ├── src/
      │   ├── app/[locale]/
      │   ├── components/domain/application/
      │   └── services/
```

**Structure Decision**: Clean Architecture (Web Application option) as mandated by the Constitution.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
