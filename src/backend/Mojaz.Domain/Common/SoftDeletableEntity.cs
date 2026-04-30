using System;

namespace Mojaz.Domain.Common;

public abstract class SoftDeletableEntity : AuditableEntity
{
    public DateTime? DeletedAt { get; set; }
    public int? DeletedBy { get; set; }
}
