using Mojaz.Domain.Enums;

namespace Mojaz.Domain.Entities;

public class CategoryUpgrade : AuditableEntity
{
    public int LicenseId { get; set; }
    public int ApplicationId { get; set; }
    public LicenseCategoryCode FromCategory { get; set; }
    public LicenseCategoryCode ToCategory { get; set; }
    public DateTime UpgradedAt { get; set; } = DateTime.UtcNow;
    public int? ProcessedBy { get; set; }

    public virtual License License { get; set; } = null!;
    public virtual Application Application { get; set; } = null!;
}