namespace Mojaz.Domain.Entities.Tracking;

using Base;

/// <summary>
/// Training record for driver training courses.
/// Tracks completion of required training programs.
/// </summary>
public class TrainingRecord : BaseEntity
{
    /// <summary>
    /// ID of the application undergoing training.
    /// </summary>
    public int ApplicationId { get; set; }

    /// <summary>
    /// Type or name of the training program.
    /// </summary>
    public string TrainingType { get; set; }

    /// <summary>
    /// Name of the training provider/instructor.
    /// </summary>
    public string ProviderName { get; set; }

    /// <summary>
    /// Training start date.
    /// </summary>
    public DateTime StartDate { get; set; }

    /// <summary>
    /// Training end date or completion date.
    /// </summary>
    public DateTime? EndDate { get; set; }

    /// <summary>
    /// Hours of training completed.
    /// </summary>
    public int TrainingHours { get; set; }

    /// <summary>
    /// Training completion status (e.g., InProgress, Completed, Failed).
    /// </summary>
    public string Status { get; set; }
}
