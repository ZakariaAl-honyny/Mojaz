# Research: 022 — Final Approval with Gate 4 Validation

**Branch**: `022-final-approval` | **Phase**: 0 — Research | **Date**: 2026-04-10

---

## RES-001: Gate 4 Validation — Architecture Pattern

**Decision**: Implement Gate 4 as a dedicated `IGate4ValidationService` interface in the Application layer with a concrete implementation in the same Application layer (pure business logic — no infrastructure dependencies). The service returns a structured `Gate4ValidationResult` value object listing every condition and its pass/fail status.

**Rationale**: Gate 4 is the core business rule of this feature. Consistent with Clean Architecture Principle I, it MUST live in the Application layer, not the controller. Separating it into its own service lets the `FinalApprovalService` call it, and also lets the frontend call a GET endpoint to display the checklist without triggering a side-effect.

**Alternatives considered**:
- Embedding gate logic in `ApplicationService`: Rejected — `ApplicationService` is already 748 lines and handles the full lifecycle. Gate 4 is a cohesive unit of business logic deserving its own service.
- Doing validation inside the controller action: Rejected — violates Principle I and the "thin controllers" rule explicitly stated in the constitution.

---

## RES-002: Final Approval Decision — New Service vs. Extending ApplicationService

**Decision**: Create a new `IFinalApprovalService` interface in `Mojaz.Application.Interfaces.Services` with a concrete `FinalApprovalService` in `Mojaz.Application.Services`. The service encapsulates Gate 4 validation + all three decision actions (Approve, Reject, Return).

**Rationale**: `IApplicationService` already has 11 method signatures. Adding 3-4 more methods for a distinct workflow stage increases coupling. A dedicated service follows the Single Responsibility Principle and mirrors the pattern used for `ITheoryService`, `IPracticalService`, `ITrainingService` etc.

**Alternatives considered**:
- Adding `FinalizeAsync(...)` to `IApplicationService`: Rejected for the reasons above.
- Three separate services (IApproveService, IRejectService, IReturnService): Over-engineered. One `IFinalApprovalService` covering all three decisions is sufficient.

---

## RES-003: Security Block Check — Data Source

**Decision**: The `User` entity does NOT have an explicit `IsSecurityBlocked` flag. The security block check will use a combination of `User.IsLocked` (existing) as the **MVP proxy** for a security/regulatory block. A `IsSecurityBlocked` boolean property will be **added to the `User` entity** in the Domain layer to properly semantically differentiate a security block from an account lockout. The Gate 4 check will read `User.IsSecurityBlocked`.

**Rationale**: `User.IsLocked` serves the authentication lockout purpose. A security block (placed by the Security/Regulatory role) is a different concern — it must persist independently of login lockout state. Adding `IsSecurityBlocked` keeps the domain semantically correct with zero infrastructure dependencies.

**Alternatives considered**:
- Re-using `IsLocked` for security blocks: Rejected — conflates authentication lockout with regulatory status. A user could be locked for too many failed logins but not be security-blocked, and vice versa.
- Creating a separate `SecurityBlocks` table: Deferred to Phase 2 (per spec assumptions). MVP uses the flag approach.

---

## RES-004: Application Entity — New Fields Strategy

**Decision**: Add Final Approval decision fields to the existing `Application` entity as nullable properties. No new table is needed in MVP. The fields added are:
- `FinalDecision` (enum: `FinalDecisionType?`) — nullable until a decision is made
- `FinalDecisionBy` (Guid?) — Manager's UserId
- `FinalDecisionAt` (DateTime?) — UTC timestamp
- `FinalDecisionReason` (string?) — mandatory for Reject/Return
- `ReturnToStage` (string?) — the stage key to return to, for Return action
- `ManagerNotes` (string?, max 1000 chars) — optional notes

A new `FinalDecisionType` enum will be added to the Domain layer: `{ Approved, Rejected, Returned }`.

**Rationale**: The Application entity already holds the full lifecycle of an application: `ReviewedBy`, `ReviewedAt`, `RejectionReason`, `CancelledAt`, `CancellationReason`. The decision to add approval fields directly mirrors the existing pattern rather than creating a separate "ApplicationDecision" table, which would be over-engineered for MVP scope.

**Alternatives considered**:
- Creating `ApplicationDecisions` table: Rejected for MVP; Application entity already holds per-stage decisions (ReviewedBy, RejectionReason). Consistent with existing patterns.
- Using the existing `Notes` or `RejectionReason` field for the final decision: Rejected — those fields are used by Receptionist stage, not Manager final approval. Semantic clarity requires dedicated fields.

---

## RES-005: Return-to-Stage — Valid Target Stages

