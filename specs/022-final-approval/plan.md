# Implementation Plan: 022 — Final Approval with Gate 4 Comprehensive Validation

**Branch**: `022-final-approval` | **Date**: 2026-04-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/022-final-approval/spec.md`

---

## Summary

Feature 022 implements Stage 08 of the New License Issuance workflow — the **Final Approval** gate. A Manager reviews a comprehensive Gate 4 checklist (6 conditions: theory, practical, security, identity, medical, payments) and records one of three decisions: Approve (advances to Issuance Payment), Reject (terminal), or Return (reverts to a correctable prior stage). Gate 4 is enforced server-side on every Approve attempt. Notifications (in-app sync + email/push async via Hangfire) are sent for every decision.

The technical approach introduces a dedicated `IFinalApprovalService` + `IGate4ValidationService` to the Application layer, adds 6 nullable fields to the `Application` entity, one boolean field to `User`, one new enum, and two new API endpoints on the existing `ApplicationsController`. The frontend adds a Gate 4 checklist panel and decision modal in the employee portal.

---

## Technical Context

**Language/Version**: C# 12 / .NET 8 (backend) · TypeScript 5 / Next.js 15 (frontend)
**Primary Dependencies**: EF Core 8, FluentValidation 11, AutoMapper 13, Hangfire 1.8, next-intl 3, React Query 5, shadcn/ui
**Storage**: SQL Server 2022 — 1 additive migration (`AddFinalApprovalFields`)
**Testing**: xUnit + Moq + FluentAssertions (backend) · Jest + React Testing Library (frontend)
**Target Platform**: Web server (ASP.NET Core) + Web browser (Next.js)
**Performance Goals**: Gate 4 validation < 500ms p95 (5 async DB reads); endpoint responses < 2s per PRD NFR
**Constraints**: Must not block primary request on notification failures; Gate 4 must be server-enforced
**Scale/Scope**: MVP (~100-500 concurrent users); ~2 new files per layer

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|:------:|-------|
| **I. Clean Architecture** | ✅ | `IGate4ValidationService` and `IFinalApprovalService` in Application layer. No Infrastructure references from Application. Controllers are thin delegates. |
| **II. Security First** | ✅ | `[Authorize(Roles = "Manager")]` on finalize endpoint. Gate 4 enforced server-side. No secrets hardcoded. AuditLog on every decision. |
| **III. Configuration over Hardcoding** | ✅ | `MEDICAL_VALIDITY_DAYS` read from `SystemSettings`. No magic numbers. |
| **IV. Internationalization** | ✅ | `Gate4Condition` has bilingual `LabelAr/LabelEn` and `FailureMessageAr/FailureMessageEn`. Notification messages bilingual. Frontend uses translation keys. |
| **V. API Contract Consistency** | ✅ | Both endpoints return `ApiResponse<T>`. `[ProducesResponseType]` on all actions. URL follows `/api/v1/applications/{id}/gate4` and `/api/v1/applications/{id}/finalize`. |
| **VI. Test Discipline** | ✅ | Gate4ValidationService unit tests + FinalApprovalService unit tests. 80%+ coverage on service methods. |
| **VII. Async-First Notifications** | ✅ | In-app notification synchronous; Email/Push dispatched via Hangfire background jobs. Main request never blocked by external delivery. |

**Post-Design Re-check**: ✅ All principles upheld. Data model changes are additive. No layer violations introduced.

---

## Project Structure

### Documentation (this feature)

```text
specs/022-final-approval/
├── plan.md              ← This file
├── spec.md              ← Feature specification
├── research.md          ← Phase 0 research output
├── data-model.md        ← Phase 1 data model
├── quickstart.md        ← Phase 1 quickstart
├── contracts/
│   └── api-contracts.md ← API endpoint contracts
├── checklists/
│   └── requirements.md  ← Spec quality checklist
└── tasks.md             ← Phase 2 output (speckit.tasks — not created here)
```

### Source Code

```text
Backend — NEW / MODIFIED files:

Mojaz.Domain/
├── Entities/
│   └── Application.cs          [MODIFIED] +6 nullable fields
│   └── User.cs                 [MODIFIED] +IsSecurityBlocked bool
├── Enums/
│   └── FinalDecisionType.cs    [NEW]
│   └── NotificationEventType.cs [MODIFIED] +3 event values

