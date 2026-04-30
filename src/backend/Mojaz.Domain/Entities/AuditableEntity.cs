namespace Mojaz.Domain.Entities;

/// <summary>
/// Entity with audit tracking (who created/updated).
/// </summary>
public abstract class AuditableEntity : BaseEntity
{
    public int? CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }
}