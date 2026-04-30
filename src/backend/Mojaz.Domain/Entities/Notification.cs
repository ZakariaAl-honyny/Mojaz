using Mojaz.Domain.Enums;

namespace Mojaz.Domain.Entities;

public class Notification : BaseEntity
{
    public int UserId { get; set; }
    public int? ApplicationId { get; set; }
    public NotificationEventType EventType { get; set; }
    public string TitleAr { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string MessageAr { get; set; } = string.Empty;
    public string MessageEn { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public int? RelatedEntityId { get; set; }
    public string? RelatedEntityType { get; set; }

    public virtual User User { get; set; } = null!;
}