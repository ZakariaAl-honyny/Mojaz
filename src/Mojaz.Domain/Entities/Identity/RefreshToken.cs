namespace Mojaz.Domain.Entities.Identity;

using Base;

/// <summary>
/// Refresh token for session management and JWT refresh flow.
/// Allows users to obtain new access tokens without re-authenticating.
/// </summary>
public class RefreshToken : BaseEntity
{
    /// <summary>
    /// ID of the user owning this token.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// The refresh token value (JWT or opaque token).
    /// </summary>
    public string Token { get; set; }

    /// <summary>
    /// Timestamp when the refresh token expires.
    /// </summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>
    /// Timestamp when the token was revoked (if applicable).
    /// Null means token is still valid.
    /// </summary>
    public DateTime? RevokedAt { get; set; }

    /// <summary>
    /// IP address from which the token was issued.
    /// Used for security validation on refresh.
    /// </summary>
    public string IpAddress { get; set; }
}
