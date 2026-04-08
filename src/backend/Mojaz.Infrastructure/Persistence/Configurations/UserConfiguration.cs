using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users", t =>
            {
                t.HasCheckConstraint("CK_Users_Contact", "(Email IS NOT NULL OR PhoneNumber IS NOT NULL)");
            });
            builder.HasKey(u => u.Id);
            builder.HasIndex(u => u.Email).IsUnique().HasDatabaseName("IX_Users_Email");
            builder.HasIndex(u => u.NationalId).IsUnique().HasDatabaseName("IX_Users_NationalId");
            builder.HasIndex(u => u.PhoneNumber).IsUnique().HasDatabaseName("IX_Users_PhoneNumber");
            builder.Property(u => u.FullNameAr).HasMaxLength(100);
            builder.Property(u => u.FullNameEn).HasMaxLength(100);
            builder.Property(u => u.Email).HasMaxLength(100);
            builder.Property(u => u.NationalId).HasMaxLength(20);
            builder.Property(u => u.PhoneNumber).HasMaxLength(20);
            builder.Property(u => u.PasswordHash).HasMaxLength(256);
            builder.Property(u => u.Address).HasMaxLength(200);
            builder.Property(u => u.City).HasMaxLength(50);
            builder.Property(u => u.Region).HasMaxLength(50);
            builder.Property(u => u.BloodType).HasMaxLength(5);
            builder.Property(u => u.Nationality).HasMaxLength(50);
            builder.Property(u => u.ApplicantType).HasMaxLength(30);
            builder.Property(u => u.PreferredLanguage).HasMaxLength(10);
            builder.Property(u => u.NotificationPreferences).HasMaxLength(200);
            builder.Property(u => u.EnableEmail).HasDefaultValue(true);
            builder.Property(u => u.EnableSms).HasDefaultValue(true);
            builder.Property(u => u.EnablePush).HasDefaultValue(true);
            builder.Property(u => u.RegistrationMethod).HasMaxLength(20);
            builder.HasQueryFilter(u => !u.IsDeleted);
            // Contact constraint: at least one of Email or PhoneNumber must be present
        }
    }
}
