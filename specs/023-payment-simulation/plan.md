# Implementation Plan: Multi-Point Payment Simulation

**Branch**: `023-payment-simulation` | **Date**: 2026-04-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/023-payment-simulation/spec.md`

## Summary

Implement a multi-point payment simulation supporting 6 distinct payment points in the workflow. The feature reads configurable fee amounts from the `FeeStructures` table, provides a simulated 2-second processing delay with customizable failure rates, generates branded PDF receipts using QuestPDF, and tracks payment history.

## Technical Context

**Language/Version**: C# 12 / .NET 8, TypeScript 5 / Next.js 15
**Primary Dependencies**: EF Core 8, QuestPDF, React Query 5, Tailwind CSS
**Storage**: SQL Server 2022
**Testing**: xUnit + Moq + FluentAssertions (Backend), Jest + RTL (Frontend)
**Target Platform**: Web (ASP.NET Core backend, React frontend)
**Project Type**: Full-Stack Web Application (Clean Architecture)
**Constraints**: All configurations must reside in db (`FeeStructures`), no hardcoded values.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Clean Architecture Supremacy**: YES. Payment logic will be in `Mojaz.Application`, DB access via Repositories.
- **Security First**: YES. Receipts and endpoints will enforce authorization based on application ownership.
- **Configuration over Hardcoding**: YES. All fees fetched dynamically from `FeeStructures` table.
- **Async-First Notifications**: YES. Receipts/Notification of success/failure can be dispatched asynchronously using Hangfire.
- **API Contract Consistency**: YES. Wrapped in `ApiResponse<T>`.

All gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/023-payment-simulation/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (future)
```

### Source Code (repository root)

```text
src/
├── Mojaz.Domain/              # Enums (FeeType, PaymentStatus), Entities (PaymentTransaction, FeeStructure)
├── Mojaz.Shared/              # Constants, Exceptions
├── Mojaz.Application/         # PaymentService, PDF Generation Logic, DTOs
├── Mojaz.Infrastructure/      # DB Context implementations, EF Core configs
└── Mojaz.API/                 # PaymentsController

frontend/
├── src/
│   ├── app/                   # Payment Pages, History Views
│   ├── components/            # Payment simulation UI, loading spinners
│   ├── services/              # API bindings (payment.service.ts)
│   └── hooks/                 # usePayment.ts
```

**Structure Decision**: Utilizes the standard Mojaz Full-Stack Monorepo layout combining Clean Architecture in ASP.NET Core and App Router in Next.js.
