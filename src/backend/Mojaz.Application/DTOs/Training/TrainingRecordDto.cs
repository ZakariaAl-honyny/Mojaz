using Mojaz.Domain.Enums;
using System;

namespace Mojaz.Application.DTOs.Training
{
    public class TrainingRecordDto
    {
        public Guid Id { get; set; }
        public Guid ApplicationId { get; set; }
        public string SchoolName { get; set; } = string.Empty;
        public string? CertificateNumber { get; set; }
        public int CompletedHours { get; set; }
        public int TotalHoursRequired { get; set; }
        public int ProgressPercentage => TotalHoursRequired > 0 
            ? Math.Min(100, (int)((double)CompletedHours / TotalHoursRequired * 100)) 
            : 0;
        public TrainingStatus TrainingStatus { get; set; }
        public bool IsExempted { get; set; }
        public string? ExemptionReason { get; set; }
        public Guid? ExemptionDocumentId { get; set; }
        public Guid? ExemptionApprovedBy { get; set; }
        public DateTime? ExemptionApprovedAt { get; set; }
        public string? ExemptionRejectionReason { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? TrainingDate { get; set; }
        public string? TrainerName { get; set; }
        public string? CenterName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? CreatedBy { get; set; }
    }
}