using System;
using Mojaz.Domain.Common;
using Mojaz.Domain.Enums;

namespace Mojaz.Domain.Entities
{
    public class SmsLog : AuditableEntity
    {
        public Guid? ApplicationId { get; set; }
        public Guid UserId { get; set; }
        public required string RecipientNumber { get; set; }
        public required string TemplateType { get; set; }
        public SmsStatus Status { get; set; }
        public string? TwilioMessageId { get; set; }
        public decimal? Cost { get; set; }
        public string? ErrorMessage { get; set; }
        public bool IsDeleted { get; set; } = false;

        public virtual User User { get; set; } = null!;
        public virtual Application? Application { get; set; }
    }
}