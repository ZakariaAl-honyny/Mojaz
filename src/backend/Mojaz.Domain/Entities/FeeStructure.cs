using Mojaz.Domain.Common;
using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Domain.Entities;

public class FeeStructure : AuditableEntity
{
    public FeeType FeeType { get; set; }
    public Guid? LicenseCategoryId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "SAR";
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
    public bool IsActive { get; set; } = true;

    public virtual LicenseCategory? LicenseCategory { get; set; }
}
