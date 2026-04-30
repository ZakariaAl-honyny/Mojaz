using System;

namespace Mojaz.Application.DTOs.Training
{
    public class CreateExemptionRequest
    {
        public int ApplicationId { get; set; }
        public string ExemptionReason { get; set; } = string.Empty;
        public int ExemptionDocumentId { get; set; }
    }
}