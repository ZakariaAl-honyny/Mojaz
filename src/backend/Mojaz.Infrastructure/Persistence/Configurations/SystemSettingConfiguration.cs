using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class SystemSettingConfiguration : IEntityTypeConfiguration<SystemSetting>
    {
        public void Configure(EntityTypeBuilder<SystemSetting> builder)
        {
            builder.ToTable("SystemSettings");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.SettingKey).IsRequired().HasMaxLength(64);
            builder.Property(x => x.SettingValue).IsRequired().HasMaxLength(256);
            builder.Property(x => x.Category).HasMaxLength(32);
            builder.Property(x => x.Description).HasMaxLength(256);
            builder.Property(x => x.IsEncrypted).IsRequired();
            builder.HasIndex(x => x.SettingKey).IsUnique();
            builder.HasIndex(x => x.Category);
        }
    }
}