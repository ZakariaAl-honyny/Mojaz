using System;

namespace Mojaz.Application.DTOs.License
{
    public class LicenseDto
    {
        public Guid Id { get; set; }
        public string LicenseNumber { get; set; } = string.Empty;
        public Guid ApplicationId { get; set; }
        public Guid HolderId { get; set; }
        public Guid LicenseCategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public DateTime IssuedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? BlobUrl { get; set; }
    }
}
