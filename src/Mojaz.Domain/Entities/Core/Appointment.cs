namespace Mojaz.Domain.Entities.Core;

using Base;

/// <summary>
/// Scheduled appointment for tests, exams, or interviews.
/// Manages appointment booking and status tracking.
/// </summary>
public class Appointment : BaseEntity
{
    /// <summary>
    /// ID of the application associated with this appointment.
    /// </summary>
    public int ApplicationId { get; set; }

    /// <summary>
    /// ID of the applicant attending the appointment.
    /// </summary>
    public int ApplicantId { get; set; }

    /// <summary>
    /// Type of appointment (e.g., Theory Test, Practical Test, Medical Exam).
    /// </summary>
    public string AppointmentType { get; set; }

    /// <summary>
    /// Scheduled date and time of the appointment.
    /// </summary>
    public DateTime ScheduledAt { get; set; }

    /// <summary>
    /// Current status (e.g., Scheduled, Confirmed, Completed, Cancelled, NoShow).
    /// </summary>
    public string Status { get; set; }

    /// <summary>
    /// ID of the employee assigned to conduct this appointment.
    /// </summary>
    public int? AssignedEmployeeId { get; set; }
}
