using System;

namespace Mojaz.Application.DTOs.License
{
    public class LicenseDto
    {
        public int Id { get; set; }
        public string LicenseNumber { get; set; } = string.Empty;
        public int ApplicationId { get; set; }
        public int HolderId { get; set; }
        public int LicenseCategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public DateTime IssuedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? BlobUrl { get; set; }
    }
}
