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
        }
    }
}