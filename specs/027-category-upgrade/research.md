# Research: License Category Upgrade

## Decisions & Findings

### 1. Configuration Keys (SystemSettings)
- **Decision**: Use `MIN_HOLDING_PERIOD_UPGRADE` (int, months) for eligibility.
- **Decision**: Use `UPGRADE_TRAINING_REDUCTION_PCNT` (int, 0-100) for training hour calculation.
- **Rationale**: The `ISystemSettingsService` already provides `GetIntAsync`, making this trivial to implement.

### 2. Fee Structure Retrieval
- **Decision**: Fetch fees using `IFeeStructureRepository.GetActiveFeeAsync(FeeType.ApplicationFee, targetCategoryId)`.
- **Rationale**: Upgrade fees are specific to the target category. The `FeeType` for upgrades should be confirmed if a separate `CategoryUpgradeFee` exists, or if `ApplicationFee` is reused with a modifier.
- **NEEDS CLARIFICATION**: Confirm if `FeeType.CategoryUpgrade` exists in the `FeeType` enum.

### 3. Workflow Stage Skipping
- **Decision**: Modify transition points in `TrainingService.cs` and `TheoryService.cs`.
- **Finding**: Currently, `ApplicationStages.Theory` is hardcoded as the successor to `Training`.
- **Plan**: Update `IApplicationWorkflowService` to determine the "Next Logical Stage" based on `ServiceType` and `UpgradePath`.

### 4. Upgrade Path Validation
- **Decision**: Centralize logic in `CategoryUpgradeService`.
- **Pattern**: 
    - `B -> C`: Valid
    - `C -> D`: Valid
    - `D -> E`: Valid
    - `F -> B`: Valid (Special)
    - All others: Invalid.

## Alternatives Considered

- **Hardcoding rules in ApplicationService**: Rejected. Violates Constitution Principle III (Configuration over Hardcoding).
- **Creating a separate workflow for Upgrades**: Rejected. Too much duplication. Better to inject branch logic into the existing 10-stage workflow.

## Unknowns Resolved
- [x] Settings service availability: **CONFIRMED** (`ISystemSettingsService`).
- [x] Fee repository pattern: **CONFIRMED** (`IFeeStructureRepository`).
- [x] Next stage hardcoding: **CONFIRMED** (Found in `TrainingService.cs`).
