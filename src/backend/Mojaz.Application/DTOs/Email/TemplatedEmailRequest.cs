namespace Mojaz.Application.DTOs.Email
{
    public class TemplatedEmailRequest
    {
        public string RecipientEmail { get; set; }
        public string TemplateName { get; set; }
        public object TemplateData { get; set; }
        public List<EmailAttachment> Attachments { get; set; }
        public string ReferenceId { get; set; }
    }
}
