namespace Mojaz.Domain.Entities.Identity;

using Base;

/// <summary>
/// SMS communication log for audit and delivery tracking.
/// Tracks all SMS messages sent to users.
/// </summary>
public class SmsLog : BaseEntity
{
    /// <summary>
    /// ID of the user who received the SMS.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// Recipient phone number.
    /// </summary>
    public string PhoneNumber { get; set; }

    /// <summary>
    /// SMS message content.
    /// </summary>
    public string Message { get; set; }

    /// <summary>
    /// Delivery status (e.g., Sent, Pending, Failed, Bounced).
    /// </summary>
    public string Status { get; set; }

    /// <summary>
    /// Timestamp when the SMS was sent.
    /// </summary>
    public DateTime SentAt { get; set; }
}
