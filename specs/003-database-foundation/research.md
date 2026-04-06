# Research: Database Foundation & Seed Data

## EF Core Configurations strategy

**Decision**: Use fluent API configured via `IEntityTypeConfiguration<T>` in separate configuration classes.
**Rationale**: Keeps the `ApplicationDbContext` clean and perfectly matches Clean Architecture. We will enforce constraints such as unique indexes, max lengths, defaults, and the global query filter for `IsDeleted = false` on soft-deletable entities.
**Alternatives considered**: Data annotations on entities. Rejected because our constitution specifies no infrastructure dependencies in the Domain layer, and fluent configuration gives deeper control over SQL Server-specific mappings.

## Automatic Seed Data Injection

**Decision**: Place seed data logic inside `Mojaz.Infrastructure/Data/Seeders` and invoke it optionally or during application startup/middleware if empty, or inside the EF Core `HasData` builder.
**Rationale**: `HasData` is EF Core's built-in mechanism for seeding fixed lookup data (e.g., Roles, Settings, FeeTypes). For larger relational data (like Applications which require hashing or realistic user profiles), a seeder run at initialization (`IApplicationBuilder` extension) is much more robust.
**Alternatives considered**: Manual SQL scripts. Kept as a fallback, but C# seeders keep migrations completely agnostic and type-safe.

## Soft Deletion Implementation

**Decision**: Implement `ISoftDeletable` interface (`IsDeleted`, `DeletedAt`) alongside `IAuditable` on relevant entities. Use global query filters (`modelBuilder.Entity<T>().HasQueryFilter(e => !e.IsDeleted)`) across the board. Override `SaveChangesAsync` in `ApplicationDbContext` to convert deletions to updates.
**Rationale**: Required by constitution. Overriding `SaveChangesAsync` ensures any developer calling `.Remove(entity)` actually performs a soft-delete without having to remember to do it manually.
