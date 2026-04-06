namespace Mojaz.Domain.Entities.Core;

using Base;

/// <summary>
/// Issued driving license to a user.
/// Represents an active or expired license for a category.
/// </summary>
public class License : BaseEntity
{
    /// <summary>
    /// Unique license number (printed on the physical card).
    /// </summary>
    public string LicenseNumber { get; set; }

    /// <summary>
    /// ID of the application this license was issued from.
    /// </summary>
    public int ApplicationId { get; set; }

    /// <summary>
    /// ID of the user holding this license.
    /// </summary>
    public int HolderId { get; set; }

    /// <summary>
    /// ID of the license category.
    /// </summary>
    public int LicenseCategoryId { get; set; }

    /// <summary>
    /// Status of the license (e.g., Active, Expired, Revoked, Suspended).
    /// </summary>
    public string Status { get; set; }

    /// <summary>
    /// Timestamp when the license was issued.
    /// </summary>
    public DateTime IssuedAt { get; set; }

    /// <summary>
    /// Timestamp when the license expires.
    /// </summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>
    /// Timestamp when the license was revoked (if applicable).
    /// </summary>
    public DateTime? RevokedAt { get; set; }
}
