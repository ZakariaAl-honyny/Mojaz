using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class LicenseRenewalConfiguration : IEntityTypeConfiguration<LicenseRenewal>
    {
        public void Configure(EntityTypeBuilder<LicenseRenewal> builder)
        {
            builder.ToTable("LicenseRenewals");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.LicenseId).IsRequired();
            builder.Property(x => x.ApplicationId).IsRequired();
            builder.Property(x => x.RenewedAt).IsRequired();
            builder.Property(x => x.NewExpiresAt).IsRequired();
            builder.Property(x => x.ProcessedBy).IsRequired(false);

            builder.HasIndex(x => x.LicenseId);
            builder.HasIndex(x => x.ApplicationId);
            builder.HasIndex(x => x.RenewedAt);
        }
    }
}