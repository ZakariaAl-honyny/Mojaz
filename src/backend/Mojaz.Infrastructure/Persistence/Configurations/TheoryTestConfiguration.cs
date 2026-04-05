using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class TheoryTestConfiguration : IEntityTypeConfiguration<TheoryTest>
    {
        public void Configure(EntityTypeBuilder<TheoryTest> builder)
        {
            builder.ToTable("TheoryTests");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.ApplicationId).IsRequired();
            builder.Property(x => x.ExaminerId).IsRequired();
            builder.Property(x => x.AttemptNumber).IsRequired();
            builder.Property(x => x.TestDate).IsRequired();
            builder.Property(x => x.Score).IsRequired();
            builder.Property(x => x.PassingScore).IsRequired();
            builder.Property(x => x.Result)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(16);
            builder.Property(x => x.Notes).HasMaxLength(512);
            builder.HasIndex(x => x.ApplicationId);
            builder.HasIndex(x => x.ExaminerId);
            builder.HasIndex(x => x.Result);
            builder.HasQueryFilter(x => !x.IsDeleted);
        }
    }
}