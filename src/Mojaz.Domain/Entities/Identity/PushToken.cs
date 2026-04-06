namespace Mojaz.Domain.Entities.Identity;

using Base;

/// <summary>
/// Push notification token for mobile devices.
/// Stores device tokens for Firebase, OneSignal, or similar services.
/// </summary>
public class PushToken : BaseEntity
{
    /// <summary>
    /// ID of the user owning the mobile device.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// The device token from the push notification service.
    /// </summary>
    public string Token { get; set; }

    /// <summary>
    /// Type of device (e.g., iOS, Android).
    /// </summary>
    public string DeviceType { get; set; }

    /// <summary>
    /// Timestamp when the token was registered.
    /// </summary>
    public DateTime RegisteredAt { get; set; }
}
