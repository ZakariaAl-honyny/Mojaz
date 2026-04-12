using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class PaymentTransactionConfiguration : IEntityTypeConfiguration<PaymentTransaction>
    {
        public void Configure(EntityTypeBuilder<PaymentTransaction> builder)
        {
            builder.ToTable("PaymentTransactions");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.ApplicationId).IsRequired();
            builder.Property(x => x.FeeType)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50);
            builder.Property(x => x.Amount).IsRequired().HasColumnType("decimal(18,2)");
            builder.Property(x => x.Currency).IsRequired().HasMaxLength(10);
            builder.Property(x => x.Status)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(20);
            builder.Property(x => x.PaymentMethod).HasMaxLength(100);
            builder.Property(x => x.TransactionReference).HasMaxLength(100);
            builder.Property(x => x.PaidAt).IsRequired(false);
            builder.Property(x => x.FailedAt).IsRequired(false);
            builder.Property(x => x.FailureReason).HasMaxLength(500);
            builder.Property(x => x.ReceiptPath).HasMaxLength(500);

            builder.HasIndex(x => x.ApplicationId);
            builder.HasIndex(x => x.TransactionReference).IsUnique();
            builder.HasIndex(x => x.Status);

            builder.HasQueryFilter(x => !x.IsDeleted);
        }
    }
}