Mojaz.Application/
├── Interfaces/Services/
│   ├── IGate4ValidationService.cs  [NEW]
│   └── IFinalApprovalService.cs    [NEW]
├── Services/
│   ├── Gate4ValidationService.cs   [NEW]
│   └── FinalApprovalService.cs     [NEW]
├── DTOs/Application/ (or Applications/Dtos/)
│   ├── FinalizeApplicationRequest.cs [NEW]
│   ├── ApplicationDecisionDto.cs     [NEW]
│   └── Gate4ValidationResultDto.cs   [NEW]
├── Validators/
│   └── FinalizeApplicationRequestValidator.cs [NEW]
├── Mappings/
│   └── ApplicationProfile.cs [MODIFIED] +DecisionDto mappings

Mojaz.Infrastructure/
├── Migrations/
│   └── [timestamp]_AddFinalApprovalFields.cs [NEW]
├── Persistence/Configurations/
│   └── ApplicationConfiguration.cs [MODIFIED] +field configs
│   └── UserConfiguration.cs [MODIFIED] +IsSecurityBlocked

Mojaz.API/
└── Controllers/
    └── ApplicationsController.cs [MODIFIED] +2 endpoints

tests/Mojaz.Application.Tests/
├── Services/
│   ├── Gate4ValidationServiceTests.cs [NEW]
│   └── FinalApprovalServiceTests.cs   [NEW]

Frontend — NEW / MODIFIED files:

src/frontend/src/
├── app/[locale]/(employee)/
│   └── applications/[id]/
│       └── final-approval/
│           └── page.tsx                        [NEW]
├── components/domain/application/
│   ├── FinalApprovalPanel.tsx                  [NEW]
│   ├── Gate4Checklist.tsx                      [NEW]
│   └── FinalDecisionModal.tsx                  [NEW]
├── services/
│   └── finalApproval.service.ts                [NEW]
├── types/
│   └── finalApproval.types.ts                  [NEW]
└── public/locales/
    ├── ar/final-approval.json                  [NEW]
    └── en/final-approval.json                  [NEW]
```

**Structure Decision**: Web application (Option 2). Backend follows the established 5-layer Clean Architecture pattern. Frontend follows Next.js App Router with locale-based routing already in place.

---

## Phase 0: Research (Complete — see `research.md`)

All NEEDS CLARIFICATION items resolved:

| Item | Decision |
|------|---------|
| Security block data source | `IsSecurityBlocked` flag on `User` entity (MVP) |
| Return stage targets | 4 stages: Documents, Medical, Theory, Practical |
| New service vs extended | New `IFinalApprovalService` + `IGate4ValidationService` |
| API endpoint design | GET gate4 + POST finalize on `ApplicationsController` |
| Entity changes | 6 nullable fields on `Application`, 1 bool on `User` |
| DB migration | Single additive migration |
| Notification events | 3 new `NotificationEventType` values |

---

## Phase 1: Design (Complete — see `data-model.md` + `contracts/`)

### Entities Changed

| Entity | Change |
|--------|--------|
| `User` | +`IsSecurityBlocked: bool` (default `false`) |
| `Application` | +`FinalDecision`, `FinalDecisionBy`, `FinalDecisionAt`, `FinalDecisionReason`, `ReturnToStage`, `ManagerNotes` |

### New Domain Types

| Type | Kind | Purpose |
|------|------|---------|
| `FinalDecisionType` | Enum | `Approved \| Rejected \| Returned` |
| `Gate4ValidationResult` | Value Object | 6-condition result list (not persisted) |
| `Gate4Condition` | Value Object | Per-condition pass/fail with bilingual messages |

### New DTOs

| DTO | Direction | Notes |
|-----|-----------|-------|
| `FinalizeApplicationRequest` | Request | Decision + reason + returnToStage + managerNotes |
| `ApplicationDecisionDto` | Response | Decision outcome + gate4 snapshot |
| `Gate4ValidationResultDto` | Response | Live checklist state for GET endpoint |

### New Service Interfaces

| Interface | Methods |
|-----------|---------|
| `IGate4ValidationService` | `ValidateAsync(Guid applicationId)` |
| `IFinalApprovalService` | `GetGate4StatusAsync(...)`, `FinalizeAsync(...)` |

### API Endpoints (see `contracts/api-contracts.md`)

| Method | URL | Auth | Purpose |
|--------|-----|------|---------|
| GET | `/api/v1/applications/{id}/gate4` | Manager, Admin | Live gate 4 checklist |
| POST | `/api/v1/applications/{id}/finalize` | Manager only | Record final decision |

### Database Migration

**Name**: `AddFinalApprovalFields`
- `Users`: +`IsSecurityBlocked bit NOT NULL DEFAULT 0`
- `Applications`: +6 nullable columns (`FinalDecision`, `FinalDecisionBy`, `FinalDecisionAt`, `FinalDecisionReason`, `ReturnToStage`, `ManagerNotes`)

### Gate 4 Validation Logic

```
Gate4ValidationService.ValidateAsync(applicationId):
  1. Load Application with Applicant, TheoryTests, PracticalTests, MedicalExaminations, Payments
  2. Check TheoryTest: latest record for this application has TestResult.Passed
  3. Check PracticalTest: latest record for this application has TestResult.Passed  
  4. Check SecurityStatus: Applicant.IsSecurityBlocked == false
  5. Check Identity: applicant.NationalId is not empty AND (IdExpiryDate not set OR IdExpiryDate > DateTime.UtcNow)
  6. Check MedicalCertificate: latest MedicalExamination.ValidUntil > DateTime.UtcNow 
     AND FitnessResult == MedicalFitnessResult.Fit
     MEDICAL_VALIDITY_DAYS read from SystemSettings as fallback if ValidUntil is null
  7. Check Payments: no Payment record for this applicationId has Status == Pending or Failed
  8. Return Gate4ValidationResult{IsFullyPassed, Conditions[6]}
