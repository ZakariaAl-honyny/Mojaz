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
                 new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000009006"), SettingKey = "MIN_TRAINING_HOURS_CATEGORY_F", SettingValue = "20", Category = "Training", Description = "Minimum training hours for Category F (Agricultural)", IsEncrypted = false },

                 // Age requirement SystemSettings seed data
                 new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000009007"), SettingKey = "MIN_AGE_CATEGORY_F", SettingValue = "18", Category = "Training", Description = "Minimum age for Category F (Agricultural)", IsEncrypted = false },

                 // Theory Test SystemSettings seed data
                 new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000010002"), SettingKey = "THEORY_QUESTIONS_CATEGORY_F", SettingValue = "20", Category = "Theory", Description = "Number of theory test questions for Category F (Agricultural)", IsEncrypted = false },

                 // Validity years SystemSettings seed data
                 new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000011004"), SettingKey = "VALIDITY_YEARS_CATEGORY_F", SettingValue = "10", Category = "License", Description = "License validity in years for Category F (Agricultural)", IsEncrypted = false },

                 // Theory Test SystemSettings seed data
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000010001"), SettingKey = "MIN_PASS_SCORE_THEORY", SettingValue = "80", Category = "Theory", Description = "Minimum passing score for theory test", IsEncrypted = false },

                // Practical Test SystemSettings seed data
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000011001"), SettingKey = "MIN_PASS_SCORE_PRACTICAL", SettingValue = "80", Category = "Practical", Description = "Minimum passing score for practical test", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000011002"), SettingKey = "MAX_PRACTICAL_ATTEMPTS", SettingValue = "3", Category = "Practical", Description = "Maximum number of practical test attempts", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000011003"), SettingKey = "COOLING_PERIOD_DAYS_PRACTICAL", SettingValue = "7", Category = "Practical", Description = "Days applicant must wait before rebooking after practical test failure", IsEncrypted = false },
                
                // Category Upgrade SystemSettings seed data
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000012001"), SettingKey = "MIN_HOLDING_PERIOD_UPGRADE_MONTHS", SettingValue = "12", Category = "Upgrade", Description = "Minimum months a license must be held before upgrading", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000012002"), SettingKey = "ALLOWED_UPGRADE_PATHS", SettingValue = "B-C,C-D,D-E,F-B", Category = "Upgrade", Description = "Allowed category upgrade paths (Format: FROM-TO, separated by comma)", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000012003"), SettingKey = "UPGRADE_TRAINING_REDUCTION_PCNT", SettingValue = "50", Category = "Upgrade", Description = "Percentage reduction in training hours for category upgrades", IsEncrypted = false },

                // Security Hardening seed data
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000013001"), SettingKey = "SECURITY_LOG_RETENTION_DAYS", SettingValue = "90", Category = "Security", Description = "Retention period for Audit Logs in days", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000013002"), SettingKey = "RATE_LIMIT_AUTH_PERMIT", SettingValue = "10", Category = "Security", Description = "Number of permits for authentication endpoints per window", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000013003"), SettingKey = "RATE_LIMIT_AUTH_WINDOW", SettingValue = "60", Category = "Security", Description = "Time window in seconds for authentication rate limiting", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000013004"), SettingKey = "RATE_LIMIT_GLOBAL_PERMIT", SettingValue = "100", Category = "Security", Description = "Number of permits for global API endpoints per window", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000013005"), SettingKey = "RATE_LIMIT_GLOBAL_WINDOW", SettingValue = "60", Category = "Security", Description = "Time window in seconds for global rate limiting", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000013006"), SettingKey = "MAX_FILE_SIZE_BYTES", SettingValue = "5242880", Category = "Security", Description = "Maximum allowed file size for uploads in bytes (Default 5MB)", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000013007"), SettingKey = "SECURITY_ALERT_THRESHOLD", SettingValue = "5", Category = "Security", Description = "Number of failed login attempts before sending security alert", IsEncrypted = false },
                new SystemSetting { Id = Guid.Parse("00000000-0000-0000-0000-000000013008"), SettingKey = "SECURITY_ALERT_WINDOW_MINS", SettingValue = "10", Category = "Security", Description = "Time window in minutes for security alert threshold", IsEncrypted = false }
            );
        }
    }
}