namespace Mojaz.Domain.Entities.Tracking;

using Base;

/// <summary>
/// Theory test results for driver license examination.
/// Tracks written/computer-based test performance.
/// </summary>
public class TheoryTest : BaseEntity
{
    /// <summary>
    /// ID of the application taking the test.
    /// </summary>
    public int ApplicationId { get; set; }

    /// <summary>
    /// ID of the appointment scheduled for this test.
    /// </summary>
    public int AppointmentId { get; set; }

    /// <summary>
    /// Test result (e.g., Pass, Fail).
    /// </summary>
    public string Result { get; set; }

    /// <summary>
    /// Test score (e.g., 85/100).
    /// </summary>
    public decimal Score { get; set; }

    /// <summary>
    /// Total possible score.
    /// </summary>
    public decimal TotalScore { get; set; }

    /// <summary>
    /// Timestamp when the test was taken.
    /// </summary>
    public DateTime TestedAt { get; set; }
}
