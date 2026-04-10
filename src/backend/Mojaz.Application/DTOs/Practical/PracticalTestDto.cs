using System;

namespace Mojaz.Application.DTOs.Practical;

/// <summary>
/// Response DTO for practical test data
/// </summary>
public class PracticalTestDto
{
    /// <summary>
    /// Unique identifier of the practical test
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Identifier of the associated application
    /// </summary>
    public Guid ApplicationId { get; set; }

    /// <summary>
    /// The attempt number for this test
    /// </summary>
    public int AttemptNumber { get; set; }

    /// <summary>
    /// The score achieved (0-100). Null if absent.
    /// </summary>
    public int? Score { get; set; }

    /// <summary>
    /// The passing score required for this test
    /// </summary>
    public int PassingScore { get; set; }

    /// <summary>
    /// The result of the test as a string
    /// </summary>
    public string Result { get; set; } = string.Empty;

    /// <summary>
    /// Indicates if the test was passed
    /// </summary>
    public bool IsPassed { get; set; }

    /// <summary>
    /// Indicates if the applicant was absent for the test
    /// </summary>
    public bool IsAbsent { get; set; }

    /// <summary>
    /// Indicates if additional training is required after this test
    /// </summary>
    public bool RequiresAdditionalTraining { get; set; }

    /// <summary>
    /// Number of additional training hours required (if RequiresAdditionalTraining = true)
    /// </summary>
    public int? AdditionalHoursRequired { get; set; }

    /// <summary>
    /// Description of the vehicle used for the test
    /// </summary>
    public string? VehicleUsed { get; set; }

    /// <summary>
    /// Date and time when the test was conducted (UTC)
    /// </summary>
    public DateTime ConductedAt { get; set; }

    /// <summary>
    /// Identifier of the examiner who conducted the test
    /// </summary>
    public Guid ExaminerId { get; set; }

    /// <summary>
    /// Name of the examiner who conducted the test
    /// </summary>
    public string? ExaminerName { get; set; }

    /// <summary>
    /// Examiner notes about the test
    /// </string>
    public string? Notes { get; set; }

    /// <summary>
    /// Date and time when the applicant can retake the test (if failed)
    /// Null if passed
    /// </summary>
    public DateTime? RetakeEligibleAfter { get; set; }

    /// <summary>
    /// Snapshot of the application status after this test result
    /// </summary>
    public string ApplicationStatus { get; set; } = string.Empty;
}