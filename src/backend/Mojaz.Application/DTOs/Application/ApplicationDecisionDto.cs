using Mojaz.Domain.Enums;

namespace Mojaz.Application.DTOs.Application;

public class ApplicationDecisionDto
{
    public Guid ApplicationId { get; set; }
    public string ApplicationNumber { get; set; } = string.Empty;
    public ApplicationStatus NewStatus { get; set; }
    public FinalDecisionType Decision { get; set; }
    public DateTime DecisionAt { get; set; }
    public string DecisionBy { get; set; } = string.Empty;
    public Gate4ValidationResultDto Gate4Result { get; set; } = null!;
}