using Mojaz.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace Mojaz.Application.DTOs.Medical;

public class CreateMedicalResultRequest
{
    [Required]
    public Guid ApplicationId { get; set; }

    [Required]
    public Guid AppointmentId { get; set; }

    [Required]
    public MedicalFitnessResult Result { get; set; }

    public string? BloodType { get; set; }

    public string? Notes { get; set; }
    
    // Optional clinical data
    public string? VisionTestResult { get; set; }
    public string? ColorBlindTestResult { get; set; }
    public bool? BloodPressureNormal { get; set; }
}
