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
                new SystemSetting { Id = 1, SettingKey = "OTP_VALIDITY_MINUTES_SMS", SettingValue = "5", Category = "OTP", Description = "OTP validity in minutes for SMS", IsEncrypted = false },
                new SystemSetting { Id = 2, SettingKey = "OTP_VALIDITY_MINUTES_EMAIL", SettingValue = "15", Category = "OTP", Description = "OTP validity in minutes for Email", IsEncrypted = false },
                new SystemSetting { Id = 3, SettingKey = "OTP_MAX_ATTEMPTS", SettingValue = "3", Category = "OTP", Description = "Max OTP verification attempts", IsEncrypted = false },
                new SystemSetting { Id = 4, SettingKey = "OTP_RESEND_COOLDOWN_SECONDS", SettingValue = "60", Category = "OTP", Description = "Cooldown in seconds before resending OTP", IsEncrypted = false },
                new SystemSetting { Id = 5, SettingKey = "OTP_MAX_RESEND_PER_HOUR", SettingValue = "3", Category = "OTP", Description = "Max OTP resends per hour", IsEncrypted = false }
            );

            // Email SystemSettings seed data
            builder.HasData(
                new SystemSetting { Id = 11, SettingKey = "EMAIL_DEDUP_WINDOW_SECONDS", SettingValue = "300", Category = "Email", Description = "Deduplication window in seconds for outgoing emails", IsEncrypted = false },
                new SystemSetting { Id = 12, SettingKey = "EMAIL_MAX_RETRIES", SettingValue = "3", Category = "Email", Description = "Maximum retry attempts for failed emails", IsEncrypted = false },
                new SystemSetting { Id = 13, SettingKey = "EMAIL_RETRY_BASE_DELAY_SECONDS", SettingValue = "60", Category = "Email", Description = "Base delay in seconds for email retry exponential backoff", IsEncrypted = false }
            );

            // Appointment SystemSettings seed data
            builder.HasData(
                new SystemSetting { Id = 21, SettingKey = "MAX_RESCHEDULE_COUNT", SettingValue = "3", Category = "Appointment", Description = "Maximum number of times an applicant can reschedule an appointment", IsEncrypted = false },
                new SystemSetting { Id = 22, SettingKey = "DEFAULT_APPOINTMENT_DURATION_MINUTES", SettingValue = "30", Category = "Appointment", Description = "Default duration of an appointment slot in minutes", IsEncrypted = false },
                new SystemSetting { Id = 23, SettingKey = "MAX_APPOINTMENTS_PER_SLOT", SettingValue = "2", Category = "Appointment", Description = "Maximum number of appointments allowed per time slot per branch", IsEncrypted = false },
                new SystemSetting { Id = 24, SettingKey = "SLOT_BUFFER_MINUTES", SettingValue = "15", Category = "Appointment", Description = "Buffer time between appointments in minutes", IsEncrypted = false },
                new SystemSetting { Id = 25, SettingKey = "WORKING_HOURS_START", SettingValue = "08:00", Category = "Appointment", Description = "Start of working hours for appointments (24-hour format)", IsEncrypted = false },
                new SystemSetting { Id = 26, SettingKey = "WORKING_HOURS_END", SettingValue = "16:00", Category = "Appointment", Description = "End of working hours for appointments (24-hour format)", IsEncrypted = false },
                new SystemSetting { Id = 27, SettingKey = "REMINDER_HOURS_BEFORE", SettingValue = "24", Category = "Appointment", Description = "Hours before appointment to send reminder notification", IsEncrypted = false },
                new SystemSetting { Id = 28, SettingKey = "MIN_BOOKING_DAYS_AHEAD", SettingValue = "1", Category = "Appointment", Description = "Minimum days in advance an appointment must be booked", IsEncrypted = false },
                new SystemSetting { Id = 29, SettingKey = "MAX_BOOKING_DAYS_AHEAD", SettingValue = "30", Category = "Appointment", Description = "Maximum days in advance an appointment can be booked", IsEncrypted = false }
            );

             // Training SystemSettings seed data
             builder.HasData(
                 new SystemSetting { Id = 31, SettingKey = "MIN_TRAINING_HOURS_CATEGORY_A", SettingValue = "8", Category = "Training", Description = "Minimum training hours for Category A (Motorcycle)", IsEncrypted = false },
                 new SystemSetting { Id = 32, SettingKey = "MIN_TRAINING_HOURS_CATEGORY_B", SettingValue = "20", Category = "Training", Description = "Minimum training hours for Category B (Private)", IsEncrypted = false },
                 new SystemSetting { Id = 33, SettingKey = "MIN_TRAINING_HOURS_CATEGORY_C", SettingValue = "30", Category = "Training", Description = "Minimum training hours for Category C (Public Transport)", IsEncrypted = false },
                 new SystemSetting { Id = 34, SettingKey = "MIN_TRAINING_HOURS_CATEGORY_D", SettingValue = "40", Category = "Training", Description = "Minimum training hours for Category D (Heavy Vehicles)", IsEncrypted = false },
                 new SystemSetting { Id = 35, SettingKey = "MIN_TRAINING_HOURS_CATEGORY_E", SettingValue = "40", Category = "Training", Description = "Minimum training hours for Category E (Industrial)", IsEncrypted = false },
                 new SystemSetting { Id = 36, SettingKey = "MIN_TRAINING_HOURS_CATEGORY_F", SettingValue = "20", Category = "Training", Description = "Minimum training hours for Category F (Agricultural)", IsEncrypted = false },
                 new SystemSetting { Id = 37, SettingKey = "MIN_AGE_CATEGORY_F", SettingValue = "18", Category = "Training", Description = "Minimum age for Category F (Agricultural)", IsEncrypted = false }
             );

             // Theory Test SystemSettings seed data
             builder.HasData(
                 new SystemSetting { Id = 41, SettingKey = "MIN_PASS_SCORE_THEORY", SettingValue = "80", Category = "Theory", Description = "Minimum passing score for theory test", IsEncrypted = false },
                 new SystemSetting { Id = 42, SettingKey = "THEORY_QUESTIONS_CATEGORY_F", SettingValue = "20", Category = "Theory", Description = "Number of theory test questions for Category F (Agricultural)", IsEncrypted = false }
             );

             // Practical Test SystemSettings seed data
             builder.HasData(
                 new SystemSetting { Id = 51, SettingKey = "MIN_PASS_SCORE_PRACTICAL", SettingValue = "80", Category = "Practical", Description = "Minimum passing score for practical test", IsEncrypted = false },
                 new SystemSetting { Id = 52, SettingKey = "MAX_PRACTICAL_ATTEMPTS", SettingValue = "3", Category = "Practical", Description = "Maximum number of practical test attempts", IsEncrypted = false },
                 new SystemSetting { Id = 53, SettingKey = "COOLING_PERIOD_DAYS_PRACTICAL", SettingValue = "7", Category = "Practical", Description = "Days applicant must wait before rebooking after practical test failure", IsEncrypted = false }
             );
             
             // License validity SystemSettings seed data
             builder.HasData(
                 new SystemSetting { Id = 61, SettingKey = "VALIDITY_YEARS_CATEGORY_F", SettingValue = "10", Category = "License", Description = "License validity in years for Category F (Agricultural)", IsEncrypted = false }
             );

             // Category Upgrade SystemSettings seed data
             builder.HasData(
                 new SystemSetting { Id = 71, SettingKey = "MIN_HOLDING_PERIOD_UPGRADE_MONTHS", SettingValue = "12", Category = "Upgrade", Description = "Minimum months a license must be held before upgrading", IsEncrypted = false },
                 new SystemSetting { Id = 72, SettingKey = "ALLOWED_UPGRADE_PATHS", SettingValue = "B-C,B-D,B-E,C-D,C-E,D-E,F-B", Category = "Upgrade", Description = "Allowed category upgrade paths (Format: FROM-TO, separated by comma)", IsEncrypted = false },
                 new SystemSetting { Id = 73, SettingKey = "UPGRADE_TRAINING_REDUCTION_PCNT", SettingValue = "50", Category = "Upgrade", Description = "Percentage reduction in training hours for category upgrades", IsEncrypted = false }
             );

             // Security Hardening seed data
             builder.HasData(
                 new SystemSetting { Id = 81, SettingKey = "SECURITY_LOG_RETENTION_DAYS", SettingValue = "90", Category = "Security", Description = "Retention period for Audit Logs in days", IsEncrypted = false },
                 new SystemSetting { Id = 82, SettingKey = "RATE_LIMIT_AUTH_PERMIT", SettingValue = "10", Category = "Security", Description = "Number of permits for authentication endpoints per window", IsEncrypted = false },
                 new SystemSetting { Id = 83, SettingKey = "RATE_LIMIT_AUTH_WINDOW", SettingValue = "60", Category = "Security", Description = "Time window in seconds for authentication rate limiting", IsEncrypted = false },
                 new SystemSetting { Id = 84, SettingKey = "RATE_LIMIT_GLOBAL_PERMIT", SettingValue = "100", Category = "Security", Description = "Number of permits for global API endpoints per window", IsEncrypted = false },
                 new SystemSetting { Id = 85, SettingKey = "RATE_LIMIT_GLOBAL_WINDOW", SettingValue = "60", Category = "Security", Description = "Time window in seconds for global rate limiting", IsEncrypted = false },
                 new SystemSetting { Id = 86, SettingKey = "MAX_FILE_SIZE_BYTES", SettingValue = "5242880", Category = "Security", Description = "Maximum allowed file size for uploads in bytes (Default 5MB)", IsEncrypted = false },
                 new SystemSetting { Id = 87, SettingKey = "SECURITY_ALERT_THRESHOLD", SettingValue = "5", Category = "Security", Description = "Number of failed login attempts before sending security alert", IsEncrypted = false },
                 new SystemSetting { Id = 88, SettingKey = "SECURITY_ALERT_WINDOW_MINS", SettingValue = "10", Category = "Security", Description = "Time window in minutes for security alert threshold", IsEncrypted = false }
             );
        }
    }
}