**Decision**: The allowed `ReturnToStage` values are the existing `ApplicationStages` constants:
- `ApplicationStages.Documents` → status resets to `DocumentReview`
- `ApplicationStages.Medical` → status resets to `MedicalExam`
- `ApplicationStages.Theory` → status resets to `TheoryTest`
- `ApplicationStages.Practical` → status resets to `PracticalTest`

These map to the correctable failure scenarios from Gate 4 (expired ID/docs → Documents, expired medical → Medical, failed test → Theory/Practical).

**Rationale**: Returning to Stages 01, 05 (Training), or 09/10 does not make sense for the final approval "Return" action. The 4 allowed targets cover all realistic correctable Gate 4 failure scenarios.

---

## RES-006: API Endpoint Design

**Decision**: Add two endpoints to `ApplicationsController` (consistent with existing controller per PRD):
1. `GET /api/v1/applications/{id}/gate4` — Returns the Gate 4 validation result (all 6 conditions) without side effects. Accessible by Manager.
2. `POST /api/v1/applications/{id}/finalize` — Records the final decision (Approve/Reject/Return). Manager-only.

**Rationale**: Separating the checklist read (GET) from the decision write (POST) follows REST principles and allows the frontend to poll/refresh the checklist UI independently. Both map onto the existing `ApplicationsController` rather than a new controller, consistent with how `/applications/{id}/cancel` is handled in the existing codebase.

**Alternatives considered**:
- New `FinalApprovalController`: Rejected — would duplicate application ID extraction and authorization boilerplate. The existing `ApplicationsController` is the right home for application-lifecycle actions.
- Single `POST` endpoint that both validates and records: Rejected — violates Command-Query Separation. The UI needs to display live validation status without triggering a write.

---

## RES-007: Database Migration Strategy

**Decision**: One EF Core migration: `AddFinalApprovalFields` that:
1. Adds `IsSecurityBlocked` (bool, default false) to `Users` table
2. Adds `FinalDecision`, `FinalDecisionBy`, `FinalDecisionAt`, `FinalDecisionReason`, `ReturnToStage`, `ManagerNotes` to `Applications` table

**Rationale**: Both changes are additive-only (nullable/default-value columns). No data migration or existing record modification needed.

---

## RES-008: Frontend — Component Architecture

**Decision**: The final approval UI will be implemented in the employee portal at:
- `src/frontend/src/app/[locale]/(employee)/applications/[id]/final-approval/page.tsx` — Full-page manager review screen
- `src/frontend/src/components/domain/application/FinalApprovalPanel.tsx` — Gate 4 checklist + decision action panel
- `src/frontend/src/components/domain/application/Gate4Checklist.tsx` — Read-only checklist with pass/fail indicators
- `src/frontend/src/components/domain/application/FinalDecisionModal.tsx` — Confirmation modal for Approve/Reject/Return

**Rationale**: Follows the existing `components/domain/application/` pattern for application-specific UI components. The checklist is a standalone component so it can be embedded in the existing application detail page (`applications/[id]/page.tsx`) as a side panel without duplicating the full page.

---

## RES-009: Notification Events

**Decision**: Use the existing `NotificationEventType` enum. Map final approval outcomes to:
- Approve → `NotificationEventType.FinalApprovalApproved` (new entry)
- Reject → `NotificationEventType.FinalApprovalRejected` (new entry)
- Return → `NotificationEventType.FinalApprovalReturned` (new entry)

All three dispatch: in-app (synchronous) + email/push via Hangfire (async) per Constitution Principle VII.

**Rationale**: Distinct event types allow different notification templates for each decision. The existing `NotificationService` handles the dispatch. Per PRD Push Event #8 "Final Approval" is already defined.

---

## RES-010: Test Strategy

**Decision**: 
- **Unit tests** (`Mojaz.Application.Tests`): `Gate4ValidationServiceTests` and `FinalApprovalServiceTests` covering all gate conditions, all three decision paths, authorization guardrails, and edge cases (concurrent modification, expired docs).
- **Integration tests** (`Mojaz.API.Tests`): Controller-level tests verifying the `GET gate4` and `POST finalize` endpoints respect role constraints.

Naming: `MethodName_Scenario_ExpectedResult` per Constitution Principle VI.

---

## Summary — All NEEDS CLARIFICATION Resolved

| Item | Resolution |
|------|-----------|
| Security block data source | `IsSecurityBlocked` flag added to `User` entity (MVP) |
| Return stage targets | 4 allowed: Documents, Medical, Theory, Practical |
| New service or extend existing | New `IFinalApprovalService` + `FinalApprovalService` |
| API endpoint shape | 2 endpoints on `ApplicationsController`: GET gate4 + POST finalize |
| Application entity changes | 6 new nullable fields + `FinalDecisionType` enum |
| Migration | Single additive migration, no data changes |
