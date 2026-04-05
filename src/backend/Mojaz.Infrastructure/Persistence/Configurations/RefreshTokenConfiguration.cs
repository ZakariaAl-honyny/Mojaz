using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
    {
        public void Configure(EntityTypeBuilder<RefreshToken> builder)
        {
            builder.ToTable("RefreshTokens");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Token).IsRequired().HasMaxLength(256);
            builder.Property(x => x.CreatedByIp).HasMaxLength(64);
            builder.Property(x => x.ReplacedByToken).HasMaxLength(256);
            builder.Property(x => x.IsRevoked).IsRequired();
            builder.HasIndex(x => x.UserId);
            builder.HasIndex(x => x.Token).IsUnique();
            builder.HasIndex(x => x.ExpiresAt);
        }
    }
}