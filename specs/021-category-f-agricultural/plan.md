# Implementation Plan: 021-category-f-agricultural

**Branch**: `021-category-f-agricultural` | **Date**: 2026-04-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/021-category-f-agricultural/spec.md`

## Summary

Complete support for the Agricultural Vehicle (Category F) license. This encompasses dynamic settings enforcement (min age 18, training 20 hours), the upgrade path from F->B, and tailored UI presentation utilizing modern best practices for layout stability and bespoke agricultural aesthetic design.

## Technical Context

**Language/Version**: C# 8.0, TypeScript 5.0
**Primary Dependencies**: ASP.NET Core 8, Next.js (App Router) 15, Entity Framework Core 8, Tailwind CSS, shadcn/ui
**Storage**: SQL Server 2022
**Testing**: xUnit, Moq, FluentAssertions, Jest, React Testing Library, Playwright
**Target Platform**: Web (Arabic RTL + English LTR)
**Project Type**: Full-Stack Web Application
**Performance Goals**: < 2 seconds API response time (95th percentile), minimal FID and CLS on UI.
**Constraints**: Clean Architecture layering, Security First (No hardcoded credentials), Configuration over Hardcoding.
**Scale/Scope**: Category F (Agricultural) addition to New License Issuance Workflow.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Clean Architecture Conformity**: Yes. Logic handled in Application service layers. Validation handled via FluentValidation.
- **Security Check**: Yes. Relies on standard RBAC. No password or token exposure.
- **Configurability Rule**: Yes. Age threshold reads from `SystemSettings`.
- **Test Integrity**: Yes. Will include logic tests for F->B upgrades and specialized visual logic.

## Project Structure

### Documentation (this feature)

```text
specs/021-category-f-agricultural/
├── plan.md              
├── research.md          
├── data-model.md        
├── quickstart.md        
└── tasks.md             
```

### Source Code (repository root)

```text
# Option 2: Web application
src/
| backend/
  │   ├── Mojaz.Domain/
  │   ├── Mojaz.Application/
  │   └── Mojaz.Infrastructure/
  └── tests/
      └── Mojaz.Application.Tests/

| frontend/
  ├── src/
  │   ├── app/
  │   ├── components/
  │   └── styles/
  └── tests/
```

**Structure Decision**: Standard Web Application full-stack structure mapped to Mojaz .NET Core backend and Next.js frontend spaces.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None      | N/A        | N/A                                 |
