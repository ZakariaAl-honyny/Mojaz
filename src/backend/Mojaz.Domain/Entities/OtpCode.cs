using Mojaz.Domain.Common;
using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Domain.Entities;

public class OtpCode : BaseEntity
{
    public Guid UserId { get; set; }
    public string Destination { get; set; } = string.Empty;
    public DestinationType DestinationType { get; set; }
    public string CodeHash { get; set; } = string.Empty;
    public OtpPurpose Purpose { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; }
    public DateTime? UsedAt { get; set; }
    public bool IsInvalidated { get; set; }
    public int AttemptCount { get; set; }
    public int MaxAttempts { get; set; }
    public string? IpAddress { get; set; }
}
