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
    public string FileName { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public DocumentStatus Status { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime UploadedAt { get; set; }
}

public class DocumentReviewRequest
{
    public bool Approved { get; set; }
    public string? RejectionReason { get; set; }
}
