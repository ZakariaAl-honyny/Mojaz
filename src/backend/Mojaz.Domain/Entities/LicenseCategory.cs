using Mojaz.Domain.Common;
using Mojaz.Domain.Enums;

namespace Mojaz.Domain.Entities;

public class LicenseCategory : AuditableEntity
{
    public LicenseCategoryCode Code { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public int MinimumAge { get; set; }
    public bool RequiresTraining { get; set; }
    public bool IsActive { get; set; } = true;
    public int ValidityYears { get; set; }
}
