using Mojaz.Domain.Common;
using System;

namespace Mojaz.Domain.Entities;

public class PushToken : SoftDeletableEntity
{
    public Guid UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public string DeviceType { get; set; } = string.Empty;
    public DateTime? LastUsedAt { get; set; }
    public bool IsActive { get; set; } = true;
    
    public virtual User User { get; set; } = null!;
}
