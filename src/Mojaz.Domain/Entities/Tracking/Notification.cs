namespace Mojaz.Domain.Entities.Tracking;

using Base;

/// <summary>
/// User notifications for application updates and alerts.
/// Tracks all notifications sent to users.
/// </summary>
public class Notification : BaseEntity
{
    /// <summary>
    /// ID of the user receiving the notification.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// Type of event triggering the notification.
    /// </summary>
    public string EventType { get; set; }

    /// <summary>
    /// Notification title.
    /// </summary>
    public string Title { get; set; }

    /// <summary>
    /// Notification message content.
    /// </summary>
    public string Message { get; set; }

    /// <summary>
    /// Whether the notification has been read by the user.
    /// </summary>
    public bool IsRead { get; set; }

    /// <summary>
    /// Timestamp when the notification was created.
    /// </summary>
    public DateTime CreatedAt { get; set; }
}
