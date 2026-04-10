using System;
using System.ComponentModel.DataAnnotations;

namespace Mojaz.Application.DTOs.Practical;

/// <summary>
/// Request DTO for submitting practical test results
/// </summary>
public class SubmitPracticalResultRequest
{
    /// <summary>
    /// The score achieved (0-100). Required if not absent.
    /// </summary>
    [Range(0, 100)]
    public int? Score { get; set; }

    /// <summary>
    /// Indicates if the applicant was absent for the test
    /// </summary>
    public bool IsAbsent { get; set; } = false;

    /// <summary>
    /// Indicates if additional training is required after this test
    /// </summary>
    public bool RequiresAdditionalTraining { get; set; } = false;

    /// <summary>
    /// Number of additional training hours required (if RequiresAdditionalTraining = true)
    /// </summary>
    [Range(1, int.MaxValue)]
    public int? AdditionalHoursRequired { get; set; }

    /// <summary>
    /// Description of the vehicle used for the test
    /// </summary>
    [MaxLength(200)]
    public string? VehicleUsed { get; set; }

    /// <summary>
    /// Examiner notes about the test
    /// </summary>
    [MaxLength(1000)]
    public string? Notes { get; set; }
}