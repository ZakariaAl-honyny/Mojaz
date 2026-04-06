namespace Mojaz.Domain.Entities.Identity;

using Base;

/// <summary>
/// One-time password code for authentication and verification.
/// Used for email, SMS, or other verification processes.
/// </summary>
public class OtpCode : BaseEntity
{
    /// <summary>
    /// ID of the user requesting the OTP.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// The OTP code (numeric or alphanumeric).
    /// </summary>
    public string Code { get; set; }

    /// <summary>
    /// Timestamp when the OTP expires.
    /// </summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>
    /// Whether the OTP has been used.
    /// </summary>
    public bool IsUsed { get; set; }
}
