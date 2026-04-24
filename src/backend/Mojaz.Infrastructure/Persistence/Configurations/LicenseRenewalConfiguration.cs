using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using DomainApplication = Mojaz.Domain.Entities.Application;

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

            builder.HasOne(x => x.License).WithMany().HasForeignKey("LicenseId").OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.Application).WithMany().HasForeignKey("ApplicationId").OnDelete(DeleteBehavior.Restrict);
            builder.Property(x => x.RenewedAt).IsRequired();
            builder.Property(x => x.NewExpiresAt).IsRequired();
            builder.Property(x => x.ProcessedBy).IsRequired(false);

            builder.HasIndex(x => x.LicenseId);
            builder.HasIndex(x => x.ApplicationId);
            builder.HasIndex(x => x.RenewedAt);
        }
    }
}