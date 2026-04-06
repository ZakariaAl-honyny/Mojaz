namespace Mojaz.Domain.Entities.Config;

using Base;

/// <summary>
/// License category configuration (e.g., Personal, Commercial, Heavy Vehicle).
/// Defines the types of driving licenses available and their requirements.
/// </summary>
public class LicenseCategory : BaseEntity
{
    /// <summary>
    /// Unique code for the license category (e.g., A, B, C1).
    /// </summary>
    public string Code { get; set; }

    /// <summary>
    /// Arabic name of the license category.
    /// </summary>
    public string NameAr { get; set; }

    /// <summary>
    /// English name of the license category.
    /// </summary>
    public string NameEn { get; set; }

    /// <summary>
    /// Description of the license category and its usage.
    /// </summary>
    public string Description { get; set; }

    /// <summary>
    /// Whether this license category is active and available.
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Number of years the license is valid.
    /// </summary>
    public int ValidityYears { get; set; }

    /// <summary>
    /// Prerequisites for obtaining this category (e.g., "B" requires B category first).
    /// </summary>
    public string RequiresX { get; set; }

    /// <summary>
    /// Minimum age requirement for applicants of this category.
    /// </summary>
    public int MinAge { get; set; }
}
