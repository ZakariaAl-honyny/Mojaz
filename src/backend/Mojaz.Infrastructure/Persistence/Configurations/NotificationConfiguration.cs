using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.ToTable("Notifications");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.UserId).IsRequired();
            builder.Property(x => x.ApplicationId).IsRequired(false);
            builder.Property(x => x.EventType)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(64);

            builder.Property(x => x.TitleAr).IsRequired().HasMaxLength(256);
            builder.Property(x => x.TitleEn).IsRequired().HasMaxLength(256);
            builder.Property(x => x.MessageAr).IsRequired().HasMaxLength(1024);
            builder.Property(x => x.MessageEn).IsRequired().HasMaxLength(1024);

            builder.Property(x => x.IsRead).IsRequired();
            builder.Property(x => x.ReadAt).IsRequired(false);
            builder.Property(x => x.SentAt).IsRequired();

            builder.Property(x => x.RelatedEntityId).IsRequired(false);
            builder.Property(x => x.RelatedEntityType).HasMaxLength(128).IsRequired(false);

            builder.HasIndex(x => x.UserId).HasDatabaseName("IX_Notifications_UserId");
            builder.HasIndex(x => x.ApplicationId).HasDatabaseName("IX_Notifications_ApplicationId");
            builder.HasIndex(x => x.EventType).HasDatabaseName("IX_Notifications_EventType");
            builder.HasIndex(x => x.SentAt).HasDatabaseName("IX_Notifications_SentAt");
        }
    }
}