namespace Mojaz.Domain.Entities.Identity;

using Base;

/// <summary>
/// Password reset token for account recovery flow.
/// Tracks reset requests and their completion status.
/// </summary>
public class PasswordReset : BaseEntity
{
    /// <summary>
    /// ID of the user requesting password reset.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// The reset token sent to the user's email.
    /// </summary>
    public string Token { get; set; }

    /// <summary>
    /// Timestamp when the reset token expires.
    /// </summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>
    /// Timestamp when the reset token was used.
    /// Null means it hasn't been used yet.
    /// </summary>
    public DateTime? UsedAt { get; set; }
}
