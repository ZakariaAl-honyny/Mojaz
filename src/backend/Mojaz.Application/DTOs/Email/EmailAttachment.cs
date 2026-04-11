namespace Mojaz.Application.DTOs.Email
{
    public class EmailAttachment
    {
        public required string FileName { get; set; } = default!;
        public required byte[] Content { get; set; } = default!;
        public required string ContentType { get; set; } = default!;
    }
}
