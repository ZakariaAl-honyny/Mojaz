using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mojaz.Domain.Entities;

public class AuditLog
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    public int? UserId { get; set; }
    
    [MaxLength(50)]
    public string ActionType { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string ActionCategory { get; set; } = string.Empty; // e.g., "Authentication", "DataAccess"
    
    [MaxLength(100)]
    public string EntityName { get; set; } = string.Empty;
    
    [MaxLength(200)]
    public string EntityId { get; set; } = string.Empty;
    
    [MaxLength(4000)]
    public string Payload { get; set; } = string.Empty; // Stores serialized JSON of old/new values
    
    [MaxLength(50)]
    public string? IpAddress { get; set; }
    
    [MaxLength(500)]
    public string? UserAgent { get; set; }
    public bool IsSuccess { get; set; } = true;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}