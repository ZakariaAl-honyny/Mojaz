using Mojaz.Domain.Common;
using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Domain.Entities;

public class CategoryUpgrade : AuditableEntity
{
    public Guid LicenseId { get; set; }
    public Guid ApplicationId { get; set; }
    public LicenseCategoryCode FromCategory { get; set; }
    public LicenseCategoryCode ToCategory { get; set; }
    public DateTime UpgradedAt { get; set; } = DateTime.UtcNow;
    public Guid? ProcessedBy { get; set; }

    public virtual License License { get; set; } = null!;
    public virtual Application Application { get; set; } = null!;
}
