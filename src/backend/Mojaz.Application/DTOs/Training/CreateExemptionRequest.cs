using System;

namespace Mojaz.Application.DTOs.Training
{
    public class CreateExemptionRequest
    {
        public Guid ApplicationId { get; set; }
        public string ExemptionReason { get; set; } = string.Empty;
        public Guid ExemptionDocumentId { get; set; }
    }
}