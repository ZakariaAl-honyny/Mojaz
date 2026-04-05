using Mojaz.Domain.Common;
using System;

namespace Mojaz.Domain.Entities;

public class PushToken : BaseEntity
{
    public Guid UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public string DeviceType { get; set; } = string.Empty; // Android|iOS|Web
    public bool IsRevoked { get; set; }
    
    public virtual User User { get; set; } = null!;
}
