namespace Mojaz.Domain.Entities.Core;

using Base;

/// <summary>
/// Document uploaded by applicant during application process.
/// Tracks documents like ID, passport, medical records, etc.
/// </summary>
public class Document : BaseEntity
{
    /// <summary>
    /// ID of the application this document belongs to.
    /// </summary>
    public int ApplicationId { get; set; }

    /// <summary>
    /// ID of the user who uploaded the document.
    /// </summary>
    public int UploadedById { get; set; }

    /// <summary>
    /// Type of document (e.g., NationalID, Passport, MedicalCertificate).
    /// </summary>
    public string DocumentType { get; set; }

    /// <summary>
    /// File path or URL where the document is stored.
    /// </summary>
    public string FilePath { get; set; }

    /// <summary>
    /// Whether the document has been verified by an admin.
    /// </summary>
    public bool IsVerified { get; set; }

    /// <summary>
    /// Timestamp when the document was uploaded.
    /// </summary>
    public DateTime UploadedAt { get; set; }
}
