# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

License generation and issuance system (Workflow Stage 10). Generates a unique license number (MOJ-YYYY-XXXXXXXX), calculates expiry based on category (5/10 years), generates a high-quality bilingual PDF using QuestPDF stored in Blob Storage, handles multiple issuance trigger collisions gracefully (409 Conflict), and provides a secure download endpoint.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: C# / .NET 8 (Backend), React / Next.js 15 (Frontend)
**Primary Dependencies**: Entity Framework Core 8, QuestPDF, FluentValidation
**Storage**: SQL Server 2022 (Licenses metadata), Blob Storage (NEEDS CLARIFICATION: exact blob storage provider AWS S3/Azure Blob/Local system)
**Testing**: xUnit, Moq, FluentAssertions
**Target Platform**: .NET Web API
**Project Type**: Web API Endpoint & PDF Generator
**Performance Goals**: PDF generation completes in under 2 seconds per request.
**Constraints**: Must ensure idempotency (return 409 Conflict if already issued). Immutability of PDF.
**Scale/Scope**: High-volume, synchronous API endpoint execution for all licenses.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Clean Architecture Supremacy**: License generation logic MUST reside in the Application service. PDF generation utility can reside in Infrastructure. Controllers must remain thin. ZERO external dependencies in Domain.
2. **Security First**: Download endpoint MUST authorize ownership or administrative access.
3. **Configuration over Hardcoding**: Expiry years (10/5) MUST NOT be hardcoded in application logic; should be retrieved from `LicenseCategories` (SystemSettings or DB). 
4. **Internationalization by Default**: PDF must support Arabic RTL (Cairo font or similar) and English LTR.
5. **API Contract Consistency**: Endpoints must return `ApiResponse<T>`.

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
├── Mojaz.Domain/
│   └── Entities/License.cs
├── Mojaz.Application/
│   ├── Interfaces/ILicensePdfGenerator.cs
│   ├── Interfaces/IBlobStorageService.cs
│   └── Services/LicenseIssuanceService.cs
├── Mojaz.Infrastructure/
│   ├── Services/QuestPdfGenerator.cs
│   └── Services/BlobStorageService.cs
└── Mojaz.API/
    └── Controllers/LicensesController.cs

tests/
└── Mojaz.Application.Tests/
    └── Services/LicenseIssuanceServiceTests.cs
```

**Structure Decision**: Standard Mojaz architecture adhering to Clean Architecture principles. Abstractions for PDF generation and Blob storage go into Application, concrete implementations (QuestPDF) in Infrastructure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
