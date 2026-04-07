namespace Mojaz.Application.DTOs.Email
{
    public class EmailMessage
    {
        public string RecipientEmail { get; set; }
        public string Subject { get; set; }
        public string HtmlBody { get; set; }
        public List<EmailAttachment> Attachments { get; set; }
    }
}
