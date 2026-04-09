using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;

namespace Mojaz.Infrastructure.Persistence.Configurations
{
    public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.ToTable("Appointments");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.AppointmentType)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(32);
            builder.Property(x => x.ScheduledDate).IsRequired();
            builder.Property(x => x.TimeSlot).IsRequired().HasMaxLength(16);
            builder.Property(x => x.BranchId);
            builder.Property(x => x.AssignedStaffId);
            builder.Property(x => x.Status).IsRequired().HasMaxLength(32);
            builder.Property(x => x.Notes).HasMaxLength(256);
            builder.Property(x => x.CancelledAt);
            builder.Property(x => x.CancellationReason).HasMaxLength(128);
            builder.Property(x => x.RescheduleCount).HasDefaultValue(0);
            builder.Property(x => x.ReminderSent).HasDefaultValue(false);
            
            // Concurrency token for optimistic concurrency
            builder.Property(x => x.RowVersion)
                .IsRowVersion();
            
            builder.HasIndex(x => x.ApplicationId);
            builder.HasIndex(x => x.AppointmentType);
            builder.HasIndex(x => x.Status);
            builder.HasIndex(x => x.ScheduledDate);
            builder.HasIndex(x => x.BranchId);
            builder.HasIndex(x => x.RescheduleCount);
            
            builder.HasQueryFilter(x => !x.IsDeleted);
            
            // Configure relationship with Application
            builder.HasOne(x => x.Application)
                .WithMany()
                .HasForeignKey(x => x.ApplicationId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}