using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class FeeStructureConfiguration : IEntityTypeConfiguration<FeeStructure>
    {
        public void Configure(EntityTypeBuilder<FeeStructure> builder)
        {
            builder.ToTable("FeeStructures");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.FeeType)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(32);
             builder.Property(x => x.LicenseCategoryId).IsRequired();
             builder.Property(x => x.Amount).IsRequired().HasColumnType("decimal(18,2)");

             builder.HasOne<LicenseCategory>().WithMany().HasForeignKey(x => x.LicenseCategoryId).OnDelete(DeleteBehavior.Restrict);
            builder.Property(x => x.Currency).IsRequired().HasMaxLength(8);
            builder.Property(x => x.EffectiveFrom).IsRequired();
            builder.Property(x => x.EffectiveTo);
            builder.Property(x => x.IsActive).IsRequired();
            builder.HasIndex(x => new { x.FeeType, x.LicenseCategoryId, x.IsActive });
        }
    }
}