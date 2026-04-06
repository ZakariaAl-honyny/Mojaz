namespace Mojaz.Domain.Entities.Config;

using Base;

/// <summary>
/// System-wide settings and configuration parameters.
/// Used for feature flags, thresholds, and operational settings.
/// </summary>
public class SystemSetting : BaseEntity
{
    /// <summary>
    /// Unique key identifying the setting (e.g., "MAX_APPOINTMENT_DAYS_AHEAD").
    /// </summary>
    public string Key { get; set; }

    /// <summary>
    /// The configuration value (stored as string, parsed by type).
    /// </summary>
    public string Value { get; set; }

    /// <summary>
    /// Human-readable description of what this setting controls.
    /// </summary>
    public string Description { get; set; }

    /// <summary>
    /// Data type of the value (e.g., "int", "bool", "datetime", "string").
    /// </summary>
    public string DataType { get; set; }

    /// <summary>
    /// Whether this setting is publicly visible or admin-only.
    /// </summary>
    public bool IsPublic { get; set; } = false;
}
