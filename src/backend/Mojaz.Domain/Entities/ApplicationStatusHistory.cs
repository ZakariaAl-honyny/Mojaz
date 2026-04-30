using Mojaz.Domain.Enums;

namespace Mojaz.Domain.Entities;

public class ApplicationStatusHistory : BaseEntity
{
    public int ApplicationId { get; set; }
    public ApplicationStatus FromStatus { get; set; }
    public ApplicationStatus ToStatus { get; set; }
    public int ChangedBy { get; set; }
    public string? Notes { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    public virtual Application Application { get; set; } = null!;
}