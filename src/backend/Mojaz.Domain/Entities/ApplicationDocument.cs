using Mojaz.Domain.Enums;

namespace Mojaz.Domain.Entities;

public class ApplicationDocument : SoftDeletableEntity
{
    public int ApplicationId { get; set; }
    public DocumentType DocumentType { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string StoredFileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string ContentType { get; set; } = string.Empty; // Same as MimeType
    public bool IsRequired { get; set; }
    public DocumentStatus Status { get; set; } = DocumentStatus.Pending;
    public int? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? RejectionReason { get; set; }

    public virtual Application Application { get; set; } = null!;
}