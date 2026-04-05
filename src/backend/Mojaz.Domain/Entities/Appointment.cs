using Mojaz.Domain.Common;
using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Domain.Entities;

public class Appointment : SoftDeletableEntity
{
    public Guid ApplicationId { get; set; }
    public AppointmentType AppointmentType { get; set; }
    public DateOnly ScheduledDate { get; set; }
    public string TimeSlot { get; set; } = string.Empty;
    public Guid? BranchId { get; set; }
    public Guid? AssignedStaffId { get; set; }
    public string Status { get; set; } = "Scheduled"; // Scheduled|Completed|Cancelled|NoShow
    public string? Notes { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? CancellationReason { get; set; }

    public virtual Application Application { get; set; } = null!;
}
