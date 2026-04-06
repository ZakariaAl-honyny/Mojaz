namespace Mojaz.Domain.Entities.Tracking;

using Base;

/// <summary>
/// System audit log for compliance and security tracking.
/// Records all significant actions performed in the system.
/// </summary>
public class AuditLog : BaseEntity
{
    /// <summary>
    /// ID of the user who performed the action.
    /// </summary>
    public int? UserId { get; set; }

    /// <summary>
    /// Action performed (e.g., Create, Update, Delete).
    /// </summary>
    public string Action { get; set; }

    /// <summary>
    /// Entity type affected by the action.
    /// </summary>
    public string EntityType { get; set; }

    /// <summary>
    /// JSON representation of values before the change.
    /// </summary>
    public string OldValues { get; set; }

    /// <summary>
    /// JSON representation of values after the change.
    /// </summary>
    public string NewValues { get; set; }

    /// <summary>
    /// Timestamp when the action was logged.
    /// </summary>
    public DateTime LoggedAt { get; set; }
}
