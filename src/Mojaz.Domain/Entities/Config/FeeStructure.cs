namespace Mojaz.Domain.Entities.Config;

using Base;

/// <summary>
/// Fee structure for license categories and application types.
/// Defines the costs associated with different services.
/// </summary>
public class FeeStructure : BaseEntity
{
    /// <summary>
    /// Unique code for the fee (e.g., APP_FEE, EXAM_FEE).
    /// </summary>
    public string Code { get; set; }

    /// <summary>
    /// Arabic name describing the fee type.
    /// </summary>
    public string NameAr { get; set; }

    /// <summary>
    /// English name describing the fee type.
    /// </summary>
    public string NameEn { get; set; }

    /// <summary>
    /// Category or classification of the fee.
    /// </summary>
    public string Category { get; set; }

    /// <summary>
    /// Fee amount.
    /// </summary>
    public decimal Amount { get; set; }

    /// <summary>
    /// Currency code (e.g., SAR, USD).
    /// </summary>
    public string Currency { get; set; }

    /// <summary>
    /// Optional: License category this fee applies to.
    /// </summary>
    public int? LicenseCategoryId { get; set; }

    /// <summary>
    /// Effective start date for this fee.
    /// </summary>
    public DateTime? EffectiveFrom { get; set; }

    /// <summary>
    /// Effective end date for this fee.
    /// </summary>
    public DateTime? EffectiveTo { get; set; }
}
