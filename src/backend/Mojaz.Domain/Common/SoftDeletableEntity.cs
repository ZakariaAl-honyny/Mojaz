using System;

namespace Mojaz.Domain.Common;

public abstract class SoftDeletableEntity : AuditableEntity
{
    public new bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}
