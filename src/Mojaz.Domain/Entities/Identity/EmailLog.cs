namespace Mojaz.Domain.Entities.Identity;

using Base;

/// <summary>
/// Email communication log for audit and delivery tracking.
/// Tracks all emails sent to users.
/// </summary>
public class EmailLog : BaseEntity
{
    /// <summary>
    /// ID of the user who received the email.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// Recipient email address.
    /// </summary>
    public string Recipient { get; set; }

    /// <summary>
    /// Email subject line.
    /// </summary>
    public string Subject { get; set; }

    /// <summary>
    /// Email body content.
    /// </summary>
    public string Body { get; set; }

    /// <summary>
    /// Delivery status (e.g., Sent, Pending, Failed, Bounced).
    /// </summary>
    public string Status { get; set; }

    /// <summary>
    /// Timestamp when the email was sent.
    /// </summary>
    public DateTime SentAt { get; set; }
}
