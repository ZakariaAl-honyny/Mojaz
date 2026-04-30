namespace Mojaz.Domain.Entities;

public class LicenseRenewal : AuditableEntity
{
    public int LicenseId { get; set; }
    public int ApplicationId { get; set; }
    public DateTime RenewedAt { get; set; } = DateTime.UtcNow;
    public DateTime NewExpiresAt { get; set; }
    public int? ProcessedBy { get; set; }

    public virtual License License { get; set; } = null!;
    public virtual Application Application { get; set; } = null!;
}