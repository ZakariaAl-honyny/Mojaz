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
            builder.Property(x => x.ConductedAt).IsRequired();
            builder.Property(x => x.Score).IsRequired(false);
            builder.Property(x => x.PassingScore).IsRequired();
            builder.Property(x => x.IsAbsent).IsRequired();
            builder.Property(x => x.Result)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(16);
            builder.Property(x => x.Notes).HasMaxLength(1000);
            builder.Property(x => x.VehicleUsed).HasMaxLength(200);
            builder.Property(x => x.RequiresAdditionalTraining).IsRequired();
            builder.Property(x => x.AdditionalHoursRequired).IsRequired(false);
            builder.HasIndex(x => x.ApplicationId);
            builder.HasIndex(x => x.ExaminerId);
            builder.HasQueryFilter(x => !x.IsDeleted);

            builder.HasOne(pt => pt.Application)
                .WithMany(a => a.PracticalTests)
                .HasForeignKey(pt => pt.ApplicationId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(pt => pt.Examiner)
                .WithMany()
                .HasForeignKey(pt => pt.ExaminerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}