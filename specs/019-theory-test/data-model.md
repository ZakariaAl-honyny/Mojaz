# Data Model: 019 — Theory Test Recording

**Feature**: Theory Test Recording with Attempt Tracking and Retake Logic
**Branch**: `019-theory-test`
**Created**: 2026-04-09

---

## Entities

### `TheoryTest` (updated)

| Field | Type | Nullable | Notes |
|-------|------|:--------:|-------|
| `Id` | `Guid` | ❌ | PK (from `SoftDeletableEntity`) |
| `ApplicationId` | `Guid` | ❌ | FK → `Applications.Id` |
| `ExaminerId` | `Guid` | ❌ | FK → `Users.Id` |
| `AttemptNumber` | `int` | ❌ | 1-based; denotes which attempt this is |
| `ConductedAt` | `DateTime` | ❌ | UTC; replaces `TestDate` |
| `Score` | `int?` | ✅ | `null` when `IsAbsent = true`; 0–100 otherwise |
| `PassingScore` | `int` | ❌ | Snapshot of `MIN_PASS_SCORE_THEORY` at time of test |
| `Result` | `TestResult` | ❌ | Enum: `Pass`, `Fail`, `Absent` |
| `IsAbsent` | `bool` | ❌ | `true` = no-show; counts as failed attempt |
| `Notes` | `string?` | ✅ | Examiner comments; max 500 chars |
| `IsDeleted` | `bool` | ❌ | Soft-delete flag (from `SoftDeletableEntity`) |
| `CreatedAt` | `DateTime` | ❌ | UTC (from `AuditableEntity`) |
| `UpdatedAt` | `DateTime?` | ✅ | UTC (from `AuditableEntity`) |

**Indexes**:
- `IX_TheoryTests_ApplicationId` — for history lookup
- `IX_TheoryTests_ExaminerId` — for examiner audit queries

**EF Constraints**:
- `Notes`: `HasMaxLength(500)`
- `Score`: `IsRequired(false)` (nullable)
- `Examiner` navigation: `OnDelete(DeleteBehavior.Restrict)` — no cascade on user delete
- `Application` navigation: `OnDelete(DeleteBehavior.Cascade)`

---

### `Application` (additions)

| Field | Type | Nullable | Notes |
|-------|------|:--------:|-------|
| `TheoryAttemptCount` | `int` | ❌ | Default: `0`; denormalized count for fast Gate 3 checks |

**Navigation added**:
```csharp
public virtual ICollection<TheoryTest> TheoryTests { get; set; } = [];
```

---

## State Machine

```
ApplicationStatus.TheoryTest (Stage: "06: Theory")
        │
        ├──[Score >= MIN_PASS_SCORE_THEORY]──────────► ApplicationStatus.PracticalTest
        │                                               CurrentStage = "07: Practical"
        │
        └──[Score < MIN_PASS_SCORE_THEORY OR IsAbsent]
                │
                ├──[TheoryAttemptCount < MAX_THEORY_ATTEMPTS]──► status unchanged
                │                                                 cooling period enforced at booking
                │
                └──[TheoryAttemptCount == MAX_THEORY_ATTEMPTS]──► ApplicationStatus.Rejected
                                                                    RejectionReason = "MaxTheoryAttemptsReached"
```

---

## SystemSettings Dependencies

| Key | Default | Changed From |
|-----|---------|--------------|
| `MIN_PASS_SCORE_THEORY` | `80` | **NEW — must be seeded** |
| `MAX_THEORY_ATTEMPTS` | `3` | Existing |
| `COOLING_PERIOD_DAYS` | `7` | Existing |

---

## Relationships

```
Applications  1 ──── * TheoryTests
Users         1 ──── * TheoryTests (as Examiner)
```

---

## Migration Notes

1. **Rename column**: `TheoryTests.TestDate` → `TheoryTests.ConductedAt`
2. **Alter column**: `TheoryTests.Score` `int NOT NULL` → `int NULL` (set existing to 0 first)
3. **Add column**: `TheoryTests.IsAbsent` `bit NOT NULL DEFAULT 0`
4. **Add column**: `Applications.TheoryAttemptCount` `int NOT NULL DEFAULT 0`
5. **Add FK**: `TheoryTests.ExaminerId` → `Users.Id`
6. **Add index**: `IX_TheoryTests_ApplicationId`
