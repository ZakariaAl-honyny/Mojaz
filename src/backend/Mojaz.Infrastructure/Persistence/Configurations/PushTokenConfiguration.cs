using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class PushTokenConfiguration : IEntityTypeConfiguration<PushToken>
    {
        public void Configure(EntityTypeBuilder<PushToken> builder)
        {
            builder.ToTable("PushTokens");

            builder.HasKey(pt => pt.Id);

            builder.Property(pt => pt.UserId)
                .IsRequired();

            builder.Property(pt => pt.Token)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(pt => pt.DeviceType)
                .HasMaxLength(50);

            builder.Property(pt => pt.LastUsedAt);

            builder.Property(pt => pt.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            // Indexes
            builder.HasIndex(pt => pt.UserId);
            builder.HasIndex(pt => pt.Token)
                .IsUnique();

            // Relationships
            builder.HasOne(pt => pt.User)
                .WithMany()
                .HasForeignKey(pt => pt.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}