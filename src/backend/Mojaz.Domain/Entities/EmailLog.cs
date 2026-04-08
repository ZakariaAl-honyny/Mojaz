using System;
using Mojaz.Domain.Enums;

namespace Mojaz.Domain.Entities
{
    public class EmailLog : AuditableEntity
    {
        public new Guid Id { get; set; }
        public required string RecipientEmail { get; set; }
        public required string TemplateName { get; set; }
        public required string ReferenceId { get; set; }
        public EmailStatus Status { get; set; }
        public int RetryCount { get; set; }
        public DateTime SentAt { get; set; }
        public string? ErrorMessage { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
