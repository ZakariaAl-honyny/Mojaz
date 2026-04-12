# Implementation Plan: Database Foundation & Seed Data

**Branch**: `003-database-foundation` | **Date**: 2026-04-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-database-foundation/spec.md`

## Summary

Implement the complete SQL Server database schema for the Mojaz platform, containing 21 tables, their constraints, inter-table relationships, and seeding logic via EF Core Code-First approach as strictly guided by the project constitution.

## Technical Context

**Language/Version**: C# 12 / .NET 8
**Primary Dependencies**: Entity Framework Core 8, SQL Server provider
**Storage**: SQL Server 2022
**Testing**: xUnit + FluentAssertions
**Target Platform**: Cross-platform (.NET Core)
**Project Type**: Web Backend (Infrastructure)
**Performance Goals**: Proper index setup for large datasets
**Constraints**: Follow strict Soft Delete and Auditing constraints
**Scale/Scope**: 21 Core Tables

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Clean Architecture Supremacy**: Entities in `Mojaz.Domain`, EF context and migrations in `Mojaz.Infrastructure`.
- [x] **II. Security First**: No hardcoded secrets. Soft Delete implemented.
- [x] **III. Configuration over Hardcoding**: Tables support all required settings and parameters. Database handles thresholds.
- [x] **IV. Internationalization by Default**: Dual-language columns properly mapped and collations verified.
- [x] **V. API Contract Consistency**: Not directly applicable to the DB foundation layer.
- [x] **VI. Test Discipline**: Tests for DbContext/Entity configurations can be added when needed.
- [x] **VII. Async-First Notifications**: Not applicable.

## Project Structure

### Documentation (this feature)

```text
specs/003-database-foundation/
├── plan.md              # This file
├── research.md          # Technology decisions
├── data-model.md        # Entity data models and configurations
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── Mojaz.Domain/
│   └── Entities/        # Data Models for the 21 tables
├── Mojaz.Infrastructure/
│   ├── Data/
│   │   ├── ApplicationDbContext.cs
│   │   ├── Configurations/  # EF Core Fluent API configs
│   │   └── Seeders/         # Seed data insertion logic
│   └── Migrations/          # EF Core migrations
```

**Structure Decision**: Standard Mojaz Clean Architecture layout.

## Complexity Tracking

None. The schema mappings are standard EF Core.
