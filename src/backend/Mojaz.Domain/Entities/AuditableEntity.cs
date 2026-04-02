namespace Mojaz.Domain.Entities;

/// <summary>
/// Entity with audit tracking (who created/updated).
/// </summary>
public abstract class AuditableEntity : BaseEntity
{
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
}
