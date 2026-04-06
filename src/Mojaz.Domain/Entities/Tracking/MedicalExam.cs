namespace Mojaz.Domain.Entities.Tracking;

using Base;

/// <summary>
/// Medical examination results for applicants.
/// Records health assessments required for licensing.
/// </summary>
public class MedicalExam : BaseEntity
{
    /// <summary>
    /// ID of the application this medical exam is for.
    /// </summary>
    public int ApplicationId { get; set; }

    /// <summary>
    /// ID of the appointment scheduled for this exam.
    /// </summary>
    public int AppointmentId { get; set; }

    /// <summary>
    /// Overall result of the medical examination (e.g., Pass, Fail).
    /// </summary>
    public string Result { get; set; }

    /// <summary>
    /// Vision test result.
    /// </summary>
    public string VisionTest { get; set; }

    /// <summary>
    /// Name of the doctor who conducted the exam.
    /// </summary>
    public string DoctorName { get; set; }

    /// <summary>
    /// Timestamp when the examination was conducted.
    /// </summary>
    public DateTime ExaminedAt { get; set; }
}
