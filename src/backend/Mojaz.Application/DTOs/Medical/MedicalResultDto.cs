using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Application.DTOs.Medical;

public class MedicalResultDto
{
    public Guid Id { get; set; }
    public Guid ApplicationId { get; set; }
    public Guid DoctorId { get; set; }
    public DateTime ExaminedAt { get; set; }
    public MedicalFitnessResult FitnessResult { get; set; }
    public string? BloodType { get; set; }
    public string? Notes { get; set; }
    public string? ReportReference { get; set; }
    public DateTime? ValidUntil { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Additional fields mapped from clinical notes or similar if needed
    public string? VisionTestResult { get; set; }
    public string? ColorBlindTestResult { get; set; }
    public bool? BloodPressureNormal { get; set; }
}