```

### FinalApprovalService.FinalizeAsync Logic

```
FinalizeAsync(applicationId, request, managerId):
  1. Load Application → 404 if not found
  2. Guard: Application.CurrentStage must be FinalApproval stage → 400 if not
  3. Guard: Application.FinalDecision must be null (not already finalized) → 409 if already finalized
  4. Validate request via FinalizeApplicationRequestValidator → 400 on failure
  5. Run Gate4ValidationService.ValidateAsync(applicationId)
  6. IF decision == Approve AND !gate4Result.IsFullyPassed:
       return 400 with list of failing condition messages
  7. Record decision on Application entity:
       Application.FinalDecision = request.Decision → FinalDecisionType
       Application.FinalDecisionBy = managerId
       Application.FinalDecisionAt = DateTime.UtcNow
       Application.FinalDecisionReason = request.Reason
       Application.ReturnToStage = request.ReturnToStage
       Application.ManagerNotes = request.ManagerNotes
  8. Transition Application.Status and CurrentStage based on decision:
       Approve → Status=Approved, CurrentStage="09-IssuancePayment"
       Reject  → Status=Rejected (terminal)
       Return  → Status=<stage-appropriate>, CurrentStage=request.ReturnToStage
  9. Add ApplicationStatusHistory record
  10. SaveChangesAsync()
  11. AuditLog: "FINAL_APPROVAL_{DECISION}", Application, managerId
  12. In-app notification (synchronous)
  13. Hangfire.Enqueue: Email + Push notifications (async)
  14. Return ApiResponse<ApplicationDecisionDto>
```

### Frontend Component Architecture

```
FinalApprovalPage (page.tsx)
├── useGate4Status hook (React Query → GET /gate4)
├── FinalApprovalPanel
│   ├── Gate4Checklist (read-only, green/red indicators, live data from hook)
│   │   └── 6x Gate4ConditionRow (key, label, isPassed indicator, failure message)
│   └── FinalDecisionActions
│       ├── Approve button (disabled if !isFullyPassed)
│       ├── Reject button
│       └── Return button
└── FinalDecisionModal (opens on button click)
    ├── Decision-specific fields (reason textarea, return stage selector)
    ├── Confirmation step
    └── useFinalDecision hook (React Query mutation → POST /finalize)
```

---

## Complexity Tracking

*No Constitution violations require justification. All additions follow established patterns.*

---

## Next Step

Run `/speckit-tasks` to generate the ordered task breakdown from this plan.
