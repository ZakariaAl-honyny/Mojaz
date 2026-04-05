using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class ApplicationStatusHistoryConfiguration : IEntityTypeConfiguration<ApplicationStatusHistory>
    {
        public void Configure(EntityTypeBuilder<ApplicationStatusHistory> builder)
        {
            builder.ToTable("ApplicationStatusHistories");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.FromStatus)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(32);
            builder.Property(x => x.ToStatus)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(32);
            builder.Property(x => x.ChangedBy).IsRequired();
            builder.Property(x => x.Notes).HasMaxLength(256);
            builder.Property(x => x.ChangedAt).IsRequired();
            builder.HasIndex(x => x.ApplicationId);
            builder.HasIndex(x => x.ChangedAt);
        }
    }
}