using Mojaz.Domain.Enums;

namespace Mojaz.Domain.Entities;

public class FeeStructure : SoftDeletableEntity
{
    public FeeType FeeType { get; set; }
    public int? LicenseCategoryId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "SAR";
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
    public bool IsActive { get; set; } = true;

    public virtual LicenseCategory? LicenseCategory { get; set; }
}