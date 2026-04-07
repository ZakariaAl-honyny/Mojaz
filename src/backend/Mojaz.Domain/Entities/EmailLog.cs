using System;
using Mojaz.Domain.Enums;

namespace Mojaz.Domain.Entities
{
    public class EmailLog : AuditableEntity
    {
        public Guid Id { get; set; }
        public string RecipientEmail { get; set; }
        public string TemplateName { get; set; }
        public string ReferenceId { get; set; }
        public EmailStatus Status { get; set; }
        public int RetryCount { get; set; }
        public DateTime SentAt { get; set; }
        public string ErrorMessage { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
