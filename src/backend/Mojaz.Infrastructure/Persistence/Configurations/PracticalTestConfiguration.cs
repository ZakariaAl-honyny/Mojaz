using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class PracticalTestConfiguration : IEntityTypeConfiguration<PracticalTest>
    {
        public void Configure(EntityTypeBuilder<PracticalTest> builder)
        {
            builder.ToTable("PracticalTests");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.ApplicationId).IsRequired();
            builder.Property(x => x.ExaminerId).IsRequired();
            builder.Property(x => x.AttemptNumber).IsRequired();
            builder.Property(x => x.TestDate).IsRequired();
            builder.Property(x => x.Result)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(16);
            builder.Property(x => x.Notes).HasMaxLength(512);
            builder.Property(x => x.VehicleUsed).HasMaxLength(128);
            builder.Property(x => x.RequiresAdditionalTraining).IsRequired();
            builder.Property(x => x.AdditionalHoursRequired).IsRequired(false);
            builder.HasIndex(x => x.ApplicationId);
            builder.HasIndex(x => x.ExaminerId);
            builder.HasIndex(x => x.Result);
        }
    }
}