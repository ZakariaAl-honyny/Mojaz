using Mojaz.Domain.Common;
using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Domain.Entities;

public class ApplicationDocument : AuditableEntity
{
    public Guid ApplicationId { get; set; }
    public DocumentType DocumentType { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty; // Same as MimeType
    public bool IsRequired { get; set; }
    public DocumentStatus Status { get; set; } = DocumentStatus.Uploaded;
    public Guid? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public virtual Application Application { get; set; } = null!;
}
