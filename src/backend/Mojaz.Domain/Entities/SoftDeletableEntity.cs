namespace Mojaz.Domain.Entities;

/// <summary>
/// Entity that supports soft deletion.
/// Records are never physically deleted from the database.
/// </summary>
public abstract class SoftDeletableEntity : AuditableEntity
{
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}
