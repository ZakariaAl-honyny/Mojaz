using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class OtpCodeConfiguration : IEntityTypeConfiguration<OtpCode>
    {
        public void Configure(EntityTypeBuilder<OtpCode> builder)
        {
            builder.ToTable("OtpCodes");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.CodeHash).IsRequired().HasMaxLength(128);
            builder.Property(x => x.Destination).IsRequired().HasMaxLength(128);
            builder.Property(x => x.DestinationType)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(16);
            builder.Property(x => x.Purpose)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(32);
            builder.Property(x => x.IpAddress).HasMaxLength(64);
            builder.Property(x => x.AttemptCount).IsRequired();
            builder.Property(x => x.MaxAttempts).IsRequired();
            builder.HasIndex(x => x.UserId);
            builder.HasIndex(x => x.Destination);
            builder.HasIndex(x => x.Purpose);
            builder.HasIndex(x => x.ExpiresAt);
        }
    }
}