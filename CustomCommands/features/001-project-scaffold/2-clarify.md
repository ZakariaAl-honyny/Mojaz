# Clarify: Backend Solution Scaffold

## Resolved Ambiguities

### 1. MediatR/CQRS vs Direct Service Injection
**Decision:** Direct service injection for MVP simplicity.

### 2. Data Annotations vs Fluent API for EF Core
**Decision:** Fluent API only (in Infrastructure/Configurations/).

### 3. Global Query Filters for Soft Delete
**Decision:** Yes, HasQueryFilter(x => !x.IsDeleted) on all entities with soft delete.

### 4. Docker SQL Server Connection String
**Format:** Server=localhost,1433;Database=MojazDB;User Id=sa;Password=as123456;TrustServerCertificate=True

### 5. Generic vs Entity-Specific IRepository
**Decision:** Generic IRepository<T> with option for entity-specific interfaces when custom methods needed.