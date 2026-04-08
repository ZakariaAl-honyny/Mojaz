namespace Mojaz.Application.DTOs.Email
{
    public class EmailMessage
    {
        public required string RecipientEmail { get; set; }
        public required string Subject { get; set; }
        public required string HtmlBody { get; set; }
        public List<EmailAttachment>? Attachments { get; set; }
    }
}
