namespace Mojaz.Application.DTOs.Email
{
    public class TemplatedEmailRequest
    {
        public required string RecipientEmail { get; set; }
        public required string TemplateName { get; set; }
        public object? TemplateData { get; set; }
        public List<EmailAttachment>? Attachments { get; set; }
        public required string ReferenceId { get; set; }
    }
}
