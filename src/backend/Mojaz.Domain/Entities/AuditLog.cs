using System;

namespace Mojaz.Domain.Entities;

public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? UserId { get; set; }
    public string ActionType { get; set; } = string.Empty;
    public string ActionCategory { get; set; } = string.Empty; // e.g., "Authentication", "DataAccess"
    public string EntityName { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string Payload { get; set; } = string.Empty; // Stores serialized JSON of old/new values
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public bool IsSuccess { get; set; } = true;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
