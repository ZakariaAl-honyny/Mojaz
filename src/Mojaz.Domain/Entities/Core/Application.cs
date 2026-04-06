namespace Mojaz.Domain.Entities.Core;

using Base;

/// <summary>
/// License application from an applicant for a specific category.
/// Tracks the entire lifecycle of an application through various statuses.
/// </summary>
public class Application : BaseEntity, IAuditable, ISoftDeletable
{
    /// <summary>
    /// Unique application reference number.
    /// </summary>
    public string ApplicationNumber { get; set; }

    /// <summary>
    /// ID of the applicant submitting the application.
    /// </summary>
    public int ApplicantId { get; set; }

    /// <summary>
    /// ID of the license category being applied for.
    /// </summary>
    public int LicenseCategoryId { get; set; }

    /// <summary>
    /// Current status of the application.
    /// </summary>
    public string Status { get; set; }

    /// <summary>
    /// Timestamp when the application was submitted.
    /// </summary>
    public DateTime SubmittedAt { get; set; }

    /// <summary>
    /// ID of the reviewer who last reviewed this application.
    /// </summary>
    public int? ReviewedBy { get; set; }

    /// <summary>
    /// Timestamp when the entity was created.
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// ID of the user who created this entity.
    /// </summary>
    public int? CreatedBy { get; set; }

    /// <summary>
    /// Timestamp when the entity was last modified.
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    /// <summary>
    /// ID of the user who last modified this entity.
    /// </summary>
    public int? UpdatedBy { get; set; }

    /// <summary>
    /// Whether the entity has been soft-deleted.
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    /// Timestamp when the entity was soft-deleted.
    /// </summary>
    public DateTime? DeletedAt { get; set; }
}
