namespace Mojaz.Application.DTOs
{
    public class DocumentDto
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public string DocumentType { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string FileExtension { get; set; } = string.Empty;
        public string FileGuid { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string MimeType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; // Pending, Approved, Rejected
        public string? ReviewReason { get; set; }
        public string? ReviewedBy { get; set; }
        public DateTime ReviewedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}