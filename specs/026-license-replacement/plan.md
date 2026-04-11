# Implementation Plan: License Replacement

**Branch**: `026-license-replacement` | **Date**: 2026-04-10 | **Spec**: [spec.md](file:///c:/Users/ALlahabi/Desktop/cmder/Mojaz/specs/026-license-replacement/spec.md)
**Input**: Feature specification from `/specs/026-license-replacement/spec.md`

## Summary

Implement the License Replacement feature, allowing holders of active licenses to request a new physical copy in cases of loss, theft, or damage. The technical approach involves extending `ServiceType` and `FeeType` enums to support replacements, implementing a `ReplacementService` to handle the streamlined application workflow (skipping medical/tests since the license is already active), updating the `LicenseService` to transition the previous license status to `Replaced`, and enhancing the Frontend Wizard to include a reason-selection step for replacements.

**Language/Version**: C# (.NET 8), TypeScript (Next.js 15)  
**Primary Dependencies**: EF Core 8, FluentValidation, AutoMapper, shadcn/ui, next-intl, TanStack Query v5  
**Storage**: SQL Server 2022 (Existing schema: Licenses, Applications, FeeStructures, SystemSettings)  
**Testing**: xUnit + Moq (Backend), Jest + RTL (Frontend), Playwright (E2E)  
**Target Platform**: Web (Bilingual AR/EN, Responsive)  
**Project Type**: Web Application (Clean Architecture)  
**Performance Goals**: Replacement eligibility check < 100ms; API response < 200ms.  
**Constraints**: Only active licenses can be replaced; Replacement fee must be fetched from `FeeStructures`.  
**Scale/Scope**: Core service for license lifecycle management; affects application wizard.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Clean Architecture Compliance**: Replacement logic MUST reside in `Mojaz.Application`; `Mojaz.Infrastructure` only handles persistence.
2. **Dependency Direction**: Application layer must NOT reference Infrastructure directly. Use interfaces.
3. **Configuration Supremacy**: `REPLACEMENT_FEE` MUST be fetched from `FeeStructures` table.
4. **Security - Ownership**: Replacement requests MUST validate that the license being replaced belongs to the `CurrentUserId`.
5. **Internationalization**: All new strings for License Replacement (reasons, errors, success messages) MUST be in `locales/*.json`.
6. **API Consistency**: All replacement endpoints MUST return `ApiResponse<T>`.
7. **Soft Delete/Status**: The old license MUST NOT be deleted but transitioned to `Replaced` status to maintain history.

## Project Structure

### Documentation (this feature)

```text
specs/026-license-replacement/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
| backend/
|   │   ├── Mojaz.Domain/
|   │   │   ├── Enums/
|   │   │   └── Entities/
|   │   ├── Mojaz.Application/
|   │   │   ├── Interfaces/
|   │   │   ├── Services/
|   │   │   └── DTOs/
|   │   ├── Mojaz.Infrastructure/
|   │   │   └── Persistence/
|   │   └── Mojaz.API/
|   │       └── Controllers/
|   └── frontend/
|       ├── src/
|       │   ├── app/[locale]/
|       │   ├── components/domain/application/
|       │   └── services/
```

**Structure Decision**: Clean Architecture (Web Application option) as mandated by the Constitution.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
