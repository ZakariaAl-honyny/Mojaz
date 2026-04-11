using System;

namespace Mojaz.Domain.Entities;

public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? UserId { get; set; }
    public string ActionType { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string Payload { get; set; } = string.Empty; // Stores serialized JSON of old/new values
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
