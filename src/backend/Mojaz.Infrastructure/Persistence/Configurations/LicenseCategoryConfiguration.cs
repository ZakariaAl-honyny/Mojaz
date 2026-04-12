using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class LicenseCategoryConfiguration : IEntityTypeConfiguration<LicenseCategory>
    {
        public void Configure(EntityTypeBuilder<LicenseCategory> builder)
        {
            builder.ToTable("LicenseCategories");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Code)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(2);
            builder.Property(x => x.NameAr).IsRequired().HasMaxLength(64);
            builder.Property(x => x.NameEn).IsRequired().HasMaxLength(64);
            builder.Property(x => x.MinimumAge).IsRequired();
            builder.Property(x => x.RequiresTraining).IsRequired();
            builder.Property(x => x.IsActive).IsRequired();
            builder.HasIndex(x => x.Code).IsUnique();
            builder.HasIndex(x => x.IsActive);

            // Seed data for license categories
            builder.HasData(
                new LicenseCategory { Id = Guid.Parse("00000000-0000-0000-0000-000000000001"), Code = LicenseCategoryCode.A, NameAr = "دراجة نارية", NameEn = "Motorcycle", MinimumAge = 16, RequiresTraining = true, IsActive = true },
                new LicenseCategory { Id = Guid.Parse("00000000-0000-0000-0000-000000000002"), Code = LicenseCategoryCode.B, NameAr = "خصوصي", NameEn = "Private", MinimumAge = 18, RequiresTraining = true, IsActive = true },
                new LicenseCategory { Id = Guid.Parse("00000000-0000-0000-0000-000000000003"), Code = LicenseCategoryCode.C, NameAr = "نقل عام", NameEn = "Public Transport", MinimumAge = 21, RequiresTraining = true, IsActive = true },
                new LicenseCategory { Id = Guid.Parse("00000000-0000-0000-0000-000000000004"), Code = LicenseCategoryCode.D, NameAr = "مركبات ثقيلة", NameEn = "Heavy Vehicles", MinimumAge = 21, RequiresTraining = true, IsActive = true },
                new LicenseCategory { Id = Guid.Parse("00000000-0000-0000-0000-000000000005"), Code = LicenseCategoryCode.E, NameAr = "مركبات صناعية", NameEn = "Industrial Vehicles", MinimumAge = 21, RequiresTraining = true, IsActive = true },
                new LicenseCategory { Id = Guid.Parse("00000000-0000-0000-0000-000000000006"), Code = LicenseCategoryCode.F, NameAr = "مركبات زراعية", NameEn = "Agricultural Vehicles", MinimumAge = 18, RequiresTraining = true, IsActive = true }
            );
        }
    }
}