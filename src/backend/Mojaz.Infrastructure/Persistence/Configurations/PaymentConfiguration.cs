using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.ToTable("Payments");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.ApplicationId).IsRequired();
            builder.Property(x => x.FeeType)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(32);
            builder.Property(x => x.Amount).IsRequired().HasColumnType("decimal(18,2)");
            builder.Property(x => x.Currency).IsRequired().HasMaxLength(8);
            builder.Property(x => x.Status)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(16);
            builder.Property(x => x.PaymentMethod).HasMaxLength(64);
            builder.Property(x => x.TransactionReference).HasMaxLength(128);
            builder.Property(x => x.PaidAt).IsRequired(false);
            builder.Property(x => x.FailedAt).IsRequired(false);
            builder.Property(x => x.FailureReason).HasMaxLength(256);
            builder.Property(x => x.ReceiptPath).HasMaxLength(256);
            builder.HasIndex(x => x.ApplicationId);
            builder.HasIndex(x => x.FeeType);
            builder.HasIndex(x => x.Status);
            builder.HasQueryFilter(x => !x.IsDeleted);
        }
    }
}