namespace Mojaz.Domain.Entities.Base;

/// <summary>
/// Base entity class for all domain entities.
/// Provides the primary key (Id) that all entities in the system share.
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// Primary key for the entity.
    /// </summary>
    public int Id { get; set; }
}
