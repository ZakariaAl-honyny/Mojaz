using System;

namespace Mojaz.Application.DTOs.Training
{
    public class CreateTrainingRecordRequest
    {
        public Guid ApplicationId { get; set; }
        public string SchoolName { get; set; } = string.Empty;
        public string? CertificateNumber { get; set; }
        public int HoursCompleted { get; set; }
        public DateTime TrainingDate { get; set; }
        public string? TrainerName { get; set; }
        public string? CenterName { get; set; }
        public string? Notes { get; set; }
    }
}