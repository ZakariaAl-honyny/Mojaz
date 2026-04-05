using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class LicenseReplacementConfiguration : IEntityTypeConfiguration<LicenseReplacement>
    {
        public void Configure(EntityTypeBuilder<LicenseReplacement> builder)
        {
            builder.ToTable("LicenseReplacements");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.LicenseId).IsRequired();
            builder.Property(x => x.ApplicationId).IsRequired();
            builder.Property(x => x.Reason).HasMaxLength(256);
            builder.Property(x => x.ProcessedAt).IsRequired();
            builder.Property(x => x.ProcessedBy).IsRequired(false);

            builder.HasIndex(x => x.LicenseId);
            builder.HasIndex(x => x.ApplicationId);
            builder.HasIndex(x => x.ProcessedAt);
        }
    }
}