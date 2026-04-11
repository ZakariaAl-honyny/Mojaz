# Research: Reports & Analytics System (028)

## Decision Log

### 1. Data Aggregation Strategy
- **Decision**: Use EF Core LINQ `GroupBy` and `CountAsync` projections.
- **Rationale**: The database size for MVP (<10k records) doesn't warrant a separate read-replica or Materialized Views yet. Projections (`.Select()`) ensure we don't fetch full entity graphs (Principle I).
- **Alternatives**: 
    - Dapper/SQL Views: Rejected for now to maintain consistency with EF Core repository pattern, though may be reconsidered for complex performance joins.

### 2. Delayed Application Threshold (Resolved Clarification)
- **Decision**: **Global Threshold** with Stage Breakdown.
- **Setting**: New key `DELAYED_APPLICATION_THRESHOLD_DAYS` (Default: 14).
- **Rationale**: Simplifies initial configuration while aligning with the PRD's 14-day processed target. The dashboard will show the "Total Delayed Count" but allow drill-down to see which stage the delay occurred in.

### 3. Employee Productivity Metrics (Resolved Clarification)
- **Decision**: **Volume Only** for MVP.
- **Rationale**: Aligns with existing dashboard patterns and avoids privacy/regulatory complexities of "average speed" tracking for medical doctors/examiners. 
- **Fields**: `UserId`, `FullName`, `Role`, `TotalFinalized`.

### 4. Charting & Visualization
- **Decision**: **Recharts**.
- **Rationale**: Included in the PRD Tech Stack (Section 4.1). Supports responsive containers and fits the Mojaz/Absher aesthetic better than Chart.js.
- **Color Mapping**: 
    - Approved: `#10B981` (Status Success)
    - Rejected: `#EF4444` (Status Error)
    - Warning: `#F59E0B`
    - Primary: `#006C35`

### 5. Export Strategy
- **Decision**: Server-side CSV generation + Client-side PDF Print.
- **Rationale**: 
    - CSV: High precision data for Excel analysis.
    - PDF: Dashboard snapshots can be handled via CSS `@media print` for MVP, or QuestPDF generic tables if a formal document is required. Decision: Initial implementation focuses on CSV for raw data.

## Implementation Notes

- **Read-Only Context**: Implementation will use `AsNoTracking()` explicitly in all service calls to prevent change tracking overhead.
- **Date Range Precision**: All filters will be inclusive (`>= FromDate`, `<= ToDate`) and assume UTC as per Principle III.
