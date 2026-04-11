# Research Document: Training Records System (018)

## Single Record vs. Multi-Session Architecture

- **Decision**: One `TrainingRecord` per application. Hours accumulate via additive PATCH updates. The existing domain stub already reflects this (single entity, no session sub-table).
- **Rationale**: PRD Section 12.3 confirms training is externally conducted at schools and the system only records completion. Multi-session tables add complexity with no user-facing benefit in MVP. The `TrainingDate` field captures the school-certified completion date.
- **Alternatives considered**: Separate `TrainingSessions` table with each visit as a row (Rejected — over-engineering for MVP; school integration is simulated, not real-time).

---

## TrainingStatus Enum vs. String Column

- **Decision**: Introduce a strongly-typed `TrainingStatus` enum in `Mojaz.Domain/Enums/`. The existing `TrainingRecord.Status` property is a raw string — replace with the enum.
- **Rationale**: Enum prevents invalid state assignments, enables compile-time safety, and mirrors the pattern used for `FitnessResult` in `MedicalExamination.cs`. Constitution Principle I demands domain purity.
- **Alternatives considered**: Keep string column with constants class (Rejected — loses compile-time safety; more error-prone for Gate 3 comparisons).

---

## Gate 3 Implementation Location

- **Decision**: Gate 3 validation lives in `AppointmentBookingValidator.cs` (already exists) as an additional async rule: call `ITrainingService.IsTrainingCompleteAsync(applicationId)` before allowing appointment creation for Theory/Practical types.
- **Rationale**: The existing `AppointmentBookingValidator` already enforces Gate logic for the appointment booking flow. Adding training validation here ensures a single enforcement point regardless of booking entry path. This avoids duplicating gate logic in both the appointment and training services.
- **Alternatives considered**: Separate `GateValidationService` (Rejected — premature abstraction for MVP; existing validator already handles similar gate checks for medical fitness).

---

## Exemption Approval: Separate Sub-resource vs. PATCH on TrainingRecord

- **Decision**: Distinct URIs for exemption actions: `POST /api/v1/training-records/exemption` (submit), `PATCH .../exemption/{id}/approve`, `PATCH .../exemption/{id}/reject`. Training record itself is not directly PATCH-ed for exemption status.
- **Rationale**: Matches AGENTS.md API conventions (actions as PATCH on sub-resources). Separating exemption as its own sub-resource with Manager-only authorization keeps role enforcement clean and auditable.
- **Alternatives considered**: Single `PATCH /training-records/{id}` with an `action` field (Rejected — conflates Employee and Manager permissions on a single endpoint; harder to audit and authorize).

---

## Frontend Data Fetching Strategy (Vercel Best Practices)

- **Decision**: Training page Server Component fetches training record, application metadata, and SystemSettings required hours using `Promise.all()` in a single async server function. `React.cache()` wraps the SystemSettings fetch. Client islands (`TrainingEntryForm`) use TanStack Query with `useTransition` for optimistic mutation.
- **Rationale**: Implements `async-parallel` (no sequential awaits for independent data), `server-cache-react` (dedup SystemSettings per request), and `rerender-transitions` (non-blocking form submission). Matches Vercel Engineering patterns for RSC + client island hybrid architecture.
- **Alternatives considered**: Full client-side fetch via `useEffect` cascade (Rejected — creates request waterfall; violates `async-parallel` rule; increases LCP by 300–800ms).

---

## Premium UI Aesthetic Direction

- **Decision**: Governmental Authority / Ledger aesthetic. IBM Plex Sans Arabic (body) + IBM Plex Mono (numbers/hour counts). Warm off-white (#FAF9F6) background, Royal Green (#006C35) authority ink, Government Gold (#D4A017) for Exempted state. Circular SVG progress arc as the centrepiece — pure CSS stroke-dasharray animation.
- **Rationale**: Drives FR-015 through FR-019 from spec. The "ledger" feel of IBM Plex Mono for numeric data (hours completed / required) creates instant authority associations appropriate for a government tracking interface. Circular arcs are far more spatially expressive than progress bars and communicate completion percentage at a glance.
- **Alternatives considered**: Generic shadcn/ui form with primary color overrides (Rejected — violates frontend-design skill's core directive to avoid generic AI aesthetics); standard linear progress bar (Rejected — lacks visual impact, too generic).
