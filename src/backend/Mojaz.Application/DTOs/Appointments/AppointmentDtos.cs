using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Application.DTOs.Appointments;

public class AppointmentDto
{
    public int Id { get; set; }
    public int ApplicationId { get; set; }
    public AppointmentType AppointmentType { get; set; }
    public DateOnly ScheduledDate { get; set; }
    public string TimeSlot { get; set; } = string.Empty;
    public int? BranchId { get; set; }
    public string? BranchName { get; set; }
    public int? AssignedStaffId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public string? CancellationReason { get; set; }
    public int RescheduleCount { get; set; }
    public bool ReminderSent { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class AvailableSlotDto
{
    public DateOnly Date { get; set; }
    public string Time { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public int AvailableCapacity { get; set; }
    public bool IsAvailable { get; set; }
}

public class DaySlotsDto
{
    public DateOnly Date { get; set; }
    public List<AvailableSlotDto> Slots { get; set; } = new();
}

public class CreateAppointmentRequest
{
    public int ApplicationId { get; set; }
    public AppointmentType Type { get; set; }
    public int BranchId { get; set; }
    public DateOnly ScheduledDate { get; set; }
    public string TimeSlot { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class RescheduleAppointmentRequest
{
    public DateOnly NewScheduledDate { get; set; }
    public string NewTimeSlot { get; set; } = string.Empty;
    public int? NewBranchId { get; set; }
}

public class CancelAppointmentRequest
{
    public string Reason { get; set; } = string.Empty;
}

public class AppointmentResponse
{
    public int Id { get; set; }
    public DateOnly ScheduledDate { get; set; }
    public string TimeSlot { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class AppointmentValidationResult
{
    public bool IsValid { get; set; }
    public List<string> Errors { get; set; } = new();
}