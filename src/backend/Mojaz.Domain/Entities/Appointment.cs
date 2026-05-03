using Mojaz.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Mojaz.Domain.Entities;

public class Appointment : SoftDeletableEntity
{
    public int ApplicationId { get; set; }
    public AppointmentType AppointmentType { get; set; }
    public DateOnly ScheduledDate { get; set; }
    public string TimeSlot { get; set; } = string.Empty;
    public int? BranchId { get; set; }
    public int? AssignedStaffId { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
    public string? Notes { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? CancellationReason { get; set; }
    public TimeOnly? CheckInTime { get; set; }
    public int RescheduleCount { get; set; }
    public bool ReminderSent { get; set; }
    
    [Timestamp]
    public byte[]? RowVersion { get; set; }

    public virtual Application Application { get; set; } = null!;

    // Navigation to branch and assigned staff (optional)
    public virtual Branch? Branch { get; set; }
    public virtual User? AssignedStaff { get; set; }
}