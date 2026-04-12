# Phase 0: Research & Decision Log

## Decision 1: Fee Structure Fetching
**Decision**: Use a dedicated `FeeService` that retrieves the active fee based on `FeeType` and `CategoryId`, verifying `EffectiveFrom` and `EffectiveTo`.
**Rationale**: Eliminates hardcoding and respects the PRD's Constitution rule III (Configuration over Hardcoding).
**Alternatives**: Hardcoding them in `appsettings.json` (rejected - violates Constitution).

## Decision 2: Simulated Payment Processing
**Decision**: The processing delay will be handled natively by `Task.Delay(2000)` on the backend API or simulated completely through a UX loading screen before sending the confirm request. We will put the 2-second delay in the UI before calling the confirm endpoint, maintaining backend performance, or have the `Initiate` endpoint create a "Pending" record and the `Confirm` endpoint finalize it.
**Rationale**: Prevents tying up ASP.NET Core thread pool threads unnecessarily if delayed on the backend, and is closer to how a real payment gateway (like Sadad) works asynchronously.
**Alternatives**: Backend delay (rejected to preserve thread pool capacity).

## Decision 3: PDF Receipt Generation
**Decision**: Use `QuestPDF` inside `Infrastructure` (or `Application` if abstract dependencies are correctly supplied).
**Rationale**: Required by PRD/Constitution. Generates high-quality branded documents without overhead.
