using DrivingLicenseIssuanceSystem.Domain.Common;

namespace DrivingLicenseIssuanceSystem.Domain.Entities;

public class SystemSetting : AuditableEntity
{
    public string SettingKey { get; set; } = string.Empty;
    public string SettingValue { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? Description { get; set; }
    public bool IsEncrypted { get; set; }
}
