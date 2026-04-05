using Mojaz.Domain.Common;
using System;

namespace Mojaz.Domain.Entities;

public class LicenseRenewal : AuditableEntity
{
    public Guid LicenseId { get; set; }
    public Guid ApplicationId { get; set; }
    public DateTime RenewedAt { get; set; } = DateTime.UtcNow;
    public DateTime NewExpiresAt { get; set; }
    public Guid? ProcessedBy { get; set; }

    public virtual License License { get; set; } = null!;
    public virtual Application Application { get; set; } = null!;
}
