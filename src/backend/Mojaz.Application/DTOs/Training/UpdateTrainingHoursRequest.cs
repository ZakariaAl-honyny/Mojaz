using System;

namespace DrivingLicenseIssuanceSystem.Application.DTOs.Training
{
    public class UpdateTrainingHoursRequest
    {
        public int HoursToAdd { get; set; }
        public string? Notes { get; set; }
    }
}