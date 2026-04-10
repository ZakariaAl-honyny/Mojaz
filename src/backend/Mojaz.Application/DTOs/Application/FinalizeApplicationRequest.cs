using Mojaz.Domain.Enums;

namespace Mojaz.Application.DTOs.Application;

public class FinalizeApplicationRequest
{
    public FinalDecisionType Decision { get; set; }
    public string? Reason { get; set; }
    public string? ReturnToStage { get; set; }
    public string? ManagerNotes { get; set; }
}