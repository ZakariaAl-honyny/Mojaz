using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using System;

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

            // OTP SystemSettings seed data
            builder.HasData(
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000001001"), SettingKey = "OTP_VALIDITY_MINUTES_SMS", SettingValue = "5", Category = "OTP", Description = "OTP validity in minutes for SMS", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000001002"), SettingKey = "OTP_VALIDITY_MINUTES_EMAIL", SettingValue = "10", Category = "OTP", Description = "OTP validity in minutes for Email", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000001003"), SettingKey = "OTP_MAX_ATTEMPTS", SettingValue = "3", Category = "OTP", Description = "Max OTP verification attempts", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000001004"), SettingKey = "OTP_RESEND_COOLDOWN_SECONDS", SettingValue = "60", Category = "OTP", Description = "Cooldown in seconds before resending OTP", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000001005"), SettingKey = "OTP_MAX_RESEND_PER_HOUR", SettingValue = "3", Category = "OTP", Description = "Max OTP resends per hour", IsEncrypted = false }
            );

            // Email SystemSettings seed data
            builder.HasData(
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000007001"), SettingKey = "EMAIL_DEDUP_WINDOW_SECONDS", SettingValue = "300", Category = "Email", Description = "Deduplication window in seconds for outgoing emails", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000007002"), SettingKey = "EMAIL_MAX_RETRIES", SettingValue = "3", Category = "Email", Description = "Maximum retry attempts for failed emails", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000007003"), SettingKey = "EMAIL_RETRY_BASE_DELAY_SECONDS", SettingValue = "60", Category = "Email", Description = "Base delay in seconds for email retry exponential backoff", IsEncrypted = false }
            );
        }
    }
}