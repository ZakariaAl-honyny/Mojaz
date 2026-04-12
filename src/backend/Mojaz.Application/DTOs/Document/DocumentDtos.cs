using Microsoft.AspNetCore.Http;
using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Application.DTOs.Document;

public class UploadDocumentRequest
{
    public DocumentType DocumentType { get; set; }
    public IFormFile File { get; set; } = null!;
}

public class DocumentDto
{
    public Guid Id { get; set; }
    public Guid ApplicationId { get; set; }
    public DocumentType DocumentType { get; set; }
    public string DocumentTypeName { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public DocumentStatus Status { get; set; }
    public string? RejectionReason { get; set; }
    public Guid? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public string DownloadUrl { get; set; } = string.Empty;
}

public class DocumentReviewRequest
{
    public bool Approved { get; set; }
    public string? RejectionReason { get; set; }
}

public class DocumentRequirementDto
{
    public DocumentType DocumentType { get; set; }
    public string DocumentTypeName { get; set; } = string.Empty;
    public bool IsRequired { get; set; }
    public bool IsConditional { get; set; }
    public string? ConditionDescription { get; set; }
    public bool HasUpload { get; set; }
    public DocumentStatus? Status { get; set; }
    public Guid? DocumentId { get; set; }
}

public class BulkApproveResponse
{
    public int ApprovedCount { get; set; }
    public List<Guid> ApprovedDocumentIds { get; set; } = new();
}
