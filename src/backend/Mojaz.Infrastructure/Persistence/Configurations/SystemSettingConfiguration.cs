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

            // Appointment SystemSettings seed data
            builder.HasData(
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000008001"), SettingKey = "MAX_RESCHEDULE_COUNT", SettingValue = "3", Category = "Appointment", Description = "Maximum number of times an applicant can reschedule an appointment", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000008002"), SettingKey = "DEFAULT_APPOINTMENT_DURATION_MINUTES", SettingValue = "30", Category = "Appointment", Description = "Default duration of an appointment slot in minutes", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000008003"), SettingKey = "MAX_APPOINTMENTS_PER_SLOT", SettingValue = "2", Category = "Appointment", Description = "Maximum number of appointments allowed per time slot per branch", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000008004"), SettingKey = "SLOT_BUFFER_MINUTES", SettingValue = "15", Category = "Appointment", Description = "Buffer time between appointments in minutes", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000008005"), SettingKey = "WORKING_HOURS_START", SettingValue = "08:00", Category = "Appointment", Description = "Start of working hours for appointments (24-hour format)", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000008006"), SettingKey = "WORKING_HOURS_END", SettingValue = "16:00", Category = "Appointment", Description = "End of working hours for appointments (24-hour format)", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000008007"), SettingKey = "REMINDER_HOURS_BEFORE", SettingValue = "24", Category = "Appointment", Description = "Hours before appointment to send reminder notification", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000008008"), SettingKey = "MIN_BOOKING_DAYS_AHEAD", SettingValue = "1", Category = "Appointment", Description = "Minimum days in advance an appointment must be booked", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000008009"), SettingKey = "MAX_BOOKING_DAYS_AHEAD", SettingValue = "30", Category = "Appointment", Description = "Maximum days in advance an appointment can be booked", IsEncrypted = false },

                // Training SystemSettings seed data
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000009001"), SettingKey = "MIN_TRAINING_HOURS_CATEGORY_A", SettingValue = "8", Category = "Training", Description = "Minimum training hours for Category A (Motorcycle)", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000009002"), SettingKey = "MIN_TRAINING_HOURS_CATEGORY_B", SettingValue = "20", Category = "Training", Description = "Minimum training hours for Category B (Private)", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000009003"), SettingKey = "MIN_TRAINING_HOURS_CATEGORY_C", SettingValue = "30", Category = "Training", Description = "Minimum training hours for Category C (Public Transport)", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000009004"), SettingKey = "MIN_TRAINING_HOURS_CATEGORY_D", SettingValue = "40", Category = "Training", Description = "Minimum training hours for Category D (Heavy Vehicles)", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000009005"), SettingKey = "MIN_TRAINING_HOURS_CATEGORY_E", SettingValue = "40", Category = "Training", Description = "Minimum training hours for Category E (Industrial)", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000009006"), SettingKey = "MIN_TRAINING_HOURS_CATEGORY_F", SettingValue = "20", Category = "Training", Description = "Minimum training hours for Category F (Special Needs)", IsEncrypted = false },

                // Theory Test SystemSettings seed data
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000010001"), SettingKey = "MIN_PASS_SCORE_THEORY", SettingValue = "80", Category = "Theory", Description = "Minimum passing score for theory test", IsEncrypted = false }
            );
        }
    }
}