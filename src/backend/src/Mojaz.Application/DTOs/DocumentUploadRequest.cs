using Microsoft.AspNetCore.Http;

namespace Mojaz.Application.DTOs
{
    public class DocumentUploadRequest
    {
        public string DocumentType { get; set; } = string.Empty;
        public IFormFile File { get; set; } = null!;
    }
}