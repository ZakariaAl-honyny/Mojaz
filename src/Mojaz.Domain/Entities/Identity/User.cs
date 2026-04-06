namespace Mojaz.Domain.Entities.Identity;

using Base;

/// <summary>
/// Core user identity entity for applicants, employees, and admins.
/// Tracks user credentials, profile information, and account status.
/// </summary>
public class User : BaseEntity, IAuditable, ISoftDeletable
{
    /// <summary>
    /// User's first name.
    /// </summary>
    public string FirstName { get; set; }

    /// <summary>
    /// User's last name.
    /// </summary>
    public string LastName { get; set; }

    /// <summary>
    /// User's email address (unique identifier for login).
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// Hashed password (never store plain text).
    /// </summary>
    public string PasswordHash { get; set; }

    /// <summary>
    /// User's phone number.
    /// </summary>
    public string PhoneNumber { get; set; }

    /// <summary>
    /// National ID number (unique per country regulations).
    /// </summary>
    public string NationalId { get; set; }

    /// <summary>
    /// Gender (e.g., Male, Female).
    /// </summary>
    public string Gender { get; set; }

    /// <summary>
    /// Whether the user account is active.
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Timestamp of the last successful login.
    /// </summary>
    public DateTime? LastLoginAt { get; set; }

    /// <summary>
    /// Registration method (e.g., Email, Phone, Social).
    /// </summary>
    public string RegistrationMethod { get; set; }

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
