using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class MedicalExaminationConfiguration : IEntityTypeConfiguration<MedicalExamination>
    {
        public void Configure(EntityTypeBuilder<MedicalExamination> builder)
        {
            builder.ToTable("MedicalExaminations");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.ApplicationId).IsRequired();
            builder.Property(x => x.DoctorId).IsRequired();
            builder.Property(x => x.ExaminedAt).IsRequired();
            builder.Property(x => x.FitnessResult)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(32);
            builder.Property(x => x.BloodType).HasMaxLength(8);
            builder.Property(x => x.Notes).HasMaxLength(512);
            builder.Property(x => x.ReportReference).HasMaxLength(128);
            builder.Property(x => x.ValidUntil);
            builder.Property(x => x.CertificatePath).HasMaxLength(256);
            builder.HasIndex(x => x.ApplicationId);
            builder.HasIndex(x => x.DoctorId);
            builder.HasIndex(x => x.FitnessResult);
            builder.HasQueryFilter(x => !x.IsDeleted);
        }
    }
}