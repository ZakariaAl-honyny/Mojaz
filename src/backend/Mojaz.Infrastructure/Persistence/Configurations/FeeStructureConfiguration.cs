using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using System;

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
            builder.Property(x => x.LicenseCategoryId).IsRequired(false);
            builder.Property(x => x.Amount).IsRequired().HasColumnType("decimal(18,2)");
            builder.Property(x => x.Currency).IsRequired().HasMaxLength(8);
            builder.Property(x => x.EffectiveFrom).IsRequired();
            builder.Property(x => x.EffectiveTo);
            builder.Property(x => x.IsActive).IsRequired();
            builder.HasIndex(x => new { x.FeeType, x.LicenseCategoryId, x.IsActive });

            // Seed data for license replacement fee
            builder.HasData(
                new FeeStructure 
                { 
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000100"), 
                    FeeType = FeeType.ReplacementFee, 
                    Amount = 100.00m, 
                    Currency = "SAR", 
                    EffectiveFrom = new DateTime(2026, 1, 1), 
                    IsActive = true 
                },
                new FeeStructure 
                { 
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000101"), 
                    FeeType = FeeType.CategoryUpgrade, 
                    Amount = 250.00m, 
                    Currency = "SAR", 
                    EffectiveFrom = new DateTime(2026, 1, 1), 
                    IsActive = true 
                }
            );
        }
    }
}