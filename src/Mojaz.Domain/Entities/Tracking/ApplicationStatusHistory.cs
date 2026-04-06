namespace Mojaz.Domain.Entities.Tracking;

using Base;

/// <summary>
/// Application status history for audit trail and workflow tracking.
/// Records all status transitions and reasons.
/// </summary>
public class ApplicationStatusHistory : BaseEntity
{
    /// <summary>
    /// ID of the application whose status changed.
    /// </summary>
    public int ApplicationId { get; set; }

    /// <summary>
    /// Previous status before the change.
    /// </summary>
    public string FromStatus { get; set; }

    /// <summary>
    /// New status after the change.
    /// </summary>
    public string ToStatus { get; set; }

    /// <summary>
    /// ID of the user who changed the status.
    /// </summary>
    public int? ChangedByUserId { get; set; }

    /// <summary>
    /// Reason for the status change.
    /// </summary>
    public string Reason { get; set; }

    /// <summary>
    /// Timestamp when the status was changed.
    /// </summary>
    public DateTime ChangedAt { get; set; }
}
