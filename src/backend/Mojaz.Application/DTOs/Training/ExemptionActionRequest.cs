using System;

namespace DrivingLicenseIssuanceSystem.Application.DTOs.Training
{
    public class ExemptionActionRequest
    {
        public Guid ActionBy { get; set; }
        public string Notes { get; set; } = string.Empty;
    }
}